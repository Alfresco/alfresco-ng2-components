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

import { FormControllersPage } from './form-controller.page';
import { browser, by, element } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { LocalStorageUtil } from '../utils/local-storage.util';
import { BrowserActions } from '../utils/browser-actions';
import { ElementFinder } from 'protractor';

export class LoginPage {

    loginURL: string = browser.baseUrl + '/login';

    formControllersPage: FormControllersPage = new FormControllersPage();
    txtUsername: ElementFinder = element(by.css('input[id="username"]'));
    txtPassword: ElementFinder = element(by.css('input[id="password"]'));
    logoImg: ElementFinder = element(by.css('img[id="adf-login-img-logo"]'));
    successRouteTxt: ElementFinder = element(by.css('input[data-automation-id="adf-success-route"]'));
    logoTxt: ElementFinder = element(by.css('input[data-automation-id="adf-url-logo"]'));
    usernameTooltip: ElementFinder = element(by.css('span[data-automation-id="username-error"]'));
    passwordTooltip: ElementFinder = element(by.css('span[data-automation-id="password-required"]'));
    loginTooltip: ElementFinder = element(by.css('span[class="adf-login-error-message"]'));
    usernameInactive: ElementFinder = element(by.css('input[id="username"][aria-invalid="false"]'));
    passwordInactive: ElementFinder = element(by.css('input[id="password"][aria-invalid="false"]'));
    adfLogo: ElementFinder = element(by.css('img[class="adf-img-logo ng-star-inserted"]'));
    usernameHighlighted: ElementFinder = element(by.css('input[id="username"][aria-invalid="true"]'));
    passwordHighlighted: ElementFinder = element(by.css('input[id="password"][aria-invalid="true"]'));
    signInButton: ElementFinder = element(by.id('login-button'));
    showPasswordElement: ElementFinder = element(by.css('button[data-automation-id="show_password"]'));
    hidePasswordElement: ElementFinder = element(by.css('button[data-automation-id="hide_password"]'));
    rememberMe: ElementFinder = element(by.css('mat-checkbox[id="adf-login-remember"]'));
    needHelp: ElementFinder = element(by.css('div[id="adf-login-action-left"]'));
    register: ElementFinder = element(by.css('div[id="adf-login-action-right"]'));
    footerSwitch: ElementFinder = element(by.id('switch4'));
    rememberMeSwitch: ElementFinder = element(by.id('adf-toggle-show-rememberme'));
    successRouteSwitch: ElementFinder = element(by.id('adf-toggle-show-successRoute'));
    logoSwitch: ElementFinder = element(by.id('adf-toggle-logo'));
    header: ElementFinder = element(by.id('adf-header'));
    settingsIcon: ElementFinder = element(by.cssContainingText('a[data-automation-id="settings"] mat-icon', 'settings'));
    sidenavLayout = element(by.css(`[data-automation-id="sidenav-layout"]`));

    async goToLoginPage(): Promise<void> {
        await browser.get(this.loginURL);
        await this.waitForElements();
    }

    async waitForElements(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.txtUsername);
        await BrowserVisibility.waitUntilElementIsVisible(this.txtPassword);
    }

    async enterUsername(username): Promise<void> {
        await BrowserActions.clearSendKeys(this.txtUsername, username);
    }

    async enterPassword(password): Promise<void> {
        await BrowserActions.clearSendKeys(this.txtPassword, password);
    }

    async clearUsername(): Promise<void> {
        await BrowserActions.click(this.txtUsername);
        await BrowserActions.clearWithBackSpace(this.txtUsername);
    }

    async clearPassword(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.txtPassword);
        await BrowserActions.clearWithBackSpace(this.txtPassword);
    }

    async getUsernameTooltip(): Promise<string> {
        return BrowserActions.getText(this.usernameTooltip);
    }

    async getPasswordTooltip(): Promise<string> {
        return BrowserActions.getText(this.passwordTooltip);
    }

    async getLoginError(): Promise<string> {
        return BrowserActions.getText(this.loginTooltip);
    }

    async checkLoginImgURL(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.logoImg);
        return this.logoImg.getAttribute('src');
    }

    async checkUsernameInactive(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.usernameInactive);
    }

    async checkPasswordInactive(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.passwordInactive);
    }

    async checkUsernameHighlighted(): Promise<void> {
        await BrowserActions.click(this.adfLogo);
        await BrowserVisibility.waitUntilElementIsVisible(this.usernameHighlighted);
    }

    async checkPasswordHighlighted(): Promise<void> {
        await BrowserActions.click(this.adfLogo);
        await BrowserVisibility.waitUntilElementIsVisible(this.passwordHighlighted);
    }

    async checkUsernameTooltipIsNotVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.usernameTooltip);
    }

    async checkPasswordTooltipIsNotVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.passwordTooltip);
    }

    async getSignInButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.signInButton);
        return await this.signInButton.isEnabled();
    }

    async loginToAllUsingUserModel(userModel): Promise<void> {
        await this.goToLoginPage();
        await LocalStorageUtil.clearStorage();
        await LocalStorageUtil.setStorageItem('providers', 'ALL');
        await LocalStorageUtil.apiReset();
        await this.login(userModel.email, userModel.password);
    }

    async loginToProcessServicesUsingUserModel(userModel): Promise<void> {
        await this.goToLoginPage();
        await LocalStorageUtil.clearStorage();
        await LocalStorageUtil.setStorageItem('providers', 'BPM');
        await LocalStorageUtil.apiReset();
        await this.login(userModel.email, userModel.password);
    }

    async loginToContentServicesUsingUserModel(userModel): Promise<void> {
        await this.goToLoginPage();
        await LocalStorageUtil.clearStorage();
        await LocalStorageUtil.setStorageItem('providers', 'ECM');
        await LocalStorageUtil.apiReset();
        await this.login(userModel.getId(), userModel.getPassword());
    }

    async loginToContentServices(username, password): Promise<void> {
        await this.goToLoginPage();
        await LocalStorageUtil.clearStorage();
        await LocalStorageUtil.setStorageItem('providers', 'ECM');
        await LocalStorageUtil.apiReset();
        await this.login(username, password);
    }

    async clickSignInButton(): Promise<void> {
        await BrowserActions.click(this.signInButton);
    }

    async clickSettingsIcon(): Promise<void> {
        await BrowserActions.click(this.settingsIcon);
    }

    async showPassword(): Promise<void> {
        await BrowserActions.click(this.showPasswordElement);
    }

    async hidePassword(): Promise<void> {
        await BrowserActions.click(this.hidePasswordElement);
    }

    async getShownPassword(): Promise<string> {
        return this.txtPassword.getAttribute('value');
    }

    async checkPasswordIsHidden(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.txtPassword);
    }

    async checkRememberIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rememberMe);
    }

    async checkRememberIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.rememberMe);
    }

    async checkNeedHelpIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.needHelp);
    }

    async checkNeedHelpIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.needHelp);
    }

    async checkRegisterDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.register);
    }

    async checkRegisterIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.register);
    }

    async enableFooter(): Promise<void> {
        await this.formControllersPage.enableToggle(this.footerSwitch);
    }

    async disableFooter(): Promise<void> {
        await this.formControllersPage.disableToggle(this.footerSwitch);
    }

    async disableRememberMe(): Promise<void> {
        await this.formControllersPage.disableToggle(this.rememberMeSwitch);
    }

    async enableSuccessRouteSwitch(): Promise<void> {
        await this.formControllersPage.enableToggle(this.successRouteSwitch);
    }

    async enableLogoSwitch(): Promise<void> {
        await this.formControllersPage.enableToggle(this.logoSwitch);
    }

    async enterSuccessRoute(route): Promise<void> {
        await BrowserActions.clearSendKeys(this.successRouteTxt, route);
    }

    async enterLogo(logo): Promise<void> {
        await BrowserActions.clearSendKeys(this.logoTxt, logo);
    }

    async login(username, password): Promise<void> {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickSignInButton();
        await BrowserVisibility.waitUntilElementIsVisible(this.sidenavLayout);
    }
}
