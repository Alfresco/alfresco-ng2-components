/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import LoginPage = require('../pages/adf/loginPage');
import NavigationBarPage = require('../pages/adf/navigationBarPage');
import TaskListSinglePage = require('../pages/adf/process_services/taskListSinglePage');
import ProcessServicesPage = require('../pages/adf/process_services/processServicesPage');
import PaginationPage = require('../pages/adf/paginationPage');
import TasksPage = require('../pages/adf/process_services/tasksPage');
import AppPublish = require('../models/APS/AppPublish');
import CONSTANTS = require('../util/constants');
var moment = require('moment');

import Task = require('../models/APS/Task');
import Tenant = require('../models/APS/Tenant');

import TaskModel = require('../models/APS/TaskModel');
import FileModel = require('../models/ACS/fileModel');
import FormModel = require('../models/APS/FormModel');

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import Util = require('../util/util');

import dateFormat = require('dateformat');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { AppsRuntimeActions } from '../actions/APS/appsRuntime.actions';
import { UsersActions } from '../actions/users.actions';

import path = require('path');
import fs = require('fs');

describe('Start Task - Custom App', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let taskListSinglePage = new TaskListSinglePage();
    let paginationPage = new PaginationPage();
    let processUserModel, assigneeUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let appRuntime, secondAppRuntime;
    let secondApp = resources.Files.WIDGETS_SMOKE_TEST;
    let appModel, secondAppModel;
    let paginationTasksName = ["t01", "t02", "t03", "t04", "t05", "t06", "t07", "t08", "t09", "t10", "t11", "t12", "t13", "taskOne", "taskTwo", "taskOne"];
    let allTasksName = ["taskOne", "taskTwo", "taskOne", "t13", "t12", "t11", "t10", "t09", "t08", "t07", "t06", "t05", "t04", "t03", "t02", "t01", "User Task", "User Task", "User Task", "User Task"];
    let invalidAppId = "1234567890", invalidName = "invalidName";
    let noTasksFoundMessage = "No Tasks Found";
    let nrOfTasks = 20, currentPage = 1, totalNrOfPages = 'of 4';
    var currentDateStandardFormat=Util.getCrtDateInFormat('YYYY-MM-DDTHH:mm:ss.SSSZ');
    var currentDate=Util.getCrtDateInFormat('MM/DD/YYYY');
    var beforeDate=moment().add(-1, 'days').format('MM/DD/YYYY');
    var afterDate=moment().add(1, 'days').format('MM/DD/YYYY');

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

        console.log("Email si password ", processUserModel.email, processUserModel.password);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        appRuntime = await appsRuntime.getRuntimeAppByName(this.alfrescoJsApi, app.title);

        secondAppModel = await apps.importPublishDeployApp(this.alfrescoJsApi, secondApp.file_location);

        secondAppRuntime = await appsRuntime.getRuntimeAppByName(this.alfrescoJsApi, secondApp.title);

        await apps.startProcess(this.alfrescoJsApi, appModel);
        await apps.startProcess(this.alfrescoJsApi, appModel);
        await apps.startProcess(this.alfrescoJsApi, secondAppModel);
        await apps.startProcess(this.alfrescoJsApi, secondAppModel);

        for (let i = 1; i < paginationTasksName.length; i++) {
            await this.alfrescoJsApi.activiti.taskApi.createNewTask({'name': paginationTasksName[i]});
        };

        await this.alfrescoJsApi.activiti.taskApi.createNewTask({'name': paginationTasksName[0], 'dueDate': currentDateStandardFormat});

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    it('[C286362] Default pagination settings on task list', () => {
        navigationBarPage.clickTaskListButton();

        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(nrOfTasks);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
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
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(nrOfTasks);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName)).toEqual(true);
        });
        paginationPage.checkNextPageButtonIsDisabled();
        paginationPage.checkPreviousPageButtonIsDisabled();
    });

    it('[C286365] 5 Items per page', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeItemsPerPage(itemsPerPage.fiveValue);
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(nrOfTasks);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(0, 5))).toEqual(true);
        });

        paginationPage.clickOnNextPage();
        currentPage++;
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 6-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(nrOfTasks);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(5, 10))).toEqual(true);
        });

        paginationPage.clickOnNextPage();
        currentPage++;
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(nrOfTasks);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(10, 15))).toEqual(true);
        });

        paginationPage.clickOnNextPage();
        currentPage++;
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(nrOfTasks);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(15, 20))).toEqual(true);
        });
    });

    it('[C286364] 10 Items per page', function () {
        currentPage = 1;
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeItemsPerPage(itemsPerPage.fiveValue);
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(itemsPerPage.tenValue);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(0, 10))).toEqual(true);
        });
        paginationPage.clickOnNextPage();
        currentPage++;
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(itemsPerPage.tenValue);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(10, 20))).toEqual(true);
        });
    });

    it('[C286363] 15 Items per page', function () {
        currentPage = 1;
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeItemsPerPage(itemsPerPage.fiveValue);
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue * currentPage + ' of ' + nrOfTasks);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fifteenValue);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(0, 15))).toEqual(true);
        });
        currentPage++;
        paginationPage.clickOnNextPage();
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
        expect(paginationPage.getPaginationRange()).toEqual('Showing 16-' + nrOfTasks + ' of ' + nrOfTasks);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(nrOfTasks - itemsPerPage.fifteenValue);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(15, 20))).toEqual(true);
        });
    });

    it('[C286366] Pagination is not displayed when no task is displayed', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeAppId(secondAppRuntime.id);
        expect(taskListSinglePage.getAppId()).toEqual(secondAppRuntime.id.toString());

        taskListSinglePage.checkPaginationIsNotDisplayed();
    });

    it('[C286406] Invalid values for items per page', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeItemsPerPage('0');
        taskListSinglePage.checkPaginationIsNotDisplayed();
    });

    it('[C286404] Navigate using page field', function () {
        currentPage = 1;
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeItemsPerPage(itemsPerPage.fiveValue);
        taskListSinglePage.typePage(currentPage);
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual(totalNrOfPages);
        paginationPage.checkPageSelectorIsDisplayed();
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(0, 5))).toEqual(true);
        });

        currentPage++;
        taskListSinglePage.typePage(currentPage);
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual(totalNrOfPages);
        paginationPage.checkPageSelectorIsDisplayed();
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(5, 10))).toEqual(true);
        });

        currentPage++;
        taskListSinglePage.typePage(currentPage);
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual(totalNrOfPages);
        paginationPage.checkPageSelectorIsDisplayed();
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(10, 15))).toEqual(true);
        });

        currentPage++;
        taskListSinglePage.typePage(currentPage);
        taskListSinglePage.usingDataTable().waitForTableBody();
        expect(paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
        expect(paginationPage.getTotalPages()).toEqual(totalNrOfPages);
        paginationPage.checkPageSelectorIsDisplayed();
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(itemsPerPage.fiveValue);
        taskListSinglePage.usingDataTable().getAllRowsNameColumn().then(function (list) {
            expect(Util.arrayContainsArray(list, allTasksName.slice(15, 20))).toEqual(true);
        });
    });

    it('[C286405] Type invalid values to page field', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typePage('0');
        taskListSinglePage.checkPaginationIsNotDisplayed();

        taskListSinglePage.clickResetButton();
        taskListSinglePage.typePage('2');
        taskListSinglePage.checkPaginationIsNotDisplayed();
    });

    it('[C286413] Task is displayed when typing into dueAfter field a date before the tasks due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueAfter(beforeDate);
        taskListSinglePage.usingDataTable().checkRowIsDisplayedByName(paginationTasksName[0]);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(1);
    });

    it('[C286414] Task is not displayed when typing into dueAfter field a date after the task due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueAfter(afterDate);
        taskListSinglePage.checkPaginationIsNotDisplayed();
    });

    it('[C286415] Task is not displayed when typing into dueAfter field the same date as tasks due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueAfter(currentDate);
        taskListSinglePage.checkPaginationIsNotDisplayed();
    });

    it('[C286424] Task is not displayed when typing into dueBefore field a date before the tasks due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueBefore(beforeDate);
        taskListSinglePage.checkPaginationIsNotDisplayed();
    });

    it('[C286425] Task is displayed when typing into dueBefore field a date after the task due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueBefore(afterDate);
        taskListSinglePage.usingDataTable().checkRowIsDisplayedByName(paginationTasksName[0]);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(1);
    });

    it('[C286426] Task is not displayed when typing into dueBefore field the same date as tasks due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueBefore(currentDate);
        taskListSinglePage.checkPaginationIsNotDisplayed();
    });

    it('[C286428] Task is not displayed when typing into dueAfter field a date before the task due date and into dueBefore a date before task due date', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueBefore(beforeDate);
        taskListSinglePage.typeDueAfter(beforeDate);
        taskListSinglePage.checkPaginationIsNotDisplayed();
    });

    it('[C286427] Task is displayed when typing into dueAfter field a date before the tasks due date and into dueBefore a date after', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueBefore(afterDate);
        taskListSinglePage.typeDueAfter(beforeDate);
        taskListSinglePage.usingDataTable().checkRowIsDisplayedByName(paginationTasksName[0]);
        expect(taskListSinglePage.usingDataTable().getAllDisplayedRows()).toBe(1);
    });

    it('[C286429] Task is not displayed when typing into dueAfter field a date after the tasks due date and into dueBefore a date after', function () {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeDueBefore(afterDate);
        taskListSinglePage.typeDueAfter(afterDate);
        taskListSinglePage.checkPaginationIsNotDisplayed();
    });

    it('[C280515] Should be able to see only the tasks of a specific app when typing the apps id in the appId field', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeAppId(appRuntime.id);
        expect(taskListSinglePage.getAppId()).toEqual(appRuntime.id.toString());

        taskListSinglePage.usingDataTable().checkRowIsDisplayedByName(app.taskName);
        taskListSinglePage.usingDataTable().checkRowIsDisplayedByName(app.taskName);
        taskListSinglePage.usingDataTable().checkRowIsNotDisplayedByName(paginationTasksName[13]);
    });

    it('[C280569]  Should be able to see No tasks found when typing an invalid appId', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeAppId(invalidAppId);
        expect(taskListSinglePage.getAppId()).toEqual(invalidAppId.toString());

        expect(taskListSinglePage.getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

    it('[C280570] Should be able to see only the tasks with specific name when typing the name in the task name field', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeTaskName(paginationTasksName[13]);
        expect(taskListSinglePage.getTaskName()).toEqual(paginationTasksName[13]);

        taskListSinglePage.usingDataTable().checkRowIsDisplayedByName(paginationTasksName[13]);
        expect(taskListSinglePage.usingDataTable().getNumberOfRowsDisplayedWithSameName(paginationTasksName[13])).toEqual(2);
    });

    it('[C280571] Should be able to see No tasks found when typing a task name that does not exist', () => {
        navigationBarPage.clickTaskListButton();
        taskListSinglePage.clickResetButton();

        taskListSinglePage.typeTaskName(invalidName);
        expect(taskListSinglePage.getTaskName()).toEqual(invalidName);

        expect(taskListSinglePage.getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

});
