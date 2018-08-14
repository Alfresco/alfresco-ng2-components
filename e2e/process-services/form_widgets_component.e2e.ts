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

import LoginPage = require('../pages/adf/loginPage');
import ProcessServicesPage = require('../pages/adf/process_services/processServicesPage');
import TasksPage = require('../pages/adf/process_services/tasksPage');
import UsingWidget = require('../pages/adf/process_services/widgets/usingWidget');

import CONSTANTS = require('../util/constants');

import FormDefinitionModel = require('../models/APS/FormDefinitionModel');
import Task = require('../models/APS/Task');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

let formInstance = new FormDefinitionModel();

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

describe('Form widgets', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let processUserModel;
    let app = resources.Files.WIDGETS_SMOKE_TEST;
    let appFields = app.form_fields;
    let taskPage = new TasksPage();
    let appModel;
    let newTask = 'First task';
    let usingWidget = new UsingWidget();
    let alfrescoJsApi;

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

    it('[C272778] Check text, multiline widgets - label, value and displayed', () => {
        loginPage.loginToProcessServicesUsingUserModel(processUserModel);
        processServicesPage.goToProcessServices().goToApp(appModel.name)
            .clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(newTask).addDescription('Description').addForm(app.formName).clickStartButton()
            .then(() => {
                taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(newTask);
                taskPage.usingFormFields().checkFormIsDisplayed();
                expect(taskPage.usingTaskDetails().getTitle()).toEqual('Activities');
            })
            .then(() => {
                return alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
            })
            .then( (response) => {
                return alfrescoJsApi.activiti.taskFormsApi.getTaskForm(response.data[0].id);
            })
            .then((formDefinition) => {
                formInstance.setFields(formDefinition.fields);
                formInstance.setAllWidgets(formDefinition.fields);
                return formInstance;
            })
            .then(() => {
                expect(taskPage.usingFormFields().getFieldLabel(appFields.text_id))
                    .toEqual(formInstance.getWidgetBy('id', appFields.text_id).name);
                expect(taskPage.usingFormFields().getFieldValue(appFields.text_id))
                    .toEqual(formInstance.getWidgetBy('id', appFields.text_id).value || '');

                expect(usingWidget.usingMultilineTextWidget().getFieldValue(appFields.multiline_id))
                    .toEqual(formInstance.getWidgetBy('id', appFields.multiline_id).value || '');
                expect(taskPage.usingFormFields().getFieldLabel(appFields.multiline_id))
                    .toEqual(formInstance.getWidgetBy('id', appFields.multiline_id).name);
            });

    });

    it('[C272779] Check number, amount widgets - label, value and displayed', () => {

        expect(taskPage.usingFormFields().getFieldValue(appFields.number_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.number_id).value || '');
        expect(taskPage.usingFormFields().getFieldLabel(appFields.number_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.number_id).name);

        expect(taskPage.usingFormFields().getFieldValue(appFields.amount_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.amount_id).value || '');
        expect(taskPage.usingFormFields().getFieldLabel(appFields.amount_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.amount_id).name);
    });

    it('[C272780] Check attachfolder, attachfile widgets - label and displayed', () => {

        expect(taskPage.usingFormFields().getFieldLabel(appFields.attachfolder_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.attachfolder_id).name);
        expect(taskPage.usingFormFields().getFieldLabel(appFields.attachfile_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.attachfile_id).name);
    });

    it('[C272781] Check date, date & time widgets - label, value and displayed', () => {

        expect(taskPage.usingFormFields().getFieldLabel(appFields.date_id))
            .toContain(formInstance.getWidgetBy('id', appFields.date_id).name);
        expect(taskPage.usingFormFields().getFieldValue(appFields.date_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.date_id).value || '');

        expect(taskPage.usingFormFields().getFieldLabel(appFields.dateTime_id))
            .toContain(formInstance.getWidgetBy('id', appFields.dateTime_id).name);
        expect(taskPage.usingFormFields().getFieldValue(appFields.dateTime_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.dateTime_id).value || '');
    });

    it('[C272782] Check people, group widgets - label, value and displayed', () => {

        expect(taskPage.usingFormFields().getFieldValue(appFields.people_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.people_id).value || '');
        expect(taskPage.usingFormFields().getFieldLabel(appFields.people_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.people_id).name);

        expect(taskPage.usingFormFields().getFieldValue(appFields.group_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.group_id).value || '');
        expect(taskPage.usingFormFields().getFieldLabel(appFields.group_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.group_id).name);
    });

    it('[C272783] Check displayText, displayValue widgets - value and displayed', () => {

        expect(usingWidget.usingDisplayTextWidget().getFieldLabel(appFields.displaytext_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.displaytext_id).value);
        expect(usingWidget.usingDisplayValueWidget().getFieldLabel(appFields.displayvalue_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.displayvalue_id).value || 'Unknown type: readonly');
    });

    it('[C272784] Check typeahead, header widgets - label, value and displayed', () => {

        expect(usingWidget.usingHeaderWidget().getFieldLabel(appFields.header_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.header_id).name);

        expect(taskPage.usingFormFields().getFieldValue(appFields.typeahead_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.typeahead_id).value || '');
        expect(taskPage.usingFormFields().getFieldLabel(appFields.typeahead_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.typeahead_id).name);
    });

    it('[C272785] Check checkbox, radiobuttons widgets - label, value and displayed', () => {
        let radioOption = 1;

        expect(taskPage.usingFormFields().getFieldLabel(appFields.checkbox_id))
            .toContain(formInstance.getWidgetBy('id', appFields.checkbox_id).name);

        expect(taskPage.usingFormFields().getFieldLabel(appFields.radiobuttons_id))
            .toContain(formInstance.getWidgetBy('id', appFields.radiobuttons_id).name);
        expect(usingWidget.usingRadioWidget().getSpecificOptionLabel(appFields.radiobuttons_id, radioOption))
            .toContain(formInstance.getWidgetBy('id', appFields.radiobuttons_id).options[radioOption - 1].name);
    });

    it('[C268149] Check hyperlink, dropdown, dynamictable widgets - label, value and displayed', () => {

        expect(usingWidget.usingHyperlink().getFieldText(appFields.hyperlink_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.hyperlink_id).hyperlinkUrl || '');
        expect(taskPage.usingFormFields().getFieldLabel(appFields.hyperlink_id))
            .toEqual(formInstance.getWidgetBy('id', appFields.hyperlink_id).name);

        expect(taskPage.usingFormFields().getFieldLabel(appFields.dropdown_id))
            .toContain(formInstance.getWidgetBy('id', appFields.dropdown_id).name);
        expect(usingWidget.usingDropdown().getSelectedOptionText(appFields.dropdown_id))
            .toContain(formInstance.getWidgetBy('id', appFields.dropdown_id).value);

        expect(usingWidget.usingDynamicTable().getFieldLabel(appFields.dynamictable_id))
            .toContain(formInstance.getWidgetBy('id', appFields.dynamictable_id).name);
        expect(usingWidget.usingDynamicTable().getColumnName(appFields.dynamictable_id))
            .toContain(formInstance.getWidgetBy('id', appFields.dynamictable_id).columnDefinitions[0].name);
    });

});
