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

import { LoginSSOPage, BrowserActions, ApplicationsUtil, ProcessUtil, ApiService } from '@alfresco/adf-testing';
import { ProcessListDemoPage } from '../pages/adf/demo-shell/process-services/process-list-demo.page';
import { browser } from 'protractor';
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

describe('Process List Test', () => {

    const appWithDateField = browser.params.resources.Files.APP_WITH_DATE_FIELD_FORM;
    const appWithUserWidget = browser.params.resources.Files.APP_WITH_USER_WIDGET;

    const loginPage = new LoginSSOPage();
    const processListDemoPage = new ProcessListDemoPage();

    const apiService = new ApiService();
    const appsActions = new AppsActions(apiService);
    const usersActions = new UsersActions(apiService);

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
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        user = await usersActions.createUser();

        await apiService.getInstance().login(user.email, user.password);

        const applicationsService = new ApplicationsUtil(apiService);

        appDateModel = await applicationsService.importPublishDeployApp(appWithDateField.file_path);

        const processUtil = new ProcessUtil(apiService);
        procWithDate = await processUtil.startProcessOfApp(appDateModel.name, processName.procWithDate);
        completedProcWithDate = await processUtil.startProcessOfApp(appDateModel.name, processName.completedProcWithDate);

        appUserWidgetModel = await applicationsService.importPublishDeployApp(appWithUserWidget.file_path);

        await processUtil.startProcessOfApp(appUserWidgetModel.name, processName.procWithUserWidget);
        completedProcWithUserWidget = await processUtil.startProcessOfApp(appUserWidgetModel.name, processName.completedProcWithUserWidget);

        appWithDateFieldId = await appsActions.getAppDefinitionId(appDateModel.id);

        const procWithDateTaskId = await appsActions.getProcessTaskId(completedProcWithDate.id);
        const procWithUserWidgetTaskId = await appsActions.getProcessTaskId(completedProcWithUserWidget.id);

        await apiService.getInstance().activiti.taskApi.completeTaskForm(procWithDateTaskId.toString(), { values: { label: null } });
        await apiService.getInstance().activiti.taskFormsApi.completeTaskForm(procWithUserWidgetTaskId.toString(), { values: { label: null } });

        await loginPage.login(user.email, user.password);
   });

    afterAll(async () => {
        await apiService.getInstance().activiti.modelsApi.deleteModel(appDateModel.id);
        await apiService.getInstance().activiti.modelsApi.deleteModel(appUserWidgetModel.id);

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(user.tenantId);
   });

    beforeEach(async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/process-list');
   });

    it('[C286638] Should display all process by default', async () => {
        await processListDemoPage.checkAppIdFieldIsDisplayed();
        await processListDemoPage.checkProcessInstanceIdFieldIsDisplayed();
        await processListDemoPage.checkProcessInstanceIdFieldIsDisplayed();
        await processListDemoPage.checkSortDropdownIsDisplayed();
        await processListDemoPage.checkStateDropdownIsDisplayed();
    });

    it('[C282006] Should be able to filter processes with App ID', async () => {
        await processListDemoPage.addAppId('a');

        await processListDemoPage.checkErrorMessageIsDisplayed(errorMessages.appIdNumber);
        await processListDemoPage.clickResetButton();

        await processListDemoPage.addAppId('12345');

        await processListDemoPage.checkNoProcessFoundIsDisplayed();

        await processListDemoPage.addAppId(appWithDateFieldId);
        await processListDemoPage.dataTable.waitTillContentLoaded();

        await processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);
        await processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate);

        await processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget);
        await processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget);
    });

    it('[C282015] Should be able to filter by Process Definition ID', async () => {
        await processListDemoPage.addProcessDefinitionId(procWithDate.processDefinitionId);
        await processListDemoPage.dataTable.waitTillContentLoaded();

        await processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);
        await processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate);

        await processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget);
        await processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget);
    });

    it('[C282016] Should be able to filter by Process Instance ID', async () => {
        await processListDemoPage.addProcessInstanceId(procWithDate.id);
        await processListDemoPage.dataTable.waitTillContentLoaded();

        await processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);

        await processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithDate);
        await processListDemoPage.checkProcessIsNotDisplayed(processName.procWithUserWidget);
        await processListDemoPage.checkProcessIsNotDisplayed(processName.completedProcWithUserWidget);
    });

    it('[C282017] Should be able to filter by Status', async () => {
        await processListDemoPage.selectStateFilter('Active');
        await processListDemoPage.dataTable.waitTillContentLoaded();

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
        await processListDemoPage.dataTable.waitTillContentLoaded();

        await processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithDate);
        await processListDemoPage.checkProcessIsDisplayed(processName.completedProcWithUserWidget);
        await processListDemoPage.checkProcessIsDisplayed(processName.procWithDate);
        await processListDemoPage.checkProcessIsDisplayed(processName.procWithUserWidget);
    });

    it('[C282010] Should be able to sort by creation date', async () => {
        await processListDemoPage.selectSorting('asc');
        await processListDemoPage.dataTable.waitTillContentLoaded();

        const sortedProcessListNamesAsc = await processListDemoPage.getDisplayedProcessesNames();

        await expect(JSON.stringify(processList) === JSON.stringify(sortedProcessListNamesAsc)).toBe(true);

        await processListDemoPage.selectSorting('desc');

        const sortedProcessListNamesDesc = await processListDemoPage.getDisplayedProcessesNames();
        await expect(JSON.stringify(processList.reverse()) === JSON.stringify(sortedProcessListNamesDesc)).toBe(true);
    });
});
