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

import { element, by, protractor, browser } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';

export class HeaderPage {

    checkBox = element(by.cssContainingText('.mat-checkbox-label', 'Show menu button'));
    headerColor = element(by.css('option[value="primary"]'));
    titleInput = element(by.css('input[name="title"]'));
    iconInput = element(by.css('input[placeholder="URL path"]'));
    hexColorInput = element(by.css('input[placeholder="hex color code"]'));
    logoHyperlinkInput = element(by.css('input[placeholder="Redirect URL"]'));
    logoTooltipInput = element(by.css('input[placeholder="Tooltip text"]'));
    positionStart = element.all(by.css('mat-radio-button[value="start"]')).first();
    positionEnd = element.all(by.css('mat-radio-button[value="end"]')).first();
    sideBarPositionRight = element(by.css('mat-sidenav.mat-drawer.mat-sidenav.mat-drawer-end'));
    sideBarPositionLeft = element(by.css('mat-sidenav.mat-drawer.mat-sidenav'));

    async checkShowMenuCheckBoxIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.checkBox);
    }

    async checkChooseHeaderColourIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.headerColor);
    }

    async checkChangeTitleIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.titleInput);
    }

    async checkChangeUrlPathIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.iconInput);
    }

    async clickShowMenuButton() {
        const checkBox = element.all(by.css('mat-checkbox'));
        await BrowserVisibility.waitUntilElementIsVisible(checkBox.first());
        return checkBox.get(0).click();
    }

    async changeHeaderColor(color) {
        const headerColor = element(by.css('option[value="' + color + '"]'));
        return BrowserActions.click(headerColor);
    }

    async checkAppTitle(name) {
        const title = element(by.cssContainingText('.adf-app-title', name));
        return BrowserVisibility.waitUntilElementIsVisible(title);
    }

    async addTitle(title) {
        await BrowserActions.click(this.titleInput);
        this.titleInput.sendKeys(title);
        this.titleInput.sendKeys(protractor.Key.ENTER);
    }

    async checkIconIsDisplayed(url) {
        const icon = element(by.css('img[src="' + url + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(icon);
    }

    async addIcon(url) {
        await BrowserActions.click(this.iconInput);
        this.iconInput.sendKeys(url);
        this.iconInput.sendKeys(protractor.Key.ENTER);
    }

    async checkHexColorInputIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.hexColorInput);
    }

    async checkLogoHyperlinkInputIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.logoHyperlinkInput);
    }

    async checkLogoTooltipInputIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.logoTooltipInput);
    }

    async addHexCodeColor(hexCode) {
        await BrowserActions.click(this.hexColorInput);
        this.hexColorInput.sendKeys(hexCode);
        return this.hexColorInput.sendKeys(protractor.Key.ENTER);
    }

    async addLogoHyperlink(hyperlink) {
        await BrowserActions.click(this.logoHyperlinkInput);
        this.logoHyperlinkInput.sendKeys(hyperlink);
        return this.logoHyperlinkInput.sendKeys(protractor.Key.ENTER);
    }

    async addLogoTooltip(tooltip) {
        await BrowserActions.click(this.logoTooltipInput);
        this.logoTooltipInput.sendKeys(tooltip);
        return this.logoTooltipInput.sendKeys(protractor.Key.ENTER);
    }

    async sideBarPositionStart() {
        return BrowserActions.click(this.positionStart);
    }

    async sideBarPositionEnd() {
        await browser.executeScript('arguments[0].scrollIntoView()', this.positionEnd);
        return BrowserActions.click(this.positionEnd);
    }

    async checkSidebarPositionStart() {
        return BrowserVisibility.waitUntilElementIsVisible(this.sideBarPositionLeft);
    }

    async checkSidebarPositionEnd() {
        return BrowserVisibility.waitUntilElementIsVisible(this.sideBarPositionRight);
    }

}
