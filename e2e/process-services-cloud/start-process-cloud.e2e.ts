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

import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { AppListCloudComponent } from '../pages/adf/process-cloud/appListCloudComponent';
import TestConfig = require('../test.config');
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { StartProcessPage } from '../pages/adf/process-services/startProcessPage';
import { Util } from '../util/util';
describe('Start Process', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudComponent();
    const processCloudDemoPage = new ProcessCloudDemoPage();
    const startProcessPage = new StartProcessPage();
    const processName = Util.generateRandomString(10);
    const processName255Characters = Util.generateRandomString(255);
    const processNameBiggerThen255Characters = Util.generateRandomString(256);
    const lengthValidationError = 'Length exceeded, 255 characters max.';
    const requiredError = 'Process Name is required', requiredProcessError = 'Process Definition is required';
    const processDefinition = 'processwithvariables';
    const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
    const appName = 'simple-app', noProcessApp = 'noprocessapp';
    let silentLogin;

    beforeAll((done) => {
        silentLogin = false;
        settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
        loginSSOPage.clickOnSSOButton();
        loginSSOPage.loginAPS(user, password);
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        done();
    });

    afterEach((done) => {
        navigationBarPage.navigateToProcessServicesCloudPage();
        done();
    });

    it('[C291857] Should be possible to cancel a process', () => {
        appListCloudComponent.checkAppIsDisplayed(appName);
        appListCloudComponent.goToApp(appName);
        processCloudDemoPage.openNewProcessForm();
        startProcessPage.clearField(startProcessPage.processNameInput);
        startProcessPage.blur(startProcessPage.processNameInput);
        startProcessPage.checkValidationErrorIsDisplayed(requiredError);
        startProcessPage.checkStartProcessButtonIsDisabled();
        startProcessPage.clickCancelProcessButton();
    });

    it('[C291842] Should be displayed an error message if process name exceed 255 characters', () => {
        appListCloudComponent.goToApp(appName);
        processCloudDemoPage.openNewProcessForm();
        startProcessPage.enterProcessName(processName255Characters);
        startProcessPage.checkStartProcessButtonIsEnabled();

        startProcessPage.enterProcessName(processNameBiggerThen255Characters);
        startProcessPage.blur(startProcessPage.processNameInput);
        startProcessPage.checkValidationErrorIsDisplayed(lengthValidationError);
        startProcessPage.checkStartProcessButtonIsDisabled();
    });

    it('[C291855] Should NOT be able to start a process without process model', () => {
        appListCloudComponent.checkAppIsDisplayed(noProcessApp);
        appListCloudComponent.goToApp(noProcessApp);
        processCloudDemoPage.openNewProcessForm();
        startProcessPage.checkNoProcessMessage();
    });

    it('[C291860] Should be able to start a process', () => {
        appListCloudComponent.checkAppIsDisplayed(appName);
        appListCloudComponent.goToApp(appName);
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

    it('[C291860] Should be able to start a process with variables', () => {
        appListCloudComponent.checkAppIsDisplayed(appName);
        appListCloudComponent.goToApp(appName);
        processCloudDemoPage.openNewProcessForm();

        startProcessPage.clearField(startProcessPage.processNameInput);
        startProcessPage.enterProcessName(processName);

        startProcessPage.clearField(startProcessPage.processDefinition);
        startProcessPage.blur(startProcessPage.processDefinition);
        startProcessPage.checkValidationErrorIsDisplayed(requiredProcessError);

        startProcessPage.selectFromProcessDropdown(processDefinition);
        startProcessPage.checkStartProcessButtonIsEnabled();
        startProcessPage.clickStartProcessButton();
        processCloudDemoPage.clickOnProcessFilters();

        processCloudDemoPage.runningProcessesFilter().clickProcessFilter();
        expect(processCloudDemoPage.getActiveFilterName()).toBe('Running Processes');
        processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(processName);

    });

});
