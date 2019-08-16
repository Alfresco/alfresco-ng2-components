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

import { browser, protractor } from 'protractor';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import {
    LoginSSOPage,
    AppListCloudPage,
    StringUtil,
    StartTasksCloudPage,
    ApiService,
    IdentityService,
    SettingsPage,
    GroupIdentityService,
    TaskFormCloudComponent,
    Widget,
    LocalStorageUtil,
    StartProcessCloudPage,
    TaskHeaderCloudPage,
    ProcessHeaderCloudPage,
    TasksService,
    UploadActions,
    ContentNodeSelectorDialogPage,
    ProcessInstancesService,
    ProcessDefinitionsService
} from '@alfresco/adf-testing';
import resources = require('../util/resources');
import { StartProcessCloudConfiguration } from './config/start-process-cloud.config';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { ProcessDetailsCloudDemoPage } from '../pages/adf/demo-shell/process-services-cloud/processDetailsCloudDemoPage';
import { FileModel } from '../models/ACS/fileModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import { BreadCrumbDropdownPage } from '../pages/adf/content-services/breadcrumb/breadCrumbDropdownPage';

describe('Start Task Form', () => {

    const loginSSOPage = new LoginSSOPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const startTask = new StartTasksCloudPage();
    const contentNodeSelectorDialogPage = new ContentNodeSelectorDialogPage();
    const breadCrumbDropdownPage = new BreadCrumbDropdownPage();
    const processDetailsCloudDemoPage = new ProcessDetailsCloudDemoPage();
    const settingsPage = new SettingsPage();
    const widget = new Widget();
    const startProcessPage = new StartProcessCloudPage();
    const processCloudDemoPage = new ProcessCloudDemoPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const processHeaderCloud = new ProcessHeaderCloudPage();
    const apiService = new ApiService(
        browser.params.config.oauth2.clientId,
        browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
    );
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.config.bpmHost
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    const startProcessCloudConfiguration = new StartProcessCloudConfiguration();
    const startProcessCloudConfig = startProcessCloudConfiguration.getConfiguration();

    const standaloneTaskName = StringUtil.generateRandomString(5);
    const startEventFormProcess = StringUtil.generateRandomString(5);
    let testUser, acsUser, groupInfo;
    let processDefinitionService: ProcessDefinitionsService;
    let processInstancesService: ProcessInstancesService;
    let processDefinition, uploadLocalFileProcess, uploadContentFileProcess, uploadDefaultFileProcess,
        cancelUploadFileProcess, completeUploadFileProcess;
    const candidateBaseApp = resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.name;
    const pdfFile = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    const pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    const testFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;
    const folderName = StringUtil.generateRandomString(5);
    let uploadedFolder;

    beforeAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await apiService.login(testUser.email, testUser.password);
        processDefinitionService = new ProcessDefinitionsService(apiService);
        processInstancesService = new ProcessInstancesService(apiService);
        processDefinition = await processDefinitionService
            .getProcessDefinitionByName(resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.processes.uploadFileProcess, candidateBaseApp);

        await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp);

        uploadLocalFileProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            'name': StringUtil.generateRandomString(),
            'businessKey': StringUtil.generateRandomString()
        });

        uploadContentFileProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            'name': StringUtil.generateRandomString(),
            'businessKey': StringUtil.generateRandomString()
        });

        uploadDefaultFileProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            'name': StringUtil.generateRandomString(),
            'businessKey': StringUtil.generateRandomString()
        });

        cancelUploadFileProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            'name': StringUtil.generateRandomString(),
            'businessKey': StringUtil.generateRandomString()
        });

        completeUploadFileProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            'name': StringUtil.generateRandomString(),
            'businessKey': StringUtil.generateRandomString()
        });

        acsUser = await new AcsUserModel({
            email: testUser.email,
            password: testUser.password,
            id: testUser.username,
            firstName: testUser.firstName,
            lastName: testUser.lastName
        });
        await this.alfrescoJsApi.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
        await uploadActions.uploadFile(testFileModel.location, testFileModel.name, uploadedFolder.entry.id);
        await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, uploadedFolder.entry.id);

        await settingsPage.setProviderEcmBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost,
            browser.params.config.oauth2.clientId);
        await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        await LocalStorageUtil.setConfigField('adf-cloud-start-process', JSON.stringify(startProcessCloudConfig));
    });

    afterAll(async () => {
        await uploadActions.deleteFileOrFolder(uploadedFolder.entry.id);
        await apiService.login(testUser.email, testUser.password);
        const tasksService = new TasksService(apiService);
        const standAloneTaskId = await tasksService.getTaskId(standaloneTaskName, candidateBaseApp);
        await tasksService.deleteTask(standAloneTaskId, candidateBaseApp);

        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    describe('StandaloneTask with form', () => {

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            await appListCloudComponent.goToApp(candidateBaseApp);
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        });

        it('[C307976] Should be able to start and save a task with a form', async () => {
            await tasksCloudDemoPage.openNewTaskForm();
            await startTask.checkFormIsDisplayed();
            await startTask.addName(standaloneTaskName);
            await startTask.selectFormDefinition('StartEventForm');
            await startTask.clickStartButton();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(standaloneTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(standaloneTaskName);
            await taskFormCloudComponent.formFields().checkFormIsDisplayed();
            await taskFormCloudComponent.formFields().checkWidgetIsVisible('FirstName');
            await taskFormCloudComponent.formFields().checkWidgetIsVisible('Number07vyx9');
            await widget.textWidget().setValue('FirstName', 'sample');
            await widget.numberWidget().setFieldValue('Number07vyx9', 26);
            await taskFormCloudComponent.checkSaveButtonIsDisplayed();
            await taskFormCloudComponent.clickSaveButton();
            await expect(await widget.textWidget().getFieldValue('FirstName')).toBe('sample');
            await expect(await widget.numberWidget().getFieldValue('Number07vyx9')).toBe('26');

            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            await appListCloudComponent.goToApp(candidateBaseApp);
            await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(standaloneTaskName);
            await tasksCloudDemoPage.taskListCloudComponent().selectRow(standaloneTaskName);
            await taskFormCloudComponent.formFields().checkFormIsDisplayed();
            await expect(await widget.textWidget().getFieldValue('FirstName')).toBe('sample');
            await expect(await widget.numberWidget().getFieldValue('Number07vyx9')).toBe('26');
            await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
        });

        it('[C311428] Should display the Standalone forms based on the flag set', async () => {
            await tasksCloudDemoPage.openNewTaskForm();
            await startTask.checkFormIsDisplayed();
            await startTask.checkFormDefinitionIsNotDisplayed('UploadFileForm');
            await startTask.checkFormDefinitionIsDisplayed('StartEventForm');
            await startTask.checkFormDefinitionIsDisplayed('FormToTestValidations');
        });

    });

    describe('Start a process with a start event form', async () => {

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            await appListCloudComponent.goToApp(candidateBaseApp);
            await processCloudDemoPage.openNewProcessForm();
            await startProcessPage.clearField(startProcessPage.processNameInput);
            await startProcessPage.enterProcessName(startEventFormProcess);
            await startProcessPage.selectFromProcessDropdown('processwithstarteventform');
            await startProcessPage.formFields().checkFormIsDisplayed();
        });

        it('[C311277] Should be able to start a process with a start event form - default values', async () => {
            await expect(await widget.textWidget().getFieldValue('FirstName')).toBe('sample name');
            await expect(await widget.numberWidget().getFieldValue('Number07vyx9')).toBe('17');
        });

        it('[C311277] Should be able to start a process with a start event form - form validation', async () => {
            await expect(await widget.textWidget().getErrorMessage('FirstName')).toContain('Enter no more than 10 characters');
            await expect(await startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);

            await widget.textWidget().setValue('FirstName', 'Sam');
            await expect(await widget.textWidget().getErrorMessage('FirstName')).toContain('Enter at least 5 characters');
            await expect(await startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);
            await widget.numberWidget().setFieldValue('Number07vyx9', 9);
            await expect(await widget.numberWidget().getErrorMessage('Number07vyx9')).toContain('Can\'t be less than 10');
            await expect(await startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);
            await widget.numberWidget().setFieldValue('Number07vyx9', 99999);
            await expect(await widget.numberWidget().getErrorMessage('Number07vyx9')).toContain('Can\'t be greater than 1,000');
            await expect(await startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);
        });

        it('[C311277] Should be able to start a process with a start event form - claim and complete the process', async () => {
            await widget.textWidget().setValue('FirstName', 'Sample');
            await widget.numberWidget().setFieldValue('Number07vyx9', 100);
            await expect(await startProcessPage.checkStartProcessButtonIsEnabled()).toBe(true);
            await startProcessPage.clickStartProcessButton();
            await processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            await expect(await processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            await processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader();
            await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processName', startEventFormProcess);

            await browser.sleep(1000);

            await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(startEventFormProcess);

            await processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', startEventFormProcess);
            await browser.actions().sendKeys(protractor.Key.ENTER).perform();

            await processDetailsCloudDemoPage.checkTaskIsDisplayed('StartEventFormTask');
            const processId = await processHeaderCloud.getId();
            await processDetailsCloudDemoPage.selectProcessTaskByName('StartEventFormTask');
            await taskFormCloudComponent.clickClaimButton();
            const taskId = await taskHeaderCloudPage.getId();
            await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
            await taskFormCloudComponent.clickCompleteButton();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedById(taskId);

            await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(taskId);

            await processCloudDemoPage.clickOnProcessFilters();
            await processCloudDemoPage.completedProcessesFilter().clickProcessFilter();
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(processId);

        });

    });

    describe('Attach content to process-cloud task form using upload widget', async () => {

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            await appListCloudComponent.goToApp(candidateBaseApp);
            await processCloudDemoPage.clickOnProcessFilters();
            await processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            await processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded();
        });

        it('[C310358] Should be able to attach a file to a form from local', async () => {
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadLocalFileProcess.entry.name);
            await processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadLocalFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            await taskFormCloudComponent.clickClaimButton();

            const localFileWidget = await widget.attachFileWidgetCloud('Attachlocalfile');
            await browser.sleep(5000);
            await localFileWidget.attachLocalFile(pdfFile.location);
            await localFileWidget.checkFileIsAttached(pdfFile.name);
            await localFileWidget.removeFile(pdfFile.name);
            await localFileWidget.checkFileIsNotAttached(pdfFile.name);
        });

        it('[C311285] Should be able to attach a file to a form from acs repository', async () => {
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadContentFileProcess.entry.name);
            await processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadContentFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            await taskFormCloudComponent.clickClaimButton();

            const contentFileWidget = await widget.attachFileWidgetCloud('Attachsinglecontentfile');
            await contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            await contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name);

            await contentNodeSelectorDialogPage.clickMoveCopyButton();
            await contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();

            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.removeFile(testFileModel.name);
            await contentFileWidget.checkFileIsNotAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsDisplayed('Attachsinglecontentfile');
        });

        it('[C311287] Content node selector default location when attaching a file to a form from acs repository', async () => {
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadDefaultFileProcess.entry.name);
            await processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadDefaultFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            await taskFormCloudComponent.clickClaimButton();

            const contentFileWidget = await widget.attachFileWidgetCloud('Attachsinglecontentfile');
            await contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            await contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            await expect(await breadCrumbDropdownPage.getTextOfCurrentFolder()).toBe(testUser.username);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowContentIsDisplayed(folderName);
            await expect(await contentNodeSelectorDialogPage.checkCancelButtonIsEnabled()).toBe(true);
            await expect(await contentNodeSelectorDialogPage.checkCopyMoveButtonIsEnabled()).toBe(false);

            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(folderName);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(folderName);
            await expect(await contentNodeSelectorDialogPage.checkCancelButtonIsEnabled()).toBe(true);
            await expect(await contentNodeSelectorDialogPage.checkCopyMoveButtonIsEnabled()).toBe(false);
            await contentNodeSelectorDialogPage.clickCancelButton();
            await contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();
        });

        it('[C311288] No file should be attached when canceling the content node selector', async () => {
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(cancelUploadFileProcess.entry.name);
            await processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', cancelUploadFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            await taskFormCloudComponent.clickClaimButton();

            const contentFileWidget = await widget.attachFileWidgetCloud('Attachsinglecontentfile');
            await contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            await contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowContentIsDisplayed(folderName);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name);

            await contentNodeSelectorDialogPage.clickCancelButton();
            await contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();
            await contentFileWidget.checkFileIsNotAttached(testFileModel.name);
        });

        it('[C311289] Should be able to attach single file', async () => {
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadContentFileProcess.entry.name);
            await processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadContentFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');

            const contentFileWidget = await widget.attachFileWidgetCloud('Attachsinglecontentfile');
            await contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            await contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name);

            await contentNodeSelectorDialogPage.clickMoveCopyButton();
            await contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();

            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
        });

        it('[C311292] Attached file is not displayed anymore after release if the form is not saved', async () => {
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadContentFileProcess.entry.name);
            await processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadContentFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');

            const contentFileWidget = await widget.attachFileWidgetCloud('Attachsinglecontentfile');
            await contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            await contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name);

            await contentNodeSelectorDialogPage.clickMoveCopyButton();
            await contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();

            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
            await taskFormCloudComponent.clickReleaseButton();
            await taskFormCloudComponent.clickClaimButton();
            await contentFileWidget.checkFileIsNotAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsDisplayed('Attachsinglecontentfile');
        });

        it('[C311293] Attached file is displayed after release if the form was saved', async () => {
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadContentFileProcess.entry.name);
            await processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadContentFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');

            const contentFileWidget = await widget.attachFileWidgetCloud('Attachsinglecontentfile');
            await contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            await contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name);
            await contentNodeSelectorDialogPage.clickMoveCopyButton();
            await contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();
            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
            await taskFormCloudComponent.clickSaveButton();
            await taskFormCloudComponent.clickReleaseButton();
            await taskFormCloudComponent.clickClaimButton();
            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
        });

        it('[C311295] Attached file is displayed after complete', async () => {
            await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(completeUploadFileProcess.entry.name);
            await processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', completeUploadFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            await taskFormCloudComponent.clickClaimButton();

            const contentFileWidget = await widget.attachFileWidgetCloud('Attachsinglecontentfile');
            await contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            await contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);
            await contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name);
            await contentNodeSelectorDialogPage.clickMoveCopyButton();
            await contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();
            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
            const taskId = await taskHeaderCloudPage.getId();
            await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
            await taskFormCloudComponent.clickCompleteButton();
            await expect(await tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedById(taskId);

            await tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(taskId);
            await tasksCloudDemoPage.taskListCloudComponent().selectRowByTaskId(taskId);
            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
        });
    });
});
