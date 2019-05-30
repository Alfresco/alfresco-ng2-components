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

import { LoginSSOPage, SettingsPage } from '@alfresco/adf-testing';
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

    const processName = StringUtil.generateRandomString(10);
    const processName255Characters = StringUtil.generateRandomString(255);
    const processNameBiggerThen255Characters = StringUtil.generateRandomString(256);
    const lengthValidationError = 'Length exceeded, 255 characters max.';
    const requiredError = 'Process Name is required';
    const processDefinitionRequiredError = 'Process Definition is required';
    const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;

    beforeAll(async (done) => {
        await settingsPage.setProviderBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost);
        loginSSOPage.loginSSOIdentityService(browser.params.identityUser.email, browser.params.identityUser.password);

        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
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
        startProcessPage.checkStartProcessButtonIsDisabled();
        startProcessPage.clickCancelProcessButton();
    });

    it('[C291842] Should be displayed an error message if process name exceed 255 characters', () => {
        appListCloudComponent.checkAppIsDisplayed(simpleApp);
        appListCloudComponent.goToApp(simpleApp);
        processCloudDemoPage.openNewProcessForm();
        startProcessPage.enterProcessName(processName255Characters);
        startProcessPage.checkStartProcessButtonIsEnabled();

        startProcessPage.enterProcessName(processNameBiggerThen255Characters);
        startProcessPage.blur(startProcessPage.processNameInput);
        startProcessPage.checkValidationErrorIsDisplayed(lengthValidationError);
        startProcessPage.checkStartProcessButtonIsDisabled();
    });

    it('[C291860] Should be able to start a process', () => {
        appListCloudComponent.checkAppIsDisplayed(simpleApp);
        appListCloudComponent.goToApp(simpleApp);
        processCloudDemoPage.openNewProcessForm();

        startProcessPage.clearField(startProcessPage.processNameInput);
        startProcessPage.enterProcessName(processName);
        startProcessPage.checkStartProcessButtonIsEnabled();
        startProcessPage.clickStartProcessButton();
        processCloudDemoPage.clickOnProcessFilters();

        processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
        expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(processName);

    });

    it('[C309875] Should display the validation message when Process definition has name property set to null', () => {
        appListCloudComponent.checkAppIsDisplayed(simpleApp);
        appListCloudComponent.goToApp(simpleApp);
        processCloudDemoPage.openNewProcessForm();

        startProcessPage.clearField(startProcessPage.processNameInput);
        startProcessPage.enterProcessName(processName);
        startProcessPage.clickProcessDropdownArrow();
        startProcessPage.selectOptionAtIndex(4);
        startProcessPage.checkValidationErrorIsDisplayed(processDefinitionRequiredError);

    });
});
