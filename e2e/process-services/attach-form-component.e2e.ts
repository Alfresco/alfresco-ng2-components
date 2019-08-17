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

import { LoginPage, FormFields } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import { AttachFormPage } from '../pages/adf/process-services/attachFormPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import CONSTANTS = require('../util/constants');

import { browser } from 'protractor';
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';
import { by } from 'protractor';

describe('Attach Form Component', () => {

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const attachFormPage = new AttachFormPage();
    const formFields = new FormFields();
    const navigationBarPage = new NavigationBarPage();

    const app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const formTextField = app.form_fields.form_fieldId;
    let user, tenantId, appId;

    const testNames = {
        taskName: 'Test Task',
        formTitle: 'Select Form To Attach',
        formName: 'Simple form',
        widgetTitle: 'textfield',
        formFieldValue: 'Test value'
    };

    beforeAll(async () => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        const users = new UsersActions();
        const appsActions = new AppsActions();

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        const appModel = await appsActions.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        appId = appModel.id;

        await this.alfrescoJsApi.activiti.taskApi.createNewTask({ name: testNames.taskName });

        await loginPage.loginToProcessServicesUsingUserModel(user);

    });

    afterAll(async () => {
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

    });

    it('[C280047] Should be able to view the attach-form component after creating a standalone task', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().selectRow(testNames.taskName);

        await attachFormPage.checkNoFormMessageIsDisplayed();
        await attachFormPage.checkAttachFormButtonIsDisplayed();
        await attachFormPage.checkCompleteButtonIsDisplayed();
    });

    it('[C280048] Should be able to view the attach-form component after clicking cancel button', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().selectRow(testNames.taskName);

        await attachFormPage.clickAttachFormButton();
        await attachFormPage.checkDefaultFormTitleIsDisplayed(testNames.formTitle);
        await attachFormPage.checkFormDropdownIsDisplayed();
        await attachFormPage.checkCancelButtonIsDisplayed();
        await attachFormPage.checkAttachFormButtonIsDisabled();
        await attachFormPage.clickAttachFormDropdown();
        await attachFormPage.selectAttachFormOption(testNames.formName);

        await formFields.checkWidgetIsReadOnlyMode(testNames.widgetTitle);

        await attachFormPage.clickCancelButton();
        await attachFormPage.checkAttachFormButtonIsDisplayed();
    });

    it('[C280017] Should be able to attach a form on a standalone task and complete', async () => {
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().selectRow(testNames.taskName);

        await attachFormPage.clickAttachFormButton();
        await attachFormPage.clickAttachFormDropdown();
        await attachFormPage.selectAttachFormOption(testNames.formName);
        await attachFormPage.clickAttachFormButton();

        await formFields.setFieldValue(by.id, formTextField, testNames.formFieldValue);
        await formFields.completeForm();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().selectRow(testNames.taskName);

        await expect(await formFields.getFieldValue(formTextField)).toEqual(testNames.formFieldValue);
    });
});
