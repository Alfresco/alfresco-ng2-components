let path = require('path');
let fs = require('fs');
let alfrescoApi = require('@alfresco/js-api');
let program = require('commander');
let ACTIVITI7_APPS = require('../e2e/util/resources').ACTIVITI7_APPS;

let config = {};
let absentApps = [];
let host;

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
        console.log(e);
    }

    let appsDeployed = await getDeployedApplicationsByStatus(this.alfrescoJsApi, 'RUNNING');

    Object.keys(ACTIVITI7_APPS).forEach((key) => {
        let isPresent = appsDeployed.find((currentApp) => {
            return ACTIVITI7_APPS[key].name === currentApp.entry.name;
        });

        if (!isPresent) {
            absentApps.push(ACTIVITI7_APPS[key]);
        }
    });

    if (absentApps.length > 0) {
        console.log(`The following apps are missing in the target env ${JSON.stringify(absentApps)}`)

        await checkIfAppIsReleased(this.alfrescoJsApi, absentApps);

        process.exit(1);
    }
}

async function checkIfAppIsReleased(apiService, absentApps) {
    let listAppsInModeler = await getAppProjects(apiService);

    for (let i = 0; i < absentApps.length; i++) {
        let currentAbsentApp = absentApps[i];
        let isPresent = listAppsInModeler.find((currentApp) => {
            return currentAbsentApp.name === currentApp.entry.name;
        });

        if (!isPresent) {
            console.log(`uplodare ` + currentAbsentApp.name);
            let uploadedApp = await importApp(apiService, currentAbsentApp);
            if (uploadedApp) {
                await releaseApp(apiService, uploadedApp);
                await deployApp(apiService, uploadedApp);
            }
        }
    }
}

async function deployApp(apiService, app) {
    const url = `${config.hostBpm}/alfresco-deployment-service/v1/applications`;

    const pathParams = {},
        queryParams = {
            "name": "re",
            "releaseId": app.entry.id,
            "security": [{"role": "APS_ADMIN", "groups": [], "users": ["admin.adf"]}, {
                "role": "APS_USER",
                "groups": [],
                "users": ["admin.adf"]
            }]
        };

    const headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['multipart/form-data'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
    } catch (error) {
        console.log(`Not possible to deploy the project ${app.entry.name} ` + error);
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
        console.log(`Not possible to upload the project ${app.name} ` + error);
    }

}

async function releaseApp(apiService, app) {
    const url = `${config.hostBpm}alfresco-modeling-service/v1/projects/${app.entry.id}/releases`;
    console.log(url);

    const pathParams = {}, queryParams = {},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];

    try {
        return await apiService.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
            contentTypes, accepts);
    } catch (error) {
        console.log(`Not possible to release the project ${app.entry.name} ` + error);
    }

}

async function getDeployedApplicationsByStatus(apiService, status) {
    const url = `${config.hostBpm}/alfresco-deployment-service/v1/applications`;

    const pathParams = {}, queryParams = {status: status},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];


    let data = await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
        contentTypes, accepts);

    return data.list.entries;
}

async function getAppProjects(apiService, status) {
    const url = `${config.hostBpm}/alfresco-modeling-service/v1/projects`;

    const pathParams = {}, queryParams = {status: status},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];


    let data = await apiService.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
        contentTypes, accepts);
    return data.list.entries;
}

main();
