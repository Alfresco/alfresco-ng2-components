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

import { FormFields } from '../form-fields';
import { by, element } from 'protractor';
import { BrowserActions } from '../../../utils/public-api';

export class HyperlinkWidgetPage {

    formFields = new FormFields();
    fieldLocator = by.css('.adf-hyperlink-widget a');

    async getFieldText(fieldId: string): Promise<string> {
        return this.formFields.getFieldText(fieldId, this.fieldLocator);
    }

    async getFieldHref(fieldId: string): Promise<string> {
        return this.formFields.getWidget(fieldId).element(this.fieldLocator).getAttribute('href');
    }

    async getFieldLabel(fieldId: string): Promise<string> {
        const label = element.all(by.css(`adf-form-field div[id="field-${fieldId}-container"] label`)).first();
        return BrowserActions.getText(label);
    }
}
