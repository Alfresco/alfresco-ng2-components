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

describe('Number widget', () => {

    let loginPage = new LoginPage();
    let processUserModel;
    let taskPage = new TasksPage();
    let widget = new Widget();
    let alfrescoJsApi;
    let appsActions = new AppsActions();
    let appModel;
    let app = resources.Files.WIDGET_CHECK_APP.NUMBER;
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

    it('[C269111] Should be able to set general properties for Number Widget', () => {
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        expect(widget.numberWidget().getNumberFieldLabel(app.FIELD.number_general)).toContain('Number General');
        expect(widget.numberWidget().getPlaceholder(app.FIELD.number_general)).toContain('Type a number');

        widget.numberWidget().setFieldValue(app.FIELD.number_general, 2);
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
    });

    it('[C274702] Should be able to set advanced and visibility properties for Number Widget', () => {
        widget.numberWidget().setFieldValue(app.FIELD.number_general, 2);

        taskPage.formFields().checkWidgetIsHidden(app.FIELD.number_visible);
        widget.checkboxWidget().clickCheckboxInput(app.FIELD.checkbox_id);
        taskPage.formFields().checkWidgetIsVisible(app.FIELD.number_visible);

        widget.numberWidget().setFieldValue(app.FIELD.number_visible, 2);
        expect(widget.numberWidget().getErrorMessage(app.FIELD.number_visible)).toBe('Can\'t be less than 3');
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        widget.numberWidget().clearFieldValue(app.FIELD.number_visible);

        widget.numberWidget().setFieldValue(app.FIELD.number_visible, 101);
        expect(widget.numberWidget().getErrorMessage(app.FIELD.number_visible)).toBe('Can\'t be greater than 100');
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        widget.numberWidget().clearFieldValue(app.FIELD.number_visible);

        widget.numberWidget().setFieldValue(app.FIELD.number_visible, 4);
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
    });
});
