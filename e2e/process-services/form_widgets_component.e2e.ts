/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { ProcessServicesPage } from '../pages/adf/process_services/processServicesPage';
import { TasksPage } from '../pages/adf/process_services/tasksPage';
import { Widget } from '../pages/adf/process_services/widgets/widget';

import CONSTANTS = require('../util/constants');

import FormDefinitionModel = require('../models/APS/FormDefinitionModel');
import Task = require('../models/APS/Task');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

let formInstance = new FormDefinitionModel();

describe('Form widgets', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let processUserModel;
    let taskPage = new TasksPage();
    let widget = new Widget();
    let alfrescoJsApi;

    beforeAll(async (done) => {
        let users = new UsersActions();

        alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(alfrescoJsApi);

        done();
    });

    describe('visible', () => {
        let app = resources.Files.WIDGETS_SMOKE_TEST;
        let appFields = app.form_fields;
        let appModel;
        let newTask = 'First task';

        beforeAll(async (done) => {

            let appsActions = new AppsActions();

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
            processServicesPage.goToProcessServices().goToApp(appModel.name)
                .clickTasksButton();
            taskPage.filtersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
            taskPage.createNewTask().addName(newTask).addDescription('Description').addForm(app.formName).clickStartButton()
                .then(() => {
                    taskPage.tasksListPage().checkTaskIsDisplayedInTasksList(newTask);
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

            expect(taskPage.formFields().getFieldLabel(appFields.attachfolder_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.attachfolder_id).name);
            expect(taskPage.formFields().getFieldLabel(appFields.attachfile_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.attachfile_id).name);
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

            expect(widget.displayTextWidget().getFieldLabel(appFields.displaytext_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.displaytext_id).value);
            expect(widget.displayValueWidget().getFieldLabel(appFields.displayvalue_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.displayvalue_id).value || 'Unknown type: readonly');
        });

        it('[C272784] Should display typeahead and header in form', () => {

            expect(widget.headerWidget().getFieldLabel(appFields.header_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.header_id).name);

            expect(taskPage.formFields().getFieldValue(appFields.typeahead_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.typeahead_id).value || '');
            expect(taskPage.formFields().getFieldLabel(appFields.typeahead_id))
                .toEqual(formInstance.getWidgetBy('id', appFields.typeahead_id).name);
        });

        it('[C272785] Should display checkbox and radio button in form', () => {
            let radioOption = 1;

            expect(taskPage.formFields().getFieldLabel(appFields.checkbox_id))
                .toContain(formInstance.getWidgetBy('id', appFields.checkbox_id).name);

            expect(taskPage.formFields().getFieldLabel(appFields.radiobuttons_id))
                .toContain(formInstance.getWidgetBy('id', appFields.radiobuttons_id).name);
            expect(widget.radioWidget().getSpecificOptionLabel(appFields.radiobuttons_id, radioOption))
                .toContain(formInstance.getWidgetBy('id', appFields.radiobuttons_id).options[radioOption - 1].name);
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

            expect(widget.dynamicTable().getFieldLabel(appFields.dynamictable_id))
                .toContain(formInstance.getWidgetBy('id', appFields.dynamictable_id).name);
            expect(widget.dynamicTable().getColumnName(appFields.dynamictable_id))
                .toContain(formInstance.getWidgetBy('id', appFields.dynamictable_id).columnDefinitions[0].name);
        });

    });

    xdescribe('with fields involving other people', () => {

        let app = resources.Files.FORM_ADF;
        let appFields = app.form_fields;
        let appModel;
        let newTask = 'First task';

        beforeAll(async (done) => {

            let appsActions = new AppsActions();

            await alfrescoJsApi.login(processUserModel.email, processUserModel.password);

            appModel = await appsActions.importPublishDeployApp(alfrescoJsApi, app.file_location);

            done();
        });

        afterAll(async (done) => {

            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);

            done();
        });

        it('[C260405] Value fields configured with process variables', () => {
            loginPage.loginToProcessServicesUsingUserModel(processUserModel);
            processServicesPage.goToProcessServices().goToApp(appModel.name)
                .clickTasksButton();
            taskPage.filtersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
            taskPage.createNewTask().addName(newTask).addDescription('Description').addForm(app.formName).clickStartButton()
                .then(() => {
                    taskPage.tasksListPage().checkTaskIsDisplayedInTasksList(newTask);
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
                    taskPage.formFields().typeInInputById('label', 'value 1').completeForm();
                    taskPage.taskFilterPage().clickCompletedTaskFilter();
                })
                .then(() => {
                    expect(widget.displayTextWidget().getFieldValue())
                        .toEqual('value 1');
                    expect(widget.displayTextWidget().getFieldValue())
                        .toContain('value 1');
                    expect(taskPage.formFields().getFieldValue(appFields.displayvalue_id))
                        .toEqual('value 1');

                });

        });
    });

    describe('Text Widget', () => {
        let app = resources.Files.WIDGET_CHECK_APP.TEXT;
        let appModel, deployedApp;
        let appsActions = new AppsActions();

        beforeAll(async (done) => {
            await alfrescoJsApi.login(processUserModel.email, processUserModel.password);
            appModel = await appsActions.importPublishDeployApp(alfrescoJsApi, app.file_location);
            let appDefinitions = await alfrescoJsApi.activiti.appsApi.getAppDefinitions();
            deployedApp = appDefinitions.data.find((currentApp) => {
                return currentApp.modelId === appModel.id;
            });
            await appsActions.startProcess(alfrescoJsApi, appModel, app.processName);
            loginPage.loginToProcessServicesUsingUserModel(processUserModel);
            done();
        });

        beforeEach(() => {
            let urlToNavigateTo = `${TestConfig.adf.url}/activiti/apps/${deployedApp.id}/tasks/`;
            browser.get(urlToNavigateTo);
            taskPage.filtersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
            taskPage.formFields().checkFormIsDisplayed();
        });

        afterAll(async (done) => {
            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
            done();
        });

        it('[C268157] - General Properties', async () => {
            let label = widget.textWidget().getFieldLabel(app.FIELD.simpleText);
            expect(label).toBe('textSimple*');
            expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
            let placeHolder = widget.textWidget().getFieldPlaceHolder(app.FIELD.simpleText);
            expect(placeHolder).toBe('Type something...');
            widget.textWidget().setValue(app.FIELD.simpleText, 'TEST');
            expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
        });

        it('[C268170] - Min-max length properties', async () => {
            widget.textWidget().setValue(app.FIELD.textMinMax, 'A');
            expect(widget.textWidget().getErrorMessage(app.FIELD.textMinMax)).toBe('Enter at least 4 characters');
            expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
            widget.textWidget().setValue(app.FIELD.textMinMax, 'AAAAAAAAAAA');
            expect(widget.textWidget().getErrorMessage(app.FIELD.textMinMax)).toBe('Enter no more than 10 characters');
            expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        });

        it('[C268171] - Input mask reversed checkbox properties', async () => {
            widget.textWidget().setValue(app.FIELD.textMask, '18951523');
            expect(widget.textWidget().getFieldValue(app.FIELD.textMask)).toBe('1895-1523');
        });

        it('[C268171] - Input mask reversed checkbox properties', async () => {
            widget.textWidget().setValue(app.FIELD.textMaskReversed, '1234567899');
            expect(widget.textWidget().getFieldValue(app.FIELD.textMaskReversed)).toBe('3456-7899');
        });

        it('[C268177] - Regex Pattern property', async () => {
            widget.textWidget().setValue(app.FIELD.simpleText, 'TEST');
            widget.textWidget().setValue(app.FIELD.textRegexp, 'T');
            expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
            expect(widget.textWidget().getErrorMessage(app.FIELD.textRegexp)).toBe('Enter a different value');
            widget.textWidget().setValue(app.FIELD.textRegexp, 'TE');
            expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
        });

        it('[C274712] - Visibility condition', async () => {
            widget.textWidget().isWidgetNotVisible(app.FIELD.textHidden);
            widget.textWidget().setValue(app.FIELD.showHiddenText, '1');
            widget.textWidget().isWidgetVisible(app.FIELD.textHidden);
        });

    });

    describe('MultiLine Widget', () => {
        let app = resources.Files.WIDGET_CHECK_APP.MULTILINE_TEXT;
        let appModel, deployedApp;
        let appsActions = new AppsActions();

        beforeAll(async (done) => {
            await alfrescoJsApi.login(processUserModel.email, processUserModel.password);
            appModel = await appsActions.importPublishDeployApp(alfrescoJsApi, app.file_location);
            let appDefinitions = await alfrescoJsApi.activiti.appsApi.getAppDefinitions();
            deployedApp = appDefinitions.data.find((currentApp) => {
                return currentApp.modelId === appModel.id;
            });
            await appsActions.startProcess(alfrescoJsApi, appModel, app.processName);
            loginPage.loginToProcessServicesUsingUserModel(processUserModel);
            done();
        });

        beforeEach(() => {
            let urlToNavigateTo = `${TestConfig.adf.url}/activiti/apps/${deployedApp.id}/tasks/`;
            browser.get(urlToNavigateTo);
            taskPage.filtersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
            taskPage.formFields().checkFormIsDisplayed();
        });

        afterAll(async (done) => {
            await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
            done();
        });

        fit('[C268182] - Multi-line Text Widget - General Properties', async () => {
            let label = widget.multilineTextWidget().getFieldLabel(app.FIELD.multiSimple);
            expect(label).toBe('multiSimple*');
            expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
            // let placeHolder = widget.multilineTextWidget().getFieldPlaceHolder(app.FIELD.multiSimple);
            // expect(placeHolder).toBe('Type something...');
            // widget.multilineTextWidget().setValue(app.FIELD.multiSimple, 'TEST');
            // expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
        });

        xit('[C268170] - Min-max length properties', async () => {
            widget.textWidget().setValue(app.FIELD.textMinMax, 'A');
            expect(widget.textWidget().getErrorMessage(app.FIELD.textMinMax)).toBe('Enter at least 4 characters');
            expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
            widget.textWidget().setValue(app.FIELD.textMinMax, 'AAAAAAAAAAA');
            expect(widget.textWidget().getErrorMessage(app.FIELD.textMinMax)).toBe('Enter no more than 10 characters');
            expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        });

        xit('[C268177] - Regex Pattern property', async () => {
            widget.textWidget().setValue(app.FIELD.simpleText, 'TEST');
            widget.textWidget().setValue(app.FIELD.textRegexp, 'T');
            expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
            expect(widget.textWidget().getErrorMessage(app.FIELD.textRegexp)).toBe('Enter a different value');
            widget.textWidget().setValue(app.FIELD.textRegexp, 'TE');
            expect(taskPage.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
        });

        xit('[C274712] - Visibility condition', async () => {
            widget.textWidget().isWidgetNotVisible(app.FIELD.textHidden);
            widget.textWidget().setValue(app.FIELD.showHiddenText, '1');
            widget.textWidget().isWidgetVisible(app.FIELD.textHidden);
        });

    });
});
