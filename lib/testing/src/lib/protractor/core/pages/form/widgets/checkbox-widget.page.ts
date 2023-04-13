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
import { BrowserActions } from '../../../utils/public-api';
import { $$, $ } from 'protractor';

export class CheckboxWidgetPage {

    formFields = new FormFields();
    checkboxLabel = $('span[class*="mat-checkbox-label"]');
    checkboxLocator = ('mat-checkbox');

    getCheckboxLabel(): Promise<string> {
        return BrowserActions.getText(this.checkboxLabel);
    }

    async clickCheckboxInput(fieldId: string): Promise<void> {
        const checkboxInput = $$(`mat-checkbox[id="${fieldId}"] span`).first();
        await BrowserActions.click(checkboxInput);
    }

    async isCheckboxDisplayed(fieldId: string): Promise<void> {
        await this.formFields.checkWidgetIsVisible(fieldId);
    }

    async isCheckboxHidden(fieldId: string): Promise<void> {
        await this.formFields.checkWidgetIsHidden(fieldId);
    }

    async isCheckboxChecked(fieldId: string): Promise<boolean> {
        const checkboxWidget = await (await this.formFields.getWidget(fieldId)).$(this.checkboxLocator);
        const attributeValue =  await BrowserActions.getAttribute(checkboxWidget, 'class');
        return attributeValue.includes('mat-checkbox-checked');
    }
}
