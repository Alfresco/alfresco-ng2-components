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

import CONSTANTS = require('../util/constants');

import Tenant = require('../models/APS/Tenant');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';
import fs = require('fs');
import path = require('path');

describe('People component', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let processUserModel, assigneeUserModel, secondAssigneeUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let taskPage = new TasksPage();
    let peopleTitle = 'People this task is shared with ';

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
            this.alfrescoJsApi.activiti.taskApi.createNewTask({name: tasks[i]});
        }

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    it('[C279989] Should no people be involved when no user is typed', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[0]).selectTaskFromTasksList(tasks[0]);

        taskPage.usingTaskDetails().clickInvolvePeopleButton();
        taskPage.usingTaskDetails().clickAddInvolvedUserButton();
        taskPage.usingTaskDetails().checkNoPeopleIsInvolved();
    });

    it('[C279990] Should no people be involved when clicking on Cancel button', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[0]).selectTaskFromTasksList(tasks[0]);

        taskPage.usingTaskDetails().clickInvolvePeopleButton()
            .typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.usingTaskDetails().clickCancelInvolvePeopleButton();
        taskPage.usingTaskDetails().checkNoPeopleIsInvolved();
    });

    it('[C261029] Should People dialog be displayed when clicking on add people button', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[0]).selectTaskFromTasksList(tasks[0]);

        taskPage.usingTaskDetails().clickInvolvePeopleButton();
        expect(taskPage.usingTaskDetails().getInvolvePeopleHeader()).toEqual('Add people and groups');
        expect(taskPage.usingTaskDetails().getInvolvePeoplePlaceholder()).toEqual('Search user');
        taskPage.usingTaskDetails().checkAddPeopleButtonIsEnabled().checkCancelButtonIsEnabled();
        taskPage.usingTaskDetails().clickCancelInvolvePeopleButton();
    });

    it('[C279991] Should not be able to involve a user when is the creator of the task', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[0]).selectTaskFromTasksList(tasks[0]);

        taskPage.usingTaskDetails().clickInvolvePeopleButton()
            .typeUser(processUserModel.firstName + ' ' + processUserModel.lastName)
            .noUserIsDisplayedInSearchInvolvePeople(processUserModel.firstName + ' ' + processUserModel.lastName);
        taskPage.usingTaskDetails().clickAddInvolvedUserButton();
        taskPage.usingTaskDetails().checkNoPeopleIsInvolved();
    });

    it('[C261030] Should involved user be removed when clicking on remove button', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[0]).selectTaskFromTasksList(tasks[0]);

        taskPage.usingTaskDetails().clickInvolvePeopleButton()
            .typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.usingTaskDetails().clickAddInvolvedUserButton();

        expect(taskPage.usingTaskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);
        taskPage.usingTaskDetails().removeInvolvedUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.usingTaskDetails().checkNoPeopleIsInvolved();
    });

    it('[C280013] Should not be able to complete a task by a involved user', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[1]).selectTaskFromTasksList(tasks[1]);

        taskPage.usingTaskDetails().clickInvolvePeopleButton()
            .typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.usingTaskDetails().clickAddInvolvedUserButton();

        expect(taskPage.usingTaskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);

        loginPage.loginToProcessServicesUsingUserModel(assigneeUserModel);
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[1]).selectTaskFromTasksList(tasks[1]);

        taskPage.completeTaskNoFormNotDisplayed();
    });

    it('[C261031] Should be able to involve multiple users to a task', () => {
        loginPage.loginToProcessServicesUsingUserModel(processUserModel);
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[2]).selectTaskFromTasksList(tasks[2]);

        taskPage.usingTaskDetails().clickInvolvePeopleButton()
            .typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.usingTaskDetails().clickAddInvolvedUserButton();

        expect(taskPage.usingTaskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);
        expect(taskPage.usingTaskDetails().getInvolvedUserEditAction(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual('can edit');
        expect(taskPage.usingTaskDetails().getInvolvedPeopleTitle()).toEqual(peopleTitle + '(1)');

        taskPage.usingTaskDetails().clickInvolvePeopleButton()
            .typeUser(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName)
            .selectUserToInvolve(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName)
            .checkUserIsSelected(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName);
        taskPage.usingTaskDetails().clickAddInvolvedUserButton();

        expect(taskPage.usingTaskDetails().getInvolvedUserEmail(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName))
            .toEqual(secondAssigneeUserModel.email);

        expect(taskPage.usingTaskDetails().getInvolvedUserEditAction(secondAssigneeUserModel.firstName + ' ' + secondAssigneeUserModel.lastName))
            .toEqual('can edit');
        expect(taskPage.usingTaskDetails().getInvolvedPeopleTitle()).toEqual(peopleTitle + '(2)');
    });

    it('[C280014] Should involved user see the task in completed filters when the task is completed', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[3]).selectTaskFromTasksList(tasks[3]);

        taskPage.usingTaskDetails().clickInvolvePeopleButton()
            .typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.usingTaskDetails().clickAddInvolvedUserButton();

        expect(taskPage.usingTaskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);

        taskPage.completeTaskNoForm();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.COMPL_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList(tasks[3]);
        expect(taskPage.usingTaskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);

        loginPage.loginToProcessServicesUsingUserModel(assigneeUserModel);
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.COMPL_TASKS);
        taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[3]).selectTaskFromTasksList(tasks[3]);

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
        taskPage.usingTasksListPage().checkTaskIsNotDisplayedInTasksList(tasks[3]);
    });

});
