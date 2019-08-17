let path = require('path');
let fs = require('fs');
let alfrescoApi = require('@alfresco/js-api');
let program = require('commander');
let ACTIVITI7_APPS = require('../../e2e/util/resources').ACTIVITI7_APPS;

let config = {};
let absentApps = [];
let pushFailedApps = [];
let notRunningApps = [];
let host;

let MAX_RETRY = 3;
let counter = 0;
let TIMEOUT = 1000;


async function main() {

    console.log('---START---');

    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host adf.lab.com ')
        .option('--oauth [type]', 'oauth host')
        .option('--client [type]', 'clientId ')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .parse(process.argv);

    config = {
        provider: 'BPM',
        hostBpm: `${program.host}`,
        authType: 'OAUTH',
        oauth2: {
            host: `${program.oauth}`,
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

    console.log('---Login---');

    try {
        this.alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility(config);
        await this.alfrescoJsApi.login(program.username, program.password);
    } catch (e) {
        console.log('Login error' + e);
    }

    console.log('---Login ok---');


    await deployAbsentApps(this.alfrescoJsApi);

    let pushFailed = await getPushFailedApps(this.alfrescoJsApi);

    if (pushFailed && pushFailed.length > 0) {
        await deleteStaleApps(this.alfrescoJsApi, pushFailed);
    }

    let notRunning = await getNotRunningApps(this.alfrescoJsApi);

    if (notRunning && notRunning.length > 0) {
        let notRunningAppAfterWait = await waitPossibleStaleApps(this.alfrescoJsApi, notRunning);

        await deleteStaleApps(this.alfrescoJsApi, notRunningAppAfterWait);

        await deployAbsentApps(this.alfrescoJsApi);
        let notRunningSecondAttempt = await getNotRunningApps(this.alfrescoJsApi);

        if (notRunningSecondAttempt && notRunningSecondAttempt.length > 0) {
            let notRunningAppAfterWaitSecondAttempt = await waitPossibleStaleApps(this.alfrescoJsApi, notRunningSecondAttempt);

            if (notRunningAppAfterWaitSecondAttempt && notRunningAppAfterWaitSecondAttempt.length > 0) {
                console.log(`Not possible to recover the following apps in the environment`);

                notRunningAppAfterWaitSecondAttempt.forEach((currentApp) => {
                    console.log(`App ${currentApp.entry.name } current status ${JSON.stringify(currentApp.entry.status)}`);
                });

                process.exit(1);
            }
        } else {
            console.log(`Activiti  7 all ok :)`);
        }
    } else {
        console.log(`Activiti 7 all ok :-)`);
    }
}

async function deleteStaleApps(alfrescoJsApi, notRunningAppAfterWait) {
    for (const currentApp of notRunningAppAfterWait) {
        await deleteApp(alfrescoJsApi, currentApp.entry.name);
    }
}

async function waitPossibleStaleApps(alfrescoJsApi, notRunning) {
    pushFailedApps = [];
    do {
        console.log(`Wait stale app  ${TIMEOUT}`);

        notRunning.forEach((currentApp) => {
            console.log(`${currentApp.entry.name } ${currentApp.entry.status}`);
        });

        sleep(TIMEOUT);
        counter++;

        let runningApps = await getDeployedApplicationsByStatus(alfrescoJsApi, 'RUNNING');

        notRunning.forEach((currentStaleApp) => {
            let nowIsRunning = runningApps.find((currentRunnignApp) => {
                return currentStaleApp.entry.name === currentRunnignApp.entry.name;
            });

            if (nowIsRunning) {
                console.log(`The ${currentApp.entry.name } is now running`);

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
            //console.log(currentApp.entry.name + '  ' +currentApp.entry.status);
            return ACTIVITI7_APPS[key].name === currentApp.entry.name && currentApp.entry.status !== 'Running';
        });

        if (isNotRunning && isNotRunning.entry.status !== 'ImagePushFailed') {
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

async function getPushFailedApps(alfrescoJsApi) {
    let allStatusApps = await getDeployedApplicationsByStatus(alfrescoJsApi, '');

    Object.keys(ACTIVITI7_APPS).forEach((key) => {
        let isNotRunning = allStatusApps.find((currentApp) => {
            //console.log(currentApp.entry.name + '  ' +currentApp.entry.status);
            return ACTIVITI7_APPS[key].name === currentApp.entry.name && currentApp.entry.status !== 'Running';
        });

        if (isNotRunning && isNotRunning.entry.status === 'ImagePushFailed') {
            pushFailedApps.push(isNotRunning);
        }
    });

    if (pushFailedApps.length > 0) {
        console.log(`The following apps are pushFailedApps:`);
        pushFailedApps.forEach((currentApp) => {
            console.log(`App ${currentApp.entry.name } current status ${JSON.stringify(currentApp.entry.status)}`);
        });

    }

    return pushFailedApps;
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
            console.log('Missing project, create the project for ' + currentAbsentApp.name);

            let uploadedApp = await importProjectApp(apiService, currentAbsentApp);

            console.log('Project uploaded ' + currentAbsentApp.name);

            if (uploadedApp) {
                await releaseApp(apiService, uploadedApp);
                await deployApp(apiService, uploadedApp, currentAbsentApp.name);
                sleep(120000);///wait to not fail
            }
        } else {
            console.log('Project for ' + currentAbsentApp.name + ' present');

            let appRelease = undefined;
            let appReleaseList = await getReleaseAppProjectId(apiService, app.entry.id);

            if (appReleaseList.list.entries.length === 0) {
                console.log('Needs to release');
                appRelease = await releaseApp(apiService, app);

            } else {
                console.log('Not Need to release' + JSON.stringify(appReleaseList));

                let currentReleaseVersion = -1;

                appReleaseList.list.entries.forEach((currentRelease) => {
                    if (currentRelease.entry.version > currentReleaseVersion) {
                        currentReleaseVersion = currentRelease.entry.version;
                        appRelease = currentRelease;
                    }
                });

            }

            console.log('App to deploy app release id ' + JSON.stringify(appRelease));

            await deployApp(apiService, appRelease, currentAbsentApp.name);
            sleep(120000);///wait to not fail
        }
    }
}

async function deployApp(apiService, app, name) {
    console.log(`Deploy app ${name}`);

    const url = `${config.hostBpm}/deployment-service/v1/applications`;

    const pathParams = {};
    const bodyParam = {
        "name": name,
        "releaseId": app.entry.id,
        "version": app.entry.name,
        "security": [{"role": "APS_ADMIN", "groups": [], "users": ["admin.adf"]}, {
            "role": "APS_USER",
            "groups": ["hr", "testgroup"],
            "users": ["admin.adf"]
        }]
    };

    const headerParams = {}, formParams = {}, queryParams = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
    } catch (error) {
        console.log(`Not possible to deploy the project ${name} status  :  ${JSON.stringify(error.status)}  ${JSON.stringify(error.response.text)}`);
        await deleteSiteByName(name);
        process.exit(1);
    }
}

async function importProjectApp(apiService, app) {
    const pathFile = path.join('./e2e/' + app.file_location);
    console.log(pathFile);
    const file = fs.createReadStream(pathFile);

    const url = `${config.hostBpm}/modeling-service/v1/projects/import`;

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {'file': file}, bodyParam = {},
        contentTypes = ['multipart/form-data'], accepts = ['application/json'];

    try {
        console.log('import app ' + app.file_location);
        return await apiService.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
    } catch (error) {
        if (error.status !== 409) {
            console.log(`Not possible to upload the project ${app.name} status  : ${JSON.stringify(error.status)}  ${JSON.stringify(error.response.text)}`);
            process.exit(1);
        } else {
            console.log(`Not possible to upload the project because inconsistency CS - Modelling try to delete manually the node`);
            await deleteSiteByName(app.name);
            await importProjectApp(apiService, app);
        }
    }
}

async function getReleaseAppProjectId(apiService, projectId) {
    const url = `${config.hostBpm}/modeling-service/v1/projects/${projectId}/releases`;

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
    const url = `${config.hostBpm}/modeling-service/v1/projects/${app.entry.id}/releases`;

    console.log(url);
    console.log('Release ID ' + app.entry.id);
    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
    } catch (error) {
        console.log(`Not possible to release the project ${app.entry.name} status  : $ \n ${JSON.stringify(error.status)}  \n ${JSON.stringify(error.response.text)}`);
        process.exit(1);
    }

}

async function getDeployedApplicationsByStatus(apiService, status) {
    const url = `${config.hostBpm}/deployment-service/v1/applications`;

    const pathParams = {}, queryParams = {status: status},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    let data;
    try {
        data = await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);

        return data.list.entries;
    } catch (error) {
        console.log(`Not possible get the applications from deployment-service ${JSON.stringify(error)} `);
        process.exit(1);
    }

}

async function getAppProjects(apiService, status) {
    const url = `${config.hostBpm}/modeling-service/v1/projects`;

    const pathParams = {}, queryParams = {status: status},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    let data;
    try {
        data = await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
        return data.list.entries;
    } catch (error) {
        console.log(`Not possible get the application from modeling-service ` + error);
        process.exit(1);
    }
}

async function deleteApp(apiService, appName) {
    console.log(`Delete the app  ${appName}`);

    const url = `${config.hostBpm}/deployment-service/v1/applications/${appName}`;

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
        console.log(`Not possible to delete the application from modeling-service` + error);
        process.exit(1);
    }
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay) ;
}

async function deleteChildrenNodeByName(alfrescoJsApi, nameNodeToDelete, nodeId) {
    let childrenNodes = await alfrescoJsApi.core.nodesApi.getNodeChildren(nodeId);

    let childrenToDelete = childrenNodes.list.entries.find((currentNode) => {
        return currentNode.entry.name === nameNodeToDelete;
    });

    console.log('childrenToDelete ' + childrenToDelete.entry.name);

    if (childrenToDelete) {
        await alfrescoJsApi.core.nodesApi.deleteNode(childrenToDelete.entry.id);
    }


}

async function deleteSiteByName(name) {

    console.log(`====== Delete Site ${name} ${program.host} ======`);

    let alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: `https://${program.host}`
    });

    await this.alfrescoJsApi.login(program.username, program.password);

    let listSites = [];

    try {
        listSites = await alfrescoJsApi.core.sitesApi.getSites();
    } catch (error) {
        console.log('error get list sites' + JSON.stringify(error));
        process.exit(1);
    }

    let apsModelingNodeId;
    let apsReleaseNodeId;

    if (listSites && listSites.list.entries.length > 0) {
        for (let i = 0; i < listSites.list.entries.length; i++) {
            if (listSites.list.entries[i].entry.id === name) {
                try {
                    await alfrescoJsApi.core.sitesApi.deleteSite(listSites.list.entries[i].entry.id, {options: {permanent: true}});
                } catch (error) {
                    console.log('error' + JSON.stringify(error));
                }
            }

            if (listSites.list.entries[i].entry.id === 'ApsModeling') {
                apsModelingNodeId = listSites.list.entries[i].entry.guid;
            }

            if (listSites.list.entries[i].entry.id === 'ApsRelease') {
                apsReleaseNodeId = listSites.list.entries[i].entry.guid;
            }
        }
    }

    console.log(`====== Delete Folder in apsModeling`);
    await deleteChildrenNodeByName(alfrescoJsApi, name, apsModelingNodeId);

    console.log(`====== Delete Folder in apsRelease`);
    await deleteChildrenNodeByName(alfrescoJsApi, name, apsReleaseNodeId);
}

main();
