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

import { element, by, protractor } from 'protractor';

import Util = require('../../../util/util');

export class HeaderPage {

    checkBox = element(by.cssContainingText('.mat-checkbox-label', 'Show menu button'));
    headerColor = element(by.css('option[value="primary"]'));
    titleInput = element(by.css('input[name="title"]'));
    iconInput = element(by.css('input[placeholder="URL path"]'));

    checkShowMenuCheckBoxIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.checkBox);
    }

    checkChooseHeaderColourIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.headerColor);
    }

    checkChangeTitleIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.titleInput);
    }

    checkChangeUrlPathIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.iconInput);
    }

    clickShowMenuButton() {
        let checkBox = element.all(by.css('mat-checkbox'));
        Util.waitUntilElementIsVisible(checkBox);
        return checkBox.get(0).click();
    }

    changeHeaderColor(color) {
        let headerColor = element(by.css('option[value="' + color + '"]'));
        return headerColor.click();
    }

    checkAppTitle(name) {
        let title = element(by.cssContainingText('.adf-app-title', name));
        return Util.waitUntilElementIsVisible(title);
    }

    addTitle(title) {
        Util.waitUntilElementIsVisible(this.titleInput);
        this.titleInput.click();
        this.titleInput.sendKeys(title);
        this.titleInput.sendKeys(protractor.Key.ENTER);
    }

    checkIconIsDisplayed(url) {
        let icon = element(by.css('img[src="' + url + '"]'));
        Util.waitUntilElementIsVisible(icon);
    }

    addIcon(url) {
        Util.waitUntilElementIsVisible(this.iconInput);
        this.iconInput.click();
        this.iconInput.sendKeys(url);
        this.iconInput.sendKeys(protractor.Key.ENTER);
    }
}
