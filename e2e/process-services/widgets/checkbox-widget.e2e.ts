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

import {
    ApiService,
    ApplicationsUtil,
    BrowserActions,
    LoginPage,
    ProcessUtil,
    UsersActions,
    Widget
} from '@alfresco/adf-testing';
import { TasksPage } from '../pages/tasks.page';
import { browser } from 'protractor';
import CONSTANTS = require('../../util/constants');
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Checkbox Widget', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP.CHECKBOX;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const widget = new Widget();
    const navigationBarPage = new NavigationBarPage();

    let processUserModel;
    let appModel;
    let deployedApp, process;

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        processUserModel = await usersActions.createUser();

        await apiService.login(processUserModel.username, processUserModel.password);
        appModel = await applicationsService.importPublishDeployApp(browser.params.resources.Files.WIDGET_CHECK_APP.file_path);

        const appDefinitions = await apiService.getInstance().activiti.appsApi.getAppDefinitions();
        deployedApp = appDefinitions.data.find((currentApp) => {
            return currentApp.modelId === appModel.id;
        });
        process = await new ProcessUtil(apiService).startProcessByDefinitionName(appModel.name, app.processName);
        await loginPage.login(processUserModel.username, processUserModel.password);
   });

    beforeEach(async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        const urlToNavigateTo = `${browser.baseUrl}/activiti/apps/${deployedApp.id}/tasks/`;
        await BrowserActions.getUrl(urlToNavigateTo);
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.formFields().checkFormIsDisplayed();
    });

    afterAll(async () => {
        await apiService.getInstance().activiti.processApi.deleteProcessInstance(process.id);
        await apiService.loginWithProfile('admin');
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
   });

    it('[C268554] Should be able to set general settings for Checkbox widget ', async () => {
        await taskPage.formFields().setValueInInputById(app.FIELD.number_input_id, '2');
        await expect(await widget.checkboxWidget().getCheckboxLabel()).toContain(app.FIELD.checkbox_label);
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await widget.checkboxWidget().clickCheckboxInput(app.FIELD.checkbox_input_id);
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(true);
    });

    it('[C272812] Should be able to set visibility settings for Checkbox widget', async () => {
        await widget.checkboxWidget().isCheckboxHidden(app.FIELD.checkbox_field_id);
        await taskPage.formFields().setValueInInputById(app.FIELD.number_input_id, '2');
        await widget.checkboxWidget().isCheckboxDisplayed(app.FIELD.checkbox_field_id);
    });
});
