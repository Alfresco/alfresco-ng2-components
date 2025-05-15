/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FormFieldModel } from '@alfresco/adf-core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { DEFAULT_OPTION } from './dropdown-cloud.widget';

export const defaultValueValidator =
    (filed: FormFieldModel): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null => {
        const optionsWithNoDefaultValue = filed.options.filter((dropdownOption) => {
            const isDefaultValue = dropdownOption.id === DEFAULT_OPTION.id && dropdownOption.name === DEFAULT_OPTION.name;

            return !isDefaultValue;
        });

        const isSomeOptionSelected = optionsWithNoDefaultValue.some((dropdownOption) => {
            const isOptionSelected = dropdownOption.id === control.value?.id;

            return isOptionSelected;
        });

        return isSomeOptionSelected ? null : { required: true };
    };
