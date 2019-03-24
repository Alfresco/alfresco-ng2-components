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

import { by, ElementFinder } from 'protractor';
import { Component } from './component';

export class LoginComponent extends Component {
  static selectors = {
    root: 'adf-login',

    usernameInput: by.css('input#username'),
    passwordInput: by.css('input#password'),
    passwordVisibility: by.css('.adf-login-password-icon'),
    submitButton: by.css('button#login-button'),
    errorMessage: by.css('.adf-login-error-message'),
    copyright: by.css('.adf-copyright')
  };

  usernameInput: ElementFinder = this.component.element(LoginComponent.selectors.usernameInput);
  passwordInput: ElementFinder = this.component.element(LoginComponent.selectors.passwordInput);
  submitButton: ElementFinder = this.component.element(LoginComponent.selectors.submitButton);
  errorMessage: ElementFinder = this.component.element(LoginComponent.selectors.errorMessage);
  copyright: ElementFinder = this.component.element(LoginComponent.selectors.copyright);
  passwordVisibility: ElementFinder = this.component.element(LoginComponent.selectors.passwordVisibility);

  constructor(ancestor?: ElementFinder) {
    super(LoginComponent.selectors.root, ancestor);
  }

  async enterUsername(username: string) {
    const { usernameInput } = this;

    await usernameInput.clear();
    await usernameInput.sendKeys(username);
  }

  async enterPassword(password: string) {
    const { passwordInput } = this;

    await passwordInput.clear();
    await passwordInput.sendKeys(password);
  }

  async enterCredentials(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
  }

  submit() {
    return this.submitButton.click();
  }

  async clickPasswordVisibility() {
    return await this.passwordVisibility.click();
  }

  async getPasswordVisibility() {
    const text = await this.passwordVisibility.getText();
    if (text.endsWith('visibility_off')) {
      return false;
    } else {
      if (text.endsWith('visibility')) {
        return true;
      }
    }
  }

  async isPasswordDisplayed() {
    const type = await this.passwordInput.getAttribute('type');
    if (type === 'text') {
      return true;
    } else {
      if (type === 'password') {
        return false;
      }
    }
  }

  async isUsernameEnabled() {
    return await this.usernameInput.isEnabled();
  }

  async isPasswordEnabled() {
    return await this.passwordInput.isEnabled();
  }

  async isSubmitEnabled() {
    return await this.submitButton.isEnabled();
  }

  async isPasswordHidden() {
    return !(await this.getPasswordVisibility());
  }

}
