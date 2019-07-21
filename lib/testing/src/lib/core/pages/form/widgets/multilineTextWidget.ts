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
import { by, Locator } from 'protractor';

export class MultilineTextWidget {

    formFields: FormFields = new FormFields();

    valueLocator: Locator = by.css('textarea');
    labelLocator: Locator = by.css("label[class*='adf-label']");

    getFieldValue(fieldId): Promise<string> {
        return this.formFields.getFieldValue(fieldId, this.valueLocator);
    }

    getFieldLabel(fieldId): Promise<string> {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    }

    getFieldPlaceHolder(fieldId): Promise<string> {
        return this.formFields.getFieldPlaceHolder(fieldId, 'textarea');
    }

    setValue(fieldId, value): Promise<void> {
        return this.formFields.setFieldValue(by.id, fieldId, value);
    }

    getErrorMessage(fieldId): Promise<string> {
        return this.formFields.getFieldErrorMessage(fieldId);
    }

}
