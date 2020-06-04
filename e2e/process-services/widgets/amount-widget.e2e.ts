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

describe('Amount Widget', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP.AMOUNT;

    const loginPage = new LoginSSOPage();
    const taskPage = new TasksPage();
    const widget = new Widget();

    let appModel;
    let deployedApp, process;
    let processUserModel;

    const apiService = new ApiService();
    const applicationsService = new ApplicationsUtil(apiService);
    const usersActions = new UsersActions(apiService);
    const processUtil = new ProcessUtil(apiService);

    beforeAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        processUserModel = await usersActions.createUser();

        await apiService.getInstance().login(processUserModel.email, processUserModel.password);
        appModel = await applicationsService.importPublishDeployApp(browser.params.resources.Files.WIDGET_CHECK_APP.file_path);

        const appDefinitions = await apiService.getInstance().activiti.appsApi.getAppDefinitions();
        deployedApp = appDefinitions.data.find((currentApp) => {
            return currentApp.modelId === appModel.id;
        });
        process = await processUtil.startProcessByDefinitionName(appModel.name, app.processName);
        await loginPage.login(processUserModel.email, processUserModel.password);
   });

    beforeEach(async() => {
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

    it('[C274703] Should be possible to set general, advance and visibility properties for Amount Widget', async () => {
        await taskPage.formFields().checkWidgetIsHidden(app.FIELD.amount_input_id);
        await widget.checkboxWidget().clickCheckboxInput(app.FIELD.checkbox_id);
        await taskPage.formFields().checkWidgetIsVisible(app.FIELD.amount_input_id);

        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        await expect(await widget.amountWidget().getAmountFieldLabel(app.FIELD.amount_input_id)).toContain('Amount');
        await expect(await widget.amountWidget().getPlaceholder(app.FIELD.amount_input_id)).toContain('Type amount');
        await expect(await widget.amountWidget().getAmountFieldCurrency(app.FIELD.amount_input_id)).toBe('$');

        await widget.amountWidget().setFieldValue(app.FIELD.amount_input_id, 4);
        await expect(await widget.amountWidget().getErrorMessage(app.FIELD.amount_input_id)).toBe('Can\'t be less than 5');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        await widget.amountWidget().clearFieldValue(app.FIELD.amount_input_id);

        await widget.amountWidget().setFieldValue(app.FIELD.amount_input_id, 101);
        await expect(await widget.amountWidget().getErrorMessage(app.FIELD.amount_input_id)).toBe('Can\'t be greater than 100');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        await widget.amountWidget().clearFieldValue(app.FIELD.amount_input_id);

        await widget.amountWidget().setFieldValue(app.FIELD.amount_input_id, 6);
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
    });
});
