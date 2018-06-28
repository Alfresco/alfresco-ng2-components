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

import AppDefinitionAPI = require('../../../restAPI/APS/enterprise/AppDefinitionsAPI');
import RuntimeAppDefinitionAPI = require('../../../restAPI/APS/enterprise/RuntimeAppDefinitionAPI');
import FormModelAPI = require('../../../restAPI/APS/enterprise/FormModelsAPI');
import ProcessDefinitionsAPI = require('../../../restAPI/APS/enterprise/ProcessDefinitionsAPI');
import ProcessInstanceAPI = require('../../../restAPI/APS/enterprise/ProcessInstancesAPI');
import ModelsAPI = require('../../../restAPI/APS/enterprise/ModelsAPI');

import TestConfig = require('../../../test.config.js');
import fs = require('fs');
import path = require('path');

import ProcessInstance = require('../../../models/APS/ProcessInstance');
import AppPublish = require('../../../models/APS/AppPublish');
import AppDefinition = require('../../../models/APS/AppDefinition');

import APIUtil = require('../../../restAPI/APIUtil');

import CONSTANTS = require('../../../util/constants.js');
let RESPONSE_STATUS_OK = CONSTANTS.HTTP_RESPONSE_STATUS.OK;

/**
 * Import, publish and deploy an app
 *
 * @param auth - authentication credentials
 * @param appFileLocation - app file location
 * @returns {*|Promise.<T>|!Thenable.<R>} - app json
 */
module.exports.importPublishDeployApp = async (alfrescoJsApi, appFileLocation) => {

    let pathFile = path.join(TestConfig.main.rootPath + appFileLocation);
    let file = fs.createReadStream(pathFile);

    let appCreated = await alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

    let publishApp = await alfrescoJsApi.activiti.appsApi.publishAppDefinition(appCreated.id, new AppPublish());

    await alfrescoJsApi.activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

    return appCreated;
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

            let params = { processDefinitionId: processDefinitionId };
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
