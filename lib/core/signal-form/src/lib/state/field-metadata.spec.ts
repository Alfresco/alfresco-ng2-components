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

import { Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { parseFormJson } from '../definition/form-json-parser';
import { LOCALE_AMOUNTS, TYPED_VALUE_FORMATTING } from './field-metadata';
import { SignalForm, SignalFormFeatures } from './signal-form';

describe('field metadata', () => {
    const createForm = (features?: SignalFormFeatures): SignalForm =>
        new SignalForm(
            parseFormJson({
                formDefinition: {
                    fields: [{ id: 'root', type: 'container', numberOfColumns: 1, fields: { 1: [{ id: 'price', type: 'amount' }] } }],
                    outcomes: [],
                    variables: []
                }
            }),
            { features },
            TestBed.inject(Injector)
        );

    it('should give every field the form features its widget reads', () => {
        const price = createForm({ typedValueFormatting: true, localeAmounts: false }).fieldNode('price')();

        expect(price.metadata(TYPED_VALUE_FORMATTING)?.()).toBeTrue();
        expect(price.metadata(LOCALE_AMOUNTS)?.()).toBeFalse();
    });

    it('should turn a feature off when the form has no features', () => {
        const price = createForm().fieldNode('price')();

        expect(price.metadata(TYPED_VALUE_FORMATTING)?.()).toBeFalse();
        expect(price.metadata(LOCALE_AMOUNTS)?.()).toBeFalse();
    });

    it('should follow a feature given as a signal', () => {
        const localeAmounts = signal(false);
        const price = createForm({ localeAmounts }).fieldNode('price')();

        localeAmounts.set(true);

        expect(price.metadata(LOCALE_AMOUNTS)?.()).toBeTrue();
    });
});
