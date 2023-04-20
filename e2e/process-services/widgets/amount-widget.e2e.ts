/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { LoginPage, BrowserActions, Widget, ApplicationsUtil, ProcessUtil, createApiService, UsersActions } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/tasks.page';
import CONSTANTS = require('../../util/constants');
import { browser } from 'protractor';

describe('Amount Widget', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP.AMOUNT;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const widget = new Widget();

    let appModel;
    let deployedAppId; let process;
    let processUserModel;

    const apiService = createApiService();
    const applicationsService = new ApplicationsUtil(apiService);
    const usersActions = new UsersActions(apiService);
    const processUtil = new ProcessUtil(apiService);

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        processUserModel = await usersActions.createUser();

        await apiService.login(processUserModel.username, processUserModel.password);
        appModel = await applicationsService.importPublishDeployApp(browser.params.resources.Files.WIDGET_CHECK_APP.file_path);

        deployedAppId = await applicationsService.getAppDefinitionId(appModel.id);

        process = await processUtil.startProcessByDefinitionName(appModel.name, app.processName);
        await loginPage.login(processUserModel.username, processUserModel.password);
   });

    beforeEach(async () => {
        const urlToNavigateTo = `${browser.baseUrl}/activiti/apps/${deployedAppId}/tasks/`;
        await BrowserActions.getUrl(urlToNavigateTo);
        await taskPage.tasksListPage().checkTaskListIsLoaded();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.formFields().checkFormIsDisplayed();
    });

    afterAll(async () => {
        await processUtil.cancelProcessInstance(process.id);
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(processUserModel.tenantId);
   });

    it('[C274703] Should be possible to set general, advance and visibility properties for Amount Widget', async () => {
        await taskPage.formFields().checkWidgetIsHidden(app.FIELD.amount_input_id);
        await widget.checkboxWidget().clickCheckboxInput(app.FIELD.checkbox_id);
        await taskPage.formFields().checkWidgetIsVisible(app.FIELD.amount_input_id);

        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await expect(await widget.amountWidget().getAmountFieldLabel(app.FIELD.amount_input_id)).toContain('Amount');
        await expect(await widget.amountWidget().getPlaceholder(app.FIELD.amount_input_id)).toContain('Type amount');
        const fieldCurrency = await widget.amountWidget().getAmountFieldCurrency(app.FIELD.amount_input_id);
        await expect(fieldCurrency.trim()).toBe('$');

        await widget.amountWidget().setFieldValue(app.FIELD.amount_input_id, 4);
        await expect(await widget.amountWidget().getErrorMessage(app.FIELD.amount_input_id)).toBe('Can\'t be less than 5');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await widget.amountWidget().clearFieldValue(app.FIELD.amount_input_id);

        await widget.amountWidget().setFieldValue(app.FIELD.amount_input_id, 101);
        await expect(await widget.amountWidget().getErrorMessage(app.FIELD.amount_input_id)).toBe('Can\'t be greater than 100');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await widget.amountWidget().clearFieldValue(app.FIELD.amount_input_id);

        await widget.amountWidget().setFieldValue(app.FIELD.amount_input_id, 6);
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(true);
    });
});
