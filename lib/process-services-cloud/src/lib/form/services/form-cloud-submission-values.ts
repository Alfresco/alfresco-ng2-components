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

import { DisplayTextWidgetSettings, FormExpressionService, FormFieldTypes, FormModel, FormValues, ROW_ID_PREFIX } from '@alfresco/adf-core';
import { isObservable, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { resolveRichTextExpressions } from '../components/widgets/display-rich-text/rich-text-expression-resolver';

type SubmissionRow = Record<string, unknown>;

const isSubmissionRow = (value: unknown): value is SubmissionRow => typeof value === 'object' && value !== null && !Array.isArray(value);

export interface FormCloudSubmissionValuesOptions {
    enableExpressionEvaluation: boolean;
}

export const getExpressionEvaluationEnabled$ = (
    settings: Observable<DisplayTextWidgetSettings> | DisplayTextWidgetSettings | null | undefined
): Observable<boolean> =>
    isObservable(settings)
        ? settings.pipe(map((value) => value?.enableExpressionEvaluation ?? false))
        : of(settings?.enableExpressionEvaluation ?? false);

export const materializeSubmissionValues = (
    form: FormModel,
    options: FormCloudSubmissionValuesOptions,
    expressions: FormExpressionService
): FormValues => {
    const values = { ...form.values };

    if (!options.enableExpressionEvaluation) {
        return values;
    }

    for (const field of form.getFormFields([FormFieldTypes.DISPLAY_RICH_TEXT])) {
        const { authoredValue, parent } = field;
        if (authoredValue === undefined || parent?.isTemplate) {
            continue;
        }

        const materializedValue = resolveRichTextExpressions(authoredValue, (content) => expressions.resolveExpressions(form, content, true), {
            cloneValue: false
        });

        if (!parent) {
            values[field.id] = materializedValue;
            continue;
        }

        const sectionValues = values[parent.id];
        const sectionRow = Array.isArray(sectionValues) ? sectionValues[parent.rowIndex] : undefined;
        if (!isSubmissionRow(sectionRow)) {
            continue;
        }

        const materializedRows = [...sectionValues];
        const fieldId = field.id.split(ROW_ID_PREFIX)[0];
        materializedRows[parent.rowIndex] = {
            ...sectionRow,
            [fieldId]: materializedValue
        };
        values[parent.id] = materializedRows;
    }

    return values;
};
