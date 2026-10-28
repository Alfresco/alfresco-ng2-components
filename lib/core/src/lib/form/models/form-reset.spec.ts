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
import { FormModel } from '../components/widgets/core/form.model';
import { FormService } from '../services/form.service';
import { FormFieldEvent } from '../events/form-field.event';
import { currentFormWrite, FormWriteContext, formStateCommits } from './form-state.model';

describe('resetFormToDefaults', () => {
    let service: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FormService);
    });

    function context(model: FormModel, isCurrent: () => boolean = () => true): FormWriteContext {
        const result = { form: model, renderer: {}, generation: {}, invocation: {}, documentVersion: '1', outcomeId: 'clear', isCurrent };
        service.formState.bind(model, result.renderer, result.generation);
        return result;
    }

    function form(fields: object[], values?: Record<string, unknown>, readOnly = false): FormModel {
        return new FormModel({ id: 'same-definition', fields }, values, readOnly, service);
    }

    for (const [type, value] of [
        ['text', 'authored'],
        ['string', 'authored'],
        ['multi-line-text', 'authored\nline'],
        ['integer', 0],
        ['bigdecimal', 1.5],
        ['amount', 0],
        ['boolean', false],
        ['date', '2024-01-15'],
        ['datetime', '2024-01-15 10:00 AM'],
        ['dropdown', 'a'],
        ['radio-buttons', 'a'],
        ['people', [{ username: 'author' }]],
        ['functional-group', [{ id: 'group' }]],
        ['upload', [{ id: 'authored-file' }]]
    ]) {
        for (const authored of [true, false]) {
            it(`should silently restore the ${authored ? 'authored' : 'empty'} ${type} default when the field holds a draft`, async () => {
                const definition = { id: 'field', type, options: [{ id: 'a', name: 'A' }], ...(authored ? { value } : {}) };
                const model = form([definition]);
                const field = model.getFieldById('field');
                const expectedValue = field.value;
                const expectedSerialized = model.values.field;
                field.restoreRuntimeValue(type === 'upload' ? [] : type === 'boolean' ? true : 'draft');
                const edits = spyOn(service.formFieldValueChanged, 'next');
                const rules = spyOn(service.formRulesEvent, 'next');
                const loaded = spyOn(service.formLoaded, 'next');
                const commits = spyOn(formStateCommits, 'next').and.callThrough();
                const write = context(model);
                const result = await model.resetToDefaults(write);
                expect(result.status).toBe('complete');
                expect(result.context).toBe(write);
                expect(result.items[0].field).toBe(field);
                expect(field.value).toEqual(expectedValue);
                expect(model.values.field).toEqual(expectedSerialized);
                expect(commits).toHaveBeenCalledWith({ field, context: write });
                expect(edits).not.toHaveBeenCalled();
                expect(rules).not.toHaveBeenCalled();
                expect(loaded).not.toHaveBeenCalled();
            });
        }
    }

    it('should restore the first-seen default when task hydration wrote into the shared definition', async () => {
        const definition = { id: 'field', type: 'text', value: 'authored' };
        const first = form([definition], { field: 'task' });
        expect(definition.value).toBe('task');
        expect((await first.resetToDefaults(context(first))).status).toBe('complete');
        expect(first.values.field).toBe('authored');
    });

    it('should restore the first-seen default when a hydrated definition is reused by another form', async () => {
        const definition = { id: 'field', type: 'text', value: 'authored' };
        form([definition], { field: 'task' });
        const second = form([definition], { field: 'different-task' });
        await second.resetToDefaults(context(second));
        expect(second.values.field).toBe('authored');
    });

    for (const value of [undefined, null, false, 0, '', [{ username: 'literal' }]]) {
        it(`should give an explicit people value ${String(value)} precedence over contextual intent`, async () => {
            const model = form([{ id: 'people', type: 'people', value, selectLoggedUser: true }], { people: [{ username: 'task' }] });
            const resolveContextualDefault = jasmine.createSpy('resolver').and.resolveTo([{ username: 'principal' }]);
            const result = await model.resetToDefaults(context(model), { resolveContextualDefault });
            expect(result.status).toBe('complete');
            expect(resolveContextualDefault).not.toHaveBeenCalled();
            expect(model.getFieldById('people').value).toEqual(value === undefined ? null : value);
        });
    }

    it('should resolve the logged-user default at invocation when the people field has no authored value', async () => {
        const model = form([{ id: 'people', type: 'people', selectLoggedUser: true }], { people: [{ username: 'task' }] });
        const write = context(model);
        const resolver = jasmine.createSpy('resolver').and.resolveTo([{ username: 'current' }]);
        expect((await model.resetToDefaults(write, { resolveContextualDefault: resolver })).status).toBe('complete');
        expect(resolver).toHaveBeenCalledOnceWith(model.getFieldById('people'), write);
        expect(model.values.people).toEqual([{ username: 'current' }]);
    });

    it('should retain the people value and fail when no contextual resolver is available', async () => {
        const model = form([{ id: 'people', type: 'people', selectLoggedUser: true }], { people: [{ username: 'task' }] });
        const result = await model.resetToDefaults(context(model));
        expect(result.status).toBe('failed');
        expect(result.items[0].reason).toBe('contextual-default-unavailable');
        expect(model.values.people).toEqual([{ username: 'task' }]);
    });

    for (const initialNumberOfRows of [0, 2]) {
        it(`should rebuild immutable repeatable templates with ${initialNumberOfRows} authored rows`, async () => {
            const child = { id: 'child', type: 'text', value: 'authored' };
            const section = { id: 'rows', type: 'repeatable-section', params: { initialNumberOfRows }, fields: { 1: [child] } };
            const model = form([section], { rows: [{ child: 'task' }, { child: 'task-2' }, { child: 'task-3' }] });
            child.value = 'mutated';
            const edits = spyOn(service.formFieldValueChanged, 'next');
            expect((await model.resetToDefaults(context(model))).status).toBe('complete');
            const live = model.getFieldById('rows');
            expect(live.rows.length).toBe(initialNumberOfRows);
            expect(live.columns[0].fields[0].value).toBe('authored');
            expect(model.values.rows).toEqual(Array.from({ length: initialNumberOfRows }, () => ({ child: 'authored' })));
            expect(edits).not.toHaveBeenCalled();
        });
    }

    it('should preserve nested explicit undefined people literals in zero-row templates', async () => {
        const child: Record<string, unknown> = { id: 'people', type: 'people', value: undefined, selectLoggedUser: true };
        const definition = { id: 'rows', type: 'repeatable-section', params: { initialNumberOfRows: 0 }, fields: { 1: [child] } };
        const model = form([definition]);
        child.value = [{ username: 'hydrated' }];
        const resolver = jasmine.createSpy('resolver');
        const result = await model.resetToDefaults(context(model), { resolveContextualDefault: resolver });
        expect(result.status).toBe('complete');
        expect(model.values.rows).toEqual([]);
        expect(resolver).not.toHaveBeenCalled();
        expect(service.formState.getAuthoredDefault(model.getFieldById('rows').columns[0].fields[0]).hasValue).toBeTrue();
    });

    it('should retain protected repeatable descendants and reset editable children without rebuilding their rows', async () => {
        const model = form(
            [
                {
                    id: 'rows',
                    type: 'repeatable-section',
                    params: { initialNumberOfRows: 0 },
                    fields: {
                        1: [
                            { id: 'editable', type: 'text', value: 'authored' },
                            { id: 'protected', type: 'text', readOnly: true, value: 'default' }
                        ]
                    }
                }
            ],
            { rows: [{ editable: 'draft', protected: 'retained' }] }
        );
        const rows = model.getFieldById('rows').rows;
        const result = await model.resetToDefaults(context(model));
        expect(result.status).toBe('partial');
        expect(result.items[0].reason).toBe('reset-shape-retained');
        expect(model.getFieldById('rows').rows).toBe(rows);
        expect(model.values.rows).toEqual([{ editable: 'authored', protected: 'retained' }]);
    });

    it('should retain attachments while content policy is unavailable and report unsupported categories', async () => {
        const model = form(
            [
                { id: 'upload', type: 'upload' },
                { id: 'custom', type: 'custom', value: 'authored' },
                { id: 'text', type: 'text' }
            ],
            { upload: [{ id: 'new-file' }], custom: 'draft', text: 'draft' }
        );
        const result = await model.resetToDefaults(context(model));
        expect(result.status).toBe('partial');
        expect(result.items.map((item) => item.reason)).toEqual(['content-policy-unavailable', 'unsupported-category', undefined]);
        expect(model.getFieldById('upload').value).toEqual([{ id: 'new-file' }]);
        expect(model.values.upload).toBe('new-file');
        expect(model.values.custom).toBe('draft');
        expect(model.values.text).toBeNull();
    });

    it('should complete when display-only widgets sit beside a reset text field', async () => {
        const model = form(
            [
                { id: 'text', type: 'text', value: 'authored' },
                { id: 'viewer', type: 'file-viewer', value: 'file' },
                { id: 'table', type: 'data-table', value: [{ id: 'row' }] }
            ],
            { text: 'draft' }
        );
        const result = await model.resetToDefaults(context(model));
        expect(result.status).toBe('complete');
        expect(result.items.map((item) => [item.fieldId, item.status])).toEqual([
            ['text', 'applied'],
            ['viewer', 'skipped'],
            ['table', 'skipped']
        ]);
        expect(model.values.text).toBe('authored');
        expect(model.captureResetEditability()).toEqual(new Set([model.getFieldById('text')]));
    });

    for (const definition of [
        { type: 'dropdown', selectionType: 'multiple', value: [{ id: 'a', name: 'A' }], options: [{ id: 'a', name: 'A' }] },
        { type: 'dropdown', optionType: 'rest', value: { id: 'r1', name: 'Rest' } }
    ]) {
        it(`should restore the authored ${definition.selectionType ?? definition.optionType} dropdown default when the field holds a draft`, async () => {
            const model = form([{ ...definition, id: 'field' }]);
            const field = model.getFieldById('field');
            const expectedValue = field.value;
            const expectedSerialized = model.values.field;
            field.restoreRuntimeValue([{ id: 'draft' }]);
            expect((await model.resetToDefaults(context(model))).status).toBe('complete');
            expect(field.value).toEqual(expectedValue);
            expect(model.values.field).toEqual(expectedSerialized);
        });
    }

    for (const [type, value] of [
        ['dropdown', 'missing'],
        ['radio-buttons', 'missing'],
        ['integer', 'abc'],
        ['date', 'not-a-date'],
        ['datetime', 'not-a-date']
    ]) {
        it(`should restore an empty ${type} value when the authored default ${value} is malformed`, async () => {
            const model = form([{ id: 'field', type, value, options: [{ id: 'a', name: 'A' }] }], { field: type === 'integer' ? 5 : 'a' });
            expect((await model.resetToDefaults(context(model))).status).toBe('complete');
            expect(model.getFieldById('field').value).toBeNull();
        });
    }

    for (const [type, value] of [
        ['date', 'today'],
        ['datetime', 'now']
    ]) {
        it(`should resolve the dynamic ${type} default ${value} at reset time`, async () => {
            const model = form([{ id: 'field', type, value }]);
            const field = model.getFieldById('field');
            field.restoreRuntimeValue(null);
            const edits = spyOn(service.formFieldValueChanged, 'next');
            expect((await model.resetToDefaults(context(model))).status).toBe('complete');
            expect(field.value instanceof Date).toBeTrue();
            expect(edits).not.toHaveBeenCalled();
        });
    }

    it('should reset editable leaves inside ordinary groups', async () => {
        const model = form([{ id: 'group', type: 'group', fields: { 1: [{ id: 'text', type: 'text', value: 'authored' }] } }], { text: 'draft' });
        expect((await model.resetToDefaults(context(model))).status).toBe('complete');
        expect(model.values.text).toBe('authored');
    });

    for (const type of ['dynamic-table', 'typeahead', 'document', 'select-folder']) {
        it(`should retain ${type} state and report its unsupported reset category`, async () => {
            const model = form([{ id: 'field', type, value: 'retained' }]);
            const field = model.getFieldById('field');
            const serialized = model.values.field;
            const result = await model.resetToDefaults(context(model));
            expect(result.status).toBe('failed');
            expect(result.items[0].reason).toBe('unsupported-category');
            expect(field.value).toBe('retained');
            expect(model.values.field).toEqual(serialized);
        });
    }

    for (const type of [
        'readonly',
        'readonly-text',
        'hyperlink',
        'display-external-property',
        'display-rich-text',
        'button',
        'properties-viewer',
        'file-viewer',
        'base-viewer',
        'json',
        'data-table'
    ]) {
        it(`should preserve ${type} state as a successful no-target reset`, async () => {
            const model = form([{ id: 'field', type, value: 'retained' }]);
            const field = model.getFieldById('field');
            const serialized = model.values.field;
            const result = await model.resetToDefaults(context(model));
            expect(result.status).toBe('complete');
            expect(result.items[0].status).toBe('skipped');
            expect(field.value).toBe('retained');
            expect(model.values.field).toEqual(serialized);
        });
    }

    it('should preserve row-authored literals and normalize malformed row defaults', async () => {
        const model = form(
            [
                {
                    id: 'rows',
                    type: 'repeatable-section',
                    params: { initialNumberOfRows: 1 },
                    value: [{ child: 'row-authored', number: 'bad', people: null }],
                    fields: {
                        1: [
                            { id: 'child', type: 'text', value: 'template' },
                            { id: 'number', type: 'integer', value: 42 },
                            { id: 'people', type: 'people', selectLoggedUser: true }
                        ]
                    }
                }
            ],
            { rows: [{ child: 'draft', number: 99, people: [{ username: 'draft' }] }] }
        );
        const resolver = jasmine.createSpy('resolver');
        const result = await model.resetToDefaults(context(model), { resolveContextualDefault: resolver });
        expect(result.status).toBe('complete');
        const fields = model.getFieldById('rows').rows[0].columns[0].fields;
        expect(fields[0].value).toBe('row-authored');
        expect(fields[1].value).toBeNull();
        expect(fields[2].value).toBeNull();
        expect(model.values.rows[0].child).toBe('row-authored');
        expect(Number.isNaN(model.values.rows[0].number)).toBeTrue();
        expect(resolver).not.toHaveBeenCalled();
    });

    for (const value of [null, undefined]) {
        it(`should preserve an own authored row ${String(value)} over a nonempty text template`, async () => {
            const model = form(
                [
                    {
                        id: 'rows',
                        type: 'repeatable-section',
                        params: { initialNumberOfRows: 1 },
                        value: [{ text: value }],
                        fields: { 1: [{ id: 'text', type: 'text', value: 'template' }] }
                    }
                ],
                { rows: [{ text: 'draft' }] }
            );
            expect((await model.resetToDefaults(context(model))).status).toBe('complete');
            expect(model.getFieldById('rows').rows[0].columns[0].fields[0].value).toBeNull();
            expect(model.values.rows).toEqual([{ text: null }]);
        });
    }

    it('should retain the exact prior repeatable field and draft when contextual resolution fails', async () => {
        const model = form(
            [
                {
                    id: 'rows',
                    type: 'repeatable-section',
                    params: { initialNumberOfRows: 0 },
                    fields: {
                        1: [
                            { id: 'people', type: 'people', selectLoggedUser: true },
                            { id: 'text', type: 'text', value: 'authored' }
                        ]
                    }
                }
            ],
            { rows: [{ people: [{ username: 'retained' }], text: 'draft' }] }
        );
        const section = model.getFieldById('rows');
        const rows = section.rows;
        const people = rows[0].columns[0].fields[0];
        expect((await model.resetToDefaults(context(model))).status).toBe('partial');
        expect(section.rows).toBe(rows);
        expect(section.rows[0].columns[0].fields[0]).toBe(people);
        expect(people.value).toEqual([{ username: 'retained' }]);
        expect(model.values.rows).toEqual([{ people: [{ username: 'retained' }], text: 'authored' }]);
    });

    it('should retain a repeatable serializer failure and successful independent children', async () => {
        const model = form(
            [
                {
                    id: 'rows',
                    type: 'repeatable-section',
                    params: { initialNumberOfRows: 0 },
                    fields: {
                        1: [
                            { id: 'failed', type: 'text', value: 'default' },
                            { id: 'text', type: 'text', value: 'authored' }
                        ]
                    }
                }
            ],
            { rows: [{ failed: 'retained', text: 'draft' }] }
        );
        const section = model.getFieldById('rows');
        const failed = section.rows[0].columns[0].fields[0];
        spyOn(failed, 'getFormValue').and.callFake(() => {
            model.values.rows[0].failed = 'mutated-before-throw';
            throw new Error('application failed');
        });
        expect((await model.resetToDefaults(context(model))).status).toBe('partial');
        expect(section.rows[0].columns[0].fields[0]).toBe(failed);
        expect(failed.value).toBe('retained');
        expect(model.values.rows).toEqual([{ failed: 'retained', text: 'authored' }]);
    });

    it('should use authored row values while retaining a readonly sibling and existing row shape', async () => {
        const model = form(
            [
                {
                    id: 'rows',
                    type: 'repeatable-section',
                    params: { initialNumberOfRows: 0 },
                    value: [{ text: 'row-authored' }],
                    fields: {
                        1: [
                            { id: 'text', type: 'text', value: 'template' },
                            { id: 'protected', type: 'text', readOnly: true }
                        ]
                    }
                }
            ],
            { rows: [{ text: 'draft', protected: 'retained' }] }
        );
        expect((await model.resetToDefaults(context(model))).status).toBe('partial');
        expect(model.values.rows).toEqual([{ text: 'row-authored', protected: 'retained' }]);
    });

    it('should resolve a missing authored people row without replacing a literal people row with that principal', async () => {
        const model = form(
            [
                {
                    id: 'rows',
                    type: 'repeatable-section',
                    params: { initialNumberOfRows: 2 },
                    value: [{ people: [{ username: 'literal' }] }, {}],
                    fields: { 1: [{ id: 'people', type: 'people', selectLoggedUser: true }] }
                }
            ],
            { rows: [{ people: [{ username: 'draft' }] }] }
        );
        const resolver = jasmine.createSpy('resolver').and.resolveTo([{ username: 'principal' }]);
        expect((await model.resetToDefaults(context(model), { resolveContextualDefault: resolver })).status).toBe('complete');
        expect(model.values.rows).toEqual([{ people: [{ username: 'literal' }] }, { people: [{ username: 'principal' }] }]);
        expect(resolver).toHaveBeenCalled();
    });

    it('should restore the affected serialized item after mutation without cloning unrelated values', async () => {
        const model = form(
            [
                { id: 'failed', type: 'text' },
                { id: 'text', type: 'text', value: 'authored' }
            ],
            { failed: 'retained', text: 'draft' }
        );
        const unrelated = { method: () => 42 };
        model.values.unrelated = unrelated;
        const values = model.values;
        const failed = model.getFieldById('failed');
        spyOn(failed, 'getFormValue').and.callFake(() => {
            model.values.failed = 'mutated-before-throw';
            model.values.independentWrite = 'retained';
            throw new Error('application failed');
        });
        expect((await model.resetToDefaults(context(model))).status).toBe('partial');
        expect(failed.value).toBe('retained');
        expect(model.values.failed).toBe('retained');
        expect(model.values.text).toBe('authored');
        expect(model.values).toBe(values);
        expect(model.values.unrelated).toBe(unrelated);
        expect(model.values.independentWrite).toBe('retained');
    });

    it('should preserve nested row literal presence instead of replaying template defaults', async () => {
        const model = form([
            {
                id: 'outer',
                type: 'repeatable-section',
                params: { initialNumberOfRows: 1 },
                value: [{ inner: [{ text: null, people: undefined, number: 'bad' }] }],
                fields: {
                    1: [
                        {
                            id: 'inner',
                            type: 'repeatable-section',
                            params: { initialNumberOfRows: 1 },
                            fields: {
                                1: [
                                    { id: 'text', type: 'text', value: 'template' },
                                    { id: 'people', type: 'people', selectLoggedUser: true },
                                    { id: 'number', type: 'integer', value: 5 }
                                ]
                            }
                        }
                    ]
                }
            }
        ]);
        const resolver = jasmine.createSpy('resolver').and.returnValue([{ username: 'principal' }]);
        expect((await model.resetToDefaults(context(model), { resolveContextualDefault: resolver })).status).toBe('complete');
        const inner = model.getFieldById('outer').rows[0].columns[0].fields[0];
        expect(inner.rows[0].columns[0].fields[0].value).toBeNull();
        expect(inner.rows[0].columns[0].fields[1].value).toBeNull();
        expect(inner.rows[0].columns[0].fields[2].value).toBeNull();
        expect(resolver).not.toHaveBeenCalled();
        expect(model.values.outer[0].inner[0]).toEqual({ text: null, people: null, number: NaN });
    });

    it('should retain resolved nested people defaults in reconstructed serialization', async () => {
        const model = form([
            {
                id: 'outer',
                type: 'repeatable-section',
                params: { initialNumberOfRows: 1 },
                value: [{ inner: [{}] }],
                fields: {
                    1: [
                        {
                            id: 'inner',
                            type: 'repeatable-section',
                            params: { initialNumberOfRows: 1 },
                            fields: { 1: [{ id: 'people', type: 'people', selectLoggedUser: true }] }
                        }
                    ]
                }
            }
        ]);
        const principal = [{ username: 'principal' }];
        const resolver = jasmine.createSpy('resolver').and.returnValue(principal);
        expect((await model.resetToDefaults(context(model), { resolveContextualDefault: resolver })).status).toBe('complete');
        expect(model.values.outer[0].inner[0].people).toEqual(principal);
        const inner = model.getFieldById('outer').rows[0].columns[0].fields[0];
        expect(inner.rows[0].columns[0].fields[0].value).toEqual(principal);
        expect(resolver).toHaveBeenCalledTimes(1);
    });

    it('should not serialize nested repeatable zero-row templates', async () => {
        const model = form([
            {
                id: 'outer',
                type: 'repeatable-section',
                params: { initialNumberOfRows: 0 },
                fields: {
                    1: [
                        {
                            id: 'inner',
                            type: 'repeatable-section',
                            params: { initialNumberOfRows: 1 },
                            fields: { 1: [{ id: 'text', type: 'text', value: 'authored' }] }
                        }
                    ]
                }
            }
        ]);
        await model.resetToDefaults(context(model));
        expect(Object.keys(model.values)).toEqual(['outer']);
        expect(model.values.outer).toEqual([]);
    });

    it('should retain failed serialization independently while required invalidity remains a successful reset', async () => {
        const model = form(
            [
                { id: 'failed', type: 'text', value: 'default' },
                { id: 'required', type: 'text', required: true }
            ],
            { failed: 'retained', required: 'draft' }
        );
        spyOn(model.getFieldById('failed'), 'getFormValue').and.throwError('serialization failed');
        const result = await model.resetToDefaults(context(model));
        expect(result.status).toBe('partial');
        expect(model.getFieldById('failed').value).toBe('retained');
        expect(model.values.failed).toBe('retained');
        expect(model.values.required).toBeNull();
        expect(model.isValid).toBeFalse();
        expect(result.items[1].status).toBe('applied');
    });

    it('should keep field values and complete when the form is read only', async () => {
        const readonly = form([{ id: 'field', type: 'text' }], { field: 'retained' }, true);
        expect((await readonly.resetToDefaults(context(readonly))).status).toBe('complete');
        expect(readonly.values.field).toBe('retained');
    });

    it('should complete when the form has no fields', async () => {
        const empty = form([]);
        expect((await empty.resetToDefaults(context(empty))).status).toBe('complete');
    });

    it('should return unavailable without mutation when the invocation is stale before the reset starts', async () => {
        const model = form([{ id: 'people', type: 'people', selectLoggedUser: true }], { people: [{ username: 'retained' }] });
        const write = context(model, () => false);
        expect((await model.resetToDefaults(write)).status).toBe('unavailable');
        expect(model.values.people).toEqual([{ username: 'retained' }]);
    });

    it('should return unavailable without mutation when the invocation becomes stale during principal resolution', async () => {
        const model = form([{ id: 'people', type: 'people', selectLoggedUser: true }], { people: [{ username: 'retained' }] });
        let current = true;
        const write = context(model, () => current);
        let resolve: (value: unknown) => void;
        const principal = new Promise<unknown>((release) => (resolve = release));
        const pending = model.resetToDefaults(write, { resolveContextualDefault: () => principal });
        current = false;
        resolve([{ username: 'late' }]);
        expect((await pending).status).toBe('unavailable');
        expect(model.values.people).toEqual([{ username: 'retained' }]);
    });

    it('should capture each editable field once when repeatable rows share their first row columns', () => {
        const model = form([
            { id: 'table', type: 'dynamic-table' },
            {
                id: 'rows',
                type: 'repeatable-section',
                params: { initialNumberOfRows: 2 },
                fields: {
                    1: [
                        { id: 'text', type: 'text' },
                        { id: 'viewer', type: 'file-viewer' }
                    ]
                }
            }
        ]);
        const editable = [...model.captureResetEditability()];
        expect(editable.map((field) => field.json.id)).toEqual(['table', 'rows', 'text', 'text']);
        expect(new Set(editable).size).toBe(editable.length);
    });

    it('should retain a repeatable section when a row upload holds a single content reference', async () => {
        const model = form([
            {
                id: 'rows',
                type: 'repeatable-section',
                params: { initialNumberOfRows: 1 },
                fields: {
                    1: [
                        { id: 'upload', type: 'upload' },
                        { id: 'text', type: 'text', value: 'authored' }
                    ]
                }
            }
        ]);
        const section = model.getFieldById('rows');
        section.rows[0].columns[0].fields[0].restoreRuntimeValue({ id: 'file' });
        const result = await model.resetToDefaults(context(model));
        expect(result.items.find((item) => item.field === section)).toEqual(
            jasmine.objectContaining({ status: 'failed', reason: 'reset-shape-retained' })
        );
    });

    it('should reset an upload whose runtime value holds no content reference', async () => {
        const model = form([{ id: 'upload', type: 'upload' }]);
        const field = model.getFieldById('upload');
        const pristine = field.value;
        field.restoreRuntimeValue(null);
        const result = await model.resetToDefaults(context(model));
        expect(result.status).toBe('complete');
        expect(result.items[0].status).toBe('applied');
        expect(field.value).toEqual(pristine);
    });

    it('should restore section and date values inside repeatable rows from authored row literals', async () => {
        const model = form([
            {
                id: 'rows',
                type: 'repeatable-section',
                params: {},
                value: [{ inSection: 'row literal', date: '2024-01-15' }, {}],
                fields: {
                    1: [
                        { id: 'section', type: 'section', numberOfColumns: 1, fields: { 1: [{ id: 'inSection', type: 'text', value: 'template' }] } },
                        { id: 'date', type: 'date', value: '2024-02-20' }
                    ]
                }
            }
        ]);
        const section = model.getFieldById('rows');
        section.rows[0].columns[0].fields[0].columns[0].fields[0].value = 'draft';
        expect((await model.resetToDefaults(context(model))).status).toBe('complete');
        expect(model.values.rows[0].inSection).toBe('row literal');
        expect(model.values.rows[0].date).toBe('2024-01-15T00:00:00.000Z');
        expect(model.values.rows[1].inSection).toBe('template');
    });

    it('should resolve a contextual people default inside a section of a repeatable row once', async () => {
        const model = form([
            {
                id: 'rows',
                type: 'repeatable-section',
                params: { initialNumberOfRows: 1 },
                value: [{ other: 'literal' }],
                fields: {
                    1: [
                        {
                            id: 'section',
                            type: 'section',
                            numberOfColumns: 1,
                            fields: { 1: [{ id: 'people', type: 'people', selectLoggedUser: true }] }
                        },
                        { id: 'other', type: 'text' }
                    ]
                }
            }
        ]);
        const principal = [{ username: 'principal' }];
        const resolver = jasmine.createSpy('resolver').and.returnValue(principal);
        expect((await model.resetToDefaults(context(model), { resolveContextualDefault: resolver })).status).toBe('complete');
        expect(model.values.rows[0].people).toEqual(principal);
        expect(resolver).toHaveBeenCalledTimes(1);
    });

    it('should use the nested authored rows when an outer row has no literal for the nested section', async () => {
        const model = form([
            {
                id: 'outer',
                type: 'repeatable-section',
                params: { initialNumberOfRows: 1 },
                value: [{ text: 'outer literal' }],
                fields: {
                    1: [
                        { id: 'text', type: 'text' },
                        {
                            id: 'inner',
                            type: 'repeatable-section',
                            params: { initialNumberOfRows: 1 },
                            value: [{}],
                            fields: { 1: [{ id: 'people', type: 'people', selectLoggedUser: true }] }
                        }
                    ]
                }
            }
        ]);
        const principal = [{ username: 'principal' }];
        const people = model.getFieldById('outer').rows[0].columns[0].fields[1].rows[0].columns[0].fields[0];
        const resolver = jasmine.createSpy('resolver').and.returnValue(principal);
        const result = await model.resetToDefaults(context(model), { resolveContextualDefault: resolver, handledFields: new Set([people]) });
        expect(result.status).toBe('complete');
        expect(resolver).toHaveBeenCalledOnceWith(people, jasmine.anything());
    });

    for (const failure of ['unavailable', 'stale'] as const) {
        it(`should stop a repeatable reset when a row contextual default is ${failure}`, async () => {
            const model = form([
                {
                    id: 'rows',
                    type: 'repeatable-section',
                    params: { initialNumberOfRows: 1 },
                    fields: {
                        1: [
                            { id: 'people', type: 'people', selectLoggedUser: true },
                            { id: 'text', type: 'text', value: 'authored' }
                        ]
                    }
                }
            ]);
            let current = true;
            const section = model.getFieldById('rows');
            const people = section.rows[0].columns[0].fields[0];
            const text = section.rows[0].columns[0].fields[1];
            text.value = 'draft';
            const resolver = () => {
                current = failure !== 'stale';
                return null;
            };
            const result = await model.resetToDefaults(
                context(model, () => current),
                {
                    resolveContextualDefault: resolver,
                    handledFields: new Set([people])
                }
            );
            if (failure === 'unavailable') {
                expect(result.status).toBe('partial');
                expect(result.items.filter((item) => item.status === 'failed').map((item) => [item.field, item.reason])).toEqual([
                    [people, 'contextual-default-unavailable'],
                    [section, 'reset-shape-retained']
                ]);
            } else {
                expect(result.status).toBe('unavailable');
                expect(result.items.some((item) => item.field === section)).toBeFalse();
            }
        });
    }

    it('should stop resetting later fields and the parent section when the invocation becomes stale during a row reset', async () => {
        const model = form([
            {
                id: 'rows',
                type: 'repeatable-section',
                params: { initialNumberOfRows: 1 },
                fields: { 1: [{ id: 'people', type: 'people', selectLoggedUser: true }] }
            },
            { id: 'text', type: 'text', value: 'authored' }
        ]);
        let current = true;
        model.getFieldById('text').value = 'draft';
        const commits = spyOn(formStateCommits, 'next').and.callThrough();
        const result = await model.resetToDefaults(
            context(model, () => current),
            {
                resolveContextualDefault: () => {
                    current = false;
                    return [{ username: 'late' }];
                }
            }
        );
        expect(result.status).toBe('unavailable');
        expect(result.items).toEqual([]);
        expect(commits).not.toHaveBeenCalled();
        expect(model.values.text).toBe('draft');
    });

    it('should rebuild a zero-row repeatable template that contains a section', async () => {
        const model = form([
            {
                id: 'rows',
                type: 'repeatable-section',
                params: { initialNumberOfRows: 0 },
                fields: {
                    1: [{ id: 'section', type: 'section', numberOfColumns: 1, fields: { 1: [{ id: 'inSection', type: 'text', value: 'template' }] } }]
                }
            }
        ]);
        expect((await model.resetToDefaults(context(model))).status).toBe('complete');
        expect(model.getFieldById('rows').rows.length).toBe(0);
    });

    it('should not resolve row contextual defaults when the section has no authored initial rows', async () => {
        const model = form([
            { id: 'rows', type: 'repeatable-section', params: {}, fields: { 1: [{ id: 'people', type: 'people', selectLoggedUser: true }] } }
        ]);
        const people = model.getFieldById('rows').rows[0].columns[0].fields[0];
        const resolver = jasmine.createSpy('resolver');
        const result = await model.resetToDefaults(context(model), { resolveContextualDefault: resolver, handledFields: new Set([people]) });
        expect(result.status).toBe('complete');
        expect(resolver).not.toHaveBeenCalled();
    });

    it('should report a contextual default as unavailable when the resolver throws', async () => {
        const model = form([{ id: 'people', type: 'people', selectLoggedUser: true }]);
        const result = await model.resetToDefaults(context(model), {
            resolveContextualDefault: () => {
                throw new Error('principal');
            }
        });
        expect(result.status).toBe('failed');
        expect(result.items[0].reason).toBe('contextual-default-unavailable');
    });

    it('should not commit a repeatable section when the invocation becomes stale while its rows reset', async () => {
        const model = form(
            [
                {
                    id: 'rows',
                    type: 'repeatable-section',
                    params: { initialNumberOfRows: 1 },
                    value: [{ people: [{ username: 'literal' }] }],
                    fields: { 1: [{ id: 'people', type: 'people', selectLoggedUser: true }] }
                }
            ],
            { rows: [{ people: [{ username: 'draft-1' }] }, { people: [{ username: 'draft-2' }] }] }
        );
        let current = true;
        const section = model.getFieldById('rows');
        const result = await model.resetToDefaults(
            context(model, () => current),
            {
                resolveContextualDefault: () => {
                    current = false;
                    return [{ username: 'late' }];
                }
            }
        );
        expect(result.status).toBe('unavailable');
        expect(result.items.some((item) => item.field === section)).toBeFalse();
        expect(section.rows.length).toBe(2);
    });

    describe('repeatable sections with host-handled children', () => {
        const handledSection = () =>
            form(
                [
                    {
                        id: 'rows',
                        type: 'repeatable-section',
                        params: { initialNumberOfRows: 1 },
                        fields: {
                            1: [
                                { id: 'attachment', type: 'host-attachment' },
                                { id: 'text', type: 'text', value: 'authored' }
                            ]
                        }
                    }
                ],
                { rows: [{ text: 'draft-1' }, { text: 'draft-2' }] }
            );
        const attachments = (model: FormModel) => model.getFieldById('rows').rows.map((row) => row.columns[0].fields[0]);

        it('should rebuild the authored rows when every handled child was cleared by the host', async () => {
            const model = handledSection();
            const handled = attachments(model);
            handled.forEach((field) => field.restoreRuntimeValue(null));

            const result = await model.resetToDefaults(context(model), { handledFields: new Set(handled) });

            expect(result.status).toBe('complete');
            expect(model.getFieldById('rows').rows.length).toBe(1);
            expect(model.values.rows).toEqual([jasmine.objectContaining({ text: 'authored' })]);
            expect(result.items.find((item) => item.fieldId === 'rows').status).toBe('applied');
        });

        it('should keep the rows when a handled child still holds content after the host reset', async () => {
            const model = handledSection();
            const handled = attachments(model);
            handled[0].restoreRuntimeValue(null);
            handled[1].restoreRuntimeValue([{ id: 'retained-node' }]);
            const rows = model.getFieldById('rows').rows;

            const result = await model.resetToDefaults(context(model), { handledFields: new Set(handled) });

            expect(result.status).toBe('partial');
            expect(result.items.find((item) => item.fieldId === 'rows')).toEqual(jasmine.objectContaining({ reason: 'reset-shape-retained' }));
            expect(model.getFieldById('rows').rows).toBe(rows);
            expect(model.values.rows.map((row) => row.text)).toEqual(['authored', 'authored']);
        });

        it('should keep the rows when the unsupported child was not handled by the host', async () => {
            const model = handledSection();
            const rows = model.getFieldById('rows').rows;

            const result = await model.resetToDefaults(context(model));

            expect(result.status).toBe('partial');
            expect(result.items.find((item) => item.fieldId === 'rows')).toEqual(jasmine.objectContaining({ reason: 'reset-shape-retained' }));
            expect(model.getFieldById('rows').rows).toBe(rows);
        });
    });

    it('should rebuild a repeatable section whose only preserved children are display-only widgets', async () => {
        const model = form(
            [
                {
                    id: 'rows',
                    type: 'repeatable-section',
                    params: { initialNumberOfRows: 1 },
                    fields: {
                        1: [
                            { id: 'viewer', type: 'file-viewer', readOnly: true },
                            { id: 'table', type: 'data-table' },
                            { id: 'text', type: 'text', value: 'authored' }
                        ]
                    }
                }
            ],
            { rows: [{ text: 'draft-1' }, { text: 'draft-2' }] }
        );

        const result = await model.resetToDefaults(context(model));

        expect(result.status).toBe('complete');
        expect(model.getFieldById('rows').rows.length).toBe(1);
        expect(model.values.rows).toEqual([jasmine.objectContaining({ text: 'authored' })]);
    });

    it('should skip a field disabled at runtime when its editability is captured at reset entry', async () => {
        const model = form([{ id: 'text', type: 'text', value: 'authored' }], { text: 'task' });
        model.changeFieldDisabled('text', true);

        const result = await model.resetToDefaults(context(model), { editableFields: model.captureResetEditability() });

        expect(result.items).toEqual([jasmine.objectContaining({ fieldId: 'text', status: 'skipped' })]);
        expect(model.values.text).toBe('task');
    });

    it('should restore a repeatable row template default after a variable with the same name hydrated it', async () => {
        const model = form(
            [
                {
                    id: 'rows',
                    type: 'repeatable-section',
                    params: { initialNumberOfRows: 1 },
                    fields: { 1: [{ id: 'rowText', type: 'text', value: 'Row default' }] }
                }
            ],
            { 'variables.rowText': 'Hydrated template value', rows: [{ rowText: 'draft-1' }, { rowText: 'draft-2' }] }
        );

        expect((await model.resetToDefaults(context(model))).status).toBe('complete');
        expect(model.values.rows).toEqual([{ rowText: 'Row default' }]);
    });

    it('should attach exact-field authority before publication without inheriting it into nested unmarked writes', () => {
        const model = form([{ id: 'field', type: 'text' }]);
        const other = form([{ id: 'field', type: 'text' }]);
        const write = context(model);
        const field = model.getFieldById('field');
        const events: FormFieldEvent[] = [];
        spyOn(service.formFieldValueChanged, 'next').and.callFake((event) => events.push(event));
        spyOn(field, 'updateForm').and.callFake(() => {
            model.onFormFieldChanged(field);
            if (field.value === 'outer') {
                model.changeFieldValue('field', 'nested');
                model.onFormFieldChanged(field);
            }
        });
        model.changeFieldValue('field', 'outer', write);
        expect(events.map((event) => event.writeContext)).toEqual([write, undefined, write]);
        expect(events.every((event) => event.form === model && event.field === field)).toBeTrue();
        expect(currentFormWrite(field)).toBeUndefined();
        expect(other.values.field).toBeNull();
    });

    it('should clear exact-field authority when a marked write throws', () => {
        const model = form([{ id: 'field', type: 'text' }]);
        const write = context(model);
        const field = model.getFieldById('field');
        spyOn(field, 'updateForm').and.throwError('setter failure');
        expect(() => model.changeFieldValue('field', 'throw', write)).toThrowError('setter failure');
        expect(currentFormWrite(field)).toBeUndefined();
    });
});
