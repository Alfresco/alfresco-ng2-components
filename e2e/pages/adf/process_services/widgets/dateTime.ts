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

import FormFields = require('../formFields');
import { element, by } from 'protractor';
import Util = require('../../../../util/util');

export class DateTime {

    formFields = new FormFields();

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

    setDateInput(fieldId, value) {
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

    getErrorMessage(fieldId) {
        let errorMessage = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] div[class="adf-error-text"]`));
        Util.waitUntilElementIsVisible(errorMessage);
        return errorMessage.getText();
    }
}
