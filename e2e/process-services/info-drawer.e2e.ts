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

import { BrowserActions, BrowserVisibility, LocalStorageUtil, LoginPage, StringUtil, ApplicationService } from '@alfresco/adf-testing';
import {
    AlfrescoApiCompatibility as AlfrescoApi,
    AppDefinitionRepresentation,
    LightTenantRepresentation
} from '@alfresco/js-api';
import { browser, by, element } from 'protractor';
import { UsersActions } from '../actions/users.actions';
import { Tenant } from '../models/APS/tenant';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { TasksPage } from '../pages/adf/process-services/tasks.page';
import CONSTANTS = require('../util/constants');
import moment = require('moment');
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/process-service-tab-bar.page';
import { ProcessFiltersPage } from '../pages/adf/process-services/process-filters.page';
import { infoDrawerConfiguration } from './config/task.config';

describe('Info Drawer', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const taskPage = new TasksPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const processFiltersPage = new ProcessFiltersPage();

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const firstComment = 'comm1';

    const date = {
        form: '12/08/2017',
        header: 'Aug 12, 2017'
    };

    const taskDetails = {
        description: 'I am your Description',
        dueDate: date.form,
        status: 'Running',
        priority: '50',
        category: 'No category',
        parentName: 'No parent',
        dateFormat: 'll'
    };

    let processUserModelFullName: string;
    let assigneeUserModelFullName: string;
    let appCreated: AppDefinitionRepresentation;
    let newTenant: LightTenantRepresentation;

    beforeAll(async () => {
        const users = new UsersActions();
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());
        const assigneeUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);
        assigneeUserModelFullName = assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName;
        const processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);
        processUserModelFullName = processUserModel.firstName + ' ' + processUserModel.lastName;
        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);
        const applicationsService = new ApplicationService(this.alfrescoJsApi);
        appCreated = await applicationsService.importPublishDeployApp(app.file_path);

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);
    });

    afterAll(async () => {
        await this.alfrescoApi.activiti.modelsApi.deleteModel(appCreated.id);
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(newTenant.id);
    });

    beforeEach(async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
    });

    it('[C260319] New Task - displayed details', async () => {
        const name = StringUtil.generateRandomString(5);
        await taskPage.createTask({...taskDetails, formName: app.formName, name});
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
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
        await taskPage.createTask({...taskDetails, formName: app.formName, name});
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(name);
        await taskPage.tasksListPage().selectRow(name);

        await taskPage.checkTaskTitle(name);
        await expect(await taskPage.taskDetails().getPriority()).toEqual(taskDetails.priority);
        await taskPage.taskDetails().updatePriority('40');
        await expect(await taskPage.taskDetails().getPriority()).toEqual('40');
        await taskPage.taskDetails().updatePriority();
        await expect(await taskPage.taskDetails().getPriority()).toEqual('0');

        await taskPage.taskDetails().clickCompleteFormTask();
    });

    it('[C260325] Due Date - Changing', async () => {
        const name = StringUtil.generateRandomString(5);
        await taskPage.createTask({...taskDetails, formName: app.formName, name});
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
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
        await taskPage.createTask(<any> {...taskDetails, formName: '', name});
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
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
        await taskPage.createTask(<any> {...taskDetails, formName: app.formName, name});
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
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
        await BrowserActions.click(taskPage.taskDetails().assigneeField);
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
        await BrowserActions.click(taskPage.taskDetails().assigneeField);
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

        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        await taskPage.tasksListPage().checkContentIsNotDisplayed(app.taskName);
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().getDataTable().waitForTableBody();

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
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(app.taskName);
        await taskPage.tasksListPage().selectRow(app.taskName);

        await taskPage.checkTaskTitle(app.taskName);
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
        await taskPage.createTask({...taskDetails, formName: app.formName, name});
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(name);
        await taskPage.tasksListPage().selectRow(name);

        await taskPage.checkTaskTitle(name);
        await expect(await taskPage.taskDetails().isAssigneeClickable()).toBeTruthy();
        await shouldHaveInfoDrawerDetails({
            ...taskDetails,
            dueDate: 'Aug 12, 2017',
            fullName: processUserModelFullName,
            formName: app.formName
        });

        await taskPage.taskDetails().updateDescription('Good Bye');
        await expect(await taskPage.taskDetails().getDescription()).toEqual('Good Bye');
        await taskPage.taskDetails().updateDescription();
        await expect(await taskPage.taskDetails().getDescription()).toEqual('No description');

        await taskPage.taskDetails().clickCompleteFormTask();
    });

    it('[C260505] Should be possible customised Task Header changing the adf-task-header field in the app.config.json', async () => {
        await LocalStorageUtil.setConfigField('adf-task-header', JSON.stringify(infoDrawerConfiguration));

        const name = StringUtil.generateRandomString(5);
        await taskPage.createTask({...taskDetails, formName: app.formName, name});
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().getDataTable().waitForTableBody();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(name);
        await taskPage.tasksListPage().selectRow(name);

        await taskPage.checkTaskTitle(name);
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(processUserModelFullName);
        await expect(await taskPage.taskDetails().getStatus()).toEqual(taskDetails.status);
        await expect(await taskPage.taskDetails().getPriority()).toEqual(taskDetails.priority);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(taskDetails.parentName);
        await taskPage.taskDetails().checkDueDatePickerButtonIsNotDisplayed();
        await taskPage.taskDetails().checkEditDescriptionButtonIsNotDisplayed();

        await taskPage.taskDetails().clickCompleteFormTask();
    });

    async function shouldHaveInfoDrawerDetails({description, status, priority, category, parentName, dateFormat, formName, fullName, dueDate}) {
        await expect(await taskPage.taskDetails().getAssignee()).toEqual(fullName);
        await expect(await taskPage.taskDetails().getDescription()).toEqual(description);
        await expect(await taskPage.taskDetails().getStatus()).toEqual(status);
        await expect(await taskPage.taskDetails().getPriority()).toEqual(priority);
        await expect(await taskPage.taskDetails().getDueDate()).toEqual(dueDate !== 'No date' ? moment(dueDate).format(dateFormat) : 'No date');
        await expect(await taskPage.taskDetails().getCategory()).toEqual(category);
        await expect(await taskPage.taskDetails().getParentName()).toEqual(parentName);
        await expect(await taskPage.taskDetails().getCreated()).toEqual(moment(Date.now()).format(dateFormat));
        await expect(await taskPage.taskDetails().getFormName()).toEqual(formName);
    }
});
