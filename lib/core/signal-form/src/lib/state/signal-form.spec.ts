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

import { createEnvironmentInjector, EnvironmentInjector, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { parseFormJson } from '../definition/form-json-parser';
import type { FieldValidator } from '../field-types/field-type-definition.interface';
import { SignalForm } from './signal-form';
import { SignalFormEvent, SignalFormEventType } from './signal-form-event';

describe('SignalForm', () => {
    const tagsForm = {
        formDefinition: {
            fields: [
                {
                    id: 'root',
                    type: 'container',
                    numberOfColumns: 1,
                    fields: {
                        1: [
                            {
                                id: 'tags',
                                type: 'dropdown',
                                selectionType: 'multiple',
                                options: [
                                    { id: 'a', name: 'Alpha' },
                                    { id: 'b', name: 'Beta' }
                                ]
                            }
                        ]
                    }
                }
            ],
            outcomes: [],
            variables: []
        }
    };

    it('should keep Signal Forms identity symbols out of the submission and the definition', () => {
        const definition = parseFormJson(tagsForm);
        const form = new SignalForm(definition, {}, TestBed.inject(Injector));
        const [alpha, beta] = definition.fields[0].options;

        form.setValue('tags', [alpha, beta]);
        expect(form.fieldNode('tags')[0]).withContext('Signal Forms tracks the selected items').toBeDefined();

        const submitted = form.submittedValues()['tags'] as object[];
        expect(submitted).toEqual([
            { id: 'a', name: 'Alpha' },
            { id: 'b', name: 'Beta' }
        ]);
        submitted.forEach((item) => expect(Object.getOwnPropertySymbols(item)).toEqual([]));
    });

    it('should not stamp the objects of the definition it reads its initial values from', () => {
        const definition = parseFormJson({
            formDefinition: {
                ...tagsForm.formDefinition,
                fields: [
                    {
                        ...tagsForm.formDefinition.fields[0],
                        fields: { 1: [{ ...tagsForm.formDefinition.fields[0].fields[1][0], value: [{ id: 'a', name: 'Alpha' }] }] }
                    }
                ]
            }
        });
        const form = new SignalForm(definition, {}, TestBed.inject(Injector));

        expect(form.fieldNode('tags')[0]).toBeDefined();
        (definition.fields[0].initialValue as object[]).forEach((item) => expect(Object.getOwnPropertySymbols(item)).toEqual([]));
    });

    it('should not validate a repeatable section on a hidden tab, and report it once the tab is visible', () => {
        const definition = parseFormJson({
            formDefinition: {
                tabs: [
                    { id: 'main', title: 'Main' },
                    {
                        id: 'items',
                        title: 'Items',
                        visibilityCondition: {
                            leftType: 'field',
                            leftValue: 'withItems',
                            operator: '==',
                            rightValue: 'yes',
                            rightType: 'value',
                            nextConditionOperator: ''
                        }
                    }
                ],
                fields: [
                    { id: 'main-root', type: 'container', tab: 'main', numberOfColumns: 1, fields: { 1: [{ id: 'withItems', type: 'text' }] } },
                    {
                        id: 'lines',
                        type: 'repeatable-section',
                        tab: 'items',
                        numberOfColumns: 1,
                        params: { initialNumberOfRows: 1 },
                        fields: { 1: [{ id: 'item', type: 'text', required: true }] }
                    }
                ],
                outcomes: [],
                variables: []
            }
        });
        const form = new SignalForm(definition, {}, TestBed.inject(Injector));

        expect(form.valid()).toBeTrue();
        expect(form.hasTabErrors('items')).toBeFalse();

        form.setValue('withItems', 'yes');

        expect(form.valid()).toBeFalse();
        expect(form.hasTabErrors('items')).toBeTrue();
        expect(form.hasTabErrors('main')).toBeFalse();
    });

    it('should start a repeatable section with every saved row, beyond its maximum, dates read and submitted as dates', () => {
        const form = new SignalForm(
            parseFormJson({
                formDefinition: {
                    fields: [
                        {
                            id: 'lines',
                            type: 'repeatable-section',
                            numberOfColumns: 1,
                            params: { initialNumberOfRows: 1, maxNumberOfRows: 2 },
                            fields: {
                                1: [
                                    { id: 'kind', type: 'text' },
                                    { id: 'due', type: 'date' }
                                ]
                            },
                            value: [{ kind: 'first', due: '2024-03-15' }, { kind: 'second' }, { kind: 'third' }]
                        }
                    ],
                    outcomes: [],
                    variables: []
                }
            }),
            {},
            TestBed.inject(Injector)
        );

        expect(form.rowCount('lines')).toBe(3);
        expect(form.canAddRow('lines')).toBeFalse();
        expect(form.submittedValues()['lines']).toEqual([
            { kind: 'first', due: '2024-03-15T00:00:00.000Z' },
            { kind: 'second', due: null },
            { kind: 'third', due: null }
        ]);
    });

    describe('application validators', () => {
        const noTestCodes: FieldValidator = (field, value) =>
            field.type === 'text' && typeof value === 'string' && value.startsWith('TEST') ? 'APP.ERRORS.NO_TEST_CODES' : null;
        const validatedForm = () =>
            parseFormJson({
                formDefinition: {
                    fields: [
                        {
                            id: 'root',
                            type: 'container',
                            numberOfColumns: 1,
                            fields: {
                                1: [
                                    { id: 'code', type: 'text', required: true },
                                    { id: 'amount', type: 'integer', value: 'TEST' },
                                    { id: 'switch', type: 'text' },
                                    {
                                        id: 'hiddenCode',
                                        type: 'text',
                                        value: 'TEST-1',
                                        visibilityCondition: {
                                            leftType: 'field',
                                            leftValue: 'switch',
                                            operator: '==',
                                            rightValue: 'show',
                                            rightType: 'value',
                                            nextConditionOperator: ''
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    outcomes: [],
                    variables: []
                }
            });
        const errorKinds = (form: SignalForm, fieldId: string) =>
            form
                .fieldNode(fieldId)()
                .errors()
                .map(({ kind }) => kind);

        it('should reject the values an application validator refuses, on the fields it applies to', () => {
            const form = new SignalForm(validatedForm(), { validators: [noTestCodes] }, TestBed.inject(Injector));

            form.setValue('code', 'TEST-42');
            expect(errorKinds(form, 'code')).toEqual(['APP.ERRORS.NO_TEST_CODES']);
            expect(errorKinds(form, 'amount')).withContext('not a text field').not.toContain('APP.ERRORS.NO_TEST_CODES');

            form.setValue('code', 'PROD-42');
            expect(errorKinds(form, 'code')).toEqual([]);
        });

        it("should report the field type's own error first", () => {
            const form = new SignalForm(validatedForm(), { validators: [() => 'APP.ERRORS.ALWAYS'] }, TestBed.inject(Injector));

            expect(errorKinds(form, 'code')).toEqual(['required']);
        });

        it('should not validate a hidden field', () => {
            const form = new SignalForm(validatedForm(), { validators: [noTestCodes] }, TestBed.inject(Injector));
            expect(errorKinds(form, 'hiddenCode')).toEqual([]);

            form.setValue('switch', 'show');

            expect(errorKinds(form, 'hiddenCode')).toEqual(['APP.ERRORS.NO_TEST_CODES']);
        });
    });

    describe('values refreshed by the host', () => {
        const refreshedForm = () =>
            new SignalForm(
                parseFormJson({
                    formDefinition: {
                        fields: [
                            {
                                id: 'root',
                                type: 'container',
                                numberOfColumns: 1,
                                fields: {
                                    1: [
                                        { id: 'due', type: 'date' },
                                        { id: 'owner', name: 'ownerName', type: 'text' },
                                        { id: 'notes', type: 'text' },
                                        {
                                            id: 'country',
                                            type: 'dropdown',
                                            hasEmptyValue: true,
                                            options: [
                                                { id: 'it', name: 'Italy' },
                                                { id: 'fr', name: 'France' }
                                            ]
                                        },
                                        { id: 'external', type: 'display-external-property', value: 'from the API' },
                                        {
                                            id: 'frenchOnly',
                                            type: 'text',
                                            visibilityCondition: {
                                                leftType: 'field',
                                                leftValue: 'country',
                                                operator: '==',
                                                rightValue: 'fr',
                                                rightType: 'value',
                                                nextConditionOperator: ''
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                id: 'lines',
                                type: 'repeatable-section',
                                numberOfColumns: 1,
                                params: { initialNumberOfRows: 1, maxNumberOfRows: 5 },
                                fields: { 1: [{ id: 'when', type: 'date' }] }
                            }
                        ],
                        outcomes: [],
                        variables: []
                    }
                }),
                {},
                TestBed.inject(Injector)
            );

        it('should read refreshed values by type, keep what was typed elsewhere, and leave constant values alone', () => {
            const form = refreshedForm();
            form.setValue('notes', 'typed by the user');

            form.refreshValues({ due: '2024-03-15', 'variables.ownerName': 'Vito', country: 'fr', external: 'refreshed' });

            expect(form.submittedValues()['due']).toBe('2024-03-15T00:00:00.000Z');
            expect(form.submittedValues()['owner']).toBe('Vito');
            expect(form.submittedValues()['country']).toEqual({ id: 'fr', name: 'France' });
            expect(form.submittedValues()['notes']).toBe('typed by the user');
            expect(form.submittedValues()['external']).toBe('from the API');
        });

        it('should show and hide fields as refreshed values change their conditions', () => {
            const form = refreshedForm();
            const frenchOnly = form.fieldDefinition('frenchOnly');
            expect(form.isOnScreen(frenchOnly)).toBeFalse();

            form.refreshValues({ country: 'fr' });

            expect(form.isOnScreen(frenchOnly)).toBeTrue();
        });

        it("should replace a repeatable section's rows with the refreshed ones", () => {
            const form = refreshedForm();

            form.refreshValues({ lines: [{ when: '2024-03-15' }, { when: null }, { when: '2024-04-01' }] });

            expect(form.rowCount('lines')).toBe(3);
            expect(form.submittedValues()['lines']).toEqual([
                { when: '2024-03-15T00:00:00.000Z' },
                { when: null },
                { when: '2024-04-01T00:00:00.000Z' }
            ]);
        });

        it('should fill only the fields still without a value', () => {
            const form = refreshedForm();
            form.setValue('notes', 'typed by the user');

            form.fillMissingValues({ notes: 'filled', due: '2024-03-15', country: 'it' });

            expect(form.submittedValues()['notes']).toBe('typed by the user');
            expect(form.submittedValues()['due']).toBe('2024-03-15T00:00:00.000Z');
            expect(form.submittedValues()['country']).withContext('the empty option counts as no value').toEqual({ id: 'it', name: 'Italy' });
        });
    });

    describe('events and outcome requests', () => {
        const eventsForm = () =>
            parseFormJson({
                formDefinition: {
                    fields: [
                        { id: 'root', type: 'container', numberOfColumns: 1, fields: { 1: [{ id: 'notes', type: 'text' }] } },
                        { id: 'lines', type: 'repeatable-section', numberOfColumns: 1, fields: { 1: [{ id: 'item', type: 'text' }] } }
                    ],
                    outcomes: [{ id: 'approve', name: 'Approve' }],
                    variables: []
                }
            });

        const listen = (form: SignalForm): SignalFormEvent[] => {
            const received: SignalFormEvent[] = [];
            form.events.subscribe((event) => received.push(event));
            return received;
        };

        it('should tell its listeners when a repeatable section gains or loses a row', () => {
            const form = new SignalForm(eventsForm(), {}, TestBed.inject(Injector));
            const received = listen(form);

            form.addRow('lines');
            form.removeRow('lines', 0);

            expect(received).toEqual([
                { type: SignalFormEventType.RowCountChanged, fieldId: 'lines' },
                { type: SignalFormEventType.RowCountChanged, fieldId: 'lines' }
            ]);
        });

        it('should tell its listeners when the host refreshes its values', () => {
            const form = new SignalForm(eventsForm(), {}, TestBed.inject(Injector));
            const received = listen(form);

            form.refreshValues({ notes: 'refreshed' });

            expect(received).toEqual([{ type: SignalFormEventType.DataRefreshed }]);
        });

        it('should pass on the events its widgets report', () => {
            const form = new SignalForm(eventsForm(), {}, TestBed.inject(Injector));
            const received = listen(form);

            form.notify({ type: SignalFormEventType.Click, fieldId: 'item', row: { sectionId: 'lines', index: 0 } });

            expect(received).toEqual([{ type: SignalFormEventType.Click, fieldId: 'item', row: { sectionId: 'lines', index: 0 } }]);
        });

        it('should request a known outcome, and refuse an unknown one', () => {
            const form = new SignalForm(eventsForm(), {}, TestBed.inject(Injector));
            const requested: string[] = [];
            form.outcomeRequests.subscribe((outcome) => requested.push(outcome.id));

            expect(form.requestOutcome('approve')).toBeTrue();
            expect(form.requestOutcome('missing')).toBeFalse();
            expect(requested).toEqual(['approve']);
        });

        it('should show or hide an outcome as a rule asks, whatever its condition', () => {
            const definition = eventsForm();
            const form = new SignalForm(definition, {}, TestBed.inject(Injector));
            const approve = definition.outcomes.find((outcome) => outcome.id === 'approve');

            form.setOutcomeVisibility('approve', false);
            expect(form.isOutcomeConditionMet(approve)).toBeFalse();

            form.setOutcomeVisibility('approve', true);
            expect(form.isOutcomeConditionMet(approve)).toBeTrue();
        });

        it('should end its streams when its injector is destroyed', () => {
            const injector = createEnvironmentInjector([], TestBed.inject(EnvironmentInjector));
            const form = new SignalForm(eventsForm(), {}, injector);
            let eventsEnded = false;
            let requestsEnded = false;
            form.events.subscribe({ complete: () => (eventsEnded = true) });
            form.outcomeRequests.subscribe({ complete: () => (requestsEnded = true) });

            injector.destroy();

            expect(eventsEnded).toBeTrue();
            expect(requestsEnded).toBeTrue();
        });
    });

    describe('values given by form rules', () => {
        const rulesForm = () =>
            parseFormJson({
                formDefinition: {
                    ...tagsForm.formDefinition,
                    variables: [{ id: 'var-1', name: 'region', type: 'string', value: 'north' }]
                }
            });

        it('should read a JSON value the way the field type reads its saved value', () => {
            const form = new SignalForm(rulesForm(), {}, TestBed.inject(Injector));

            const definition = form.fieldDefinition('tags');

            expect(form.readValue('tags', [{ id: 'c', name: 'Gamma' }, 'not an option'])).toEqual([{ id: 'c', name: 'Gamma' }]);
            expect(definition.options.map(({ id }) => id))
                .withContext('a value read for a rule does not add options to the definition')
                .toEqual(['a', 'b']);
            expect(form.readValue('unknown', 'kept')).withContext('an unknown field keeps the value as given').toBe('kept');
        });

        it('should give a variable value by id or name, and the value a rule set', () => {
            const form = new SignalForm(rulesForm(), {}, TestBed.inject(Injector));

            expect(form.variableValue('region')).toBe('north');
            expect(form.variableValue('var-1')).toBe('north');

            form.setVariable('region', 'south');

            expect(form.variableValue('region')).toBe('south');
            expect(form.variableValue('missing')).toBeUndefined();
        });
    });

    describe('repeatable section rows', () => {
        const condition = (leftValue: string, rightValue: string) => ({
            leftType: 'field',
            leftValue,
            operator: '==',
            rightValue,
            rightType: 'value',
            nextConditionOperator: ''
        });
        const rowsForm = (section: object = {}) =>
            parseFormJson({
                formDefinition: {
                    fields: [
                        { id: 'root', type: 'container', numberOfColumns: 1, fields: { 1: [{ id: 'mode', type: 'text' }] } },
                        {
                            id: 'lines',
                            type: 'repeatable-section',
                            numberOfColumns: 1,
                            params: { initialNumberOfRows: 1, maxNumberOfRows: 3 },
                            fields: {
                                1: [
                                    { id: 'kind', type: 'text', maxLength: 4 },
                                    { id: 'detail', type: 'text', visibilityCondition: condition('kind', 'more') },
                                    { id: 'byMode', type: 'text', visibilityCondition: condition('mode', 'x') }
                                ]
                            },
                            ...section
                        }
                    ],
                    outcomes: [],
                    variables: []
                }
            });
        const firstRow = { sectionId: 'lines', index: 0 };
        const secondRow = { sectionId: 'lines', index: 1 };

        it('should keep a stable key per row while rows are added and removed', () => {
            const form = new SignalForm(rowsForm(), {}, TestBed.inject(Injector));
            const [firstKey] = form.rowKeys('lines');

            form.addRow('lines');
            const [, secondKey] = form.rowKeys('lines');
            form.removeRow('lines', 0);

            expect(form.rowKeys('lines')).toEqual([secondKey]);
            expect(secondKey).not.toBe(firstKey);
        });

        it('should give the node of a row field, and none for a row that no longer exists', () => {
            const form = new SignalForm(rowsForm(), {}, TestBed.inject(Injector));
            form.addRow('lines');

            expect(form.fieldNode('kind', secondRow)).toBeDefined();
            expect(form.fieldDefinition('kind', 'lines')?.id).toBe('kind');

            form.removeRow('lines', 1);

            expect(form.fieldNode('kind', secondRow)).toBeUndefined();
        });

        it('should keep the initial rows unless the section allows deleting them', () => {
            const form = new SignalForm(rowsForm(), {}, TestBed.inject(Injector));
            form.addRow('lines');

            expect(form.canRemoveRow('lines', 0)).withContext('an initial row').toBeFalse();
            expect(form.canRemoveRow('lines', 1)).withContext('an added row').toBeTrue();

            const deletable = new SignalForm(
                rowsForm({ params: { initialNumberOfRows: 1, allowInitialRowsDelete: true } }),
                {},
                TestBed.inject(Injector)
            );

            expect(deletable.canRemoveRow('lines', 0)).toBeTrue();
        });

        it('should neither add nor remove rows of a read-only section', () => {
            const form = new SignalForm(rowsForm({ readOnly: true }), {}, TestBed.inject(Injector));

            form.addRow('lines');
            form.removeRow('lines', 0);

            expect(form.isSectionReadOnly('lines')).toBeTrue();
            expect(form.rowCount('lines')).toBe(1);
            expect(form.isReadOnly(form.fieldDefinition('kind', 'lines'), firstRow)).toBeTrue();
        });

        it("should read a row's own field in a row condition, while it is valid", () => {
            const form = new SignalForm(rowsForm(), {}, TestBed.inject(Injector));
            const detail = form.fieldDefinition('detail', 'lines');
            form.addRow('lines');

            form.setValue('kind', 'more', firstRow);

            expect(form.isOnScreen(detail, firstRow)).toBeTrue();
            expect(form.isOnScreen(detail, secondRow)).withContext('another row keeps its own value').toBeFalse();

            form.setValue('kind', 'more!', firstRow);

            expect(form.isOnScreen(detail, firstRow)).withContext('an invalid value is not read').toBeFalse();
            expect(form.isOnScreen(detail, { sectionId: 'lines', index: 5 }))
                .withContext('a missing row')
                .toBeFalse();
        });

        it('should read a form field in a row condition that names no field of the section', () => {
            const form = new SignalForm(rowsForm(), {}, TestBed.inject(Injector));
            const byMode = form.fieldDefinition('byMode', 'lines');

            expect(form.isOnScreen(byMode, firstRow)).toBeFalse();

            form.setValue('mode', 'x');

            expect(form.isOnScreen(byMode, firstRow)).toBeTrue();
        });
    });

    describe('read-only form', () => {
        it('should make every field and section read-only', () => {
            const definition = parseFormJson(tagsForm);
            const form = new SignalForm(definition, { readOnly: true }, TestBed.inject(Injector));

            expect(form.readOnly).toBeTrue();
            expect(form.isReadOnly(definition.fields[0])).toBeTrue();
        });
    });

    describe('texts and display values', () => {
        const textsForm = () =>
            parseFormJson({
                formDefinition: {
                    fields: [
                        { id: 'main', type: 'container', numberOfColumns: 1, fields: { 1: [{ id: 'name', type: 'text', value: 'Ada' }] } },
                        {
                            id: 'box',
                            type: 'container',
                            numberOfColumns: 1,
                            visibilityCondition: {
                                leftType: 'field',
                                leftValue: 'name',
                                operator: '==',
                                rightValue: 'Ada',
                                rightType: 'value',
                                nextConditionOperator: ''
                            },
                            fields: { 1: [{ id: 'country', type: 'dropdown', value: 'it', options: [{ id: 'it', name: 'Italy' }] }] }
                        }
                    ],
                    outcomes: [],
                    variables: [{ id: 'var-1', name: 'region', type: 'string', value: 'north' }]
                }
            });
        const greeting = 'Hi ${field.name} from ${field.country} in ${variable.region}${field.missing}';

        it('should resolve field and variable expressions with the current values', () => {
            const form = new SignalForm(textsForm(), {}, TestBed.inject(Injector));

            expect(form.resolveText(greeting)).toBe('Hi Ada from it in north');

            form.setValue('name', '<b>Grace</b>');

            expect(form.resolveText('${field.name}', { escapeHtml: true })).toBe('&lt;b&gt;Grace&lt;/b&gt;');
        });

        it('should show typed values by name when asked to format them', () => {
            const form = new SignalForm(textsForm(), {}, TestBed.inject(Injector));

            expect(form.resolveText(greeting, { formatValues: true })).toBe('Hi Ada from Italy in north');
            expect(form.displayValue(form.fieldDefinition('country'), 'it')).toBe('Italy');
        });

        it('should show a layout element by its own condition', () => {
            const form = new SignalForm(textsForm(), {}, TestBed.inject(Injector));
            const [box] = form.fieldDefinition('country').ancestors;

            expect(form.isLayoutElementVisible(box)).toBeTrue();

            form.setValue('name', 'Grace');

            expect(form.isLayoutElementVisible(box)).toBeFalse();
        });
    });

    describe('field errors', () => {
        const patternForm = (customValidationMessage?: string) =>
            parseFormJson({
                formDefinition: {
                    fields: [
                        {
                            id: 'root',
                            type: 'container',
                            numberOfColumns: 1,
                            fields: { 1: [{ id: 'code', type: 'text', value: 'abc', regexPattern: '[0-9]+', customValidationMessage }] }
                        }
                    ],
                    outcomes: [],
                    variables: []
                }
            });
        const errorsOf = (form: SignalForm) =>
            form
                .fieldNode('code')()
                .errors()
                .map(({ kind, message }) => ({ kind, message }));

        it("should give a pattern error the form author's message", () => {
            const form = new SignalForm(patternForm('APP.DIGITS_ONLY'), {}, TestBed.inject(Injector));

            expect(errorsOf(form)).toEqual([{ kind: 'pattern', message: 'APP.DIGITS_ONLY' }]);
        });

        it('should give a pattern error no message when the author wrote none', () => {
            const form = new SignalForm(patternForm(), {}, TestBed.inject(Injector));

            expect(errorsOf(form)).toEqual([{ kind: 'pattern', message: undefined }]);
        });

        it('should show every error once asked to, touched or not', () => {
            const form = new SignalForm(patternForm(), {}, TestBed.inject(Injector));
            expect(form.allErrorsShown()).toBeFalse();

            form.showAllErrors();

            expect(form.allErrorsShown()).toBeTrue();
        });
    });

    describe('missing values', () => {
        it('should fill an empty text and an empty selection', () => {
            const form = new SignalForm(
                parseFormJson({
                    formDefinition: {
                        ...tagsForm.formDefinition,
                        fields: [
                            {
                                ...tagsForm.formDefinition.fields[0],
                                fields: { 1: [...tagsForm.formDefinition.fields[0].fields[1], { id: 'notes', type: 'text', value: '' }] }
                            }
                        ]
                    }
                }),
                {},
                TestBed.inject(Injector)
            );

            form.fillMissingValues({ tags: [{ id: 'a', name: 'Alpha' }], notes: 'filled' });

            expect(form.submittedValues()['tags']).toEqual([{ id: 'a', name: 'Alpha' }]);
            expect(form.submittedValues()['notes']).toBe('filled');
        });
    });

    it('should keep the value a rule sets for a variable without an id under its name', () => {
        const form = new SignalForm(
            parseFormJson({ formDefinition: { ...tagsForm.formDefinition, variables: [{ name: 'region', type: 'string', value: 'north' }] } }),
            {},
            TestBed.inject(Injector)
        );

        form.setVariable('region', 'south');
        form.setVariable('missing', 'ignored');

        expect(form.variableValue('region')).toBe('south');
        expect(form.variableValue('missing')).toBeUndefined();
    });
});
