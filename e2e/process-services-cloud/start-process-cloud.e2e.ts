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

import { ApiService, GroupIdentityService, IdentityService, LoginSSOPage } from '@alfresco/adf-testing';
import { AppListCloudPage, StartProcessCloudPage } from '@alfresco/adf-testing';
import { browser, protractor } from 'protractor';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { StringUtil, BrowserActions } from '@alfresco/adf-testing';

describe('Start Process', () => {

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const processCloudDemoPage = new ProcessCloudDemoPage();
    const startProcessPage = new StartProcessCloudPage();
    const apiService = new ApiService(
        browser.params.config.oauth2.clientId,
        browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
    );

    const processName = StringUtil.generateRandomString(10);
    const processName255Characters = StringUtil.generateRandomString(255);
    const processNameBiggerThen255Characters = StringUtil.generateRandomString(256);
    const lengthValidationError = 'Length exceeded, 255 characters max.';
    const requiredError = 'Process Name is required';
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;
    let testUser, groupInfo;

    beforeAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);

        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();

    });

    afterAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
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
        await expect(await startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);

        await BrowserActions.closeMenuAndDialogs();
        await startProcessPage.clickCancelProcessButton();
    });

    it('[C291842] Should be displayed an error message if process name exceed 255 characters', async () => {
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);
        await processCloudDemoPage.openNewProcessForm();
        await startProcessPage.enterProcessName(processName255Characters);
        await expect(await startProcessPage.checkStartProcessButtonIsEnabled()).toBe(true);

        await startProcessPage.enterProcessName(processNameBiggerThen255Characters);
        await startProcessPage.checkValidationErrorIsDisplayed(lengthValidationError);
        await expect(await startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);
    });

    it('[C291860] Should be able to start a process', async () => {
        await appListCloudComponent.checkAppIsDisplayed(simpleApp);
        await appListCloudComponent.goToApp(simpleApp);
        await processCloudDemoPage.openNewProcessForm();
        await startProcessPage.clearField(startProcessPage.processNameInput);
        await startProcessPage.enterProcessName(processName);
        await expect(await startProcessPage.checkStartProcessButtonIsEnabled()).toBe(true);
        await startProcessPage.clickStartProcessButton();
        await processCloudDemoPage.clickOnProcessFilters();

        await processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
        await expect(await processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
        await processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(processName);

    });

});
