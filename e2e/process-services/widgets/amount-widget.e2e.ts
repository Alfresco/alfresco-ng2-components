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

describe('Amount Widget', () => {

    let loginPage = new LoginPage();

    let processUserModel;
    let taskPage = new TasksPage();
    let widget = new Widget();
    let alfrescoJsApi;
    let appsActions = new AppsActions();
    let appModel;
    let app = resources.Files.WIDGET_CHECK_APP.AMOUNT;
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

    it('[C274703] Should be possible to set general, advance and visibility properties for Amount Widget', () => {
        taskPage.formFields().checkWidgetIsHidden(app.FIELD.amount_input_id);
        widget.checkboxWidget().clickCheckboxInput(app.FIELD.checkbox_id);
        taskPage.formFields().checkWidgetIsVisible(app.FIELD.amount_input_id);

        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        expect(widget.amountWidget().getAmountFieldLabel(app.FIELD.amount_input_id)).toContain('Amount');
        expect(widget.amountWidget().getPlaceholder(app.FIELD.amount_input_id)).toContain('Type amount');
        expect(widget.amountWidget().getAmountFieldCurrency(app.FIELD.amount_input_id)).toBe('$');

        widget.amountWidget().setFieldValue(app.FIELD.amount_input_id, 4);
        expect(widget.amountWidget().getErrorMessage(app.FIELD.amount_input_id)).toBe('Can\'t be less than 5');
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        widget.amountWidget().clearFieldValue(app.FIELD.amount_input_id);

        widget.amountWidget().setFieldValue(app.FIELD.amount_input_id, 101);
        expect(widget.amountWidget().getErrorMessage(app.FIELD.amount_input_id)).toBe('Can\'t be greater than 100');
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        widget.amountWidget().clearFieldValue(app.FIELD.amount_input_id);

        widget.amountWidget().setFieldValue(app.FIELD.amount_input_id, 6);
        expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
    });
});
