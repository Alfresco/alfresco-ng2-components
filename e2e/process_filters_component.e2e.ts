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

import TestConfig = require('./test.config.js');
import CONSTANTS = require('./util/constants');
import resources = require('./util/resources.js');
import AdfLoginPage = require('./pages/adf/loginPage.js');
import AdfNavigationBarPage = require('./pages/adf/navigationBarPage.js');
import AdfProcessServicesPage = require('./pages/adf/process_services/processServicesPage.js');
import AdfStartProcessPage = require('./pages/adf/process_services/startProcessPage.js');
import AdfProcessFiltersPage = require('./pages/adf/process_services/processFiltersPage.js');
import AdfAppNavigationBarPage = require('./pages/adf/process_services/appNavigationBarPage.js');
import AdfProcessDetailsPage = require('./pages/adf/process_services/processDetailsPage.js');
import BasicAuthorization = require('./restAPI/httpRequest/BasicAuthorization');

import UserAPI = require('./restAPI/APS/enterprise/UsersAPI');
import RuntimeAppDefinitionAPI = require('./restAPI/APS/enterprise/RuntimeAppDefinitionAPI');
import ModelsAPI = require('./restAPI/APS/enterprise/ModelsAPI');
import AppDefinitionsAPI = require('./restAPI/APS/enterprise/AppDefinitionsAPI');
import TenantsAPI = require('./restAPI/APS/enterprise/TenantsAPI');

import User = require('./models/APS/User');
import AppPublish = require('./models/APS/AppPublish');
import AppDefinition = require('./models/APS/AppDefinition');
import Tenant = require('./models/APS/Tenant');

xdescribe('Process Filters Test', () => {

    let adfLoginPage = new AdfLoginPage();
    let adfNavigationBarPage = new AdfNavigationBarPage();
    let adfProcessServicesPage = new AdfProcessServicesPage();
    let adfStartProcessPage = new AdfStartProcessPage();
    let adfProcessFiltersPage = new AdfProcessFiltersPage();
    let adfAppNavigationBarPage = new AdfAppNavigationBarPage();
    let adfProcessDetailsPage = new AdfProcessDetailsPage();
    let app = resources.Files.APP_WITH_DATE_FIELD_FORM;
    let appId, modelId, response, procUserModel, basicAuth, tenantId;
    // REST API
    let appUtils = new AppDefinitionsAPI();
    let runtimeAppDefAPI = new RuntimeAppDefinitionAPI();
    let modelUtils = new ModelsAPI();
    let tenantsAPI = new TenantsAPI();
    let basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    let processTitle = {
        running: 'Test_running',
        completed: 'Test_completed'
    };
    let processFilter = {
        running: 'Running',
        all: 'All',
        completed: 'Completed'
    };

    beforeAll( (done) => {
        tenantsAPI.createTenant(basicAuthAdmin, new Tenant())
            .then(function (result) {
                tenantId = JSON.parse(result.responseBody).id;
                procUserModel = new User({tenantId: tenantId});
                return new UserAPI().createUser(basicAuthAdmin, procUserModel);
            })
            .then(function (result) {
                basicAuth = new BasicAuthorization(procUserModel.email, procUserModel.password);
                return appUtils.importApp(basicAuth, app.file_location);
            })
            .then(function (result) {
                // console.info('Import app result: ', result);
                response = JSON.parse(result.responseBody);
                appId = response.id;
                modelId = response.definition.models[0].id;
                expect(result['statusCode']).toEqual(CONSTANTS.HTTP_RESPONSE_STATUS_CODE.OK);

                return appUtils.getAppDefinition(basicAuth, appId.toString());
            })
            .then(function (result) {
                // console.info('Get app definition result: ', result);
                expect(result.statusCode).toEqual(CONSTANTS.HTTP_RESPONSE_STATUS_CODE.OK);
                expect(JSON.parse(result.responseBody).id).toEqual(appId);

                return appUtils.publishApp(basicAuth, appId.toString(), new AppPublish());
            })
            .then(function (result) {
                // console.info('Publish app result: ', result);
                expect(result.statusCode).toEqual(CONSTANTS.HTTP_RESPONSE_STATUS_CODE.OK);
                response = JSON.parse(result.responseBody).appDefinition;
                expect(response.id).toEqual(appId);
                expect(response.name).toEqual(app.title);

                return runtimeAppDefAPI.deployApp(basicAuth, new AppDefinition({id: appId.toString()}));
            })
            .then(function (result) {
                // console.info('Deploy app result: ', result.statusCode + ' ' + result.statusMessage);
                expect(result.statusCode).toEqual(CONSTANTS.HTTP_RESPONSE_STATUS_CODE.OK);
            })
            .then(() => {
                adfLoginPage.loginToProcessServicesUsingUserModel(procUserModel);
                done();
            });
    });

    afterAll((done) => {
        modelUtils.deleteModel(basicAuth, appId)
            .then(function (result) {
                // console.info('Delete app result: ', result.statusCode + ' ' + result.statusMessage);
                expect(result.statusCode).toEqual(CONSTANTS.HTTP_RESPONSE_STATUS_CODE.OK);
                return modelUtils.deleteModel(basicAuth, modelId);
            })
            .then(function (result) {
                // console.info('Delete process result: ', result.statusCode + ' ' + result.statusMessage);
                expect(result.statusCode).toEqual(CONSTANTS.HTTP_RESPONSE_STATUS_CODE.OK);
            })
            .then(() => {
                tenantsAPI.deleteTenant(basicAuthAdmin, tenantId.toString());
            })
            .then(function (result) {
                done();
            });
    });

    it('Navigate to Running filter', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.enterProcessName(processTitle.completed);
        adfStartProcessPage.selectFromProcessDropdown(app.process_title);
        adfStartProcessPage.clickFormStartProcessButton();
        adfProcessDetailsPage.clickCancelProcessButton();
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.enterProcessName(processTitle.running);
        adfStartProcessPage.selectFromProcessDropdown(app.process_title);
        adfStartProcessPage.clickFormStartProcessButton();
        adfProcessFiltersPage.checkFilterIsHighlighted(processFilter.running);
        adfProcessFiltersPage.selectFromProcessList(processTitle.running);
        adfProcessDetailsPage.checkProcessDetailsCard();
    });

    it('Navigate to All filter', () => {
        adfProcessFiltersPage.clickAllFilterButton();
        adfProcessFiltersPage.checkFilterIsHighlighted(processFilter.all);
        adfProcessFiltersPage.selectFromProcessList(processTitle.running);
        adfProcessFiltersPage.selectFromProcessList(processTitle.completed);
        adfProcessDetailsPage.checkProcessDetailsCard();
    });

    it('Navigate to Completed filter', () => {
        adfProcessFiltersPage.clickCompletedFilterButton();
        adfProcessFiltersPage.checkFilterIsHighlighted(processFilter.completed);
        adfProcessFiltersPage.selectFromProcessList(processTitle.completed);
        adfProcessDetailsPage.checkProcessDetailsCard();
    });
});
