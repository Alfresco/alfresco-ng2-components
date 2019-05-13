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

import { browser } from 'protractor';

import { LoginPage } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { CommentsPage } from '../pages/adf/commentsPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import CONSTANTS = require('../util/constants');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';

describe('Comment component for Processes', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const taskPage = new TasksPage();
    const commentsPage = new CommentsPage();

    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let user, tenantId, appId, secondUser, newTaskId;

    const taskName = {
        completed_task: 'Test Completed',
        multiple_users: 'Test Comment multiple users'
    };

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        const apps = new AppsActions();
        const users = new UsersActions();

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        secondUser = await users.createApsUser(this.alfrescoJsApi, tenantId);

        await this.alfrescoJsApi.login(user.email, user.password);

        const importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
        appId = importedApp.id;

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    afterAll(async (done) => {
        try {
            await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
        } catch (error) {

        }
        done();
    });

    it('[C260237] Should not be able to add a comment on a completed task', () => {
        browser.controlFlow().execute(async () => {
            const newTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: taskName.completed_task });

            const taskId = newTask.id;

            this.alfrescoJsApi.activiti.taskActionsApi.completeTask(taskId);
        });

        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        taskPage.tasksListPage().selectRow(taskName.completed_task);

        commentsPage.checkCommentInputIsNotDisplayed();
    });

    it('[C212864] Should be able to add multiple comments on a single task using different users', () => {
        browser.controlFlow().execute(async () => {
            const newTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: taskName.multiple_users });

            newTaskId = newTask.id;

            await this.alfrescoJsApi.activiti.taskApi.involveUser(newTaskId, { email: secondUser.email });

            const taskComment = { message: 'Task Comment' };
            const secondTaskComment = { message: 'Second Task Comment' };

            await this.alfrescoJsApi.activiti.taskApi.addTaskComment(taskComment, newTaskId);
            await this.alfrescoJsApi.activiti.taskApi.addTaskComment(secondTaskComment, newTaskId);
        });

        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.tasksListPage().selectRow(taskName.multiple_users);
        taskPage.taskDetails().selectActivityTab();

        browser.controlFlow().execute(async () => {
            const totalComments = await this.alfrescoJsApi.activiti.taskApi.getTaskComments(newTaskId, { 'latestFirst': true });

            const thirdTaskComment = { message: 'Third Task Comment' };

            await commentsPage.checkUserIconIsDisplayed(0);
            await commentsPage.checkUserIconIsDisplayed(1);

            await expect(commentsPage.getTotalNumberOfComments()).toEqual('Comments (' + totalComments.total + ')');

            await expect(commentsPage.getMessage(0)).toEqual(totalComments.data[0].message);
            await expect(commentsPage.getMessage(1)).toEqual(totalComments.data[1].message);

            await expect(commentsPage.getUserName(0)).toEqual(totalComments.data[0].createdBy.firstName + ' ' + totalComments.data[0].createdBy.lastName);
            await expect(commentsPage.getUserName(1)).toEqual(totalComments.data[1].createdBy.firstName + ' ' + totalComments.data[1].createdBy.lastName);

            await expect(commentsPage.getTime(0)).toMatch(/(ago|few)/);
            await expect(commentsPage.getTime(1)).toMatch(/(ago|few)/);

            await loginPage.loginToProcessServicesUsingUserModel(secondUser);

            await this.alfrescoJsApi.activiti.taskApi.addTaskComment(thirdTaskComment, newTaskId);
        });

        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        taskPage.tasksListPage().selectRow(taskName.multiple_users);
        taskPage.taskDetails().selectActivityTab();

        browser.controlFlow().execute(async () => {
            const totalComments = await this.alfrescoJsApi.activiti.taskApi.getTaskComments(newTaskId, { 'latestFirst': true });

            await commentsPage.checkUserIconIsDisplayed(0);
            await commentsPage.checkUserIconIsDisplayed(1);
            await commentsPage.checkUserIconIsDisplayed(2);

            await expect(commentsPage.getTotalNumberOfComments()).toEqual('Comments (' + totalComments.total + ')');

            await expect(commentsPage.getMessage(0)).toEqual(totalComments.data[0].message);
            await expect(commentsPage.getMessage(1)).toEqual(totalComments.data[1].message);
            await expect(commentsPage.getMessage(2)).toEqual(totalComments.data[2].message);

            await expect(commentsPage.getUserName(0)).toEqual(totalComments.data[0].createdBy.firstName + ' ' + totalComments.data[0].createdBy.lastName);
            await expect(commentsPage.getUserName(1)).toEqual(totalComments.data[1].createdBy.firstName + ' ' + totalComments.data[1].createdBy.lastName);
            await expect(commentsPage.getUserName(2)).toEqual(totalComments.data[2].createdBy.firstName + ' ' + totalComments.data[2].createdBy.lastName);

            await expect(commentsPage.getTime(0)).toMatch(/(ago|few)/);
            await expect(commentsPage.getTime(1)).toMatch(/(ago|few)/);
            await expect(commentsPage.getTime(2)).toMatch(/(ago|few)/);
        });
    });
});
