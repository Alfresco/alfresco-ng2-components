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
import { FormFieldType } from '../definition/form-definition.model';
import { readFormDefinition } from '../definition/read-form-definition';
import { SignalForm } from '../state/signal-form';
import { FormWidgetDefinition, FieldValidator } from './form-widget-definition';
import { FormWidgetRegistry, FormWidgetState, provideFormWidgets } from './form-widget-registry';

describe('FormWidgetRegistry', () => {
    const atLeastThreeStars: FieldValidator = (field, value) => (field.required && !(+value >= 3) ? 'notEnoughStars' : null);
    const rating: FormWidgetDefinition = {
        type: 'rating',
        initialValue: () => 0,
        submittedValue: ({ value }) => ({ stars: value }),
        validators: [atLeastThreeStars]
    };
    const ratingForm = {
        formDefinition: {
            fields: [{ id: 'root', type: 'container', numberOfColumns: 1, fields: { 1: [{ id: 'score', type: 'rating', required: true }] } }],
            outcomes: [],
            variables: []
        }
    };

    const setUp = (...providers: ReturnType<typeof provideFormWidgets>[]): FormWidgetRegistry => {
        TestBed.configureTestingModule({ providers });
        return TestBed.inject(FormWidgetRegistry);
    };

    const createForm = (registry: FormWidgetRegistry): SignalForm =>
        new SignalForm(readFormDefinition(ratingForm, registry), {}, TestBed.inject(Injector), registry);

    it('should know the built-in field types', () => {
        const registry = setUp();

        expect(registry.stateOf(FormFieldType.Text)).toBe(FormWidgetState.Registered);
        expect(registry.definitionFor(FormFieldType.Dropdown)?.validators?.length).toBe(1);
    });

    it('should let a provided definition replace a built-in one', () => {
        const ownText: FormWidgetDefinition = { type: FormFieldType.Text, validators: [] };
        const registry = setUp(provideFormWidgets(ownText));

        expect(registry.definitionFor(FormFieldType.Text)).toBe(ownText);
    });

    it('should tell registered, announced and unknown field types apart', () => {
        const registry = setUp();
        registry.announce('rating');

        expect(registry.stateOf('rating')).toBe(FormWidgetState.Announced);
        expect(registry.stateOf('stars')).toBe(FormWidgetState.Unknown);

        registry.register(rating);

        expect(registry.stateOf('rating')).toBe(FormWidgetState.Registered);
        expect(registry.definitions().get('rating')).toBe(rating);
    });

    it('should run a field type defined outside ADF: its initial value, validators and submitted value', () => {
        const form = createForm(setUp(provideFormWidgets(rating)));

        expect(form.submissionValues()['score']).toEqual({ stars: 0 });
        expect(form.valid()).toBeFalse();

        form.setValue('score', 4);

        expect(form.valid()).toBeTrue();
        expect(form.submissionValues()['score']).toEqual({ stars: 4 });
    });

    describe('Studio custom widgets', () => {
        const customForm = (valueType?: string) => ({
            formDefinition: {
                fields: [
                    {
                        id: 'root',
                        type: 'container',
                        numberOfColumns: 1,
                        fields: { 1: [{ id: 'score', type: 'my-widget-emulm', isCustomType: true, widgetId: 'w1', valueType, required: true }] }
                    }
                ],
                outcomes: [],
                variables: []
            }
        });
        const createCustomForm = (registry: FormWidgetRegistry, valueType?: string): SignalForm =>
            new SignalForm(readFormDefinition(customForm(valueType), registry), {}, TestBed.inject(Injector), registry);

        it('should handle a custom widget nobody implemented by the built-in definition of its value type', () => {
            const registry = setUp();
            const form = createCustomForm(registry, 'integer');

            expect(registry.stateOfField({ type: 'my-widget-emulm', isCustomType: true, valueType: 'integer' })).toBe(FormWidgetState.Registered);
            expect(form.valid()).withContext('required and empty').toBeFalse();

            form.setValue('score', 'x');
            expect(form.valid()).withContext('not an integer').toBeFalse();

            form.setValue('score', '12');
            expect(form.valid()).toBeTrue();
            expect(form.submissionValues()['score']).toBe(12);
        });

        it('should leave a custom widget without a value type unknown', () => {
            expect(setUp().stateOfField({ type: 'my-widget-emulm', isCustomType: true })).toBe(FormWidgetState.Unknown);
        });

        it('should replace the value type handling as soon as the widget has its own definition', () => {
            const registry = setUp();
            const form = createCustomForm(registry, 'integer');
            form.setValue('score', '12');

            registry.register({ type: 'my-widget-emulm', submittedValue: ({ value }) => `#${value}` });

            expect(form.submissionValues()['score']).toBe('#12');
        });
    });

    it('should apply a field type registered after the form was created', () => {
        const registry = setUp();
        const form = createForm(registry);
        form.setValue('score', 1);

        expect(form.valid()).withContext('no validators before the type is registered').toBeTrue();
        expect(form.submissionValues()['score']).toBe(1);

        registry.register(rating);

        expect(form.valid()).withContext('the registered validator applies').toBeFalse();
        expect(form.submissionValues()['score']).toEqual({ stars: 1 });
    });
});
