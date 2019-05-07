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

import { LoginPage, Widget } from '@alfresco/adf-testing';

import { TasksPage } from '../pages/adf/process-services/tasksPage';

import CONSTANTS = require('../util/constants');

import { FileModel } from '../models/ACS/fileModel';

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import { ViewerPage } from '../pages/adf/viewerPage';
import { AppsActions } from '../actions/APS/apps.actions';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';

describe('Start Task - Task App', () => {

    const loginPage = new LoginPage();
    const viewerPage = new ViewerPage();
    const widget = new Widget();
    const taskPage = new TasksPage();
    const navigationBarPage = new NavigationBarPage();

    let processUserModel;
    const app = resources.Files.WIDGETS_SMOKE_TEST;
    const pdfFile = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    const appFields = app.form_fields;

    beforeAll(async (done) => {
        const users = new UsersActions();
        const apps = new AppsActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    afterAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);

        done();
    });

    it('[C274690] Should be able to open a file attached to a start form', () => {
        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        taskPage
            .createNewTask()
            .addName('View file')
            .addForm(app.formName)
            .clickStartButton();

        widget.attachFileWidget().attachFile(appFields.attachFile_id, TestConfig.main.rootPath + pdfFile.location);
        widget.attachFileWidget().checkFileIsAttached(appFields.attachFile_id, pdfFile.name);

        widget.attachFileWidget().viewFile(pdfFile.name);
        viewerPage.checkFileContent('1', pdfFile.firstPageText);
        viewerPage.checkCloseButtonIsDisplayed();
        viewerPage.clickCloseButton();
        taskPage.tasksListPage().checkContentIsDisplayed('View file');
    });

});
