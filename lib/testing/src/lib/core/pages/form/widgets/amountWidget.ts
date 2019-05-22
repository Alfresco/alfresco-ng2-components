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

import { element, by, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';
import { FormFields } from '../formFields';

export class AmountWidget {

    currency = by.css('span[class="adf-amount-widget__prefix-spacing"]');
    formFields = new FormFields();

    getAmountFieldLabel(fieldId) {
        const label = element.all(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`)).first();
        return BrowserActions.getText(label);
    }

    getAmountFieldCurrency(fieldId) {
        return BrowserActions.getText(this.formFields.getWidget(fieldId).element(this.currency));
    }

    setFieldValue(fieldId, value) {
        return this.formFields.setValueInInputById(fieldId, value);
    }

    removeFromAmountWidget(fieldId) {
        BrowserVisibility.waitUntilElementIsVisible(this.formFields.getWidget(fieldId));

        const amountWidgetInput = element(by.id(fieldId));
        amountWidgetInput.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                amountWidgetInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }

    clearFieldValue(fieldId) {
        const numberField = element(by.id(fieldId));
        BrowserVisibility.waitUntilElementIsVisible(numberField);
        return numberField.clear();
    }

    checkWidgetIsVisible(fieldId) {
        return this.formFields.checkWidgetIsVisible(fieldId);
    }

    getErrorMessage(fieldId) {
        const errorMessage = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] div[class="adf-error-text"]`));
        return BrowserActions.getText(errorMessage);
    }

    getPlaceholder(fieldId) {
        return this.formFields.getFieldPlaceHolder(fieldId);
    }
}
