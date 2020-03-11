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

import { ApiService, AppListCloudPage, GroupIdentityService, IdentityService, LoginSSOPage, StartProcessCloudPage, StringUtil, TaskFormCloudComponent, ProcessCloudWidgetPage, ViewerPage, UploadActions, ContentNodeSelectorDialogPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/process-cloud-demo.page';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasks-cloud-demo.page';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Process Task - attache content file', () => {

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const processCloudDemoPage = new ProcessCloudDemoPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const processCloudWidget = new ProcessCloudWidgetPage();
    const startProcessPage = new StartProcessCloudPage();
    const contentNodeSelectorDialog = new ContentNodeSelectorDialogPage();
    const viewerPage = new ViewerPage();
    const apiService = new ApiService(
        browser.params.config.oauth2.clientId,
        browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
    );

    const processName = StringUtil.generateRandomString(10);
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;
    let testUser, groupInfo;
    const folderName = StringUtil.generateRandomString(5);
    let uploadedFolder: any;

    const widgets = {
        contentMultipleAttachFileId: 'UploadMultipleFileFromContentId'
    };

    const pdfFileOne = {
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_location
    };

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: 'url'
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    beforeAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);

        await this.alfrescoJsApi.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
        uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
        await uploadActions.uploadFile(pdfFileOne.location, pdfFileOne.name, uploadedFolder.entry.id);
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
   });

    afterAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
   });

    afterEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
    });

    it('[C291860] Should be able to start a process', async () => {
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);
        await processCloudDemoPage.openNewProcessForm();
        await startProcessPage.startProcessWithProcessDefinition(processName, 'upload-single-multiple-pro');
        await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();

        await processCloudDemoPage.processFilterCloudComponent.clickRunningProcessesFilter();
        await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('Running Processes');
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(processName);
        await processCloudDemoPage.processListCloudComponent().selectRow(processName);

        await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();

        await tasksCloudDemoPage.taskListCloudComponent().selectRow('UploadSingleMultipleFiles');
        await taskFormCloudComponent.formFields().checkFormIsDisplayed();
        const contentUploadFileWidget = await processCloudWidget.attachFileWidgetCloud(widgets.contentMultipleAttachFileId);

        await taskFormCloudComponent.formFields().checkWidgetIsVisible(widgets.contentMultipleAttachFileId);
        await contentUploadFileWidget.clickAttachContentFile(widgets.contentMultipleAttachFileId);

        await contentNodeSelectorDialog.checkDialogIsDisplayed();
        await contentNodeSelectorDialog.checkSearchInputIsDisplayed();
        await contentNodeSelectorDialog.checkCancelButtonIsDisplayed();

        const contentList = await contentNodeSelectorDialog.contentListPage();

        await contentList.dataTablePage().waitForTableBody();
        await contentList.dataTablePage().waitTillContentLoaded();
        await contentList.dataTablePage().checkRowContentIsDisplayed(folderName);
        await contentList.dataTablePage().doubleClickRowByContent(folderName);

        await contentList.dataTablePage().waitForTableBody();
        await contentList.dataTablePage().waitTillContentLoaded();
        await contentList.dataTablePage().checkRowContentIsDisplayed(pdfFileOne.name);

        await contentNodeSelectorDialog.clickContentNodeSelectorResult(pdfFileOne.name);
        await contentNodeSelectorDialog.checkCopyMoveButtonIsEnabled();
        await contentNodeSelectorDialog.clickMoveCopyButton();

        await contentUploadFileWidget.checkFileIsAttached(pdfFileOne.name);
        await contentUploadFileWidget.viewFile(pdfFileOne.name);

        await viewerPage.checkFileThumbnailIsDisplayed();
        await viewerPage.checkFileNameIsDisplayed(pdfFileOne.name);
        await viewerPage.clickCloseButton();
        await taskFormCloudComponent.clickCompleteButton();

        await expect(await tasksCloudDemoPage.taskFilterCloudComponent.getActiveFilterName()).toBe('My Tasks');
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedByName('UploadSingleMultipleFiles');

        await tasksCloudDemoPage.taskFilterCloudComponent.clickCompletedTasksFilter();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName('UploadSingleMultipleFiles');

        await processCloudDemoPage.processFilterCloudComponent.clickOnProcessFilters();
        await processCloudDemoPage.processFilterCloudComponent.clickCompletedProcessesFilter();

        await expect(await processCloudDemoPage.processFilterCloudComponent.getActiveFilterName()).toBe('Completed Processes');
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(processName);
   });

    afterAll(async () => {
        await uploadActions.deleteFileOrFolder(uploadedFolder.entry.id);
    });
});
