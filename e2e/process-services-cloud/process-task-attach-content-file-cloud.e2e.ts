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

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';
import {
    AppListCloudPage,
    LoginSSOPage,
    StartProcessCloudPage,
    StringUtil,
    TaskFormCloudComponent,
    ProcessCloudWidgetPage,
    ViewerPage,
    UploadActions,
    ContentNodeSelectorDialogPage
} from '@alfresco/adf-testing';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/process-cloud-demo.page';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasks-cloud-demo.page';

describe('Process Task - Attache content file', () => {

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

    const processName = StringUtil.generateRandomString(10);
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const folderName = StringUtil.generateRandomString(5);
    let uploadedFolder: any;

    const widgets = {
        contentMultipleAttachFileId: 'UploadMultipleFileFromContentId'
    };

    const pdfFileOne = {
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_location
    };

    const pdfFileTwo = {
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    };

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.config.bpmHost
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    beforeAll(async () => {
        await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);

        await this.alfrescoJsApi.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
        uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
        await uploadActions.uploadFile(pdfFileOne.location, pdfFileOne.name, uploadedFolder.entry.id);
        await uploadActions.uploadFile(pdfFileTwo.location, pdfFileTwo.name, uploadedFolder.entry.id);
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
    });

    it('[C311290] Should be able to attach multiple files when widget allows multiple files to be attached from content', async () => {
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
        await taskFormCloudComponent.formFields().checkWidgetIsVisible(widgets.contentMultipleAttachFileId);
        const contentUploadFileWidget = await processCloudWidget.attachFileWidgetCloud(widgets.contentMultipleAttachFileId);
        await contentUploadFileWidget.clickAttachContentFile(widgets.contentMultipleAttachFileId);

        await contentNodeSelectorDialog.attachFileFromContentNode(folderName, pdfFileOne.name);
        await viewAttachedFile(contentUploadFileWidget, pdfFileOne.name);

        await taskFormCloudComponent.formFields().checkWidgetIsVisible(widgets.contentMultipleAttachFileId);
        await contentUploadFileWidget.clickAttachContentFile(widgets.contentMultipleAttachFileId);

        await contentNodeSelectorDialog.attachFileFromContentNode(folderName, pdfFileTwo.name);
        await viewAttachedFile(contentUploadFileWidget, pdfFileTwo.name);
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

    async function viewAttachedFile(contentUploadWidget, fileName: string) {
        await contentUploadWidget.checkFileIsAttached(fileName);
        await contentUploadWidget.viewFile(fileName);

        await viewerPage.checkFileThumbnailIsDisplayed();
        await viewerPage.checkFileNameIsDisplayed(fileName);
        await viewerPage.clickCloseButton();
    }

    afterAll(async () => {
        await uploadActions.deleteFileOrFolder(uploadedFolder.entry.id);
    });
});
