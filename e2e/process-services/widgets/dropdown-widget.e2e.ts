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

describe('Dropdown widget', () => {

    const loginPage = new LoginPage();
    let processUserModel;
    const taskPage = new TasksPage();
    const widget = new Widget();
    let alfrescoJsApi;
    const appsActions = new AppsActions();
    let appModel;
    const app = resources.Files.WIDGET_CHECK_APP.DROPDOWN;
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

    it('[C269051] Should be possible to set general and options properties for Dropdown widget ', async () => {
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();

        await widget.dropdown().selectOption('Happy');
        await expect(await widget.dropdown().getSelectedOptionText(app.FIELD.general_dropdown)).toContain('Happy');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();

        await widget.dropdown().selectOption('Choose one');
        await expect(await widget.dropdown().getSelectedOptionText(app.FIELD.general_dropdown)).toContain('Choose one');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();

        await widget.dropdown().selectOption('Sad');
        await expect(await widget.dropdown().getSelectedOptionText(app.FIELD.general_dropdown)).toContain('Sad');
        await expect(await taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
    });

    it('[C269052] Should be possible to set visibility properties for Dropdown widget', async () => {
        await taskPage.formFields().checkWidgetIsHidden(app.FIELD.dropdown_visible);
        await widget.checkboxWidget().clickCheckboxInput(app.FIELD.checkbox_id);
        await taskPage.formFields().checkWidgetIsVisible(app.FIELD.dropdown_visible);
    });
});
