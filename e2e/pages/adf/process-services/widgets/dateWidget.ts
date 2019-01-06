/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

export class DateWidget {

    formFields = new FormFields();

    checkWidgetIsVisible(fieldId) {
        return this.formFields.checkWidgetIsVisible(fieldId);
    }

    checkLabelIsVisible(fieldId) {
        return this.formFields.checkWidgetIsVisible(fieldId);
    }

    getDateLabel(fieldId) {
        let label = element.all(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`)).first();
        Util.waitUntilElementIsVisible(label);
        return label.getText();
    }

    setDateInput(fieldId, value) {
        this.removeFromDatetimeWidget(fieldId);
        return this.formFields.setValueInInputById(fieldId, value);
    }

    clearDateInput(fieldId) {
        let dateInput = element(by.id(fieldId));
        Util.waitUntilElementIsVisible(dateInput);
        return dateInput.clear();
    }

    clickOutsideWidget(fieldId) {
        let form = this.formFields.getWidget(fieldId);
        Util.waitUntilElementIsVisible(form);
        return form.click();
    }

    getErrorMessage(fieldId) {
        let errorMessage = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] div[class="adf-error-text"]`));
        Util.waitUntilElementIsVisible(errorMessage);
        return errorMessage.getText();
    }

    removeFromDatetimeWidget(fieldId) {
        Util.waitUntilElementIsVisible(this.formFields.getWidget(fieldId));

        let dateWidgetInput = element(by.id(fieldId));
        dateWidgetInput.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                dateWidgetInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }
}
