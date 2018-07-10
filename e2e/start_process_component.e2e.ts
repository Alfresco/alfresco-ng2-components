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
import StartProcessPage = require('./pages/adf/process_services/startProcessPage');
import ProcessFiltersPage = require('./pages/adf/process_services/processFiltersPage');
import AppNavigationBarPage = require('./pages/adf/process_services/appNavigationBarPage');
import ProcessDetailsPage = require('./pages/adf/process_services/processDetailsPage');
import {AttachmentListPage} from './pages/adf/process_services/attachmentListPage';

import User = require('./models/APS/User');
import AppPublish = require('./models/APS/AppPublish');
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
    let startProcessPage = new StartProcessPage();
    let processFiltersPage = new ProcessFiltersPage();
    let appNavigationBarPage = new AppNavigationBarPage();
    let processDetailsPage = new ProcessDetailsPage();
    let attachmentListPage = new AttachmentListPage();
    let app = resources.Files.APP_WITH_PROCESSES;
    let appId, procUserModel, secondProcUserModel, tenantId;

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

        await this.alfrescoJsApi.activiti.adminUsersApi.createNewUser(procUserModel);
        await this.alfrescoJsApi.activiti.adminUsersApi.createNewUser(secondProcUserModel);

        this.alfrescoJsApiUserTwo = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApiUserTwo.login(secondProcUserModel.email, secondProcUserModel.password);

        let pathFile = path.join(TestConfig.main.rootPath + app.file_location);
        let file = fs.createReadStream(pathFile);

        let appCreated = await this.alfrescoJsApiUserTwo.activiti.appsApi.importAppDefinition(file);

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
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.checkNoProcessMessage();
    });

    it('Check Start Process within Task App', () => {
        loginPage.loginToProcessServicesUsingUserModel(secondProcUserModel);
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp('Task App');
        appNavigationBarPage.clickProcessButton();
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        expect(startProcessPage.getDefaultName()).toEqual('My Default Name');
    });

    it('Name of the process is required', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.selectFromProcessDropdown('process_without_se');
        startProcessPage.deleteDefaultName('My Default Name');
        startProcessPage.checkStartProcessButtonIsDisabled();
    });

    it('Process Definition is required and cancel button is clicked', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp('Task App');
        appNavigationBarPage.clickProcessButton();
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.selectFromProcessDropdown('Choose one...');
        startProcessPage.checkStartProcessButtonIsDisabled();
        startProcessPage.clickCancelProcessButton();
        processFiltersPage.checkNoContentMessage();
    });

    it('Check Start Process within an app without a start event', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.selectFromProcessDropdown('process_without_se');
        expect(startProcessPage.getDefaultName()).toEqual('My Default Name');
        startProcessPage.checkStartProcessButtonIsEnabled();
    });

    xit('Start a process within an app with a start event', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.enterProcessName('Test');
        startProcessPage.selectFromProcessDropdown('process_with_se');
        startProcessPage.clickFormStartProcessButton()
            .then(() => {
                processDetailsPage.getId()
                    .then(function (result) {
                        return this.alfrescoJsApi.activiti.processApi.getProcessInstance(result);
                    })
                    .then(function (response) {
                        expect(processDetailsPage.getProcessStatus()).toEqual(CONSTANTS.PROCESSSTATUS.RUNNING);
                        expect(processDetailsPage.getEndDate()).toEqual(CONSTANTS.PROCESSENDDATE);
                        expect(processDetailsPage.getProcessCategory()).toEqual(CONSTANTS.PROCESSCATEGORY);
                        expect(processDetailsPage.getBusinessKey()).toEqual(CONSTANTS.PROCESSBUSINESSKEY);
                        expect(processDetailsPage.getCreatedBy()).toEqual(response.getStartedBy().getEntireName());
                        expect(processDetailsPage.getCreated()).toEqual(dateFormat(CONSTANTS.PROCESSDATEFORMAT));
                        expect(processDetailsPage.getId()).toEqual(response.getId());
                        expect(processDetailsPage.getProcessDescription()).toEqual(CONSTANTS.PROCESSDESCRIPTION);
                        expect(processDetailsPage.checkProcessTitleIsDisplayed()).toEqual(response.getName());
                    });
            });
    });

    it('Add a comment on an active process', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.enterProcessName('Comment Process');
        startProcessPage.selectFromProcessDropdown('process_with_se');
        startProcessPage.clickFormStartProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList('Comment Process');
        processDetailsPage.addComment('comment1');
        processDetailsPage.checkCommentIsDisplayed('comment1');
    });

    it('Click Audit Log button', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.enterProcessName('Audit Log');
        startProcessPage.selectFromProcessDropdown('process_with_se');
        startProcessPage.clickFormStartProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList('Audit Log');
        processDetailsPage.clickAuditLogButton();
        expect(Util.fileExists(auditLogFile, 10)).toBe(true);
    });

    it('Add a file in the attachment list using the button', () => {
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);

        appNavigationBarPage.clickProcessButton();

        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();

        startProcessPage.enterProcessName('Attach File');
        startProcessPage.selectFromProcessDropdown('process_with_se');
        startProcessPage.clickFormStartProcessButton();

        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList('Attach File');

        attachmentListPage.clickAttachFileButton(jpgFile.location);
        attachmentListPage.checkFileIsAttached(jpgFile.name);
    });

    it('Click Show Diagram', () => {
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);

        appNavigationBarPage.clickProcessButton();

        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();

        startProcessPage.enterProcessName('Show Diagram');
        startProcessPage.selectFromProcessDropdown('process_with_se');
        startProcessPage.clickFormStartProcessButton();

        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList('Show Diagram');

        processDetailsPage.clickShowDiagram();
    });

    it('Click on an active task', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.enterProcessName('Active Task');
        startProcessPage.selectFromProcessDropdown('process_with_se');
        startProcessPage.clickFormStartProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList('Active Task');
        processDetailsPage.clickOnActiveTask();
        processDetailsPage.checkActiveTaskTitleIsDisplayed(app.task_name);
    });

    it('Click Cancel process button', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.enterProcessName('Cancel Process');
        startProcessPage.selectFromProcessDropdown('process_with_se');
        startProcessPage.clickFormStartProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList('Cancel Process');
        processDetailsPage.clickCancelProcessButton();
        processFiltersPage.clickCompletedFilterButton();
        processFiltersPage.selectFromProcessList('Cancel Process');
        processDetailsPage.checkShowDiagramIsDisabled();
    });

    it('Add a comment on a complete process', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.enterProcessName('Comment Process 2');
        startProcessPage.selectFromProcessDropdown('process_with_se');
        startProcessPage.clickFormStartProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList('Comment Process 2');
        processDetailsPage.clickCancelProcessButton();
        processFiltersPage.clickCompletedFilterButton();
        processFiltersPage.selectFromProcessList('Comment Process 2');
        processDetailsPage.addComment('goodbye');
        processDetailsPage.checkCommentIsDisplayed('goodbye');
    });

    it('Cannot attach a file on a completed process', () => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);
        appNavigationBarPage.clickProcessButton();
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.enterProcessName('File');
        startProcessPage.selectFromProcessDropdown('process_with_se');
        startProcessPage.clickFormStartProcessButton();
        processFiltersPage.clickRunningFilterButton();
        processFiltersPage.selectFromProcessList('File');
        processDetailsPage.clickCancelProcessButton();
        processFiltersPage.clickCompletedFilterButton();
        processFiltersPage.selectFromProcessList('File');
        attachmentListPage.checkAttachFileButtonIsNotDisplayed();
    });
});
