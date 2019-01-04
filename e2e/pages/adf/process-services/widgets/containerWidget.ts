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

import { FormFields } from '../formFields';
import { by } from 'protractor';

export class ContainerWidget {

    formFields = new FormFields();

    fileLocator = by.css("div [class*='upload-widget__content-text']");

    getFieldText(fieldId) {
        return this.formFields.getFieldText(fieldId, this.fileLocator);
    }
}
