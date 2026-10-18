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

import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFormDefinition } from '../definition/read-form-definition';
import type { FieldValidator } from '../widgets/form-widget-definition';
import { SignalForm } from './signal-form';

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
        const definition = readFormDefinition(tagsForm);
        const form = new SignalForm(definition, {}, TestBed.inject(Injector));
        const [alpha, beta] = definition.fields[0].options;

        form.setValue('tags', [alpha, beta]);
        expect(form.fieldNode('tags')[0]).withContext('Signal Forms tracks the selected items').toBeDefined();

        const submitted = form.submissionValues()['tags'] as object[];
        expect(submitted).toEqual([
            { id: 'a', name: 'Alpha' },
            { id: 'b', name: 'Beta' }
        ]);
        submitted.forEach((item) => expect(Object.getOwnPropertySymbols(item)).toEqual([]));
    });

    it('should not stamp the objects of the definition it reads its initial values from', () => {
        const definition = readFormDefinition({
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
        const definition = readFormDefinition({
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
            readFormDefinition({
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
        expect(form.submissionValues()['lines']).toEqual([
            { kind: 'first', due: '2024-03-15T00:00:00.000Z' },
            { kind: 'second', due: null },
            { kind: 'third', due: null }
        ]);
    });

    describe('application validators', () => {
        const noTestCodes: FieldValidator = (field, value) =>
            field.type === 'text' && `${value ?? ''}`.startsWith('TEST') ? 'APP.ERRORS.NO_TEST_CODES' : null;
        const validatedForm = () =>
            readFormDefinition({
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
                readFormDefinition({
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

            expect(form.submissionValues()['due']).toBe('2024-03-15T00:00:00.000Z');
            expect(form.submissionValues()['owner']).toBe('Vito');
            expect(form.submissionValues()['country']).toEqual({ id: 'fr', name: 'France' });
            expect(form.submissionValues()['notes']).toBe('typed by the user');
            expect(form.submissionValues()['external']).toBe('from the API');
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
            expect(form.submissionValues()['lines']).toEqual([
                { when: '2024-03-15T00:00:00.000Z' },
                { when: null },
                { when: '2024-04-01T00:00:00.000Z' }
            ]);
        });

        it('should fill only the fields still without a value', () => {
            const form = refreshedForm();
            form.setValue('notes', 'typed by the user');

            form.fillMissingValues({ notes: 'filled', due: '2024-03-15', country: 'it' });

            expect(form.submissionValues()['notes']).toBe('typed by the user');
            expect(form.submissionValues()['due']).toBe('2024-03-15T00:00:00.000Z');
            expect(form.submissionValues()['country']).withContext('the empty option counts as no value').toEqual({ id: 'it', name: 'Italy' });
        });
    });
});
