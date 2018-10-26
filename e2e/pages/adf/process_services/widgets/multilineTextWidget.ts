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
import { by } from 'protractor';

export class MultilineTextWidget {

    formFields = new FormFields();

    valueLocator = by.css('textarea');
    labelLocator = by.css("label[class*='adf-label']");

    getFieldValue(fieldId) {
        return this.formFields.getFieldValue(fieldId, this.valueLocator);
    }

    getFieldLabel(fieldId) {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    }

    getFieldPlaceHolder(fieldId) {
        return this.formFields.getFieldPlaceHolder(fieldId, 'textarea');
    }

    setValue(fieldId, value) {
        return this.formFields.setFieldValue(by.id, fieldId, value);
    }

    getErrorMessage(fieldId) {
        return this.formFields.getFieldErrorMessage(fieldId);
    }

}
