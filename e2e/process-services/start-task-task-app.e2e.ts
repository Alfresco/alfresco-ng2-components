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

import { by } from 'protractor';

import { LoginPage } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { AttachmentListPage } from '../pages/adf/process-services/attachmentListPage';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/processServiceTabBarPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import CONSTANTS = require('../util/constants');

import { Tenant } from '../models/APS/tenant';
import { FileModel } from '../models/ACS/fileModel';

import { browser } from 'protractor';
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { StringUtil } from '@alfresco/adf-testing';
import fs = require('fs');
import path = require('path');
import { ChecklistDialog } from '../pages/adf/process-services/dialog/createChecklistDialog';

describe('Start Task - Task App', () => {

    const loginPage = new LoginPage();
    const attachmentListPage = new AttachmentListPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const navigationBarPage = new NavigationBarPage();

    let processUserModel, assigneeUserModel;
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const formTextField = app.form_fields.form_fieldId;
    const formFieldValue = 'First value ';
    const taskPage = new TasksPage();
    const firstComment = 'comm1', firstChecklist = 'checklist1';
    const taskName255Characters = StringUtil.generateRandomString(255);
    const taskNameBiggerThen255Characters = StringUtil.generateRandomString(256);
    const lengthValidationError = 'Length exceeded, 255 characters max.';
    const tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File'];
    const showHeaderTask = 'Show Header';
    const jpgFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.JPG.file_name
    });

    beforeAll(async () => {
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        assigneeUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        const pathFile = path.join(browser.params.testConfig.main.rootPath + app.file_location);
        const file = fs.createReadStream(pathFile);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

        await this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: showHeaderTask });

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

    });

    beforeEach(async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

    });

    it('[C260383] Should be possible to modify a task', async () => {
        const task = await taskPage.createNewTask();
        await task.addName(tasks[0]);
        await task.addForm(app.formName);
        await task.clickStartButton();
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        const taskDetails = await taskPage.taskDetails();
        await taskDetails.clickInvolvePeopleButton();
        await taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);

        await taskPage.taskDetails().clickAddInvolvedUserButton();

        await expect(await taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);

        await taskDetails.selectActivityTab();
        await taskDetails.addComment(firstComment);
        await taskDetails.checkCommentIsDisplayed(firstComment);

        await (await taskPage.clickOnAddChecklistButton()).addName(firstChecklist);

        const checklistDialog = new ChecklistDialog();
        await checklistDialog.clickCreateChecklistButton();

        await taskPage.checkChecklistIsDisplayed(firstChecklist);
        await taskPage.taskDetails().selectDetailsTab();
    });

    it('[C260422] Should be possible to cancel a task', async () => {
        const task = await taskPage.createNewTask();

        await task.addName(tasks[3]);
        await task.checkStartButtonIsEnabled();
        await task.clickCancelButton();

        await taskPage.tasksListPage().checkContentIsNotDisplayed(tasks[3]);
        await expect(await taskPage.filtersPage().getActiveFilter()).toEqual(CONSTANTS.TASK_FILTERS.MY_TASKS);
    });

    it('[C260423] Should be possible to save filled form', async () => {
        const task = await taskPage.createNewTask();
        await task.addForm(app.formName);
        await task.addName(tasks[4]);
        await task.clickStartButton();

        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[4]);

        const formFields = await taskPage.formFields();
        await formFields.setFieldValue(by.id, formTextField, formFieldValue);

        await formFields.refreshForm();
        await formFields.checkFieldValue(by.id, formTextField, '');
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[4]);

        await formFields.setFieldValue(by.id, formTextField, formFieldValue);
        await formFields.checkFieldValue(by.id, formTextField, formFieldValue);

        await taskPage.formFields().saveForm();
        await formFields.checkFieldValue(by.id, formTextField, formFieldValue);
    });

    it('[C260425] Should be possible to assign a user', async () => {
        const task = await taskPage.createNewTask();
        await task.addName(tasks[5]);
        await task.addAssignee(assigneeUserModel.firstName);
        await task.clickStartButton();

        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[5]);
        await taskPage.tasksListPage().selectRow(tasks[5]);
        await taskPage.checkTaskTitle(tasks[5]);
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
    });

    it('Attach a file', async () => {
        const startTaskDialog = await taskPage.createNewTask();
        await startTaskDialog.addName(tasks[6]);
        await startTaskDialog.clickStartButton();
        await attachmentListPage.clickAttachFileButton(jpgFile.location);
        await attachmentListPage.checkFileIsAttached(jpgFile.name);
    });

    it('[C260420] Should Information box be hidden when showHeaderContent property is set on false', async () => {
        await taskPage.tasksListPage().checkContentIsDisplayed(showHeaderTask);

        await processServiceTabBarPage.clickSettingsButton();
        await taskPage.taskDetails().appSettingsToggles().disableShowHeader();
        await processServiceTabBarPage.clickTasksButton();

        await taskPage.taskDetails().taskInfoDrawerIsNotDisplayed();

        await processServiceTabBarPage.clickSettingsButton();
        await taskPage.taskDetails().appSettingsToggles().enableShowHeader();
        await processServiceTabBarPage.clickTasksButton();

        await taskPage.taskDetails().taskInfoDrawerIsDisplayed();
    });

    it('[C291780] Should be displayed an error message if task name exceed 255 characters', async () => {
        const startDialog = await taskPage.createNewTask();
        await startDialog.addName(taskName255Characters);

        await startDialog.checkStartButtonIsEnabled();
        await startDialog.addName(taskNameBiggerThen255Characters);
        await startDialog.blur(startDialog.name);
        await startDialog.checkValidationErrorIsDisplayed(lengthValidationError);
        await startDialog.checkStartButtonIsDisabled();

    });

});
