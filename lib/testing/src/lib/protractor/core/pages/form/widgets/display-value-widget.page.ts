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

import { FormFields } from '../form-fields';
import { by, Locator, $ } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';
import { EditJsonDialog } from '../../../dialog/public-api';

export class DisplayValueWidgetPage {

    formFields: FormFields = new FormFields();
    labelLocator: Locator = by.css(`label[class*='adf-label']`);
    inputLocator: Locator = by.css('input');
    editJsonDialog = new EditJsonDialog();

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
        const hiddenElement = $(`adf-form-field div[id='field-${fieldId}-container'][hidden]`);
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(hiddenElement);
            return true;
        } catch {
            return false;
        }
    }

    async clickOnDisplayJsonValueWidget(fieldId: string) {
        const jsonButton = $(`adf-form-field div[id='field-${fieldId}-container'] button`);
        await BrowserActions.click(jsonButton);
        await this.editJsonDialog.checkDialogIsDisplayed();
    }

    async getDisplayJsonValueDialogContent(): Promise<any> {
        return JSON.parse(await this.editJsonDialog.getDialogContent());
    }

    async closeDisplayJsonValuedDialog() {
        await this.editJsonDialog.clickCloseButton();
        await this.editJsonDialog.checkDialogIsNotDisplayed();
    }
}
