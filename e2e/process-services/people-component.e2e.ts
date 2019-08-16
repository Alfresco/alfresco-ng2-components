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

import { LoginPage } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';

import CONSTANTS = require('../util/constants');

import { Tenant } from '../models/APS/tenant';

import { browser } from 'protractor';
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import fs = require('fs');
import path = require('path');

describe('People component', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    let processUserModel, assigneeUserModel, secondAssigneeUserModel;
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const taskPage = new TasksPage();
    const peopleTitle = 'People this task is shared with ';
    const processServices = new ProcessServicesPage();

    const tasks = ['no people involved task', 'remove people task', 'can not complete task', 'multiple users', 'completed filter'];

    beforeAll(async () => {
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        assigneeUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        secondAssigneeUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        const pathFile = path.join(browser.params.testConfig.main.rootPath + app.file_location);
        const file = fs.createReadStream(pathFile);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

        await this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[0] });
        await this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[1] });
        await this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[2] });
        await this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[3] });
        await this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[4] });

    });

    beforeEach(async () => {
        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        await navigationBarPage.navigateToProcessServicesPage();
        await (await processServices.goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

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

        await loginPage.loginToProcessServicesUsingUserModel(assigneeUserModel);
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

        await loginPage.loginToProcessServicesUsingUserModel(assigneeUserModel);
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        await taskPage.tasksListPage().selectRow(tasks[3]);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsNotDisplayed(tasks[3]);
    });

});
