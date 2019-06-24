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

import { ApiService, GroupIdentityService, IdentityService, LoginSSOPage, SettingsPage } from '@alfresco/adf-testing';
import { AppListCloudPage, StartProcessCloudPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { StringUtil } from '@alfresco/adf-testing';
import resources = require('../util/resources');

describe('Start Process', () => {

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const processCloudDemoPage = new ProcessCloudDemoPage();
    const startProcessPage = new StartProcessCloudPage();
    const settingsPage = new SettingsPage();
    const apiService = new ApiService(
        browser.params.config.oauth2.clientId,
        browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
    );

    const processDefinitionWithoutName = 'process-';
    const processName = StringUtil.generateRandomString(10);
    const processName255Characters = StringUtil.generateRandomString(255);
    const processNameBiggerThen255Characters = StringUtil.generateRandomString(256);
    const lengthValidationError = 'Length exceeded, 255 characters max.';
    const requiredError = 'Process Name is required';
    const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;
    let testUser, groupInfo;

    beforeAll(async (done) => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await settingsPage.setProviderBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost);
        loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);

        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        done();
    });

    afterAll(async(done) => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
        done();
    });

    afterEach((done) => {
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        done();
    });

    it('[C291857] Should be possible to cancel a process', () => {
        appListCloudComponent.checkAppIsDisplayed(simpleApp);
        appListCloudComponent.goToApp(simpleApp);
        processCloudDemoPage.openNewProcessForm();
        startProcessPage.clearField(startProcessPage.processNameInput);
        startProcessPage.blur(startProcessPage.processNameInput);
        startProcessPage.checkValidationErrorIsDisplayed(requiredError);
        expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);
        startProcessPage.clickCancelProcessButton();
    });

    it('[C291842] Should be displayed an error message if process name exceed 255 characters', () => {
        appListCloudComponent.checkAppIsDisplayed(simpleApp);
        appListCloudComponent.goToApp(simpleApp);
        processCloudDemoPage.openNewProcessForm();
        startProcessPage.enterProcessName(processName255Characters);
        expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(true);

        startProcessPage.enterProcessName(processNameBiggerThen255Characters);
        startProcessPage.blur(startProcessPage.processNameInput);
        startProcessPage.checkValidationErrorIsDisplayed(lengthValidationError);
        expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(false);
    });

    it('[C291860] Should be able to start a process', () => {
        appListCloudComponent.checkAppIsDisplayed(simpleApp);
        appListCloudComponent.goToApp(simpleApp);
        processCloudDemoPage.openNewProcessForm();
        startProcessPage.clearField(startProcessPage.processNameInput);
        startProcessPage.enterProcessName(processName);
        expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(true);
        startProcessPage.clickStartProcessButton();
        processCloudDemoPage.clickOnProcessFilters();

        processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
        expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(processName);

    });

    it('[C309875] Should display the processId when Process Definition has process name missing', async () => {
        appListCloudComponent.checkAppIsDisplayed(simpleApp);
        appListCloudComponent.goToApp(simpleApp);
        processCloudDemoPage.openNewProcessForm();
        startProcessPage.clearField(startProcessPage.processNameInput);
        startProcessPage.enterProcessName(processName);
        startProcessPage.selectFromProcessDropdown(processDefinitionWithoutName);
        expect(startProcessPage.checkStartProcessButtonIsEnabled()).toBe(true);

    });
});
