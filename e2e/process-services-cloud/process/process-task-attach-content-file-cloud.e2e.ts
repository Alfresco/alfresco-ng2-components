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

import { browser } from 'protractor';
import { createApiService,
    AppListCloudPage,
    ContentNodeSelectorDialogPage,
    GroupIdentityService,
    IdentityService,
    LoginPage,
    QueryService,
    ProcessCloudWidgetPage,
    ProcessDefinitionsService,
    ProcessInstancesService,
    StringUtil,
    TaskFormCloudComponent,
    TasksService,
    UploadActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { ProcessCloudDemoPage } from './../pages/process-cloud-demo.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from './../pages/tasks-cloud-demo.page';
import CONSTANTS = require('../../util/constants');

describe('Process Task - Attach content file', () => {

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const processCloudDemoPage = new ProcessCloudDemoPage();
    const editProcessFilter = processCloudDemoPage.editProcessFilterCloudComponent();
    const processList = processCloudDemoPage.processListCloudComponent();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskFilter = tasksCloudDemoPage.taskFilterCloudComponent;
    const taskList = tasksCloudDemoPage.taskListCloudComponent();

    const taskFormCloudComponent = new TaskFormCloudComponent();
    const processCloudWidget = new ProcessCloudWidgetPage();
    const contentNodeSelectorDialog = new ContentNodeSelectorDialogPage();

    const apiService = createApiService();
    const uploadActions = new UploadActions(apiService);
    const processDefinitionService = new ProcessDefinitionsService(apiService);
    const processInstancesService = new ProcessInstancesService(apiService);
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);
    const queryService = new QueryService(apiService);
    const tasksService = new TasksService(apiService);

    const viewerPage = new ViewerPage();
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const processDefinitionName = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.uploadSingleMultipleFiles;
    const uploadWidgetId = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.forms.uploadSingleMultiple.widgets.contentMultipleAttachFileId;
    const taskName = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.tasks.uploadSingleMultipleFiles;
    const folderName = StringUtil.generateRandomString(5);

    let uploadedFolder: any;
    let processInstance: any;
    let testUser: any;
    let groupInfo: any;

    const pdfFileOne = {
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    };

    const pdfFileTwo = {
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_path
    };

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await apiService.login(testUser.username, testUser.password);
        const processDefinition = await processDefinitionService.getProcessDefinitionByName(processDefinitionName, simpleApp);
        processInstance = await processInstancesService.createProcessInstance(processDefinition.entry.key, simpleApp, { name: 'upload process' });

        const task = await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);
        await tasksService.claimTask(task.list.entries[0].entry.id, simpleApp);
        await apiService.login(testUser.username, testUser.password);
        uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
        await uploadActions.uploadFile(pdfFileOne.location, pdfFileOne.name, uploadedFolder.entry.id);
        await uploadActions.uploadFile(pdfFileTwo.location, pdfFileTwo.name, uploadedFolder.entry.id);

        await loginSSOPage.login(testUser.username, testUser.password);
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
    });

    afterAll(async () => {
        await uploadActions.deleteFileOrFolder(uploadedFolder.entry.id);
        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    it('[C311290] Should be able to attach multiple files when widget allows multiple files to be attached from content', async () => {
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);

        await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();
        await processCloudDemoPage.processFilterCloudComponent.clickRunningProcessesFilter();
        await editProcessFilter.openFilter();
        await editProcessFilter.setProcessName('upload process');
        await editProcessFilter.closeFilter();
        await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe(CONSTANTS.PROCESS_FILTERS.RUNNING);

        await processList.checkContentIsDisplayedById(processInstance.entry.id);
        await processList.selectRowById(processInstance.entry.id);
        await taskList.checkTaskListIsLoaded();
        await taskList.selectRow(taskName);

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

        await expect(await taskFilter.getActiveFilterName()).toBe('My Tasks');
        await taskList.checkContentIsNotDisplayedByName(taskName);

        await taskFilter.clickTaskFilter('completed-tasks');
        await taskList.getDataTable().waitTillContentLoaded();
        await taskList.checkContentIsDisplayedByName(taskName);

        await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();
        await processCloudDemoPage.processFilterCloudComponent.clickCompletedProcessesFilter();

        await editProcessFilter.openFilter();
        await editProcessFilter.setProcessName('upload process');
        await editProcessFilter.closeFilter();

        await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe(CONSTANTS.PROCESS_FILTERS.COMPLETED);
        await processList.checkContentIsDisplayedById(processInstance.entry.id);
    });

    async function viewAttachedFile(contentUploadWidget: any, fileName: string): Promise<void> {
        await contentUploadWidget.checkFileIsAttached(fileName);
        await contentUploadWidget.viewFile(fileName);

        await viewerPage.checkToolbarIsDisplayed();
        await viewerPage.checkInfoButtonIsDisplayed();
        await viewerPage.checkDownloadButtonIsDisplayed();
        await viewerPage.checkFileThumbnailIsDisplayed();
        await viewerPage.checkFileNameIsDisplayed(fileName);
        await viewerPage.clickCloseButton();
    }
});
