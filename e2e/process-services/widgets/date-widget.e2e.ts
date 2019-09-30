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
import { LoginPage, BrowserActions, Widget, FormPage } from '@alfresco/adf-testing';
import { TasksPage } from '../../pages/adf/process-services/tasksPage';
import CONSTANTS = require('../../util/constants');
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { FormDemoPage } from '../../pages/adf/demo-shell/process-services/formDemoPage';
import { customDateFormAPS1 } from '../../resources/forms/custom-date-form';

describe('Date widget', () => {

    const loginPage = new LoginPage();
    let processUserModel;
    const taskPage = new TasksPage();
    const widget = new Widget();
    const dateWidget = widget.dateWidget();
    let alfrescoJsApi;
    const appsActions = new AppsActions();
    let appModel;
    const app = resources.Files.WIDGET_CHECK_APP.DATE;
    let deployedApp, process;

    beforeAll(async () => {
        const users = new UsersActions();

        alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(alfrescoJsApi);

        await alfrescoJsApi.login(processUserModel.email, processUserModel.password);
        appModel = await appsActions.importPublishDeployApp(alfrescoJsApi, resources.Files.WIDGET_CHECK_APP.file_location);

        const appDefinitions = await alfrescoJsApi.activiti.appsApi.getAppDefinitions();
        deployedApp = appDefinitions.data.find((currentApp) => {
            return currentApp.modelId === appModel.id;
        });
        process = await appsActions.startProcess(alfrescoJsApi, appModel, app.processName);
        await loginPage.loginToProcessServicesUsingUserModel(processUserModel);

    });

    afterAll(async () => {
        await alfrescoJsApi.activiti.processApi.deleteProcessInstance(process.id);
        await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);

    });

    describe('Simple App', () => {

        beforeEach(async () => {
            const urlToNavigateTo = `${browser.params.testConfig.adf.url}/activiti/apps/${deployedApp.id}/tasks/`;
            await BrowserActions.getUrl(urlToNavigateTo);
            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.formFields().checkFormIsDisplayed();
        });

        it('[C268814] Should be able to set general settings for Date widget', async () => {
            await expect(await dateWidget.getDateLabel(app.FIELD.date_input)).toContain('Date');
            await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
            await dateWidget.setDateInput(app.FIELD.date_input, '20-10-2018');
            await taskPage.formFields().saveForm();
            await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
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
            const urlFormDemoPage = `${browser.params.testConfig.adf.url}/form`;
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
