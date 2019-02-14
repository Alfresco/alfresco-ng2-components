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
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { ChecklistDialog } from '../pages/adf/process-services/dialog/createChecklistDialog';

import CONSTANTS = require('../util/constants');

import { Tenant } from '../models/APS/tenant';

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';
import fs = require('fs');
import path = require('path');
import { browser } from 'protractor';

describe('Checklist component', () => {

    let loginPage = new LoginPage();
    let processUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let taskPage = new TasksPage();
    const processServices = new ProcessServicesPage();
    const checklistDialog = new ChecklistDialog();

    let tasks = ['no checklist created task', 'checklist number task', 'remove running checklist', 'remove completed checklist', 'hierarchy'];
    let checklists = ['cancelCheckList', 'dialogChecklist', 'addFirstChecklist', 'addSecondChecklist'];
    let removeChecklist = ['removeFirstRunningChecklist', 'removeSecondRunningChecklist', 'removeFirstCompletedChecklist', 'removeSecondCompletedChecklist'];
    let hierarchyChecklist = ['checklistOne', 'checklistTwo', 'checklistOneChild', 'checklistTwoChild'];

    beforeAll(async (done) => {
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        let pathFile = path.join(TestConfig.main.rootPath + app.file_location);
        let file = fs.createReadStream(pathFile);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

        for (let i = 0; i < tasks.length; i++) {
            this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[i] });
        }

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    beforeEach(async (done) => {
        await browser.get(TestConfig.adf.url + '/activiti');
        processServices.goToTaskApp().clickTasksButton();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        done();
    });

    it('[C279976] Should no checklist be created when no title is typed', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        taskPage.tasksListPage().selectRow(tasks[0]);

        taskPage.clickOnAddChecklistButton().clickCreateChecklistButton();
        taskPage.checkChecklistDialogIsNotDisplayed().checkNoChecklistIsDisplayed();
        expect(taskPage.getNumberOfChecklists()).toEqual('0');
    });

    it('[C279975] Should no checklist be created when clicking on Cancel button on checklist dialog', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        taskPage.tasksListPage().selectRow(tasks[0]);

        taskPage.clickOnAddChecklistButton().addName(checklists[0]).clickCancelButton();
        taskPage.checkChecklistDialogIsNotDisplayed().checkNoChecklistIsDisplayed();
        expect(taskPage.getNumberOfChecklists()).toEqual('0');
    });

    it('[C261025] Should Checklist dialog be displayed when clicking on add checklist button', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        taskPage.tasksListPage().selectRow(tasks[0]);

        taskPage.clickOnAddChecklistButton();
        taskPage.checkChecklistDialogIsDisplayed();
        expect(taskPage.usingCheckListDialog().getDialogTitle()).toEqual('New Check');
        expect(taskPage.usingCheckListDialog().getNameFieldPlaceholder()).toEqual('Name');
        taskPage.usingCheckListDialog().checkAddChecklistButtonIsEnabled().checkCancelButtonIsEnabled();
        taskPage.usingCheckListDialog().clickCancelButton();
    });

    it('[C261026] Should Checklist number increase when a new checklist is added', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[1]);
        taskPage.tasksListPage().selectRow(tasks[1]);

        taskPage.clickOnAddChecklistButton().addName(checklists[2]).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(checklists[2]);
        expect(taskPage.getNumberOfChecklists()).toEqual('1');

        taskPage.clickOnAddChecklistButton().addName(checklists[3]).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(checklists[3]);
        taskPage.checkChecklistIsDisplayed(checklists[2]);
        expect(taskPage.getNumberOfChecklists()).toEqual('2');
    });

    it('[C279980] Should checklist be removed when clicking on remove button', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[2]);
        taskPage.tasksListPage().selectRow(tasks[2]);

        taskPage.clickOnAddChecklistButton();
        taskPage.checkChecklistDialogIsDisplayed();
        checklistDialog.addName(removeChecklist[0]).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(removeChecklist[0]);

        taskPage.clickOnAddChecklistButton().addName(removeChecklist[1]).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(removeChecklist[1]);

        taskPage.removeChecklists(removeChecklist[1]);
        taskPage.checkChecklistIsDisplayed(removeChecklist[0]);
        taskPage.checkChecklistIsNotDisplayed(removeChecklist[1]);
        // expect(taskPage.getNumberOfChecklists()).toEqual('1');
    });

    it('[C261027] Should not be able to remove a completed Checklist when clicking on remove button', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        taskPage.tasksListPage().selectRow(tasks[3]);

        taskPage.clickOnAddChecklistButton().addName(removeChecklist[2]).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(removeChecklist[2]);

        taskPage.clickOnAddChecklistButton().addName(removeChecklist[3]).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(removeChecklist[3]);

        taskPage.tasksListPage().selectRow(removeChecklist[3]);
        taskPage.completeTaskNoForm();
        taskPage.tasksListPage().checkContentIsNotDisplayed(removeChecklist[3]);

        taskPage.tasksListPage().selectRow(tasks[3]);
        taskPage.checkChecklistIsDisplayed(removeChecklist[2]);
        taskPage.checkChecklistIsDisplayed(removeChecklist[3]);
        expect(taskPage.getNumberOfChecklists()).toEqual('2');

        taskPage.checkChecklistsRemoveButtonIsNotDisplayed(removeChecklist[3]);
    });

    it('[C261028] Should all checklists of a task be completed when the task is completed', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[4]);
        taskPage.tasksListPage().selectRow(tasks[4]);

        taskPage.clickOnAddChecklistButton().addName(hierarchyChecklist[0]).clickCreateChecklistButton();
        taskPage.clickOnAddChecklistButton().addName(hierarchyChecklist[1]).clickCreateChecklistButton();

        taskPage.tasksListPage().selectRow(hierarchyChecklist[0]);
        taskPage.clickOnAddChecklistButton().addName(hierarchyChecklist[2]).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(hierarchyChecklist[2]);

        taskPage.tasksListPage().selectRow(hierarchyChecklist[1]);
        taskPage.clickOnAddChecklistButton().addName(hierarchyChecklist[3]).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(hierarchyChecklist[3]);

        taskPage.tasksListPage().selectRow(tasks[4]);
        taskPage.completeTaskNoForm();

        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[4]);
        taskPage.tasksListPage().checkContentIsDisplayed(hierarchyChecklist[0]);
        taskPage.tasksListPage().checkContentIsDisplayed(hierarchyChecklist[1]);
        taskPage.tasksListPage().checkContentIsDisplayed(hierarchyChecklist[2]);
        taskPage.tasksListPage().checkContentIsDisplayed(hierarchyChecklist[3]);
    });

});
