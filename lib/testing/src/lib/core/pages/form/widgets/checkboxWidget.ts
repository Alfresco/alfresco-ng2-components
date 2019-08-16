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
import { BrowserActions } from '../../../utils/public-api';
import { by, element } from 'protractor';
import { ElementFinder } from 'protractor';

export class CheckboxWidget {

    formFields: FormFields = new FormFields();
    checkboxLabel: ElementFinder = element(by.css('span[class*="mat-checkbox-label"]'));

    getCheckboxLabel(): Promise<string> {
        return BrowserActions.getText(this.checkboxLabel);
    }

    async clickCheckboxInput(fieldId): Promise<void> {
        const checkboxInput = element.all(by.css(`mat-checkbox[id="${fieldId}"] div`)).first();
        await BrowserActions.click(checkboxInput);
    }

    async isCheckboxDisplayed(fieldId): Promise<void> {
        await this.formFields.checkWidgetIsNotHidden(fieldId);
    }

    async isCheckboxHidden(fieldId): Promise<void> {
        await this.formFields.checkWidgetIsHidden(fieldId);
    }
}
