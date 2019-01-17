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
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TaskListDemoPage } from '../pages/adf/demo-shell/process-services/taskListDemoPage';
import { PaginationPage } from '../pages/adf/paginationPage';
import moment = require('moment');

import { Tenant } from '../models/APS/tenant';

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import { Util } from '../util/util';

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { AppsRuntimeActions } from '../actions/APS/appsRuntime.actions';
import { UsersActions } from '../actions/users.actions';
import { DateUtil } from '../util/dateUtil';

describe('Start Task - Custom App', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let taskListSinglePage = new TaskListDemoPage();
    let paginationPage = new PaginationPage();
    let processUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let appRuntime, secondAppRuntime;
    let secondApp = resources.Files.WIDGETS_SMOKE_TEST;
    let appModel, secondAppModel;
    let completedTasks = [];
    let paginationTasksName = ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08', 't09', 't10', 't11', 't12', 't13', 'taskOne', 'taskTwo', 'taskOne'];
    let completedTasksName = ['completed01', 'completed02', 'completed03'];
    let allTasksName = ['t01', 'taskOne', 'taskTwo', 'taskOne', 't13', 't12', 't11', 't10', 't09', 't08', 't07', 't06', 't05', 't04', 't03', 't02',
        'User Task', 'User Task', 'User Task', 'User Task'];
    let invalidAppId = '1234567890', invalidName = 'invalidName', invalidTaskId = '0000';
    let noTasksFoundMessage = 'No Tasks Found';
    let nrOfTasks = 20, currentPage = 1, totalNrOfPages = 'of 4';
    let currentDateStandardFormat = DateUtil.formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ');
    let currentDate = DateUtil.formatDate('MM/DD/YYYY');
    let beforeDate = moment().add(-1, 'days').format('MM/DD/YYYY');
    let afterDate = moment().add(1, 'days').format('MM/DD/YYYY');
    let taskWithDueDate;
    let processDefinitionId;

    let itemsPerPage = {
        five: '5',
        fiveValue: 5,
        ten: '10',
        tenValue: 10,
        fifteen: '15',
        fifteenValue: 15,
        twenty: '20',
        twentyValue: 20,
        default: '25'
    };

    beforeAll(async (done) => {
        let apps = new AppsActions();
        let appsRuntime = new AppsRuntimeActions();
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        appRuntime = await appsRuntime.getRuntimeAppByName(this.alfrescoJsApi, app.title);

        secondAppModel = await apps.importPublishDeployApp(this.alfrescoJsApi, secondApp.file_location);

        secondAppRuntime = await appsRuntime.getRuntimeAppByName(this.alfrescoJsApi, secondApp.title);

        processDefinitionId = await apps.startProcess(this.alfrescoJsApi, appModel);
        await apps.startProcess(this.alfrescoJsApi, appModel);
        await apps.startProcess(this.alfrescoJsApi, secondAppModel);
        await apps.startProcess(this.alfrescoJsApi, secondAppModel);

        for (let i = 1; i < paginationTasksName.length; i++) {
            await this.alfrescoJsApi.activiti.taskApi.createNewTask({ 'name': paginationTasksName[i] });
        }

        for (let i = 0; i < 3; i++) {
            completedTasks[i] = await this.alfrescoJsApi.activiti.taskApi.createNewTask({
                'name': completedTasksName[i],
                'dueDate': DateUtil.formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ', new Date(), i + 2)
            });
            await this.alfrescoJsApi.activiti.taskActionsApi.completeTask(completedTasks[i].id);
        }

        taskWithDueDate = await this.alfrescoJsApi.activiti.taskApi.createNewTask({
            'name': paginationTasksName[0],
            'dueDate': currentDateStandardFormat
        });

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    it('[C286362] Default pagination settings on task list', () => {
        navigationBarPage.clickTaskListButton();

        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(nrOfTasks);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName)).toEqual(true);
        });
        expect(paginationPage.getCurrentPage()).toEqual('Page 1');
        expect(paginationPage.getTotalPages()).toEqual('of 1');
        paginationPage.checkPageSelectorIsNotDisplayed();
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C286367] 20 Items per page', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeItemsPerPage(itemsPerPage.twentyValue);
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(nrOfTasks);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName)).toEqual(true);
        });
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C286365] 5 Items per page', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeItemsPerPage(itemsPerPage.fiveValue);
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(0, 5))).toEqual(true);
        });

        paginationPage.clickOnNextPage();
        currentPage++;
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 6-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(5, 10))).toEqual(true);
        });

        paginationPage.clickOnNextPage();
        currentPage++;
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(10, 15))).toEqual(true);
        });

        paginationPage.clickOnNextPage();
        currentPage++;
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(15, 20))).toEqual(true);
        });
    });

    it('[C286364] 10 Items per page', function () {
        currentPage = 1;
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeItemsPerPage(itemsPerPage.tenValue);
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(itemsPerPage.tenValue);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(0, 10))).toEqual(true);
        });
        paginationPage.clickOnNextPage();
        currentPage++;
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(itemsPerPage.tenValue);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(10, 20))).toEqual(true);
        });
    });

    it('[C286363] 15 Items per page', function () {
        currentPage = 1;
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeItemsPerPage(itemsPerPage.fifteenValue);
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fifteenValue);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(0, 15))).toEqual(true);
        });
        currentPage++;
        paginationPage.clickOnNextPage();
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + nrOfTasks + ' of ' + nrOfTasks);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(nrOfTasks - itemsPerPage.fifteenValue);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(15, 20))).toEqual(true);
        });
    });

    it('[C286366] Pagination is not displayed when no task is displayed', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeAppId(secondAppRuntime.id);
        expect(taskListSinglePage.getAppId()).toEqual(secondAppRuntime.id.toString());

        taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
    });

    it('[C286406] Invalid values for items per page', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeItemsPerPage('0').clickAppId();
        expect(taskListSinglePage.getItemsPerPageFieldErrorMessage()).toEqual('Value must be greater than or equal to 1');
    });

    it('[C286404] Navigate using page field', function () {
        currentPage = 1;
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeItemsPerPage(itemsPerPage.fiveValue);
        taskListSinglePage.typePage(currentPage);
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual(totalNrOfPages);
        paginationPage.checkPageSelectorIsDisplayed();
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(0, 5))).toEqual(true);
        });

        currentPage++;
        taskListSinglePage.typePage(currentPage);
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual(totalNrOfPages);
        paginationPage.checkPageSelectorIsDisplayed();
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(5, 10))).toEqual(true);
        });

        currentPage++;
        taskListSinglePage.typePage(currentPage);
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual(totalNrOfPages);
        paginationPage.checkPageSelectorIsDisplayed();
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(10, 15))).toEqual(true);
        });

        currentPage++;
        taskListSinglePage.typePage(currentPage);
        taskListSinglePage.taskList().getDataTable().waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual(totalNrOfPages);
        paginationPage.checkPageSelectorIsDisplayed();
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(15, 20))).toEqual(true);
        });
    });

    it('[C286405] Type invalid values to page field', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typePage('0').clickAppId();
        expect(taskListSinglePage.getPageFieldErrorMessage()).toEqual('Value must be greater than or equal to 1');

        taskListSinglePage.clickResetButton();
        taskListSinglePage.typePage('2');
        taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
    });

    it('[C286413] Task is displayed when typing into dueAfter field a date before the tasks due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueAfter(beforeDate);
        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(paginationTasksName[0]);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(1);
    });

    it('[C286414] Task is not displayed when typing into dueAfter field a date after the task due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueAfter(afterDate);
        taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
    });

    it('[C286415] Task is not displayed when typing into dueAfter field the same date as tasks due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueAfter(currentDate);
        taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
    });

    it('[C286424] Task is not displayed when typing into dueBefore field a date before the tasks due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueBefore(beforeDate);
        taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
    });

    it('[C286425] Task is displayed when typing into dueBefore field a date after the task due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueBefore(afterDate);
        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(paginationTasksName[0]);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(1);
    });

    it('[C286426] Task is not displayed when typing into dueBefore field the same date as tasks due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueBefore(currentDate);
        taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
    });

    it('[C286428] Task is not displayed when typing into dueAfter field a date before the task due date and into dueBefore a date before task due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueBefore(beforeDate);
        taskListSinglePage.typeDueAfter(beforeDate);
        taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
    });

    it('[C286427] Task is displayed when typing into dueAfter field a date before the tasks due date and into dueBefore a date after', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueBefore(afterDate);
        taskListSinglePage.typeDueAfter(beforeDate);
        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(paginationTasksName[0]);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(1);
    });

    it('[C286429] Task is not displayed when typing into dueAfter field a date after the tasks due date and into dueBefore a date after', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueBefore(afterDate);
        taskListSinglePage.typeDueAfter(afterDate);
        taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
    });

    it('[C280515] Should be able to see only the tasks of a specific app when typing the apps id in the appId field', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeAppId(appRuntime.id);
        expect(taskListSinglePage.getAppId()).toEqual(appRuntime.id.toString());

        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(app.taskName);
        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(app.taskName);
        taskListSinglePage.taskList().getDataTable().checkRowIsNotDisplayedByName(paginationTasksName[13]);
    });

    it('[C280569] Should be able to see No tasks found when typing an invalid appId', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeAppId(invalidAppId);
        expect(taskListSinglePage.getAppId()).toEqual(invalidAppId.toString());

        expect(taskListSinglePage.taskList().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

    it('[C280570] Should be able to see only the tasks with specific name when typing the name in the task name field', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeTaskName(paginationTasksName[13]);
        expect(taskListSinglePage.getTaskName()).toEqual(paginationTasksName[13]);

        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(paginationTasksName[13]);
        expect(taskListSinglePage.taskList().getDataTable().getNumberOfRowsDisplayedWithSameName(paginationTasksName[13])).toEqual(2);
    });

    it('[C280571] Should be able to see No tasks found when typing a task name that does not exist', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeTaskName(invalidName);
        expect(taskListSinglePage.getTaskName()).toEqual(invalidName);

        expect(taskListSinglePage.taskList().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

    it('[C280629] Should be able to see only the task with specific taskId when typing it in the task Id field', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeTaskId(taskWithDueDate.id);
        expect(taskListSinglePage.getTaskId()).toEqual(taskWithDueDate.id);

        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(taskWithDueDate.name);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(1);
    });

    it('[C280630] Should be able to see No tasks found when typing an invalid taskId', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeTaskId(invalidTaskId);
        expect(taskListSinglePage.getTaskId()).toEqual(invalidTaskId);

        expect(taskListSinglePage.taskList().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

    it('[C286589] Should be able to see only completed tasks when choosing Completed from state drop down', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.selectState('Completed');

        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(completedTasks[0].name);
        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(completedTasks[1].name);
        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(completedTasks[2].name);
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(3);
    });

    it('[C286597] Should be able to see only running tasks when choosing Active from state drop down', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.selectState('Active');

        taskListSinglePage.taskList().getDataTable().checkRowIsNotDisplayedByName(completedTasks[0].name);
        taskListSinglePage.taskList().getDataTable().checkRowIsNotDisplayedByName(completedTasks[1].name);
        taskListSinglePage.taskList().getDataTable().checkRowIsNotDisplayedByName(completedTasks[2].name);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName)).toEqual(true);
        });
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(20);
    });

    it('[C286598] Should be able to see all tasks when choosing All from state drop down', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.selectState('All');

        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(completedTasks[0].name);
        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(completedTasks[1].name);
        taskListSinglePage.taskList().getDataTable().checkRowIsDisplayedByName(completedTasks[2].name);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName)).toEqual(true);
        });
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(23);
    });

    // failing due to ADF-3667, blocked by ACTIVITI-1975
    xit('[C286599] Should be able to sort tasks ascending by due date when choosing due(asc) from sort drop down', () => {
        let sortAscByDueDate = [taskWithDueDate.name, completedTasks[0].name, completedTasks[1].name, completedTasks[2].name];

        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueAfter(beforeDate);
        taskListSinglePage.selectState('All');
        taskListSinglePage.selectSort('Due (asc)');

        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, sortAscByDueDate)).toEqual(true);
        });
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(4);

        taskListSinglePage.clickResetButton();
        taskListSinglePage.selectState('All');
        taskListSinglePage.selectSort('Due (asc)');
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(23);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list.slice(0, 4), sortAscByDueDate)).toEqual(true);
            expect(Util.arrayContainsArray(list.slice(4, list.length), allTasksName)).toEqual(true);
        });
    });

    // failing due to ADF-3667, blocked by ACTIVITI-1975
    xit('[C286600] Should be able to sort tasks descending by due date when choosing due(desc) from sort drop down', () => {
        let sortDescByDueDate = [completedTasks[2].name, completedTasks[1].name, completedTasks[0].name, taskWithDueDate.name];

        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueAfter(beforeDate);
        taskListSinglePage.selectState('All');
        taskListSinglePage.selectSort('Due (desc)');

        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, sortDescByDueDate)).toEqual(true);
        });
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(4);

        taskListSinglePage.clickResetButton();
        taskListSinglePage.selectState('All');
        taskListSinglePage.selectSort('Due (asc)');
        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(23);
        taskListSinglePage.taskList().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list.slice(0, 4), sortDescByDueDate)).toEqual(true);
            expect(Util.arrayContainsArray(list.slice(4, list.length), allTasksName)).toEqual(true);
        });
    });

    it('[C286622] Should be able to see only tasks that are part of a specific process when processDefinitionId is set', () => {
        let processDefinitionIds = [processDefinitionId.processDefinitionId, processDefinitionId.processDefinitionId,
            processDefinitionId.processDefinitionId, processDefinitionId.processDefinitionId];

        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeProcessDefinitionId(processDefinitionId.processDefinitionId);

        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(4);
        taskListSinglePage.getAllProcessDefinitionIds().then(function (list) {
            expect(Util.arrayContainsArray(list, processDefinitionIds)).toEqual(true);
        });
    });

    it('[C286623] Should be able to see No tasks found when typing an invalid processDefinitionId', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeProcessDefinitionId(invalidTaskId);

        expect(taskListSinglePage.taskList().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

    it('[C286622] Should be able to see only tasks that are part of a specific process when processInstanceId is set', () => {
        let processInstanceIds = [processDefinitionId.id];

        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeProcessInstanceId(processDefinitionId.id);
        expect(taskListSinglePage.getProcessInstanceId()).toEqual(processDefinitionId.id);

        expect(taskListSinglePage.taskList().getDataTable().getAllDisplayedRows()).toBe(1);
        taskListSinglePage.getAllProcessInstanceIds().then(function (list) {
            expect(Util.arrayContainsArray(list, processInstanceIds)).toEqual(true);
        });
    });

    it('[C286623] Should be able to see No tasks found when typing an invalid processInstanceId', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeProcessInstanceId(invalidTaskId);
        expect(taskListSinglePage.getProcessInstanceId()).toEqual(invalidTaskId);

        expect(taskListSinglePage.taskList().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

});
