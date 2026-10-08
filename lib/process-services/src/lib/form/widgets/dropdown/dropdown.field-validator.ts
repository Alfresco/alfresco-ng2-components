/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FormFieldModel, FormFieldTypes, FormFieldValidator } from '@alfresco/adf-core';
import { FormControl } from '@angular/forms';
import { dropdownRequiredValidator, getDropdownOptionValue, isDropdownRestField } from './dropdown.widget';
import { hasDropdownRestOptionsLoaded } from './dropdown-rest-options';

export class ProcessDropdownFieldValidator implements FormFieldValidator {
    isSupported(field: FormFieldModel): boolean {
        return field?.type === FormFieldTypes.DROPDOWN && field.required;
    }

    validate(field: FormFieldModel): boolean {
        if (!this.isSupported(field) || field.form?.isFieldOrParentHidden(field)) {
            return true;
        }

        const value = this.hasPendingOptions(field) ? field.value : getDropdownOptionValue(field, field.value);
        if (dropdownRequiredValidator(field)(new FormControl(value))) {
            field.validationSummary.message = 'FORM.FIELD.REQUIRED';
            return false;
        }

        return true;
    }

    private hasPendingOptions(field: FormFieldModel): boolean {
        // a REST dropdown is not checked against its options until its request has finished
        return (
            isDropdownRestField(field) && !hasDropdownRestOptionsLoaded(field) && !field.options.some((option) => option.id !== field.emptyOption?.id)
        );
    }
}

export const PROCESS_FORM_FIELD_VALIDATORS: FormFieldValidator[] = [new ProcessDropdownFieldValidator()];
