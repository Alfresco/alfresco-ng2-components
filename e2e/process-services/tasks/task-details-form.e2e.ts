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
    LoginPage, ModelsActions,
    ProcessUtil,
    StringUtil, TaskUtil,
    UsersActions,
    Widget,
    FormUtil
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { FiltersPage } from './../pages/filters.page';
import { TaskDetailsPage } from './../pages/task-details.page';
import { TasksListPage } from './../pages/tasks-list.page';
import { TasksPage } from './../pages/tasks.page';
import { AttachFormPage } from './../pages/attach-form.page';
import CONSTANTS = require('../../util/constants');
import { TaskActionsApi, TasksApi } from '@alfresco/js-api';

describe('Task Details - Form', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const tasksListPage = new TasksListPage();
    const taskDetailsPage = new TaskDetailsPage();
    const attachFormPage = new AttachFormPage();
    const taskPage = new TasksPage();
    const filtersPage = new FiltersPage();
    const widget = new Widget();

    const apiService = createApiService();
    const formActions = new FormUtil(apiService);
    const processUtil = new ProcessUtil(apiService);
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const taskUtil = new TaskUtil(apiService);
    const modelsActions = new ModelsActions(apiService);
    const taskActionsApi = new TaskActionsApi(apiService.getInstance());
    const tasksApi = new TasksApi(apiService.getInstance());

    let task; let otherTask; let user; let newForm; let attachedForm; let otherAttachedForm;

    beforeAll(async () => {
        const attachedFormModel = {
            name: StringUtil.generateRandomString(),
            description: '',
            modelType: 2,
            stencilSet: 0
        };
        const otherAttachedFormModel = {
            name: StringUtil.generateRandomString(),
            description: '',
            modelType: 2,
            stencilSet: 0
        };
        const newFormModel = {
            name: StringUtil.generateRandomString(),
            description: '',
            modelType: 2,
            stencilSet: 0
        };

        await apiService.loginWithProfile('admin');
        user = await usersActions.createUser();
        await apiService.login(user.username, user.password);

        attachedForm = await modelsActions.modelsApi.createModel(attachedFormModel);
        newForm = await modelsActions.modelsApi.createModel(newFormModel);

        const otherEmptyTask = await taskUtil.createStandaloneTask();

        otherAttachedForm = await modelsActions.modelsApi.createModel(otherAttachedFormModel);

        await taskActionsApi.attachForm(otherEmptyTask.id, { formId: otherAttachedForm.id });
        otherTask = await tasksApi.getTask(otherEmptyTask.id);

        await loginPage.login(user.username, user.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(user.tenantId);
    });

    beforeEach(async () => {
        const emptyTask = await taskUtil.createStandaloneTask();
        await taskActionsApi.attachForm(emptyTask.id, { formId: attachedForm.id });
        task = await tasksApi.getTask(emptyTask.id);
        await (await new NavigationBarPage().navigateToProcessServicesPage()).goToTaskApp();
        await tasksListPage.checkTaskListIsLoaded();
        await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await tasksListPage.checkTaskListIsLoaded();
    });

    it('[C280018] Should be able to change the form in a task', async () => {
        await tasksListPage.selectRow(task.name);
        await taskDetailsPage.clickForm();

        await attachFormPage.checkFormDropdownIsDisplayed();
        await attachFormPage.checkAttachFormButtonIsDisabled();

        await attachFormPage.selectAttachFormOption(newForm.name);
        await taskDetailsPage.checkSelectedForm(newForm.name);
        await attachFormPage.checkAttachFormButtonIsDisplayed();

        await attachFormPage.checkCancelButtonIsDisplayed();
        await attachFormPage.clickCancelButton();

        await taskDetailsPage.checkFormIsAttached(attachedForm.name);

        await taskDetailsPage.clickForm();

        await attachFormPage.checkFormDropdownIsDisplayed();
        await attachFormPage.checkAttachFormButtonIsDisabled();
        await attachFormPage.selectAttachFormOption(newForm.name);
        await taskDetailsPage.checkSelectedForm(newForm.name);

        await attachFormPage.checkAttachFormButtonIsDisplayed();
        await attachFormPage.clickAttachFormButton();

        await taskDetailsPage.checkFormIsAttached(newForm.name);
    });

    it('[C280019] Should be able to remove the form form a task', async () => {
        await tasksListPage.selectRow(task.name);
        await taskDetailsPage.clickForm();

        await taskDetailsPage.checkRemoveAttachFormIsDisplayed();
        await taskDetailsPage.clickRemoveAttachForm();

        await taskDetailsPage.checkFormIsAttached('No form');

        await taskDetailsPage.waitFormNameEqual(CONSTANTS.TASK_DETAILS.NO_FORM);
    });

    it('[C280557] Should display task details when selecting another task while the Attach Form dialog is displayed', async () => {
        await tasksListPage.selectRow(task.name);
        await taskDetailsPage.clickForm();

        await taskDetailsPage.checkRemoveAttachFormIsDisplayed();

        await tasksListPage.selectRow(otherTask.name);

        await taskDetailsPage.checkFormIsAttached(otherAttachedForm.name);
    });

    describe('Task Details - Complete form with visibility conditions on tabs', () => {
        const widgets = {
            textOneId: 'textone',
            textTwoId: 'texttwo',
            textThreeId: 'textthree',
            textFourId: 'textfour',
            numberOneId: 'numberone'
        };

        const value = {
            displayTab: 'showTab',
            notDisplayTab: 'anythingElse'
        };

        const tab = {
            tabWithFields: 'tabWithFields',
            tabFieldValue: 'tabBasicFieldValue',
            tabFieldField: 'tabBasicFieldField',
            tabFieldVar: 'tabBasicFieldVar'
        };

        let newTask; let appModel;

        beforeAll(async () => {
            appModel = await applicationsService.importPublishDeployApp(app.file_path);
        });

        beforeEach(async () => {
            newTask = await taskUtil.createStandaloneTask();
            const form = await formActions.getFormByName(app.visibilityProcess.formName);
            await taskActionsApi.attachForm(newTask.id, { formId: form.id });

            await browser.refresh();
            await (await new NavigationBarPage().navigateToProcessServicesPage()).goToTaskApp();
            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
        });

        it('[C315190] Should be able to complete a standalone task with visible tab with empty value for field', async () => {
            await tasksListPage.selectRow(newTask.name);

            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().isWidgetNotVisible(widgets.textThreeId);

            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldValue);

            await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
            await taskDetailsPage.clickCompleteFormTask();
            await tasksListPage.checkContentIsNotDisplayed(newTask.name);

            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await tasksListPage.checkContentIsDisplayed(newTask.name);
            await tasksListPage.selectRow(newTask.name);

            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C315191] Should be able to complete a standalone task with invisible tab with empty value for field', async () => {
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().isWidgetNotVisible(widgets.textThreeId);

            await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
            await taskDetailsPage.clickCompleteFormTask();
            await tasksListPage.checkContentIsNotDisplayed(newTask.name);

            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await tasksListPage.checkContentIsDisplayed(newTask.name);
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C315192] Should not be able to complete a standalone task with visible tab with invalid value for field', async () => {
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.textWidget().setValue(widgets.textTwoId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.tab().clickTabByLabel(tab.tabFieldField);
            await widget.textWidget().setValue(widgets.numberOneId, value.displayTab);

            await expect(await taskDetailsPage.isCompleteButtonWithFormEnabled()).toEqual(false);
        });

        it('[C315193] Should be able to complete a standalone task with invisible tab with invalid value for field', async () => {
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.textWidget().setValue(widgets.textTwoId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.tab().clickTabByLabel(tab.tabFieldField);
            await widget.textWidget().setValue(widgets.numberOneId, value.displayTab);

            await widget.tab().clickTabByLabel(tab.tabWithFields);
            await widget.textWidget().setValue(widgets.textOneId, value.notDisplayTab);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldField);

            await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
            await taskDetailsPage.clickCompleteFormTask();
            await tasksListPage.checkContentIsNotDisplayed(newTask.name);

            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await tasksListPage.checkContentIsDisplayed(newTask.name);
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C315194] Should be able to complete a standalone task with invisible tab with valid value', async () => {
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.textWidget().setValue(widgets.textTwoId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.tab().clickTabByLabel(tab.tabFieldField);
            await widget.textWidget().setValue(widgets.numberOneId, '123');

            await widget.tab().clickTabByLabel(tab.tabWithFields);
            await widget.textWidget().setValue(widgets.textOneId, value.notDisplayTab);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldField);

            await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
            await taskDetailsPage.clickCompleteFormTask();
            await tasksListPage.checkContentIsNotDisplayed(newTask.name);

            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await tasksListPage.checkContentIsDisplayed(newTask.name);
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C315195] Should be able to complete a standalone task with visible tab with valid value for field', async () => {
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.textWidget().setValue(widgets.textTwoId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.tab().clickTabByLabel(tab.tabFieldField);
            await widget.textWidget().setValue(widgets.numberOneId, '123');

            await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
            await taskDetailsPage.clickCompleteFormTask();
            await tasksListPage.checkContentIsNotDisplayed(newTask.name);

            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await tasksListPage.checkContentIsDisplayed(newTask.name);
            await tasksListPage.selectRow(newTask.name);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C315197] Should be able to complete a process task with visible tab with empty value for field', async () => {
            await processUtil.startProcessByDefinitionName(appModel.name, app.visibilityProcess.name);

            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await tasksListPage.checkTaskListIsLoaded();

            await tasksListPage.selectRow(app.visibilityProcess.taskName);
            await expect(await taskDetailsPage.getParentName()).toEqual(app.visibilityProcess.name);

            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.textWidget().isWidgetVisible(widgets.textOneId);
            await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
            await widget.textWidget().setValue(widgets.textTwoId, value.displayTab);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

            await widget.tab().clickTabByLabel(tab.tabFieldField);
            await widget.textWidget().setValue(widgets.numberOneId, '123');

            await taskDetailsPage.checkCompleteFormButtonIsDisplayed();
            await taskDetailsPage.clickCompleteFormTask();
            await tasksListPage.checkContentIsNotDisplayed(app.visibilityProcess.taskName);

            await tasksListPage.checkTaskListIsLoaded();
            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await tasksListPage.checkContentIsDisplayed(app.visibilityProcess.taskName);
            await tasksListPage.selectRow(app.visibilityProcess.taskName);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
            await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldValue);
        });

        it('[C212922] Should a User task form be refreshed, saved or completed.', async () => {
            await processUtil.startProcessByDefinitionName(appModel.name, app.processName);

            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await tasksListPage.checkTaskListIsLoaded();

            await tasksListPage.selectRow(app.taskName);
            await expect(await taskDetailsPage.getParentName()).toEqual(app.processName);

            await widget.textWidget().isWidgetVisible(app.form_fields.form_fieldId);
            await widget.textWidget().setValue(app.form_fields.form_fieldId, 'value');

            await taskPage.formFields().refreshForm();

            await widget.textWidget().isWidgetVisible(app.form_fields.form_fieldId);
            await expect(await widget.textWidget().getFieldValue(app.form_fields.form_fieldId)).toEqual('');

            await widget.textWidget().setValue(app.form_fields.form_fieldId, 'value');
            await taskPage.taskDetails().saveTaskForm();

            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await tasksListPage.checkTaskListIsLoaded();

            await filtersPage.goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await tasksListPage.checkTaskListIsLoaded();
            await expect(await widget.textWidget().getFieldValue(app.form_fields.form_fieldId)).toEqual('value');

            await taskDetailsPage.clickCompleteFormTask();
        });
    });
});
