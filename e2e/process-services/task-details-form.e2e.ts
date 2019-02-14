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

import TestConfig = require('../test.config');
import { Util } from '../util/util';
import CONSTANTS = require('../util/constants');

import { LoginPage } from '../pages/adf/loginPage';

import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksListPage } from '../pages/adf/process-services/tasksListPage';
import { TaskDetailsPage } from '../pages/adf/process-services/taskDetailsPage';
import { FiltersPage } from '../pages/adf/process-services/filtersPage';

import { StandaloneTask } from '../models/APS/standaloneTask';

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';

describe('Task Details - Form', () => {
    let loginPage = new LoginPage();
    let tasksListPage = new TasksListPage();
    let taskDetailsPage = new TaskDetailsPage();
    let filtersPage = new FiltersPage();
    let task, otherTask, user, newForm, attachedForm, otherAttachedForm;

    beforeAll(async (done) => {
        let users = new UsersActions();
        let attachedFormModel = {
            'name': Util.generateRandomString(),
            'description': '',
            'modelType': 2,
            'stencilSet': 0
        };
        let otherTaskModel = new StandaloneTask();
        let otherAttachedFormModel = {
            'name': Util.generateRandomString(),
            'description': '',
            'modelType': 2,
            'stencilSet': 0
        };
        let newFormModel = { 'name': Util.generateRandomString(), 'description': '', 'modelType': 2, 'stencilSet': 0 };

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        attachedForm = await this.alfrescoJsApi.activiti.modelsApi.createModel(attachedFormModel);

        newForm = await this.alfrescoJsApi.activiti.modelsApi.createModel(newFormModel);

        let otherEmptyTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask(otherTaskModel);

        otherAttachedForm = await this.alfrescoJsApi.activiti.modelsApi.createModel(otherAttachedFormModel);

        await this.alfrescoJsApi.activiti.taskApi.attachForm(otherEmptyTask.id, { 'formId': otherAttachedForm.id });

        otherTask = await this.alfrescoJsApi.activiti.taskApi.getTask(otherEmptyTask.id);

        loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    beforeEach(async (done) => {
        let taskModel = new StandaloneTask();

        let emptyTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask(taskModel);

        await this.alfrescoJsApi.activiti.taskApi.attachForm(emptyTask.id, { 'formId': attachedForm.id });

        task = await this.alfrescoJsApi.activiti.taskApi.getTask(emptyTask.id);

        new NavigationBarPage().navigateToProcessServicesPage().goToTaskApp();
        tasksListPage.checkTaskListIsLoaded();
        filtersPage.goToFilter('Involved Tasks');
        tasksListPage.checkTaskListIsLoaded();

        done();
    });

    it('[C280018] Should be able to change the form in a task', () => {
        tasksListPage.selectRow(task.name);

        taskDetailsPage.checkEditFormButtonIsDisplayed();
        taskDetailsPage.clickEditFormButton();

        taskDetailsPage.checkAttachFormDropdownIsDisplayed();
        taskDetailsPage.checkAttachFormButtonIsDisabled();

        taskDetailsPage.clickAttachFormDropdown();

        taskDetailsPage.selectAttachFormOption(newForm.name);
        taskDetailsPage.checkSelectedForm(newForm.name);
        taskDetailsPage.checkAttachFormButtonIsEnabled();

        taskDetailsPage.checkCancelAttachFormIsDisplayed();
        taskDetailsPage.clickCancelAttachForm();

        taskDetailsPage.checkFormIsAttached(attachedForm.name);

        taskDetailsPage.checkEditFormButtonIsDisplayed();
        taskDetailsPage.clickEditFormButton();

        taskDetailsPage.checkAttachFormDropdownIsDisplayed();
        taskDetailsPage.clickAttachFormDropdown();

        taskDetailsPage.selectAttachFormOption(newForm.name);

        taskDetailsPage.checkAttachFormButtonIsDisplayed();
        taskDetailsPage.clickAttachFormButton();

        taskDetailsPage.checkFormIsAttached(newForm.name);
    });

    it('[C280019] Should be able to remove the form form a task', () => {
        tasksListPage.selectRow(task.name);

        taskDetailsPage.checkEditFormButtonIsDisplayed();
        taskDetailsPage.clickEditFormButton();

        taskDetailsPage.checkRemoveAttachFormIsDisplayed();
        taskDetailsPage.clickRemoveAttachForm();

        taskDetailsPage.checkFormIsAttached('No form');

        expect(taskDetailsPage.getFormName()).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
    });

    it('[C280557] Should display task details when selecting another task while the Attach Form dialog is displayed', () => {
        tasksListPage.selectRow(task.name);

        taskDetailsPage.checkEditFormButtonIsDisplayed();
        taskDetailsPage.clickEditFormButton();

        taskDetailsPage.checkRemoveAttachFormIsDisplayed();

        tasksListPage.selectRow(otherTask.name);
        taskDetailsPage.checkFormIsAttached(otherAttachedForm.name);
    });
});
