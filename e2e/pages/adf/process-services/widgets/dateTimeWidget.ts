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
import { Util } from '../../../../util/util';

export class DateTimeWidget {

    formFields = new FormFields();
    outsideLayer = element(by.css('div[class*="cdk-overlay-container"]'));

    checkWidgetIsVisible(fieldId) {
        return this.formFields.checkWidgetIsVisible(fieldId);
    }

    checkLabelIsVisible(fieldId) {
        return this.formFields.checkWidgetIsVisible(fieldId);
    }

    getDateTimeLabel(fieldId) {
        let label = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`));
        Util.waitUntilElementIsVisible(label);
        return label.getText();
    }

    setDateTimeInput(fieldId, value) {
        return this.formFields.setValueInInputById(fieldId, value);
    }

    clearDateTimeInput(fieldId) {
        let dateInput = element(by.id(fieldId));
        Util.waitUntilElementIsVisible(dateInput);
        return dateInput.clear();
    }

    clickOutsideWidget(fieldId) {
        let form = this.formFields.getWidget(fieldId);
        Util.waitUntilElementIsVisible(form);
        return form.click();
    }

    closeDataTimeWidget() {
        Util.waitUntilElementIsVisible(this.outsideLayer);
        return this.outsideLayer.click();
    }

    getErrorMessage(fieldId) {
        let errorMessage = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] div[class="adf-error-text"]`));
        Util.waitUntilElementIsVisible(errorMessage);
        return errorMessage.getText();
    }

    selectDay(day) {
        let selectedDay = element(by.cssContainingText('div[class*="mat-datetimepicker-calendar-body-cell-content"]', day));
        Util.waitUntilElementIsVisible(selectedDay);
        return selectedDay.click();
    }

    openDatepicker(fieldId) {
        return element(by.id(fieldId)).click();
    }

    private selectTime(time) {
        let selectedTime = element(by.cssContainingText('div[class*="mat-datetimepicker-clock-cell"]', time));
        Util.waitUntilElementIsClickable(selectedTime);
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
        Util.waitUntilElementIsVisible(this.formFields.getWidget(fieldId));

        let amountWidgetInput = element(by.id(fieldId));
        amountWidgetInput.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                amountWidgetInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }
}
