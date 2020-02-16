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
import { by, element, Locator } from 'protractor';
import { BrowserVisibility } from '../../../utils/public-api';

export class DisplayValueWidgetPage {

    formFields: FormFields = new FormFields();
    labelLocator: Locator = by.css("label[class*='adf-label']");
    inputLocator: Locator = by.css('input');

    getFieldLabel(fieldId): Promise<string> {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    }

    getFieldValue(fieldId): Promise<string> {
        return this.formFields.getFieldValue(fieldId, this.inputLocator);
    }

    async isDisplayValueWidgetVisible(fieldId: string): Promise<boolean> {
        try {
            await this.formFields.checkWidgetIsVisible(fieldId);
            return true;
        } catch {
            return false;
        }
    }

    async checkDisplayValueWidgetIsHidden(fieldId: string): Promise<boolean> {
        const hiddenElement = element(by.css(`adf-form-field div[id='field-${fieldId}-container'][hidden]`));
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(hiddenElement);
            return true;
        } catch {
            return false;
        }
    }
}
