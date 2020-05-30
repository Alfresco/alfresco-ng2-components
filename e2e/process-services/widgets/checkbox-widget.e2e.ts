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

describe('Checkbox Widget', () => {

    const loginPage = new LoginSSOPage();
    let processUserModel;
    const taskPage = new TasksPage();
    const widget = new Widget();
    let appModel;
    const app = browser.params.resources.Files.WIDGET_CHECK_APP.CHECKBOX;
    let deployedApp, process;
    const apiService = new ApiService();

    beforeAll(async () => {
        const users = new UsersActions(apiService);

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        processUserModel = await users.createTenantAndUser();

        await apiService.getInstance().login(processUserModel.email, processUserModel.password);
        const applicationsService = new ApplicationsUtil(apiService);
        appModel = await applicationsService.importPublishDeployApp(browser.params.resources.Files.WIDGET_CHECK_APP.file_path);

        const appDefinitions = await apiService.getInstance().activiti.appsApi.getAppDefinitions();
        deployedApp = appDefinitions.data.find((currentApp) => {
            return currentApp.modelId === appModel.id;
        });
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
   });

    it('[C268554] Should be able to set general settings for Checkbox widget ', async () => {
        await taskPage.formFields().setValueInInputById(app.FIELD.number_input_id, 2);
        await expect(await widget.checkboxWidget().getCheckboxLabel()).toContain(app.FIELD.checkbox_label);
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        await widget.checkboxWidget().clickCheckboxInput(app.FIELD.checkbox_input_id);
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
    });

    it('[C272812] Should be able to set visibility settings for Checkbox widget', async () => {
        await widget.checkboxWidget().isCheckboxHidden(app.FIELD.checkbox_field_id);
        await taskPage.formFields().setValueInInputById(app.FIELD.number_input_id, 2);
        await widget.checkboxWidget().isCheckboxDisplayed(app.FIELD.checkbox_field_id);
    });
});
