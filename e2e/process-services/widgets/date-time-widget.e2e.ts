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
import { LoginPage, BrowserActions, Widget } from '@alfresco/adf-testing';
import { TasksPage } from '../../pages/adf/process-services/tasksPage';
import CONSTANTS = require('../../util/constants');
import { browser } from 'protractor';
import resources = require('../../util/resources');

describe('Date and time widget', () => {

    const loginPage = new LoginPage();
    let processUserModel;
    const taskPage = new TasksPage();
    const widget = new Widget();
    let alfrescoJsApi;
    const appsActions = new AppsActions();
    let appModel;
    const app = resources.Files.WIDGET_CHECK_APP.DATETIME;
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
    });

    it('[C268818] Should be able to set general settings for Date Time widget', async () => {
        await expect(await widget.dateTimeWidget().getDateTimeLabel(app.FIELD.date_time_input)).toContain('Date');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();

        await widget.dateTimeWidget().openDatepicker(app.FIELD.date_time_input);
        await widget.dateTimeWidget().selectDay('10');
        await widget.dateTimeWidget().selectHour('8');
        await widget.dateTimeWidget().selectMinute('30');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();

        await expect(await widget.dateTimeWidget().getPlaceholder(app.FIELD.date_time_between_input)).toBe('Choose anything...');
    });

    it('[C268819] Should be able to set advanced settings for Date Time widget ', async () => {
        await widget.dateTimeWidget().openDatepicker(app.FIELD.date_time_between_input);
        await widget.dateTimeWidget().closeDataTimeWidget();

        await widget.dateTimeWidget().setDateTimeInput(app.FIELD.date_time_between_input, '20-03-17 07:30 PM');
        await taskPage.formFields().saveForm();
        await expect(await widget.dateTimeWidget().getErrorMessage(app.FIELD.date_time_between_input)).toContain('Can\'t be less than');

        await widget.dateTimeWidget().openDatepicker(app.FIELD.date_time_between_input);
        await widget.dateTimeWidget().closeDataTimeWidget();
        await widget.dateTimeWidget().removeFromDatetimeWidget(app.FIELD.date_time_between_input);

        await browser.refresh();

        await widget.dateTimeWidget().setDateTimeInput(app.FIELD.date_time_between_input, '20-03-19 07:30 PM');
        await widget.dateTimeWidget().closeDataTimeWidget();

        await taskPage.formFields().saveForm();

        await expect(await widget.dateTimeWidget().getErrorMessage(app.FIELD.date_time_between_input)).toContain('Can\'t be greater than');
    });
});
