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
import { Util } from '../../../../util/util';

export class DropdownWidget {

    formFields = new FormFields();

    selectedOptionLocator = by.css('mat-select[id="dropdown"] span span');
    dropdown = element(by.id('dropdown'));

    getSelectedOptionText(fieldId) {
        return this.formFields.getFieldText(fieldId, this.selectedOptionLocator);
    }

    selectOption(option) {
        this.openDropdown();
        let row = element(by.cssContainingText('mat-option span', option));
        return row.click();
    }

    openDropdown() {
        this.checkDropdownIsDisplayed();
        Util.waitUntilElementIsClickable(this.dropdown);
        return this.dropdown.click();
    }

    checkDropdownIsDisplayed() {
        Util.waitUntilElementIsVisible(this.dropdown);
        return this.dropdown;
    }
}
