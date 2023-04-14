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
    BrowserActions,
    BrowserVisibility,
    LocalStorageUtil,
    LoginPage, ModelsActions,
    StringUtil,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { AppDefinitionRepresentation } from '@alfresco/js-api';
import { browser, by, element } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksPage } from './../pages/tasks.page';
import { ProcessServiceTabBarPage } from './../pages/process-service-tab-bar.page';
import { ProcessFiltersPage } from './../pages/process-filters.page';
import { infoDrawerConfiguration } from './../config/task.config';
import CONSTANTS = require('../../util/constants');
import * as moment from 'moment';

describe('Info Drawer', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const taskPage = new TasksPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const processFiltersPage = new ProcessFiltersPage();

    const apiService = createApiService();
    const applicationsService = new ApplicationsUtil(apiService);
    const modelsActions = new ModelsActions(apiService);
    const usersActions = new UsersActions(apiService);

    const firstComment = 'comm1';

    const date = {
        form: '12/08/2017',
        header: 'Aug 12, 2017',
        dateFormat: 'll'
    };

    const taskDetails = {
        description: 'I am your Description',
        dueDate: date.form,
        status: 'Running',
        priority: '0',
        category: 'No category',
        parentName: 'No parent',
        dateFormat: 'll'
    };

    let processUserModelFullName: string;
    let assigneeUserModelFullName: string;
    let appCreated: AppDefinitionRepresentation;
    let processUserModel;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        const assigneeUserModel = await usersActions.createUser();
        assigneeUserModelFullName = assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName;

        processUserModel = await usersActions.createUser(new UserModel({ tenantId: assigneeUserModel.tenantId }));
        processUserModelFullName = processUserModel.firstName + ' ' + processUserModel.lastName;

        await apiService.login(processUserModel.username, processUserModel.password);
        appCreated = await applicationsService.importPublishDeployApp(app.file_path);

        await loginPage.login(processUserModel.username, processUserModel.password);
    });

    afterAll(async () => {
        await modelsActions.deleteModel(appCreated.id);
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(processUserModel.tenantId);
    });

    beforeEach(async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
    });

    it('[C260319] New Task - displayed details', async () => {
        const name = StringUtil.generateRandomString(5);
        await taskPage.createTask({ ...taskDetails, formName: app.formName, name });
        await taskPage.tasksListPage().getDataTable().waitTillContentLoaded();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(name);
        await taskPage.tasksListPage().selectRow(name);

        await taskPage.checkTaskTitle(name);
        await expect(await taskPage.taskDetails().isAssigneeClickable()).toBeTruthy();
        await shouldHaveInfoDrawerDetails({
            ...taskDetails,
            dueDate: date.header,
            fullName: processUserModelFullName,
            formName: app.formName
        });

        await taskPage.taskDetails().selectActivityTab();
        await taskPage.taskDetails().checkIsEmptyCommentListDisplayed();
        await taskPage.taskDetails().addComment(firstComment);
        await taskPage.taskDetails().checkCommentIsDisplayed(firstComment);

        await taskPage.taskDetails().clickCompleteFormTask();
    });

    it('[C260323] Priority - Editing field', async () => {
        const name = StringUtil.generateRandomString(5);
        await taskPage.createTask({ ...taskDetails, formName: app.formName, name });
        await taskPage.tasksListPage().getDataTable().waitTillContentLoaded();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(name);
        await taskPage.tasksListPage().selectRow(name);

        await taskPage.checkTaskTitle(name);
        await expect(await taskPage.taskDetails().getPriority()).toEqual(taskDetails.priority);
        await taskPage.taskDetails().updatePriority('40');
        await taskPage.taskDetails().checkTaskDetailsDisplayed();
        await expect(await taskPage.taskDetails().getPriority()).toEqual('40');
        await taskPage.taskDetails().updatePriority();
        await taskPage.taskDetails().checkTaskDetailsDisplayed();
        await expect(await taskPage.taskDetails().getPriority()).toEqual('');

        await taskPage.taskDetails().clickCompleteFormTask();
    });

    it('[C260325] Due Date - Changing', async () => {
        const name = StringUtil.generateRandomString(5);
        await taskPage.createTask({ ...taskDetails, formName: app.formName, name });
        await taskPage.tasksListPage().getDataTable().waitTillContentLoaded();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(name);
        await taskPage.tasksListPage().selectRow(name);

        await taskPage.checkTaskTitle(name);
        await expect(await taskPage.taskDetails().isAssigneeClickable()).toBeTruthy();
        await shouldHaveInfoDrawerDetails({
            ...taskDetails,
            dueDate: date.header,
            fullName: processUserModelFullName,
            formName: app.formName
        });

        await taskPage.taskDetails().updateDueDate();
        await expect(await taskPage.taskDetails().getDueDate()).toEqual(moment('Aug 1, 2017').format(taskDetails.dateFormat));

        await taskPage.taskDetails().clickCompleteFormTask();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsNotDisplayed(name);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsNotDisplayed(name);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(name);
        await taskPage.tasksListPage().selectRow(name);

        await taskPage.checkTaskTitle(name);
        await shouldHaveInfoDrawerDetails({
            ...taskDetails,
            dueDate: 'Aug 1, 2017',
            status: 'Completed',
            fullName: processUserModelFullName,
            formName: app.formName
        });
    });

    it('[C260329] Task with no form', async () => {
        const name = StringUtil.generateRandomString(5);
        await taskPage.createTask(<any> { ...taskDetails, formName: '', name });
        await taskPage.tasksListPage().getDataTable().waitTillContentLoaded();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(name);
        await taskPage.tasksListPage().selectRow(name);

        await shouldHaveInfoDrawerDetails({
            ...taskDetails,
            dueDate: date.header,
            fullName: processUserModelFullName,
            formName: 'No form'
        });
        await taskPage.completeTaskNoForm();
    });

    it('[C260320] Assign user to the task', async () => {
        const name = StringUtil.generateRandomString(5);
        await taskPage.createTask(<any> { ...taskDetails, formName: app.formName, name });
        await taskPage.tasksListPage().getDataTable().waitTillContentLoaded();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(name);
        await taskPage.tasksListPage().selectRow(name);

        await taskPage.checkTaskTitle(name);
        await shouldHaveInfoDrawerDetails({
            ...taskDetails,
            dueDate: date.header,
            fullName: processUserModelFullName,
            formName: app.formName
        });

        await expect(await taskPage.taskDetails().isAssigneeClickable()).toBeTruthy();
        await BrowserActions.click(taskPage.taskDetails().assigneeButton);
        const cancelSearch = element(by.css('button[id="close-people-search"]'));
        await BrowserVisibility.waitUntilElementIsPresent(cancelSearch);
        await BrowserActions.click(cancelSearch);

        await shouldHaveInfoDrawerDetails({
            ...taskDetails,
            dueDate: date.header,
            fullName: processUserModelFullName,
            formName: app.formName
        });

        await expect(await taskPage.taskDetails().isAssigneeClickable()).toBeTruthy();
        await BrowserActions.click(taskPage.taskDetails().assigneeButton);
        const addPeople = element(by.css('button[id="add-people"]'));
        await BrowserVisibility.waitUntilElementIsPresent(addPeople);
        await BrowserActions.click(addPeople);

        await shouldHaveInfoDrawerDetails({
            ...taskDetails,
            dueDate: date.header,
            fullName: processUserModelFullName,
            formName: app.formName
        });

        await taskPage.taskDetails().updateAssignee(assigneeUserModelFullName);
        await taskPage.tasksListPage().getDataTable().waitTillContentLoaded();
        await taskPage.tasksListPage().checkContentIsNotDisplayed(app.taskName);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();

        await taskPage.taskDetails().checkTaskDetailsDisplayed();
        await browser.sleep(2000);
        await shouldHaveInfoDrawerDetails({
            ...taskDetails,
            dueDate: date.header,
            fullName: assigneeUserModelFullName,
            formName: app.formName
        });
    });

    it('[C260326] Process with a task included', async () => {
        await processServiceTabBarPage.clickProcessButton();
        const startProcess = await processFiltersPage.startProcess();
        await startProcess.enterProcessName('My process');
        await startProcess.selectFromProcessDropdown(app.processName);
        await startProcess.clickStartProcessButton();

        await processServiceTabBarPage.clickTasksButton();
        await taskPage.tasksListPage().getDataTable().waitTillContentLoaded();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);

        await taskPage.tasksListPage().checkContentIsDisplayed(app.taskName);
        await taskPage.tasksListPage().selectRow(app.taskName);

        await taskPage.checkTaskTitle(app.taskName);
        await taskPage.taskDetails().checkTaskDetailsDisplayed();
        await browser.sleep(2000);
        await shouldHaveInfoDrawerDetails({
            ...taskDetails,
            dueDate: 'No date',
            description: 'No description',
            parentName: app.processName,
            fullName: processUserModelFullName,
            formName: app.formName
        });

        await taskPage.taskDetails().clickCompleteFormTask();
    });

    it('[C260328] Description - Editing field', async () => {
        const name = StringUtil.generateRandomString(5);
        await taskPage.createTask({ ...taskDetails, formName: app.formName, name });
        await taskPage.tasksListPage().getDataTable().waitTillContentLoaded();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(name);
        await taskPage.tasksListPage().selectRow(name);

        await taskPage.checkTaskTitle(name);
        await taskPage.taskDetails().checkTaskDetailsDisplayed();
        await browser.sleep(2000);
        await expect(await taskPage.taskDetails().isAssigneeClickable()).toBeTruthy();
        await shouldHaveInfoDrawerDetails({
            ...taskDetails,
            dueDate: 'Aug 12, 2017',
            fullName: processUserModelFullName,
            formName: app.formName
        });

        await taskPage.taskDetails().updateDescription('');
        await expect(await taskPage.taskDetails().getDescriptionPlaceholder()).toEqual('No description');
        await taskPage.taskDetails().updateDescription('Good Bye');
        await expect(await taskPage.taskDetails().getDescription()).toEqual('Good Bye');

        await taskPage.taskDetails().clickCompleteFormTask();
    });

    it('[C260505] Should be possible customised Task Header changing the adf-task-header field in the app.config.json', async () => {
        await LocalStorageUtil.setConfigField('adf-task-header', JSON.stringify(infoDrawerConfiguration));

        const name = StringUtil.generateRandomString(5);
        await taskPage.createTask({ ...taskDetails, formName: app.formName, name });
        await taskPage.tasksListPage().getDataTable().waitTillContentLoaded();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(name);
        await taskPage.tasksListPage().selectRow(name);

        await taskPage.checkTaskTitle(name);
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(processUserModelFullName);
        await expect(await taskPage.taskDetails().getStatus()).toEqual(taskDetails.status);
        await expect(await taskPage.taskDetails().getPriority()).toEqual(taskDetails.priority);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(taskDetails.parentName);
        await taskPage.taskDetails().checkDueDatePickerButtonIsNotDisplayed();

        await taskPage.taskDetails().clickCompleteFormTask();
    });

    async function shouldHaveInfoDrawerDetails({ description, status, priority, category, parentName, dateFormat, formName, fullName, dueDate }) {
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(fullName);
        await expect(await taskPage.taskDetails().getDescription()).toEqual(description);
        await expect(await taskPage.taskDetails().getStatus()).toEqual(status);
        await expect(await taskPage.taskDetails().getPriority()).toEqual(priority);
        await expect(await taskPage.taskDetails().getDueDate()).toEqual(dueDate !== 'No date' ? moment(dueDate).format(dateFormat) : 'No date');
        await expect(await taskPage.taskDetails().getCategory()).toEqual(category);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(parentName);
        await expect(await taskPage.taskDetails().getCreated()).toEqual(moment(Date.now()).format(dateFormat));
        await taskPage.taskDetails().waitFormNameEqual(formName);
    }
});
