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
    BrowserActions,
    FormPage,
    LoginPage,
    ProcessUtil,
    UsersActions,
    Widget
} from '@alfresco/adf-testing';
import { TasksPage } from '../pages/tasks.page';
import { browser } from 'protractor';
import { FormDemoPage } from '.././pages/form-demo.page';
import { customDateFormAPS1 } from '../../resources/forms/custom-date-form';
import CONSTANTS = require('../../util/constants');
import { ProcessServicesPage } from '../pages/process-services.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Date widget', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP.DATE;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const widget = new Widget();
    const navigationBarPage = new NavigationBarPage();

    const dateWidget = widget.dateWidget();
    let appModel;
    let processUserModel;
    let deployedAppId; let process;

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
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

    afterAll(async () => {
        await processUtil.cancelProcessInstance(process.id);
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(processUserModel.tenantId);
   });

    describe('Simple App', () => {
        beforeEach(async () => {
            await navigationBarPage.clickHomeButton();
            await (new ProcessServicesPage()).goToAppByAppId(deployedAppId);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.formFields().checkFormIsDisplayed();
        });

        it('[C268814] Should be able to set general settings for Date widget', async () => {
            await expect(await dateWidget.getDateLabel(app.FIELD.date_input)).toContain('Date');
            await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
            await dateWidget.setDateInput(app.FIELD.date_input, '20-10-2018');
            await taskPage.formFields().saveForm();
            await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(true);
        });

        it('[C277234] Should be able to set advanced settings for Date widget ', async () => {
            await dateWidget.setDateInput(app.FIELD.date_between_input, '20-10-2017');
            await taskPage.formFields().saveForm();
            await expect(await dateWidget.getErrorMessage(app.FIELD.date_between_input)).toBe('Can\'t be less than 1-10-2018');
            await dateWidget.clearDateInput(app.FIELD.date_between_input);
            await dateWidget.setDateInput(app.FIELD.date_between_input, '20-10-2019');
            await taskPage.formFields().saveForm();
            await expect(await dateWidget.getErrorMessage(app.FIELD.date_between_input)).toBe('Can\'t be greater than 31-10-2018');
        });
    });

    describe('Form Demo Page', () => {
        const formDemoPage = new FormDemoPage();
        const formJson = JSON.parse(customDateFormAPS1);
        const formPage = new FormPage();

        beforeAll(async () => {
            const urlFormDemoPage = `${browser.baseUrl}/form`;
            await BrowserActions.getUrl(urlFormDemoPage);
        });

        it('[C313199] Should display the validation for min and max date values with custom date format', async () => {
            await formDemoPage.setConfigToEditor(formJson);
            await dateWidget.setDateInput('datefield', '18-7-19');
            await formPage.saveForm();
            await expect(await dateWidget.getErrorMessage('datefield'))
                .toBe('Can\'t be less than 19-7-19', 'Min date validation is not working');
            await dateWidget.clearDateInput('datefield');
            await dateWidget.setDateInput('datefield', '20-7-19');
            await formPage.saveForm();
            await expect(await dateWidget.getErrorMessage('datefield'))
                .toBe('Can\'t be greater than 19-8-19', 'Max date validation is not working');
            await dateWidget.clearDateInput('datefield');
            await dateWidget.setDateInput('datefield', '19-7-19');
            await formPage.saveForm();
            await dateWidget.checkErrorMessageIsNotDisplayed('datefield');
        });
    });
});
