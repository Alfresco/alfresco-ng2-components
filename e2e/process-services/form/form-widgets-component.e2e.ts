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
import { TasksPage } from './../pages/tasks.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { browser } from 'protractor';
import CONSTANTS = require('../../util/constants');
import FormDefinitionModel = require('../../models/APS/FormDefinitionModel');
import { TaskFormsApi } from '@alfresco/js-api';

const formInstance = new FormDefinitionModel();

describe('Form widgets', () => {

    const taskPage = new TasksPage();
    const loginPage = new LoginPage();
    const widget = new Widget();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const taskFormsApi = new TaskFormsApi(apiService.getInstance());
    const processUtil = new ProcessUtil(apiService);

    const newTask = 'First task';
    let processUserModel;
    let appModelWidget;

    describe('Form widgets', () => {

        const appWidget = browser.params.resources.Files.WIDGETS_SMOKE_TEST;
        const appFields = appWidget.form_fields;

        beforeAll(async () => {
            await apiService.loginWithProfile('admin');

            processUserModel = await usersActions.createUser();

            await apiService.login(processUserModel.username, processUserModel.password);

            appModelWidget = await applicationsService.importPublishDeployApp(appWidget.file_path);

            await loginPage.login(processUserModel.username, processUserModel.password);

            await (await new NavigationBarPage().navigateToProcessServicesPage()).goToApp(appModelWidget.name);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            const task = await taskPage.createNewTask();
            await task.addName(newTask);
            await task.addDescription('Description');
            await task.selectForm(appWidget.formName);
            await task.clickStartButton();

            await taskPage.tasksListPage().checkContentIsDisplayed(newTask);
            await taskPage.formFields().checkFormIsDisplayed();
            await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

            const response = await taskPage.taskDetails().getId();

            const formDefinition = await taskFormsApi.getTaskForm(response);
            formInstance.setFields(formDefinition.fields);
            formInstance.setAllWidgets(formDefinition.fields);
        });

        afterAll(async () => {
            await new NavigationBarPage().clickLogoutButton();
            await apiService.loginWithProfile('admin');

            await usersActions.deleteTenant(processUserModel.tenantId);
            await apiService.getInstance().logout();
        });

        it('[C272778] Should display text and multi-line in form', async () => {
            await expect(await taskPage.formFields().getFieldLabel(appFields.text_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.text_id).name);
            await expect(await taskPage.formFields().getFieldValue(appFields.text_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.text_id).value || '');

            await expect(await widget.multilineTextWidget().getFieldValue(appFields.multiline_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.multiline_id).value || '');
            await expect(await taskPage.formFields().getFieldLabel(appFields.multiline_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.multiline_id).name);
        });

        it('[C272779] Should display number and amount in form', async () => {
            await expect(await taskPage.formFields().getFieldValue(appFields.number_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.number_id).value || '');
            await expect(await taskPage.formFields().getFieldLabel(appFields.number_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.number_id).name);

            await expect(await taskPage.formFields().getFieldValue(appFields.amount_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.amount_id).value || '');
            await expect(await taskPage.formFields().getFieldLabel(appFields.amount_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.amount_id).name);
        });

        it('[C272780] Should display attach file and attach folder in form', async () => {
            await expect(await taskPage.formFields().getFieldLabel(appFields.attachFolder_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.attachFolder_id).name);
            await expect(await taskPage.formFields().getFieldLabel(appFields.attachFile_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.attachFile_id).name);
        });

        it('[C272781] Should display date and date & time in form', async () => {
            await expect(await taskPage.formFields().getFieldLabel(appFields.date_id))
                .toContain(formInstance.getWidgetBy('id', appFields.date_id).name);
            await expect(await taskPage.formFields().getFieldValue(appFields.date_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.date_id).value || '');

            await expect(await taskPage.formFields().getFieldLabel(appFields.dateTime_id))
                .toContain(formInstance.getWidgetBy('id', appFields.dateTime_id).name);
            await expect(await taskPage.formFields().getFieldValue(appFields.dateTime_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.dateTime_id).value || '');
        });

        it('[C272782] Should display people and group in form', async () => {
            await expect(await taskPage.formFields().getFieldValue(appFields.people_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.people_id).value || '');
            await expect(await taskPage.formFields().getFieldLabel(appFields.people_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.people_id).name);

            await expect(await taskPage.formFields().getFieldValue(appFields.group_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.group_id).value || '');
            await expect(await taskPage.formFields().getFieldLabel(appFields.group_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.group_id).name);
        });

        it('[C272783] Should display displayText and displayValue in form', async () => {
        await expect(await widget.displayTextWidget().getFieldLabel(appFields.displayText_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.displayText_id).value);
        await expect(await widget.displayValueWidget().getFieldLabel(appFields.displayValue_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.displayValue_id).value || 'Display value' || '');
        await expect(await widget.displayValueWidget().getFieldValue(appFields.displayValue_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.displayValue_id).value || '');
        });

        it('[C272784] Should display typeahead and header in form', async () => {
            await expect(await widget.headerWidget().getFieldLabel(appFields.header_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.header_id).name);
            await expect(await taskPage.formFields().getFieldValue(appFields.typeAhead_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.typeAhead_id).value || '');
            await expect(await taskPage.formFields().getFieldLabel(appFields.typeAhead_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.typeAhead_id).name);
        });

        it('[C272785] Should display checkbox and radio button in form', async () => {
            const radioOption = 1;

            await expect(await taskPage.formFields().getFieldLabel(appFields.checkbox_id))
                .toContain(formInstance.getWidgetBy('id', appFields.checkbox_id).name);

            await expect(await taskPage.formFields().getFieldLabel(appFields.radioButtons_id))
                .toContain(formInstance.getWidgetBy('id', appFields.radioButtons_id).name);
            await expect(await widget.radioWidget().getSpecificOptionLabel(appFields.radioButtons_id, radioOption))
                .toContain(formInstance.getWidgetBy('id', appFields.radioButtons_id).options[radioOption - 1].name);
        });

        it('[C268149] Should display hyperlink, dropdown and dynamic table in form', async () => {
        await expect(await widget.hyperlink().getFieldText(appFields.hyperlink_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.hyperlink_id).hyperlinkUrl || '');
        await expect(await taskPage.formFields().getFieldLabel(appFields.hyperlink_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.hyperlink_id).name);

        await expect(await taskPage.formFields().getFieldLabel(appFields.dropdown_id))
                .toContain(formInstance.getWidgetBy('id', appFields.dropdown_id).name);
        await expect(widget.dropdown().getSelectedOptionText(appFields.dropdown_id))
                .toContain(formInstance.getWidgetBy('id', appFields.dropdown_id).value);

        await expect(await widget.dynamicTable().getFieldLabel(appFields.dynamicTable_id))
                .toContain(formInstance.getWidgetBy('id', appFields.dynamicTable_id).name);
        await expect(await widget.dynamicTable().getColumnName(appFields.dynamicTable_id))
                .toContain(formInstance.getWidgetBy('id', appFields.dynamicTable_id).columnDefinitions[0].name);
        });
   });

    describe('with fields involving other people', () => {
        const app = browser.params.resources.Files.FORM_ADF;
        let process;
        const appFields = app.form_fields;
        let appModel;

        beforeAll(async () => {
            await apiService.loginWithProfile('admin');

            processUserModel = await usersActions.createUser();

            await apiService.login(processUserModel.username, processUserModel.password);
            appModel = await applicationsService.importPublishDeployApp(app.file_path);

            process = await processUtil.startProcessOfApp(appModel.name);
            await loginPage.login(processUserModel.username, processUserModel.password);
        });

        beforeEach(async () => {
            await (await new NavigationBarPage().navigateToProcessServicesPage()).goToApp(appModel.name);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.formFields().checkFormIsDisplayed();
        });

        afterAll(async () => {
            await processUtil.cancelProcessInstance(process.id);
            await apiService.loginWithProfile('admin');
            await usersActions.deleteTenant(processUserModel.tenantId);
        });

        it('[C260405] Value fields configured with process variables', async () => {
            await taskPage.formFields().checkFormIsDisplayed();
            await expect(await taskPage.taskDetails().getTitle()).toEqual('Activities');

            await taskPage.formFields().setValueInInputById('label', 'value 1');
            await taskPage.formFields().completeForm();
            /* cspell:disable-next-line */
            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);

            await expect(await widget.displayTextWidget().getFieldText(appFields.displayText_id))
                .toContain('value 1');
            await expect(await widget.textWidget().getFieldValue(appFields.text_id))
                .toEqual('value 1');
            await expect(await widget.displayValueWidget().getFieldValue(appFields.displayValue_id))
                .toEqual('value 1');
        });
    });
});
