const AlfrescoApi = require('alfresco-js-api-node');
import TestConfig = require('../../../test.config');

export class ApiService {

    HOST_SSO = TestConfig.adf.hostSso;

    apiService = new AlfrescoApi({
        provider: 'BPM',
        authType: 'OAUTH',
        oauth2: {
            host: `${this.HOST_SSO}/auth/realms/springboot`,
            authType: '/protocol/openid-connect/token',
            clientId: 'activiti',
            scope: 'openid',
            secret: '',
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/',
            redirectUriLogout: '/logout'
        }

    });

    async login(username, password) {
        await this.apiService.login(username, password);
    }

    /*async performBpmOperation(path, method, queryParams, postBody) {
        const uri = this.HOST_SSO + path;
        const pathParams = {}, formParams = {};
        const authNames = [];
        const contentTypes = ['application/json'];
        const accepts = ['application/json'];

        const headerParams = {
            'Authorization': 'bearer ' + this.apiService.oauth2Auth.token
        };

        return this.apiService.bpmClient.callCustomApi(uri, method, pathParams, queryParams, headerParams, formParams, postBody,
            authNames, contentTypes, accepts, {})
            .catch(error => {
                throw (error);
            });
    }*/

}
