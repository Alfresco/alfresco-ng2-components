let alfrescoApi = require('@alfresco/js-api');
let program = require('commander');
let ACTIVITI7_APPS = require('../e2e/util/resources').ACTIVITI7_APPS;

let config = {};
let absentApps = [];

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

    try {
        this.alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility(config);
        await this.alfrescoJsApi.login(program.username, program.password);
    } catch (e) {
        console.log(e);
    }

    let appsDeployed = await getDeployedApplicationsByStatus(this.alfrescoJsApi, 'RUNNING');


    Object.keys(ACTIVITI7_APPS).forEach((key) => {
        let isPresent = appsDeployed.find((currentApp) => {
            return ACTIVITI7_APPS[key] === currentApp.entry.name;
        });

        if (!isPresent) {
            absentApps.push(ACTIVITI7_APPS[key]);
        }
    });

    if (absentApps.length > 0) {
        console.log(`The following apps are missing in the target env ${JSON.stringify(absentApps)}`)
        process.exit(1);
    }
}


async function getDeployedApplicationsByStatus(apiService, status) {
    const path = `${config.hostBpm}/alfresco-deployment-service/v1/applications`;

    const pathParams = {}, queryParams = {status: status},
        headerParams = {}, formParams = {}, bodyParam = {},
        contentTypes = ['application/json'], accepts = ['application/json'];


    let data = await apiService.oauth2Auth.callCustomApi(path, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam,
        contentTypes, accepts);

    return data.list.entries;
}

main();
