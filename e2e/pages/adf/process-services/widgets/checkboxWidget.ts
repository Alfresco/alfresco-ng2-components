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
import { BrowserActions } from '@alfresco/adf-testing';
import { by, element } from 'protractor';

export class CheckboxWidget {

    formFields = new FormFields();
    checkboxLabel = element(by.css('span[class*="mat-checkbox-label"]'));

    getCheckboxLabel() {
        return BrowserActions.getText(this.checkboxLabel);
    }

    clickCheckboxInput(fieldId) {
        const checkboxInput = element.all(by.css(`mat-checkbox[id="${fieldId}"] div`)).first();
        BrowserActions.click(checkboxInput);
    }

    isCheckboxDisplayed(fieldId) {
        return this.formFields.checkWidgetIsVisible(fieldId);
    }

    isCheckboxHidden(fieldId) {
        return this.formFields.checkWidgetIsHidden(fieldId);
    }
}
