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

import Util = require('./util/util');
import TestConfig = require('./test.config');
import resources = require('./util/resources');
import CONSTANTS = require('./util/constants');
import LoginPage = require('./pages/adf/loginPage');
import NavigationBarPage = require('./pages/adf/navigationBarPage');
import ProcessServicesPage = require('./pages/adf/process_services/processServicesPage');
import AdfStartProcessPage = require('./pages/adf/process_services/startProcessPage');
import AdfProcessFiltersPage = require('./pages/adf/process_services/processFiltersPage');
import AppNavigationBarPage = require('./pages/adf/process_services/appNavigationBarPage');
import AdfProcessDetailsPage = require('./pages/adf/process_services/processDetailsPage');
import AttachmentListPage = require('./pages/adf/process_services/attachmentListPage');
import BasicAuthorization = require('./restAPI/httpRequest/BasicAuthorization');

import User = require('./models/APS/User');
import AppPublish = require('./models/APS/AppPublish');
import AppDefinition = require('./models/APS/AppDefinition');
import ProcessModel = require('./models/APS/ProcessModel');
import Tenant = require('./models/APS/Tenant');

import FileModel = require('./models/ACS/fileModel');
import dateFormat = require('dateformat');

import AlfrescoApi = require('alfresco-js-api-node');
import fs = require('fs');
import path = require('path');

describe('Start Process Component', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let processServicesPage = new ProcessServicesPage();
    let adfStartProcessPage = new AdfStartProcessPage();
    let adfProcessFiltersPage = new AdfProcessFiltersPage();
    let appNavigationBarPage = new AppNavigationBarPage();
    let adfProcessDetailsPage = new AdfProcessDetailsPage();
    let attachmentListPage = new AttachmentListPage();
    let app = resources.Files.APP_WITH_PROCESSES;
    let appId, modelId, secondModelId, processModel, procUserModel, secondProcUserModel, basicAuth1,
        basicAuth2, tenantId;

    let auditLogFile = path.join('./e2e/download/', 'Audit.pdf');

    let jpgFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.JPG.file_name
    });

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        tenantId = newTenant.id;
        procUserModel = new User({ tenantId: tenantId });
        secondProcUserModel = new User({ tenantId: tenantId });

        let userOne = await this.alfrescoJsApi.activiti.adminUsersApi.createNewUser(procUserModel);
        let userTwo = await this.alfrescoJsApi.activiti.adminUsersApi.createNewUser(secondProcUserModel);

        this.alfrescoJsApiUserTwo = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApiUserTwo.login(secondProcUserModel.email, secondProcUserModel.password);

        let pathFile = path.join(TestConfig.main.rootPath + app.file_location);
        let file = fs.createReadStream(pathFile);

        let appCreated = await this.alfrescoJsApiUserTwo.activiti.appsApi.importAppDefinition(file);

        appId = appCreated.id;
        modelId = appCreated.definition.models[0].id;
        secondModelId = appCreated.definition.models[1].id;

        appId = appCreated.id;

        let publishApp = await this.alfrescoJsApiUserTwo.activiti.appsApi.publishAppDefinition(appId, new AppPublish());

        await this.alfrescoJsApiUserTwo.activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] });

        loginPage.loginToProcessServicesUsingUserModel(procUserModel);
        navigationBarPage.clickProcessServicesButton();
        done();

    });

    afterAll(async (done) => {
        await this.alfrescoJsApiUserTwo.activiti.modelsApi.deleteModel(appId);

        // await this.alfrescoJsApiUserTwo.activiti.modelsApi.deleteModel(secondModelId);
        //
        // await this.alfrescoJsApiUserTwo.activiti.modelsApi.deleteModel(modelId);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

        done();
    });

    it('Check start a process without a process model included', () => {
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp('Task App');
        appNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.checkNoProcessMessage();
    });

    it('Check Start Process within Task App', () => {
        loginPage.loginToProcessServicesUsingUserModel(secondProcUserModel);
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp('Task App');
        appNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        expect(adfStartProcessPage.getDefaultName()).toEqual('My Default Name');
    });

    it('Name of the process is required', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.selectFromProcessDropdown('process_without_se');
        adfStartProcessPage.deleteDefaultName('My Default Name');
        adfStartProcessPage.checkStartProcessButtonIsDisabled();
    });

    it('Process Definition is required and cancel button is clicked', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp('Task App');
        appNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.selectFromProcessDropdown('Choose one...');
        adfStartProcessPage.checkStartProcessButtonIsDisabled();
        adfStartProcessPage.clickCancelProcessButton();
        adfProcessFiltersPage.checkNoContentMessage();
    });

    it('Check Start Process within an app without a start event', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.selectFromProcessDropdown('process_without_se');
        expect(adfStartProcessPage.getDefaultName()).toEqual('My Default Name');
        adfStartProcessPage.checkStartProcessButtonIsEnabled();
    });

    xit('Start a process within an app with a start event', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        adfProcessFiltersPage.clickCreateProcessButton();
        adfProcessFiltersPage.clickNewProcessDropdown();
        adfStartProcessPage.enterProcessName('Test');
        adfStartProcessPage.selectFromProcessDropdown('process_with_se');
        adfStartProcessPage.clickFormStartProcessButton()
            .then(() => {
                adfProcessDetailsPage.getId()
                    .then(function (result) {
                        return this.alfrescoJsApi.activiti.processApi.getProcessInstance(result);
                    })
                    .then(function (response) {
                        expect(adfProcessDetailsPage.getProcessStatus()).toEqual(CONSTANTS.PROCESSSTATUS.RUNNING);
                        expect(adfProcessDetailsPage.getEndDate()).toEqual(CONSTANTS.PROCESSENDDATE);
                        expect(adfProcessDetailsPage.getProcessCategory()).toEqual(CONSTANTS.PROCESSCATEGORY);
                        expect(adfProcessDetailsPage.getBusinessKey()).toEqual(CONSTANTS.PROCESSBUSINESSKEY);
                        expect(adfProcessDetailsPage.getCreatedBy()).toEqual(response.getStartedBy().getEntireName());
                        expect(adfProcessDetailsPage.getCreated()).toEqual(dateFormat(CONSTANTS.PROCESSDATEFORMAT));
                        expect(adfProcessDetailsPage.getId()).toEqual(response.getId());
                        expect(adfProcessDetailsPage.getProcessDescription()).toEqual(CONSTANTS.PROCESSDESCRIPTION);
                        expect(adfProcessDetailsPage.checkProcessTitleIsDisplayed()).toEqual(response.getName());
                    });
            });
    });

    it('Add a comment on an active process', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
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
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
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
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);

        appNavigationBarPage.clickProcessButton();

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
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);

        appNavigationBarPage.clickProcessButton();

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
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
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
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
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
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
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
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
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
