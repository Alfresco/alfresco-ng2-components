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

import { ErrorHandler, Injector, signal } from '@angular/core';
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
import { EditJsonDialogComponent } from '@alfresco/adf-core';
import { readFormDefinition } from '../../definition/read-form-definition';
import { SignalForm, SignalFormOptions } from '../../state/signal-form';
import { FormWidgetRegistry, provideFormWidgets } from '../../widgets/form-widget-registry';
import { SignalTextWidgetComponent } from '../widgets/text/text-widget.component';
import { BUILT_IN_WIDGETS_LOADED_DIRECTLY, settleFixture } from '../testing/signal-form-testing.mock';
import { SignalFormRendererComponent } from './signal-form-renderer.component';

describe('SignalFormRendererComponent', () => {
    let fixture: ComponentFixture<SignalFormRendererComponent>;
    let form: SignalForm;

    const fieldsForm = (fields: object[]) => ({
        formDefinition: { fields: [{ id: 'root', type: 'container', numberOfColumns: 2, fields: { 1: fields } }], outcomes: [], variables: [] }
    });

    const render = async (definition: object, untilLoaded = true, options: SignalFormOptions = {}): Promise<void> => {
        const registry = TestBed.inject(FormWidgetRegistry);
        form = new SignalForm(readFormDefinition(definition, registry), options, TestBed.inject(Injector), registry);
        fixture = TestBed.createComponent(SignalFormRendererComponent);
        fixture.componentRef.setInput('form', form);
        await settle(untilLoaded);
    };

    const loading = (): HTMLElement | null => fixture.nativeElement.querySelector('[data-automation-id="adf-signal-form-field-loading"]');

    const settle = (untilLoaded = true): Promise<void> => settleFixture(fixture, untilLoaded);

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

    beforeEach(() => {
        confirmRemoval = true;
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule],
            providers: [
                provideFormWidgets(...BUILT_IN_WIDGETS_LOADED_DIRECTLY),
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

        const requiredOnExtra = () => {
            const definition = structuredClone(tabForm);
            definition.formDefinition.fields[1].fields[1][0] = { id: 'extraText', type: 'text', required: true } as never;
            return definition;
        };
        const tabMarkers = (): string[] =>
            Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'))
                .filter((tab: Element) => tab.querySelector('.adf-form-tab-validation-indicator'))
                .map((tab: Element) => tab.getAttribute('aria-label'));

        it('should mark a visible tab holding an invalid field, when the form has tab indicators on', async () => {
            await render(requiredOnExtra(), true, { features: { tabErrorIndicators: true } });
            expect(tabMarkers()).withContext('the invalid tab is hidden').toEqual([]);

            await type('showExtra', 'yes');
            expect(tabMarkers()).toEqual(['FORM.FORM_RENDERER.TAB_VALIDATION_ERRORS_LABEL']);
        });

        it('should not mark tabs while the form has tab indicators off', async () => {
            await render(requiredOnExtra());
            await type('showExtra', 'yes');

            expect(tabMarkers()).toEqual([]);
        });

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

        it('should remove a row holding hand-bound widgets without reading the removed row', async () => {
            const handleError = spyOn(TestBed.inject(ErrorHandler), 'handleError');
            await render({
                formDefinition: {
                    fields: [
                        {
                            id: 'lines',
                            type: 'repeatable-section',
                            numberOfColumns: 3,
                            params: { initialNumberOfRows: 2, maxNumberOfRows: 3, allowInitialRowsDelete: true },
                            fields: {
                                1: [{ id: 'due', type: 'date' }],
                                2: [{ id: 'price', type: 'amount' }],
                                3: [{ id: 'code', type: 'text', params: { inputMask: '000' } }]
                            }
                        }
                    ],
                    outcomes: [],
                    variables: []
                }
            });
            await type('code-Row1', '42');

            await click('[data-automation-id="adf-signal-form-row-remove"]');

            expect(rows().length).toBe(1);
            expect(input('code-Row0').value).withContext('the remaining row moved up').toBe('42');
            expect(handleError).not.toHaveBeenCalled();
        });

        it('should remove a row only once the removal is confirmed', async () => {
            const handleError = spyOn(TestBed.inject(ErrorHandler), 'handleError');
            await render(mockRepeatableSectionForm01);

            confirmRemoval = false;
            await click('[data-automation-id="adf-signal-form-row-remove"]');
            expect(rows().length).withContext('cancelled').toBe(2);

            confirmRemoval = true;
            await click('[data-automation-id="adf-signal-form-row-remove"]');
            expect(rows().length).toBe(1);
            expect(handleError).withContext('nothing reads the removed row').not.toHaveBeenCalled();
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
            expect(element('.adf-error-text')?.textContent.trim()).toBe('FORM.FIELD.VALIDATOR.INVALID_DATE_FORMAT');
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

        it('should report an empty required date as required, and a date out of range against its bound', async () => {
            await render(fieldsForm([{ id: 'due', name: 'Due', type: 'date', required: true, minValue: '2024-03-15' }]));

            await type('due', '');
            expect(element('.adf-error-text')?.textContent.trim()).toBe('FORM.FIELD.REQUIRED');

            await type('due', '1-1-2024');
            expect(element('.adf-error-text')?.textContent.trim()).toBe('FORM.FIELD.VALIDATOR.NOT_LESS_THAN');
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

    describe('required fields', () => {
        it('should mark required fields as required, following rules that change it', async () => {
            await render(
                fieldsForm([
                    { id: 'name', type: 'text', required: true },
                    { id: 'due', type: 'date', required: true },
                    { id: 'country', type: 'dropdown', required: true, options: [{ id: 'it', name: 'Italy' }] },
                    { id: 'note', type: 'text' }
                ])
            );
            const loader = TestbedHarnessEnvironment.loader(fixture);
            const textInput = (selector: string) => loader.getHarness(MatInputHarness.with({ selector }));

            expect(await (await textInput('#name')).isRequired()).toBeTrue();
            expect(await (await textInput('#due')).isRequired())
                .withContext('a hand-bound input')
                .toBeTrue();
            expect(await (await loader.getHarness(MatSelectHarness.with({ selector: '#country' }))).isRequired()).toBeTrue();
            expect(await (await textInput('#note')).isRequired()).toBeFalse();

            form.setRequired('name', false);
            form.setRequired('note', true);
            await settle();

            expect(await (await textInput('#name')).isRequired()).toBeFalse();
            expect(await (await textInput('#note')).isRequired()).toBeTrue();
        });
    });

    describe('display widgets', () => {
        it('should link to the value, adding the scheme it misses, and show the display text', async () => {
            await render(
                fieldsForm([
                    { id: 'site', name: 'Site', type: 'hyperlink', hyperlinkUrl: 'hyland.com', displayText: 'Hyland' },
                    { id: 'secure', type: 'hyperlink', value: 'https://example.org' },
                    { id: 'nowhere', type: 'hyperlink' }
                ])
            );

            const link = element('#site') as HTMLAnchorElement;
            expect(link.getAttribute('href')).toBe('http://hyland.com');
            expect(link.textContent.trim()).toBe('Hyland');
            expect(link.target).toBe('_blank');
            expect(element('#secure').getAttribute('href')).toBe('https://example.org');
            expect(element('#secure').textContent.trim()).toBe('https://example.org');
            expect(element('#nowhere').getAttribute('href')).toBe('#');
        });

        const shippingForm = fieldsForm([
            { id: 'greeting', type: 'readonly-text', value: 'Hello ${field.name}, shipping to ${field.country}' },
            { id: 'name', type: 'text' },
            { id: 'country', type: 'dropdown', options: [{ id: 'it', name: 'Italy' }], value: 'it' }
        ]);
        const greeting = () => element('#greeting').textContent.trim();

        it('should resolve read-only text expressions as the values they use change', async () => {
            await render(shippingForm);
            expect(greeting()).toBe('Hello , shipping to it');

            await type('name', 'Vito');

            expect(greeting()).toBe('Hello Vito, shipping to it');
        });

        it('should show typed values by name while the form has typed value formatting on, following the feature', async () => {
            const typedValueFormatting = signal(true);
            await render(shippingForm, true, { features: { typedValueFormatting } });
            expect(greeting()).toBe('Hello , shipping to Italy');

            typedValueFormatting.set(false);
            await settle();

            expect(greeting()).toBe('Hello , shipping to it');
        });

        it('should mask a text as it is typed, show the mask placeholder and submit the masked text', async () => {
            await render(fieldsForm([{ id: 'phone', type: 'text', params: { inputMask: '##-##0,00%', inputMaskPlaceholder: 'Rate: __-___,__%' } }]));
            expect(input('phone').placeholder).toBe('Rate: __-___,__%');

            await type('phone', 'F');
            expect(input('phone').value).withContext('rejected character removed').toBe('');

            await type('phone', '12345678');

            expect(input('phone').value).toBe('12-345,67%');
            expect(form.submissionValues()['phone']).toBe('12-345,67%');
        });

        it("should show a field's own message when its pattern fails", async () => {
            await render(
                fieldsForm([
                    { id: 'code', type: 'text', regexPattern: '[A-Z]{3}', customValidationMessage: 'Use three capital letters' },
                    { id: 'other', type: 'text', regexPattern: '[A-Z]{3}' }
                ])
            );

            await type('code', 'abc');
            await type('other', 'abc');

            const messages = Array.from(fixture.nativeElement.querySelectorAll('.adf-error-text')).map((message: Element) =>
                message.textContent.trim()
            );
            expect(messages).toEqual(['Use three capital letters', 'FORM.FIELD.VALIDATOR.INVALID_VALUE']);
        });

        it('should show an amount for the locale while not edited, and as typed while edited, when the form has locale amounts on', async () => {
            await render(fieldsForm([{ id: 'price', name: 'Price', type: 'amount', enableFractions: true, placeholder: '1000' }]), true, {
                features: { localeAmounts: true }
            });
            expect(input('price').placeholder).toBe('1,000.00');
            expect(element('.adf-amount-widget__prefix-spacing')).withContext('the locale format brings its own symbol').toBeNull();

            input('price').dispatchEvent(new Event('focus'));
            await type('price', '1234.5');

            expect(input('price').value).withContext('formatted once the user leaves the field').toBe('1,234.50');
            expect(form.submissionValues()['price']).toBe(1234.5);

            input('price').dispatchEvent(new Event('focus'));
            await settle();
            expect(input('price').value).toBe('1234.5');
        });

        it('should show a JSON value in the read-only JSON dialog', async () => {
            const open = spyOn(TestBed.inject(MatDialog), 'open');
            await render(fieldsForm([{ id: 'payload', name: 'Payload', type: 'json', value: { a: 1 } }]));

            element('#payload').click();

            expect(open).toHaveBeenCalledWith(EditJsonDialogComponent, {
                data: { title: 'Payload', editable: false, value: JSON.stringify({ a: 1 }, null, 2) },
                minWidth: '50%',
                minHeight: '50%'
            });
        });

        it('should show a display value read-only, taken from the process field it shows', async () => {
            await render({
                ...fieldsForm([{ id: 'shownName', type: 'readonly', params: { field: { id: 'name', name: 'name', type: 'text' } } }]),
                processVariables: [{ name: 'name', type: 'string', value: 'Vito' }]
            });

            expect(input('shownName').value).toBe('Vito');
            expect(input('shownName').disabled).toBeTrue();
        });

        it('should render a string field as text, validated like one', async () => {
            await render(fieldsForm([{ id: 'nickname', type: 'string', required: true, maxLength: 3 }]));
            expect(form.valid()).toBeFalse();

            await type('nickname', 'Vito');
            expect(form.valid()).withContext('longer than the maximum').toBeFalse();

            await type('nickname', 'Vi');
            expect(form.valid()).toBeTrue();
            expect(form.submissionValues()['nickname']).toBe('Vi');
        });
    });
});
