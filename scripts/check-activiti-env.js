let path = require('path');
let fs = require('fs');
let alfrescoApi = require('@alfresco/js-api');
let program = require('commander');
let ACTIVITI7_APPS = require('../e2e/util/resources').ACTIVITI7_APPS;

let config = {};
let absentApps = [];
let notRunningApps = [];
let host;

let MAX_RETRY = 3;
let counter = 0;
let TIMEOUT = 180000;


async function main() {

    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host adf.lab.com ')
        .option('--client [type]', 'clientId ')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .parse(process.argv);

    config = {
        provider: 'BPM',
        hostBpm: `http://${program.host}`,
        authType: 'OAUTH',
        oauth2: {
            host: `http://${program.host}/auth/realms/alfresco`,
            clientId: program.client,
            scope: 'openid',
            secret: '',
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/',
            redirectUriLogout: '/logout'
        }
    };

    host = program.host;

    try {
        this.alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility(config);
        await this.alfrescoJsApi.login(program.username, program.password);
    } catch (e) {
        console.log('Login error' + e);
    }

    await deployAbsentApps(this.alfrescoJsApi);
    let notRunning = await getNotRunningApps(this.alfrescoJsApi);

    if (notRunning && notRunning.length > 0) {
        let notRunningAppAfterWait = await waitPossibleStaleApps(this.alfrescoJsApi, notRunning);

        await deleteStaleApps(this.alfrescoJsApi, notRunningAppAfterWait);

        await deployAbsentApps(this.alfrescoJsApi);
        let notRunningSecondAttempt = await getNotRunningApps(this.alfrescoJsApi);

        if (notRunningSecondAttempt && notRunningSecondAttempt.length > 0) {
            let notRunningAppAfterWaitSecondAttempt = await waitPossibleStaleApps(this.alfrescoJsApi, notRunningSecondAttempt);

            if (notRunningAppAfterWaitSecondAttempt && notRunningAppAfterWaitSecondAttempt.legnth > 0) {
                console.log(`Not possible to recover the following apps in the environment`);

                notRunningAppAfterWaitSecondAttempt.forEach((currentApp) => {
                    console.log(`App ${currentApp.entry.name } current status ${JSON.stringify(currentApp.entry.status)}`);
                });

                process.exit(1);
            }
        }else{
            console.log(`Activiti 7 all ok :)`);
        }
    } else {
        console.log(`Activiti 7 all ok :)`);
    }
}

async function deleteStaleApps(alfrescoJsApi, notRunningAppAfterWait) {

    notRunningAppAfterWait.forEach(async (currentApp) => {
        await deleteApp(alfrescoJsApi, currentApp.entry.name);
    });

}

async function waitPossibleStaleApps(alfrescoJsApi, notRunning) {

    do {
        console.log(`Wait stale app  ${TIMEOUT}`);

        notRunning.forEach((currentApp) => {
            console.log(`${currentApp.entry.name }`);
        });


        sleep(TIMEOUT);
        counter++;

        let runningApps = await getDeployedApplicationsByStatus(alfrescoJsApi, 'RUNNING');

        notRunning.forEach((currentStaleApp) => {
            let nowIsRunning = runningApps.find((currentRunnignApp) => {
                return currentStaleApp.entry.name === currentRunnignApp.entry.name;
            });

            if (nowIsRunning) {
                notRunning = notRunning.filter((item) => {
                    return item.entry.name !== nowIsRunning.entry.name
                })
            }

        });
    } while (counter < MAX_RETRY && notRunning.length > 0);

    return notRunning;
}

async function getNotRunningApps(alfrescoJsApi) {
    let allStatusApps = await getDeployedApplicationsByStatus(alfrescoJsApi, '');

    Object.keys(ACTIVITI7_APPS).forEach((key) => {
        let isNotRunning = allStatusApps.find((currentApp) => {
            return ACTIVITI7_APPS[key].name === currentApp.entry.name && currentApp.entry.status !== 'Running';
        });

        if (isNotRunning) {
            notRunningApps.push(isNotRunning);
        }
    });

    if (notRunningApps.length > 0) {
        console.log(`The following apps are NOT running in the target env:`);
        notRunningApps.forEach((currentApp) => {
            console.log(`App ${currentApp.entry.name } current status ${JSON.stringify(currentApp.entry.status)}`);
        });

        await checkIfAppIsReleased(alfrescoJsApi, absentApps);
    }

    return notRunningApps;
}

async function deployAbsentApps(alfrescoJsApi) {

    let deployedApps = await getDeployedApplicationsByStatus(alfrescoJsApi, '');

    Object.keys(ACTIVITI7_APPS).forEach((key) => {
        let isPresent = deployedApps.find((currentApp) => {
            return ACTIVITI7_APPS[key].name === currentApp.entry.name;
        });

        if (!isPresent) {
            absentApps.push(ACTIVITI7_APPS[key]);
        }
    });

    if (absentApps.length > 0) {
        console.log(`The following apps are missing in the target env ${JSON.stringify(absentApps)}`);

        await checkIfAppIsReleased(alfrescoJsApi, absentApps);
    }
}


async function checkIfAppIsReleased(apiService, absentApps) {
    let listAppsInModeler = await getAppProjects(apiService);

    for (let i = 0; i < absentApps.length; i++) {
        let currentAbsentApp = absentApps[i];
        let app = listAppsInModeler.find((currentApp) => {
            return currentAbsentApp.name === currentApp.entry.name;
        });


        if (!app) {
            let uploadedApp = await importApp(apiService, currentAbsentApp);
            if (uploadedApp) {
                await releaseApp(apiService, uploadedApp);
                await deployApp(apiService, uploadedApp);
            }
        } else {
            let appRelease = undefined;
            let appReleaseList = await getReleaseAppyProjectId(apiService, app.entry.id);

            if (!appReleaseList) {
                appRelease = await releaseApp(apiService, app);
            } else {

                appRelease = appReleaseList.list.entries.find((currentRelease) => {
                    return currentRelease.entry.version === 'latest';
                });
            }

            console.log('App to deploy ' + appRelease.entry.projectName + ' app release id ' + JSON.stringify(appRelease.entry.id));

            await deployApp(apiService, appRelease);
        }
    }
}

async function deployApp(apiService, app) {
    const url = `${config.hostBpm}/alfresco-deployment-service/v1/applications`;

    const pathParams = {};
    const bodyParam = {
        "name": app.entry.projectName,
        "releaseId": app.entry.id,
        "version": app.entry.name,
        "security": [{"role": "APS_ADMIN", "groups": [], "users": ["admin.adf"]}, {
            "role": "APS_USER",
            "groups": [],
            "users": ["admin.adf"]
        }]
    };

    const headerParams = {}, formParams = {}, queryParams = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
    } catch (error) {
        console.log(`Not possible to deploy the project ${app.entry.projectName} status  : ${JSON.stringify(error.status)}  ${JSON.stringify(error)}`);
        process.exit(1);
    }
}

async function importApp(apiService, app) {
    const pathFile = path.join('./e2e/' + app.file_location);
    const file = fs.createReadStream(pathFile);

    const url = `${config.hostBpm}/alfresco-modeling-service/v1/projects/import`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {'file': file}, bodyParam = {},
        contentTypes = ['multipart/form-data'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
    } catch (error) {
        if (error.status !== 409) {
            console.log(`Not possible to upload the project ${app.name} status  : ${JSON.stringify(error.status)}  ${JSON.stringify(error.text)}`);
            process.exit(1);
        }
    }

}

async function getReleaseAppyProjectId(apiService, projectId) {
    const url = `${config.hostBpm}/alfresco-modeling-service/v1/projects/${projectId}/releases`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
    } catch (error) {
        console.log(`Not possible to get the release of the project ${projectId} ` + JSON.stringify(error));
        process.exit(1);
    }

}

async function releaseApp(apiService, app) {
    const url = `${config.hostBpm}/alfresco-modeling-service/v1/projects/${app.entry.id}/releases`;

    console.log('Release ID ' + app.entry.id);
    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
    } catch (error) {
        console.log(`Not possible to release the project ${app.entry.name} status  : ${JSON.stringify(error.status)}  ${JSON.stringify(error.text)}`);
        process.exit(1);
    }

}

async function getDeployedApplicationsByStatus(apiService, status) {
    const url = `${config.hostBpm}/alfresco-deployment-service/v1/applications`;

    const pathParams = {}, queryParams = {status: status},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    let data;
    try {
        data = await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

        return data.list.entries;
    } catch (error) {
        console.log(`Not possible get the applicationsfrom alfresco-deployment-service ${JSON.stringify(error)} `);
        process.exit(1);
    }

}

async function getAppProjects(apiService, status) {
    const url = `${config.hostBpm}/alfresco-modeling-service/v1/projects`;

    const pathParams = {}, queryParams = {status: status},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    let data;
    try {
        data = await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
        return data.list.entries;
    } catch (error) {
        console.log(`Not possible get the application from alfresco-modeling-service ` + error);
        process.exit(1);
    }
}

async function deleteApp(apiService, appName) {
    console.log(`Delete the app  ${appName}`);

    const url = `${config.hostBpm}/alfresco-deployment-service/v1/applications/${appName}`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        await apiService.oauth2Auth.callCustomApi(url, 'DELETE', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

        ///it needs time
        console.log(`Deleting apps stale wait 3 minutes`);
        sleep(180000);
        console.log(`App deleted`);
    } catch (error) {
        console.log(`Not possible to delete the application from alfresco-modeling-service` + error);
        process.exit(1);
    }
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay) ;
}

main();
