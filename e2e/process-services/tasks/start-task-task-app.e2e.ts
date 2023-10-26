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

import { createApiService,
    ApplicationsUtil,
    LoginPage,
    StringUtil,
    TaskUtil,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { FileModel } from '../../models/ACS/file.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { AttachmentListPage } from '../pages/attachment-list.page';
import { ChecklistDialog } from '../pages/dialog/create-checklist-dialog.page';
import { TasksPage } from '../pages/tasks.page';
import * as CONSTANTS from '../../util/constants';

describe('Start Task - Task App', () => {
    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const attachmentListPage = new AttachmentListPage();
    const navigationBarPage = new NavigationBarPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const taskUtil = new TaskUtil(apiService);
    const applicationsUtil = new ApplicationsUtil(apiService);

    let processUserModel: UserModel;
    let assigneeUserModel: UserModel;
    const formTextField = app.form_fields.form_fieldId;
    const taskPage = new TasksPage();
    const tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File'];
    const jpgFile = new FileModel({
        location: browser.params.resources.Files.ADF_DOCUMENTS.JPG.file_location,
        name: browser.params.resources.Files.ADF_DOCUMENTS.JPG.file_name
    });

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        assigneeUserModel = await usersActions.createUser();

        processUserModel = await usersActions.createUser(new UserModel({ tenantId: assigneeUserModel.tenantId }));

        await apiService.login(processUserModel.username, processUserModel.password);

        await applicationsUtil.importApplication(app.file_path);

        await taskUtil.createStandaloneTask('Show Header');

        await loginPage.login(processUserModel.username, processUserModel.password);
    });

    beforeEach(async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
    });

    it('[C260383] Should be possible to modify a task', async () => {
        const task = await taskPage.createNewTask();
        await task.addName(tasks[0]);
        await task.selectForm(app.formName);
        await task.clickStartButton();
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[0]);
        const taskDetails = taskPage.taskDetails();

        await taskDetails.clickInvolvePeopleButton();
        await taskDetails.typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
        await taskDetails.checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);

        await taskPage.taskDetails().clickAddInvolvedUserButton();

        await expect(await taskPage.taskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
            .toEqual(assigneeUserModel.email);

        await taskDetails.selectActivityTab();
        const firstComment = 'comm1';
        await taskDetails.addComment(firstComment);
        await taskDetails.checkCommentIsDisplayed(firstComment);

        const firstChecklist = 'checklist1';
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
        await task.selectForm(app.formName);
        await task.addName(tasks[4]);
        await task.clickStartButton();

        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[4]);

        const formFields = taskPage.formFields();
        const formFieldValue = 'First value ';
        await formFields.setFieldValue(formTextField, formFieldValue);

        await formFields.refreshForm();
        await formFields.checkFieldValue(formTextField, '');
        await taskPage.tasksListPage().checkContentIsDisplayed(tasks[4]);

        await formFields.setFieldValue(formTextField, formFieldValue);
        await formFields.checkFieldValue(formTextField, formFieldValue);

        await taskPage.formFields().saveForm();
        await formFields.checkFieldValue(formTextField, formFieldValue);
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

    it('[C291780] Should be displayed an error message if task name exceed 255 characters', async () => {
        const startDialog = await taskPage.createNewTask();
        const taskName255Characters = StringUtil.generateRandomString(255);
        await startDialog.addName(taskName255Characters);

        await startDialog.checkStartButtonIsEnabled();
        const taskNameBiggerThen255Characters = StringUtil.generateRandomString(256);
        await startDialog.addName(taskNameBiggerThen255Characters);
        await startDialog.blur(startDialog.name);
        const lengthValidationError = 'Length exceeded, 255 characters max.';
        await startDialog.checkValidationErrorIsDisplayed(lengthValidationError);
        await startDialog.checkStartButtonIsDisabled();
    });
});
