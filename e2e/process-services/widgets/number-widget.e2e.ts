/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { createApiService, ApplicationsUtil, LoginPage, ProcessUtil, UsersActions, Widget, UserModel } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/tasks.page';
import { browser } from 'protractor';
import CONSTANTS = require('../../util/constants');
import { ProcessServicesPage } from '../pages/process-services.page';
import { AppDefinitionRepresentation, ProcessInstanceRepresentation } from '@alfresco/js-api';

describe('Number widget', () => {
    const app = browser.params.resources.Files.WIDGET_CHECK_APP.NUMBER;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const widget = new Widget();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const processUtil = new ProcessUtil(apiService);

    let appModel: AppDefinitionRepresentation;
    let deployedAppId: number;
    let process: ProcessInstanceRepresentation;
    let processUserModel: UserModel;

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
        await new ProcessServicesPage().goToAppByAppId(deployedAppId);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.formFields().checkFormIsDisplayed();
    });

    afterAll(async () => {
        await processUtil.cancelProcessInstance(process.id);
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(processUserModel.tenantId);
    });

    it('[C269111] Should be able to set general properties for Number Widget', async () => {
        expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        expect(await widget.numberWidget().getNumberFieldLabel(app.FIELD.number_general)).toContain('Number General');
        expect(await widget.numberWidget().getPlaceholder(app.FIELD.number_general)).toContain('Type a number');

        await widget.numberWidget().setFieldValue(app.FIELD.number_general, 2);
        expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(true);
    });

    it('[C274702] Should be able to set advanced and visibility properties for Number Widget', async () => {
        await widget.numberWidget().setFieldValue(app.FIELD.number_general, 2);

        await taskPage.formFields().checkWidgetIsHidden(app.FIELD.number_visible);
        await widget.checkboxWidget().clickCheckboxInput(app.FIELD.checkbox_id);
        await taskPage.formFields().checkWidgetIsVisible(app.FIELD.number_visible);

        await widget.numberWidget().setFieldValue(app.FIELD.number_visible, 2);
        expect(await widget.numberWidget().getErrorMessage(app.FIELD.number_visible)).toBe(`Can't be less than 3`);
        expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await widget.numberWidget().clearFieldValue(app.FIELD.number_visible);

        await widget.numberWidget().setFieldValue(app.FIELD.number_visible, 101);
        expect(await widget.numberWidget().getErrorMessage(app.FIELD.number_visible)).toBe(`Can't be greater than 100`);
        expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await widget.numberWidget().clearFieldValue(app.FIELD.number_visible);

        await widget.numberWidget().setFieldValue(app.FIELD.number_visible, 4);
        expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(true);
    });
});
