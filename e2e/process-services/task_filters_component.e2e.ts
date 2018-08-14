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

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import LoginPage = require('../pages/adf/loginPage');
import NavigationBarPage = require('../pages/adf/navigationBarPage');
import ProcessServicesPage = require('../pages/adf/process_services/processServicesPage');
import TasksPage = require('../pages/adf/process_services/tasksPage');
import TasksListPage = require('../pages/adf/process_services/tasksListPage');
import TaskFiltersPage = require('../pages/adf/process_services/taskFiltersPage');
import TaskDetailsPage = require('../pages/adf/process_services/taskDetailsPage');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

describe('Task Filters Test', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let processServicesPage = new ProcessServicesPage();
    let tasksPage = new TasksPage();
    let tasksListPage = new TasksListPage();
    let taskFiltersPage = new TaskFiltersPage();
    let taskDetailsPage = new TaskDetailsPage();

    let app = resources.Files.APP_WITH_DATE_FIELD_FORM;

    beforeAll(async (done) => {
        let apps = new AppsActions();
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    beforeEach(async (done) => {
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);

        done();
    });

    it('[C260330] Should display task list when app is in task section', () => {
        tasksPage.clickOnCreateButton();
        taskFiltersPage.clickNewTaskButton();
        tasksPage.createNewTask().addName('Test').clickStartButton();
        taskFiltersPage.clickMyTaskTaskItem();
        tasksListPage.checkTaskIsDisplayedInTasksList('Test');
        expect(taskFiltersPage.checkActiveFilterActive()).toBe('My Tasks');
        expect(taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

        taskFiltersPage.clickQueuedTaskItem();
        expect(taskFiltersPage.checkActiveFilterActive()).toBe('Queued Tasks');
        tasksListPage.checkTaskIsNotDisplayedInTasksList('Test');
        expect(taskDetailsPage.checkTaskDetailsEmpty()).toBeDefined();

        taskFiltersPage.clickInvolvedTaskItem();
        expect(taskFiltersPage.checkActiveFilterActive()).toBe('Involved Tasks');
        tasksListPage.checkTaskIsDisplayedInTasksList('Test');
        expect( taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

        taskFiltersPage.clickCompletedTaskItem();
        expect(taskFiltersPage.checkActiveFilterActive()).toBe('Completed Tasks');
        tasksListPage.checkTaskIsNotDisplayedInTasksList('Test');
        expect(taskDetailsPage.checkTaskDetailsEmpty()).toBeDefined();
    });

    it('[C260348] Should display task list when app is in task section', () => {
        expect(taskFiltersPage.checkMyTasksItem()).toBeDefined();
        expect(taskFiltersPage.checkQueuedTaskItem()).toBeDefined();
        expect(taskFiltersPage.checkInvolvedTaskItem()).toBeDefined();
        expect(taskFiltersPage.checkCompletedTaskItem()).toBeDefined();
        expect(taskFiltersPage.checkTasksAccordionExtended()).toBeDefined();

        taskFiltersPage.clickTasksAccordionButton();
        expect(taskFiltersPage.checkTasksAccordionClosed()).toBeDefined();

        taskFiltersPage.clickTasksAccordionButton();
        expect(taskFiltersPage.checkMyTasksItem()).toBeDefined();
        expect(taskFiltersPage.checkQueuedTaskItem()).toBeDefined();
        expect(taskFiltersPage.checkInvolvedTaskItem()).toBeDefined();
        expect(taskFiltersPage.checkCompletedTaskItem()).toBeDefined();

        tasksPage.clickOnCreateButton();
        taskFiltersPage.clickNewTaskButton();
        tasksPage.createNewTask().addName('Test').clickStartButton();
        taskFiltersPage.clickMyTaskTaskItem();
        tasksListPage.checkTaskIsDisplayedInTasksList('Test');
        expect(taskFiltersPage.checkActiveFilterActive()).toBe('My Tasks');
        expect(taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

        taskFiltersPage.clickQueuedTaskItem();
        expect(taskFiltersPage.checkActiveFilterActive()).toBe('Queued Tasks');
        expect(taskFiltersPage.checkEmptyTaskList()).toBe('No Tasks Found');
        expect(taskFiltersPage.checkEmptyTaskDetails()).toBe('No task details found');

        taskFiltersPage.clickInvolvedTaskItem();
        expect(taskFiltersPage.checkActiveFilterActive()).toBe('Involved Tasks');
        tasksListPage.checkTaskIsDisplayedInTasksList('Test');
        expect(taskDetailsPage.checkTaskDetailsDisplayed()).toBeDefined();

        taskFiltersPage.clickCompletedTaskItem();
        expect(taskFiltersPage.checkActiveFilterActive()).toBe('Completed Tasks');
        expect(taskFiltersPage.checkEmptyTaskList()).toBe('No Tasks Found');
        expect(taskFiltersPage.checkEmptyTaskDetails()).toBe('No task details found');
    });

    it('[C260349] Should display task list when app is in task section', () => {
        tasksPage.clickOnCreateButton();
        taskFiltersPage.clickNewTaskButton();
        tasksPage.createNewTask().addName('Test1').clickStartButton();
        taskDetailsPage.clickCompleteTask();
        tasksPage.clickOnCreateButton();
        taskFiltersPage.clickNewTaskButton();
        tasksPage.createNewTask().addName('Test2').clickStartButton();
        taskDetailsPage.clickCompleteTask();
        tasksPage.clickOnCreateButton();
        taskFiltersPage.clickNewTaskButton();
        tasksPage.createNewTask().addName('Test3').clickStartButton();

        tasksPage.clickOnCreateButton();
        taskFiltersPage.clickNewTaskButton();
        tasksPage.createNewTask().addName('Test4').clickStartButton();
        tasksListPage.checkTaskIsDisplayedInTasksList('Test4');
        tasksListPage.checkHighlightedTaskInTasksList('Test4');
        tasksListPage.checkTaskIsDisplayedInTasksList('Test3');
        taskDetailsPage.checkTaskDetailsDisplayed();

        tasksListPage.clickSortByName();
        expect(tasksListPage.firstTaskOnTaskList()).toBe('Test3');
        tasksListPage.clickSortByName();
        expect(tasksListPage.firstTaskOnTaskList()).toBe('Test4');

        taskFiltersPage.clickCompletedTaskItem();
        tasksListPage.checkTaskIsDisplayedInTasksList('Test1');
        tasksListPage.checkTaskIsDisplayedInTasksList('Test2');
        expect(tasksListPage.firstTaskOnTaskList()).toBe('Test2');

        tasksListPage.clickSortByName();
        expect(tasksListPage.firstTaskOnTaskList()).toBe('Test1');

        taskFiltersPage.clickInvolvedTaskItem();
        tasksListPage.checkTaskIsDisplayedInTasksList('Test3');
        tasksListPage.checkTaskIsDisplayedInTasksList('Test4');
    });

});
