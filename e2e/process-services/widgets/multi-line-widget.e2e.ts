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
import { browser } from 'protractor';
import { LoginPage } from '../../pages/adf/loginPage';
import { TasksPage } from '../../pages/adf/process-services/tasksPage';
import { Widget } from '../../pages/adf/process-services/widgets/widget';
import CONSTANTS = require('../../util/constants');
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

describe('Multi-line Widget', () => {

    let loginPage = new LoginPage();
    let processUserModel;
    let taskPage = new TasksPage();
    let widget = new Widget();
    let alfrescoJsApi;
    let appsActions = new AppsActions();
    let appModel;
    let app = resources.Files.WIDGET_CHECK_APP.MULTILINE_TEXT;
    let deployedApp, process;

    beforeAll(async (done) => {
        let users = new UsersActions();

        alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(alfrescoJsApi);

        await alfrescoJsApi.login(processUserModel.email, processUserModel.password);
        appModel = await appsActions.importPublishDeployApp(alfrescoJsApi, resources.Files.WIDGET_CHECK_APP.file_location);

        let appDefinitions = await alfrescoJsApi.activiti.appsApi.getAppDefinitions();
        deployedApp = appDefinitions.data.find((currentApp) => {
            return currentApp.modelId === appModel.id;
        });
        process = await appsActions.startProcess(alfrescoJsApi, appModel, app.processName);
        loginPage.loginToProcessServicesUsingUserModel(processUserModel);
        done();
    });

    beforeEach(() => {
        let urlToNavigateTo = `${TestConfig.adf.url}/activiti/apps/${deployedApp.id}/tasks/`;
        browser.get(urlToNavigateTo);
        taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        taskPage.formFields().checkFormIsDisplayed();
    });

    afterAll(async (done) => {
        await alfrescoJsApi.activiti.processApi.deleteProcessInstance(process.id);
        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
        done();
    });

    it('[C268182] Should be able to set general properties for Multi-line Text Widget', () => {
        let label = widget.multilineTextWidget().getFieldLabel(app.FIELD.multiSimple);
        expect(label).toBe('multiSimple*');
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        let placeHolder = widget.multilineTextWidget().getFieldPlaceHolder(app.FIELD.multiSimple);
        expect(placeHolder).toBe('Type something...');
        widget.multilineTextWidget().setValue(app.FIELD.multiSimple, 'TEST');
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
    });

    it('[C268184] Should be able to set advanced properties for Multi-line Text Widget', async () => {
        widget.multilineTextWidget().setValue(app.FIELD.multiMinMax, 'A');
        expect(widget.multilineTextWidget().getErrorMessage(app.FIELD.multiMinMax)).toBe('Enter at least 4 characters');
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        widget.multilineTextWidget().setValue(app.FIELD.multiMinMax, 'AAAAAAAAAAA');
        expect(widget.multilineTextWidget().getErrorMessage(app.FIELD.multiMinMax)).toBe('Enter no more than 10 characters');
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        widget.multilineTextWidget().setValue(app.FIELD.multiMinMax, 'AAAA');

        widget.multilineTextWidget().setValue(app.FIELD.multiSimple, 'TEST');
        widget.multilineTextWidget().setValue(app.FIELD.multiRegexp, '3');
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        expect(widget.multilineTextWidget().getErrorMessage(app.FIELD.multiRegexp)).toBe('Enter a different value');
        widget.multilineTextWidget().setValue(app.FIELD.multiRegexp, 'TE');
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
    });

    it('[C268232] Should be able to set visibility properties for Multi-line Text Widget', async () => {
        widget.textWidget().isWidgetNotVisible(app.FIELD.multiVisible);
        widget.textWidget().setValue(app.FIELD.showMultiHidden, '1');
        widget.textWidget().isWidgetVisible(app.FIELD.multiVisible);
    });
});
