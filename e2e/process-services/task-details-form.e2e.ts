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

import { browser } from 'protractor';
import { StringUtil } from '@alfresco/adf-testing';
import CONSTANTS = require('../util/constants');

import { LoginPage } from '@alfresco/adf-testing';

import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksListPage } from '../pages/adf/process-services/tasksListPage';
import { TaskDetailsPage } from '../pages/adf/process-services/taskDetailsPage';
import { FiltersPage } from '../pages/adf/process-services/filtersPage';

import { StandaloneTask } from '../models/APS/standaloneTask';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';

describe('Task Details - Form', () => {
    const loginPage = new LoginPage();
    const tasksListPage = new TasksListPage();
    const taskDetailsPage = new TaskDetailsPage();
    const filtersPage = new FiltersPage();
    let task, otherTask, user, newForm, attachedForm, otherAttachedForm;

    beforeAll(async () => {
        const users = new UsersActions();
        const attachedFormModel = {
            'name': StringUtil.generateRandomString(),
            'description': '',
            'modelType': 2,
            'stencilSet': 0
        };
        const otherTaskModel = new StandaloneTask();
        const otherAttachedFormModel = {
            'name': StringUtil.generateRandomString(),
            'description': '',
            'modelType': 2,
            'stencilSet': 0
        };
        const newFormModel = {
            'name': StringUtil.generateRandomString(),
            'description': '',
            'modelType': 2,
            'stencilSet': 0
        };

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        attachedForm = await this.alfrescoJsApi.activiti.modelsApi.createModel(attachedFormModel);

        newForm = await this.alfrescoJsApi.activiti.modelsApi.createModel(newFormModel);

        const otherEmptyTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask(otherTaskModel);

        otherAttachedForm = await this.alfrescoJsApi.activiti.modelsApi.createModel(otherAttachedFormModel);

        await this.alfrescoJsApi.activiti.taskApi.attachForm(otherEmptyTask.id, { 'formId': otherAttachedForm.id });

        otherTask = await this.alfrescoJsApi.activiti.taskApi.getTask(otherEmptyTask.id);

        await loginPage.loginToProcessServicesUsingUserModel(user);

    });

    beforeEach(async () => {
        const taskModel = new StandaloneTask();

        const emptyTask = await this.alfrescoJsApi.activiti.taskApi.createNewTask(taskModel);

        await this.alfrescoJsApi.activiti.taskApi.attachForm(emptyTask.id, { 'formId': attachedForm.id });

        task = await this.alfrescoJsApi.activiti.taskApi.getTask(emptyTask.id);

        await (await new NavigationBarPage().navigateToProcessServicesPage()).goToTaskApp();
        await tasksListPage.checkTaskListIsLoaded();
        await filtersPage.goToFilter('Involved Tasks');
        await tasksListPage.checkTaskListIsLoaded();

    });

    it('[C280018] Should be able to change the form in a task', async () => {
        await tasksListPage.selectRow(task.name);
        await taskDetailsPage.clickForm();

        await taskDetailsPage.checkAttachFormDropdownIsDisplayed();
        await taskDetailsPage.checkAttachFormButtonIsDisabled();

        await taskDetailsPage.clickAttachFormDropdown();

        await taskDetailsPage.selectAttachFormOption(newForm.name);
        await taskDetailsPage.checkSelectedForm(newForm.name);
        await taskDetailsPage.checkAttachFormButtonIsEnabled();

        await taskDetailsPage.checkCancelAttachFormIsDisplayed();
        await taskDetailsPage.clickCancelAttachForm();

        await taskDetailsPage.checkFormIsAttached(attachedForm.name);

        await taskDetailsPage.clickForm();

        await taskDetailsPage.checkAttachFormDropdownIsDisplayed();
        await taskDetailsPage.clickAttachFormDropdown();

        await taskDetailsPage.selectAttachFormOption(newForm.name);

        await taskDetailsPage.checkAttachFormButtonIsDisplayed();
        await taskDetailsPage.clickAttachFormButton();

        await taskDetailsPage.checkFormIsAttached(newForm.name);
    });

    it('[C280019] Should be able to remove the form form a task', async () => {
        await tasksListPage.selectRow(task.name);
        await taskDetailsPage.clickForm();

        await taskDetailsPage.checkRemoveAttachFormIsDisplayed();
        await taskDetailsPage.clickRemoveAttachForm();

        await taskDetailsPage.checkFormIsAttached('No form');

        await expect(await taskDetailsPage.getFormName()).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
    });

    it('[C280557] Should display task details when selecting another task while the Attach Form dialog is displayed', async () => {
        await tasksListPage.selectRow(task.name);
        await taskDetailsPage.clickForm();

        await taskDetailsPage.checkRemoveAttachFormIsDisplayed();

        await tasksListPage.selectRow(otherTask.name);
        await taskDetailsPage.checkFormIsAttached(otherAttachedForm.name);
    });
});
