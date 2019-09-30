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

import { element, by, Locator } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';
import { FormFields } from '../formFields';

export class AmountWidget {

    currency: Locator = by.css('span[class="adf-amount-widget__prefix-spacing"]');
    formFields: FormFields = new FormFields();

    async getAmountFieldLabel(fieldId): Promise<string> {
        const label = element.all(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`)).first();
        return BrowserActions.getText(label);
    }

    async getAmountFieldCurrency(fieldId): Promise<string> {
        const widget = await this.formFields.getWidget(fieldId);
        return await BrowserActions.getText(widget.element(this.currency));
    }

    async setFieldValue(fieldId, value): Promise<void> {
        await this.formFields.setValueInInputById(fieldId, value);
    }

    async removeFromAmountWidget(fieldId) {
        const amountWidgetInput = element(by.id(fieldId));
        await BrowserActions.clearWithBackSpace(amountWidgetInput);
    }

    async clearFieldValue(fieldId): Promise<void> {
        const numberField = element(by.id(fieldId));
        await BrowserVisibility.waitUntilElementIsVisible(numberField);
        await numberField.clear();
    }

    async checkWidgetIsVisible(fieldId): Promise<void> {
        await this.formFields.checkWidgetIsVisible(fieldId);
    }

    async getErrorMessage(fieldId): Promise<string> {
        const errorMessage = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] div[class="adf-error-text"]`));
        return BrowserActions.getText(errorMessage);
    }

    async getPlaceholder(fieldId): Promise<string> {
        return this.formFields.getFieldPlaceHolder(fieldId);
    }
}
