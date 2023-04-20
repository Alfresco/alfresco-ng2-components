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

import { FormFields } from '../form-fields';
import { element, by, $ } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';

export class DateTimeWidgetPage {

    formFields = new FormFields();
    outsideLayer = $('div[class*="cdk-overlay-container"]');

    async checkWidgetIsVisible(fieldId: string): Promise<void> {
        await this.formFields.checkWidgetIsVisible(fieldId);
    }

    async getDateTimeLabel(fieldId: string): Promise<string> {
        const label = $(`adf-form-field div[id="field-${fieldId}-container"] label`);
        return BrowserActions.getText(label);
    }

    async setDateTimeInput(fieldId: string, value: string): Promise<void> {
        await this.formFields.setValueInInputById(fieldId, value);
    }

    async clickOutsideWidget(fieldId: string): Promise<void> {
        const form = await this.formFields.getWidget(fieldId);
        await BrowserActions.click(form);
    }

    async closeDataTimeWidget(): Promise<void> {
        await BrowserActions.click(this.outsideLayer);
    }

    async getErrorMessage(fieldId: string): Promise<string> {
        const errorMessage = $(`adf-form-field div[id="field-${fieldId}-container"] .adf-error-text`);
        return BrowserActions.getText(errorMessage);
    }

    async selectDay(day: string): Promise<void> {
        const selectedDay = element(by.cssContainingText('div[class*="mat-datetimepicker-calendar-body-cell-content"]', day));
        await BrowserActions.click(selectedDay);
    }

    async openDatepicker(fieldId: string): Promise<void> {
        await BrowserActions.click($(`#${fieldId}`));
    }

    async selectTime(time: string): Promise<void> {
        const selectedTime = element.all(by.cssContainingText('div[class*="mat-datetimepicker-clock-cell"]', time)).first();
        await BrowserActions.click(selectedTime);
    }

    async selectHour(hour: string): Promise<void> {
        return this.selectTime(hour);
    }

    async selectMinute(minute: string): Promise<void> {
        return this.selectTime(minute);
    }

    async getPlaceholder(fieldId: string): Promise<string> {
        return this.formFields.getFieldPlaceHolder(fieldId);
    }

    async removeFromDatetimeWidget(fieldId: string): Promise<void> {
        const amountWidgetInput = $(`#${fieldId}`);
        await BrowserVisibility.waitUntilElementIsVisible(await this.formFields.getWidget(fieldId));
        await BrowserActions.clearWithBackSpace(amountWidgetInput);
    }

    async clearDateTimeInput(fieldId: string): Promise<void> {
        const dateInput = $(`#${fieldId}`);
        await BrowserVisibility.waitUntilElementIsVisible(dateInput);
        await dateInput.clear();
    }

}
