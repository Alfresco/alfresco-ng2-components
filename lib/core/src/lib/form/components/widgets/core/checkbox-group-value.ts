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

import { FormFieldOption } from './form-field-option';

/**
 * Normalize selection arrays without selecting an implicit default.
 *
 * @param value Saved or updated selection array. Non-array values produce an empty selection.
 * @param options Available options used to resolve saved IDs.
 * @returns Selected options with duplicate IDs removed.
 */
export function getCheckboxGroupValue(value: unknown, options: FormFieldOption[]): FormFieldOption[] {
    if (!Array.isArray(value)) {
        return [];
    }
    const selected = new Map<string, FormFieldOption>();
    for (const entry of value) {
        if (typeof entry === 'string' && entry !== '') {
            const option = options.find((candidate) => candidate.id === entry);
            selected.set(entry, option ? { id: option.id, name: option.name } : { id: entry, name: entry });
        } else if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
            const option = entry as FormFieldOption;
            if (typeof option.id === 'string' && option.id !== '' && typeof option.name === 'string') {
                selected.set(option.id, { id: option.id, name: option.name });
            }
        }
    }
    return [...selected.values()];
}
