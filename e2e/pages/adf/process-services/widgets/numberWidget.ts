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

import { element, by } from 'protractor';
import { Util } from '../../../../util/util';
import { FormFields } from '../formFields';

export class NumberWidget {

    formFields = new FormFields();

    getNumberFieldLabel(fieldId) {
        let label = element.all(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`)).first();
        Util.waitUntilElementIsVisible(label);
        return label.getText();
    }

    setFieldValue(fieldId, value) {
        return this.formFields.setValueInInputById(fieldId, value);
    }

    clearFieldValue(fieldId) {
        let numberField = element(by.id(fieldId));
        Util.waitUntilElementIsVisible(numberField);
        return numberField.clear();
    }

    checkWidgetIsVisible(fieldId) {
        return this.formFields.checkWidgetIsVisible(fieldId);
    }

    getErrorMessage(fieldId) {
        let errorMessage = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] div[class="adf-error-text"]`));
        Util.waitUntilElementIsVisible(errorMessage);
        return errorMessage.getText();
    }

    getPlaceholder(fieldId) {
        return this.formFields.getFieldPlaceHolder(fieldId);
    }
}
