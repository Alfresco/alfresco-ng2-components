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

export class HyperlinkWidget {

    formFields = new FormFields();

    fieldLocator = by.css('div[class="adf-hyperlink-widget "] a');

    getFieldText(fieldId) {
        return this.formFields.getFieldText(fieldId, this.fieldLocator);
    }

    getFieldLabel(fieldId) {
        let label = element.all(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`)).first();
        Util.waitUntilElementIsVisible(label);
        return label.getText();
    }
}
