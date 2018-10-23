/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import FormFields = require('../formFields');
import Util = require('../../../../util/util');
import { by, element } from 'protractor';

export class RadioButtonsWidget {

    selectedOption = by.css('mat-radio-button[ng-reflect-checked="false"]');

    formFields = new FormFields();

    getSpecificOptionLabel(fieldId, optionNumber) {
        let optionLocator = by.css('label[for*="radiobuttons-option_' + optionNumber + '"] div[class*="content"]');

        let option = this.formFields.getWidget(fieldId).element(optionLocator);
        Util.waitUntilElementIsVisible(option);
        return option.getText();
    }

    selectOption(fieldId, optionNumber) {
        let optionLocator = by.css(`label[for*="${fieldId}-option_${optionNumber}"] div[class*="content"]`);

        let option = this.formFields.getWidget(fieldId).element(optionLocator);
        Util.waitUntilElementIsVisible(option);
        return option.click();
    }

    isSelectionClean(fieldId) {
        let option = this.formFields.getWidget(fieldId).element(this.selectedOption);
        return Util.waitUntilElementIsNotVisible(option);
    }

    getRadioWidgetLabel(fieldId) {
        let label = element(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`));
        Util.waitUntilElementIsVisible(label);
        return label.getText();
    }

}
