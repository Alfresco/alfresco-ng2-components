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

import { Tenant } from '../models/APS/tenant';

import { FileModel } from '../models/ACS/fileModel';

import { browser } from 'protractor';
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

import CONSTANTS = require('../util/constants');

describe('Start Task - Custom App', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const attachmentListPage = new AttachmentListPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();

    let processUserModel, assigneeUserModel;
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const formTextField = app.form_fields.form_fieldId;
    const formFieldValue = 'First value ';
    const taskPage = new TasksPage();
    const firstComment = 'comm1', firstChecklist = 'checklist1';
    const tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File', 'Spinner'];
    const showHeaderTask = 'Show Header';
    let appModel;
    const pngFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name
    });

    beforeAll(async () => {
        const apps = new AppsActions();
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        assigneeUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

    });

    it('[C263942] Should be possible to modify a task', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(appModel.name)).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        const task = await taskPage.createNewTask();
        await task.addName(tasks[0]);
        await task.addForm(app.formName);
        await task.clickStartButton();

        await taskPage
            .tasksListPage()
            .checkContentIsDisplayed(tasks[0]);

        const taskDetails = await taskPage.taskDetails();

        await taskDetails.clickInvolvePeopleButton();
        await taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);

        await taskDetails.clickAddInvolvedUserButton();

        await expect(await taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
        ).toEqual(assigneeUserModel.email);

        await taskDetails.selectActivityTab();
        await taskDetails.addComment(firstComment);
        await taskDetails.checkCommentIsDisplayed(firstComment);

        const checklistDialog = await taskPage.clickOnAddChecklistButton();
        await checklistDialog.addName(firstChecklist);
        await checklistDialog.clickCreateChecklistButton();

        await taskPage
            .checkChecklistIsDisplayed(firstChecklist);

        await taskPage
            .taskDetails()
            .selectDetailsTab();
    });

    it('[C263947] Should be able to start a task without form', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(appModel.name)).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await taskPage
            .filtersPage()
            .goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        const task = await taskPage.createNewTask();

        await task.addName(tasks[2]);
        await task.clickStartButton();

        await taskPage
            .tasksListPage()
            .checkContentIsDisplayed(tasks[2]);

        await taskPage
            .formFields()
            .noFormIsDisplayed();

        await expect(await taskPage.taskDetails().getFormName()).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
    });

    it('[C263948] Should be possible to cancel a task', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(appModel.name)).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        const task = await taskPage.createNewTask();
        await task.addName(tasks[3]);
        await task.checkStartButtonIsEnabled();
        await task.clickCancelButton();

        await taskPage.tasksListPage().checkContentIsNotDisplayed(tasks[3]);

        await expect(await taskPage.filtersPage().getActiveFilter()).toEqual(CONSTANTS.TASK_FILTERS.MY_TASKS);
    });

    it('[C263949] Should be possible to save filled form', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(appModel.name)).clickTasksButton();
        await taskPage.filtersPage()
            .goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        const task = await taskPage.createNewTask();

        await task.addForm(app.formName);
        await task.addName(tasks[4]);
        await task.clickStartButton();

        await taskPage
            .tasksListPage()
            .checkContentIsDisplayed(tasks[4]);

        await taskPage.formFields()
            .setFieldValue(by.id, formTextField, formFieldValue);

        await taskPage
            .formFields()
            .refreshForm();

        await taskPage
            .formFields().checkFieldValue(by.id, formTextField, '');

        await taskPage
            .tasksListPage()
            .checkContentIsDisplayed(tasks[4]);

        await taskPage
            .formFields()
            .setFieldValue(by.id, formTextField, formFieldValue);

        await taskPage.formFields().checkFieldValue(by.id, formTextField, formFieldValue);

        await taskPage
            .formFields()
            .saveForm();

        await taskPage.formFields().checkFieldValue(by.id, formTextField, formFieldValue);
    });

    it('[C263951] Should be possible to assign a user', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(appModel.name)).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        const task = await taskPage.createNewTask();
        await task.addName(tasks[5]);
        await task.addAssignee(assigneeUserModel.firstName);
        await task.clickStartButton();

        await taskPage
            .tasksListPage()
            .checkTaskListIsLoaded();

        await taskPage
            .tasksListPage()
            .getDataTable().waitForTableBody();

        await taskPage.filtersPage()
            .goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);

        await taskPage.tasksListPage()
            .checkContentIsDisplayed(tasks[5]);
        await taskPage.tasksListPage().selectRow(tasks[5]);

        await taskPage.checkTaskTitle(tasks[5]);

        await expect(await taskPage.taskDetails().getAssignee()).toEqual(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
    });

    it('Attach a file', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(appModel.name)).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        const task = await taskPage.createNewTask();
        await task.addName(tasks[6]);
        await task.clickStartButton();

        await attachmentListPage.clickAttachFileButton(pngFile.location);
        await attachmentListPage.checkFileIsAttached(pngFile.name);
    });

    it('[C263945] Should Information box be hidden when showHeaderContent property is set on false on custom app', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(appModel.name)).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        const task = await taskPage.createNewTask();
        await task.addName(showHeaderTask);
        await task.clickStartButton();
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

});
