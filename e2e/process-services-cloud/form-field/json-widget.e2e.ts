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
    AppListCloudPage,
    GroupIdentityService,
    IdentityService,
    EditJsonDialog,
    FormCloudService,
    LoginPage,
    ProcessCloudWidgetPage,
    StringUtil,
    TaskFormCloudComponent,
    TaskHeaderCloudPage,
    TasksService
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { TasksCloudDemoPage } from '.././pages/tasks-cloud-demo.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Form Field Component - JSON Widget', () => {

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskList = tasksCloudDemoPage.taskListCloudComponent();

    const taskFormCloudComponent = new TaskFormCloudComponent();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const editJsonDialog = new EditJsonDialog();
    const widget = new ProcessCloudWidgetPage();

    const apiService = createApiService();
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);
    const tasksService = new TasksService(apiService);
    const formCloudService = new FormCloudService(apiService);

    const jsonWidget = widget.json();

    let testUser;
    let groupInfo;
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const taskName = StringUtil.generateRandomString();
    const formWithJson = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.forms.formWithJsonWidget;

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);

        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await apiService.login(testUser.username, testUser.password);

        const formId = await formCloudService.getIdByFormName(simpleApp, formWithJson.name);

        await tasksService.createStandaloneTaskWithForm(taskName, simpleApp, formId, { assignee: testUser.username });

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
        await taskList.getDataTable().waitForTableBody();
    });

    it('[C593999] View json field in standalone task ', async () => {
        await taskList.checkContentIsDisplayedByName(taskName);
        await taskList.selectRow(taskName);

        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
        await taskFormCloudComponent.formFields().checkFormIsDisplayed();

        await jsonWidget.checkWidgetIsVisible(formWithJson.widgets.displayJsonWidgetId);
        await jsonWidget.clickJsonButton(formWithJson.widgets.displayJsonWidgetId);

        await editJsonDialog.checkDialogIsDisplayed();
        await expect(await editJsonDialog.getDialogContent()).toBe('{}');
        await editJsonDialog.clickCloseButton();
        await editJsonDialog.checkDialogIsNotDisplayed();
    });
});
