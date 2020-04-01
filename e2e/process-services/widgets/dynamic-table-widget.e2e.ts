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

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AppsActions } from '../../actions/APS/apps.actions';
import { UsersActions } from '../../actions/users.actions';
import { LoginPage, BrowserActions, Widget, ApplicationService } from '@alfresco/adf-testing';
import { TasksPage } from '../../pages/adf/process-services/tasks.page';
import CONSTANTS = require('../../util/constants');
import { browser } from 'protractor';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';

describe('Dynamic Table widget ', () => {

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const widget = new Widget();
    const appsActions = new AppsActions();
    const users = new UsersActions();
    const navigationBarPage = new NavigationBarPage();
    const alfrescoJsApi = new AlfrescoApi({
        provider: 'BPM',
        hostBpm: browser.params.testConfig.adf_aps.host
    });

    let processUserModel;
    let appModel;
    let deployedApp, process;

    describe('with Date Time Widget App', () => {
        const app = browser.params.resources.Files.WIDGET_CHECK_APP.DYNAMIC_TABLE;

        beforeAll(async () => {
            await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            processUserModel = await users.createTenantAndUser(alfrescoJsApi);

            await alfrescoJsApi.login(processUserModel.email, processUserModel.password);
            const applicationsService = new ApplicationService(alfrescoJsApi);
            appModel = await applicationsService.importPublishDeployApp(browser.params.resources.Files.WIDGET_CHECK_APP.file_path);

            const appDefinitions = await alfrescoJsApi.activiti.appsApi.getAppDefinitions();
            deployedApp = appDefinitions.data.find((currentApp) => currentApp.modelId === appModel.id);
            process = await appsActions.startProcess(alfrescoJsApi, appModel, app.processName);
            await loginPage.loginToProcessServicesUsingUserModel(processUserModel);
        });

        beforeEach(async () => {
            const urlToNavigateTo = `${browser.params.testConfig.adf.url}/activiti/apps/${deployedApp.id}/tasks/`;
            await BrowserActions.getUrl(urlToNavigateTo);
            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.formFields().checkFormIsDisplayed();
        });

        afterAll(async () => {
            await alfrescoJsApi.activiti.processApi.deleteProcessInstance(process.id);
            await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
            await navigationBarPage.clickLogoutButton();
        });

        it('[C276729] Should be possible to set visibility properties for Dynamic Table', async () => {
            await taskPage.formFields().checkWidgetIsHidden(app.FIELD.dynamic_table_age_id);
            await widget.checkboxWidget().clickCheckboxInput(app.FIELD.checkbox_id);
            await taskPage.formFields().checkWidgetIsVisible(app.FIELD.dynamic_table_age_id);
        });

        it('[C279349] Should be able to have a Date Time widget in a Dynamic Table widget', async () => {
            await widget.dynamicTable().clickAddRow();
            await widget.dateTimeWidget().openDatepicker(app.FIELD.dateTime_input_id);
            await widget.dateTimeWidget().selectDay('10');
            await widget.dateTimeWidget().selectHour('8');
            await widget.dateTimeWidget().selectMinute('30');
            await widget.dateTimeWidget().clearDateTimeInput(app.FIELD.dateTime_input_id);

            await widget.dynamicTable().clickSaveButton();
            await widget.dynamicTable().getTableRow(0);
        });
    });

    describe('with People Widget App', () => {
        const app = browser.params.resources.Files.WIDGET_CHECK_APP.DYNAMIC_TABLE_USERS;

        beforeAll(async () => {
            await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            processUserModel = await users.createTenantAndUser(alfrescoJsApi);

            await alfrescoJsApi.login(processUserModel.email, processUserModel.password);
            const applicationsService = new ApplicationService(alfrescoJsApi);
            appModel = await applicationsService.importPublishDeployApp(browser.params.resources.Files.WIDGET_CHECK_APP.file_path);

            const appDefinitions = await alfrescoJsApi.activiti.appsApi.getAppDefinitions();
            deployedApp = appDefinitions.data.find((currentApp) => currentApp.modelId === appModel.id);
            process = await appsActions.startProcess(alfrescoJsApi, appModel, app.processName);
            await loginPage.loginToProcessServicesUsingUserModel(processUserModel);
        });

        afterAll(async () => {
            await alfrescoJsApi.activiti.processApi.deleteProcessInstance(process.id);
            await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
            await navigationBarPage.clickLogoutButton();
        });

        beforeEach(async () => {
            const urlToNavigateTo = `${browser.params.testConfig.adf.url}/activiti/apps/${deployedApp.id}/tasks/`;
            await BrowserActions.getUrl(urlToNavigateTo);
            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.formFields().checkFormIsDisplayed();
        });

        it('[C260407] Should be able to add/delete/update row in Dynamic Table widget', async () => {
            await widget.dynamicTable().clickAddRow(app.FIELD.dynamic_table_id);
            await widget.dynamicTable().setDatatableInput('User1');
            await widget.dynamicTable().clickSaveButton();
            await expect(await widget.dynamicTable().getTableRowText(0)).toEqual('User1');

            await widget.dynamicTable().clickTableRow(0);
            await widget.dynamicTable().clickEditButton();
            await widget.dynamicTable().setDatatableInput('User2');
            await widget.dynamicTable().clickCancelButton();
            await expect(await widget.dynamicTable().getTableRowText(0)).toEqual('User1');

            await widget.dynamicTable().clickEditButton();
            await widget.dynamicTable().setDatatableInput('User2');
            await widget.dynamicTable().clickSaveButton();
            await expect(await widget.dynamicTable().getTableRowText(0)).toEqual('User2');

            await widget.dynamicTable().clickAddRow(app.FIELD.dynamic_table_id);
            await widget.dynamicTable().setDatatableInput('User3');
            await widget.dynamicTable().clickCancelButton();
            await widget.dynamicTable().checkTableRowIsNotVisible(1);
        });
    });

    describe('Custom validation', () => {

        const app = browser.params.resources.Files.WIDGET_CHECK_APP;

        beforeAll(async () => {
            await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            processUserModel = await users.createTenantAndUser(alfrescoJsApi);

            await alfrescoJsApi.login(processUserModel.email, processUserModel.password);
            const applicationsService = new ApplicationService(alfrescoJsApi);
            const application = await applicationsService.importPublishDeployApp(alfrescoJsApi, app.file_path);

            const appDefinitions = await alfrescoJsApi.activiti.appsApi.getAppDefinitions();
            deployedApp = appDefinitions.data.find((currentApp) => currentApp.modelId === application.id);
            process = await appsActions.startProcess(alfrescoJsApi, application, app.CUSTOM_VALIDATOR.processName);
        });

        afterAll(async () => {
            await alfrescoJsApi.activiti.processApi.deleteProcessInstance(process.id);
            await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
        });

        beforeEach(async () => {
            await loginPage.loginToProcessServicesUsingUserModel(processUserModel);
            const urlToNavigateTo = `${browser.params.testConfig.adf.url}/activiti/apps/${deployedApp.id}/tasks`;
            await BrowserActions.getUrl(urlToNavigateTo);
            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.formFields().checkFormIsDisplayed();
        });

        it('[C260437] Customised validator', async () => {
            await widget.dynamicTable().clickAddRow();
            await widget.dynamicTable().setDatatableInput('admin', app.CUSTOM_VALIDATOR.FIELD.NAME);
            await widget.dynamicTable().clickSaveButton();
            await expect(await widget.dynamicTable().checkErrorMessage()).toBe('Sorry, wrong value. You cannot use "admin".');

            await widget.dynamicTable().setDatatableInput('name', app.CUSTOM_VALIDATOR.FIELD.NAME);
            await widget.dynamicTable().clickSaveButton();
            await expect(await widget.dynamicTable().checkErrorMessage()).toBe('Field \'Id\' is required.');

            await widget.dynamicTable().setDatatableInput('id', app.CUSTOM_VALIDATOR.FIELD.ID);
            await widget.dynamicTable().clickSaveButton();
            await expect(await widget.dynamicTable().checkErrorMessage()).toBe('Field \'Number\' is required.' );

            await widget.dynamicTable().setDatatableInput('12', app.CUSTOM_VALIDATOR.FIELD.NUM);
            await widget.dynamicTable().clickSaveButton();
            await expect(await widget.dynamicTable().checkErrorMessage()).toBe('Field \'Address\' is required.');

            await widget.dynamicTable().setDatatableInput('address', app.CUSTOM_VALIDATOR.FIELD.ADDRESS);
            await widget.dynamicTable().clickSaveButton();
            await taskPage.taskDetails().clickCompleteFormTask();
        });
    });
});
