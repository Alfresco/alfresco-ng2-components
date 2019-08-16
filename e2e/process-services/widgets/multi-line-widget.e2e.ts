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

describe('Multi-line Widget', () => {

    const loginPage = new LoginPage();
    let processUserModel;
    const taskPage = new TasksPage();
    const widget = new Widget();
    let alfrescoJsApi;
    const appsActions = new AppsActions();
    let appModel;
    const app = resources.Files.WIDGET_CHECK_APP.MULTILINE_TEXT;
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

    it('[C268182] Should be able to set general properties for Multi-line Text Widget', async () => {
        const label = await widget.multilineTextWidget().getFieldLabel(app.FIELD.multiSimple);
        await expect(label).toBe('multiSimple*');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        const placeHolder = await widget.multilineTextWidget().getFieldPlaceHolder(app.FIELD.multiSimple);
        await expect(placeHolder).toBe('Type something...');
        await widget.multilineTextWidget().setValue(app.FIELD.multiSimple, 'TEST');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
    });

    it('[C268184] Should be able to set advanced properties for Multi-line Text Widget', async () => {
        await widget.multilineTextWidget().setValue(app.FIELD.multiMinMax, 'A');
        await expect(await widget.multilineTextWidget().getErrorMessage(app.FIELD.multiMinMax)).toContain('Enter at least 4 characters');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        await widget.multilineTextWidget().setValue(app.FIELD.multiMinMax, 'AAAAAAAAAAA');
        await expect(await widget.multilineTextWidget().getErrorMessage(app.FIELD.multiMinMax)).toContain('Enter no more than 10 characters');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        await widget.multilineTextWidget().setValue(app.FIELD.multiMinMax, 'AAAA');

        await widget.multilineTextWidget().setValue(app.FIELD.multiSimple, 'TEST');
        await widget.multilineTextWidget().setValue(app.FIELD.multiRegexp, '3');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        await expect(await widget.multilineTextWidget().getErrorMessage(app.FIELD.multiRegexp)).toContain('Enter a different value');
        await widget.multilineTextWidget().setValue(app.FIELD.multiRegexp, 'TE');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
    });

    it('[C268232] Should be able to set visibility properties for Multi-line Text Widget', async () => {
        await widget.textWidget().isWidgetNotVisible(app.FIELD.multiVisible);
        await widget.textWidget().setValue(app.FIELD.showMultiHidden, '1');
        await widget.textWidget().isWidgetVisible(app.FIELD.multiVisible);
    });
});
