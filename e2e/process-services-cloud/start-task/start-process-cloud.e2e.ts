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

import { createApiService, AppListCloudPage, BrowserActions, GroupIdentityService, IdentityService, LoginPage, StartProcessCloudPage, StringUtil } from '@alfresco/adf-testing';
import { browser, protractor } from 'protractor';
import { ProcessCloudDemoPage } from './../pages/process-cloud-demo.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import CONSTANTS = require('../../util/constants');

describe('Start Process', () => {

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();

    const processCloudDemoPage = new ProcessCloudDemoPage();
    const editProcessFilter = processCloudDemoPage.editProcessFilterCloudComponent();
    const processFilter = processCloudDemoPage.processFilterCloudComponent;
    const processList = processCloudDemoPage.processListCloudComponent();

    const startProcessPage = new StartProcessCloudPage();

    const apiService = createApiService();
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);

    const processName = StringUtil.generateRandomString(10);
    const processName255Characters = StringUtil.generateRandomString(255);
    const processNameBiggerThen255Characters = StringUtil.generateRandomString(256);
    const lengthValidationError = 'Length exceeded, 255 characters max.';
    const requiredError = 'Process Name is required';
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    let testUser; let groupInfo;

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await loginSSOPage.login(testUser.username, testUser.password);

        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
   });

    afterAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(testUser.idIdentityService);
   });

    afterEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
    });

    it('[C291857] Should be possible to cancel a process', async () => {
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);
        await processCloudDemoPage.openNewProcessForm();
        await startProcessPage.clearField(startProcessPage.processNameInput);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();

        await startProcessPage.checkValidationErrorIsDisplayed(requiredError);
        await expect(await startProcessPage.isStartProcessButtonDisabled()).toEqual(true);

        await BrowserActions.closeMenuAndDialogs();
        await startProcessPage.clickCancelProcessButton();
    });

    it('[C291842] Should be displayed an error message if process name exceed 255 characters', async () => {
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);
        await processCloudDemoPage.openNewProcessForm();
        await startProcessPage.selectFirstOptionFromProcessDropdown();

        await startProcessPage.enterProcessName(processName255Characters);
        await expect(await startProcessPage.isStartProcessButtonEnabled()).toEqual(true);

        await startProcessPage.enterProcessName(processNameBiggerThen255Characters);
        await startProcessPage.checkValidationErrorIsDisplayed(lengthValidationError);
        await expect(await startProcessPage.isStartProcessButtonDisabled()).toEqual(true);
    });

    it('[C291860] Should be able to start a process', async () => {
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);
        await processCloudDemoPage.openNewProcessForm();
        await startProcessPage.selectFirstOptionFromProcessDropdown();

        await startProcessPage.clearField(startProcessPage.processNameInput);
        await startProcessPage.enterProcessName(processName);
        await expect(await startProcessPage.isStartProcessButtonEnabled()).toEqual(true);
        await startProcessPage.clickStartProcessButton();
        await processFilter.clickOnProcessFilters();

        await processFilter.clickRunningProcessesFilter();
        await editProcessFilter.openFilter();
        await editProcessFilter.setProcessName(processName);
        await expect(await processFilter.getActiveFilterName()).toBe(CONSTANTS.PROCESS_FILTERS.RUNNING);
        await processList.checkContentIsDisplayedByName(processName);
   });
});
