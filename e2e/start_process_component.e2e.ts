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

var Util = require('./util/util.js');
var TestConfig = require('./test.config.js');
var resources = require('./util/resources.js');
var CONSTANTS = require('./util/constants');
var AdfLoginPage = require('./pages/adf/loginPage.js');
var AdfNavigationBarPage = require('./pages/adf/navigationBarPage.js');
var AdfProcessServicesPage = require('./pages/adf/process_services/processServicesPage.js');
var AdfStartProcessPage = require('./pages/adf/process_services/startProcessPage.js');
var AdfProcessFiltersPage = require('./pages/adf/process_services/processFiltersPage.js');
var AdfAppNavigationBarPage = require('./pages/adf/process_services/appNavigationBarPage.js');
var AdfProcessDetailsPage = require('./pages/adf/process_services/processDetailsPage.js');
var AttachmentListPage = require('./pages/adf/process_services/attachmentListPage.js');
var BasicAuthorization = require('./restAPI/httpRequest/BasicAuthorization');
var path = require('path');

var UserAPI = require('./restAPI/APS/enterprise/UsersAPI');
var RuntimeAppDefinitionAPI = require('./restAPI/APS/enterprise/RuntimeAppDefinitionAPI');
var ModelsAPI = require('./restAPI/APS/enterprise/ModelsAPI');
var AppDefinitionsAPI = require('./restAPI/APS/enterprise/AppDefinitionsAPI');
var ProcessInstancesAPI = require('./restAPI/APS/enterprise/ProcessInstancesAPI');
var TenantsAPI = require('./restAPI/APS/enterprise/TenantsAPI');

var User = require('./models/APS/User');
var AppPublish = require('./models/APS/AppPublish');
var AppDefinition = require('./models/APS/AppDefinition');
var ProcessModel = require('./models/APS/ProcessModel.js');
var Tenant = require('./models/APS/Tenant');

var FileModel = require('./models/ACS/fileModel.js');

var dateFormat = require('dateformat');

xdescribe('Test Start Process Component', () => {

    var adfLoginPage = new AdfLoginPage();
    var adfNavigationBarPage = new AdfNavigationBarPage();
    var adfProcessServicesPage = new AdfProcessServicesPage();
    var adfStartProcessPage = new AdfStartProcessPage();
    var adfProcessFiltersPage = new AdfProcessFiltersPage();
    var adfAppNavigationBarPage = new AdfAppNavigationBarPage();
    var adfProcessDetailsPage = new AdfProcessDetailsPage();
    var attachmentListPage = new AttachmentListPage();
    var app = resources.Files.APP_WITH_PROCESSES;
    var appId, modelId, secondModelId, response, processModel, procUserModel, secondProcUserModel, basicAuth1,
        basicAuth2, tenantId;
    var auditLogFile = path.join(browser.downloadDir, 'Audit.pdf');
    var jpgFile = new FileModel({
        "location": resources.Files.ADF_DOCUMENTS.JPG.file_location,
        "name": resources.Files.ADF_DOCUMENTS.JPG.file_name
    });
    // REST API
    var appUtils = new AppDefinitionsAPI();
    var runtimeAppDefAPI = new RuntimeAppDefinitionAPI();
    var modelUtils = new ModelsAPI();
    var tenantsAPI = new TenantsAPI();

    var basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

    beforeAll(function (done) {
        tenantsAPI.createTenant(basicAuthAdmin, new Tenant())
            .then(function (result) {
                tenantId = JSON.parse(result.responseBody).id;
                procUserModel = new User({ tenantId: tenantId });
                return new UserAPI().createUser(basicAuthAdmin, procUserModel);
            })
            .then(function (result) {
                basicAuth1 = new BasicAuthorization(procUserModel.email, procUserModel.password);
                secondProcUserModel = new User({ tenantId: tenantId });
                return new UserAPI().createUser(basicAuthAdmin, secondProcUserModel);
            })
            .then(function (result) {
                basicAuth2 = new BasicAuthorization(secondProcUserModel.email, secondProcUserModel.password);
                return appUtils.importApp(basicAuth2, app.file_location)
            })
            .then(function (result) {
                console.info("Import app result: ", result);
                response = JSON.parse(result.responseBody);
                appId = response.id;
                modelId = response.definition.models[0].id;
                secondModelId = response.definition.models[1].id;
                expect(result['statusCode']).toEqual(CONSTANTS.HTTP_RESPONSE_STATUS_CODE.OK);

                return appUtils.getAppDefinition(basicAuth2, appId.toString());
            })
            .then(function (result) {
                console.info("Get app definition result: ", result);
                expect(result.statusCode).toEqual(CONSTANTS.HTTP_RESPONSE_STATUS_CODE.OK);
                expect(JSON.parse(result.responseBody).id).toEqual(appId);

                return appUtils.publishApp(basicAuth2, appId.toString(), new AppPublish());
            })
            .then(function (result) {
                console.info("Publish app result: ", result);
                expect(result.statusCode).toEqual(CONSTANTS.HTTP_RESPONSE_STATUS_CODE.OK);
                response = JSON.parse(result.responseBody).appDefinition;
                expect(response.id).toEqual(appId);
                expect(response.name).toEqual(app.title);

                return runtimeAppDefAPI.deployApp(basicAuth2, new AppDefinition({ id: appId.toString() }));
            })
            .then(function (result) {
                console.info("Deploy app result: ", result.statusCode + ' ' + result.statusMessage);
                expect(result.statusCode).toEqual(CONSTANTS.HTTP_RESPONSE_STATUS_CODE.OK);
            })
            .then(() => {
                adfLoginPage.loginToProcessServicesUsingUserModel(procUserModel);
                adfNavigationBarPage.clickProcessServicesButton();
                done();
            });
    });

    afterAll(function (done) {
        modelUtils.deleteModel(basicAuth2, appId)
            .then(function (result) {
                console.info('Delete app result: ', result.statusCode + ' ' + result.statusMessage);
                expect(result.statusCode).toEqual(CONSTANTS.HTTP_RESPONSE_STATUS_CODE.OK);

                return modelUtils.deleteModel(basicAuth2, secondModelId);
            })
            .then(() => {

                return modelUtils.deleteModel(basicAuth2, modelId);
            })
            .then(function (result) {
                console.info('Delete process result: ', result.statusCode + ' ' + result.statusMessage);
                expect(result.statusCode).toEqual(CONSTANTS.HTTP_RESPONSE_STATUS_CODE.OK);
            })
            .then(() => {
                tenantsAPI.deleteTenant(basicAuthAdmin, tenantId);
                done();
            })
            .catch(function (error) {
                console.log('Failed with error: ', error);
            });
    });

    it('Check start a process without a process model included', () => {
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp('Task App');
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.checkNoProcessMessage();
    });

    it('Check Start Process within Task App', () => {
        adfLoginPage.loginToProcessServicesUsingUserModel(secondProcUserModel);
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp('Task App');
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        expect(adfStartProcessPage.getDefaultName()).toEqual('My Default Name');
    });

    it('Name of the process is required', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.selectFromProcessDropdown('process_without_se');
        adfStartProcessPage.deleteDefaultName('My Default Name');
        adfStartProcessPage.checkStartProcessButtonIsDisabled();
    });

    it('Process Definition is required and cancel button is clicked', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp('Task App');
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.selectFromProcessDropdown('Choose one...');
        adfStartProcessPage.checkStartProcessButtonIsDisabled();
        adfStartProcessPage.clickCancelProcessButton();
        adfProcessFiltersPage.checkNoContentMessage();
    });


    it('Check Start Process within an app without a start event', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.selectFromProcessDropdown('process_without_se');
        expect(adfStartProcessPage.getDefaultName()).toEqual('My Default Name');
        adfStartProcessPage.checkStartProcessButtonIsEnabled();
    });

    it('Start a process within an app with a start event', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.enterProcessName('Test');
        adfStartProcessPage.selectFromProcessDropdown('process_with_se');
        adfStartProcessPage.clickFormStartProcessButton()
            .then(() => {
                adfProcessDetailsPage.getId()
                    .then(function (result) {
                        return new ProcessInstancesAPI().getProcessInstance(basicAuth2, result)
                    })
                    .then(function (response) {
                        processModel = new ProcessModel(JSON.parse(response.responseBody))
                        expect(adfProcessDetailsPage.getProcessStatus()).toEqual(CONSTANTS.PROCESSSTATUS.RUNNING);
                        expect(adfProcessDetailsPage.getEndDate()).toEqual(CONSTANTS.PROCESSENDDATE);
                        expect(adfProcessDetailsPage.getProcessCategory()).toEqual(CONSTANTS.PROCESSCATEGORY);
                        expect(adfProcessDetailsPage.getBusinessKey()).toEqual(CONSTANTS.PROCESSBUSINESSKEY);
                        expect(adfProcessDetailsPage.getCreatedBy()).toEqual(processModel.getStartedBy().getEntireName());
                        expect(adfProcessDetailsPage.getCreated()).toEqual(dateFormat(CONSTANTS.PROCESSDATEFORMAT));
                        expect(adfProcessDetailsPage.getId()).toEqual(processModel.getId());
                        expect(adfProcessDetailsPage.getProcessDescription()).toEqual(CONSTANTS.PROCESSDESCRIPTION);
                        expect(adfProcessDetailsPage.checkProcessTitleIsDisplayed()).toEqual(processModel.getName());
                    });
            });
    });

    it('Add a comment on an active process', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.enterProcessName('Comment Process');
        adfStartProcessPage.selectFromProcessDropdown('process_with_se');
        adfStartProcessPage.clickFormStartProcessButton();
        adfProcessFiltersPage.clickRunningFilterButton();
        adfProcessFiltersPage.selectFromProcessList('Comment Process');
        adfProcessDetailsPage.addComment('comment1');
        adfProcessDetailsPage.checkCommentIsDisplayed('comment1');
    });

    it('Click Audit Log button', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.enterProcessName('Audit Log');
        adfStartProcessPage.selectFromProcessDropdown('process_with_se');
        adfStartProcessPage.clickFormStartProcessButton();
        adfProcessFiltersPage.clickRunningFilterButton();
        adfProcessFiltersPage.selectFromProcessList('Audit Log');
        adfProcessDetailsPage.clickAuditLogButton();
        expect(Util.fileExists(auditLogFile, 10)).toBe(true);
    });

    it('Add a file in the attachment list using the button', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.enterProcessName('Attach File');
        adfStartProcessPage.selectFromProcessDropdown('process_with_se');
        adfStartProcessPage.clickFormStartProcessButton();
        adfProcessFiltersPage.clickRunningFilterButton();
        adfProcessFiltersPage.selectFromProcessList('Attach File');
        attachmentListPage.clickAttachFileButton(jpgFile.location);
        attachmentListPage.checkFileIsAttached(jpgFile.name);
    });

    it('Click Show Diagram', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.enterProcessName('Show Diagram');
        adfStartProcessPage.selectFromProcessDropdown('process_with_se');
        adfStartProcessPage.clickFormStartProcessButton();
        adfProcessFiltersPage.clickRunningFilterButton();
        adfProcessFiltersPage.selectFromProcessList('Show Diagram');
        adfProcessDetailsPage.clickShowDiagram();
    });

    it('Click on an active task', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.enterProcessName('Active Task');
        adfStartProcessPage.selectFromProcessDropdown('process_with_se');
        adfStartProcessPage.clickFormStartProcessButton();
        adfProcessFiltersPage.clickRunningFilterButton();
        adfProcessFiltersPage.selectFromProcessList('Active Task');
        adfProcessDetailsPage.clickOnActiveTask();
        adfProcessDetailsPage.checkActiveTaskTitleIsDisplayed(app.task_name);
    });

    it('Click Cancel process button', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.enterProcessName('Cancel Process');
        adfStartProcessPage.selectFromProcessDropdown('process_with_se');
        adfStartProcessPage.clickFormStartProcessButton();
        adfProcessFiltersPage.clickRunningFilterButton();
        adfProcessFiltersPage.selectFromProcessList('Cancel Process');
        adfProcessDetailsPage.clickCancelProcessButton();
        adfProcessFiltersPage.clickCompletedFilterButton();
        adfProcessFiltersPage.selectFromProcessList('Cancel Process');
        adfProcessDetailsPage.checkShowDiagramIsDisabled();
    });

    it('Add a comment on a complete process', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.enterProcessName('Comment Process 2');
        adfStartProcessPage.selectFromProcessDropdown('process_with_se');
        adfStartProcessPage.clickFormStartProcessButton();
        adfProcessFiltersPage.clickRunningFilterButton();
        adfProcessFiltersPage.selectFromProcessList('Comment Process 2');
        adfProcessDetailsPage.clickCancelProcessButton();
        adfProcessFiltersPage.clickCompletedFilterButton();
        adfProcessFiltersPage.selectFromProcessList('Comment Process 2');
        adfProcessDetailsPage.addComment('goodbye');
        adfProcessDetailsPage.checkCommentIsDisplayed('goodbye');
    });

    it('Cannot attach a file on a completed process', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp(app.title);
        adfAppNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.enterProcessName('File');
        adfStartProcessPage.selectFromProcessDropdown('process_with_se');
        adfStartProcessPage.clickFormStartProcessButton();
        adfProcessFiltersPage.clickRunningFilterButton();
        adfProcessFiltersPage.selectFromProcessList('File');
        adfProcessDetailsPage.clickCancelProcessButton();
        adfProcessFiltersPage.clickCompletedFilterButton();
        adfProcessFiltersPage.selectFromProcessList('File');
        attachmentListPage.checkAttachFileButtonIsNotDisplayed();
    });
});
