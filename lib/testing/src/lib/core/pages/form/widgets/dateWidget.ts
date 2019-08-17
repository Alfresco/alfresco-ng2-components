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
import { element, by } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';

export class DateWidget {

    formFields: FormFields = new FormFields();

    async checkWidgetIsVisible(fieldId): Promise<void> {
        await this.formFields.checkWidgetIsVisible(fieldId);
    }

    async checkLabelIsVisible(fieldId): Promise<void> {
        await this.formFields.checkWidgetIsVisible(fieldId);
    }

    async getDateLabel(fieldId): Promise<string> {
        const label = element.all(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`)).first();
        return BrowserActions.getText(label);
    }

    async setDateInput(fieldId, value): Promise<void> {
        await this.removeFromDatetimeWidget(fieldId);
        await this.formFields.setValueInInputById(fieldId, value);
    }

    async getDateInput(fieldId): Promise<string> {
        return this.formFields.getFieldValue(fieldId);
    }

    async clearDateInput(fieldId): Promise<void> {
        const dateInput = element(by.id(fieldId));
        await BrowserActions.clearWithBackSpace(dateInput);
    }

    async clickOutsideWidget(fieldId): Promise<void> {
        const form = await this.formFields.getWidget(fieldId);
        await BrowserActions.click(form);
    }

    async getErrorMessage(fieldId): Promise<string> {
        const errorMessage = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] div[class="adf-error-text"]`));
        return BrowserActions.getText(errorMessage);
    }

    async removeFromDatetimeWidget(fieldId): Promise<void> {
        const widget = await this.formFields.getWidget(fieldId);
        await BrowserVisibility.waitUntilElementIsVisible(widget);
        await BrowserActions.clearSendKeys(element(by.id(fieldId)), '');
    }
}
