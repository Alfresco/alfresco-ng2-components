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

describe('Text widget', () => {

    const loginPage = new LoginPage();
    let processUserModel;
    const taskPage = new TasksPage();
    const widget = new Widget();
    let alfrescoJsApi;
    const appsActions = new AppsActions();
    let appModel;
    const app = resources.Files.WIDGET_CHECK_APP.TEXT;
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

    it('[C268157] Should be able to set general properties for Text widget', async () => {
        const label = await widget.textWidget().getFieldLabel(app.FIELD.simpleText);
        await expect(label).toBe('textSimple*');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        const placeHolder = await widget.textWidget().getFieldPlaceHolder(app.FIELD.simpleText);
        await expect(placeHolder).toBe('Type something...');
        await widget.textWidget().setValue(app.FIELD.simpleText, 'TEST');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
    });

    it('[C268170] Min-max length properties', async () => {
        await widget.textWidget().setValue(app.FIELD.textMinMax, 'A');
        await expect(await widget.textWidget().getErrorMessage(app.FIELD.textMinMax)).toContain('Enter at least 4 characters');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        await widget.textWidget().setValue(app.FIELD.textMinMax, 'AAAAAAAAAAA');
        await expect(await widget.textWidget().getErrorMessage(app.FIELD.textMinMax)).toContain('Enter no more than 10 characters');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
    });

    it('[C268171] Input mask reversed checkbox properties', async () => {
        await widget.textWidget().setValue(app.FIELD.textMask, '18951523');
        await expect(await widget.textWidget().getFieldValue(app.FIELD.textMask)).toBe('1895-1523');
    });

    it('[C268171] Input mask reversed checkbox properties', async () => {
        await widget.textWidget().setValue(app.FIELD.textMaskReversed, '1234567899');
        await expect(await widget.textWidget().getFieldValue(app.FIELD.textMaskReversed)).toBe('3456-7899');
    });

    it('[C268177] Should be able to set Regex Pattern property for Text widget', async () => {
        await widget.textWidget().setValue(app.FIELD.simpleText, 'TEST');
        await widget.textWidget().setValue(app.FIELD.textRegexp, 'T');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        await expect(await widget.textWidget().getErrorMessage(app.FIELD.textRegexp)).toContain('Enter a different value');
        await widget.textWidget().setValue(app.FIELD.textRegexp, 'TE');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
    });

    it('[C274712] Should be able to set visibility properties for Text widget ', async () => {
        await widget.textWidget().isWidgetNotVisible(app.FIELD.textHidden);
        await widget.textWidget().setValue(app.FIELD.showHiddenText, '1');
        await widget.textWidget().isWidgetVisible(app.FIELD.textHidden);
    });
});
