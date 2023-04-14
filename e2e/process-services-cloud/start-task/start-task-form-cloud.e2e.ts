/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';
import {
    LoginPage,
    AppListCloudPage,
    BreadcrumbDropdownPage,
    StringUtil,
    StartTasksCloudPage, createApiService,
    IdentityService,
    GroupIdentityService,
    TaskFormCloudComponent,
    LocalStorageUtil,
    StartProcessCloudPage,
    TaskHeaderCloudPage,
    ProcessHeaderCloudPage,
    TasksService,
    UploadActions,
    ContentNodeSelectorDialogPage,
    ProcessInstancesService,
    ProcessDefinitionsService,
    FileBrowserUtil, ProcessCloudWidgetPage,
    QueryService
} from '@alfresco/adf-testing';
import { StartProcessCloudConfiguration } from './../config/start-process-cloud.config';
import { ProcessCloudDemoPage } from './../pages/process-cloud-demo.page';
import { ProcessDetailsCloudDemoPage } from './../pages/process-details-cloud-demo.page';
import { FileModel } from '../../models/ACS/file.model';
import CONSTANTS = require('../../util/constants');

describe('Start Task Form', () => {

    const loginSSOPage = new LoginPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskFilter = tasksCloudDemoPage.taskFilterCloudComponent;
    const taskList = tasksCloudDemoPage.taskListCloudComponent();

    const startTask = new StartTasksCloudPage();
    const contentNodeSelectorDialogPage = new ContentNodeSelectorDialogPage();
    const breadCrumbDropdownPage = new BreadcrumbDropdownPage();
    const processDetailsCloudDemoPage = new ProcessDetailsCloudDemoPage();
    const widget = new ProcessCloudWidgetPage();
    const startProcessPage = new StartProcessCloudPage();

    const processCloudDemoPage = new ProcessCloudDemoPage();
    const editProcessFilter = processCloudDemoPage.editProcessFilterCloudComponent();
    const processList = processCloudDemoPage.processListCloudComponent();
    const processFilter = processCloudDemoPage.processFilterCloudComponent;

    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const processHeaderCloud = new ProcessHeaderCloudPage();

    const apiService = createApiService();
    const uploadActions = new UploadActions(apiService);
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);
    const queryService = new QueryService(apiService);
    const tasksService = new TasksService(apiService);

    const startProcessCloudConfiguration = new StartProcessCloudConfiguration();
    const startProcessCloudConfig = startProcessCloudConfiguration.getConfiguration();

    const standaloneTaskName = StringUtil.generateRandomString(5);
    const startEventFormProcess = StringUtil.generateRandomString(5);
    let testUser; let groupInfo;
    let processDefinitionService: ProcessDefinitionsService;
    let processInstancesService: ProcessInstancesService;
    let processDefinition; let uploadLocalFileProcess; let uploadContentFileProcess; let uploadDefaultFileProcess;
        let cancelUploadFileProcess; let completeUploadFileProcess; let downloadContentFileProcess;
    const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;
    const pdfFile = new FileModel({ name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name });
    const pdfFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
    });
    const testFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_path
    });

    const folderName = StringUtil.generateRandomString(5);
    let uploadedFolder;

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await apiService.login(testUser.username, testUser.password);
        processDefinitionService = new ProcessDefinitionsService(apiService);
        processInstancesService = new ProcessInstancesService(apiService);
        processDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.uploadFileProcess, candidateBaseApp);

        await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp);

        uploadLocalFileProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            name: StringUtil.generateRandomString(),
            businessKey: StringUtil.generateRandomString()
        });

        uploadContentFileProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            name: StringUtil.generateRandomString(),
            businessKey: StringUtil.generateRandomString()
        });
        const task = await queryService.getProcessInstanceTasks(uploadContentFileProcess.entry.id, candidateBaseApp);
        await tasksService.claimTask(task.list.entries[0].entry.id, candidateBaseApp);

        uploadDefaultFileProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            name: StringUtil.generateRandomString(),
            businessKey: StringUtil.generateRandomString()
        });

        cancelUploadFileProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            name: StringUtil.generateRandomString(),
            businessKey: StringUtil.generateRandomString()
        });

        completeUploadFileProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            name: StringUtil.generateRandomString(),
            businessKey: StringUtil.generateRandomString()
        });

        downloadContentFileProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            name: StringUtil.generateRandomString(),
            businessKey: StringUtil.generateRandomString()
        });

        await apiService.login(testUser.username, testUser.password);
        uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
        await uploadActions.uploadFile(testFileModel.location, testFileModel.name, uploadedFolder.entry.id);
        await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, uploadedFolder.entry.id);

        await loginSSOPage.login(testUser.username, testUser.password);
        await LocalStorageUtil.setConfigField('adf-cloud-start-process', JSON.stringify(startProcessCloudConfig));
    });

    afterAll(async () => {
        await uploadActions.deleteFileOrFolder(uploadedFolder.entry.id);
        await apiService.login(testUser.username, testUser.password);
        const standaloneTaskId = await tasksService.getTaskId(standaloneTaskName, candidateBaseApp);
        await tasksService.deleteTask(standaloneTaskId, candidateBaseApp);

        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    describe('StandaloneTask with form', () => {
        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            await appListCloudComponent.goToApp(candidateBaseApp);
            await taskList.getDataTable().waitForTableBody();
        });

        it('[C307976] Should be able to start and save a task with a form', async () => {
            await tasksCloudDemoPage.openNewTaskForm();
            await startTask.checkFormIsDisplayed();
            await startTask.addName(standaloneTaskName);
            await startTask.selectFormDefinition(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.forms.starteventform);
            await startTask.clickStartButton();
            await taskList.checkContentIsDisplayedByName(standaloneTaskName);
            await taskList.selectRow(standaloneTaskName);
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
            await taskList.getDataTable().waitForTableBody();

            await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');
            await taskList.checkContentIsDisplayedByName(standaloneTaskName);
            await taskList.selectRow(standaloneTaskName);
            await taskFormCloudComponent.formFields().checkFormIsDisplayed();
            await expect(await widget.textWidget().getFieldValue('FirstName')).toBe('sample');
            await expect(await widget.numberWidget().getFieldValue('Number07vyx9')).toBe('26');
            await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
        });

        it('[C311428] Should display the Standalone forms based on the flag set', async () => {
            await tasksCloudDemoPage.openNewTaskForm();
            await startTask.checkFormIsDisplayed();
            await startTask.checkFormDefinitionIsNotDisplayed(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.forms.uploadfileform);
            await startTask.checkFormDefinitionIsDisplayed(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.forms.starteventform);
            await startTask.checkFormDefinitionIsDisplayed(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.forms.formtotestvalidations);
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
            await startProcessPage.selectFromProcessDropdown(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.processwithstarteventform);
            await startProcessPage.enterProcessName(startEventFormProcess);

            await startProcessPage.formFields().checkFormIsDisplayed();
        });

        it('[C311277] Should be able to start a process with a start event form - default values', async () => {
            await expect(await widget.textWidget().getFieldValue('FirstName')).toBe('sample name');
            await expect(await widget.numberWidget().getFieldValue('Number07vyx9')).toBe('17');
        });

        it('[C311277] Should be able to start a process with a start event form - form validation', async () => {
            await expect(await widget.textWidget().getErrorMessage('FirstName')).toContain('Enter no more than 10 characters');
            await expect(await startProcessPage.isStartProcessButtonDisabled()).toEqual(true);

            await widget.textWidget().setValue('FirstName', 'Sam');
            await expect(await widget.textWidget().getErrorMessage('FirstName')).toContain('Enter at least 5 characters');
            await expect(await startProcessPage.isStartProcessButtonDisabled()).toEqual(true);
            await widget.numberWidget().setFieldValue('Number07vyx9', 9);
            await expect(await widget.numberWidget().getErrorMessage('Number07vyx9')).toContain('Can\'t be less than 10');
            await expect(await startProcessPage.isStartProcessButtonDisabled()).toEqual(true);
            await widget.numberWidget().setFieldValue('Number07vyx9', 99999);
            await expect(await widget.numberWidget().getErrorMessage('Number07vyx9')).toContain('Can\'t be greater than 1,000');
            await expect(await startProcessPage.isStartProcessButtonDisabled()).toEqual(true);
        });

        it('[C311277] Should be able to start a process with a start event form - claim and complete the process', async () => {
            await widget.textWidget().setValue('FirstName', 'Sample');
            await widget.numberWidget().setFieldValue('Number07vyx9', 100);
            await expect(await startProcessPage.isStartProcessButtonEnabled()).toEqual(true);
            await startProcessPage.clickStartProcessButton();
            await processFilter.clickRunningProcessesFilter();
            await expect(await processFilter.getActiveFilterName()).toBe(CONSTANTS.PROCESS_FILTERS.RUNNING);
            await editProcessFilter.openFilter();
            await editProcessFilter.setProcessName(startEventFormProcess);

            await processList.getDataTable().waitTillContentLoaded();
            await processList.checkContentIsDisplayedByName(startEventFormProcess);

            await processList.getDataTable().selectRow('Process Name', startEventFormProcess);
            await browser.actions().sendKeys(protractor.Key.ENTER).perform();

            await processDetailsCloudDemoPage.checkTaskIsDisplayed('StartEventFormTask');
            const processId = await processHeaderCloud.getId();
            await processDetailsCloudDemoPage.selectProcessTaskByName('StartEventFormTask');
            await taskFormCloudComponent.clickClaimButton();
            const taskId = await taskHeaderCloudPage.getId();
            await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
            await taskFormCloudComponent.clickCompleteButton();
            await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');
            await taskList.checkContentIsNotDisplayedById(taskId);

            await taskFilter.clickTaskFilter('completed-tasks');
            await taskList.getDataTable().waitTillContentLoaded();

            await taskList.checkContentIsDisplayedById(taskId);

            await processFilter.clickOnProcessFilters();
            await processFilter.clickCompletedProcessesFilter();
            await editProcessFilter.openFilter();
            await editProcessFilter.setProcessName(startEventFormProcess);
            await processList.checkContentIsDisplayedById(processId);
        });
   });

    describe('Attach content to process-cloud task form using upload widget', async () => {
        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesCloudPage();
            await appListCloudComponent.checkApsContainer();
            await appListCloudComponent.checkAppIsDisplayed(candidateBaseApp);
            await appListCloudComponent.goToApp(candidateBaseApp);
            await processFilter.clickOnProcessFilters();
            await processFilter.clickRunningProcessesFilter();
            await processList.checkProcessListIsLoaded();
        });

        it('[C310358] Should be able to attach a file to a form from local', async () => {
            await editProcessFilter.setFilter({ processName: uploadLocalFileProcess.entry.name });
            await processList.getDataTable().waitTillContentLoaded();
            await processList.selectRow(uploadLocalFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            await taskFormCloudComponent.clickClaimButton();

            const localFileWidget = await widget.attachFileWidgetCloud('Attachlocalfile');
            await localFileWidget.clickAttachContentFile('Attachlocalfile');
            await contentNodeSelectorDialogPage.attachFilesFromLocal([pdfFile]);
            await localFileWidget.checkFileIsAttached(pdfFile.name);
            await localFileWidget.removeFile(pdfFile.name);
            await localFileWidget.checkFileIsNotAttached(pdfFile.name);
        });

        it('[C311285] Should be able to attach a file to a form from acs repository', async () => {
            await editProcessFilter.setFilter({ processName: uploadContentFileProcess.entry.name });
            await processList.getDataTable().waitTillContentLoaded();
            await processList.selectRow(uploadContentFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');

            const contentFileWidget = await widget.attachFileWidgetCloud('Attachsinglecontentfile');
            await contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');
            await contentNodeSelectorDialogPage.attachFileFromContentNode(folderName, testFileModel.name);

            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.removeFile(testFileModel.name);
            await contentFileWidget.checkFileIsNotAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsDisplayed('Attachsinglecontentfile');
        });

        it('[C311287] Content node selector default location when attaching a file to a form from acs repository', async () => {
            await editProcessFilter.setFilter({ processName: uploadDefaultFileProcess.entry.name });
            await processList.getDataTable().waitTillContentLoaded();
            await processList.selectRow(uploadDefaultFileProcess.entry.name);
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
            await editProcessFilter.setFilter({ processName: cancelUploadFileProcess.entry.name });
            await processList.getDataTable().waitTillContentLoaded();
            await processList.selectRow(cancelUploadFileProcess.entry.name);
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
            await editProcessFilter.setFilter({ processName: uploadContentFileProcess.entry.name });
            await processList.getDataTable().waitTillContentLoaded();
            await processList.selectRow(uploadContentFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');

            const contentFileWidget = await widget.attachFileWidgetCloud('Attachsinglecontentfile');
            await contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');

            await contentNodeSelectorDialogPage.attachFileFromContentNode(folderName, testFileModel.name);
            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
        });

        it('[C311292] Attached file is not displayed anymore after release if the form is not saved', async () => {
            await editProcessFilter.setFilter({ processName: uploadContentFileProcess.entry.name });
            await processList.getDataTable().waitTillContentLoaded();
            await processList.selectRow(uploadContentFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');

            const contentFileWidget = await widget.attachFileWidgetCloud('Attachsinglecontentfile');
            await contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');

            await contentNodeSelectorDialogPage.attachFileFromContentNode(folderName, testFileModel.name);

            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
            await taskFormCloudComponent.clickReleaseButton();
            await taskFormCloudComponent.clickClaimButton();
            await contentFileWidget.checkFileIsNotAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsDisplayed('Attachsinglecontentfile');
        });

        it('[C311293] Attached file is displayed after release if the form was saved', async () => {
            await editProcessFilter.setFilter({ processName: uploadContentFileProcess.entry.name });
            await processList.getDataTable().waitTillContentLoaded();
            await processList.selectRow(uploadContentFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');

            const contentFileWidget = await widget.attachFileWidgetCloud('Attachsinglecontentfile');
            await contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');

            await contentNodeSelectorDialogPage.attachFileFromContentNode(folderName, testFileModel.name);

            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
            await taskFormCloudComponent.clickSaveButton();
            await taskFormCloudComponent.clickReleaseButton();
            await taskFormCloudComponent.clickClaimButton();
            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
        });

        it('[C311295] Attached file is displayed after complete', async () => {
            await editProcessFilter.setFilter({ processName: completeUploadFileProcess.entry.name });
            await processList.getDataTable().waitTillContentLoaded();
            await processList.selectRow(completeUploadFileProcess.entry.name);
            await processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask');
            await processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask');
            await taskFormCloudComponent.clickClaimButton();

            const contentFileWidget = await widget.attachFileWidgetCloud('Attachsinglecontentfile');
            await contentFileWidget.clickAttachContentFile('Attachsinglecontentfile');

            await contentNodeSelectorDialogPage.attachFileFromContentNode(folderName, testFileModel.name);

            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
            const taskId = await taskHeaderCloudPage.getId();
            await taskFormCloudComponent.checkCompleteButtonIsDisplayed();
            await taskFormCloudComponent.clickCompleteButton();
            await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');
            await taskList.checkContentIsNotDisplayedById(taskId);

            await taskFilter.clickTaskFilter('completed-tasks');
            await taskList.getDataTable().waitTillContentLoaded();

            await taskList.checkContentIsDisplayedById(taskId);
            await taskList.selectRowByTaskId(taskId);
            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile');
        });

        it('[C315292] Should be able to download attached file from acs repository', async () => {
            await editProcessFilter.setFilter({ processName: downloadContentFileProcess.entry.name });
            await processList.getDataTable().waitTillContentLoaded();
            await processList.selectRow(downloadContentFileProcess.entry.name);
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

            await contentFileWidget.downloadFile(testFileModel.name);
            await FileBrowserUtil.isFileDownloaded(testFileModel.name);

            const taskId = await taskHeaderCloudPage.getId();
            await taskFormCloudComponent.clickCompleteButton();
            await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');
            await taskList.checkContentIsNotDisplayedById(taskId);

            await taskFilter.clickTaskFilter('completed-tasks');
            await taskList.getDataTable().waitTillContentLoaded();

            await taskList.checkContentIsDisplayedById(taskId);
            await taskList.selectRowByTaskId(taskId);
            await contentFileWidget.checkFileIsAttached(testFileModel.name);
            await contentFileWidget.downloadFile(testFileModel.name);
            await FileBrowserUtil.isFileDownloaded(testFileModel.name);
        });
   });
});
