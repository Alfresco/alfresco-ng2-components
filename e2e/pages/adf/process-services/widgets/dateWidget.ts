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
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class DateWidget {

    formFields = new FormFields();

    checkWidgetIsVisible(fieldId) {
        return this.formFields.checkWidgetIsVisible(fieldId);
    }

    checkLabelIsVisible(fieldId) {
        return this.formFields.checkWidgetIsVisible(fieldId);
    }

    getDateLabel(fieldId) {
        const label = element.all(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`)).first();
        return BrowserActions.getText(label);
    }

    setDateInput(fieldId, value) {
        this.removeFromDatetimeWidget(fieldId);
        return this.formFields.setValueInInputById(fieldId, value);
    }

    clearDateInput(fieldId) {
        const dateInput = element(by.id(fieldId));
        BrowserVisibility.waitUntilElementIsVisible(dateInput);
        return dateInput.clear();
    }

    clickOutsideWidget(fieldId) {
        const form = this.formFields.getWidget(fieldId);
        BrowserActions.click(form);
    }

    getErrorMessage(fieldId) {
        const errorMessage = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] div[class="adf-error-text"]`));
        return BrowserActions.getText(errorMessage);
    }

    removeFromDatetimeWidget(fieldId) {
        BrowserVisibility.waitUntilElementIsVisible(this.formFields.getWidget(fieldId));

        const dateWidgetInput = element(by.id(fieldId));
        dateWidgetInput.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                dateWidgetInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }
}
