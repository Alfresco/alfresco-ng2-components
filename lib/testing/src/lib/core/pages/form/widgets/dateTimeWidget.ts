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

import { FormFields } from '../formFields';
import { element, by, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';

export class DateTimeWidget {

    formFields = new FormFields();
    outsideLayer = element(by.css('div[class*="cdk-overlay-container"]'));

    checkWidgetIsVisible(fieldId) {
        return this.formFields.checkWidgetIsVisible(fieldId);
    }

    async getDateTimeLabel(fieldId): Promise<string> {
        const label = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`));
        return BrowserActions.getText(label);
    }

    setDateTimeInput(fieldId, value) {
        return this.formFields.setValueInInputById(fieldId, value);
    }

    async learDateTimeInput(fieldId) {
        const dateInput = element(by.id(fieldId));
        await BrowserVisibility.waitUntilElementIsVisible(dateInput);
        return dateInput.clear();
    }

    async clickOutsideWidget(fieldId): Promise<void> {
        const form = await this.formFields.getWidget(fieldId);
        await BrowserActions.click(form);
    }

    async closeDataTimeWidget(): Promise<void> {
        await BrowserActions.click(this.outsideLayer);
    }

    async getErrorMessage(fieldId): Promise<string> {
        const errorMessage = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] div[class="adf-error-text"]`));
        return BrowserActions.getText(errorMessage);
    }

    async selectDay(day): Promise<void> {
        const selectedDay = element(by.cssContainingText('div[class*="mat-datetimepicker-calendar-body-cell-content"]', day));
        await BrowserActions.click(selectedDay);
    }

    async openDatepicker(fieldId) {
        await BrowserActions.click(element(by.id(fieldId)));
    }

    async selectTime(time) {
        const selectedTime = element(by.cssContainingText('div[class*="mat-datetimepicker-clock-cell"]', time));
        await BrowserActions.click(selectedTime);
    }

    async selectHour(hour) {
        return this.selectTime(hour);
    }

    async selectMinute(minute) {
        return this.selectTime(minute);
    }

    async getPlaceholder(fieldId) {
        return this.formFields.getFieldPlaceHolder(fieldId);
    }

    async removeFromDatetimeWidget(fieldId) {
        const widget = await this.formFields.getWidget(fieldId);
        await BrowserVisibility.waitUntilElementIsVisible(widget);

        const amountWidgetInput = element(by.id(fieldId));
        amountWidgetInput.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                amountWidgetInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }
}
