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

import { LoginSSOPage, Widget, AppListCloudPage, IdentityService, GroupIdentityService, ApiService, StringUtil, StartTasksCloudPage, TaskFormCloudComponent } from '@alfresco/adf-testing';
import { browser, by } from 'protractor';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { FormCloudDemoPage } from '../../pages/adf/demo-shell/process-services-cloud/cloudFormDemoPage';
import { checkboxVisibilityFormJson, multipleCheckboxVisibilityFormJson } from '../../resources/forms/checkbox-visibility-condition';
import { multipleVisibilityFormJson } from '../../resources/forms/multiple-visibility-conditions';
import { TasksCloudDemoPage } from '../../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import resources = require('../../util/resources');
import { StartProcessPage } from '../../pages/adf/process-services/startProcessPage';
import { ProcessCloudDemoPage } from '../../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { ProcessDetailsCloudDemoPage } from '../../pages/adf/demo-shell/process-services-cloud/processDetailsCloudDemoPage';

describe('Visibility conditions - cloud', () => {

    const loginSSOPage = new LoginSSOPage();

    const navigationBarPage = new NavigationBarPage();
    const formCloudDemoPage = new FormCloudDemoPage();
    const widget = new Widget();

    let visibleCheckbox;

    const widgets = {
        textOneId: 'textOne',
        textTwoId: 'textTwo',
        textThreeId: 'textThree',
        checkboxBasicVariable: 'CheckboxBasicVariableField',
        checkboxBasicField: 'CheckboxBasicFieldValue'
    };

    const value = {
        displayCheckbox: 'showCheckbox',
        notDisplayCheckbox: 'anythingElse'
    };

    const checkbox = {
        checkboxFieldValue: 'CheckboxFieldValue',
        checkboxVariableField: 'CheckboxVariableField',
        checkboxFieldVariable: 'CheckboxFieldVariable',
        checkboxFieldField: 'CheckboxFieldField',
        checkboxVariableValue: 'CheckboxVariableValue',
        checkboxVariableVariable: 'CheckboxVariableVariable',
        checkbox1: 'Checkbox1'
    };

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);

        await navigationBarPage.navigateToFormCloudPage();

        await formCloudDemoPage.setConfigToEditor(checkboxVisibilityFormJson);
    });

    it('[C309647] Should be able to see Checkbox widget when visibility condition refers to another field with specific value', async () => {

        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldValue);
        await widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldValue);

        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldValue);
    });

    it('[C309648] Should be able to see Checkbox widget when visibility condition refers to a form variable and a field', async () => {

        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableField);

        await widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableField);

        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableField);
    });

    it('[C309649] Should be able to see Checkbox widget when visibility condition refers to a field and a form variable', async () => {

        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldVariable);

        await widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldVariable);

        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldVariable);
    });

    it('[C311425] Should be able to see Checkbox widget when visibility condition refers to a field and another field', async () => {

        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.textWidget().isWidgetVisible(widgets.textTwoId);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldField);

        await widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldField);

        await widget.textWidget().setValue(widgets.textTwoId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldField);

        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldField);
    });

    it('[C311424] Should be able to see Checkbox widget when visibility condition refers to a variable with specific value', async () => {
        await formCloudDemoPage.setConfigToEditor(checkboxVisibilityFormJson);

        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableValue);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[0].value = value.notDisplayCheckbox;
        await formCloudDemoPage.setConfigToEditor(visibleCheckbox);

        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableValue);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[0].value = value.displayCheckbox;
        await formCloudDemoPage.setConfigToEditor(visibleCheckbox);
    });

    it('[C311426] Should be able to see Checkbox widget when visibility condition refers to form variable and another form variable', async () => {
        await formCloudDemoPage.setConfigToEditor(checkboxVisibilityFormJson);

        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableVariable);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[0].value = value.notDisplayCheckbox;
        await formCloudDemoPage.setConfigToEditor(visibleCheckbox);

        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableVariable);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[1].value = value.notDisplayCheckbox;
        await formCloudDemoPage.setConfigToEditor(visibleCheckbox);

        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableVariable);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[0].value = value.displayCheckbox;
        visibleCheckbox.formRepresentation.formDefinition.variables[1].value = value.displayCheckbox;
        await formCloudDemoPage.setConfigToEditor(visibleCheckbox);
    });

    it('[C312400] Should be able to see Checkbox widget when has visibility condition related to checkbox', async () => {
        await formCloudDemoPage.setConfigToEditor(multipleCheckboxVisibilityFormJson);

        await widget.checkboxWidget().clickCheckboxInput('Checkbox2');
        await widget.checkboxWidget().clickCheckboxInput('Checkbox3');
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkbox1);

        await widget.checkboxWidget().clickCheckboxInput('Checkbox2');
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkbox1);

        await widget.checkboxWidget().clickCheckboxInput('Checkbox2');
        await widget.checkboxWidget().clickCheckboxInput('Checkbox3');
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkbox1);

        await widget.checkboxWidget().clickCheckboxInput('Checkbox2');
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkbox1);

    });

    it('[C309650] Should be able to see Checkbox widget when has multiple visibility conditions and next condition operators', async () => {
        let text1, text2;

        await formCloudDemoPage.setConfigToEditor(multipleVisibilityFormJson);
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        text1 = await widget.textWidget().getFieldValue(widgets.textOneId);
        text2 = await widget.textWidget().getFieldValue(widgets.textTwoId);

        await expect(text1).toEqual('');
        await expect(text2).toEqual('');

        await widget.textWidget().setValue(widgets.textOneId, 'aaa');
        text1 = await widget.textWidget().getFieldValue(widgets.textOneId);
        text2 = await widget.textWidget().getFieldValue(widgets.textTwoId);

        await expect(text1).toEqual('aaa');
        await expect(text2).toEqual('');
        await widget.textWidget().isWidgetVisible(widgets.checkboxBasicVariable);

        await widget.textWidget().setValue(widgets.textOneId, 'bbb');
        text1 = await widget.textWidget().getFieldValue(widgets.textOneId);
        text2 = await widget.textWidget().getFieldValue(widgets.textTwoId);

        await expect(text1).toEqual('bbb');
        await expect(text2).toEqual('');
        await widget.textWidget().isWidgetVisible(widgets.checkboxBasicField);

        await widget.textWidget().setValue(widgets.textTwoId, 'aaa');
        text1 = await widget.textWidget().getFieldValue(widgets.textOneId);
        text2 = await widget.textWidget().getFieldValue(widgets.textTwoId);

        await expect(text1).toEqual('bbb');
        await expect(text2).toEqual('aaa');
        await widget.textWidget().isWidgetNotVisible(widgets.checkboxBasicField);

        await widget.textWidget().setValue(widgets.textOneId, 'aaa');
        text1 = await widget.textWidget().getFieldValue(widgets.textOneId);
        text2 = await widget.textWidget().getFieldValue(widgets.textTwoId);

        await expect(text1).toEqual('aaa');
        await expect(text2).toEqual('aaa');
        await widget.textWidget().isWidgetNotVisible(widgets.checkboxBasicField);
    });

    it('[C312443] Should be able to see Checkbox widget when has multiple visibility conditions and OR NOT next condition operators', async () => {
        await formCloudDemoPage.setConfigToEditor(multipleVisibilityFormJson);

        await widget.textWidget().setValue(widgets.textTwoId, 'test');
        await widget.textWidget().setValue(widgets.textThreeId, 'test');
        await widget.textWidget().isWidgetNotVisible(widgets.textOneId);

        await widget.textWidget().setValue(widgets.textTwoId, 'test');
        await widget.textWidget().setValue(widgets.textThreeId, 'something');
        await widget.textWidget().isWidgetVisible(widgets.textOneId);

        await widget.textWidget().setValue(widgets.textTwoId, 'something');
        await widget.textWidget().setValue(widgets.textThreeId, 'test');
        await widget.textWidget().isWidgetVisible(widgets.textOneId);

        await widget.textWidget().setValue(widgets.textTwoId, 'something');
        await widget.textWidget().setValue(widgets.textThreeId, 'something');
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
    });
});

describe('Task cloud visibility', async () => {

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const startTask = new StartTasksCloudPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const startProcessPage = new StartProcessPage();
    const processCloudDemoPage = new ProcessCloudDemoPage();
    const processDetailsCloudDemoPage = new ProcessDetailsCloudDemoPage();

    const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
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
        await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
    });

    it('[C315170] Should be able to complete a task with a form with required number widgets', async () => {
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.addName(standaloneTaskName);
        await startTask.selectFormDefinition('requirednumbervisibility');
        await startTask.clickStartButton();
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

    it('[C315169] Should be able to start a process with visibility condition for number widgets', async () => {

        await processCloudDemoPage.openNewProcessForm();
        await startProcessPage.clearField(startProcessPage.processNameInput);
        await startProcessPage.selectFromProcessDropdown('numbervisibilityprocess');
        await startProcessPage.enterProcessName(processName);
        await startProcessPage.clickStartProcessButton();

        await processDetailsCloudDemoPage.selectProcessTaskByName(processName);
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
        await startProcessPage.selectFromProcessDropdown('booleanvisibilityprocess');
        await startProcessPage.enterProcessName(processName);
        await startProcessPage.clickStartProcessButton();

        await processDetailsCloudDemoPage.selectProcessTaskByName(processName);
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
        await startTask.selectFormDefinition('booleanvisibility');
        await startTask.clickStartButton();
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
