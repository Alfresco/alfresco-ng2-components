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
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { ChecklistDialog } from '../pages/adf/process-services/dialog/createChecklistDialog';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import CONSTANTS = require('../util/constants');

import { Tenant } from '../models/APS/tenant';

import { browser } from 'protractor';
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import fs = require('fs');
import path = require('path');

describe('Checklist component', () => {

    const loginPage = new LoginPage();
    let processUserModel;
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const taskPage = new TasksPage();
    const processServices = new ProcessServicesPage();
    const checklistDialog = new ChecklistDialog();
    const navigationBarPage = new NavigationBarPage();

    const tasks = ['no checklist created task', 'checklist number task', 'remove running checklist', 'remove completed checklist', 'hierarchy'];
    const checklists = ['cancelCheckList', 'dialogChecklist', 'addFirstChecklist', 'addSecondChecklist'];
    const removeChecklist = ['removeFirstRunningChecklist', 'removeSecondRunningChecklist', 'removeFirstCompletedChecklist', 'removeSecondCompletedChecklist'];
    const hierarchyChecklist = ['checklistOne', 'checklistTwo', 'checklistOneChild', 'checklistTwoChild'];

    beforeAll(async () => {
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        const pathFile = path.join(browser.params.testConfig.main.rootPath + app.file_location);
        const file = fs.createReadStream(pathFile);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

        for (let i = 0; i < tasks.length; i++) {
            this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: tasks[i] });
        }

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

    });

    beforeEach(async () => {
        await navigationBarPage.clickHomeButton();
        await navigationBarPage.navigateToProcessServicesPage();
        await (await processServices.goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

    });

    it('[C279976] Should no checklist be created when no title is typed', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        await taskPage.tasksListPage().selectRow(tasks[0]);

        await (await taskPage.clickOnAddChecklistButton()).clickCreateChecklistButton();
        await taskPage.checkChecklistDialogIsNotDisplayed();
        await taskPage.checkNoChecklistIsDisplayed();
        await expect(await taskPage.getNumberOfChecklists()).toEqual('0');
    });

    it('[C279975] Should no checklist be created when clicking on Cancel button on checklist dialog', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        await taskPage.tasksListPage().selectRow(tasks[0]);

        await (await taskPage.clickOnAddChecklistButton()).addName(checklists[0]);
        await checklistDialog.clickCancelButton();
        await taskPage.checkChecklistDialogIsNotDisplayed();
        await taskPage.checkNoChecklistIsDisplayed();
        await expect(await taskPage.getNumberOfChecklists()).toEqual('0');
    });

    it('[C261025] Should Checklist dialog be displayed when clicking on add checklist button', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        await taskPage.tasksListPage().selectRow(tasks[0]);

        await (await taskPage.clickOnAddChecklistButton());
        await taskPage.checkChecklistDialogIsDisplayed();
        await expect(await taskPage.usingCheckListDialog().getDialogTitle()).toEqual('New Check');
        await expect(await taskPage.usingCheckListDialog().getNameFieldPlaceholder()).toEqual('Name');
        await taskPage.usingCheckListDialog().checkAddChecklistButtonIsEnabled();
        await checklistDialog.checkCancelButtonIsEnabled();
        await taskPage.usingCheckListDialog().clickCancelButton();
    });

    it('[C261026] Should Checklist number increase when a new checklist is added', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[1]);
        await taskPage.tasksListPage().selectRow(tasks[1]);

        await (await taskPage.clickOnAddChecklistButton()).addName(checklists[2]);
        await checklistDialog.clickCreateChecklistButton();
        await taskPage.checkChecklistIsDisplayed(checklists[2]);
        await expect(await taskPage.getNumberOfChecklists()).toEqual('1');

        await (await taskPage.clickOnAddChecklistButton()).addName(checklists[3]);
        await checklistDialog.clickCreateChecklistButton();
        await taskPage.checkChecklistIsDisplayed(checklists[3]);
        await taskPage.checkChecklistIsDisplayed(checklists[2]);
        await expect(await taskPage.getNumberOfChecklists()).toEqual('2');
    });

    it('[C279980] Should checklist be removed when clicking on remove button', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[2]);
        await taskPage.tasksListPage().selectRow(tasks[2]);

        await (await taskPage.clickOnAddChecklistButton());
        await taskPage.checkChecklistDialogIsDisplayed();
        await checklistDialog.addName(removeChecklist[0]);
        await checklistDialog.clickCreateChecklistButton();
        await taskPage.checkChecklistIsDisplayed(removeChecklist[0]);

        await (await taskPage.clickOnAddChecklistButton()).addName(removeChecklist[1]);
        await checklistDialog.clickCreateChecklistButton();
        await taskPage.checkChecklistIsDisplayed(removeChecklist[1]);

        await taskPage.removeChecklists(removeChecklist[1]);
        await taskPage.checkChecklistIsDisplayed(removeChecklist[0]);
        await taskPage.checkChecklistIsNotDisplayed(removeChecklist[1]);
    });

    it('[C261027] Should not be able to remove a completed Checklist when clicking on remove button', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[3]);
        await taskPage.tasksListPage().selectRow(tasks[3]);

        await (await taskPage.clickOnAddChecklistButton()).addName(removeChecklist[2]);
        await checklistDialog.clickCreateChecklistButton();
        await taskPage.checkChecklistIsDisplayed(removeChecklist[2]);

        await (await taskPage.clickOnAddChecklistButton()).addName(removeChecklist[3]);
        await checklistDialog.clickCreateChecklistButton();
        await taskPage.checkChecklistIsDisplayed(removeChecklist[3]);

        await taskPage.tasksListPage().selectRow(removeChecklist[3]);
        await taskPage.completeTaskNoForm();
        await taskPage.tasksListPage().checkContentIsNotDisplayed(removeChecklist[3]);

        await taskPage.tasksListPage().selectRow(tasks[3]);
        await taskPage.checkChecklistIsDisplayed(removeChecklist[2]);
        await taskPage.checkChecklistIsDisplayed(removeChecklist[3]);
        await expect(await taskPage.getNumberOfChecklists()).toEqual('2');

        await taskPage.checkChecklistsRemoveButtonIsNotDisplayed(removeChecklist[3]);
    });

    it('[C261028] Should all checklists of a task be completed when the task is completed', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[4]);
        await taskPage.tasksListPage().selectRow(tasks[4]);

        await (await taskPage.clickOnAddChecklistButton()).addName(hierarchyChecklist[0]);
        await checklistDialog.clickCreateChecklistButton();
        await (await taskPage.clickOnAddChecklistButton()).addName(hierarchyChecklist[1]);
        await checklistDialog.clickCreateChecklistButton();

        await taskPage.tasksListPage().selectRow(hierarchyChecklist[0]);
        await (await taskPage.clickOnAddChecklistButton()).addName(hierarchyChecklist[2]);
        await checklistDialog.clickCreateChecklistButton();
        await taskPage.checkChecklistIsDisplayed(hierarchyChecklist[2]);

        await taskPage.tasksListPage().selectRow(hierarchyChecklist[1]);
        await (await taskPage.clickOnAddChecklistButton()).addName(hierarchyChecklist[3]);
        await checklistDialog.clickCreateChecklistButton();
        await taskPage.checkChecklistIsDisplayed(hierarchyChecklist[3]);

        await taskPage.tasksListPage().selectRow(tasks[4]);
        await taskPage.completeTaskNoForm();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[4]);
        await taskPage.tasksListPage().checkContentIsDisplayed(hierarchyChecklist[0]);
        await taskPage.tasksListPage().checkContentIsDisplayed(hierarchyChecklist[1]);
        await taskPage.tasksListPage().checkContentIsDisplayed(hierarchyChecklist[2]);
        await taskPage.tasksListPage().checkContentIsDisplayed(hierarchyChecklist[3]);
    });

});
