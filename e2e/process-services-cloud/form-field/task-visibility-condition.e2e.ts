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

import {
    LoginPage,
    AppListCloudPage,
    IdentityService,
    GroupIdentityService, createApiService,
    StringUtil,
    StartTasksCloudPage,
    TaskFormCloudComponent,
    StartProcessCloudPage, ProcessCloudWidgetPage
} from '@alfresco/adf-testing';
import { browser } from 'protractor';

import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { TasksCloudDemoPage } from '.././pages/tasks-cloud-demo.page';
import { ProcessCloudDemoPage } from '.././pages/process-cloud-demo.page';

describe('Task cloud visibility', async () => {

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskList = tasksCloudDemoPage.taskListCloudComponent();

    const startTask = new StartTasksCloudPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const startProcessPage = new StartProcessCloudPage();

    const processCloudDemoPage = new ProcessCloudDemoPage();
    const editProcessFilter = processCloudDemoPage.editProcessFilterCloudComponent();
    const processList = processCloudDemoPage.processListCloudComponent();

    const loginSSOPage = new LoginPage();
    const widget = new ProcessCloudWidgetPage();

    const apiService = createApiService();
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);

    const standaloneTaskName = StringUtil.generateRandomString(5);
    const processName = StringUtil.generateRandomString(5);

    let testUser; let groupInfo;

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await loginSSOPage.login(testUser.username, testUser.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(simpleApp);
    });

    it('[C315170] Should be able to complete a task with a form with required number widgets', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.addName(standaloneTaskName);
        await startTask.selectFormDefinition(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.forms.requirednumbervisibility.name);

        await startTask.clickStartButton();
        await taskList.getDataTable().waitTillContentLoaded();
        await taskList.selectRow(standaloneTaskName);

        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Number1');
        await taskFormCloudComponent.formFields().checkWidgetIsHidden('Number2');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonEnabled()).toEqual(false);

        await taskFormCloudComponent.formFields().setFieldValue('Number1', '5');
        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Number2');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonEnabled()).toEqual(true);

        await taskFormCloudComponent.formFields().setFieldValue('Number1', '123');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await taskFormCloudComponent.formFields().checkWidgetIsHidden('Number2');
    });

    it('[C315232] Should be able to complete a process with visibility condition for boolean widgets', async () => {
        await processCloudDemoPage.openNewProcessForm();
        await startProcessPage.clearField(startProcessPage.processNameInput);
        await startProcessPage.selectFromProcessDropdown(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.booleanvisibilityprocess);
        await startProcessPage.enterProcessName(processName);
        await browser.sleep(400);
        await startProcessPage.clickStartProcessButton();

        await editProcessFilter.setFilter({ processName });
        await processList.getDataTable().waitTillContentLoaded();
        await processList.selectRow(processName);
        await taskList.getDataTable().waitTillContentLoaded();
        await taskList.selectRow('boolean_visibility_task');
        await taskFormCloudComponent.clickClaimButton();

        await browser.sleep(400);

        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Checkbox2');
        await taskFormCloudComponent.formFields().checkWidgetIsHidden('Checkbox3');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonEnabled()).toEqual(false);

        await widget.checkboxWidget().clickCheckboxInput('Checkbox1');
        await widget.checkboxWidget().clickCheckboxInput('Checkbox2');

        await widget.checkboxWidget().isCheckboxDisplayed('Checkbox3');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonEnabled()).toEqual(true);

        await taskFormCloudComponent.clickCompleteButton();
    });

    it('[C315208] Should be able to complete a task with Checkbox widgets', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.addName(standaloneTaskName);
        await startTask.selectFormDefinition(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.forms.booleanvisibility.name);

        await startTask.clickStartButton();
        await taskList.getDataTable().waitTillContentLoaded();
        await taskList.selectRow(standaloneTaskName);

        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Checkbox2');
        await taskFormCloudComponent.formFields().checkWidgetIsHidden('Checkbox3');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonEnabled()).toEqual(false);

        await widget.checkboxWidget().clickCheckboxInput('Checkbox1');
        await widget.checkboxWidget().clickCheckboxInput('Checkbox2');

        await widget.checkboxWidget().isCheckboxDisplayed('Checkbox3');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonEnabled()).toEqual(true);

        await taskFormCloudComponent.clickCompleteButton();
    });
});
