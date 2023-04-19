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

import { createApiService, ApplicationsUtil, LoginPage, TaskUtil, UserModel, UsersActions } from '@alfresco/adf-testing';
import { TasksPage } from './../pages/tasks.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ProcessServicesPage } from './../pages/process-services.page';
import { browser } from 'protractor';
import CONSTANTS = require('../../util/constants');

describe('People component', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const taskPage = new TasksPage();
    const processServices = new ProcessServicesPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const taskUtil = new TaskUtil(apiService);
    const applicationUtil = new ApplicationsUtil(apiService);

    let processUserModel; let assigneeUserModel; let secondAssigneeUserModel;
    const peopleTitle = 'People this task is shared with ';

    const tasks = ['no people involved task', 'remove people task', 'can not complete task', 'multiple users', 'completed filter'];

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        assigneeUserModel = await usersActions.createUser();
        secondAssigneeUserModel = await usersActions.createUser(new UserModel({ tenantId: assigneeUserModel.tenantId }));
        processUserModel = await usersActions.createUser(new UserModel({ tenantId: assigneeUserModel.tenantId }));

        await apiService.login(processUserModel.username, processUserModel.password);

        await applicationUtil.importApplication(app.file_path);

        await taskUtil.createStandaloneTask(tasks[0]);
        await taskUtil.createStandaloneTask(tasks[1]);
        await taskUtil.createStandaloneTask(tasks[2]);
        await taskUtil.createStandaloneTask(tasks[3]);
        await taskUtil.createStandaloneTask(tasks[4]);
    });

    beforeEach(async () => {
        await loginPage.login(processUserModel.username, processUserModel.password);

        await navigationBarPage.navigateToProcessServicesPage();
        await (await processServices.goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
    });

    afterEach(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C279989] Should no people be involved when no user is typed', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        await taskPage.tasksListPage().selectRow(tasks[0]);

        await taskPage.taskDetails().clickInvolvePeopleButton();
        await taskPage.taskDetails().clickAddInvolvedUserButton();
        await taskPage.taskDetails().checkNoPeopleIsInvolved();
    });

    it('[C279990] Should no people be involved when clicking on Cancel button', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        await taskPage.tasksListPage().selectRow(tasks[0]);

        const taskDetails = await taskPage.taskDetails();

        await taskDetails.clickInvolvePeopleButton();
        await taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);

        await taskPage.taskDetails().clickCancelInvolvePeopleButton();
        await taskPage.taskDetails().checkNoPeopleIsInvolved();
    });

    it('[C261029] Should People dialog be displayed when clicking on add people button', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        await taskPage.tasksListPage().selectRow(tasks[0]);

        const taskDetails = await taskPage.taskDetails();

        await taskDetails.clickInvolvePeopleButton();
        await expect(await taskPage.taskDetails().getInvolvePeopleHeader()).toEqual('Add people and groups');
        await expect(await taskPage.taskDetails().getInvolvePeoplePlaceholder()).toEqual('Search user');

        await taskDetails.checkAddPeopleButtonIsEnabled();
        await taskDetails.checkCancelButtonIsEnabled();
        await taskDetails.clickCancelInvolvePeopleButton();
    });

    it('[C279991] Should not be able to involve a user when is the creator of the task', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        await taskPage.tasksListPage().selectRow(tasks[0]);

        const taskDetails = await taskPage.taskDetails();
        await taskDetails.clickInvolvePeopleButton();
        await taskDetails.typeUser(processUserModel.firstName + ' ' + processUserModel.lastName);
        await taskDetails.noUserIsDisplayedInSearchInvolvePeople(processUserModel.firstName + ' ' + processUserModel.lastName);
        await taskPage.taskDetails().clickAddInvolvedUserButton();
        await taskPage.taskDetails().checkNoPeopleIsInvolved();
    });

    it('[C261030] Should involved user be removed when clicking on remove button', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        await taskPage.tasksListPage().selectRow(tasks[0]);

        const taskDetails = await taskPage.taskDetails();
        await taskDetails.clickInvolvePeopleButton();
        await taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);

        await taskPage.taskDetails().clickAddInvolvedUserButton();

        await expect(await taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);
        await taskPage.taskDetails().removeInvolvedUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskPage.taskDetails().checkNoPeopleIsInvolved();
    });

    it('[C280013] Should not be able to complete a task by a involved user', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[1]);
        await taskPage.tasksListPage().selectRow(tasks[1]);

        const taskDetails = await taskPage.taskDetails();
        await taskDetails.clickInvolvePeopleButton();
        await taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskPage.taskDetails().clickAddInvolvedUserButton();

        await expect(await taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);

        await navigationBarPage.clickLogoutButton();
        await loginPage.login(assigneeUserModel.username, assigneeUserModel.password);
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[1]);
        await taskPage.tasksListPage().selectRow(tasks[1]);

        await taskPage.completeTaskNoFormNotDisplayed();
    });

    it('[C261031] Should be able to involve multiple users to a task', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[2]);
        await taskPage.tasksListPage().selectRow(tasks[2]);

        const taskDetails = await taskPage.taskDetails();
        await taskPage.taskDetails().clickInvolvePeopleButton();
        await taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskPage.taskDetails().clickAddInvolvedUserButton();

        await expect(await taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);
        await expect(await taskPage.taskDetails().getInvolvedPeopleTitle()).toEqual(peopleTitle + '(1)');

        const taskDetails2 = await taskPage.taskDetails();
        await taskDetails2.clickInvolvePeopleButton();
        await taskDetails2.typeUser(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName);
        await taskDetails2.selectUserToInvolve(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName);
        await taskDetails2.checkUserIsSelected(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName);

        await taskPage.taskDetails().clickAddInvolvedUserButton();

        await expect(await taskPage.taskDetails().getInvolvedUserEmail(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName))
            .toEqual(secondAssigneeUserModel.email);
        await expect(await taskPage.taskDetails().getInvolvedPeopleTitle()).toEqual(peopleTitle + '(2)');
    });

    it('[C280014] Should involved user see the task in completed filters when the task is completed', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        await taskPage.tasksListPage().selectRow(tasks[3]);

        const taskDetails = await taskPage.taskDetails();
        await taskDetails.clickInvolvePeopleButton();
        await taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);

        await taskPage.taskDetails().clickAddInvolvedUserButton();

        await expect(await taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);

        await taskPage.completeTaskNoForm();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().selectRow(tasks[3]);
        await expect(await taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);

        await navigationBarPage.clickLogoutButton();
        await loginPage.login(assigneeUserModel.username, assigneeUserModel.password);
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        await taskPage.tasksListPage().selectRow(tasks[3]);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsNotDisplayed(tasks[3]);
    });
});
