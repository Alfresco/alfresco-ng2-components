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

import { TestBed } from '@angular/core/testing';
import { FormExpressionService, FormFieldModel, FormFieldTypes, FormModel } from '@alfresco/adf-core';
import { materializeSubmissionValues } from './form-cloud-submission-values';

describe('materializeSubmissionValues', () => {
    let expressions: FormExpressionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FormExpressionService]
        });
        expressions = TestBed.inject(FormExpressionService);
    });

    it('should resolve root rich text values from the authored template without mutating the form', () => {
        const authoredValue = {
            blocks: [
                {
                    type: 'paragraph',
                    data: {
                        text: 'Hello ${field.name} - ${variable.status} - ${field.missing} - ${field.unsafe}'
                    }
                }
            ]
        };
        const form = new FormModel({
            fields: [
                { id: 'richText', name: 'richText', type: FormFieldTypes.DISPLAY_RICH_TEXT, value: authoredValue },
                { id: 'name', name: 'name', type: FormFieldTypes.TEXT, value: 'John' },
                { id: 'unsafe', name: 'unsafe', type: FormFieldTypes.TEXT, value: '<b>John</b>' }
            ],
            variables: [{ id: 'status', name: 'status', type: 'string', value: 'Active' }]
        });
        const richTextField = form.getFieldById('richText');
        richTextField.value = { blocks: [{ type: 'paragraph', data: { text: 'stale rendered value' } }] };
        const originalValues = JSON.parse(JSON.stringify(form.values));
        const originalDefinition = JSON.parse(JSON.stringify(form.json));

        const values = materializeSubmissionValues(form, { enableExpressionEvaluation: true }, expressions);

        expect(values.richText).toEqual({
            blocks: [
                {
                    type: 'paragraph',
                    data: {
                        text: 'Hello John - Active -  - &lt;b&gt;John&lt;/b&gt;'
                    }
                }
            ]
        });
        expect(form.values).toEqual(originalValues);
        expect(form.json).toEqual(originalDefinition);
        expect(richTextField.value).toEqual({ blocks: [{ type: 'paragraph', data: { text: 'stale rendered value' } }] });
    });

    it('should produce stable values across repeated materialization', () => {
        const form = new FormModel({
            fields: [
                {
                    id: 'richText',
                    type: FormFieldTypes.DISPLAY_RICH_TEXT,
                    value: { blocks: [{ type: 'paragraph', data: { text: '${field.name}' } }] }
                },
                { id: 'name', type: FormFieldTypes.TEXT, value: 'John' }
            ]
        });

        const firstValues = materializeSubmissionValues(form, { enableExpressionEvaluation: true }, expressions);
        const secondValues = materializeSubmissionValues(form, { enableExpressionEvaluation: true }, expressions);

        expect(secondValues).toEqual(firstValues);
    });

    it('should return a shallow clone without resolving expressions when evaluation is disabled', () => {
        const form = new FormModel({
            fields: [
                {
                    id: 'richText',
                    type: FormFieldTypes.DISPLAY_RICH_TEXT,
                    value: { blocks: [{ type: 'paragraph', data: { text: '${field.name}' } }] }
                },
                { id: 'name', type: FormFieldTypes.TEXT, value: 'John' }
            ]
        });

        const values = materializeSubmissionValues(form, { enableExpressionEvaluation: false }, expressions);

        expect(values).toEqual(form.values);
        expect(values).not.toBe(form.values);
        expect(values.richText).toBe(form.values.richText);
    });

    it('should isolate materialized repeatable section rows', () => {
        const form = new FormModel();
        form.values = {
            section: [
                { richText: 'saved row one', untouched: 'one' },
                { richText: 'saved row two', untouched: 'two' }
            ],
            name: 'John'
        };
        const nameField = new FormFieldModel(form, { id: 'name', type: FormFieldTypes.TEXT, value: 'John' });
        const firstField = new FormFieldModel(
            form,
            {
                id: 'richText',
                type: FormFieldTypes.DISPLAY_RICH_TEXT,
                value: { blocks: [{ type: 'paragraph', data: { text: 'First ${field.name}' } }] }
            },
            { id: 'section', uid: 'richText-Row1', fields: {}, rowIndex: 0 }
        );
        const secondField = new FormFieldModel(
            form,
            {
                id: 'richText',
                type: FormFieldTypes.DISPLAY_RICH_TEXT,
                value: { blocks: [{ type: 'paragraph', data: { text: 'Second ${field.name}' } }] }
            },
            { id: 'section', uid: 'richText-Row2', fields: {}, rowIndex: 1 }
        );
        form.fieldsCache = [nameField, firstField, secondField];
        form.values.section = [
            { richText: 'saved row one', untouched: 'one' },
            { richText: 'saved row two', untouched: 'two' }
        ];
        const originalSection = form.values.section;
        const originalFirstRow = form.values.section[0];
        const originalSecondRow = form.values.section[1];

        const values = materializeSubmissionValues(form, { enableExpressionEvaluation: true }, expressions);

        expect(values.section).toEqual([
            {
                richText: { blocks: [{ type: 'paragraph', data: { text: 'First John' } }] },
                untouched: 'one'
            },
            {
                richText: { blocks: [{ type: 'paragraph', data: { text: 'Second John' } }] },
                untouched: 'two'
            }
        ]);
        expect(values.section).not.toBe(originalSection);
        expect(values.section[0]).not.toBe(originalFirstRow);
        expect(values.section[1]).not.toBe(originalSecondRow);
        expect(form.values.section).toBe(originalSection);
    });
});
