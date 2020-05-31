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

import { UsersActions } from '../../actions/users.actions';
import { LoginSSOPage, BrowserActions, Widget, ApplicationsUtil, ProcessUtil, ApiService } from '@alfresco/adf-testing';
import { TasksPage } from '../../pages/adf/process-services/tasks.page';
import CONSTANTS = require('../../util/constants');
import { browser } from 'protractor';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';

describe('Dynamic Table widget ', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP.DYNAMIC_TABLE;

    const loginPage = new LoginSSOPage();
    const taskPage = new TasksPage();
    const widget = new Widget();
    const navigationBarPage = new NavigationBarPage();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);

    let processUserModel;
    let appModel;
    let deployedApp, process;

    describe('with Date Time Widget App', () => {

        beforeAll(async () => {
            await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
            processUserModel = await usersActions.createUser();

            await apiService.getInstance().login(processUserModel.email, processUserModel.password);
            appModel = await applicationsService.importPublishDeployApp(browser.params.resources.Files.WIDGET_CHECK_APP.file_path);

            const appDefinitions = await apiService.getInstance().activiti.appsApi.getAppDefinitions();
            deployedApp = appDefinitions.data.find((currentApp) => currentApp.modelId === appModel.id);
            process = await new ProcessUtil(apiService).startProcessByDefinitionName(appModel.name, app.processName);
            await loginPage.login(processUserModel.email, processUserModel.password);
        });

        beforeEach(async () => {
            const urlToNavigateTo = `${browser.params.testConfig.adf.url}/activiti/apps/${deployedApp.id}/tasks/`;
            await BrowserActions.getUrl(urlToNavigateTo);
            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.formFields().checkFormIsDisplayed();
        });

        afterAll(async () => {
            await apiService.getInstance().activiti.processApi.deleteProcessInstance(process.id);
            await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
            await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
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
            await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
            processUserModel = await usersActions.createUser();

            await apiService.getInstance().login(processUserModel.email, processUserModel.password);
            const applicationsService = new ApplicationsUtil(apiService);
            appModel = await applicationsService.importPublishDeployApp(browser.params.resources.Files.WIDGET_CHECK_APP.file_path);

            const appDefinitions = await apiService.getInstance().activiti.appsApi.getAppDefinitions();
            deployedApp = appDefinitions.data.find((currentApp) => currentApp.modelId === appModel.id);
            process = await new ProcessUtil(apiService).startProcessByDefinitionName(appModel.name, app.processName);
            await loginPage.login(processUserModel.email, processUserModel.password);
        });

        afterAll(async () => {
            await apiService.getInstance().activiti.processApi.deleteProcessInstance(process.id);
            await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
            await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
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
            await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
            processUserModel = await usersActions.createUser();

            await apiService.getInstance().login(processUserModel.email, processUserModel.password);
            const applicationsService = new ApplicationsUtil(apiService);
            const application = await applicationsService.importPublishDeployApp(app.file_path);

            const appDefinitions = await apiService.getInstance().activiti.appsApi.getAppDefinitions();
            deployedApp = appDefinitions.data.find((currentApp) => currentApp.modelId === application.id);
            process = await new ProcessUtil(apiService).startProcessByDefinitionName(application.name, app.CUSTOM_VALIDATOR.processName);
        });

        afterAll(async () => {
            await apiService.getInstance().activiti.processApi.deleteProcessInstance(process.id);
            await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
            await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
        });

        beforeEach(async () => {
            await loginPage.login(processUserModel.email, processUserModel.password);
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
