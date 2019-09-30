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

import { browser, by, ElementFinder, Locator } from 'protractor';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';
import { BrowserActions } from '../../../core/utils/browser-actions';

export class SearchSliderPage {

    filter: ElementFinder;
    slider: Locator = by.css('mat-slider[data-automation-id="slider-range"]');
    clearButton: Locator = by.css('button[data-automation-id="slider-btn-clear"]');
    sliderWithThumbLabel: Locator = by.css('mat-slider[data-automation-id="slider-range"][class*="mat-slider-thumb-label-showing"]');

    constructor(filter: ElementFinder) {
        this.filter = filter;
    }

    async getMaxValue() {
        return await this.filter.element(this.slider).getAttribute('aria-valuemax');
    }

    async getMinValue() {
        return await this.filter.element(this.slider).getAttribute('aria-valuemin');
    }

    async getValue() {
        return await this.filter.element(this.slider).getAttribute('aria-valuenow');
    }

    async setValue(value: number): Promise<void> {
        const elem = this.filter.element(this.slider).element(by.css('div[class="mat-slider-wrapper"]'));
        await browser.actions().mouseMove(elem, { x: 0, y: 0 }).perform();
        await browser.actions().mouseDown().mouseMove({x: value * 10, y: 0}).mouseUp().perform();
    }

    async checkSliderIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.slider));
    }

    async checkSliderIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.slider));
    }

    async checkSliderWithThumbLabelIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.sliderWithThumbLabel));
    }

    async clickClearButton(): Promise<void> {
        await BrowserActions.click(this.filter.element(this.clearButton));
    }

    async checkClearButtonIsEnabled() {
        return await this.filter.element(this.clearButton).isEnabled();
    }

    async checkClearButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.clearButton));
    }

    async checkClearButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.clearButton));
    }
}
