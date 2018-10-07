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

import { MultilineText } from './multilineText';
import FormFields = require('../formFields');

export class Hyperlink {

    formFields = new FormFields();

    fieldLocator = by.css('div[class="adf-hyperlink-widget "] a');

    getFieldText(fieldId) {
        return this.formFields.getFieldText(fieldId, this.fieldLocator);
    }

}
