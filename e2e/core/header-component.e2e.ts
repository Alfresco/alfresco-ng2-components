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
import { ApiService, HeaderPage, LoginSSOPage, SettingsPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { UsersActions } from '../actions/users.actions';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';

describe('Header Component', () => {

    const loginPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const headerPage = new HeaderPage();
    const settingsPage = new SettingsPage();
    const alfrescoJsApi = new ApiService().apiService;

    let user, tenantId;

    const names = {
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

    beforeAll(async() => {
        const users = new UsersActions();

        await alfrescoJsApi.login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        user = await users.createTenantAndUser(alfrescoJsApi);

        tenantId = user.tenantId;

        await alfrescoJsApi.login(user.email, user.password);

        await loginPage.login(user.id, user.password);
   });

    beforeEach(async() => {
        await navigationBarPage.clickHeaderDataButton();
    });

    afterAll(async() => {
        await navigationBarPage.clickLogoutButton();
        await alfrescoJsApi.login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
   });

    it('[C280002] Should be able to view Header component', async () => {
        await headerPage.checkShowMenuCheckBoxIsDisplayed();
        await headerPage.checkChooseHeaderColourIsDisplayed();
        await headerPage.checkHexColorInputIsDisplayed();
        await headerPage.checkChangeTitleIsDisplayed();
        await headerPage.checkChangeUrlPathIsDisplayed();
        await headerPage.checkLogoHyperlinkInputIsDisplayed();
        await headerPage.checkLogoTooltipInputIsDisplayed();
    });

    it('[C279996] Should be able to show/hide menu button', async () => {
        await headerPage.clickShowMenuButton();
        await navigationBarPage.checkMenuButtonIsNotDisplayed();
        await headerPage.clickShowMenuButton();
        await navigationBarPage.checkMenuButtonIsDisplayed();
    });

    it('[C279999] Should be able to change the colour between primary, accent and warn', async () => {
        await headerPage.changeHeaderColor(names.color_accent);
        await navigationBarPage.checkToolbarColor(names.color_accent);
        await headerPage.changeHeaderColor(names.color_primary);
        await navigationBarPage.checkToolbarColor(names.color_primary);
        await headerPage.changeHeaderColor(names.color_warn);
        await navigationBarPage.checkToolbarColor(names.color_warn);
    });

    it('[C280552] Should be able to change the colour of the header by typing a hex code', async () => {
        await headerPage.addHexCodeColor(names.color_custom);
        await navigationBarPage.checkToolbarColor(names.color_custom);
    });

    it('[C279997] Should be able to change the title of the app', async () => {
        await headerPage.checkAppTitle(names.app_title_default);
        await headerPage.addTitle(names.app_title_custom);
        await headerPage.checkAppTitle(names.app_title_custom);
    });

    it('[C279998] Should be able to change the default logo of the app', async () => {
        await headerPage.checkIconIsDisplayed(names.urlPath_default);
        await headerPage.addIcon(names.urlPath_custom);
        await headerPage.checkIconIsDisplayed(names.urlPath_custom);
    });

    it('[C280553] Should be able to set a hyperlink to the logo', async () => {
        await headerPage.addLogoHyperlink(names.urlPath_logo_link);
        await navigationBarPage.clickAppLogo(names.logo_title);
        await settingsPage.checkProviderDropdownIsDisplayed();
    });

    it('[C286517] Should be able to set a hyperlink to the logo text', async () => {
        await headerPage.addLogoHyperlink(names.urlPath_logo_link);
        await navigationBarPage.clickAppLogoText();
        await settingsPage.checkProviderDropdownIsDisplayed();
    });

    it('[C280554] Should be able to customise the tooltip-text of the logo', async () => {
        await headerPage.addLogoTooltip(names.logo_tooltip);
        await navigationBarPage.checkLogoTooltip(names.logo_tooltip);
    });

    it('[C286297] Should be able to change the position of the sidebar menu', async () => {
        await headerPage.sideBarPositionEnd();
        await headerPage.checkSidebarPositionEnd();
        await headerPage.sideBarPositionStart();
        await headerPage.checkSidebarPositionStart();
    });
});
