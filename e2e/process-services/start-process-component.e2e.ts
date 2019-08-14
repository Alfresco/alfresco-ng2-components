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

import resources = require('../util/resources');
import CONSTANTS = require('../util/constants');
import { LoginPage, StartProcessDialog, Widget, FileBrowserUtil } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { StartProcessPage } from '../pages/adf/process-services/startProcessPage';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/processServiceTabBarPage';
import { ProcessDetailsPage } from '../pages/adf/process-services/processDetailsPage';
import { AttachmentListPage } from '../pages/adf/process-services/attachmentListPage';
import { AppsActions } from '../actions/APS/apps.actions';
import { browser } from 'protractor';

import { User } from '../models/APS/user';
import { Tenant } from '../models/APS/tenant';

import { FileModel } from '../models/ACS/fileModel';
import dateFormat = require('dateformat');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { StringUtil } from '@alfresco/adf-testing';

describe('Start Process Component', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const startProcessPage = new StartProcessPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const processDetailsPage = new ProcessDetailsPage();
    const attachmentListPage = new AttachmentListPage();
    const startProcessDialog = new StartProcessDialog();
    const apps = new AppsActions();
    const widget = new Widget();
    const app = resources.Files.APP_WITH_PROCESSES;
    const simpleApp = resources.Files.WIDGETS_SMOKE_TEST;
    const dateFormApp = resources.Files.APP_WITH_DATE_FIELD_FORM;
    let appId, procUserModel, secondProcUserModel, tenantId, simpleAppCreated, dateFormAppCreated;
    const processModelWithSe = 'process_with_se', processModelWithoutSe = 'process_without_se';
    const processName255Characters = StringUtil.generateRandomString(255);
    const processNameBiggerThen255Characters = StringUtil.generateRandomString(256);
    const lengthValidationError = 'Length exceeded, 255 characters max.';

    const auditLogFile = 'Audit.pdf';

    const jpgFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.JPG.file_name
    });

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        tenantId = newTenant.id;
        procUserModel = new User({ tenantId: tenantId });
        secondProcUserModel = new User({ tenantId: tenantId });

        await this.alfrescoJsApi.activiti.adminUsersApi.createNewUser(procUserModel);
        await this.alfrescoJsApi.activiti.adminUsersApi.createNewUser(secondProcUserModel);

        this.alfrescoJsApiUserTwo = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApiUserTwo.login(secondProcUserModel.email, secondProcUserModel.password);

        const appCreated = await apps.importPublishDeployApp(this.alfrescoJsApiUserTwo, app.file_location);

        simpleAppCreated = await apps.importPublishDeployApp(this.alfrescoJsApiUserTwo, simpleApp.file_location);

        dateFormAppCreated = await apps.importPublishDeployApp(this.alfrescoJsApiUserTwo, dateFormApp.file_location);

        appId = appCreated.id;
    });

    afterAll(async () => {
        await this.alfrescoJsApiUserTwo.activiti.modelsApi.deleteModel(appId);
        await this.alfrescoJsApiUserTwo.activiti.modelsApi.deleteModel(simpleAppCreated.id);
        await this.alfrescoJsApiUserTwo.activiti.modelsApi.deleteModel(dateFormAppCreated.id);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
    });

    describe(' Once logged with user without apps', () => {

        beforeEach(async () => {
            await loginPage.loginToProcessServicesUsingUserModel(procUserModel);
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
        });

        it('[C260458] Should NOT be able to start a process without process model', async () => {
            await processServicesPage.goToApp('Task App');
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.checkNoProcessMessage();
        });
    });

    describe(' Once logged with user with app', () => {

        beforeAll(async () => {
            await loginPage.loginToProcessServicesUsingUserModel(secondProcUserModel);
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
        });

        it('[C260441] Should display start process form and default name when creating a new process', async () => {
            await processServicesPage.goToApp('Task App');
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await expect(await startProcessPage.getDefaultName()).toEqual('My Default Name');
        });

        it('[C260445] Should require process definition and be possible to click cancel button', async () => {
            await processServicesPage.goToApp('Task App');
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.enterProcessName('');
            await browser.actions().sendKeys('v\b\b').perform(); // clear doesn't trigger the validator
            await startProcessPage.checkStartProcessButtonIsDisabled();
            await startProcessPage.clickCancelProcessButton();
            await processFiltersPage.checkNoContentMessage();
        });

        it('[C260444] Should require process name', async () => {
            await processServicesPage.goToApp(app.title);

            await processServiceTabBarPage.clickProcessButton();

            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();

            await startProcessPage.selectFromProcessDropdown(processModelWithoutSe);
            await startProcessPage.deleteDefaultName('My Default Name');

            await browser.sleep(1000);

            await startProcessPage.checkStartProcessButtonIsDisabled();
            await startProcessPage.clickProcessDropdownArrow();
            await startProcessPage.checkOptionIsDisplayed(processModelWithSe);
            await startProcessPage.checkOptionIsDisplayed(processModelWithoutSe);
        });

        it('[C260443] Should be possible to start a process without start event', async () => {
            await processServicesPage.goToApp(app.title);

            await processServiceTabBarPage.clickProcessButton();

            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();

            await expect(await startProcessPage.checkSelectProcessPlaceholderIsDisplayed()).toBe('');

            await startProcessPage.selectFromProcessDropdown(processModelWithoutSe);

            await expect(await startProcessPage.getDefaultName()).toEqual('My Default Name');

            await startProcessPage.checkStartProcessButtonIsEnabled();
        });

        it('[C260449] Should be possible to start a process with start event', async () => {
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.enterProcessName('Test');
            await startProcessPage.selectFromProcessDropdown(processModelWithSe);
            await startProcessPage.clickFormStartProcessButton();
            await processDetailsPage.checkDetailsAreDisplayed();
            const processId = await processDetailsPage.getId();
            const response = await this.alfrescoJsApi.activiti.processApi.getProcessInstance(processId);

            await expect(await processDetailsPage.getProcessStatus()).toEqual(CONSTANTS.PROCESS_STATUS.RUNNING);
            await expect(await processDetailsPage.getEndDate()).toEqual(CONSTANTS.PROCESS_END_DATE);
            await expect(await processDetailsPage.getProcessCategory()).toEqual(CONSTANTS.PROCESS_CATEGORY);
            await expect(await processDetailsPage.getBusinessKey()).toEqual(CONSTANTS.PROCESS_BUSINESS_KEY);
            await expect(await processDetailsPage.getCreatedBy()).toEqual(`${response.startedBy.firstName} ${response.startedBy.lastName}`);
            await expect(await processDetailsPage.getCreated()).toEqual(dateFormat(CONSTANTS.PROCESS_DATE_FORMAT));
            await expect(await processDetailsPage.getId()).toEqual(response.id);
            await expect(await processDetailsPage.getProcessDescription()).toEqual(CONSTANTS.PROCESS_DESCRIPTION);
            await expect(await processDetailsPage.checkProcessTitleIsDisplayed()).toEqual(response.name);
        });

        it('[C286503] Should NOT display any process definition when typing a non-existent one', async () => {
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.typeProcessDefinition('nonexistent');
            await startProcessPage.checkNoProcessDefinitionOptionIsDisplayed();
            await startProcessPage.checkStartProcessButtonIsDisabled();
        });

        it('[C286504] Should display proper options when typing a part of existent process definitions', async () => {
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.typeProcessDefinition('process');
            await startProcessPage.checkOptionIsDisplayed(processModelWithoutSe);
            await startProcessPage.checkOptionIsDisplayed(processModelWithSe);
            await startProcessPage.selectOption(processModelWithoutSe);
            await startProcessPage.checkStartProcessButtonIsEnabled();
        });

        it('[C286508] Should display only one option when typing an existent process definition', async () => {
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.typeProcessDefinition(processModelWithoutSe);
            await startProcessPage.checkOptionIsDisplayed(processModelWithoutSe);
            await startProcessPage.checkOptionIsNotDisplayed(processModelWithSe);
            await startProcessPage.selectOption(processModelWithoutSe);
            await startProcessPage.checkStartProcessButtonIsEnabled();
        });

        it('[C286509] Should select automatically the processDefinition when the app contains only one', async () => {
            await processServicesPage.goToApp(simpleApp.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await expect(await startProcessPage.getProcessDefinitionValue()).toBe(simpleApp.title);
            await startProcessPage.checkStartProcessButtonIsEnabled();
        });

        it('[C286511] Should be able to type the process definition and start a process', async () => {
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.enterProcessName('Type');
            await startProcessPage.typeProcessDefinition(processModelWithoutSe);
            await startProcessPage.selectOption(processModelWithoutSe);
            await startProcessPage.checkStartProcessButtonIsEnabled();
            await expect(await startProcessPage.getProcessDefinitionValue()).toBe(processModelWithoutSe);
            await startProcessPage.clickStartProcessButton();
            await processFiltersPage.clickRunningFilterButton();
            await processFiltersPage.selectFromProcessList('Type');
        });

        it('[C286513] Should be able to use down arrow key when navigating throw suggestions', async () => {
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.typeProcessDefinition('process');

            await startProcessPage.pressDownArrowAndEnter();
            await expect(await startProcessPage.getProcessDefinitionValue()).toBe(processModelWithoutSe);
        });

        it('[C286514] Should the process definition input be cleared when clicking on options drop down ', async () => {
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.typeProcessDefinition('process');
            await startProcessPage.selectOption(processModelWithoutSe);
            await expect(await startProcessPage.getProcessDefinitionValue()).toBe(processModelWithoutSe);
            await startProcessPage.clickProcessDropdownArrow();

            await expect(await startProcessPage.getProcessDefinitionValue()).toBe('');
        });

        it('[C260453] Should be possible to add a comment on an active process', async () => {
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.enterProcessName('Comment Process');
            await startProcessPage.selectFromProcessDropdown(processModelWithSe);
            await startProcessPage.clickFormStartProcessButton();
            await processFiltersPage.clickRunningFilterButton();
            await processFiltersPage.selectFromProcessList('Comment Process');
            await processDetailsPage.addComment('comment1');
            await processDetailsPage.checkCommentIsDisplayed('comment1');
        });

        it('[C260454] Should be possible to download audit log file', async () => {
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.enterProcessName('Audit Log');
            await startProcessPage.selectFromProcessDropdown(processModelWithSe);
            await startProcessPage.clickFormStartProcessButton();
            await processFiltersPage.clickRunningFilterButton();
            await processFiltersPage.selectFromProcessList('Audit Log');
            await processDetailsPage.clickAuditLogButton();

            await expect(await FileBrowserUtil.isFileDownloaded(auditLogFile)).toBe(true);
        });

        it('Should be able to attach a file using the button', async () => {
            await processServicesPage.goToApp(app.title);

            await processServiceTabBarPage.clickProcessButton();

            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();

            await startProcessPage.enterProcessName('Attach File');
            await startProcessPage.selectFromProcessDropdown(processModelWithSe);
            await startProcessPage.clickFormStartProcessButton();

            await processFiltersPage.clickRunningFilterButton();
            await processFiltersPage.selectFromProcessList('Attach File');

            await attachmentListPage.clickAttachFileButton(jpgFile.location);
            await attachmentListPage.checkFileIsAttached(jpgFile.name);
        });

        it('[C260451] Should be possible to display process diagram', async () => {
            await processServicesPage.goToApp(app.title);

            await processServiceTabBarPage.clickProcessButton();

            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();

            await startProcessPage.enterProcessName('Show Diagram');
            await startProcessPage.selectFromProcessDropdown(processModelWithSe);
            await startProcessPage.clickFormStartProcessButton();

            await processFiltersPage.clickRunningFilterButton();
            await processFiltersPage.selectFromProcessList('Show Diagram');

            await processDetailsPage.clickShowDiagram();
        });

        it('[C260452] Should redirect user when clicking on active/completed task', async () => {
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.enterProcessName('Active Task');
            await startProcessPage.selectFromProcessDropdown(processModelWithSe);
            await startProcessPage.clickFormStartProcessButton();
            await processFiltersPage.clickRunningFilterButton();
            await processFiltersPage.selectFromProcessList('Active Task');
            await processDetailsPage.clickOnActiveTask();
            await processDetailsPage.checkActiveTaskTitleIsDisplayed();
        });

        it('[C260457] Should display process in Completed when cancelled', async () => {
            await loginPage.loginToProcessServicesUsingUserModel(secondProcUserModel);
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.enterProcessName('Cancel Process');
            await startProcessPage.selectFromProcessDropdown(processModelWithSe);
            await startProcessPage.clickFormStartProcessButton();
            await processFiltersPage.clickRunningFilterButton();
            await processFiltersPage.selectFromProcessList('Cancel Process');
            await processDetailsPage.clickCancelProcessButton();
            await processFiltersPage.clickCompletedFilterButton();
            await processFiltersPage.selectFromProcessList('Cancel Process');
            await processDetailsPage.checkShowDiagramIsDisabled();
        });

        it('[C260461] Should be possible to add a comment on a completed/canceled process', async () => {
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.enterProcessName('Comment Process 2');
            await startProcessPage.selectFromProcessDropdown(processModelWithSe);
            await startProcessPage.clickFormStartProcessButton();
            await processFiltersPage.clickRunningFilterButton();
            await processFiltersPage.selectFromProcessList('Comment Process 2');
            await processDetailsPage.clickCancelProcessButton();
            await processFiltersPage.clickCompletedFilterButton();
            await processFiltersPage.selectFromProcessList('Comment Process 2');
            await processDetailsPage.addComment('goodbye');
            await processDetailsPage.checkCommentIsDisplayed('goodbye');
        });

        it('[C260467] Should NOT be possible to attach a file on a completed process', async () => {
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.enterProcessName('File');
            await startProcessPage.selectFromProcessDropdown(processModelWithSe);
            await startProcessPage.clickFormStartProcessButton();
            await processFiltersPage.clickRunningFilterButton();
            await processFiltersPage.selectFromProcessList('File');
            await processDetailsPage.clickCancelProcessButton();
            await processFiltersPage.clickCompletedFilterButton();
            await processFiltersPage.selectFromProcessList('File');
            await attachmentListPage.checkAttachFileButtonIsNotDisplayed();
        });

        it('[C291781] Should be displayed an error message if process name exceed 255 characters', async () => {
            await processServicesPage.goToApp(app.title);

            await processServiceTabBarPage.clickProcessButton();

            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();

            await startProcessPage.enterProcessName(processName255Characters);
            await startProcessPage.selectFromProcessDropdown(processModelWithoutSe);
            await startProcessPage.checkStartProcessButtonIsEnabled();

            await startProcessPage.enterProcessName(processNameBiggerThen255Characters);
            await startProcessPage.checkValidationErrorIsDisplayed(lengthValidationError);
            await startProcessPage.checkStartProcessButtonIsDisabled();
        });

        it('[C261039] Advanced date time widget', async () => {
            await processServicesPage.goToApp(dateFormApp.title);
            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.enterProcessName('DateFormProcess');
            await startProcessPage.formFields().checkWidgetIsVisible('testdate');
            await widget.dateWidget().setDateInput('testdate', '15-7-2019');
            await startProcessPage.checkStartFormProcessButtonIsEnabled();
            await startProcessPage.clickFormStartProcessButton();

            await processFiltersPage.clickRunningFilterButton();
            await processFiltersPage.selectFromProcessList('DateFormProcess');
            await processDetailsPage.clickOnStartForm();
            await startProcessDialog.checkStartProcessDialogIsDisplayed();
            await expect(await startProcessDialog.getTitle()).toBe('Start Form');
            await expect(await (await widget.dateWidget()).getDateInput('testdate')).toBe('15-7-2019');
            await startProcessDialog.clickCloseButton();
            await startProcessDialog.checkStartProcessDialogIsNotDisplayed();
        });
    });
});
