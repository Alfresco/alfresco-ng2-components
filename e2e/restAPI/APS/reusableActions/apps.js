/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let AppDefinitionAPI = require('../../../restAPI/APS/enterprise/AppDefinitionsAPI');
let RuntimeAppDefinitionAPI = require('../../../restAPI/APS/enterprise/RuntimeAppDefinitionAPI');
let FormModelAPI = require('../../../restAPI/APS/enterprise/FormModelsAPI');
let ProcessDefinitionsAPI = require('../../../restAPI/APS/enterprise/ProcessDefinitionsAPI');
let ProcessInstanceAPI = require('../../../restAPI/APS/enterprise/ProcessInstancesAPI');
let ModelsAPI = require('../../../restAPI/APS/enterprise/ModelsAPI');

let ProcessInstance = require('../../../models/APS/ProcessInstance');
let AppPublish = require('../../../models/APS/AppPublish');
let AppDefinition = require('../../../models/APS/AppDefinition');

let APIUtil = require('../../../restAPI/APIUtil');

let CONSTANTS = require('../../../util/constants.js');
let RESPONSE_STATUS_OK = CONSTANTS.HTTP_RESPONSE_STATUS.OK;

/**
 * Import, publish and deploy an app
 *
 * @param auth - authentication credentials
 * @param appFileLocation - app file location
 * @returns {*|Promise.<T>|!Thenable.<R>} - app json
 */
module.exports.importPublishDeployApp = function(auth, appFileLocation) {
    let appUtils = new AppDefinitionAPI();
    let app;
    return appUtils.importApp(auth, appFileLocation)
        .then(function(result) {
            response = JSON.parse(result.responseBody);
            app = response;
            expect(result['statusCode']).toEqual(RESPONSE_STATUS_OK.CODE);
            return appUtils.publishApp(auth, app.id.toString(), new AppPublish());
        })
        .then(function(result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            return new RuntimeAppDefinitionAPI().deployApp(auth, new AppDefinition({id: app.id}));
        })
        .then(function(result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            return app;
        })
        .catch(function(error) {
            console.error('Failed with error: ', error);
        });
};

/**
 * Retrieve the process definition id for an app and start the process
 *
 * @param auth - authentication credentials
 * @param app - app json
 * @returns {Promise.<T>|!Thenable.<R>|*} - process instance id
 */
module.exports.startProcess = function(auth, app, processName) {
    let runtimeAppDefAPI = new RuntimeAppDefinitionAPI();
    let apiUtil = new APIUtil();
    let processDefinitionsAPI = new ProcessDefinitionsAPI();
    let processInstanceId;
    return runtimeAppDefAPI.getRunTimeAppDefinitions(auth)
        .then(function(result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            response = JSON.parse(result.responseBody);
            deploymentId = apiUtil.retrieveValueByKeyValuePair(response.data, 'name', app.name, 'deploymentId');
            return processDefinitionsAPI.getProcessDefinitions(auth, {deploymentId: deploymentId});
        })
        .then(function(result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            response = JSON.parse(result.responseBody);
            processDefinitionId = apiUtil.retrieveValueByKeyValuePair(response.data, 'deploymentId', deploymentId, 'id');

            var params = { processDefinitionId: processDefinitionId };
            if (typeof processName !== 'undefined') {
                params.name = processName;
            }
            return new ProcessInstanceAPI().startProcessInstance(auth, new ProcessInstance(params));
        })
        .then(function(result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            return processInstanceId = JSON.parse(result.responseBody).id;
        })
        .catch(function(error) {
            console.error('Failed with error: ', error);
        });
};

/**
 * Remove app, process and form attached to it
 *
 * @param auth - authentication credentials
 * @param app - app details in json format
 * @returns {Promise.<TResult>}
 */
module.exports.cleanupApp = function(auth, app) {
    let modelUtils = new ModelsAPI();
    return modelUtils.deleteModel(auth, app.id)
        .then(function(result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            return modelUtils.deleteModel(auth, app.definition.models[0].id);
        })
        .then(function(result) {
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            return new FormModelAPI().getFormModels(auth);
        })
        .then(function(result) {
            response = JSON.parse(result.responseBody);
            expect(result.statusCode).toEqual(RESPONSE_STATUS_OK.CODE);
            return modelUtils.deleteModel(auth, response.data[0].id);
        })
        .catch(function(error) {
            console.error('Failed with error: ', error);
        });
};


