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

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { StringUtil } from '@alfresco/adf-testing';
import fs = require('fs');
import path = require('path');

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

    beforeAll(async (done) => {
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        const newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        assigneeUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        const pathFile = path.join(TestConfig.main.rootPath + app.file_location);
        const file = fs.createReadStream(pathFile);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

        await this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: showHeaderTask });

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    beforeEach(async (done) => {
        navigationBarPage.navigateToProcessServicesPage().goToTaskApp();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        done();
    });

    it('[C260383] Should be possible to modify a task', () => {
        taskPage.createNewTask().addName(tasks[0])
            .addForm(app.formName).clickStartButton();
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        taskPage.taskDetails().clickInvolvePeopleButton()
            .typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
            .checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        taskPage.taskDetails().clickAddInvolvedUserButton();
        expect(taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);
        taskPage.taskDetails().selectActivityTab().addComment(firstComment)
            .checkCommentIsDisplayed(firstComment);
        taskPage.clickOnAddChecklistButton().addName(firstChecklist).clickCreateChecklistButton();
        taskPage.checkChecklistIsDisplayed(firstChecklist);
        taskPage.taskDetails().selectDetailsTab();
    });

    it('[C260422] Should be possible to cancel a task', () => {
        taskPage.createNewTask().addName(tasks[3])
            .checkStartButtonIsEnabled().clickCancelButton();
        taskPage.tasksListPage().checkContentIsNotDisplayed(tasks[3]);
        expect(taskPage.filtersPage().getActiveFilter()).toEqual(CONSTANTS.TASK_FILTERS.MY_TASKS);
    });

    it('[C260423] Should be possible to save filled form', () => {
        taskPage.createNewTask()
            .addForm(app.formName).addName(tasks[4]).clickStartButton();
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[4]);
        expect(taskPage.formFields().setFieldValue(by.id, formTextField, formFieldValue)
            .getFieldValue(formTextField)).toEqual(formFieldValue);
        taskPage.formFields().refreshForm().checkFieldValue(by.id, formTextField, '');
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[4]);
        taskPage.formFields().setFieldValue(by.id, formTextField, formFieldValue)
            .checkFieldValue(by.id, formTextField, formFieldValue);
        taskPage.formFields().saveForm().checkFieldValue(by.id, formTextField, formFieldValue);
    });

    it('[C260425] Should be possible to assign a user', () => {
        taskPage.createNewTask()
            .addName(tasks[5])
            .addAssignee(assigneeUserModel.firstName)
            .clickStartButton();

        taskPage.tasksListPage().checkTaskListIsLoaded();
        taskPage.tasksListPage().getDataTable().waitForTableBody();
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        taskPage.tasksListPage().checkContentIsDisplayed(tasks[5]);
        taskPage.tasksListPage().selectRow(tasks[5]);
        taskPage.checkTaskTitle(tasks[5]);
        expect(taskPage.taskDetails().getAssignee()).toEqual(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
    });

    it('Attach a file', () => {
        taskPage.createNewTask().addName(tasks[6]).clickStartButton();
        attachmentListPage.clickAttachFileButton(jpgFile.location);
        attachmentListPage.checkFileIsAttached(jpgFile.name);
    });

    it('[C260420] Should Information box be hidden when showHeaderContent property is set on false', () => {
        taskPage.tasksListPage().checkContentIsDisplayed(showHeaderTask);

        processServiceTabBarPage.clickSettingsButton();
        taskPage.taskDetails().appSettingsToggles().disableShowHeader();
        processServiceTabBarPage.clickTasksButton();

        taskPage.taskDetails().taskInfoDrawerIsNotDisplayed();

        processServiceTabBarPage.clickSettingsButton();
        taskPage.taskDetails().appSettingsToggles().enableShowHeader();
        processServiceTabBarPage.clickTasksButton();

        taskPage.taskDetails().taskInfoDrawerIsDisplayed();
    });

    xit('[C260424] Should be able to see Spinner loading on task list when clicking on Tasks', () => {
        taskPage.tasksListPage().getDataTable().checkSpinnerIsDisplayed();
    });

    it('[C291780] Should be displayed an error message if task name exceed 255 characters', () => {
        const startDialog = taskPage.createNewTask().addName(taskName255Characters).checkStartButtonIsEnabled();
        startDialog.addName(taskNameBiggerThen255Characters)
            .blur(startDialog.name)
            .checkValidationErrorIsDisplayed(lengthValidationError)
            .checkStartButtonIsDisabled();

    });

});
