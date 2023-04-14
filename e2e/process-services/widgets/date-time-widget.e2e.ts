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

import { createApiService,
    ApplicationsUtil,
    LoginPage,
    ProcessUtil,
    UsersActions,
    Widget
} from '@alfresco/adf-testing';
import { TasksPage } from '../pages/tasks.page';
import { browser } from 'protractor';
import CONSTANTS = require('../../util/constants');
import { ProcessServicesPage } from '../pages/process-services.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Date and time widget', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP.DATETIME;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const widget = new Widget();
    const navigationBarPage = new NavigationBarPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const processUtil = new ProcessUtil(apiService);

    let processUserModel;
    let appModel;
    let deployedAppId; let process;

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
        await navigationBarPage.clickHomeButton();
        await (new ProcessServicesPage()).goToAppByAppId(deployedAppId);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.formFields().checkFormIsDisplayed();
    });

    afterAll(async () => {
        await processUtil.cancelProcessInstance(process.id);
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(processUserModel.tenantId);
    });

    it('[C268818] Should be able to set general settings for Date Time widget', async () => {
        await expect(await widget.dateTimeWidget().getDateTimeLabel(app.FIELD.date_time_input)).toContain('Date');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);

        await widget.dateTimeWidget().openDatepicker(app.FIELD.date_time_input);
        await widget.dateTimeWidget().selectDay('10');
        await widget.dateTimeWidget().selectHour('8');
        await widget.dateTimeWidget().selectMinute('30');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(true);

        await expect(await widget.dateTimeWidget().getPlaceholder(app.FIELD.date_time_between_input)).toBe('Choose anything...');
    });

    it('[C268819] Should be able to set advanced settings for Date Time widget ', async () => {
        await widget.dateTimeWidget().setDateTimeInput(app.FIELD.date_time_between_input, '20-03-17 07:30 PM');
        await widget.dateTimeWidget().closeDataTimeWidget();
        await taskPage.formFields().completeForm();
        await expect(await widget.dateTimeWidget().getErrorMessage(app.FIELD.date_time_between_input)).toContain('Can\'t be less than');

        await browser.refresh();

        await widget.dateTimeWidget().setDateTimeInput(app.FIELD.date_time_between_input, '20-03-19 07:30 PM');
        await widget.dateTimeWidget().closeDataTimeWidget();
        await taskPage.formFields().completeForm();

        await expect(await widget.dateTimeWidget().getErrorMessage(app.FIELD.date_time_between_input)).toContain('Can\'t be greater than');
    });
});
