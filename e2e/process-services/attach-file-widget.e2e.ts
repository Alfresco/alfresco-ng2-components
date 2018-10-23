/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { LoginPage } from '../pages/adf/loginPage';
import { Widget } from '../pages/adf/process_services/widgets/widget';

import { ProcessServicesPage } from '../pages/adf/process_services/processServicesPage';
import { TasksPage } from '../pages/adf/process_services/tasksPage';

import CONSTANTS = require('../util/constants');

import FileModel = require('../models/ACS/fileModel');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import { ViewerPage } from '../pages/adf/viewerPage';
import { AppsActions } from '../actions/APS/apps.actions';
import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';

describe('Start Task - Task App', () => {

    let loginPage = new LoginPage();
    let viewerPage = new ViewerPage();
    let widget = new Widget();
    let processServicesPage = new ProcessServicesPage();
    let taskPage = new TasksPage();

    let processUserModel;
    let app = resources.Files.WIDGETS_SMOKE_TEST;
    let pdfFile = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    let appFields = app.form_fields;

    beforeAll(async (done) => {
        let users = new UsersActions();
        let apps = new AppsActions();

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
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        taskPage
            .createNewTask()
            .addName('View file')
            .addForm(app.formName)
            .clickStartButton();

        widget.attachFileWidget().attachFile(appFields.attachFile_id, pdfFile.location);
        widget.attachFileWidget().checkFileIsAttached(appFields.attachFile_id, pdfFile.name);

        widget.attachFileWidget().viewFile(pdfFile.name);
        viewerPage.checkFileContent('1', pdfFile.firstPageText);
        viewerPage.checkCloseButtonIsDisplayed();
        viewerPage.clickCloseButton();
        taskPage.tasksListPage().checkTaskIsDisplayedInTasksList('View file');
    });

});
