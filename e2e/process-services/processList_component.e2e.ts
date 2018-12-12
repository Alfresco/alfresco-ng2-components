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

import { LoginPage } from '../pages/adf/loginPage';
import { ProcessListDemoPage } from '../pages/adf/process_services/processListDemoPage';

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';
import { browser, by } from 'protractor';
import { ContentListPage } from '../pages/adf/dialog/contentListPage';

describe('Process List Test', () => {

    const loginPage = new LoginPage();
    const processListDemoPage = new ProcessListDemoPage();
    const contentList = new ContentListPage();

    let appWithDateField = resources.Files.APP_WITH_DATE_FIELD_FORM;
    let appWithUserWidget = resources.Files.APP_WITH_USER_WIDGET;
    let appDateModel, appUserWidgetModel, user;

    let processList = ['Process With Date', 'Process With Date 2', 'Process With User Widget', 'Process With User Widget 2'];

    let processName = {
        procWithDate: 'Process With Date',
        completedProcWithDate: 'Process With Date 2',
        procWithUserWidget: 'Process With User Widget',
        completedProcWithUserWidget: 'Process With User Widget 2'
    };

    let errorMessages = {
        appIdNumber: 'App ID must be a number',
        insertAppId: 'Insert App ID'
    };

    let appWithDateFieldId = 0;
    let appWithUserWidgetId = 0;
    let procWithDate, completedProcWithDate, completedProcWithUserWidget;

    beforeAll(async (done) => {
        let apps = new AppsActions();
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        appDateModel = await apps.importPublishDeployApp(this.alfrescoJsApi, appWithDateField.file_location);

        procWithDate = await apps.startProcess(this.alfrescoJsApi, appDateModel, processName.procWithDate);
        completedProcWithDate = await apps.startProcess(this.alfrescoJsApi, appDateModel, processName.completedProcWithDate);

        appUserWidgetModel = await apps.importPublishDeployApp(this.alfrescoJsApi, appWithUserWidget.file_location);

        await apps.startProcess(this.alfrescoJsApi, appUserWidgetModel, processName.procWithUserWidget);
        completedProcWithUserWidget = await apps.startProcess(this.alfrescoJsApi, appUserWidgetModel, processName.completedProcWithUserWidget);

        let appDefinitions = await this.alfrescoJsApi.activiti.appsApi.getAppDefinitions();
        let i = 0;

        do {
            if (appDefinitions.data[i].modelId === appDateModel.id) {
                appWithDateFieldId = appDefinitions.data[i].id;
            } else if (appDefinitions.data[i].modelId === appUserWidgetModel.id) {
                appWithUserWidgetId = appDefinitions.data[i].id;
            }
        }while ((appWithDateFieldId === 0 || appWithUserWidgetId === 0) && ++i < appDefinitions.size);

        let taskList = await this.alfrescoJsApi.activiti.taskApi.listTasks();

        let procWithDateTaskId = 0;
        let procWithUserWidgetTaskId = 0;
        i = 0;

        do {
            if (taskList.data[i].processInstanceId === completedProcWithDate.id) {
                procWithDateTaskId = taskList.data[i].id;
            } else if (taskList.data[i].processInstanceId === completedProcWithUserWidget.id) {
                procWithUserWidgetTaskId = taskList.data[i].id;
            }
        }while ((procWithDateTaskId === 0 || procWithUserWidgetTaskId === 0) && ++i < taskList.size);

        await this.alfrescoJsApi.activiti.taskApi.completeTaskForm(procWithDateTaskId, {values: {label: null }});
        await this.alfrescoJsApi.activiti.taskFormsApi.completeTaskForm(procWithUserWidgetTaskId, {values: {label: null }});

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appDateModel.id);
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appUserWidgetModel.id);

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(user.tenantId);

        done();
    });

    beforeEach((done) => {
        browser.get(TestConfig.adf.url + '/process-list');
        done();
    });

    it('[C286638] Should display all process by default', () => {
        processListDemoPage.checkAppIdFieldIsDisplayed()
            .checkProcessInstanceIdFieldIsDisplayed()
            .checkProcessInstanceIdFieldIsDisplayed()
            .checkSortFieldIsDisplayed()
            .checkStateFieldIsDisplayed();
    });

    it('[C282006] Should be able to filter processes with App ID', () => {
        processListDemoPage.addAppId('a');

        processListDemoPage.checkErrorMessageIsDisplayed(errorMessages.appIdNumber);
        processListDemoPage.clickResetButton();

        processListDemoPage.addAppId('12345');

        processListDemoPage.checkNoProcessFoundIsDisplayed();

        processListDemoPage.addAppId(appWithDateFieldId);

        processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);
        processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate);

        processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget);
        processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget);
    });

    it('[C282015] Should be able to filter by Process Definition ID', () => {
        processListDemoPage.addProcessDefinitionId(procWithDate.processDefinitionId);

        processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);
        processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate);

        processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget);
        processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget);
    });

    it('[C282016] Should be able to filter by Process Instance ID', () => {
        processListDemoPage.addProcessInstanceId(procWithDate.id);

        processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);

        processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithDate);
        processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget);
        processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget);
    });

    it('[C282017] Should be able to filter by Status', () => {
        processListDemoPage.selectStateFilter('Active');

        processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithDate);
        processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget);

        processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);
        processListDemoPage.checkProcessIsDisplayed(processName.procWithUserWidget);

        processListDemoPage.selectStateFilter('Completed');

        processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate);
        processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithUserWidget);

        processListDemoPage.checkProcessIsNotDisplayed(processName.procWithDate);
        processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget);

        processListDemoPage.selectStateFilter('All');

        processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate);
        processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithUserWidget);
        processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);
        processListDemoPage.checkProcessIsDisplayed(processName.procWithUserWidget);
    });

    it('[C282010] Should be able to sort by creation date', () => {
        let nameColumn = by.css('div[class*="adf-datatable-body"] div[class*="adf-datatable-row"] div[title="Name"] span');

        processListDemoPage.selectSorting('asc');

        contentList.getAllRowsColumnValues(nameColumn).then( (sortedProcessList) => {
            expect(JSON.stringify(processList) === JSON.stringify(sortedProcessList)).toBe(true);
        });

        processListDemoPage.selectSorting('desc');

        contentList.getAllRowsColumnValues(nameColumn).then( (sortedProcessList) => {
            expect(JSON.stringify(processList.reverse()) === JSON.stringify(sortedProcessList)).toBe(true);
        });
    });
});
