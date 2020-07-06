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

import { FormFields } from '../form-fields';
import { element, by } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';

export class DateWidgetPage {

    formFields = new FormFields();

    async checkWidgetIsVisible(fieldId: string): Promise<void> {
        await this.formFields.checkWidgetIsVisible(fieldId);
    }

    async checkLabelIsVisible(fieldId: string): Promise<void> {
        await this.formFields.checkWidgetIsVisible(fieldId);
    }

    async getDateLabel(fieldId: string): Promise<string> {
        const label = element.all(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`)).first();
        return BrowserActions.getText(label);
    }

    async setDateInput(fieldId: string, value: string): Promise<void> {
        await this.removeFromDatetimeWidget(fieldId);
        await this.formFields.setValueInInputById(fieldId, value);
    }

    async getDateInput(fieldId: string): Promise<string> {
        return this.formFields.getFieldValue(fieldId);
    }

    async clearDateInput(fieldId: string): Promise<void> {
        const dateInput = element(by.id(fieldId));
        await BrowserActions.clearWithBackSpace(dateInput);
    }

    async clickOutsideWidget(fieldId: string): Promise<void> {
        const form = await this.formFields.getWidget(fieldId);
        await BrowserActions.click(form);
    }

    async checkErrorMessageIsNotDisplayed(fieldId: string): Promise<void> {
        const errorMessage = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] .adf-error-text`));
        await BrowserVisibility.waitUntilElementIsNotVisible(errorMessage);
    }

    async getErrorMessage(fieldId: string): Promise<string> {
        const errorMessage = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] .adf-error-text`));
        return BrowserActions.getText(errorMessage);
    }

    async removeFromDatetimeWidget(fieldId: string): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        await BrowserVisibility.waitUntilElementIsVisible(widget);
        await BrowserActions.clearSendKeys(element(by.id(fieldId)), '');
    }
}
