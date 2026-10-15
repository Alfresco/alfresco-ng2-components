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
});
