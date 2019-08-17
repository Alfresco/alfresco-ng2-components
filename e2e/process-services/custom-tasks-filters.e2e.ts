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
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TaskListDemoPage } from '../pages/adf/demo-shell/process-services/taskListDemoPage';
import { PaginationPage, DateUtil } from '@alfresco/adf-testing';
import moment = require('moment');

import { Tenant } from '../models/APS/tenant';

import { browser } from 'protractor';
import resources = require('../util/resources');
import { Util } from '../util/util';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AppsActions } from '../actions/APS/apps.actions';
import { AppsRuntimeActions } from '../actions/APS/appsRuntime.actions';
import { UsersActions } from '../actions/users.actions';

describe('Start Task - Custom App', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const taskListSinglePage = new TaskListDemoPage();
    const paginationPage = new PaginationPage();
    let processUserModel;
    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let appRuntime, secondAppRuntime;
    const secondApp = resources.Files.WIDGETS_SMOKE_TEST;
    let appModel, secondAppModel;
    const completedTasks = [];
    const paginationTasksName = ['t01', 't02', 't03', 't04', 't05', 't06', 't07', 't08', 't09', 't10', 't11', 't12', 't13', 'taskOne', 'taskTwo', 'taskOne'];
    const completedTasksName = ['completed01', 'completed02', 'completed03'];
    const allTasksName = ['t01', 'taskOne', 'taskTwo', 'taskOne', 't13', 't12', 't11', 't10', 't09', 't08', 't07', 't06', 't05', 't04', 't03', 't02',
        'User Task', 'User Task', 'User Task', 'User Task'];
    const invalidAppId = '1234567890', invalidName = 'invalidName', invalidTaskId = '0000';
    const noTasksFoundMessage = 'No Tasks Found';
    const nrOfTasks = 20;
    let currentPage = 1;
    const totalNrOfPages = 'of 4';
    const currentDateStandardFormat = DateUtil.formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const currentDate = DateUtil.formatDate('MM/DD/YYYY');
    const beforeDate = moment().add(-1, 'days').format('MM/DD/YYYY');
    const afterDate = moment().add(1, 'days').format('MM/DD/YYYY');
    let taskWithDueDate;
    let processDefinitionId;

    const itemsPerPage = {
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

    beforeAll(async () => {
        const apps = new AppsActions();
        const appsRuntime = new AppsRuntimeActions();
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

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

        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

    });

    describe('', () => {

        beforeEach(async () => {
            await navigationBarPage.clickTaskListButton();
            await taskListSinglePage.clickResetButton();
        });

        it('[C286362] Default pagination settings on task list', async () => {
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(nrOfTasks);

            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName)).toEqual(true);
            });

            await expect(await paginationPage.getCurrentPage()).toEqual('Page 1');
            await expect(await paginationPage.getTotalPages()).toEqual('of 1');
            await paginationPage.checkPageSelectorIsNotDisplayed();
            await paginationPage.checkNextPageButtonIsDisabled();
            await paginationPage.checkPreviousPageButtonIsDisabled();
        });

        it('[C286367] 20 Items per page', async () => {
            await taskListSinglePage.typeItemsPerPage(itemsPerPage.twentyValue);
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.twenty);
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(nrOfTasks);

            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName)).toEqual(true);
            });
            await paginationPage.checkNextPageButtonIsDisabled();
            await paginationPage.checkPreviousPageButtonIsDisabled();
        });

        it('[C286365] 5 Items per page', async () => {
            await taskListSinglePage.typeItemsPerPage(itemsPerPage.fiveValue);
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);

            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName.slice(0, 5))).toEqual(true);
            });

            await paginationPage.clickOnNextPage();

            currentPage++;
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 6-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);

            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName.slice(5, 10))).toEqual(true);
            });

            await paginationPage.clickOnNextPage();
            currentPage++;
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);

            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName.slice(10, 15))).toEqual(true);
            });

            await paginationPage.clickOnNextPage();
            currentPage++;
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.five);
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 16-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);
            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName.slice(15, 20))).toEqual(true);
            });
        });

        it('[C286364] 10 Items per page', async () => {
            currentPage = 1;
            await taskListSinglePage.typeItemsPerPage(itemsPerPage.tenValue);
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(itemsPerPage.tenValue);
            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName.slice(0, 10))).toEqual(true);
            });
            await paginationPage.clickOnNextPage();
            currentPage++;
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.ten);
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 11-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(itemsPerPage.tenValue);
            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName.slice(10, 20))).toEqual(true);
            });
        });

        it('[C286363] 15 Items per page', async () => {
            currentPage = 1;
            await taskListSinglePage.typeItemsPerPage(itemsPerPage.fifteenValue);
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 1-' + itemsPerPage.fifteenValue * currentPage + ' of ' + nrOfTasks);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(itemsPerPage.fifteenValue);
            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName.slice(0, 15))).toEqual(true);
            });
            currentPage++;
            await paginationPage.clickOnNextPage();
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentItemsPerPage()).toEqual(itemsPerPage.fifteen);
            await expect(await paginationPage.getPaginationRange()).toEqual('Showing 16-' + nrOfTasks + ' of ' + nrOfTasks);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(nrOfTasks - itemsPerPage.fifteenValue);
            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName.slice(15, 20))).toEqual(true);
            });
        });

        it('[C286366] Pagination is not displayed when no task is displayed', async () => {
            await taskListSinglePage.typeAppId(secondAppRuntime.id);
            await expect(await taskListSinglePage.getAppId()).toEqual(secondAppRuntime.id.toString());

            await taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
        });

        it('[C286406] Invalid values for items per page', async () => {
            await taskListSinglePage.typeItemsPerPage('0');
            await taskListSinglePage.clickAppId();
            await expect(await taskListSinglePage.getItemsPerPageFieldErrorMessage()).toEqual('Value must be greater than or equal to 1');
        });

        it('[C286404] Navigate using page field', async () => {
            currentPage = 1;
            await taskListSinglePage.typeItemsPerPage(itemsPerPage.fiveValue);
            await taskListSinglePage.typePage(currentPage);
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
            await expect(await paginationPage.getTotalPages()).toEqual(totalNrOfPages);
            await paginationPage.checkPageSelectorIsDisplayed();
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);
            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName.slice(0, 5))).toEqual(true);
            });

            currentPage++;
            await taskListSinglePage.typePage(currentPage);
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
            await expect(await paginationPage.getTotalPages()).toEqual(totalNrOfPages);
            await paginationPage.checkPageSelectorIsDisplayed();
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);
            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName.slice(5, 10))).toEqual(true);
            });

            currentPage++;
            await taskListSinglePage.typePage(currentPage);
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
            await expect(await paginationPage.getTotalPages()).toEqual(totalNrOfPages);
            await paginationPage.checkPageSelectorIsDisplayed();
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);
            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName.slice(10, 15))).toEqual(true);
            });

            currentPage++;
            await taskListSinglePage.typePage(currentPage);
            await taskListSinglePage.taskList().getDataTable().waitForTableBody();
            await expect(await paginationPage.getCurrentPage()).toEqual('Page ' + currentPage);
            await expect(await paginationPage.getTotalPages()).toEqual(totalNrOfPages);
            await paginationPage.checkPageSelectorIsDisplayed();
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(itemsPerPage.fiveValue);
            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName.slice(15, 20))).toEqual(true);
            });
        });

        it('[C286405] Type invalid values to page field', async () => {
            await taskListSinglePage.typePage('0');
            await taskListSinglePage.clickAppId();
            await expect(await taskListSinglePage.getPageFieldErrorMessage()).toEqual('Value must be greater than or equal to 1');

            await taskListSinglePage.clickResetButton();
            await taskListSinglePage.typePage('2');
            await taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
        });

        it('[C286413] Task is displayed when typing into dueAfter field a date before the tasks due date', async () => {
            await taskListSinglePage.typeDueAfter(beforeDate);
            await taskListSinglePage.taskList().checkContentIsDisplayed(paginationTasksName[0]);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(1);
        });

        it('[C286414] Task is not displayed when typing into dueAfter field a date after the task due date', async () => {
            await taskListSinglePage.typeDueAfter(afterDate);
            await taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
        });

        it('[C286415] Task is not displayed when typing into dueAfter field the same date as tasks due date', async () => {
            await taskListSinglePage.typeDueAfter(currentDate);
            await taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
        });

        it('[C286424] Task is not displayed when typing into dueBefore field a date before the tasks due date', async () => {
            await taskListSinglePage.typeDueBefore(beforeDate);
            await taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
        });

        it('[C286425] Task is displayed when typing into dueBefore field a date after the task due date', async () => {
            await taskListSinglePage.typeDueBefore(afterDate);
            await taskListSinglePage.taskList().checkContentIsDisplayed(paginationTasksName[0]);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(1);
        });

        it('[C286426] Task is not displayed when typing into dueBefore field the same date as tasks due date', async () => {
            await taskListSinglePage.typeDueBefore(currentDate);
            await taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
        });

        it('[C286428] Task is not displayed when typing into dueAfter field a date before the task due date and into dueBefore a date before task due date', async () => {
            await taskListSinglePage.typeDueBefore(beforeDate);
            await taskListSinglePage.typeDueAfter(beforeDate);
            await taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
        });

        it('[C286427] Task is displayed when typing into dueAfter field a date before the tasks due date and into dueBefore a date after', async () => {
            await taskListSinglePage.typeDueBefore(afterDate);
            await taskListSinglePage.typeDueAfter(beforeDate);
            await taskListSinglePage.taskList().checkContentIsDisplayed(paginationTasksName[0]);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(1);
        });

        it('[C286429] Task is not displayed when typing into dueAfter field a date after the tasks due date and into dueBefore a date after', async () => {
            await taskListSinglePage.typeDueBefore(afterDate);
            await taskListSinglePage.typeDueAfter(afterDate);
            await taskListSinglePage.paginationPage().checkPaginationIsNotDisplayed();
        });

        it('[C280515] Should be able to see only the tasks of a specific app when typing the apps id in the appId field', async () => {
            await taskListSinglePage.typeAppId(appRuntime.id);
            await expect(await taskListSinglePage.getAppId()).toEqual(appRuntime.id.toString());

            await taskListSinglePage.taskList().checkContentIsDisplayed(app.taskName);
            await taskListSinglePage.taskList().checkContentIsDisplayed(app.taskName);
            await taskListSinglePage.taskList().checkContentIsNotDisplayed(paginationTasksName[13]);
        });

        it('[C280569] Should be able to see No tasks found when typing an invalid appId', async () => {
            await taskListSinglePage.typeAppId(invalidAppId);
            await expect(await taskListSinglePage.getAppId()).toEqual(invalidAppId.toString());

            await expect(await taskListSinglePage.taskList().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C280570] Should be able to see only the tasks with specific name when typing the name in the task name field', async () => {
            await taskListSinglePage.typeTaskName(paginationTasksName[13]);
            await expect(await taskListSinglePage.getTaskName()).toEqual(paginationTasksName[13]);

            await taskListSinglePage.taskList().checkContentIsDisplayed(paginationTasksName[13]);
            await expect((await taskListSinglePage.taskList().getRowsDisplayedWithSameName(paginationTasksName[13])).length).toBe(2);
        });

        it('[C280571] Should be able to see No tasks found when typing a task name that does not exist', async () => {
            await taskListSinglePage.typeTaskName(invalidName);
            await expect(await taskListSinglePage.getTaskName()).toEqual(invalidName);

            await expect(await taskListSinglePage.taskList().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C280629] Should be able to see only the task with specific taskId when typing it in the task Id field', async () => {
            await taskListSinglePage.typeTaskId(taskWithDueDate.id);
            await expect(await taskListSinglePage.getTaskId()).toEqual(taskWithDueDate.id);

            await taskListSinglePage.taskList().checkContentIsDisplayed(taskWithDueDate.name);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(1);
        });

        it('[C280630] Should be able to see No tasks found when typing an invalid taskId', async () => {
            await taskListSinglePage.typeTaskId(invalidTaskId);
            await expect(await taskListSinglePage.getTaskId()).toEqual(invalidTaskId);

            await expect(await taskListSinglePage.taskList().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
        });

        it('[C286589] Should be able to see only completed tasks when choosing Completed from state drop down', async () => {
            await taskListSinglePage.selectState('Completed');

            await taskListSinglePage.taskList().checkContentIsDisplayed(completedTasks[0].name);
            await taskListSinglePage.taskList().checkContentIsDisplayed(completedTasks[1].name);
            await taskListSinglePage.taskList().checkContentIsDisplayed(completedTasks[2].name);
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(3);
        });

        it('[C286597] Should be able to see only running tasks when choosing Active from state drop down', async () => {
            await taskListSinglePage.selectState('Active');

            await taskListSinglePage.taskList().checkContentIsNotDisplayed(completedTasks[0].name);
            await taskListSinglePage.taskList().checkContentIsNotDisplayed(completedTasks[1].name);
            await taskListSinglePage.taskList().checkContentIsNotDisplayed(completedTasks[2].name);
            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName)).toEqual(true);
            });
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(20);
        });

        it('[C286598] Should be able to see all tasks when choosing All from state drop down', async () => {
            await taskListSinglePage.selectState('All');

            await taskListSinglePage.taskList().checkContentIsDisplayed(completedTasks[0].name);
            await taskListSinglePage.taskList().checkContentIsDisplayed(completedTasks[1].name);
            await taskListSinglePage.taskList().checkContentIsDisplayed(completedTasks[2].name);
            await taskListSinglePage.taskList().getAllRowsNameColumn().then(async (list) => {
                await expect(Util.arrayContainsArray(list, allTasksName)).toEqual(true);
            });
            await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(23);
        });
    });

    it('[C286622] Should be able to see only tasks that are part of a specific process when processDefinitionId is set', async () => {
        const processDefinitionIds = [processDefinitionId.processDefinitionId, processDefinitionId.processDefinitionId,
            processDefinitionId.processDefinitionId, processDefinitionId.processDefinitionId];

        await navigationBarPage.clickTaskListButton();
        await taskListSinglePage.clickResetButton();

        await taskListSinglePage.typeProcessDefinitionId(processDefinitionId.processDefinitionId);

        await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(4);
        await taskListSinglePage.getAllProcessDefinitionIds().then(async (list) => {
            await expect(Util.arrayContainsArray(list, processDefinitionIds)).toEqual(true);
        });
    });

    it('[C286623] Should be able to see No tasks found when typing an invalid processDefinitionId', async () => {
        await navigationBarPage.clickTaskListButton();
        await taskListSinglePage.clickResetButton();

        await taskListSinglePage.typeProcessDefinitionId(invalidTaskId);

        await expect(await taskListSinglePage.taskList().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

    it('[C286622] Should be able to see only tasks that are part of a specific process when processInstanceId is set', async () => {
        const processInstanceIds = [processDefinitionId.id];

        await navigationBarPage.clickTaskListButton();
        await taskListSinglePage.clickResetButton();

        await taskListSinglePage.typeProcessInstanceId(processDefinitionId.id);
        await expect(await taskListSinglePage.getProcessInstanceId()).toEqual(processDefinitionId.id);

        await expect(await taskListSinglePage.taskList().getDataTable().numberOfRows()).toBe(1);
        await taskListSinglePage.getAllProcessInstanceIds().then(async (list) => {
            await expect(Util.arrayContainsArray(list, processInstanceIds)).toEqual(true);
        });
    });

    it('[C286623] Should be able to see No tasks found when typing an invalid processInstanceId', async () => {
        await navigationBarPage.clickTaskListButton();
        await taskListSinglePage.clickResetButton();

        await taskListSinglePage.typeProcessInstanceId(invalidTaskId);
        await expect(await taskListSinglePage.getProcessInstanceId()).toEqual(invalidTaskId);

        await expect(await taskListSinglePage.taskList().getNoTasksFoundMessage()).toEqual(noTasksFoundMessage);
    });

});
