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
import {
    ApiService,
    AppListCloudPage,
    ContentNodeSelectorDialogPage,
    LoginSSOPage,
    ProcessCloudWidgetPage,
    ProcessDefinitionsService,
    ProcessInstancesService,
    StringUtil,
    TaskFormCloudComponent,
    UploadActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/process-cloud-demo.page';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasks-cloud-demo.page';

describe('Process Task - Attach content file', () => {

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const processCloudDemoPage = new ProcessCloudDemoPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const processCloudWidget = new ProcessCloudWidgetPage();
    const contentNodeSelectorDialog = new ContentNodeSelectorDialogPage();
    const viewerPage = new ViewerPage();
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const processDefinitionName = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.uploadSingleMultipleFiles;
    const uploadWidgetId = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.forms.uploadSingleMultiple.widgets.contentMultipleAttachFileId;
    const taskName = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.tasks.uploadSingleMultipleFiles;
    const folderName = StringUtil.generateRandomString(5);

    let processDefinitionService: ProcessDefinitionsService;
    let processInstancesService: ProcessInstancesService;
    let uploadedFolder: any;
    let processInstance: any;

    const pdfFileOne = {
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
    };

    const pdfFileTwo = {
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_path
    };

    const apiService = new ApiService();
    const alfrescoJsApi = new ApiService().apiService;
    const uploadActions = new UploadActions(alfrescoJsApi);

    beforeAll(async () => {
        await apiService.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
        processDefinitionService = new ProcessDefinitionsService(apiService);
        const processDefinition = await processDefinitionService.getProcessDefinitionByName(processDefinitionName, simpleApp);
        processInstancesService = new ProcessInstancesService(apiService);
        processInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp, { name: 'upload process' });
        await alfrescoJsApi.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
        uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
        await uploadActions.uploadFile(pdfFileOne.location, pdfFileOne.name, uploadedFolder.entry.id);
        await uploadActions.uploadFile(pdfFileTwo.location, pdfFileTwo.name, uploadedFolder.entry.id);
    });

    afterAll(async () => {
        await uploadActions.deleteFileOrFolder(uploadedFolder.entry.id);
    });

    beforeEach(async () => {
        await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
    });

    it('[C311290] Should be able to attach multiple files when widget allows multiple files to be attached from content', async () => {
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);

        await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();
        await processCloudDemoPage.processFilterCloudComponent.clickRunningProcessesFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProcessName('upload process');
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('Running Processes');

        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(processInstance.entry.id);
        await processCloudDemoPage.processListCloudComponent().selectRowById(processInstance.entry.id);

        await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(taskName);

        await taskFormCloudComponent.formFields().checkFormIsDisplayed();
        await taskFormCloudComponent.formFields().checkWidgetIsVisible(uploadWidgetId);
        const contentUploadFileWidget = await processCloudWidget.attachFileWidgetCloud(uploadWidgetId);
        await contentUploadFileWidget.clickAttachContentFile(uploadWidgetId);

        await contentNodeSelectorDialog.attachFileFromContentNode(folderName, pdfFileOne.name);
        await viewAttachedFile(contentUploadFileWidget, pdfFileOne.name);

        await taskFormCloudComponent.formFields().checkWidgetIsVisible(uploadWidgetId);
        await contentUploadFileWidget.clickAttachContentFile(uploadWidgetId);

        await contentNodeSelectorDialog.attachFileFromContentNode(folderName, pdfFileTwo.name);
        await viewAttachedFile(contentUploadFileWidget, pdfFileTwo.name);
        await taskFormCloudComponent.clickCompleteButton();

        await expect(await tasksCloudDemoPage.taskFilterCloudComponent.getActiveFilterName()).toBe('My Tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName(taskName);

        await tasksCloudDemoPage.taskFilterCloudComponent.clickTaskFilter('completed-tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(taskName);

        await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();
        await processCloudDemoPage.processFilterCloudComponent.clickCompletedProcessesFilter();

        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setProcessName('upload process');
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();

        await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('Completed Processes');
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(processInstance.entry.id);
    });

    async function viewAttachedFile(contentUploadWidget, fileName: string): Promise<void> {
        await contentUploadWidget.checkFileIsAttached(fileName);
        await contentUploadWidget.viewFile(fileName);

        await viewerPage.checkFileThumbnailIsDisplayed();
        await viewerPage.checkFileNameIsDisplayed(fileName);
        await viewerPage.clickCloseButton();
    }
});
