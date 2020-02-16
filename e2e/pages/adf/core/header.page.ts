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

import { element, by, protractor, ElementFinder } from 'protractor';

import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class HeaderPage {

    checkBox: ElementFinder = element(by.cssContainingText('.mat-checkbox-label', 'Show menu button'));
    headerColor: ElementFinder = element(by.css('option[value="primary"]'));
    titleInput: ElementFinder = element(by.css('input[name="title"]'));
    iconInput: ElementFinder = element(by.css('input[placeholder="URL path"]'));
    hexColorInput: ElementFinder = element(by.css('input[placeholder="hex color code"]'));
    logoHyperlinkInput: ElementFinder = element(by.css('input[placeholder="Redirect URL"]'));
    logoTooltipInput: ElementFinder = element(by.css('input[placeholder="Tooltip text"]'));
    positionStart: ElementFinder = element.all(by.css('mat-radio-button[value="start"]')).first();
    positionEnd: ElementFinder = element.all(by.css('mat-radio-button[value="end"]')).first();
    sideBarPositionRight: ElementFinder = element(by.css('mat-sidenav.mat-drawer.mat-sidenav.mat-drawer-end'));
    sideBarPositionLeft: ElementFinder = element(by.css('mat-sidenav.mat-drawer.mat-sidenav'));

    async checkShowMenuCheckBoxIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.checkBox);
    }

    async checkChooseHeaderColourIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.headerColor);
    }

    async checkChangeTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.titleInput);
    }

    async checkChangeUrlPathIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.iconInput);
    }

    async clickShowMenuButton(): Promise<void> {
        const checkBox: ElementFinder = element(by.css('mat-checkbox'));
        await BrowserActions.click(checkBox.get(0));
    }

    async changeHeaderColor(color): Promise<void> {
        const headerColor: ElementFinder = element(by.css('option[value="' + color + '"]'));
        await BrowserActions.click(headerColor);
    }

    async checkAppTitle(name): Promise<void> {
        const title: ElementFinder = element(by.cssContainingText('.adf-app-title', name));
        await BrowserVisibility.waitUntilElementIsVisible(title);
    }

    async addTitle(title): Promise<void> {
        await BrowserActions.click(this.titleInput);
        await BrowserActions.clearSendKeys(this.titleInput, title);
        await this.titleInput.sendKeys(protractor.Key.ENTER);
    }

    async checkIconIsDisplayed(url): Promise<void> {
        const icon: ElementFinder = element(by.css('img[src="' + url + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(icon);
    }

    async addIcon(url): Promise<void> {
        await BrowserActions.click(this.iconInput);
        await BrowserActions.clearSendKeys(this.iconInput, url);
        await this.iconInput.sendKeys(protractor.Key.ENTER);
    }

    async checkHexColorInputIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.hexColorInput);
    }

    async checkLogoHyperlinkInputIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.logoHyperlinkInput);
    }

    async checkLogoTooltipInputIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.logoTooltipInput);
    }

    async addHexCodeColor(hexCode): Promise<void> {
        await BrowserActions.click(this.hexColorInput);
        await this.hexColorInput.sendKeys(hexCode);
        await this.hexColorInput.sendKeys(protractor.Key.ENTER);
    }

    async addLogoHyperlink(hyperlink): Promise<void> {
        await BrowserActions.click(this.logoHyperlinkInput);
        await this.logoHyperlinkInput.sendKeys(hyperlink);
        await this.logoHyperlinkInput.sendKeys(protractor.Key.ENTER);
    }

    async addLogoTooltip(tooltip): Promise<void> {
        await BrowserActions.click(this.logoTooltipInput);
        await this.logoTooltipInput.sendKeys(tooltip);
        await this.logoTooltipInput.sendKeys(protractor.Key.ENTER);
    }

    async sideBarPositionStart(): Promise<void> {
        await BrowserActions.click(this.positionStart);
    }

    async sideBarPositionEnd(): Promise<void> {
        await BrowserActions.click(this.positionEnd);
    }

    async checkSidebarPositionStart(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.sideBarPositionLeft);
    }

    async checkSidebarPositionEnd(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.sideBarPositionRight);
    }

}
