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
import { LoginPage } from '../pages/adf/loginPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import { HeaderPage } from '@alfresco/adf-testing';
import { SettingsPage } from '../pages/adf/settingsPage';
import TestConfig = require('../test.config');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';

describe('Header Component', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let headerPage = new HeaderPage();
    let settingsPage = new SettingsPage();

    let user, tenantId;

    let names = {
        app_title_default: 'ADF Demo Application',
        app_title_custom: 'New Test App',
        urlPath_default: './assets/images/logo.png',
        urlPath_custom: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flower_jtca001.jpg',
        urlPath_logo_link: '"/settings-layout"',
        color_primary: 'primary',
        color_accent: 'accent',
        color_warn: 'warn',
        color_custom: '#862B2B',
        logo_title: 'ADF Demo Application',
        logo_tooltip: 'test_tooltip'
    };

    beforeAll(async(done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        let users = new UsersActions();

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        done();
    });

    beforeEach(async(done) => {

        loginPage.loginToProcessServicesUsingUserModel(user);

        navigationBarPage.clickHeaderDataButton();

        done();
    });

    afterAll(async(done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

        done();
    });

    it('[C280002] Should be able to view Header component', () => {
        headerPage.checkShowMenuCheckBoxIsDisplayed();
        headerPage.checkChooseHeaderColourIsDisplayed();
        headerPage.checkHexColorInputIsDisplayed();
        headerPage.checkChangeTitleIsDisplayed();
        headerPage.checkChangeUrlPathIsDisplayed();
        headerPage.checkLogoHyperlinkInputIsDisplayed();
        headerPage.checkLogoTooltipInputIsDisplayed();
    });

    it('[C279996] Should be able to show/hide menu button', () => {
        headerPage.clickShowMenuButton();

        navigationBarPage.checkMenuButtonIsNotDisplayed();

        headerPage.clickShowMenuButton();

        navigationBarPage.checkMenuButtonIsDisplayed();
    });

    it('[C279999] Should be able to change the colour between primary, accent and warn', () => {
        headerPage.changeHeaderColor(names.color_accent);

        navigationBarPage.checkToolbarColor(names.color_accent);

        headerPage.changeHeaderColor(names.color_primary);

        navigationBarPage.checkToolbarColor(names.color_primary);

        headerPage.changeHeaderColor(names.color_warn);

        navigationBarPage.checkToolbarColor(names.color_warn);
    });

    it('[C280552] Should be able to change the colour of the header by typing a hex code', () => {
        headerPage.addHexCodeColor(names.color_custom);

        navigationBarPage.checkToolbarColor(names.color_custom);

    });

    it('[C279997] Should be able to change the title of the app', () => {
        headerPage.checkAppTitle(names.app_title_default);
        headerPage.addTitle(names.app_title_custom);
        headerPage.checkAppTitle(names.app_title_custom);
    });

    it('[C279998] Should be able to change the default logo of the app', () => {
        headerPage.checkIconIsDisplayed(names.urlPath_default);
        headerPage.addIcon(names.urlPath_custom);
        headerPage.checkIconIsDisplayed(names.urlPath_custom);
    });

    it('[C280553] Should be able to set a hyperlink to the logo', () => {
        headerPage.addLogoHyperlink(names.urlPath_logo_link);

        navigationBarPage.clickAppLogo(names.logo_title);

        settingsPage.checkProviderDropdownIsDisplayed();
    });

    it('[C286517] Should be able to set a hyperlink to the logo text', () => {
        headerPage.addLogoHyperlink(names.urlPath_logo_link);

        navigationBarPage.clickAppLogoText();

        settingsPage.checkProviderDropdownIsDisplayed();
    });

    it('[C280554] Should be able to customise the tooltip-text of the logo', () => {
        headerPage.addLogoTooltip(names.logo_tooltip);

        navigationBarPage.checkLogoTooltip(names.logo_tooltip);
    });

    it('[C286297] Should be able to change the position of the sidebar menu', () => {
        headerPage.sideBarPositionEnd();
        headerPage.checkSidebarPositionEnd();
        headerPage.sideBarPositionStart();
        headerPage.checkSidebarPositionStart();
    });
});
