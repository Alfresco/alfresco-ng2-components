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

import {
    LoginSSOPage,
    AppListCloudPage,
    IdentityService,
    GroupIdentityService,
    ApiService,
    StringUtil,
    StartTasksCloudPage,
    TaskFormCloudComponent,
    StartProcessCloudPage
} from '@alfresco/adf-testing';
import { browser, by } from 'protractor';

import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { TasksCloudDemoPage } from '../../pages/adf/demo-shell/process-services/tasks-cloud-demo.page';
import { ProcessCloudDemoPage } from '../../pages/adf/demo-shell/process-services/process-cloud-demo.page';

describe('Task cloud visibility', async () => {

    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const startTask = new StartTasksCloudPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const startProcessPage = new StartProcessCloudPage();
    const processCloudDemoPage = new ProcessCloudDemoPage();
    const loginSSOPage = new LoginSSOPage();

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const standaloneTaskName = StringUtil.generateRandomString(5);
    const processName = StringUtil.generateRandomString(5);
    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;
    let testUser, groupInfo;
    const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, 'BPM');

    beforeAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
    });

    afterAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
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
        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(standaloneTaskName);

        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Number1');
        await taskFormCloudComponent.formFields().checkWidgetIsHidden('Number2');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonDisabled()).toBeTruthy();

        await taskFormCloudComponent.formFields().setFieldValue(by.id, 'Number1', 5);
        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Number2');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonDisabled()).toBeFalsy();

        await taskFormCloudComponent.formFields().setFieldValue(by.id, 'Number1', 123);
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        await taskFormCloudComponent.formFields().checkWidgetIsHidden('Number2');
    });

    it('[C315169] Should be able to start a process with visibility condition for number widgets ', async () => {
        await processCloudDemoPage.openNewProcessForm();
        await startProcessPage.clearField(startProcessPage.processNameInput);
        await startProcessPage.selectFromProcessDropdown(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.numbervisibilityprocess);

        await startProcessPage.enterProcessName(processName);
        await startProcessPage.checkStartProcessButtonIsEnabled();
        await startProcessPage.clickStartProcessButton();

        await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ processName });
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().selectRow(processName);
        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        await tasksCloudDemoPage.taskListCloudComponent().selectRow('number_visibility_task');
        await taskFormCloudComponent.clickClaimButton();

        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Number1');
        await taskFormCloudComponent.formFields().checkWidgetIsHidden('Number2');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonDisabled()).toBeTruthy();

        await taskFormCloudComponent.formFields().setFieldValue(by.id, 'Number1', 5);
        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Number2');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonDisabled()).toBeFalsy();

        await taskFormCloudComponent.formFields().setFieldValue(by.id, 'Number1', 123);
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonDisabled()).toBeTruthy();
        await taskFormCloudComponent.formFields().checkWidgetIsHidden('Number2');

        await taskFormCloudComponent.formFields().setFieldValue(by.id, 'Number1', 4);
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonDisabled()).toBeFalsy();
        await taskFormCloudComponent.clickCompleteButton();
    });

    it('[C315232] Should be able to complete a process with visibility condition for boolean widgets', async () => {
        await processCloudDemoPage.openNewProcessForm();
        await startProcessPage.clearField(startProcessPage.processNameInput);
        await startProcessPage.selectFromProcessDropdown(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.booleanvisibilityprocess);
        await startProcessPage.enterProcessName(processName);
        await browser.sleep(400);
        await startProcessPage.clickStartProcessButton();

        await processCloudDemoPage.editProcessFilterCloudComponent().setFilter({ processName });
        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await processCloudDemoPage.processListCloudComponent().selectRow(processName);
        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        await tasksCloudDemoPage.taskListCloudComponent().selectRow('boolean_visibility_task');
        await taskFormCloudComponent.clickClaimButton();

        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Checkbox2');
        await taskFormCloudComponent.formFields().checkWidgetIsHidden('Checkbox3');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonDisabled()).toBeTruthy();

        await taskFormCloudComponent.formFields().clickField(by.id, 'Checkbox1');
        await taskFormCloudComponent.formFields().clickField(by.id, 'Checkbox2');
        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Checkbox3');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonDisabled()).toBeFalsy();

        await taskFormCloudComponent.clickCompleteButton();
    });

    it('[C315208] Should be able to complete a task with Checkbox widgets', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.addName(standaloneTaskName);
        await startTask.selectFormDefinition(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.forms.booleanvisibility.name);

        await startTask.clickStartButton();
        await tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitTillContentLoaded();
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(standaloneTaskName);

        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Checkbox2');
        await taskFormCloudComponent.formFields().checkWidgetIsHidden('Checkbox3');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonDisabled()).toBeTruthy();

        await taskFormCloudComponent.formFields().clickField(by.id, 'Checkbox1');
        await taskFormCloudComponent.formFields().clickField(by.id, 'Checkbox2');
        await taskFormCloudComponent.formFields().checkWidgetIsVisible('Checkbox3');
        await expect(await taskFormCloudComponent.formFields().isCompleteFormButtonDisabled()).toBeFalsy();

        await taskFormCloudComponent.clickCompleteButton();
    });
});
