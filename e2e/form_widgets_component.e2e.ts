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

import LoginPage = require('./pages/adf/loginPage.js');
import ProcessServicesPage = require('./pages/adf/process_services/processServicesPage.js');
import TasksPage = require('./pages/adf/process_services/tasksPage.js');
import UsingWidget = require('./pages/adf/process_services/widgets/usingWidget.js');

import CONSTANTS = require('./util/constants');
import BasicAuthorization = require('./restAPI/httpRequest/BasicAuthorization');

import UserAPI = require('./restAPI/APS/enterprise/UsersAPI');
import TaskAPI = require('./restAPI/APS/enterprise/TaskAPI');
import AppDefinitionsAPI = require('./restAPI/APS/enterprise/AppDefinitionsAPI');
import RuntimeAppDefinitionAPI = require('./restAPI/APS/enterprise/RuntimeAppDefinitionAPI');
import TenantsAPI = require('./restAPI/APS/enterprise/TenantsAPI');
import FormModelsAPI = require('./restAPI/APS/enterprise/FormModelsAPI.js');

import FormDefinitionModel = require('./models/APS/FormDefinitionModel.js');
import TaskModel = require('./models/APS/TaskModel.js');
import FormModel = require('./models/APS/FormModel.js');
import User = require('./models/APS/User');
import Tenant = require('./models/APS/Tenant');
import AppPublish = require('./models/APS/AppPublish');
import AppDefinition = require('./models/APS/AppDefinition');
import Task = require('./models/APS/Task');

import TestConfig = require('./test.config.js');
import resources = require('./util/resources.js');

let formInstance = new FormDefinitionModel();

import AlfrescoApi = require('alfresco-js-api-node');

import users = require('./restAPI/APS/reusableActions/users');
import { AppsActions } from './actions/APS/apps.actions';

describe('Form widgets', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    let basicAuth, processUserModel;
    let app = resources.Files.WIDGETS_SMOKE_TEST;
    let appFilds = app.form_fields;
    let taskPage = new TasksPage();
    let appModel, modelId;
    let taskModel, formModel;
    let newTask = 'First task';
    let usingWidget = new UsingWidget();
    let procUserModel;

    beforeAll(async (done) => {
        let appsActions = new AppsActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await appsActions.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        done();
    });

    afterAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(procUserModel.tenantId);

        done();
    });

    it('Check text, multiline widgets - label, value and displayed', () => {
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
                return TaskAPI.tasksQuery(basicAuth, new Task({ sort: 'created-desc' }));
            })
            .then(function (response) {
                taskModel = new TaskModel(JSON.parse(response.responseBody).data[0]);
                return new FormModelsAPI().getForm(basicAuth, taskModel.getFormKey());
            })
            .then(function (response) {
                formModel = new FormModel(JSON.parse(response.responseBody));
                expect(taskPage.usingTaskDetails().getFormName())
                    .toEqual(formModel.getName() === null ? CONSTANTS.TASKDETAILS.NO_FORM : formModel.getName());
            })
            .then(() => {
                return new FormModelsAPI().getFormModel(basicAuth, formModel.modelId.toString());
            })
            .then(function (response) {
                formInstance.setFields(JSON.parse(response.responseBody).formDefinition.fields);
                formInstance.setAllWidgets(JSON.parse(response.responseBody).formDefinition.fields);
                return formInstance;
            })
            .then(() => {
                expect(taskPage.usingFormFields().getFieldLabel(appFilds.text_id))
                    .toEqual(formInstance.getWidgetBy('id', appFilds.text_id).name);
                expect(taskPage.usingFormFields().getFieldValue(appFilds.text_id))
                    .toEqual(formInstance.getWidgetBy('id', appFilds.text_id).value || '');

                expect(usingWidget.usingMultilineTextWidget().getFieldValue(appFilds.multiline_id))
                    .toEqual(formInstance.getWidgetBy('id', appFilds.multiline_id).value || '');
                expect(taskPage.usingFormFields().getFieldLabel(appFilds.multiline_id))
                    .toEqual(formInstance.getWidgetBy('id', appFilds.multiline_id).name);
            });

    });

    it('Check number, amount widgets - label, value and displayed', () => {

        expect(taskPage.usingFormFields().getFieldValue(appFilds.number_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.number_id).value || '');
        expect(taskPage.usingFormFields().getFieldLabel(appFilds.number_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.number_id).name);

        expect(taskPage.usingFormFields().getFieldValue(appFilds.amount_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.amount_id).value || '');
        expect(taskPage.usingFormFields().getFieldLabel(appFilds.amount_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.amount_id).name);
    });

    it('Check attachfolder, attachfile widgets - label and displayed', () => {

        expect(taskPage.usingFormFields().getFieldLabel(appFilds.attachfolder_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.attachfolder_id).name);
        expect(taskPage.usingFormFields().getFieldLabel(appFilds.attachfile_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.attachfile_id).name);
    });

    it('Check date, date & time widgets - label, value and displayed', () => {

        expect(taskPage.usingFormFields().getFieldLabel(appFilds.date_id))
            .toContain(formInstance.getWidgetBy('id', appFilds.date_id).name);
        expect(taskPage.usingFormFields().getFieldValue(appFilds.date_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.date_id).value || '');

        expect(taskPage.usingFormFields().getFieldLabel(appFilds.dateTime_id))
            .toContain(formInstance.getWidgetBy('id', appFilds.dateTime_id).name);
        expect(taskPage.usingFormFields().getFieldValue(appFilds.dateTime_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.dateTime_id).value || '');
    });

    it('Check people, group widgets - label, value and displayed', () => {

        expect(taskPage.usingFormFields().getFieldValue(appFilds.people_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.people_id).value || '');
        expect(taskPage.usingFormFields().getFieldLabel(appFilds.people_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.people_id).name);

        expect(taskPage.usingFormFields().getFieldValue(appFilds.group_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.group_id).value || '');
        expect(taskPage.usingFormFields().getFieldLabel(appFilds.group_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.group_id).name);
    });

    it('Check displayText, displayValue widgets - value and displayed', () => {

        expect(usingWidget.usingDisplayTextWidget().getFieldLabel(appFilds.displaytext_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.displaytext_id).value);
        expect(usingWidget.usingDisplayValueWidget().getFieldLabel(appFilds.displayvalue_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.displayvalue_id).value || 'Unknown type: readonly');
    });

    it('Check typeahead, header widgets - label, value and displayed', () => {

        expect(usingWidget.usingHeaderWidget().getFieldLabel(appFilds.header_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.header_id).name);

        expect(taskPage.usingFormFields().getFieldValue(appFilds.typeahead_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.typeahead_id).value || '');
        expect(taskPage.usingFormFields().getFieldLabel(appFilds.typeahead_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.typeahead_id).name);
    });

    it('Check checkbox, radiobuttons widgets - label, value and displayed', () => {
        let radioOption = 1;

        expect(taskPage.usingFormFields().getFieldLabel(appFilds.checkbox_id))
            .toContain(formInstance.getWidgetBy('id', appFilds.checkbox_id).name);

        expect(taskPage.usingFormFields().getFieldLabel(appFilds.radiobuttons_id))
            .toContain(formInstance.getWidgetBy('id', appFilds.radiobuttons_id).name);
        expect(usingWidget.usingRadioWidget().getSpecificOptionLabel(appFilds.radiobuttons_id, radioOption))
            .toContain(formInstance.getWidgetBy('id', appFilds.radiobuttons_id).options[radioOption - 1].name);
    });

    it('Check hyperlink, dropdown, dynamictable widgets - label, value and displayed', () => {

        expect(usingWidget.usingHyperlink().getFieldText(appFilds.hyperlink_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.hyperlink_id).hyperlinkUrl || '');
        expect(taskPage.usingFormFields().getFieldLabel(appFilds.hyperlink_id))
            .toEqual(formInstance.getWidgetBy('id', appFilds.hyperlink_id).name);

        expect(taskPage.usingFormFields().getFieldLabel(appFilds.dropdown_id))
            .toContain(formInstance.getWidgetBy('id', appFilds.dropdown_id).name);
        expect(usingWidget.usingDropdown().getSelectedOptionText(appFilds.dropdown_id))
            .toContain(formInstance.getWidgetBy('id', appFilds.dropdown_id).value);

        expect(usingWidget.usingDynamicTable().getFieldLabel(appFilds.dynamictable_id))
            .toContain(formInstance.getWidgetBy('id', appFilds.dynamictable_id).name);
        expect(usingWidget.usingDynamicTable().getColumnName(appFilds.dynamictable_id))
            .toContain(formInstance.getWidgetBy('id', appFilds.dynamictable_id).columnDefinitions[0].name);
    });

});
