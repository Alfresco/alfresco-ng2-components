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

import { LoginPage, BrowserActions } from '@alfresco/adf-testing';
import { ProcessListDemoPage } from '../pages/adf/demo-shell/process-services/processListDemoPage';

import { browser } from 'protractor';
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

describe('Process List Test', () => {

    const loginPage = new LoginPage();
    const processListDemoPage = new ProcessListDemoPage();

    const appWithDateField = resources.Files.APP_WITH_DATE_FIELD_FORM;
    const appWithUserWidget = resources.Files.APP_WITH_USER_WIDGET;
    let appDateModel, appUserWidgetModel, user;

    const processList = ['Process With Date', 'Process With Date 2', 'Process With User Widget', 'Process With User Widget 2'];

    const processName = {
        procWithDate: 'Process With Date',
        completedProcWithDate: 'Process With Date 2',
        procWithUserWidget: 'Process With User Widget',
        completedProcWithUserWidget: 'Process With User Widget 2'
    };

    const errorMessages = {
        appIdNumber: 'App ID must be a number',
        insertAppId: 'Insert App ID'
    };

    let appWithDateFieldId;
    let procWithDate, completedProcWithDate, completedProcWithUserWidget;

    beforeAll(async () => {
        const apps = new AppsActions();
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        appDateModel = await apps.importPublishDeployApp(this.alfrescoJsApi, appWithDateField.file_location);

        procWithDate = await apps.startProcess(this.alfrescoJsApi, appDateModel, processName.procWithDate);
        completedProcWithDate = await apps.startProcess(this.alfrescoJsApi, appDateModel, processName.completedProcWithDate);

        appUserWidgetModel = await apps.importPublishDeployApp(this.alfrescoJsApi, appWithUserWidget.file_location);

        await apps.startProcess(this.alfrescoJsApi, appUserWidgetModel, processName.procWithUserWidget);
        completedProcWithUserWidget = await apps.startProcess(this.alfrescoJsApi, appUserWidgetModel, processName.completedProcWithUserWidget);

        appWithDateFieldId = await apps.getAppDefinitionId(this.alfrescoJsApi, appDateModel.id);

        const procWithDateTaskId = await apps.getProcessTaskId(this.alfrescoJsApi, completedProcWithDate.id);
        const procWithUserWidgetTaskId = await apps.getProcessTaskId(this.alfrescoJsApi, completedProcWithUserWidget.id);

        await this.alfrescoJsApi.activiti.taskApi.completeTaskForm(procWithDateTaskId.toString(), { values: { label: null } });
        await this.alfrescoJsApi.activiti.taskFormsApi.completeTaskForm(procWithUserWidgetTaskId.toString(), { values: { label: null } });

        await loginPage.loginToProcessServicesUsingUserModel(user);

    });

    afterAll(async () => {
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appDateModel.id);
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appUserWidgetModel.id);

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(user.tenantId);

    });

    beforeEach(async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/process-list');

    });

    it('[C286638] Should display all process by default', async () => {
        await processListDemoPage.checkAppIdFieldIsDisplayed();
        await processListDemoPage.checkProcessInstanceIdFieldIsDisplayed();
        await processListDemoPage.checkProcessInstanceIdFieldIsDisplayed();
        await processListDemoPage.checkSortFieldIsDisplayed();
        await processListDemoPage.checkStateFieldIsDisplayed();
    });

    it('[C282006] Should be able to filter processes with App ID', async () => {
        await processListDemoPage.addAppId('a');

        await processListDemoPage.checkErrorMessageIsDisplayed(errorMessages.appIdNumber);
        await processListDemoPage.clickResetButton();

        await processListDemoPage.addAppId('12345');

        await processListDemoPage.checkNoProcessFoundIsDisplayed();

        await processListDemoPage.addAppId(appWithDateFieldId);

        await processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);
        await processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate);

        await processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget);
        await processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget);
    });

    it('[C282015] Should be able to filter by Process Definition ID', async () => {
        await processListDemoPage.addProcessDefinitionId(procWithDate.processDefinitionId);

        await processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);
        await processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate);

        await processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget);
        await processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget);
    });

    it('[C282016] Should be able to filter by Process Instance ID', async () => {
        await processListDemoPage.addProcessInstanceId(procWithDate.id);

        await processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);

        await processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithDate);
        await processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget);
        await processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget);
    });

    it('[C282017] Should be able to filter by Status', async () => {
        await processListDemoPage.selectStateFilter('Active');

        await processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithDate);
        await processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget);

        await processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);
        await processListDemoPage.checkProcessIsDisplayed(processName.procWithUserWidget);

        await processListDemoPage.selectStateFilter('Completed');

        await processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate);
        await processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithUserWidget);

        await processListDemoPage.checkProcessIsNotDisplayed(processName.procWithDate);
        await processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget);

        await processListDemoPage.selectStateFilter('All');

        await processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate);
        await processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithUserWidget);
        await processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);
        await processListDemoPage.checkProcessIsDisplayed(processName.procWithUserWidget);
    });

    it('[C282010] Should be able to sort by creation date', async () => {
        await processListDemoPage.selectSorting('asc');

        const sortedProcessListNamesAsc = await processListDemoPage.getDisplayedProcessesNames();

        await expect(JSON.stringify(processList) === JSON.stringify(sortedProcessListNamesAsc)).toBe(true);

        await processListDemoPage.selectSorting('desc');

        const sortedProcessListNamesDesc = await processListDemoPage.getDisplayedProcessesNames();
        await expect(JSON.stringify(processList.reverse()) === JSON.stringify(sortedProcessListNamesDesc)).toBe(true);
    });
});
