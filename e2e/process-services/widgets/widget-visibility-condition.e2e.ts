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
    LoginPage,
    ProcessUtil,
    UsersActions,
    Widget
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { TasksPage } from '../pages/tasks.page';
import CONSTANTS = require('../../util/constants');
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ProcessServicesPage } from '../pages/process-services.page';

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

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const widget = new Widget();
    const navigationBarPage = new NavigationBarPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const processUtil = new ProcessUtil(apiService);

    let appModel;
    let deployedAppId; let process;
    let processUserModel;

    beforeAll(async () => {
       await apiService.loginWithProfile('admin');

       processUserModel = await usersActions.createUser();

       await apiService.login(processUserModel.username, processUserModel.password);
       appModel = await applicationsService.importPublishDeployApp(browser.params.resources.Files.WIDGET_CHECK_APP.file_path);

       deployedAppId = await applicationsService.getAppDefinitionId(appModel.id);

       process = await processUtil.startProcessByDefinitionName(appModel.name, app.processName);
       await loginPage.login(processUserModel.username, processUserModel.password);
    });

    beforeEach(async () => {
        await navigationBarPage.clickHomeButton();
        await (new ProcessServicesPage()).goToAppByAppId(deployedAppId);
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.formFields().checkFormIsDisplayed();
    });

    afterAll(async () => {
        await processUtil.cancelProcessInstance(process.id);
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(processUserModel.tenantId);
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

    it('[C311425] Should be able to see Checkbox widget when visibility condition refers to a field and another field', async () => {
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldField);
        await widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);

        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldField);

        await widget.textWidget().setValue(widgets.textTwoId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldField);
    });

    it('[C309649] Should be able to see Checkbox widget when visibility condition refers to a field and a form variable', async () => {
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldVariable);

        await widget.textWidget().setValue(widgets.textOneId, value.displayFieldVariableCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldVariable);

        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldVariable);
    });

    it('[C311424] Should be able to see Checkbox widget when visibility condition refers to a variable with specific value', async () => {
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableValue);
    });

    it('[C311426] Should be able to see Checkbox widget when visibility condition refers to form variable and another form variable', async () => {
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableVariable);
    });
});
