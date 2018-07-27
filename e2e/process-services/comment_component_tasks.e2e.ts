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

import LoginPage = require('../pages/adf/loginPage');
import ProcessServicesPage = require('../pages/adf/process_services/processServicesPage');
import TasksPage = require('../pages/adf/process_services/tasksPage');
import { CommentsPage } from '../pages/adf/commentsPage';

import CONSTANTS = require('../util/constants');

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import Util = require('../util/util.js');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';

describe('Comment component for Processes', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let taskPage = new TasksPage();
    let commentsPage = new CommentsPage();

    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let user, tenantId, appId, secondUser, newTaskId;

    let taskName = {
        completed_task: 'Test Completed',
        multiple_users: 'Test Comment multiple users'
    };

    beforeAll(async(done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        done();
    });

    beforeEach(async(done) =>{
        let apps = new AppsActions();
        let users = new UsersActions();

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        secondUser = await users.createApsUser(this.alfrescoJsApi, tenantId);

        await this.alfrescoJsApi.login(user.email, user.password);

        let importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
        appId = importedApp.id;

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    afterEach(async(done) => {
        await loginPage.loginToProcessServicesUsingUserModel(user);

        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

        done();
    });

    it('[C260237] Should not be able to add a comment on a completed task', () => {
        browser.controlFlow().execute(async() => {
            let newTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask({name: taskName.completed_task});

            let taskId = newTask.id;

            this.alfrescoJsApi.activiti.taskActionsApi.completeTask(taskId);
        });

        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.COMPL_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList(taskName.completed_task);

        commentsPage.checkCommentInputIsNotDisplayed();
    });

    it('[C212864] Should be able to add multiple comments on a single task using different users', () => {
        browser.controlFlow().execute(async() => {
            let newTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask({name: taskName.multiple_users});

            newTaskId = newTask.id;

            await this.alfrescoJsApi.activiti.taskApi.involveUser(newTaskId, {email: secondUser.email});

            let taskComment = {message: "Task Comment"};
            let secondTaskComment = {message: "Second Task Comment"};

            await this.alfrescoJsApi.activiti.taskApi.addTaskComment(taskComment, newTaskId);
            await this.alfrescoJsApi.activiti.taskApi.addTaskComment(secondTaskComment, newTaskId);
        });

        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList(taskName.multiple_users);
        taskPage.usingTaskDetails().selectActivityTab();

        browser.controlFlow().execute(async() => {
            let totalComments = await this.alfrescoJsApi.activiti.taskApi.getTaskComments(newTaskId, {'latestFirst': true});

            let thirdTaskComment = {message: "Third Task Comment"};

            await commentsPage.checkUserIconIsDisplayed(0);
            await commentsPage.checkUserIconIsDisplayed(1);

            await expect(commentsPage.getTotalNumberOfComments()).toEqual('Comments ('+ totalComments.total +')');

            await expect(commentsPage.getMessage(0)).toEqual(totalComments.data[0].message);
            await expect(commentsPage.getMessage(1)).toEqual(totalComments.data[1].message);

            await expect(commentsPage.getUserName(0)).toEqual(totalComments.data[0].createdBy.firstName + ' ' + totalComments.data[0].createdBy.lastName);
            await expect(commentsPage.getUserName(1)).toEqual(totalComments.data[1].createdBy.firstName + ' ' + totalComments.data[1].createdBy.lastName);

            await expect(commentsPage.getTime(0)).toEqual('a few seconds ago');
            await expect(commentsPage.getTime(1)).toEqual('a few seconds ago');

            await loginPage.loginToProcessServicesUsingUserModel(secondUser);

            await this.alfrescoJsApi.activiti.taskApi.addTaskComment(thirdTaskComment, newTaskId);
        });

        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList(taskName.multiple_users);
        taskPage.usingTaskDetails().selectActivityTab();

        browser.controlFlow().execute(async() => {
            let totalComments = await this.alfrescoJsApi.activiti.taskApi.getTaskComments(newTaskId, {'latestFirst': true});

            await commentsPage.checkUserIconIsDisplayed(0);
            await commentsPage.checkUserIconIsDisplayed(1);
            await commentsPage.checkUserIconIsDisplayed(2);

            await expect(commentsPage.getTotalNumberOfComments()).toEqual('Comments ('+ totalComments.total +')');

            await expect(commentsPage.getMessage(0)).toEqual(totalComments.data[0].message);
            await expect(commentsPage.getMessage(1)).toEqual(totalComments.data[1].message);
            await expect(commentsPage.getMessage(2)).toEqual(totalComments.data[2].message);

            await expect(commentsPage.getUserName(0)).toEqual(totalComments.data[0].createdBy.firstName + ' ' + totalComments.data[0].createdBy.lastName);
            await expect(commentsPage.getUserName(1)).toEqual(totalComments.data[1].createdBy.firstName + ' ' + totalComments.data[1].createdBy.lastName);
            await expect(commentsPage.getUserName(2)).toEqual(totalComments.data[2].createdBy.firstName + ' ' + totalComments.data[2].createdBy.lastName);

            await expect(commentsPage.getTime(0)).toEqual('a few seconds ago');
            await expect(commentsPage.getTime(1)).toEqual('a few seconds ago');
            await expect(commentsPage.getTime(2)).toEqual('a few seconds ago');
        });
    });
});
