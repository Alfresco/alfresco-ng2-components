/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { createApiService,
    ApplicationsUtil,
    LoginPage,
    ModelsActions,
    ProcessUtil,
    UsersActions
} from '@alfresco/adf-testing';
import { ProcessFiltersPage } from './../pages/process-filters.page';
import { CommentsPage } from '../../core/pages/comments.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ActivitiCommentsApi, TasksApi } from '@alfresco/js-api';

describe('Comment component for Processes', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const processFiltersPage = new ProcessFiltersPage();
    const commentsPage = new CommentsPage();
    const navigationBarPage = new NavigationBarPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const modelsActions = new ModelsActions(apiService);
    const commentsApi = new ActivitiCommentsApi(apiService.getInstance());
    const taskApi = new TasksApi(apiService.getInstance());

    let user; let appId; let processInstanceId; let addedComment;
    const processName = 'Comment APS';

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        user = await usersActions.createUser();
        await apiService.login(user.username, user.password);

        const importedApp = await applicationsService.importPublishDeployApp(app.file_path);
        appId = importedApp.id;

        const processWithComment = await new ProcessUtil(apiService).startProcessOfApp(importedApp.name, processName);
        processInstanceId = processWithComment.id;

        await loginPage.login(user.username, user.password);
    });

    afterAll(async () => {
        await modelsActions.deleteModel(appId);
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(user.tenantId);
    });

    it('[C260464] Should be able to add a comment on APS and check on ADF', async () => {
        await commentsApi.addProcessInstanceComment({ message: 'HELLO' }, processInstanceId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList(processName);

        addedComment = await commentsApi.getProcessInstanceComments(processInstanceId, { latestFirst: true });

        await commentsPage.checkUserIconIsDisplayed();

        await commentsPage.getTotalNumberOfComments('Comments (' + addedComment.total + ')');
        await expect(await commentsPage.getMessage(0)).toEqual(addedComment.data[0].message);
        await expect(await commentsPage.getUserName(0)).toEqual(addedComment.data[0].createdBy.firstName + ' ' + addedComment.data[0].createdBy.lastName);
        await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
    });

    it('[C260465] Should not be able to view process comment on included task', async () => {
        await commentsApi.addProcessInstanceComment({ message: 'GOODBYE' }, processInstanceId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList(processName);

        const taskQuery = await taskApi.listTasks({ processInstanceId });

        const taskId = taskQuery.data[0].id;

        const taskComments = await commentsApi.getTaskComments(taskId, { latestFirst: true });
        await expect(taskComments.total).toEqual(0);
    });

    it('[C260466] Should be able to display comments from Task on the related Process', async () => {
        const taskQuery = await taskApi.listTasks({ processInstanceId });

        const taskId = taskQuery.data[0].id;

        await commentsApi.addTaskComment({ message: 'Task Comment' }, taskId);

        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

        await processFiltersPage.clickRunningFilterButton();
        await processFiltersPage.selectFromProcessList(processName);

        const addedTaskComment = await commentsApi.getProcessInstanceComments(processInstanceId, { latestFirst: true });

        await commentsPage.checkUserIconIsDisplayed();

        await commentsPage.getTotalNumberOfComments('Comments (' + addedTaskComment.total + ')');
        await expect(await commentsPage.getMessage(0)).toEqual(addedTaskComment.data[0].message);
        await expect(await commentsPage.getUserName(0)).toEqual(addedTaskComment.data[0].createdBy.firstName + ' ' + addedTaskComment.data[0].createdBy.lastName);
        await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
    });
});
