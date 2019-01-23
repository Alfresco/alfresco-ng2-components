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
import { ContentServicesPage } from '../pages/adf/contentServicesPage';
import { ContentListPage } from '../pages/adf/dialog/contentListPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ViewerPage } from '../pages/adf/viewerPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import {browser, element, protractor} from "protractor";
import TestConfig = require('../test.config');

import { AcsUserModel } from '../models/ACS/acsUserModel';


describe('Settings component', () => {

    const loginPage = new LoginPage();
    const settingsPage = new SettingsPage();

    let adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminUser,
        'password': TestConfig.adf.adminPassword
    });


    describe('Settings component', () => {
        beforeEach( (done) => {
            settingsPage.goToSettingsPage();
            done();
        });
        
        it('[C245641] Should navigate User back to Login screen', () => {
            settingsPage.clickBackButton();
            loginPage.waitForElements();

        });

        it('[C245641] Should not save BPM Settings changes when User clicks Back button', () => {
            settingsPage.setProvider(settingsPage.getBpmOption(), 'BPM');
            settingsPage.setProcessServicesURL('http://adfdev.envalfresco1.com');
            settingsPage.clickBackButton();
            loginPage.waitForElements();
            settingsPage.goToSettingsPage();
            expect(settingsPage.selectedOption.getText()).not.toEqual('BPM', 'The Settings changes are saved');
            expect(settingsPage.bpmText.getText()).not.toEqual('http://adfdev.envalfresco1.com', 'The Settings changes are saved');

        });

        it('[C245641] Should not save ECM Settings changes when User clicks Back button', () => {
            settingsPage.setProvider(settingsPage.getEcmOption(), 'ECM');
            settingsPage.setContentServicesURL('http://adfdev.envalfresco1.com');
            settingsPage.clickBackButton();
            loginPage.waitForElements();
            settingsPage.goToSettingsPage();
            expect(settingsPage.selectedOption.getText()).not.toEqual('ECM', 'The Settings changes are saved');
            expect(settingsPage.bpmText.getText()).not.toEqual('http://adfdev.envalfresco1.com', 'The Settings changes are saved');

        });

        it('[C245641] Should save ALL Settings changes when User clicks Apply button', () => {
            settingsPage.setProviderEcmBpm();
            loginPage.waitForElements();
            settingsPage.goToSettingsPage();
            expect(settingsPage.selectedOption.getText()).toEqual('ALL', 'The Settings changes are not saved');
            expect(settingsPage.bpmText.getAttribute('value')).toEqual('http://adfdev.envalfresco.com', 'The BPM Settings changes are not saved');
            expect(settingsPage.ecmText.getAttribute('value')).toEqual('http://adfdev.envalfresco.com', 'The ECM Settings changes are not saved');

        });

        it('[C245641] Should have field validation for Content Services Url', () => {
            settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL');
            settingsPage.clearContentServicesURL();
            settingsPage.ecmText.sendKeys(protractor.Key.TAB);
            settingsPage.checkValidationMessageIsDisplayed();
            settingsPage.checkApplyButtonIsDisabled();
        });

        it('[C245641] Should have field validation for Process Services Url', () => {
            settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL');
            settingsPage.clearProcessServicesURL();
            settingsPage.bpmText.sendKeys(protractor.Key.TAB);
            settingsPage.checkValidationMessageIsDisplayed();
            settingsPage.checkApplyButtonIsDisabled();
        });

        it('[C245641] Should not be able to sign in with invalid Content Services Url', () => {
            settingsPage.setProvider(settingsPage.getEcmOption(), 'ECM');
            settingsPage.setContentServicesURL('http://localhost:7070');
            settingsPage.clickApply();
            loginPage.waitForElements();
            loginPage.enterUsername(adminUserModel.id);
            loginPage.enterPassword(adminUserModel.password);
            loginPage.clickSignInButton();
            expect(loginPage.getLoginError()).toMatch('Request has been terminated ' +
                'Possible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
        });

        it('[C245641] Should not be able to sign in with invalid Process Services Url', () => {
            settingsPage.setProvider(settingsPage.getBpmOption(), 'BPM');
            settingsPage.setProcessServicesURL('http://localhost:7070');
            settingsPage.clickApply();
            loginPage.waitForElements();
            loginPage.enterUsername(adminUserModel.id);
            loginPage.enterPassword(adminUserModel.password);
            loginPage.clickSignInButton();
            expect(loginPage.getLoginError()).toMatch('Request has been terminated ' +
                'Possible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
        });

    });
});


