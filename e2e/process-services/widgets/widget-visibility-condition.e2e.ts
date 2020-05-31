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

import { LoginSSOPage, Widget, BrowserActions, ApplicationsUtil, ProcessUtil, ApiService } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { UsersActions } from '../../actions/users.actions';
import CONSTANTS = require('../../util/constants');
import { TasksPage } from '../../pages/adf/process-services/tasks.page';

const widgets = {
    textOneId: 'text1',
    textTwoId: 'text2'
};

const value = {
    displayCheckbox: 'showCheck',
    displayFieldVariableCheckbox: 'showCheckText1',
    showVariableFieldCheckbox: 'showCheckText1',
    notDisplayCheckbox: 'anythingElse',
    displayVariableValueCheckbox: 'showCheck2'
};

const checkbox = {
    checkboxFieldValue: 'text1value',
    checkboxVariableField: 'variablefield',
    checkboxFieldVariable: 'text1variable',
    checkboxFieldField: 'text1text2',
    checkboxVariableValue: 'variablevalue',
    checkboxVariableVariable: 'variablevariable'
};

describe('Process-Services - Visibility conditions', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP.VISIBILITY;

    const loginPage = new LoginSSOPage();
    const taskPage = new TasksPage();
    const widget = new Widget();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);

    let appModel;
    let deployedApp, process;
    let processUserModel;

    beforeAll(async () => {
       await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

       processUserModel = await usersActions.createUser();

       await apiService.getInstance().login(processUserModel.email, processUserModel.password);
       appModel = await applicationsService.importPublishDeployApp(browser.params.resources.Files.WIDGET_CHECK_APP.file_path);

       const appDefinitions = await apiService.getInstance().activiti.appsApi.getAppDefinitions();
       deployedApp = appDefinitions.data.find((currentApp) => {
            return currentApp.modelId === appModel.id;
        });
       process = await new ProcessUtil(apiService).startProcessByDefinitionName(appModel.name, app.processName);
       await loginPage.login(processUserModel.email, processUserModel.password);
    });

    beforeEach(async () => {
        const urlToNavigateTo = `${browser.params.testConfig.adf.url}/activiti/apps/${deployedApp.id}/tasks/`;
        await BrowserActions.getUrl(urlToNavigateTo);
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.formFields().checkFormIsDisplayed();
    });

    afterAll(async () => {
        await apiService.getInstance().activiti.processApi.deleteProcessInstance(process.id);
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
    });

    it('[C309647] Should be able to see Checkbox widget when visibility condition refers to another field with specific value', async () => {
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldValue);
        await widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldValue);
    });

    it('[C309648] Should be able to see Checkbox widget when visibility condition refers to a form variable and a field', async () => {
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableField);

        await widget.textWidget().setValue(widgets.textOneId, value.showVariableFieldCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableField);

        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableField);
    });

    it('[C309649] Should be able to see Checkbox widget when visibility condition refers to a field and a form variable', async () => {
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldVariable);

        await widget.textWidget().setValue(widgets.textOneId, value.displayFieldVariableCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldVariable);

        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldVariable);
    });

    it('[C311425] Should be able to see Checkbox widget when visibility condition refers to a field and another field', async () => {
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldField);
        await widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);

        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldField);

        await widget.textWidget().setValue(widgets.textTwoId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldField);
    });

    it('[C311424] Should be able to see Checkbox widget when visibility condition refers to a variable with specific value', async () => {
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableValue);
    });

    it('[C311426] Should be able to see Checkbox widget when visibility condition refers to form variable and another form variable', async () => {
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableVariable);
    });
});
