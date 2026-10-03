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
import {
    DEFAULT_OPTION,
    getDropdownCloudRequiredValidators,
    isDropdownCloudLinkedField,
    isDropdownCloudRestField,
    isDropdownCloudValidValue,
    resolveDropdownCloudVariableOptions,
    toDropdownCloudControlValue
} from './dropdown-cloud.widget';

export class DropdownCloudFieldValidator implements FormFieldValidator {
    isSupported(field: FormFieldModel): boolean {
        return field?.type === FormFieldTypes.DROPDOWN && field.required;
    }

    validate(field: FormFieldModel): boolean {
        if (!this.isSupported(field) || field.readOnly || field.inputDisabled || field.form?.isFieldOrParentHidden(field)) {
            return true;
        }

        if (this.hasMissingSelection(field)) {
            field.validationSummary.message = 'FORM.FIELD.REQUIRED';
            return false;
        }

        return true;
    }

    private hasMissingSelection(field: FormFieldModel): boolean {
        // REST and linked options load at runtime, so only an empty selection is reported
        if (isDropdownCloudRestField(field) || isDropdownCloudLinkedField(field)) {
            const controlValue = toDropdownCloudControlValue(field.value);
            return !controlValue || (!Array.isArray(controlValue) && controlValue.id === DEFAULT_OPTION.id);
        }

        let options = field.options;
        let value = field.value;
        if (field.optionType === 'variable') {
            const variableOptions = resolveDropdownCloudVariableOptions(field);
            options = variableOptions?.options ?? [];
            if (variableOptions) {
                value = isDropdownCloudValidValue(value, options) ? value : '';
            }
        }

        return new FormControl(toDropdownCloudControlValue(value), getDropdownCloudRequiredValidators(field, options)).invalid;
    }
}
