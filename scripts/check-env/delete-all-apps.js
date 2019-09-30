let alfrescoApi = require('@alfresco/js-api');
let program = require('commander');
let ACTIVITI7_APPS = require('../../e2e/util/resources').ACTIVITI7_APPS;

let config = {};
let absentApps = [];
let notRunningApps = [];
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
        console.log('Login error' + e);
    }

    for (const key of Object.keys(ACTIVITI7_APPS)) {
        await deleteApp(alfrescoJsApi, ACTIVITI7_APPS[key].name);
    }

    let notRunning = await getNotRunningApps(this.alfrescoJsApi);

    if (notRunning && notRunning.length > 0) {
        console.log(JSON.stringify(notRunning));
    }
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
        console.log(`Not possible get the applications from alfresco-deployment-service ${JSON.stringify(error)} `);
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

        console.log(`App deleted`);
    } catch (error) {
        console.log(`Not possible to delete the application from alfresco-modeling-service` + error);
        process.exit(1);
    }
}

main();
