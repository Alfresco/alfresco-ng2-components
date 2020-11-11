let alfrescoApi = require('@alfresco/js-api');
let program = require('commander');
let moment = require ('moment');
let fs = require ('fs');
const path = require('path');
const { throwError } = require('rxjs');
const { AppDefinitionsApi, RuntimeAppDefinitionsApi } = require('@alfresco/js-api');
let MAX_RETRY = 10;
let counter = 0;
let TIMEOUT = 6000;
const intervalMinute = 30;
const TENANT_DEFAULT_ID = 1
const TENANT_DEFAULT_NAME = 'default'
const CONTENT_DEFAULT_NAME = 'adw-content'
const APS_DEFAULT_APP_NAME = 'e2e-Application'


async function main() {

    program
        .version('0.1.0')
        .option('--host [type]', 'Remote environment host')
        .option('-p, --password [type]', 'password ')
        .option('-u, --username [type]', 'username ')
        .option('--license [type]', 'APS license S3 path ')
        .parse(process.argv);

    await checkEnv();

    console.log(`***** Step 1 - Check License *****`);

    let licenceUploaded = false;
    const hasValidLicense = await hasLicense() ;
    let contentRepo;
    if (!hasValidLicense) {
        console.log(`Aps License missing`);
        const isLicenseFileDownloaded = await downloadLicenseFile(program.license);
        if (isLicenseFileDownloaded) {
            licenceUploaded = await updateLicense();
        }
    } else {
        licenceUploaded = true;
        console.log(`Aps License present`);
    }
    let tenantId;
    if (licenceUploaded) {
        console.log(`***** Step 2 - Check Tenant *****`);
        console.log(`is tenandId:${TENANT_DEFAULT_ID} with name:${TENANT_DEFAULT_NAME} present?`);
        try {
            const hasDefault = await hasDefaultTenant(TENANT_DEFAULT_ID, TENANT_DEFAULT_NAME);
            tenantId = TENANT_DEFAULT_ID;
            if (!hasDefault) {
                // the tenandId should be equal to TENANT_DEFAULT_ID if we choose 1 as id.
                tenantId = await createDefaultTenant(TENANT_DEFAULT_NAME);
            }
            console.log(`***** Step 3 - Add Content Repo *****`);
            const isContenPresent = await isContenRepoPresent(TENANT_DEFAULT_ID, CONTENT_DEFAULT_NAME);
            if (!isContenPresent) {
                console.log(`No content repo with name ${CONTENT_DEFAULT_NAME} found`);
                contentRepo = await addContentRepo(TENANT_DEFAULT_ID, CONTENT_DEFAULT_NAME)
            }
            console.log(`***** Step 4 - Create users *****`);
            const users = await getUserFromRealm();
            if (tenantId && users && users.length > 0) {
                for (let i = 0; i < users.length; i++) {
                    await createUsers(tenantId, users[i]);
                    console.log('Impersonate user: '+ users[i].username);
                    await this.alfrescoJsApiRepo.login(users[i].username, 'password');
                    await authorizeUserToContentRepo(users[i]);

                    const defaultUser = 'hruser';
                    if (users[i].username.includes(defaultUser)) {
                        console.log(`***** Step verify default app already imported for ${defaultUser} *****`);
                        const isDefaultAppDepl = await isDefaultAppDeployed();
                        if (isDefaultAppDepl != undefined && !isDefaultAppDepl) {
                            const appDefinition = await importPublishApp();
                            await deployApp(appDefinition.appDefinition.id);
                        } else {
                            console.log(`***** Default app already deployed *****`);
                        }
                    }

                }
            } else {
                console.log('Something went wrong. Was not able to create the users');
            }

        } catch (error) {
            console.log(`Aps something went wrong. Tenant id ${tenantId}`);
        }
    } else {
        console.log('APS licens error: check the configuration');
    }



}

async function checkEnv() {
    try {

        this.alfrescoJsApi = new alfrescoApi.AlfrescoApiCompatibility({
            provider: 'ALL',
            hostBpm: program.host,
            hostEcm: program.host,
            authType: 'OAUTH',
            oauth2: {
                host: `${program.host}/auth/realms/alfresco`,
                clientId: "alfresco",
                scope: "openid"
            }
        });
        this.alfrescoJsApiRepo = this.alfrescoJsApi;
        await this.alfrescoJsApi.login(program.username, program.password);
    } catch (e) {
        console.log('Login error environment down or inaccessible');
        counter++;
        if (MAX_RETRY === counter) {
            console.log('Give up');
            process.exit(1);
        } else {
            console.log(`Retry in 1 minute attempt N ${counter}`);
            sleep(TIMEOUT);
            checkEnv();
        }
    }
}

async function hasDefaultTenant(tenantId, tenantName) {
    let tenant;

    try {
        tenant = await alfrescoJsApi.activiti.adminTenantsApi.getTenant(tenantId);
    } catch (error) {
        console.log(`Aps: does not have tenant with id: ${tenantId}`);
        return false;
    }
    if (tenant.name === tenantName) {
        console.log(`Aps: has default tenantId: ${tenantId} and name ${tenantName}`);
        return true;
    } else {
        console.log(`Wrong configuration. Another tenant has been created with id ${tenant.id} and name ${tenant.name}`);
        throwError(`Wrong configuration. Another tenant has been created with id ${tenant.id} and name ${tenant.name}`);
    }
}

async function createDefaultTenant(tenantName) {
    let tenantPost = {
        'active': true,
        'maxUsers': 10000,
        'name' : tenantName
    };


    try {
        const tenant = await alfrescoJsApi.activiti.adminTenantsApi.createTenant(tenantPost);
        console.log(`APS: Tenant ${tenantName} created with id: ${tenant.id}`);
        return tenant.id;
    } catch (error) {
        console.log(`APS: not able to create the default tenant: ${JSON.parse(error.message)}` );
    }
}

async function createUsers(tenandId, user) {
    console.log(`Create user ${user.email} on tenant: ${tenandId}`);
    const passwordCamelCase = 'Password';
    const userJson = {
        'email': user.email,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'status': 'active',
        'type': 'enterprise',
        'password': passwordCamelCase,
        'tenantId': tenandId
    }

    try {
        const user = await alfrescoJsApi.activiti.adminUsersApi.createNewUser(userJson);
        console.log(`APS: User ${user.email} created with id: ${user.id}`);
        return user;
    } catch (error) {
        console.log(`APS: not able to create the default user: ${error.message}` );
    }
}

async function updateLicense() {
    const fileContent = fs.createReadStream(path.join(__dirname, "/activiti.lic"));

    try {
        const status = await alfrescoJsApi.oauth2Auth.callCustomApi(
            `${program.host}/activiti-app/app/rest/license`,
            'POST',
            {},
            {},
            {},
            { file: fileContent },
            {},
            ['multipart/form-data'],
            ['application/json']
        );
        console.log(`Aps License uploaded!`);
        return true;
    } catch (error) {
        console.log(`Aps License failed!` );
        return false;
    }
}

async function isDefaultAppDeployed() {
    console.log(`Verify ${APS_DEFAULT_APP_NAME} already deployed`);
    try {
        let runtimeAppDefinitionsApi = new RuntimeAppDefinitionsApi(alfrescoJsApiRepo);
        const availableApps = await runtimeAppDefinitionsApi.getAppDefinitions();
        const defaultApp = availableApps.data && availableApps.data.filter( app => app.name && app.name.includes(APS_DEFAULT_APP_NAME));
        return defaultApp && defaultApp.length > 0 ? true : false;
    } catch (error) {
        console.log(`Aps app failed to import/Publish!`);
    }
}

async function importPublishApp() {
    const appName = `${APS_DEFAULT_APP_NAME}.zip`;
    console.log(`Import app ${appName}`);
    const fileContent = fs.createReadStream(path.join(__dirname, `/${appName}`));

    try {
        let appdefinitionsApi = new AppDefinitionsApi(alfrescoJsApiRepo);
        const result = await appdefinitionsApi.importAndPublishApp(fileContent, {renewIdmEntries: true});
        console.log(`Aps app imported and published!`);
        return result;
    } catch (error) {
        console.log(`Aps app failed to import/Publish!`);
    }
}

async function deployApp(appDefinitioId) {
    console.log(`Deploy app with id ${appDefinitioId}`);
    const body = {
        appDefinitions: [{id: appDefinitioId}]
    }
    try {
        let runtimeAppDefinitionsApi = new RuntimeAppDefinitionsApi(alfrescoJsApiRepo);
        const availableDeployed = await runtimeAppDefinitionsApi.deployAppDefinitions(body);
        console.log(`Aps app deployed`);
    } catch (error) {
        console.log(`Aps app failed to deploy!`);
    }
}

async function hasLicense() {
    try {
        const license = await alfrescoJsApi.oauth2Auth.callCustomApi(
            `${program.host}/activiti-app/app/rest/license`,
            'GET',
            {},
            {},
            {},
            {},
            {},
            ['application/json'],
            ['application/json']
        );
        if (license && license.status === 'valid') {
            console.log(`Aps has a valid License!`);
            return true
        }
        console.log(`Aps does NOT have a valid License!`);
        return false
    } catch (error) {
        console.log(`Aps not able to check the license` );
    }
}

async function getUserFromRealm() {

    try {
        const users = await alfrescoJsApi.oauth2Auth.callCustomApi(
            `${program.host}/auth/admin/realms/alfresco/users`,
            'GET',
            {},
            {},
            {},
            {},
            {},
            ['application/json'],
            ['application/json']
        );
        let usersExample = users.filter(user => user.email.includes('@example.com'));
        let usersWithoutAdmin = usersExample.filter(user => (user.username !== program.username && user.username !== "client"));
        console.log(`Keycloak found ${usersWithoutAdmin.length} users`);
        return usersWithoutAdmin;
    } catch (error) {
        console.log(`APS: not able to fetch user: ${error.message}` );
    }
}

async function isContenRepoPresent(tenantId, contentName) {

    try {
        const contentRepos = await alfrescoJsApi.oauth2Auth.callCustomApi(
            `${program.host}/activiti-app/app/rest/integration/alfresco?tenantId=${tenantId}`,
            'GET',
            {},
            {},
            {},
            {},
            {},
            ['application/json'],
            ['application/json']
        );
        return contentRepos.data.find(repo => repo.name === contentName) ? true : false;
    } catch (error) {
        console.log(`APS: not able to create content: ${error.message}` );
    }
}

async function addContentRepo(tenantId, name) {
    console.log(`Create Content with name ${name} `);
    const body = {
        alfrescoTenantId: '',
        authenticationType: "sso",
        name: name,
        repositoryUrl: `${program.host}/alfresco`,
        shareUrl: `${program.host}/share`,
        sitesFolder: '',
        tenantId: tenantId,
        version: "6.1.1"
    }
    try {
        const content = await alfrescoJsApi.oauth2Auth.callCustomApi(
            `${program.host}/activiti-app/app/rest/integration/alfresco`,
            'POST',
            {},
            {},
            {},
            {},
            body,
            ['application/json'],
            ['application/json']
        );
        console.log(`Content created!`);
        return content;
    } catch (error) {
        console.log(`APS: not able to create content: ${error.message}` );
    }
}

async function authorizeUserToContentRepo(user) {
    console.log(`Authorize user ${user.email}`);
    try {
        const content = await alfrescoJsApiRepo.oauth2Auth.callCustomApi(
            `${program.host}/activiti-app/app/rest/integration/alfresco`,
            'GET',
            {},
            {},
            {},
            {},
            {},
            ['application/json'],
            ['application/json']
        );
        console.log(`Found ${content.data && content.data.length} contents`);
        if (content.data) {
            for (let i = 0; i < content.data.length; i++) {
                await authorizeUserToContent(user.email, content.data[i].id);
            }
        }

        return;
    } catch (error) {
        console.log(`APS: not able to authorize content: ${error.message}` );
    }
}

async function authorizeUserToContent(email, contentId) {
    console.log(`Authorize ${email} on contentId: ${contentId}`);
    try {
        const content = await alfrescoJsApiRepo.oauth2Auth.callCustomApi(
            `${program.host}/activiti-app/app/rest/integration/sso/${contentId}/account`,
            'GET',
            {},
            {},
            {},
            {},
            {},
            ['application/json'],
            ['application/json']
        );
        console.log(`User authorized!`);
        return content;
    } catch (error) {
        console.log(`APS: not able to authorize content: ${error.message}` );
    }
}

async function downloadLicenseFile(apsLicensePath) {

    try {
        const child_process = require("child_process");
        child_process.execSync(` aws s3 cp ${apsLicensePath} ./ `, {
            cwd: path.resolve(__dirname, `./`)
        });
        console.log(`Aps license file download from S3 bucket`);
        return true;
    } catch (error) {
        console.log(`Not able to download the APS license from S3 bucket` );
        return false;
    }
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay) ;
}

main();
