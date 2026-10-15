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

import { Injectable } from '@angular/core';
import { format, isValid, parse } from 'date-fns';
import { FormFieldModel, FormFieldValidator, FormModel, FormOutcomeModel, WidgetVisibilityService } from '../../../../src/lib/form/public-api';
import { WidgetVisibilityModel } from '../../../../src/lib/form/models/widget-visibility.model';
import { FormSnapshot } from './form-engine-driver';

export type IntentionalDifferenceGroup = 'decision' | 'widget fix' | 'bug fix';

/**
 * A behaviour the new engine changes on purpose. The parity harness applies it to the current engine, so the
 * comparison expects the new behaviour while everything else must still match.
 */
export interface IntentionalDifference {
    id: string;
    group: IntentionalDifferenceGroup;
    description: string;
    configure?(form: FormModel): void;
    adjust?(form: FormModel, snapshot: FormSnapshot): void;
    correctsVisibility?: boolean;
}

const PEOPLE_TYPES: ReadonlySet<string> = new Set(['people', 'functional-group']);

/**
 * Builds a validator the way the current engine expects: `FormFieldModel.validate()` calls `validate` on every field,
 * so `validate` checks support itself and skips hidden fields.
 *
 * @param isSupported whether the validator applies to the field
 * @param passes the check for a supported, visible field
 * @returns the validator
 */
const fieldValidator = (isSupported: (field: FormFieldModel) => boolean, passes: (field: FormFieldModel) => boolean): FormFieldValidator => ({
    isSupported,
    validate: (field: FormFieldModel) => !isSupported(field) || field.form?.isFieldOrParentHidden(field) || passes(field)
});

const emptyPeopleListValidator = fieldValidator(
    (field) => PEOPLE_TYPES.has(field.type) && field.required,
    (field) => !Array.isArray(field.value) || field.value.length > 0
);

const requiredCustomWidgetValidator = fieldValidator(
    (field) => !!field.json?.isCustomType && !!field.json?.valueType && field.required,
    (field) => field.value !== null && field.value !== undefined && `${field.value}`.trim() !== ''
);

export const INTENTIONAL_DIFFERENCES: IntentionalDifference[] = [
    {
        id: 'hidden-fields-not-validated',
        group: 'decision',
        description: 'A field hidden by its own condition, a parent section or group, or a tab is never validated.',
        configure: (form) => {
            form.enableParentVisibilityCheck = true;
            form.getFormFields().forEach((field) => (field.checkParentVisibilityForValidation = true));
        }
    },
    {
        id: 'empty-people-list-is-empty',
        group: 'widget fix',
        description: 'A required people or group field with an empty list is invalid.',
        configure: (form) => form.fieldValidators.push(emptyPeopleListValidator)
    },
    {
        id: 'custom-widgets-handled-by-value-type',
        group: 'decision',
        description: 'A Studio custom widget with no implementation is validated and submitted as its value type.',
        configure: (form) => form.fieldValidators.push(requiredCustomWidgetValidator)
    },
    {
        id: 'read-only-fields-not-validated',
        group: 'decision',
        description: 'A read-only field is never validated (Signal Forms semantics), so it never blocks the form.',
        adjust: (form, snapshot) => {
            Object.values(snapshot.fields)
                .filter((field) => field.readOnly)
                .forEach((field) => (field.valid = true));
            snapshot.valid = Object.values(snapshot.fields).every((field) => field.valid);
            for (const outcome of form.outcomes) {
                snapshot.outcomes[outcome.id].enabled =
                    !form.readOnly && (outcome.name === FormOutcomeModel.SAVE_ACTION || outcome.skipValidation || snapshot.valid);
            }
        }
    },
    {
        id: 'condition-dates-parsed-as-dates',
        group: 'bug fix',
        description: 'Literal dates in visibility conditions are parsed as yyyy-MM-dd, not yyyy-mm-dd (minutes).',
        correctsVisibility: true
    },
    {
        id: 'unmatched-dropdown-value-submits-null',
        group: 'bug fix',
        description: 'A dropdown value matching no option submits null instead of leaving the previous value.',
        adjust: (form, snapshot) => {
            for (const field of form.getFormFields(['dropdown'])) {
                const value = field.value;
                const unmatched = value && typeof value === 'object' && !Array.isArray(value) && value.id !== 'empty' && value.id !== '';
                if (unmatched && !field.options.some((option) => option.id === value.id) && !field.parent) {
                    snapshot.values[field.id] = null;
                }
            }
        }
    }
];

/**
 * The visibility service with the condition date fix applied, for the current engine in the parity harness.
 */
@Injectable()
export class CorrectedWidgetVisibilityService extends WidgetVisibilityService {
    override getRightValue(form: FormModel, visibilityObj: WidgetVisibilityModel): any {
        if (visibilityObj.rightType === 'variable' || visibilityObj.rightType === 'field') {
            return super.getRightValue(form, visibilityObj);
        }
        const value = parse(`${visibilityObj.rightValue}`, 'yyyy-MM-dd', new Date());
        return isValid(value) ? `${format(value, 'yyyy-MM-dd')}T00:00:00.000Z` : visibilityObj.rightValue;
    }
}
