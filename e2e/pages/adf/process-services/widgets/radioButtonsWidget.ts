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
import { by, element } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class RadioButtonsWidget {

    selectedOption = by.css('mat-radio-button[ng-pristine]');

    formFields = new FormFields();

    getSpecificOptionLabel(fieldId, optionNumber) {
        const optionLocator = by.css('label[for*="radiobuttons-option_' + optionNumber + '"]');

        const option = this.formFields.getWidget(fieldId).element(optionLocator);
        return BrowserActions.getText(option);
    }

    selectOption(fieldId, optionNumber) {
        const optionLocator = by.css(`label[for*="${fieldId}-option_${optionNumber}"]`);

        const option = this.formFields.getWidget(fieldId).element(optionLocator);
        return BrowserActions.click(option);

    }

    isSelectionClean(fieldId) {
        const option = this.formFields.getWidget(fieldId).element(this.selectedOption);
        return BrowserVisibility.waitUntilElementIsNotVisible(option);
    }

    getRadioWidgetLabel(fieldId) {
        const label = element.all(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`)).first();
        return BrowserActions.getText(label);
    }

}
