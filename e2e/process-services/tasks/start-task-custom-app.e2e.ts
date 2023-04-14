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

import { createApiService, ApplicationsUtil, LoginPage, UserModel, UsersActions } from '@alfresco/adf-testing';
import { browser } from 'protractor';

import { FileModel } from '../../models/ACS/file.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { AttachmentListPage } from './../pages/attachment-list.page';
import { ProcessServiceTabBarPage } from './../pages/process-service-tab-bar.page';
import { TasksPage } from './../pages/tasks.page';
import CONSTANTS = require('../../util/constants');

describe('Start Task - Custom App', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const attachmentListPage = new AttachmentListPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);

    let processUserModel; let assigneeUserModel;
    const formTextField = app.form_fields.form_fieldId;
    const formFieldValue = 'First value ';
    const taskPage = new TasksPage();
    const firstComment = 'comm1'; const firstChecklist = 'checklist1';
    const tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File', 'Spinner'];
    const showHeaderTask = 'Show Header';
    let appModel;
    const pngFile = new FileModel({
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location,
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name
    });

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        assigneeUserModel = await usersActions.createUser();
        processUserModel = await usersActions.createUser(new UserModel({ tenantId: assigneeUserModel.tenantId }));

        await apiService.login(processUserModel.username, processUserModel.password);

        appModel = await applicationsService.importPublishDeployApp(app.file_path);

        await loginPage.login(processUserModel.username, processUserModel.password);
   });

    it('[C263942] Should be possible to modify a task', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(appModel.name)).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        const task = await taskPage.createNewTask();
        await task.addName(tasks[0]);
        await task.selectForm(app.formName);
        await task.clickStartButton();

        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);

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

        await taskPage.checkChecklistIsDisplayed(firstChecklist);

        await taskPage.taskDetails().selectDetailsTab();
    });

    it('[C263947] Should be able to start a task without form', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(appModel.name)).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        const task = await taskPage.createNewTask();

        await task.addName(tasks[2]);
        await task.clickStartButton();

        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[2]);

        await taskPage.formFields().noFormIsDisplayed();

        await taskPage.taskDetails().waitFormNameEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
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
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        const task = await taskPage.createNewTask();

        await task.selectForm(app.formName);
        await task.addName(tasks[4]);
        await task.clickStartButton();

        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[4]);

        await taskPage.formFields().setFieldValue(formTextField, formFieldValue);

        await taskPage.formFields().refreshForm();

        await taskPage.formFields().checkFieldValue(formTextField, '');

        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[4]);

        await taskPage.formFields().setFieldValue(formTextField, formFieldValue);

        await taskPage.formFields().checkFieldValue(formTextField, formFieldValue);

        await taskPage.formFields().saveForm();

        await taskPage.formFields().checkFieldValue(formTextField, formFieldValue);
    });

    it('[C263951] Should be possible to assign a user', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(appModel.name)).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

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
