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

import { LoginSSOPage, ApplicationsUtil, ApiService } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasks.page';
import { CommentsPage } from '../pages/adf/comments.page';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import CONSTANTS = require('../util/constants');
import { UsersActions } from '../actions/users.actions';
import { TaskRepresentation } from '@alfresco/js-api/src/api/activiti-rest-api/model/taskRepresentation';

describe('Comment component for Processes', () => {

    const loginPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const taskPage = new TasksPage();
    const commentsPage = new CommentsPage();
    const apiService = new ApiService();

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let user, tenantId, appId, secondUser, newTaskId;

    const taskName = {
        completed_task: 'Test Completed',
        multiple_users: 'Test Comment multiple users'
    };

    beforeAll(async () => {
        const users = new UsersActions(apiService);

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        user = await users.createTenantAndUser();

        tenantId = user.tenantId;

        secondUser = await users.createApsUser(tenantId);

        await apiService.getInstance().login(user.email, user.password);

        const importedApp = await new ApplicationsUtil(apiService).importPublishDeployApp(app.file_path);
        appId = importedApp.id;

        await loginPage.login(user.email, user.password);
   });

    afterAll(async () => {
        await apiService.getInstance().activiti.modelsApi.deleteModel(appId);
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(tenantId);
    });

    it('[C260237] Should not be able to add a comment on a completed task', async () => {
        const newTask = await apiService.getInstance().activiti.taskApi.createNewTask(new TaskRepresentation({ name: taskName.completed_task }));

        const taskId = newTask.id;

        await apiService.getInstance().activiti.taskActionsApi.completeTask(taskId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().selectRow(taskName.completed_task);

        await commentsPage.checkCommentInputIsNotDisplayed();
    });

    it('[C212864] Should be able to add multiple comments on a single task using different users', async () => {
        const newTask = await apiService.getInstance().activiti.taskApi.createNewTask(new TaskRepresentation({ name: taskName.multiple_users }));

        newTaskId = newTask.id;

        await apiService.getInstance().activiti.taskApi.involveUser(newTaskId, { email: secondUser.email });

        const taskComment = { message: 'Task Comment' };
        const secondTaskComment = { message: 'Second Task Comment' };

        await apiService.getInstance().activiti.taskApi.addTaskComment(taskComment, newTaskId);
        await apiService.getInstance().activiti.taskApi.addTaskComment(secondTaskComment, newTaskId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().selectRow(taskName.multiple_users);
        await taskPage.taskDetails().selectActivityTab();

        const totalCommentsLatest = await apiService.getInstance().activiti.taskApi.getTaskComments(newTaskId, { 'latestFirst': true });

        const thirdTaskComment = { message: 'Third Task Comment' };

        await commentsPage.checkUserIconIsDisplayed();
        await commentsPage.checkUserIconIsDisplayed();

        await expect(await commentsPage.getTotalNumberOfComments()).toEqual('Comments (' + totalCommentsLatest.total + ')');

        await expect(await commentsPage.getMessage(0)).toEqual(totalCommentsLatest.data[0].message);
        await expect(await commentsPage.getMessage(1)).toEqual(totalCommentsLatest.data[1].message);

        await expect(await commentsPage.getUserName(0)).toEqual(totalCommentsLatest.data[0].createdBy.firstName + ' ' + totalCommentsLatest.data[0].createdBy.lastName);
        await expect(await commentsPage.getUserName(1)).toEqual(totalCommentsLatest.data[1].createdBy.firstName + ' ' + totalCommentsLatest.data[1].createdBy.lastName);

        await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
        await expect(await commentsPage.getTime(1)).toMatch(/(ago|few)/);

        await loginPage.login(secondUser.email, secondUser.password);

        await apiService.getInstance().activiti.taskApi.addTaskComment(thirdTaskComment, newTaskId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().selectRow(taskName.multiple_users);
        await taskPage.taskDetails().selectActivityTab();

        const totalComments = await apiService.getInstance().activiti.taskApi.getTaskComments(newTaskId, { 'latestFirst': true });

        await commentsPage.checkUserIconIsDisplayed();
        await commentsPage.checkUserIconIsDisplayed();
        await commentsPage.checkUserIconIsDisplayed();

        await expect(await commentsPage.getTotalNumberOfComments()).toEqual('Comments (' + totalComments.total + ')');

        await expect(await commentsPage.getMessage(0)).toEqual(totalComments.data[0].message);
        await expect(await commentsPage.getMessage(1)).toEqual(totalComments.data[1].message);
        await expect(await commentsPage.getMessage(2)).toEqual(totalComments.data[2].message);

        await expect(await commentsPage.getUserName(0)).toEqual(totalComments.data[0].createdBy.firstName + ' ' + totalComments.data[0].createdBy.lastName);
        await expect(await commentsPage.getUserName(1)).toEqual(totalComments.data[1].createdBy.firstName + ' ' + totalComments.data[1].createdBy.lastName);
        await expect(await commentsPage.getUserName(2)).toEqual(totalComments.data[2].createdBy.firstName + ' ' + totalComments.data[2].createdBy.lastName);

        await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
        await expect(await commentsPage.getTime(1)).toMatch(/(ago|few)/);
        await expect(await commentsPage.getTime(2)).toMatch(/(ago|few)/);
    });
});
