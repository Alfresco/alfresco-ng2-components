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

import { LoginPage, SettingsPage, BrowserActions } from '@alfresco/adf-testing';
import { protractor } from 'protractor';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { ContentServicesPage } from '../pages/adf/contentServicesPage';
import { browser } from 'protractor';

describe('Settings component', () => {

    const loginPage = new LoginPage();
    const settingsPage = new SettingsPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const contentServicesPage = new ContentServicesPage();
    const loginError = 'Request has been terminated ' +
        'Possible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.';

    const adminUserModel = new AcsUserModel({
        'id': browser.params.testConfig.adf.adminUser,
        'password': browser.params.testConfig.adf.adminPassword
    });

    describe('Should be able to change Urls in the Settings', () => {
        beforeEach(async () => {
            await settingsPage.goToSettingsPage();

        });

        it('[C245641] Should navigate User from Settings page to Login screen', async () => {
            await settingsPage.clickBackButton();
            await loginPage.waitForElements();
        });

        it('[C291948] Should save ALL Settings changes when User clicks Apply button', async () => {
            await loginPage.goToLoginPage();
            await loginPage.clickSettingsIcon();
            await settingsPage.setProviderEcmBpm();
            await loginPage.waitForElements();
            await settingsPage.goToSettingsPage();
            await expect(await settingsPage.getSelectedOptionText()).toEqual('ALL', 'The Settings changes are not saved');
            await expect(await settingsPage.getBpmHostUrl()).toEqual(browser.params.testConfig.adf_aps.host, 'The BPM Settings changes are not saved');
            await expect(await settingsPage.getEcmHostUrl()).toEqual(browser.params.testConfig.adf_acs.host, 'The ECM Settings changes are not saved');

        });

        it('[C291949] Should have field validation for Content Services Url', async () => {
            await settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL');
            await settingsPage.clearContentServicesURL();
            await settingsPage.ecmText.sendKeys(protractor.Key.TAB);
            await settingsPage.checkValidationMessageIsDisplayed();
            await settingsPage.checkApplyButtonIsDisabled();
        });

        it('[C291950] Should have field validation for Process Services Url', async () => {
            await settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL');
            await settingsPage.clearProcessServicesURL();
            await settingsPage.bpmText.sendKeys(protractor.Key.TAB);
            await settingsPage.checkValidationMessageIsDisplayed();
            await settingsPage.checkApplyButtonIsDisabled();
        });

        it('[C291951] Should not be able to sign in with invalid Content Services Url', async () => {
            await settingsPage.setProvider(settingsPage.getEcmOption(), 'ECM');
            await settingsPage.setContentServicesURL('http://localhost:7070');
            await settingsPage.clickApply();
            await loginPage.waitForElements();
            await loginPage.enterUsername(adminUserModel.id);
            await loginPage.enterPassword(adminUserModel.password);
            await loginPage.clickSignInButton();
            await expect(await loginPage.getLoginError()).toMatch(loginError);
        });

        it('[C291952] Should not be able to sign in with invalid Process Services Url', async () => {
            await settingsPage.setProvider(settingsPage.getBpmOption(), 'BPM');
            await settingsPage.setProcessServicesURL('http://localhost:7070');
            await settingsPage.clickApply();
            await loginPage.waitForElements();
            await loginPage.enterUsername(adminUserModel.id);
            await loginPage.enterPassword(adminUserModel.password);
            await loginPage.clickSignInButton();
            await expect(await loginPage.getLoginError()).toMatch(loginError);
        });
    });

    describe('Settings Component - Basic Authentication', () => {
        beforeAll(async () => {
            await settingsPage.goToSettingsPage();
            await settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL');
            await settingsPage.setContentServicesURL(browser.params.testConfig.adf_acs.host);
            await settingsPage.setProcessServicesURL(browser.params.testConfig.adf_aps.host);
            await settingsPage.clickApply();
        });

        beforeEach(async () => {
            await loginPage.goToLoginPage();
            await loginPage.clickSettingsIcon();
            await settingsPage.checkProviderDropdownIsDisplayed();
        });

        it('[C277751] Should allow the User to login to Process Services using the BPM selection on Settings page', async () => {
            await settingsPage.checkProviderOptions();
            await settingsPage.checkBasicAuthRadioIsSelected();
            await settingsPage.checkSsoRadioIsNotSelected();
            await expect(await settingsPage.getEcmHostUrl()).toBe(browser.params.testConfig.adf_acs.host);
            await expect(await settingsPage.getBpmHostUrl()).toBe(browser.params.testConfig.adf_aps.host);

            await expect(await settingsPage.getBackButton().isEnabled()).toBe(true);
            await expect(await settingsPage.getApplyButton().isEnabled()).toBe(true);
            await loginPage.goToLoginPage();
            await loginPage.clickSettingsIcon();
            await settingsPage.checkProviderDropdownIsDisplayed();
            await settingsPage.setProvider(settingsPage.getBpmOption(), 'BPM');
            await settingsPage.clickBackButton();
            await loginPage.waitForElements();
            await loginPage.clickSettingsIcon();
            await settingsPage.checkProviderDropdownIsDisplayed();
            await settingsPage.setProviderBpm();
            await loginPage.waitForElements();
            await loginPage.enterUsername(adminUserModel.id);
            await loginPage.enterPassword(adminUserModel.password);
            await loginPage.clickSignInButton();
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
            await processServicesPage.checkAppIsDisplayed('Task App');
            await navigationBarPage.clickSettingsButton();
            await expect(await settingsPage.getSelectedOptionText()).toBe('BPM');

            await settingsPage.checkBasicAuthRadioIsSelected();
            await settingsPage.checkSsoRadioIsNotSelected();
            await expect(await settingsPage.getBpmHostUrl()).toBe(browser.params.testConfig.adf_aps.host);

            await expect(await settingsPage.getBackButton().isEnabled()).toBe(true);
            await expect(await settingsPage.getApplyButton().isEnabled()).toBe(true);
            await settingsPage.clickBackButton();
            await loginPage.waitForElements();
            await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/activiti');
            await processServicesPage.checkApsContainer();
            await processServicesPage.checkAppIsDisplayed('Task App');
        });

        it('[C277752] Should allow the User to login to Content Services using the ECM selection on Settings page', async () => {
            await settingsPage.setProvider(settingsPage.getEcmOption(), 'ECM');
            await settingsPage.clickBackButton();
            await loginPage.waitForElements();
            await loginPage.clickSettingsIcon();
            await settingsPage.checkProviderDropdownIsDisplayed();
            await settingsPage.setProviderEcm();
            await loginPage.waitForElements();
            await loginPage.enterUsername(adminUserModel.id);
            await loginPage.enterPassword(adminUserModel.password);
            await loginPage.clickSignInButton();
            await navigationBarPage.clickContentServicesButton();
            await contentServicesPage.checkAcsContainer();
            await navigationBarPage.clickSettingsButton();
            await expect(await settingsPage.getSelectedOptionText()).toBe('ECM');
            await settingsPage.checkBasicAuthRadioIsSelected();
            await settingsPage.checkSsoRadioIsNotSelected();

            await expect(await settingsPage.getEcmHostUrl()).toBe(browser.params.testConfig.adf_acs.host);
            await expect(await settingsPage.getBackButton().isEnabled()).toBe(true);
            await expect(await settingsPage.getApplyButton().isEnabled()).toBe(true);
            await settingsPage.clickBackButton();
            await loginPage.waitForElements();
            await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/files');
            await contentServicesPage.checkAcsContainer();
        });

        it('[C277753] Should allow the User to login to both Process Services and Content Services using the ALL selection on Settings Page', async () => {
            await settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL');
            await settingsPage.clickBackButton();
            await loginPage.waitForElements();
            await loginPage.clickSettingsIcon();
            await settingsPage.checkProviderDropdownIsDisplayed();
            await settingsPage.setProviderEcmBpm();
            await loginPage.waitForElements();
            await loginPage.enterUsername(adminUserModel.id);
            await loginPage.enterPassword(adminUserModel.password);
            await loginPage.clickSignInButton();
            await navigationBarPage.clickContentServicesButton();
            await contentServicesPage.checkAcsContainer();
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
            await processServicesPage.checkAppIsDisplayed('Task App');
            await navigationBarPage.clickSettingsButton();
            await expect(await settingsPage.getSelectedOptionText()).toBe('ALL');
            await settingsPage.checkBasicAuthRadioIsSelected();
            await settingsPage.checkSsoRadioIsNotSelected();
            await expect(await settingsPage.getEcmHostUrl()).toBe(browser.params.testConfig.adf_acs.host);
            await expect(await settingsPage.getBpmHostUrl()).toBe(browser.params.testConfig.adf_aps.host);

            await expect(await settingsPage.getBackButton().isEnabled()).toBe(true);
            await expect(await settingsPage.getApplyButton().isEnabled()).toBe(true);
            await settingsPage.clickBackButton();
            await loginPage.waitForElements();
            await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/files');
            await contentServicesPage.checkAcsContainer();
            await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/activiti');
            await processServicesPage.checkApsContainer();
            await processServicesPage.checkAppIsDisplayed('Task App');
        });
    });
});
