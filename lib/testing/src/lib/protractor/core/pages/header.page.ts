/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { element, by, protractor, browser, $, $$ } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';

export class HeaderPage {

    checkBox = element(by.cssContainingText('.mat-checkbox-label', 'Show menu button'));
    headerColor = $('option[value="primary"]');
    titleInput = $('input[name="title"]');
    iconInput = $('input[placeholder="URL path"]');
    hexColorInput = $('input[placeholder="hex color code"]');
    logoHyperlinkInput = $('input[placeholder="Redirect URL"]');
    logoTooltipInput = $('input[placeholder="Tooltip text"]');
    positionStart = $$('mat-radio-button[value="start"]').first();
    positionEnd = $$('mat-radio-button[value="end"]').first();
    sideBarPositionRight = $('mat-sidenav.mat-drawer.mat-sidenav.mat-drawer-end');
    sideBarPositionLeft = $('mat-sidenav.mat-drawer.mat-sidenav');

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
        const checkBox = $$('mat-checkbox').first();
        await BrowserActions.click(checkBox);
    }

    async changeHeaderColor(color: string): Promise<void> {
        const headerColor = $('option[value="' + color + '"]');
        await BrowserActions.click(headerColor);
    }

    async checkAppTitle(name: string): Promise<void> {
        const title = element(by.cssContainingText('.adf-app-title', name));
        await BrowserVisibility.waitUntilElementIsVisible(title);
    }

    async addTitle(title: string): Promise<void> {
        await BrowserActions.click(this.titleInput);
        await BrowserActions.clearSendKeys(this.titleInput, title);
        await this.titleInput.sendKeys(protractor.Key.ENTER);
    }

    async checkIconIsDisplayed(url: string): Promise<void> {
        const icon = $('img[src="' + url + '"]');
        await BrowserVisibility.waitUntilElementIsVisible(icon);
    }

    async addIcon(url: string): Promise<void> {
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

    async addHexCodeColor(hexCode: string): Promise<void> {
        await BrowserActions.click(this.hexColorInput);
        await BrowserActions.clearSendKeys(this.hexColorInput, hexCode);
        await this.hexColorInput.sendKeys(protractor.Key.ENTER);
    }

    async addLogoHyperlink(hyperlink: string): Promise<void> {
        await BrowserActions.click(this.logoHyperlinkInput);
        await BrowserActions.clearSendKeys(this.logoHyperlinkInput, hyperlink);
        await this.logoHyperlinkInput.sendKeys(protractor.Key.ENTER);
    }

    async addLogoTooltip(tooltip: string): Promise<void> {
        await BrowserActions.click(this.logoTooltipInput);
        await BrowserActions.clearSendKeys(this.logoTooltipInput, tooltip);
        await this.logoTooltipInput.sendKeys(protractor.Key.ENTER);
    }

    async sideBarPositionStart(): Promise<void> {
        await BrowserActions.click(this.positionStart);
    }

    async sideBarPositionEnd(): Promise<void> {
        await browser.executeScript('arguments[0].scrollIntoView()', this.positionEnd);
        await BrowserActions.click(this.positionEnd);
    }

    async checkSidebarPositionStart(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.sideBarPositionLeft);
    }

    async checkSidebarPositionEnd(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.sideBarPositionRight);
    }

}
