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
import { BrowserVisibility } from '@alfresco/adf-testing';

export class DateTimeWidget {

    formFields = new FormFields();
    outsideLayer = element(by.css('div[class*="cdk-overlay-container"]'));

    checkWidgetIsVisible(fieldId) {
        return this.formFields.checkWidgetIsVisible(fieldId);
    }

    getDateTimeLabel(fieldId) {
        const label = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`));
        BrowserVisibility.waitUntilElementIsVisible(label);
        return label.getText();
    }

    setDateTimeInput(fieldId, value) {
        return this.formFields.setValueInInputById(fieldId, value);
    }

    clearDateTimeInput(fieldId) {
        const dateInput = element(by.id(fieldId));
        BrowserVisibility.waitUntilElementIsVisible(dateInput);
        return dateInput.clear();
    }

    clickOutsideWidget(fieldId) {
        const form = this.formFields.getWidget(fieldId);
        BrowserVisibility.waitUntilElementIsVisible(form);
        return form.click();
    }

    closeDataTimeWidget() {
        BrowserVisibility.waitUntilElementIsVisible(this.outsideLayer);
        return this.outsideLayer.click();
    }

    getErrorMessage(fieldId) {
        const errorMessage = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] div[class="adf-error-text"]`));
        BrowserVisibility.waitUntilElementIsVisible(errorMessage);
        return errorMessage.getText();
    }

    selectDay(day) {
        const selectedDay = element(by.cssContainingText('div[class*="mat-datetimepicker-calendar-body-cell-content"]', day));
        BrowserVisibility.waitUntilElementIsVisible(selectedDay);
        return selectedDay.click();
    }

    openDatepicker(fieldId) {
        return element(by.id(fieldId)).click();
    }

    private selectTime(time) {
        const selectedTime = element(by.cssContainingText('div[class*="mat-datetimepicker-clock-cell"]', time));
        BrowserVisibility.waitUntilElementIsClickable(selectedTime);
        return selectedTime.click();
    }

    selectHour(hour) {
        return this.selectTime(hour);
    }

    selectMinute(minute) {
        return this.selectTime(minute);
    }

    getPlaceholder(fieldId) {
        return this.formFields.getFieldPlaceHolder(fieldId);
    }

    removeFromDatetimeWidget(fieldId) {
        BrowserVisibility.waitUntilElementIsVisible(this.formFields.getWidget(fieldId));

        const amountWidgetInput = element(by.id(fieldId));
        amountWidgetInput.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                amountWidgetInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }
}
