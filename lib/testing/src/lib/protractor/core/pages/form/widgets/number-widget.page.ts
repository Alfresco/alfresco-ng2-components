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

import { $$, $ } from 'protractor';
import { FormFields } from '../form-fields';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';

export class NumberWidgetPage {

    formFields = new FormFields();

    async getNumberFieldLabel(fieldId: string): Promise<string> {
        const label = $$(`adf-form-field div[id="field-${fieldId}-container"] label`).first();
        return BrowserActions.getText(label);
    }

    getFieldValue(fieldId: string): Promise<string> {
        return this.formFields.getFieldValue(fieldId);
    }

    setFieldValue(fieldId: string, value: any): Promise<void> {
        return this.formFields.setValueInInputById(fieldId, value);
    }

    async clearFieldValue(fieldId: string): Promise<void> {
        const numberField = $(`#${fieldId}`);
        await BrowserVisibility.waitUntilElementIsVisible(numberField);
        await numberField.clear();
    }

    checkWidgetIsVisible(fieldId: string): Promise<void> {
        return this.formFields.checkWidgetIsVisible(fieldId);
    }

    async getErrorMessage(fieldId: string): Promise<string> {
        const errorMessage = $(`adf-form-field div[id="field-${fieldId}-container"] .adf-error-text`);
        return BrowserActions.getText(errorMessage);
    }

    getPlaceholder(fieldId: string): Promise<string> {
        return this.formFields.getFieldPlaceHolder(fieldId);
    }
}
