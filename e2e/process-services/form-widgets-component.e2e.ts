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

import { LoginPage } from '../pages/adf/loginPage';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { Widget } from '../pages/adf/process-services/widgets/widget';

import CONSTANTS = require('../util/constants');

import FormDefinitionModel = require('../models/APS/FormDefinitionModel');
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import Task = require('../models/APS/Task');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';
import { browser } from 'protractor';

let formInstance = new FormDefinitionModel();

describe('Form widgets', () => {
    let alfrescoJsApi;
    let taskPage = new TasksPage();
    let newTask = 'First task';
    let loginPage = new LoginPage();
    let processUserModel;
    let appModel;
    let widget = new Widget();

    describe('Form widgets', () => {
        let app = resources.Files.WIDGETS_SMOKE_TEST;
        let appFields = app.form_fields;

        beforeAll(async (done) => {
            let users = new UsersActions();
            let appsActions = new AppsActions();

            alfrescoJsApi = new AlfrescoApi({
                provider: 'BPM',
                hostBpm: TestConfig.adf.url
            });

            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            processUserModel = await users.createTenantAndUser(alfrescoJsApi);

            await alfrescoJsApi.login(processUserModel.email, processUserModel.password);

            appModel = await appsActions.importPublishDeployApp(alfrescoJsApi, app.file_location);

            done();
        });

        afterAll(async (done) => {

            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);

            done();
        });

        it('[C272778] Should display text and multi-line in form', () => {
            loginPage.loginToProcessServicesUsingUserModel(processUserModel);
            new NavigationBarPage().navigateToProcessServicesPage().goToApp(appModel.name)
                .clickTasksButton();
            taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            taskPage.createNewTask().addName(newTask).addDescription('Description').addForm(app.formName).clickStartButton()
                .then(() => {
                    taskPage.tasksListPage().checkContentIsDisplayed(newTask);
                    taskPage.formFields().checkFormIsDisplayed();
                    expect(taskPage.taskDetails().getTitle()).toEqual('Activities');
                })
                .then(() => {
                    return alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
                })
                .then((response) => {
                    return alfrescoJsApi.activiti.taskFormsApi.getTaskForm(response.data[0].id);
                })
                .then((formDefinition) => {
                    formInstance.setFields(formDefinition.fields);
                    formInstance.setAllWidgets(formDefinition.fields);
                    return formInstance;
                })
                .then(() => {
                    expect(taskPage.formFields().getFieldLabel(appFields.text_id))
                        .toEqual(formInstance.getWidgetBy('id', appFields.text_id).name);
                    expect(taskPage.formFields().getFieldValue(appFields.text_id))
                        .toEqual(formInstance.getWidgetBy('id', appFields.text_id).value || '');

                    expect(widget.multilineTextWidget().getFieldValue(appFields.multiline_id))
                        .toEqual(formInstance.getWidgetBy('id', appFields.multiline_id).value || '');
                    expect(taskPage.formFields().getFieldLabel(appFields.multiline_id))
                        .toEqual(formInstance.getWidgetBy('id', appFields.multiline_id).name);
                });

        });

        it('[C272779] Should display number and amount in form', () => {

            expect(taskPage.formFields().getFieldValue(appFields.number_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.number_id).value || '');
            expect(taskPage.formFields().getFieldLabel(appFields.number_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.number_id).name);

            expect(taskPage.formFields().getFieldValue(appFields.amount_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.amount_id).value || '');
            expect(taskPage.formFields().getFieldLabel(appFields.amount_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.amount_id).name);
        });

        it('[C272780] Should display attach file and attach folder in form', () => {

            expect(taskPage.formFields().getFieldLabel(appFields.attachFolder_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.attachFolder_id).name);
            expect(taskPage.formFields().getFieldLabel(appFields.attachFile_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.attachFile_id).name);
        });

        it('[C272781] Should display date and date & time in form', () => {

            expect(taskPage.formFields().getFieldLabel(appFields.date_id))
                .toContain(formInstance.getWidgetBy('id', appFields.date_id).name);
            expect(taskPage.formFields().getFieldValue(appFields.date_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.date_id).value || '');

            expect(taskPage.formFields().getFieldLabel(appFields.dateTime_id))
                .toContain(formInstance.getWidgetBy('id', appFields.dateTime_id).name);
            expect(taskPage.formFields().getFieldValue(appFields.dateTime_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.dateTime_id).value || '');
        });

        it('[C272782] Should display people and group in form', () => {

            expect(taskPage.formFields().getFieldValue(appFields.people_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.people_id).value || '');
            expect(taskPage.formFields().getFieldLabel(appFields.people_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.people_id).name);

            expect(taskPage.formFields().getFieldValue(appFields.group_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.group_id).value || '');
            expect(taskPage.formFields().getFieldLabel(appFields.group_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.group_id).name);
        });

        it('[C272783] Should display displayText and displayValue in form', () => {

            expect(widget.displayTextWidget().getFieldLabel(appFields.displayText_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.displayText_id).value);
            expect(widget.displayValueWidget().getFieldLabel(appFields.displayValue_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.displayValue_id).value || 'Unknown type: readonly');
        });

        it('[C272784] Should display typeahead and header in form', () => {
            expect(widget.headerWidget().getFieldLabel(appFields.header_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.header_id).name);
            expect(taskPage.formFields().getFieldValue(appFields.typeAhead_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.typeAhead_id).value || '');
            expect(taskPage.formFields().getFieldLabel(appFields.typeAhead_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.typeAhead_id).name);
        });

        it('[C272785] Should display checkbox and radio button in form', () => {
            let radioOption = 1;

            expect(taskPage.formFields().getFieldLabel(appFields.checkbox_id))
                .toContain(formInstance.getWidgetBy('id', appFields.checkbox_id).name);

            expect(taskPage.formFields().getFieldLabel(appFields.radioButtons_id))
                .toContain(formInstance.getWidgetBy('id', appFields.radioButtons_id).name);
            expect(widget.radioWidget().getSpecificOptionLabel(appFields.radioButtons_id, radioOption))
                .toContain(formInstance.getWidgetBy('id', appFields.radioButtons_id).options[radioOption - 1].name);
        });

        it('[C268149] Should display hyperlink, dropdown and dynamic table in form', () => {

            expect(widget.hyperlink().getFieldText(appFields.hyperlink_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.hyperlink_id).hyperlinkUrl || '');
            expect(taskPage.formFields().getFieldLabel(appFields.hyperlink_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.hyperlink_id).name);

            expect(taskPage.formFields().getFieldLabel(appFields.dropdown_id))
                .toContain(formInstance.getWidgetBy('id', appFields.dropdown_id).name);
            expect(widget.dropdown().getSelectedOptionText(appFields.dropdown_id))
                .toContain(formInstance.getWidgetBy('id', appFields.dropdown_id).value);

            expect(widget.dynamicTable().getFieldLabel(appFields.dynamicTable_id))
                .toContain(formInstance.getWidgetBy('id', appFields.dynamicTable_id).name);
            expect(widget.dynamicTable().getColumnName(appFields.dynamicTable_id))
                .toContain(formInstance.getWidgetBy('id', appFields.dynamicTable_id).columnDefinitions[0].name);
        });

    });

    describe('with fields involving other people', () => {

        let appsActions = new AppsActions();
        let app = resources.Files.FORM_ADF;
        let deployedApp, process;
        let appFields = app.form_fields;

        beforeAll(async (done) => {
            let users = new UsersActions();

            alfrescoJsApi = new AlfrescoApi({
                provider: 'BPM',
                hostBpm: TestConfig.adf.url
            });

            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            processUserModel = await users.createTenantAndUser(alfrescoJsApi);

            await alfrescoJsApi.login(processUserModel.email, processUserModel.password);
            appModel = await appsActions.importPublishDeployApp(alfrescoJsApi, app.file_location);

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

        it('[C260405] Value fields configured with process variables', () => {
            taskPage.formFields().checkFormIsDisplayed();
            expect(taskPage.taskDetails().getTitle()).toEqual('Activities');

            taskPage.formFields().setValueInInputById('label', 'value 1').completeForm();
            /* cspell:disable-next-line */
            taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);

            expect(widget.displayTextWidget().getFieldText(appFields.displayText_id))
                .toContain('value 1');
            expect(widget.textWidget().getFieldValue(appFields.text_id))
                .toEqual('value 1');
            expect(widget.displayValueWidget().getFieldValue(appFields.displayValue_id))
                .toEqual('value 1');
        });
    });
});
