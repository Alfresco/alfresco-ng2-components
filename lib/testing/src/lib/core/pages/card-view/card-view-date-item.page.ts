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

import { element, by, ElementFinder } from 'protractor';
import { DateTimePickerPage } from '../material/date-time-picker.page';
import { DatePickerPage } from '../material/date-picker.page';
import { BrowserVisibility } from '../../utils/browser-visibility';

export class CardDateItemPage {

    rootElement: ElementFinder;
    dateTimePickerPage: DateTimePickerPage;
    datePickerPage = new DatePickerPage();

    labelLocator = by.css('div[data-automation-id*="card-date-label"]');
    valueLocator = by.css('span[data-automation-id*="card-date"]');
    dateTimePicker = element.all(by.css('.mat-datetimepicker-toggle')).first();
    saveButton = by.css('button[data-automation-id*="card-dateitem-update"]');

    constructor(label: string = 'minDate') {
        this.rootElement = element(by.xpath(`//div[contains(@data-automation-id, "label-${label}")]/ancestor::adf-card-view-dateitem`));
        this.dateTimePickerPage = new DateTimePickerPage(this.rootElement);
    }

    async setTodayDateValue(): Promise<void> {
        await this.dateTimePickerPage.setTodayDateValue();
    }

    async setDateValue(date: string): Promise<boolean> {
        return this.dateTimePickerPage.setDate(date);
    }

    async getDateValue(): Promise<string> {
        return this.rootElement.element(this.valueLocator).getText();
    }

    async checkLabelIsVisible(): Promise<void> {
        const labelElement = this.rootElement.element(this.labelLocator);
        await BrowserVisibility.waitUntilElementIsVisible(labelElement);
    }
}
