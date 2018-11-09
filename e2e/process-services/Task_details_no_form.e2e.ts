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
import { ProcessServicesPage } from '../pages/adf/process_services/processServicesPage';
import { TasksPage } from '../pages/adf/process_services/tasksPage';

import CONSTANTS = require('../util/constants');

import Tenant = require('../models/APS/Tenant');
import Task = require('../models/APS/Task');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';

describe('Task Details - No form', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let processUserModel;
    let app = resources.Files.NO_FORM_APP;
    let taskPage = new TasksPage();
    let noFormMessage = 'No forms attached';
    let apps = new AppsActions();
    let importedApp;

    beforeAll(async (done) => {
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        await apps.startProcess(this.alfrescoJsApi, importedApp);

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    it('[C289311] Should attach form and complete buttons to be displayed when no form is attached', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        taskPage.tasksListPage().getDataTable().checkContentIsDisplayed(app.taskName);
        taskPage.tasksListPage().getDataTable().selectRowByContentName(app.taskName);
        taskPage.taskDetails().noFormIsDisplayed();
        taskPage.taskDetails().checkCompleteTaskButtonIsDisplayed().checkCompleteTaskButtonIsEnabled();
        taskPage.taskDetails().checkAttachFormButtonIsNotDisplayed();
        expect(taskPage.taskDetails().getFormName()).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
        expect(taskPage.formFields().getNoFormMessage()).toEqual(noFormMessage);

    });

});
