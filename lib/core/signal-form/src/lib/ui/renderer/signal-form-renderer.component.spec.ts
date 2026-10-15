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

import { Injector, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopTranslateModule } from '../../../../../src/lib/testing/noop-translate.module';
import { mockRepeatableSectionForm01, textWidgetVisibility } from '../../../../../src/lib/form/components/mock/form-renderer.component.mock';
import { MatDialog } from '@angular/material/dialog';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatTimepickerInputHarness } from '@angular/material/timepicker/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatRadioGroupHarness } from '@angular/material/radio/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { of } from 'rxjs';
import { readFormDefinition } from '../../definition/read-form-definition';
import { SignalForm } from '../../state/signal-form';
import { FormFieldType } from '../../definition/form-definition.model';
import { BUILT_IN_FORM_WIDGETS } from '../../widgets/built-in-form-widgets';
import { FormWidgetRegistry, provideFormWidgets } from '../../widgets/form-widget-registry';
import { SignalAmountWidgetComponent } from '../widgets/amount/amount-widget.component';
import { SignalCheckboxWidgetComponent } from '../widgets/checkbox/checkbox-widget.component';
import { SignalDateWidgetComponent } from '../widgets/date/date-widget.component';
import { SignalDateTimeWidgetComponent } from '../widgets/date-time/date-time-widget.component';
import { SignalDropdownWidgetComponent } from '../widgets/dropdown/dropdown-widget.component';
import { SignalMultilineTextWidgetComponent } from '../widgets/multiline-text/multiline-text-widget.component';
import { SignalRadioWidgetComponent } from '../widgets/radio/radio-widget.component';
import { SignalDecimalWidgetComponent, SignalIntegerWidgetComponent, SignalTextWidgetComponent } from '../widgets/text/text-widget.component';
import { SignalFormRendererComponent } from './signal-form-renderer.component';

describe('SignalFormRendererComponent', () => {
    let fixture: ComponentFixture<SignalFormRendererComponent>;
    let form: SignalForm;

    const fieldsForm = (fields: object[]) => ({
        formDefinition: { fields: [{ id: 'root', type: 'container', numberOfColumns: 2, fields: { 1: fields } }], outcomes: [], variables: [] }
    });

    const render = async (definition: object, untilLoaded = true): Promise<void> => {
        const registry = TestBed.inject(FormWidgetRegistry);
        form = new SignalForm(readFormDefinition(definition, registry), {}, TestBed.inject(Injector), registry);
        fixture = TestBed.createComponent(SignalFormRendererComponent);
        fixture.componentRef.setInput('form', form);
        await settle(untilLoaded);
    };

    const loading = (): HTMLElement | null => fixture.nativeElement.querySelector('[data-automation-id="adf-signal-form-field-loading"]');

    const settle = async (untilLoaded = true): Promise<void> => {
        for (let pass = 0; pass < 50; pass++) {
            fixture.detectChanges();
            await fixture.whenStable();
            await new Promise((resolve) => setTimeout(resolve, 10));
            if (pass >= 2 && (!untilLoaded || !loading())) {
                break;
            }
        }
        fixture.detectChanges();
    };

    const element = (selector: string): HTMLElement | null => fixture.nativeElement.querySelector(selector);
    const input = (fieldId: string): HTMLInputElement | null => element(`#${fieldId}`) as HTMLInputElement | null;

    const type = async (fieldId: string, value: string): Promise<void> => {
        const target = input(fieldId);
        target.value = value;
        target.dispatchEvent(new Event('input'));
        target.dispatchEvent(new Event('blur'));
        await settle();
    };

    let confirmRemoval: boolean;
    const directComponents: Record<string, Type<unknown>> = {
        [FormFieldType.Text]: SignalTextWidgetComponent,
        [FormFieldType.MultilineText]: SignalMultilineTextWidgetComponent,
        [FormFieldType.Integer]: SignalIntegerWidgetComponent,
        [FormFieldType.Amount]: SignalAmountWidgetComponent,
        [FormFieldType.Decimal]: SignalDecimalWidgetComponent,
        [FormFieldType.Boolean]: SignalCheckboxWidgetComponent,
        [FormFieldType.Dropdown]: SignalDropdownWidgetComponent,
        [FormFieldType.RadioButtons]: SignalRadioWidgetComponent,
        [FormFieldType.Date]: SignalDateWidgetComponent,
        [FormFieldType.DateTime]: SignalDateTimeWidgetComponent
    };
    const builtInsLoadedDirectly = BUILT_IN_FORM_WIDGETS.filter((definition) => directComponents[definition.type]).map((definition) => ({
        ...definition,
        component: () => Promise.resolve(directComponents[definition.type])
    }));

    beforeEach(() => {
        confirmRemoval = true;
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule],
            providers: [
                provideFormWidgets(...builtInsLoadedDirectly),
                { provide: MatDialog, useValue: { open: () => ({ beforeClosed: () => of(confirmRemoval) }) } }
            ]
        });
    });

    it('should render every visible field with its widget, inside its container', async () => {
        await render(textWidgetVisibility);

        expect(element('[data-automation-id="adf-signal-form-container-c5fa3358-c6b6-46b1-81cf-c8909150ed4c"]')).not.toBeNull();
        expect(input('textOne')).not.toBeNull();
        expect(input('textTwo')).withContext('hidden until textOne is "Test"').toBeNull();
        expect(input('textFour')).withContext('shown while textOne is empty').not.toBeNull();
    });

    it('should update the form as the user types, and show or hide the fields that depend on it', async () => {
        await render(textWidgetVisibility);

        await type('textOne', 'Test');

        expect(form.submissionValues()['textOne']).toBe('Test');
        expect(input('textTwo')).not.toBeNull();
        expect(input('textThree')).not.toBeNull();
    });

    it('should show the first validation error once the field is touched', async () => {
        await render(fieldsForm([{ id: 'amount', name: 'Amount', type: 'integer', required: true, maxValue: 10 }]));

        expect(element('.adf-error-text')).withContext('not touched yet').toBeNull();

        await type('amount', '42');

        expect(element('.adf-error-text')?.textContent).toContain('FORM.FIELD.VALIDATOR.NOT_GREATER_THAN');
        expect(form.valid()).toBeFalse();
    });

    it('should render a read-only field as read-only, without validating it', async () => {
        await render(fieldsForm([{ id: 'locked', type: 'text', readOnly: true, required: true }]));

        expect(input('locked')?.hasAttribute('readonly')).toBeTrue();
        expect(form.valid()).withContext("an empty required read-only field doesn't block the form").toBeTrue();
    });

    it('should render a Studio custom widget nobody implemented with the widget of its value type', async () => {
        await render(fieldsForm([{ id: 'nickname', type: 'my-widget-emulm', isCustomType: true, valueType: 'string' }]));

        expect(element('[data-automation-id="adf-signal-custom-widget-my-widget-emulm"] input#nickname')).not.toBeNull();

        await type('nickname', 'Vito');

        expect(form.submissionValues()['nickname']).toBe('Vito');
    });

    it('should show a placeholder for an unknown field type, keeping its value untouched', async () => {
        await render(fieldsForm([{ id: 'stars', type: 'rating', value: 4 }]));

        expect(element('[data-automation-id="adf-signal-form-field-unsupported"]')?.textContent).toContain('FORM.SIGNAL_FORM.WIDGET_UNSUPPORTED');
        expect(form.submissionValues()['stars']).toBe(4);
    });

    it('should show a field type announced but not loaded yet as loading, and render it once registered', async () => {
        const registry = TestBed.inject(FormWidgetRegistry);
        registry.announce('rating');
        await render(fieldsForm([{ id: 'stars', type: 'rating', value: 4 }]), false);

        expect(loading()).not.toBeNull();

        registry.register({
            type: 'rating',
            component: () => Promise.resolve(SignalTextWidgetComponent)
        });
        await settle();

        expect(input('stars')?.value).toBe('4');
        expect(loading()).toBeNull();
    });

    describe('tabs', () => {
        const tabForm = {
            formDefinition: {
                tabs: [
                    { id: 'main', title: 'Main' },
                    {
                        id: 'extra',
                        title: 'Extra',
                        visibilityCondition: {
                            leftType: 'field',
                            leftValue: 'showExtra',
                            operator: '==',
                            rightValue: 'yes',
                            rightType: 'value',
                            nextConditionOperator: ''
                        }
                    }
                ],
                fields: [
                    { id: 'main-root', type: 'container', tab: 'main', numberOfColumns: 1, fields: { 1: [{ id: 'showExtra', type: 'text' }] } },
                    { id: 'extra-root', type: 'container', tab: 'extra', numberOfColumns: 1, fields: { 1: [{ id: 'extraText', type: 'text' }] } }
                ],
                outcomes: [],
                variables: []
            }
        };
        const tabLabels = (): string[] =>
            Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')).map((tab: Element) => tab.textContent.trim());

        it('should show only the visible tabs, and a tab once its condition is met', async () => {
            await render(tabForm);

            expect(tabLabels()).toEqual(['Main']);
            expect(input('showExtra')).withContext('the first tab is rendered').not.toBeNull();

            await type('showExtra', 'yes');

            expect(tabLabels()).toEqual(['Main', 'Extra']);
        });
    });

    describe('repeatable sections', () => {
        const sectionId = 'RepeatableSection0tbw2y';
        const rows = (): NodeListOf<HTMLElement> => fixture.nativeElement.querySelectorAll('.adf-signal-form-repeatable-row');
        const click = async (selector: string): Promise<void> => {
            element(selector).click();
            await settle();
        };

        it('should render the initial rows, each bound to its own values', async () => {
            await render(mockRepeatableSectionForm01);

            expect(rows().length).toBe(2);
            expect(input('Text0wwp7n-Row0')).not.toBeNull();

            await type('Text0wwp7n-Row1', 'second row');

            expect((form.submissionValues()[sectionId] as Array<Record<string, unknown>>)[1]['Text0wwp7n']).toBe('second row');
            expect((form.submissionValues()[sectionId] as Array<Record<string, unknown>>)[0]['Text0wwp7n']).toBeNull();
        });

        it('should add rows up to the maximum, then show the limit', async () => {
            await render(mockRepeatableSectionForm01);

            for (let added = 0; added < 3; added++) {
                await click('[data-automation-id="adf-signal-form-row-add"]');
            }

            expect(rows().length).toBe(5);
            expect(element('[data-automation-id="adf-signal-form-row-add"]')).toBeNull();
            expect(element('.adf-signal-form-repeatable-limit')?.textContent).toContain('FORM.FIELD.REPEATABLE_SECTION.ROW_LIMIT_REACHED');
        });

        it('should remove a row only once the removal is confirmed', async () => {
            await render(mockRepeatableSectionForm01);

            confirmRemoval = false;
            await click('[data-automation-id="adf-signal-form-row-remove"]');
            expect(rows().length).withContext('cancelled').toBe(2);

            confirmRemoval = true;
            await click('[data-automation-id="adf-signal-form-row-remove"]');
            expect(rows().length).toBe(1);
        });
    });

    describe('choice and number widgets', () => {
        let loader: HarnessLoader;
        const options = (...names: string[]) => names.map((name) => ({ id: name.toLowerCase(), name }));
        const widgetsForm = fieldsForm([
            { id: 'agree', name: 'Agree', type: 'boolean', required: true },
            { id: 'size', name: 'Size', type: 'radio-buttons', options: options('Small', 'Large') },
            { id: 'country', name: 'Country', type: 'dropdown', hasEmptyValue: true, options: options('Italy', 'France') },
            { id: 'tags', name: 'Tags', type: 'dropdown', selectionType: 'multiple', options: options('Alpha', 'Beta') },
            { id: 'locked', name: 'Locked', type: 'dropdown', readOnly: true, options: options('One') },
            { id: 'price', name: 'Price', type: 'amount', currency: '€', enableFractions: true },
            { id: 'ratio', name: 'Ratio', type: 'bigdecimal', precision: 2 }
        ]);

        beforeEach(async () => {
            await render(widgetsForm);
            loader = TestbedHarnessEnvironment.loader(fixture);
        });

        it('should submit a checked checkbox and a chosen radio option', async () => {
            await (await loader.getHarness(MatCheckboxHarness.with({ selector: '#agree' }))).check();
            await (await loader.getHarness(MatRadioGroupHarness.with({ selector: '#size' }))).checkRadioButton({ label: 'Large' });
            await settle();

            expect(form.submissionValues()['agree']).toBeTrue();
            expect(form.submissionValues()['size']).toEqual({ id: 'large', name: 'Large' });
        });

        it('should submit the chosen dropdown options, single and multiple', async () => {
            const country = await loader.getHarness(MatSelectHarness.with({ selector: '#country' }));
            await country.open();
            await country.clickOptions({ text: 'France' });
            const tags = await loader.getHarness(MatSelectHarness.with({ selector: '#tags' }));
            await tags.open();
            await tags.clickOptions({ text: 'Alpha' });
            await tags.clickOptions({ text: 'Beta' });
            await settle();

            expect(form.submissionValues()['country']).toEqual({ id: 'france', name: 'France' });
            expect(form.submissionValues()['tags']).toEqual([
                { id: 'alpha', name: 'Alpha' },
                { id: 'beta', name: 'Beta' }
            ]);
        });

        it('should disable a read-only dropdown', async () => {
            expect(await (await loader.getHarness(MatSelectHarness.with({ selector: '#locked' }))).isDisabled()).toBeTrue();
        });

        it('should submit amounts and decimals as numbers, with the amount currency shown', async () => {
            await (await loader.getHarness(MatInputHarness.with({ selector: '#price' }))).setValue('12.5');
            await (await loader.getHarness(MatInputHarness.with({ selector: '#ratio' }))).setValue('3.14');
            await settle();

            expect(element('.adf-amount-widget__prefix-spacing')?.textContent).toContain('€');
            expect(form.submissionValues()['price']).toBe(12.5);
            expect(form.submissionValues()['ratio']).toBe(3.14);
        });
    });

    describe('date widgets', () => {
        it('should submit a typed date in the field display format', async () => {
            await render(fieldsForm([{ id: 'due', name: 'Due', type: 'date' }]));

            await type('due', '15-3-2024');

            expect(form.submissionValues()['due']).toBe('2024-03-15T00:00:00.000Z');
            expect(form.valid()).toBeTrue();
        });

        it('should keep unparseable text, report it and submit no date', async () => {
            await render(fieldsForm([{ id: 'due', name: 'Due', type: 'date' }]));

            await type('due', 'not a date');

            expect(input('due').value).toBe('not a date');
            expect(form.valid()).toBeFalse();
            expect(element('.adf-error-text')?.textContent).toContain('FORM.FIELD.VALIDATOR.INVALID_DATE');
            expect(form.submissionValues()['due']).toBeNull();
        });

        it('should show the initial date and a value set by a rule, in the display format', async () => {
            await render(fieldsForm([{ id: 'due', name: 'Due', type: 'date', value: '2024-03-15', dateDisplayFormat: 'DD/MM/YYYY' }]));

            expect(input('due').value).toBe('15/03/2024');

            form.setValue('due', new Date(2025, 0, 2));
            await settle();

            expect(input('due').value).toBe('02/01/2025');
        });

        it('should submit a day picked from the calendar', async () => {
            await render(fieldsForm([{ id: 'due', name: 'Due', type: 'date', value: '2024-03-15' }]));
            const dateInput = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatDatepickerInputHarness.with({ selector: '#due' }));

            await dateInput.openCalendar();
            await (await dateInput.getCalendar()).selectCell({ text: '20' });
            await settle();

            expect(form.submissionValues()['due']).toBe('2024-03-20T00:00:00.000Z');
            expect(input('due').value).toBe('20-3-2024');
        });

        it('should disable a read-only date', async () => {
            await render(fieldsForm([{ id: 'due', type: 'date', readOnly: true }]));

            expect(input('due').disabled).toBeTrue();
        });

        it('should combine the typed day and time into one datetime', async () => {
            await render(fieldsForm([{ id: 'meeting', name: 'Meeting', type: 'datetime' }]));

            await type('meeting', '15-03-2024');
            await type('meeting-time', '10:30');

            expect(form.submissionValues()['meeting']).toBe(new Date(2024, 2, 15, 10, 30).toISOString());
        });

        it('should keep the day when a time is picked from the timepicker', async () => {
            await render(fieldsForm([{ id: 'meeting', name: 'Meeting', type: 'datetime', value: '2024-03-15 10:30 AM' }]));
            const timeInput = await TestbedHarnessEnvironment.loader(fixture).getHarness(
                MatTimepickerInputHarness.with({ selector: '#meeting-time' })
            );

            await timeInput.openTimepicker();
            await (await timeInput.getTimepicker()).selectOption({ text: '14:00' });
            await settle();

            expect(form.submissionValues()['meeting']).toBe(new Date(2024, 2, 15, 14, 0).toISOString());
        });

        it('should take a datetime without a time as its midnight, and reject a time without a day', async () => {
            await render(fieldsForm([{ id: 'meeting', name: 'Meeting', type: 'datetime' }]));

            await type('meeting', '15-03-2024');
            expect(form.submissionValues()['meeting']).toBe(new Date(2024, 2, 15).toISOString());

            await type('meeting', '');
            await type('meeting-time', '10:30');
            expect(form.valid()).toBeFalse();
            expect(form.submissionValues()['meeting']).toBeNull();
        });

        it('should show the initial datetime in both inputs', async () => {
            await render(fieldsForm([{ id: 'meeting', type: 'datetime', value: '2024-03-15 10:30 AM' }]));

            expect(input('meeting').value).toBe('15-03-2024');
            expect(input('meeting-time').value).toBe('10:30');
        });
    });
});
