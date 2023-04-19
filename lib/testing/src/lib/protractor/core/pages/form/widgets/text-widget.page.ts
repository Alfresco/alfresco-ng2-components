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
import { by, Locator } from 'protractor';

export class TextWidgetPage {

    formFields: FormFields = new FormFields();

    labelLocator: Locator = by.css(`label[class*='adf-label']`);

    getFieldLabel(fieldId): Promise<string> {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    }

    getFieldPlaceHolder(fieldId): Promise<string> {
        return this.formFields.getFieldPlaceHolder(fieldId);
    }

    async setValue(fieldId, value): Promise<void> {
        await this.formFields.setFieldValue(fieldId, value);
    }

    getFieldValue(fieldId): Promise<string> {
        return this.formFields.getFieldValue(fieldId);
    }

    getErrorMessage(fieldId): Promise<string> {
        return this.formFields.getFieldErrorMessage(fieldId);
    }

    async isWidgetVisible(fieldId): Promise<void> {
        await this.formFields.checkWidgetIsVisible(fieldId);
    }

    async isWidgetClickable(fieldId): Promise<void> {
        await this.formFields.checkWidgetIsClickable(fieldId);
    }

    async isWidgetNotVisible(fieldId): Promise<void> {
        await this.formFields.checkWidgetIsHidden(fieldId);
    }
}
