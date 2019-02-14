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

import { LoginPage } from '../pages/adf/loginPage';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';

import CONSTANTS = require('../util/constants');

import { Tenant } from '../models/APS/tenant';

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';
import fs = require('fs');
import path = require('path');
import { browser } from 'protractor';

describe('People component', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let processUserModel, assigneeUserModel, secondAssigneeUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let taskPage = new TasksPage();
    let peopleTitle = 'People this task is shared with ';
    const processServices = new ProcessServicesPage();

    let tasks = ['no people involved task', 'remove people task', 'can not complete task', 'multiple users', 'completed filter'];

    beforeAll(async (done) => {
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        assigneeUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        secondAssigneeUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        let pathFile = path.join(TestConfig.main.rootPath + app.file_location);
        let file = fs.createReadStream(pathFile);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

        for (let i = 0; i < tasks.length; i++) {
            await this.alfrescoJsApi.activiti.taskApi.createNewTask({name: tasks[i]});
        }

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    beforeEach(async (done) => {
        loginPage.loginToProcessServicesUsingUserModel(processUserModel);
        await browser.get(TestConfig.adf.url + '/activiti');
        processServices.goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        done();
    });

    it('[C279989] Should no people be involved when no user is typed', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        taskPage.tasksListPage().selectRow(tasks[0]);

        taskPage.taskDetails().clickInvolvePeopleButton();
        taskPage.taskDetails().clickAddInvolvedUserButton();
        taskPage.taskDetails().checkNoPeopleIsInvolved();
    });

    it('[C279990] Should no people be involved when clicking on Cancel button', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        taskPage.tasksListPage().selectRow(tasks[0]);

        taskPage.taskDetails().clickInvolvePeopleButton()
            .typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.taskDetails().clickCancelInvolvePeopleButton();
        taskPage.taskDetails().checkNoPeopleIsInvolved();
    });

    it('[C261029] Should People dialog be displayed when clicking on add people button', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        taskPage.tasksListPage().selectRow(tasks[0]);

        taskPage.taskDetails().clickInvolvePeopleButton();
        expect(taskPage.taskDetails().getInvolvePeopleHeader()).toEqual('Add people and groups');
        expect(taskPage.taskDetails().getInvolvePeoplePlaceholder()).toEqual('Search user');
        taskPage.taskDetails().checkAddPeopleButtonIsEnabled().checkCancelButtonIsEnabled();
        taskPage.taskDetails().clickCancelInvolvePeopleButton();
    });

    it('[C279991] Should not be able to involve a user when is the creator of the task', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        taskPage.tasksListPage().selectRow(tasks[0]);

        taskPage.taskDetails().clickInvolvePeopleButton()
            .typeUser(processUserModel.firstName + ' ' + processUserModel.lastName)
            .noUserIsDisplayedInSearchInvolvePeople(processUserModel.firstName + ' ' + processUserModel.lastName);
        taskPage.taskDetails().clickAddInvolvedUserButton();
        taskPage.taskDetails().checkNoPeopleIsInvolved();
    });

    it('[C261030] Should involved user be removed when clicking on remove button', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        taskPage.tasksListPage().selectRow(tasks[0]);

        taskPage.taskDetails().clickInvolvePeopleButton()
            .typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.taskDetails().clickAddInvolvedUserButton();

        expect(taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);
        taskPage.taskDetails().removeInvolvedUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.taskDetails().checkNoPeopleIsInvolved();
    });

    it('[C280013] Should not be able to complete a task by a involved user', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[1]);
        taskPage.tasksListPage().selectRow(tasks[1]);

        taskPage.taskDetails().clickInvolvePeopleButton()
            .typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.taskDetails().clickAddInvolvedUserButton();

        expect(taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);

        loginPage.loginToProcessServicesUsingUserModel(assigneeUserModel);
        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[1]);
        taskPage.tasksListPage().selectRow(tasks[1]);

        taskPage.completeTaskNoFormNotDisplayed();
    });

    it('[C261031] Should be able to involve multiple users to a task', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[2]);
        taskPage.tasksListPage().selectRow(tasks[2]);

        taskPage.taskDetails().clickInvolvePeopleButton()
            .typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.taskDetails().clickAddInvolvedUserButton();

        expect(taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);
        expect(taskPage.taskDetails().getInvolvedUserEditAction(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual('can edit');
        expect(taskPage.taskDetails().getInvolvedPeopleTitle()).toEqual(peopleTitle + '(1)');

        taskPage.taskDetails().clickInvolvePeopleButton()
            .typeUser(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName)
            .selectUserToInvolve(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName)
            .checkUserIsSelected(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName);
        taskPage.taskDetails().clickAddInvolvedUserButton();

        expect(taskPage.taskDetails().getInvolvedUserEmail(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName))
            .toEqual(secondAssigneeUserModel.email);

        expect(taskPage.taskDetails().getInvolvedUserEditAction(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName))
            .toEqual('can edit');
        expect(taskPage.taskDetails().getInvolvedPeopleTitle()).toEqual(peopleTitle + '(2)');
    });

    it('[C280014] Should involved user see the task in completed filters when the task is completed', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        taskPage.tasksListPage().selectRow(tasks[3]);

        taskPage.taskDetails().clickInvolvePeopleButton()
            .typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.taskDetails().clickAddInvolvedUserButton();

        expect(taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);

        taskPage.completeTaskNoForm();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        taskPage.tasksListPage().selectRow(tasks[3]);
        expect(taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);

        loginPage.loginToProcessServicesUsingUserModel(assigneeUserModel);
        navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        taskPage.tasksListPage().selectRow(tasks[3]);

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        taskPage.tasksListPage().checkContentIsNotDisplayed(tasks[3]);
    });

});
