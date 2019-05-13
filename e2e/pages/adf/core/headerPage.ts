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

import { element, by, protractor } from 'protractor';

import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

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

    checkShowMenuCheckBoxIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.checkBox);
    }

    checkChooseHeaderColourIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.headerColor);
    }

    checkChangeTitleIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.titleInput);
    }

    checkChangeUrlPathIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.iconInput);
    }

    clickShowMenuButton() {
        const checkBox = element(by.css('mat-checkbox'));
        BrowserVisibility.waitUntilElementIsVisible(checkBox);
        return checkBox.get(0).click();
    }

    changeHeaderColor(color) {
        const headerColor = element(by.css('option[value="' + color + '"]'));
        BrowserActions.click(headerColor);
    }

    checkAppTitle(name) {
        const title = element(by.cssContainingText('.adf-app-title', name));
        return BrowserVisibility.waitUntilElementIsVisible(title);
    }

    addTitle(title) {
        BrowserActions.click(this.titleInput);
        this.titleInput.sendKeys(title);
        this.titleInput.sendKeys(protractor.Key.ENTER);
    }

    checkIconIsDisplayed(url) {
        const icon = element(by.css('img[src="' + url + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(icon);
    }

    addIcon(url) {
        BrowserActions.click(this.iconInput);
        this.iconInput.sendKeys(url);
        this.iconInput.sendKeys(protractor.Key.ENTER);
    }

    checkHexColorInputIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.hexColorInput);
    }

    checkLogoHyperlinkInputIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.logoHyperlinkInput);
    }

    checkLogoTooltipInputIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.logoTooltipInput);
    }

    addHexCodeColor(hexCode) {
        BrowserActions.click(this.hexColorInput);
        this.hexColorInput.sendKeys(hexCode);
        return this.hexColorInput.sendKeys(protractor.Key.ENTER);
    }

    addLogoHyperlink(hyperlink) {
        BrowserActions.click(this.logoHyperlinkInput);
        this.logoHyperlinkInput.sendKeys(hyperlink);
        return this.logoHyperlinkInput.sendKeys(protractor.Key.ENTER);
    }

    addLogoTooltip(tooltip) {
        BrowserActions.click(this.logoTooltipInput);
        this.logoTooltipInput.sendKeys(tooltip);
        return this.logoTooltipInput.sendKeys(protractor.Key.ENTER);
    }

    sideBarPositionStart() {
        BrowserActions.click(this.positionStart);
    }

    sideBarPositionEnd() {
        BrowserActions.click(this.positionEnd);
    }

    checkSidebarPositionStart() {
        return BrowserVisibility.waitUntilElementIsVisible(this.sideBarPositionLeft);
    }

    checkSidebarPositionEnd() {
        return BrowserVisibility.waitUntilElementIsVisible(this.sideBarPositionRight);
    }

}
