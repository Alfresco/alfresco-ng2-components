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

import { browser } from 'protractor';
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
    Widget, LocalStorageUtil, StartProcessCloudPage, TaskHeaderCloudPage, ProcessHeaderCloudPage, TasksService, UploadActions,
    ContentNodeSelectorDialogPage, ProcessInstancesService
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
    const uploadLocalFileProcess = StringUtil.generateRandomString(5);
    const uploadContentFileProcess = StringUtil.generateRandomString(5);
    const uploadDefaultFileProcess = StringUtil.generateRandomString(5);
    const cancelUploadFileProcess = StringUtil.generateRandomString(5);
    const completeUploadFileProcess = StringUtil.generateRandomString(5);
    let testUser, acsUser, groupInfo;
    const processList: string[] = [];
    const candidateBaseApp = resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.name;
    const pdfFile = new FileModel({'name': resources.Files.ADF_DOCUMENTS.PDF.file_name});
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

    beforeAll(async (done) => {

        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);

        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

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
            'alfresco');
        loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        await LocalStorageUtil.setConfigField('adf-cloud-start-process', JSON.stringify(startProcessCloudConfig));
        done();
    });

    afterAll(async (done) => {
        try {
            await this.alfrescoJsApi.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await uploadActions.deleteFileOrFolder(uploadedFolder.entry.id);
            await apiService.login(testUser.email, testUser.password);
            const tasksService = new TasksService(apiService);
            const standAloneTaskId = await tasksService.getTaskId(standaloneTaskName, candidateBaseApp);
            await tasksService.deleteTask(standAloneTaskId, candidateBaseApp);
            const processInstanceServices = new ProcessInstancesService(apiService);
            for (let i = 0; i < processList.length; i++) {
                await processInstanceServices.deleteProcessInstance(processList[i], candidateBaseApp);
            }
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);
        } catch (error) {
        }
        done();
    });

    describe('StandaloneTask with form', () => {

        beforeEach(() => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            appListCloudComponent.goToApp(candidateBaseApp);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        });

        it('[C307976] Should be able to start and save a task with a form', () => {
            tasksCloudDemoPage.openNewTaskForm();
            startTask.checkFormIsDisplayed();
            startTask.addName(standaloneTaskName);
            startTask.selectFormDefinition('StartEventForm');
            startTask.clickStartButton();
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(standaloneTaskName);
            tasksCloudDemoPage.taskListCloudComponent().selectRow(standaloneTaskName);
            taskFormCloudComponent.formFields().checkFormIsDisplayed();
            taskFormCloudComponent.formFields().checkWidgetIsVisible('FirstName');
            taskFormCloudComponent.formFields().checkWidgetIsVisible('Number07vyx9');
            widget.textWidget().setValue('FirstName', 'sample');
            widget.numberWidget().setFieldValue('Number07vyx9', 26);
            taskFormCloudComponent.checkSaveButtonIsDisplayed().clickSaveButton();
            expect(widget.textWidget().getFieldValue('FirstName')).toBe('sample');
            expect(widget.numberWidget().getFieldValue('Number07vyx9')).toBe('26');

            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            appListCloudComponent.goToApp(candidateBaseApp);
            tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();

            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(standaloneTaskName);
            tasksCloudDemoPage.taskListCloudComponent().selectRow(standaloneTaskName);
            taskFormCloudComponent.formFields().checkFormIsDisplayed();
            expect(widget.textWidget().getFieldValue('FirstName')).toBe('sample');
            expect(widget.numberWidget().getFieldValue('Number07vyx9')).toBe('26');
            taskFormCloudComponent.checkCompleteButtonIsDisplayed();
        });

    });

    describe('Start a process with a start event form', () => {

        beforeEach(() => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            appListCloudComponent.goToApp(candidateBaseApp);
            processCloudDemoPage.openNewProcessForm();
            startProcessPage.clearField(startProcessPage.processNameInput);
            startProcessPage.enterProcessName(startEventFormProcess);
            startProcessPage.selectFromProcessDropdown('processwithstarteventform');
            startProcessPage.formFields().checkFormIsDisplayed();
        });
        it('[C311277] Should be able to start a process with a start event form - default values', async () => {

            expect(widget.textWidget().getFieldValue('FirstName')).toBe('sample name');
            expect(widget.numberWidget().getFieldValue('Number07vyx9')).toBe('17');
        });

        it('[C311277] Should be able to start a process with a start event form - form validation', async () => {

            expect(widget.textWidget().getErrorMessage('FirstName')).toBe('Enter no more than 10 characters');
            expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);

            widget.textWidget().setValue('FirstName', 'Sam');
            expect(widget.textWidget().getErrorMessage('FirstName')).toBe('Enter at least 5 characters');
            expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);
            widget.numberWidget().setFieldValue('Number07vyx9', 9);
            expect(widget.numberWidget().getErrorMessage('Number07vyx9')).toBe('Can\'t be less than 10');
            expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);
            widget.numberWidget().setFieldValue('Number07vyx9', 99999);
            expect(widget.numberWidget().getErrorMessage('Number07vyx9')).toBe('Can\'t be greater than 1,000');
            expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);
        });

        it('[C311277] Should be able to start a process with a start event form - claim and complete the process', async () => {

            widget.textWidget().setValue('FirstName', 'Sample');
            widget.numberWidget().setFieldValue('Number07vyx9', 100);
            expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(true);
            startProcessPage.clickStartProcessButton();
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processName', startEventFormProcess);
            processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(startEventFormProcess);

            processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', startEventFormProcess);
            processDetailsCloudDemoPage.checkTaskIsDisplayed('StartEventFormTask');
            const processId = await processHeaderCloud.getId();
            processDetailsCloudDemoPage.selectProcessTaskByName('StartEventFormTask');
            taskFormCloudComponent.clickClaimButton();
            const taskId = await taskHeaderCloudPage.getId();
            taskFormCloudComponent.checkCompleteButtonIsDisplayed().clickCompleteButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedById(taskId);

            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(taskId);
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.completedProcessesFilter().clickProcessFilter();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(processId);

        });

    });

    describe('Attach content to process-cloud task form using upload widget', async () => {

        beforeEach(async (done) => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            appListCloudComponent.goToApp(candidateBaseApp);
            processCloudDemoPage.openNewProcessForm();
            done();
        });

        it('[C310358] Should be able to attach a file to a form from local', async () => {
            startProcessPage.clearField(startProcessPage.processNameInput);
            startProcessPage.enterProcessName(uploadLocalFileProcess);
            startProcessPage.selectFromProcessDropdown('uploadFileProcess');
            startProcessPage.clickStartProcessButton();
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processName', uploadLocalFileProcess);
            processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadLocalFileProcess);

            processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadLocalFileProcess);
            processList.push(await processHeaderCloud.getId());
            processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            taskFormCloudComponent.clickClaimButton();

            const localFileWidget = widget.attachFileWidgetCloud('Attachlocalfile');
            browser.sleep(5000);
            localFileWidget.attachLocalFile(pdfFile.location);
            localFileWidget.checkFileIsAttached(pdfFile.name);
            localFileWidget.removeFile(pdfFile.name);
            localFileWidget.checkFileIsNotAttached(pdfFile.name);
        });

        it('[C311285] Should be able to attach a file to a form from acs repository', async () => {
            startProcessPage.clearField(startProcessPage.processNameInput);
            startProcessPage.enterProcessName(uploadContentFileProcess);
            startProcessPage.selectFromProcessDropdown('uploadFileProcess');
            startProcessPage.clickStartProcessButton();
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processName', uploadContentFileProcess);
            processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadContentFileProcess);

            processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadContentFileProcess);
            processList.push(await processHeaderCloud.getId());
            processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            taskFormCloudComponent.clickClaimButton();

            const contentFileWidget = widget.attachFileWidgetCloud('Attachsinglecontentfile');
            contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name);

            contentNodeSelectorDialogPage.clickMoveCopyButton();
            contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();

            contentFileWidget.checkFileIsAttached(testFileModel.name);
            contentFileWidget.removeFile(testFileModel.name);
            contentFileWidget.checkFileIsNotAttached(testFileModel.name);
            contentFileWidget.checkUploadContentButtonIsDisplayed('Attachsinglecontentfile');
        });

        it('[C311287] Content node selector default location when attaching a file to a form from acs repository', async () => {
            startProcessPage.clearField(startProcessPage.processNameInput);
            startProcessPage.enterProcessName(uploadDefaultFileProcess);
            startProcessPage.selectFromProcessDropdown('uploadFileProcess');
            startProcessPage.clickStartProcessButton();
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processName', uploadDefaultFileProcess);
            processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadDefaultFileProcess);

            processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadDefaultFileProcess);
            processList.push(await processHeaderCloud.getId());
            processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            taskFormCloudComponent.clickClaimButton();

            const contentFileWidget = widget.attachFileWidgetCloud('Attachsinglecontentfile');
            contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            expect(breadCrumbDropdownPage.getTextOfCurrentFolder()).toBe(testUser.username);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowContentIsDisplayed(folderName);
            expect(contentNodeSelectorDialogPage.checkCancelButtonIsEnabled()).toBe(true);
            expect(contentNodeSelectorDialogPage.checkCopyMoveButtonIsEnabled()).toBe(false);

            contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(folderName);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(folderName);
            expect(contentNodeSelectorDialogPage.checkCancelButtonIsEnabled()).toBe(true);
            expect(contentNodeSelectorDialogPage.checkCopyMoveButtonIsEnabled()).toBe(false);
            contentNodeSelectorDialogPage.clickCancelButton();
            contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();
        });

        it('[C311288] No file should be attached when canceling the content node selector', async () => {
            startProcessPage.clearField(startProcessPage.processNameInput);
            startProcessPage.enterProcessName(cancelUploadFileProcess);
            startProcessPage.selectFromProcessDropdown('uploadFileProcess');
            startProcessPage.clickStartProcessButton();
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processName', cancelUploadFileProcess);
            processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(cancelUploadFileProcess);

            processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', cancelUploadFileProcess);
            processList.push(await processHeaderCloud.getId());
            processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            taskFormCloudComponent.clickClaimButton();

            const contentFileWidget = widget.attachFileWidgetCloud('Attachsinglecontentfile');
            contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowContentIsDisplayed(folderName);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name);

            contentNodeSelectorDialogPage.clickCancelButton();
            contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();
            contentFileWidget.checkFileIsNotAttached(testFileModel.name);
        });

        it('[C311289] Should be able to attach single file', async () => {
            startProcessPage.clearField(startProcessPage.processNameInput);
            startProcessPage.enterProcessName(uploadContentFileProcess);
            startProcessPage.selectFromProcessDropdown('uploadFileProcess');
            startProcessPage.clickStartProcessButton();
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processName', uploadContentFileProcess);
            processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadContentFileProcess);

            processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadContentFileProcess);
            processList.push(await processHeaderCloud.getId());
            processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            taskFormCloudComponent.clickClaimButton();

            const contentFileWidget = widget.attachFileWidgetCloud('Attachsinglecontentfile');
            contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name);

            contentNodeSelectorDialogPage.clickMoveCopyButton();
            contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();

            contentFileWidget.checkFileIsAttached(testFileModel.name);
            contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
        });

        it('[C311292] Attached file is not displayed anymore after release if the form is not saved', async () => {
            startProcessPage.clearField(startProcessPage.processNameInput);
            startProcessPage.enterProcessName(uploadContentFileProcess);
            startProcessPage.selectFromProcessDropdown('uploadFileProcess');
            startProcessPage.clickStartProcessButton();
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processName', uploadContentFileProcess);
            processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadContentFileProcess);

            processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadContentFileProcess);
            processList.push(await processHeaderCloud.getId());
            processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            taskFormCloudComponent.clickClaimButton();

            const contentFileWidget = widget.attachFileWidgetCloud('Attachsinglecontentfile');
            contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name);

            contentNodeSelectorDialogPage.clickMoveCopyButton();
            contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();

            contentFileWidget.checkFileIsAttached(testFileModel.name);
            contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
            taskFormCloudComponent.clickReleaseButton();
            taskFormCloudComponent.clickClaimButton();
            contentFileWidget.checkFileIsNotAttached(testFileModel.name);
            contentFileWidget.checkUploadContentButtonIsDisplayed('Attachsinglecontentfile');
        });

        it('[C311293] Attached file is displayed after release if the form was saved', async () => {
            startProcessPage.clearField(startProcessPage.processNameInput);
            startProcessPage.enterProcessName(uploadContentFileProcess);
            startProcessPage.selectFromProcessDropdown('uploadFileProcess');
            startProcessPage.clickStartProcessButton();
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processName', uploadContentFileProcess);
            processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadContentFileProcess);
            processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadContentFileProcess);
            processList.push(await processHeaderCloud.getId());
            processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            taskFormCloudComponent.clickClaimButton();

            const contentFileWidget = widget.attachFileWidgetCloud('Attachsinglecontentfile');
            contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name);
            contentNodeSelectorDialogPage.clickMoveCopyButton();
            contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();
            contentFileWidget.checkFileIsAttached(testFileModel.name);
            contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
            taskFormCloudComponent.clickSaveButton();
            taskFormCloudComponent.clickReleaseButton();
            taskFormCloudComponent.clickClaimButton();
            contentFileWidget.checkFileIsAttached(testFileModel.name);
            contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
        });

        it('[C311295] AAttached file is displayed after complete', async () => {
            startProcessPage.clearField(startProcessPage.processNameInput);
            startProcessPage.enterProcessName(completeUploadFileProcess);
            startProcessPage.selectFromProcessDropdown('uploadFileProcess');
            startProcessPage.clickStartProcessButton();
            processCloudDemoPage.clickOnProcessFilters();
            processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setProperty('processName', completeUploadFileProcess);
            processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(completeUploadFileProcess);
            processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', completeUploadFileProcess);
            processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            taskFormCloudComponent.clickClaimButton();

            const contentFileWidget = widget.attachFileWidgetCloud('Attachsinglecontentfile');
            contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            contentNodeSelectorDialogPage.checkDialogIsDisplayed();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded();
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);
            contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name);
            contentNodeSelectorDialogPage.clickMoveCopyButton();
            contentNodeSelectorDialogPage.checkDialogIsNotDisplayed();
            contentFileWidget.checkFileIsAttached(testFileModel.name);
            contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
            const taskId = await taskHeaderCloudPage.getId();
            taskFormCloudComponent.checkCompleteButtonIsDisplayed().clickCompleteButton();
            expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedById(taskId);

            tasksCloudDemoPage.completedTasksFilter().clickTaskFilter();
            tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(taskId);
            tasksCloudDemoPage.taskListCloudComponent().selectRowByTaskId(taskId);
            contentFileWidget.checkFileIsAttached(testFileModel.name);
            contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
        });
    });
});
