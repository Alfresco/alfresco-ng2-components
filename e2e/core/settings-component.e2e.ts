/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { LoginPage } from '../pages/adf/loginPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { browser, protractor } from 'protractor';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { ContentServicesPage } from '../pages/adf/contentServicesPage';
import TestConfig = require('../test.config');

describe('Settings component', () => {

    const loginPage = new LoginPage();
    const settingsPage = new SettingsPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const contentServicesPage = new ContentServicesPage();
    const loginError = 'Request has been terminated ' +
        'Possible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.';

    let adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminUser,
        'password': TestConfig.adf.adminPassword
    });

    describe('Should be able to change Urls in the Settings', () => {
        beforeEach( (done) => {
            settingsPage.goToSettingsPage();
            done();
        });

        it('[C245641] Should navigate User from Settings page to Login screen', () => {
            settingsPage.clickBackButton();
            loginPage.waitForElements();
        });

        it('[C291946] Should not save BPM Settings changes when User clicks Back button', () => {
            settingsPage.setProvider(settingsPage.getBpmOption(), 'BPM');
            settingsPage.setProcessServicesURL('http://adfdev.envalfresco1.com');
            settingsPage.clickBackButton();
            loginPage.waitForElements();
            settingsPage.goToSettingsPage();
            expect(settingsPage.getSelectedOptionText()).not.toEqual('BPM', 'The Settings changes are saved');
            expect(settingsPage.getBpmHostUrl()).not.toEqual('http://adfdev.envalfresco1.com', 'The Settings changes are saved');

        });

        it('[C291947] Should not save ECM Settings changes when User clicks Back button', () => {
            settingsPage.setProvider(settingsPage.getEcmOption(), 'ECM');
            settingsPage.setContentServicesURL('http://adfdev.envalfresco1.com');
            settingsPage.clickBackButton();
            loginPage.waitForElements();
            settingsPage.goToSettingsPage();
            expect(settingsPage.getSelectedOptionText()).not.toEqual('ECM', 'The Settings changes are saved');
            expect(settingsPage.getBpmHostUrl()).not.toEqual('http://adfdev.envalfresco1.com', 'The Settings changes are saved');

        });

        it('[C291948] Should save ALL Settings changes when User clicks Apply button', () => {
            settingsPage.setProviderEcmBpm();
            loginPage.waitForElements();
            settingsPage.goToSettingsPage();
            expect(settingsPage.getSelectedOptionText()).toEqual('ALL', 'The Settings changes are not saved');
            expect(settingsPage.getBpmHostUrl()).toEqual(TestConfig.adf.url, 'The BPM Settings changes are not saved');
            expect(settingsPage.getEcmHostUrl()).toEqual(TestConfig.adf.url, 'The ECM Settings changes are not saved');

        });

        it('[C291949] Should have field validation for Content Services Url', () => {
            settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL');
            settingsPage.clearContentServicesURL();
            settingsPage.ecmText.sendKeys(protractor.Key.TAB);
            settingsPage.checkValidationMessageIsDisplayed();
            settingsPage.checkApplyButtonIsDisabled();
        });

        it('[C291950] Should have field validation for Process Services Url', () => {
            settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL');
            settingsPage.clearProcessServicesURL();
            settingsPage.bpmText.sendKeys(protractor.Key.TAB);
            settingsPage.checkValidationMessageIsDisplayed();
            settingsPage.checkApplyButtonIsDisabled();
        });

        it('[C291951] Should not be able to sign in with invalid Content Services Url', () => {
            settingsPage.setProvider(settingsPage.getEcmOption(), 'ECM');
            settingsPage.setContentServicesURL('http://localhost:7070');
            settingsPage.clickApply();
            loginPage.waitForElements();
            loginPage.enterUsername(adminUserModel.id);
            loginPage.enterPassword(adminUserModel.password);
            loginPage.clickSignInButton();
            expect(loginPage.getLoginError()).toMatch(loginError);
        });

        it('[C291952] Should not be able to sign in with invalid Process Services Url', () => {
            settingsPage.setProvider(settingsPage.getBpmOption(), 'BPM');
            settingsPage.setProcessServicesURL('http://localhost:7070');
            settingsPage.clickApply();
            loginPage.waitForElements();
            loginPage.enterUsername(adminUserModel.id);
            loginPage.enterPassword(adminUserModel.password);
            loginPage.clickSignInButton();
            expect(loginPage.getLoginError()).toMatch(loginError);
        });
    });

    describe('Settings Component - Basic Authentication', () => {
        beforeAll( (done) => {
            settingsPage.goToSettingsPage();
            settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL');
            settingsPage.setContentServicesURL(TestConfig.adf.url);
            settingsPage.setProcessServicesURL(TestConfig.adf.url);
            settingsPage.clickApply();
            done();
        });

        beforeEach( (done) => {
            loginPage.goToLoginPage();
            loginPage.clickSettingsIcon();
            settingsPage.checkProviderDropdownIsDisplayed();
            done();
        });

        it('[C277751] Should allow the User to login to Process Services using the BPM selection on Settings page', () => {
            settingsPage.checkProviderOptions();
            settingsPage.checkBasicAuthRadioIsSelected();
            settingsPage.checkSsoRadioIsNotSelected();
            expect(settingsPage.getEcmHostUrl()).toBe(TestConfig.adf.url);
            expect(settingsPage.getBpmHostUrl()).toBe(TestConfig.adf.url);
            expect(settingsPage.getBackButton().isEnabled()).toBe(true);
            expect(settingsPage.getApplyButton().isEnabled()).toBe(true);
            loginPage.goToLoginPage();
            loginPage.clickSettingsIcon();
            settingsPage.checkProviderDropdownIsDisplayed();
            settingsPage.setProvider(settingsPage.getBpmOption(), 'BPM');
            settingsPage.clickBackButton();
            loginPage.waitForElements();
            loginPage.clickSettingsIcon();
            settingsPage.checkProviderDropdownIsDisplayed();
            settingsPage.setProviderBpm();
            loginPage.waitForElements();
            loginPage.enterUsername(adminUserModel.id);
            loginPage.enterPassword(adminUserModel.password);
            loginPage.clickSignInButton();
            navigationBarPage.navigateToProcessServicesPage();
            processServicesPage.checkApsContainer();
            processServicesPage.checkAppIsDisplayed('Task App');
            navigationBarPage.navigateToSettingsPage();
            expect(settingsPage.getSelectedOptionText()).toBe('BPM');
            settingsPage.checkBasicAuthRadioIsSelected();
            settingsPage.checkSsoRadioIsNotSelected();
            expect(settingsPage.getBpmHostUrl()).toBe(TestConfig.adf.url);
            expect(settingsPage.getBackButton().isEnabled()).toBe(true);
            expect(settingsPage.getApplyButton().isEnabled()).toBe(true);
            settingsPage.clickBackButton();
            loginPage.waitForElements();
            browser.get(TestConfig.adf.url + '/activiti');
            processServicesPage.checkApsContainer();
            processServicesPage.checkAppIsDisplayed('Task App');
        });

        it('[C277752] Should allow the User to login to Content Services using the ECM selection on Settings page', () => {
            settingsPage.setProvider(settingsPage.getEcmOption(), 'ECM');
            settingsPage.clickBackButton();
            loginPage.waitForElements();
            loginPage.clickSettingsIcon();
            settingsPage.checkProviderDropdownIsDisplayed();
            settingsPage.setProviderEcm();
            loginPage.waitForElements();
            loginPage.enterUsername(adminUserModel.id);
            loginPage.enterPassword(adminUserModel.password);
            loginPage.clickSignInButton();
            navigationBarPage.clickContentServicesButton();
            contentServicesPage.checkAcsContainer();
            navigationBarPage.navigateToSettingsPage();
            expect(settingsPage.getSelectedOptionText()).toBe('ECM');
            settingsPage.checkBasicAuthRadioIsSelected();
            settingsPage.checkSsoRadioIsNotSelected();
            expect(settingsPage.getEcmHostUrl()).toBe(TestConfig.adf.url);
            expect(settingsPage.getBackButton().isEnabled()).toBe(true);
            expect(settingsPage.getApplyButton().isEnabled()).toBe(true);
            settingsPage.clickBackButton();
            loginPage.waitForElements();
            browser.get(TestConfig.adf.url + '/files');
            contentServicesPage.checkAcsContainer();
        });

        it('[C277753] Should allow the User to login to both Process Services and Content Services using the ALL selection on Settings Page', () => {
            settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL');
            settingsPage.clickBackButton();
            loginPage.waitForElements();
            loginPage.clickSettingsIcon();
            settingsPage.checkProviderDropdownIsDisplayed();
            settingsPage.setProviderEcmBpm();
            loginPage.waitForElements();
            loginPage.enterUsername(adminUserModel.id);
            loginPage.enterPassword(adminUserModel.password);
            loginPage.clickSignInButton();
            navigationBarPage.clickContentServicesButton();
            contentServicesPage.checkAcsContainer();
            navigationBarPage.navigateToProcessServicesPage();
            processServicesPage.checkApsContainer();
            processServicesPage.checkAppIsDisplayed('Task App');
            navigationBarPage.navigateToSettingsPage();
            expect(settingsPage.getSelectedOptionText()).toBe('ALL');
            settingsPage.checkBasicAuthRadioIsSelected();
            settingsPage.checkSsoRadioIsNotSelected();
            expect(settingsPage.getEcmHostUrl()).toBe(TestConfig.adf.url);
            expect(settingsPage.getBpmHostUrl()).toBe(TestConfig.adf.url);
            expect(settingsPage.getBackButton().isEnabled()).toBe(true);
            expect(settingsPage.getApplyButton().isEnabled()).toBe(true);
            settingsPage.clickBackButton();
            loginPage.waitForElements();
            browser.get(TestConfig.adf.url + '/files');
            contentServicesPage.checkAcsContainer();
            browser.get(TestConfig.adf.url + '/activiti');
            processServicesPage.checkApsContainer();
            processServicesPage.checkAppIsDisplayed('Task App');
        });
    });
});
