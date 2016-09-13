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

import { FormFieldModel } from './form-field.model';
import { FormFieldTypes } from './form-field-types';

export interface FormFieldValidator {

    isSupported(field: FormFieldModel): boolean;
    validate(field: FormFieldModel): boolean;

}

export class RequiredFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.TEXT,
        FormFieldTypes.MULTILINE_TEXT,
        FormFieldTypes.NUMBER
    ];

    isSupported(field: FormFieldModel): boolean {
        return field &&
            field.required &&
            this.supportedTypes.indexOf(field.type) > -1;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field)) {
            if (!field.value) {
                return false;
            }
        }
        return true;
    }

}

export class NumberFieldValidator implements FormFieldValidator {

    private supportedTypes = [
        FormFieldTypes.NUMBER
    ];

    private pattern: string = '-?[0-9]*(\.[0-9]+)?';

    isSupported(field: FormFieldModel): boolean {
        return field && this.supportedTypes.indexOf(field.type) > -1;
    }

    validate(field: FormFieldModel): boolean {
        if (this.isSupported(field)) {
            return !(this.pattern && field.value && (field.value.length > 0) && !field.value.match(new RegExp('^' + this.pattern + '$')));
        }
        return true;
    }

}
