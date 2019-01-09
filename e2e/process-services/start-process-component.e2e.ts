/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Util } from '../util/util';
import TestConfig = require('../test.config');
import resources = require('../util/resources');
import CONSTANTS = require('../util/constants');
import { LoginPage } from '../pages/adf/loginPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { StartProcessPage } from '../pages/adf/process-services/startProcessPage';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { AppNavigationBarPage } from '../pages/adf/process-services/appNavigationBarPage';
import { ProcessDetailsPage } from '../pages/adf/process-services/processDetailsPage';
import { AttachmentListPage } from '../pages/adf/process-services/attachmentListPage';
import { AppsActions } from '../actions/APS/apps.actions';
import { browser } from 'protractor';

import { User } from '../models/APS/user';
import { Tenant } from '../models/APS/tenant';

import { FileModel } from '../models/ACS/fileModel';
import dateFormat = require('dateformat');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
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
    const apps = new AppsActions();
    let app = resources.Files.APP_WITH_PROCESSES;
    let simpleApp = resources.Files.WIDGETS_SMOKE_TEST;
    let appId, procUserModel, secondProcUserModel, tenantId, simpleAppCreated;
    let processModelWithSe = 'process_with_se', processModelWithoutSe = 'process_without_se';
    const processName255Characters = Util.generateRandomString(255);
    const processNameBiggerThen255Characters = Util.generateRandomString(256);
    const lengthValidationError = 'Length exceeded, 255 characters max.';

    let auditLogFile = path.join('../e2e/download/', 'Audit.pdf');

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

        let appCreated = await apps.importPublishDeployApp(this.alfrescoJsApiUserTwo, app.file_location);

        simpleAppCreated = await apps.importPublishDeployApp(this.alfrescoJsApiUserTwo, simpleApp.file_location);

        appId = appCreated.id;

        done();

    });

    afterAll(async (done) => {
        await this.alfrescoJsApiUserTwo.activiti.modelsApi.deleteModel(appId);

        await this.alfrescoJsApiUserTwo.activiti.modelsApi.deleteModel(simpleAppCreated.id);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

        done();
    });

    describe(' Once logged with user without apps', () => {

        beforeEach(() => {
            loginPage.loginToProcessServicesUsingUserModel(procUserModel);
            navigationBarPage.navigateToProcessServicesPage();
            processServicesPage.checkApsContainer();
        });

        it('[C260458] Should NOT be able to start a process without process model', () => {
            processServicesPage.goToApp('Task App');
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.checkNoProcessMessage();
        });
    });

    describe(' Once logged with user with app', () => {

        beforeEach(() => {
            loginPage.loginToProcessServicesUsingUserModel(secondProcUserModel);
            navigationBarPage.navigateToProcessServicesPage();
            processServicesPage.checkApsContainer();
        });

        it('[C260441] Should display start process form and default name when creating a new process', () => {
            processServicesPage.goToApp('Task App');
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            expect(startProcessPage.getDefaultName()).toEqual('My Default Name');
        });

        it('[C260445] Should require process definition and be possible to click cancel button', () => {
            processServicesPage.goToApp('Task App');
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.enterProcessName('');
            browser.actions().sendKeys('v\b\b').perform(); // clear doesn't trigger the validator
            startProcessPage.checkStartProcessButtonIsDisabled();
            startProcessPage.clickCancelProcessButton();
            processFiltersPage.checkNoContentMessage();
        });

        it('[C260444] Should require process name', () => {
            processServicesPage.goToApp(app.title);

            appNavigationBarPage.clickProcessButton();

            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();

            startProcessPage.selectFromProcessDropdown(processModelWithoutSe);
            startProcessPage.deleteDefaultName('My Default Name');
            startProcessPage.checkStartProcessButtonIsDisabled();
            startProcessPage.clickProcessDropdownArrow();
            startProcessPage.checkOptionIsDisplayed(processModelWithSe);
            startProcessPage.checkOptionIsDisplayed(processModelWithoutSe);
        });

        it('[C260443] Should be possible to start a process without start event', () => {
            processServicesPage.goToApp(app.title);

            appNavigationBarPage.clickProcessButton();

            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();

            expect(startProcessPage.checkSelectProcessPlaceholderIsDisplayed()).toBe('');

            startProcessPage.selectFromProcessDropdown(processModelWithoutSe);

            expect(startProcessPage.getDefaultName()).toEqual('My Default Name');

            startProcessPage.checkStartProcessButtonIsEnabled();
        });

        it('[C260449] Should be possible to start a process with start event', () => {
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.enterProcessName('Test');
            startProcessPage.selectFromProcessDropdown(processModelWithSe);
            startProcessPage.clickFormStartProcessButton();
            processDetailsPage.checkDetailsAreDisplayed();
            browser.controlFlow().execute(async () => {
                let processId = await processDetailsPage.getId();
                await this.alfrescoJsApi.activiti.processApi.getProcessInstance(processId).then(function (response) {
                    expect(processDetailsPage.getProcessStatus()).toEqual(CONSTANTS.PROCESS_STATUS.RUNNING);
                    expect(processDetailsPage.getEndDate()).toEqual(CONSTANTS.PROCESS_END_DATE);
                    expect(processDetailsPage.getProcessCategory()).toEqual(CONSTANTS.PROCESS_CATEGORY);
                    expect(processDetailsPage.getBusinessKey()).toEqual(CONSTANTS.PROCESS_BUSINESS_KEY);
                    expect(processDetailsPage.getCreatedBy()).toEqual(`${response.startedBy.firstName} ${response.startedBy.lastName}`);
                    expect(processDetailsPage.getCreated()).toEqual(dateFormat(CONSTANTS.PROCESS_DATE_FORMAT));
                    expect(processDetailsPage.getId()).toEqual(response.id);
                    expect(processDetailsPage.getProcessDescription()).toEqual(CONSTANTS.PROCESS_DESCRIPTION);
                    expect(processDetailsPage.checkProcessTitleIsDisplayed()).toEqual(response.name);
                });
            });
        });

        it('[C286503] Should NOT display any process definition when typing a non-existent one', () => {
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.typeProcessDefinition('nonexistent');
            startProcessPage.checkNoProcessDefinitionOptionIsDisplayed();
            startProcessPage.checkStartProcessButtonIsDisabled();
        });

        it('[C286504] Should display proper options when typing a part of existent process definitions', () => {
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.typeProcessDefinition('process');
            startProcessPage.checkOptionIsDisplayed(processModelWithoutSe);
            startProcessPage.checkOptionIsDisplayed(processModelWithSe);
            startProcessPage.selectOption(processModelWithoutSe);
            startProcessPage.checkStartProcessButtonIsEnabled();
        });

        it('[C286508] Should display only one option when typing an existent process definition', () => {
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.typeProcessDefinition(processModelWithoutSe);
            startProcessPage.checkOptionIsDisplayed(processModelWithoutSe);
            startProcessPage.checkOptionIsNotDisplayed(processModelWithSe);
            startProcessPage.selectOption(processModelWithoutSe);
            startProcessPage.checkStartProcessButtonIsEnabled();
        });

        it('[C286509] Should select automatically the processDefinition when the app contains only one', () => {
            processServicesPage.goToApp(simpleApp.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            expect(startProcessPage.getProcessDefinitionValue()).toBe(simpleApp.title);
            startProcessPage.checkStartProcessButtonIsEnabled();
        });

        it('[C286511] Should be able to type the process definition and start a process', () => {
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.enterProcessName('Type');
            startProcessPage.typeProcessDefinition(processModelWithoutSe);
            startProcessPage.selectOption(processModelWithoutSe);
            startProcessPage.checkStartProcessButtonIsEnabled();
            expect(startProcessPage.getProcessDefinitionValue()).toBe(processModelWithoutSe);
            startProcessPage.clickStartProcessButton();
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.selectFromProcessList('Type');
        });

        it('[C286513] Should be able to use down arrow key when navigating throw suggestions', () => {
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.typeProcessDefinition('process');

            startProcessPage.pressDownArrowAndEnter();
            expect(startProcessPage.getProcessDefinitionValue()).toBe(processModelWithoutSe);
        });

        it('[C286514] Should the process definition input be cleared when clicking on options drop down ', () => {
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.typeProcessDefinition('process');
            startProcessPage.selectOption(processModelWithoutSe);
            expect(startProcessPage.getProcessDefinitionValue()).toBe(processModelWithoutSe);
            startProcessPage.clickProcessDropdownArrow();

            expect(startProcessPage.getProcessDefinitionValue()).toBe('');
        });

        it('[C260453] Should be possible to add a comment on an active process', () => {
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.enterProcessName('Comment Process');
            startProcessPage.selectFromProcessDropdown(processModelWithSe);
            startProcessPage.clickFormStartProcessButton();
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.selectFromProcessList('Comment Process');
            processDetailsPage.addComment('comment1');
            processDetailsPage.checkCommentIsDisplayed('comment1');
        });

        it('[C260454] Should be possible to download audit log file', () => {
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.enterProcessName('Audit Log');
            startProcessPage.selectFromProcessDropdown(processModelWithSe);
            startProcessPage.clickFormStartProcessButton();
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.selectFromProcessList('Audit Log');
            processDetailsPage.clickAuditLogButton();

            expect(Util.fileExists(auditLogFile, 15)).toBe(true);
        });

        it('Should be able to attach a file using the button', () => {
            processServicesPage.goToApp(app.title);

            appNavigationBarPage.clickProcessButton();

            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();

            startProcessPage.enterProcessName('Attach File');
            startProcessPage.selectFromProcessDropdown(processModelWithSe);
            startProcessPage.clickFormStartProcessButton();

            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.selectFromProcessList('Attach File');

            attachmentListPage.clickAttachFileButton(jpgFile.location);
            attachmentListPage.checkFileIsAttached(jpgFile.name);
        });

        it('[C260451] Should be possible to display process diagram', () => {
            processServicesPage.goToApp(app.title);

            appNavigationBarPage.clickProcessButton();

            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();

            startProcessPage.enterProcessName('Show Diagram');
            startProcessPage.selectFromProcessDropdown(processModelWithSe);
            startProcessPage.clickFormStartProcessButton();

            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.selectFromProcessList('Show Diagram');

            processDetailsPage.clickShowDiagram();
        });

        it('[C260452] Should redirect user when clicking on active/completed task', () => {
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.enterProcessName('Active Task');
            startProcessPage.selectFromProcessDropdown(processModelWithSe);
            startProcessPage.clickFormStartProcessButton();
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.selectFromProcessList('Active Task');
            processDetailsPage.clickOnActiveTask();
            processDetailsPage.checkActiveTaskTitleIsDisplayed(app.task_name);
        });

        it('[C260457] Should display process in Completed when cancelled', () => {
            loginPage.loginToProcessServicesUsingUserModel(secondProcUserModel);
            navigationBarPage.navigateToProcessServicesPage();
            processServicesPage.checkApsContainer();
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.enterProcessName('Cancel Process');
            startProcessPage.selectFromProcessDropdown(processModelWithSe);
            startProcessPage.clickFormStartProcessButton();
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.selectFromProcessList('Cancel Process');
            processDetailsPage.clickCancelProcessButton();
            processFiltersPage.clickCompletedFilterButton();
            processFiltersPage.selectFromProcessList('Cancel Process');
            processDetailsPage.checkShowDiagramIsDisabled();
        });

        it('[C260461] Should be possible to add a comment on a completed/canceled process', () => {
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.enterProcessName('Comment Process 2');
            startProcessPage.selectFromProcessDropdown(processModelWithSe);
            startProcessPage.clickFormStartProcessButton();
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.selectFromProcessList('Comment Process 2');
            processDetailsPage.clickCancelProcessButton();
            processFiltersPage.clickCompletedFilterButton();
            processFiltersPage.selectFromProcessList('Comment Process 2');
            processDetailsPage.addComment('goodbye');
            processDetailsPage.checkCommentIsDisplayed('goodbye');
        });

        it('[C260467] Should NOT be possible to attach a file on a completed process', () => {
            processServicesPage.goToApp(app.title);
            appNavigationBarPage.clickProcessButton();
            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
            startProcessPage.enterProcessName('File');
            startProcessPage.selectFromProcessDropdown(processModelWithSe);
            startProcessPage.clickFormStartProcessButton();
            processFiltersPage.clickRunningFilterButton();
            processFiltersPage.selectFromProcessList('File');
            processDetailsPage.clickCancelProcessButton();
            processFiltersPage.clickCompletedFilterButton();
            processFiltersPage.selectFromProcessList('File');
            attachmentListPage.checkAttachFileButtonIsNotDisplayed();
        });

        it('[C291781] Should be displayed an error message if process name exceed 255 characters', () => {
            processServicesPage.goToApp(app.title);

            appNavigationBarPage.clickProcessButton();

            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();

            startProcessPage.enterProcessName(processName255Characters);
            startProcessPage.selectFromProcessDropdown(processModelWithoutSe);
            startProcessPage.checkStartProcessButtonIsEnabled();

            startProcessPage.enterProcessName(processNameBiggerThen255Characters);
            startProcessPage.checkValidationErrorIsDisplayed(lengthValidationError);
            startProcessPage.checkStartProcessButtonIsDisabled();
        });
    });
});
