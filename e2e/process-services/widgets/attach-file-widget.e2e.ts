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

import { LoginPage, Widget, ViewerPage, FileBrowserUtil, ApplicationService } from '@alfresco/adf-testing';
import { TasksPage } from '../../pages/adf/process-services/tasks.page';
import CONSTANTS = require('../../util/constants');
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../../actions/users.actions';
import { TaskDetailsPage } from '../../pages/adf/process-services/task-details.page';
import { TasksListPage } from '../../pages/adf/process-services/tasks-list.page';
import { FiltersPage } from '../../pages/adf/process-services/filters.page';

describe('Attach widget - File', () => {
    const loginPage = new LoginPage();
    const viewerPage = new ViewerPage();
    const widget = new Widget();
    const taskPage = new TasksPage();
    const navigationBarPage = new NavigationBarPage();
    const taskDetailsPage = new TaskDetailsPage();
    const tasksListPage = new TasksListPage();
    const filtersPage = new FiltersPage();

    let processUserModel;
    const app = browser.params.resources.Files.WIDGETS_SMOKE_TEST;
    const pdfFile = new FileModel({'name': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name});
    const appFields = app.form_fields;

    beforeAll(async () => {
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        processUserModel = await users.createTenantAndUser(this.alfrescoJsApi);
        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        const applicationsService = new ApplicationService(this.alfrescoJsApi);
        await applicationsService.importPublishDeployApp(app.file_path);
        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);
    });

    beforeEach(async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        const newTask = await taskPage.createNewTask();
        await newTask.addName('View file');
        await newTask.selectForm(app.formName);
        await newTask.clickStartButton();

        await widget.attachFileWidget().attachFile(appFields.attachFile_id, browser.params.testConfig.main.rootPath + pdfFile.location);
        await widget.attachFileWidget().checkFileIsAttached(appFields.attachFile_id, pdfFile.name);
    });

    afterAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
    });

    it('[C268067] Should be able to preview, download and remove attached files from an active form', async () => {
        await widget.attachFileWidget().toggleAttachedFileMenu();
        await widget.attachFileWidget().checkAttachFileOptionsActiveForm();

        await widget.attachFileWidget().viewAttachedFile();
        await viewerPage.checkFileContent('1', pdfFile.firstPageText);
        await viewerPage.checkCloseButtonIsDisplayed();
        await viewerPage.clickCloseButton();

        await widget.attachFileWidget().toggleAttachedFileMenu();
        await widget.attachFileWidget().downloadFile();
        await FileBrowserUtil.isFileDownloaded(pdfFile.name);

        await widget.attachFileWidget().toggleAttachedFileMenu();
        await widget.attachFileWidget().removeAttachedFile();
        await widget.attachFileWidget().attachFileWidgetDisplayed();
    });

    it('[C268070] Should be able to preview and download files from a completed form', async () => {
        await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
        await taskDetailsPage.clickCompleteFormTask();

        await tasksListPage.checkTaskListIsLoaded();
        await filtersPage.goToFilter('Completed Tasks');
        await tasksListPage.checkTaskListIsLoaded();
        await widget.attachFileWidget().checkFileIsAttached(appFields.attachFile_id, pdfFile.name);

        await widget.attachFileWidget().toggleAttachedFileMenu();
        await widget.attachFileWidget().checkAttachFileOptionsCompletedForm();

        await widget.attachFileWidget().viewAttachedFile();
        await viewerPage.checkFileContent('1', pdfFile.firstPageText);
        await viewerPage.checkCloseButtonIsDisplayed();
        await viewerPage.clickCloseButton();

        await widget.attachFileWidget().toggleAttachedFileMenu();
        await widget.attachFileWidget().downloadFile();
        await FileBrowserUtil.isFileDownloaded(pdfFile.name);
    });
});
