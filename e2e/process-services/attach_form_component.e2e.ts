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
import { AttachFormPage } from '../pages/adf/process_services/attachFormPage';
import FormFields = require('../pages/adf/process_services/formFields');

import CONSTANTS = require('../util/constants');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';

describe('Attach Form Component', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let taskPage = new TasksPage();
    let attachFormPage = new AttachFormPage();
    let formFields = new FormFields();

    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let formTextField = app.form_fields.form_fieldId;
    let user, tenantId, appId;

    let testNames = {
        taskName: 'Test Task',
        formTitle: 'Select Form To Attach',
        formName: 'Simple form',
        widgetTitle: 'textfield',
        formFieldValue: 'Test value'
    };

    beforeAll(async(done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        done();
    });

    beforeEach(async(done) => {

        let users = new UsersActions();
        let appsActions = new AppsActions();

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        let appModel = await appsActions.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        appId = appModel.id;

        await this.alfrescoJsApi.activiti.taskApi.createNewTask({name: testNames.taskName});

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    afterEach(async(done) => {

        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

        done();
    });

    it('[C280047] Should be able to view the attach-form component after creating a standalone task', () => {

        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList(testNames.taskName);

        attachFormPage.checkNoFormMessageIsDisplayed();
        attachFormPage.checkAttachFormButtonIsDisplayed();
        attachFormPage.checkCompleteButtonIsDisplayed();
    });

    it('[C280048] Should be able to view the attach-form component after clicking cancel button', () => {

        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList(testNames.taskName);

        attachFormPage.clickAttachFormButton();
        attachFormPage.checkDefaultFormTitleIsDisplayed(testNames.formTitle);
        attachFormPage.checkFormDropdownIsDisplayed();
        attachFormPage.checkCancelButtonIsDisplayed();
        attachFormPage.checkAttachFormButtonIsDisabled();
        attachFormPage.clickAttachFormDropdown();
        attachFormPage.selectAttachFormOption(testNames.formName);

        formFields.checkWidgetIsReadOnlyMode(testNames.widgetTitle);

        attachFormPage.clickCancelButton();
        attachFormPage.checkAttachFormButtonIsDisplayed();
    });

    it('[C280017] Should be able to attach a form on a standalone task and complete', () => {

        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList(testNames.taskName);

        attachFormPage.clickAttachFormButton();
        attachFormPage.clickAttachFormDropdown();
        attachFormPage.selectAttachFormOption(testNames.formName);
        attachFormPage.clickAttachFormButton();

        formFields.setFieldValue(by.id, formTextField, testNames.formFieldValue);
        formFields.completeForm();

        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.COMPL_TASKS);
        taskPage.usingTasksListPage().selectTaskFromTasksList(testNames.taskName);

        expect(formFields.getFieldValue(formTextField)).toEqual(testNames.formFieldValue);
    });
});
