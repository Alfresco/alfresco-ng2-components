/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CardViewSelectItemModel } from '../../models/card-view-selectitem.model';
import { CardViewSelectItemComponent } from './card-view-selectitem.component';
import { of } from 'rxjs';
import { AppConfigService } from '../../../app-config/app-config.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { DebugElement, SimpleChange, SimpleChanges } from '@angular/core';
import { CardViewPropertyValidatorDirective } from '../../directives/card-view-property-validator.directive';
import { MatError } from '@angular/material/form-field';
import { FormControl, NgModel } from '@angular/forms';

describe('CardViewSelectItemComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<CardViewSelectItemComponent>;
    let component: CardViewSelectItemComponent;
    let appConfig: AppConfigService;
    let cardViewUpdateService: CardViewUpdateService;
    let testingUtils: UnitTestingUtils;
    const mockData = [
        { key: 'one', label: 'One' },
        { key: 'two', label: 'Two' },
        { key: 'three', label: 'Three' }
    ];
    const mockDataNumber = [
        { key: 1, label: 'One' },
        { key: 2, label: 'Two' },
        { key: 3, label: 'Three' }
    ];
    const mockDefaultProps = {
        label: 'Select box label',
        value: 'two',
        options$: of(mockData),
        key: 'key',
        editable: true
    };
    const mockDefaultNumbersProps = {
        label: 'Select box label',
        value: 2,
        options$: of(mockDataNumber),
        key: 'key',
        editable: true
    };

    const getSelectElement = (): DebugElement => testingUtils.getByDataAutomationId('select-box');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CardViewSelectItemComponent]
        });
        fixture = TestBed.createComponent(CardViewSelectItemComponent);
        component = fixture.componentInstance;
        appConfig = TestBed.inject(AppConfigService);
        cardViewUpdateService = TestBed.inject(CardViewUpdateService);
        component.property = new CardViewSelectItemModel(mockDefaultProps);
        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Rendering', () => {
        it('should render custom label when editable is set to false', () => {
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: false
            });
            fixture.detectChanges();
            expect(testingUtils.getInnerTextByCSS('.adf-property-label')).toBe('Select box label');
        });

        it('should render disable select when editable property is FALSE', async () => {
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: false
            });

            component.ngOnChanges({});
            fixture.detectChanges();
            const selectBox = await testingUtils.getMatSelectByDataAutomationId('select-box');

            expect(await selectBox.isDisabled()).toBe(true);
        });

        it('should be possible edit selectBox item', async () => {
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: true
            });
            component.editable = true;
            component.displayNoneOption = true;
            component.ngOnChanges({});
            fixture.detectChanges();

            expect(component.property.value).toEqual('two');
            expect(component.isEditable).toBe(true);

            const options = await testingUtils.getMatSelectOptions();
            expect(options.length).toEqual(4);
            await options[1].click();

            expect(component.property.value).toEqual('one');
        });

        it('should be possible edit selectBox item with numbers', async () => {
            component.property = new CardViewSelectItemModel({
                ...mockDefaultNumbersProps,
                editable: true
            });
            component.editable = true;
            component.displayNoneOption = true;
            component.ngOnChanges({});
            fixture.detectChanges();

            expect(component.property.value).toEqual(2);
            expect(component.isEditable).toBe(true);

            const options = await testingUtils.getMatSelectOptions();

            expect(options.length).toEqual(4);
            await options[1].click();

            expect(component.property.value).toEqual(1);
        });

        it('should be able to enable None option', async () => {
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: true
            });
            component.editable = true;
            component.displayNoneOption = true;
            component.ngOnChanges({});
            fixture.detectChanges();

            expect(component.isEditable).toBe(true);

            const options = await testingUtils.getMatSelectOptions();

            expect(await options[0].getText()).toBe('CORE.CARDVIEW.NONE');
        });

        it('should render select box if editable property is TRUE', async () => {
            component.ngOnChanges({});
            component.editable = true;
            fixture.detectChanges();

            expect(await testingUtils.checkIfMatSelectExists()).toBe(true);
        });

        it('should not have label twice', async () => {
            component.ngOnChanges({});
            component.editable = true;
            fixture.detectChanges();
            const not_editable_label = testingUtils.getByCSS('.adf-property-label-not-editable');
            const field = await testingUtils.getMatFormFieldByCSS('.adf-property-value');

            expect(await field.hasLabel()).toBeTrue();
            expect(not_editable_label).toBeFalsy();
        });

        it('should have proper aria-label on select box', async () => {
            component.ngOnChanges({});
            component.editable = true;
            fixture.detectChanges();

            const selectBox = await testingUtils.getMatSelectByDataAutomationId('select-box');
            const host = await selectBox.host();
            expect(await host.getAttribute('aria-label')).toBe('Select box label');
        });
    });

    describe('Filter', () => {
        it('should render a list of filtered options', async () => {
            appConfig.config['content-metadata'] = {
                selectFilterLimit: 0
            };
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: true
            });
            component.editable = true;
            component.displayNoneOption = false;
            component.ngOnChanges({});
            fixture.detectChanges();

            let options = await testingUtils.getMatSelectOptions();
            expect(options.length).toBe(3);

            testingUtils.fillInputByCSS('.adf-select-filter-input input', mockData[0].label);
            options = await testingUtils.getMatSelectOptions(true);
            expect(options.length).toBe(1);
            expect(await options[0].getText()).toEqual(mockData[0].label);
        });

        it('should hide filter if options are less then limit', async () => {
            appConfig.config['content-metadata'] = {
                selectFilterLimit: mockData.length + 1
            };
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: true
            });
            component.editable = true;
            component.displayNoneOption = false;
            component.ngOnChanges({});
            fixture.detectChanges();

            await testingUtils.openMatSelect();
            const filterInput = testingUtils.getInputByCSS('.adf-select-filter-input input');
            expect(filterInput).toBeUndefined();
        });

        it('should show filter if options are greater then limit', async () => {
            appConfig.config['content-metadata'] = {
                selectFilterLimit: mockData.length - 1
            };
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: true
            });
            component.editable = true;
            component.displayNoneOption = false;
            component.ngOnChanges({});
            fixture.detectChanges();

            await testingUtils.openMatSelect();

            const filterInput = testingUtils.getInputByCSS('.adf-select-filter-input input');
            expect(filterInput).not.toBe(null);
        });
    });

    describe('Autocomplete based', () => {
        beforeEach(() => {
            component.property = new CardViewSelectItemModel({
                label: 'Test Label',
                value: 'initial value',
                key: 'test-key',
                default: 'Placeholder',
                editable: true,
                autocompleteBased: true,
                options$: of([
                    { key: '1', label: 'Option 1' },
                    { key: '2', label: 'Option 2' }
                ])
            });
        });

        it('should set templateType to autocompleteBased', () => {
            component.property.autocompleteBased = true;
            fixture.detectChanges();
            expect(component.templateType).toBe('autocompleteBased');
        });

        it('should set initial value to autocompleteControl', () => {
            fixture.componentRef.setInput('property', component.property);
            fixture.componentRef.setInput('editable', true);
            fixture.detectChanges();

            expect(component.autocompleteControl.value).toBe('initial value');
        });

        it('should emit autocompleteInputValue$ with new value on autocompleteControl change', async () => {
            const autocompleteValueSpy = spyOn(cardViewUpdateService.autocompleteInputValue$, 'next');
            component.editedValue = '';
            component.editable = true;
            component.ngOnChanges({ property: new SimpleChange(null, component.property, true) } as SimpleChanges);
            fixture.detectChanges();

            component.autocompleteControl.setValue('new value');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(autocompleteValueSpy).toHaveBeenCalledWith('new value');
        });

        it('should update value correctly on option selected', () => {
            cardViewUpdateService.update = jasmine.createSpy('update');
            component.filteredOptions = [
                { key: '1', label: 'Option 1' },
                { key: '2', label: 'Option 2' }
            ];
            const event = {
                option: {
                    value: '1'
                }
            } as MatAutocompleteSelectedEvent;

            component.ngOnChanges({});
            fixture.detectChanges();

            component.onOptionSelected(event);
            fixture.detectChanges();

            expect(component.property.value).toBe('1');
            expect(cardViewUpdateService.update).toHaveBeenCalledWith(jasmine.objectContaining(component.property), '1');
        });

        it('should disable the autocomplete control', () => {
            component.editable = false;
            component.ngOnChanges({ editable: { currentValue: false, previousValue: true, firstChange: false, isFirstChange: () => false } });
            fixture.detectChanges();
            expect(component.autocompleteControl.disabled).toBeTrue();
        });

        it('should enable the autocomplete control', () => {
            component.editable = true;
            component.ngOnChanges({ editable: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false } });
            fixture.detectChanges();
            expect(component.autocompleteControl.enabled).toBeTrue();
        });

        it('should populate options for autocomplete', async () => {
            component.filteredOptions = [
                { key: '1', label: 'Option 1' },
                { key: '2', label: 'Option 2' }
            ];
            component.ngOnChanges({});
            fixture.detectChanges();

            const options = await testingUtils.typeAndGetOptionsForMatAutoComplete(fixture, 'Op');
            expect(options.length).toBe(2);
            expect(await options[0].getText()).toContain('Option 1');
            expect(await options[1].getText()).toContain('Option 2');
        });

        it('should update filteredOptions when autocompleteControl value changes', fakeAsync(() => {
            component.editedValue = '';
            component.editable = true;
            component.ngOnChanges({ property: new SimpleChange(null, component.property, true) } as SimpleChanges);
            fixture.detectChanges();

            component.autocompleteControl.setValue('Option 1');
            fixture.detectChanges();

            tick(50);

            expect(component.filteredOptions.length).toBe(1);
            expect(component.filteredOptions[0].label).toBe('Option 1');

            component.autocompleteControl.setValue('2');
            fixture.detectChanges();

            tick(50);

            expect(component.filteredOptions.length).toBe(1);
            expect(component.filteredOptions[0].label).toBe('Option 2');
        }));

        it('should render autocomplete options from filteredOptions array', async () => {
            component.filteredOptions = [
                { key: '1', label: 'Option 1' },
                { key: '2', label: 'Option 2' }
            ];
            component.ngOnChanges({});
            fixture.detectChanges();

            const options = await testingUtils.typeAndGetOptionsForMatAutoComplete(fixture, 'Option');

            expect(options.length).toBe(2);
            expect(await options[0].getText()).toContain('Option 1');
            expect(await options[1].getText()).toContain('Option 2');
        });
        it('should have proper aria-label on autocomplete input', () => {
            component.ngOnChanges({});
            fixture.detectChanges();

            const input = testingUtils.getInputByCSS('.adf-property-value');
            expect(input).toBeTruthy();
            expect(input.getAttribute('aria-label')).toBe('Test Label');
        });
    });

    describe('Numeric initial value', () => {
        const priorityOptions = [
            { key: 0, label: 'PROCESS_EDITOR.PRIORITIES.NONE' },
            { key: 1, label: 'PROCESS_EDITOR.PRIORITIES.LOW' },
            { key: 2, label: 'PROCESS_EDITOR.PRIORITIES.MEDIUM' },
            { key: 3, label: 'PROCESS_EDITOR.PRIORITIES.HIGH' }
        ];

        const createNumericProperty = (config: {
            autocompleteBased: boolean;
            value: number;
            label?: string;
            displayNoneOption?: boolean;
            options?: { key: number; label: string }[];
        }) =>
            new CardViewSelectItemModel({
                label: config.label ?? 'Priority',
                value: config.value,
                key: 'priority',
                editable: true,
                autocompleteBased: config.autocompleteBased,
                displayNoneOption: config.displayNoneOption,
                options$: of(config.options ?? priorityOptions)
            });

        const applyInputs = (property: CardViewSelectItemModel<number>) => {
            fixture.componentRef.setInput('property', property);
            fixture.componentRef.setInput('editable', true);
            fixture.detectChanges();
        };

        it('should not throw when autocompleteBased and initial value is numeric', fakeAsync(() => {
            const property = createNumericProperty({
                autocompleteBased: true,
                value: 1,
                options: [
                    { key: 1, label: 'Option 1' },
                    { key: 2, label: 'Option 2' }
                ]
            });
            const filterOptionsSpy = spyOn<any>(component, 'filterOptions').and.callThrough();

            applyInputs(property);
            tick(50);

            expect(filterOptionsSpy).toHaveBeenCalled();
        }));

        it('should not call filterOptions when autocompleteBased is false and initial value is numeric', () => {
            const property = createNumericProperty({
                autocompleteBased: false,
                value: 0,
                label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.PRIORITY',
                displayNoneOption: false
            });
            const filterOptionsSpy = spyOn<any>(component, 'filterOptions');

            applyInputs(property);

            expect(component.property.value).toBe(0);
            expect(filterOptionsSpy).not.toHaveBeenCalled();
        });
    });

    describe('Multivalued select', () => {
        const multivaluedMockData = [
            { key: 'one', label: 'One' },
            { key: 'two', label: 'Two' },
            { key: 'three', label: 'Three' }
        ];

        beforeEach(() => {
            component.property = new CardViewSelectItemModel({
                label: 'Multi Select Label',
                value: ['one'],
                key: 'multi-key',
                editable: true,
                multivalued: true,
                options$: of(multivaluedMockData)
            });
        });

        it('should initialize property.value as empty array if not set and multivalued is true', () => {
            component.property.value = null;
            component.ngOnChanges({});
            fixture.detectChanges();

            expect(component.property.value).toEqual([]);
        });

        it('should enable multiple selection on select box when multivalued is true', async () => {
            component.editable = true;
            component.displayNoneOption = false;
            component.ngOnChanges({});
            fixture.detectChanges();

            const selectBox = await testingUtils.getMatSelectByDataAutomationId('select-box');
            expect(await selectBox.isMultiple()).toBe(true);
        });

        it('should not display None option when multivalued is true', async () => {
            component.editable = true;
            component.displayNoneOption = true;
            component.ngOnChanges({});
            fixture.detectChanges();

            const options = await testingUtils.getMatSelectOptions();
            const optionTexts = await Promise.all(options.map((opt) => opt.getText()));
            const hasNoneOption = optionTexts.some((text) => text.includes('CORE.CARDVIEW.NONE'));

            expect(hasNoneOption).toBe(false);
        });

        it('should allow selecting multiple values', async () => {
            component.editable = true;
            component.displayNoneOption = false;
            component.ngOnChanges({});
            fixture.detectChanges();

            expect(component.property.value).toEqual(['one']);

            const options = await testingUtils.getMatSelectOptions();
            await options[1].click();

            expect(component.property.value).toContain('two');
            expect(component.property.value.length).toBe(2);
        });
    });

    describe('Multivalued autocomplete based', () => {
        const multivaluedOptions = [
            { key: 'option1', label: 'Option 1' },
            { key: 'option2', label: 'Option 2' },
            { key: 'option3', label: 'Option 3' }
        ];

        beforeEach(() => {
            component.property = new CardViewSelectItemModel({
                label: 'Multi Autocomplete Label',
                value: [],
                key: 'multi-autocomplete-key',
                editable: true,
                autocompleteBased: true,
                multivalued: true,
                options$: of(multivaluedOptions)
            });
        });

        it('should add value to array when option is selected', async () => {
            component.editable = true;
            component.filteredOptions = multivaluedOptions;
            component.ngOnChanges({ property: new SimpleChange(null, component.property, true) } as SimpleChanges);
            fixture.detectChanges();

            const options = await testingUtils.typeAndGetOptionsForMatAutoComplete(fixture, 'Option');

            expect(options.length).toBe(3);

            await options[0].click();

            expect(component.property.value).toContain('option1');
        });

        it('should render chip remove buttons with proper aria-label', () => {
            component.property.value = ['option1'];
            component.editable = true;
            component.ngOnChanges({});
            fixture.detectChanges();

            const removeButtons = testingUtils.getAllByCSS('button[aria-label*="CORE.CARDVIEW.REMOVE"]');
            expect(removeButtons.length).toBeGreaterThan(0);
            expect(removeButtons[0].nativeElement.getAttribute('aria-label')).toContain('CORE.CARDVIEW.REMOVE');
        });

        it('should remove chip when remove button is clicked', async () => {
            const updateSpy = spyOn(cardViewUpdateService, 'update');
            component.property.value = ['option1', 'option2'];
            component.editable = true;
            component.ngOnChanges({});
            fixture.detectChanges();

            const removeButtons = testingUtils.getAllByCSS('button[matChipRemove]');
            expect(removeButtons.length).toBe(2);

            removeButtons[0].nativeElement.click();
            fixture.detectChanges();

            expect(component.property.value).toEqual(['option2']);
            expect(updateSpy).toHaveBeenCalledWith(jasmine.objectContaining(component.property), ['option2']);

            const remainingChips = await testingUtils.getMatChips();
            expect(remainingChips.length).toBe(1);
        });

        it('should add value to list when pressing ENTER with valid option', fakeAsync(() => {
            component.property.value = ['option1'];
            component.filteredOptions = [
                { key: 'option2', label: 'option2' },
                { key: 'option3', label: 'option3' }
            ];
            component.editable = true;
            component.ngOnInit();
            component.ngOnChanges({ property: new SimpleChange(null, component.property, true) } as SimpleChanges);
            fixture.detectChanges();
            tick(50);

            const updateSpy = spyOn(cardViewUpdateService, 'update');

            const chipInputEvent = { value: 'option2', chipInput: { clear: jasmine.createSpy('clear') } } as any;
            component.addValueToList(chipInputEvent);

            fixture.detectChanges();
            tick(50);

            expect(component.property.value).toContain('option2');
            expect(updateSpy).toHaveBeenCalledWith(jasmine.objectContaining(component.property), ['option1', 'option2']);
            expect(chipInputEvent.chipInput.clear).toHaveBeenCalled();
        }));

        it('should not add value when pressing ENTER with invalid option', fakeAsync(() => {
            component.property.value = ['option1'];
            component.filteredOptions = [
                { key: 'option2', label: 'option2' },
                { key: 'option3', label: 'option3' }
            ];
            component.editable = true;
            component.ngOnInit();
            component.ngOnChanges({ property: new SimpleChange(null, component.property, true) } as SimpleChanges);
            fixture.detectChanges();
            tick(50);

            const updateSpy = spyOn(cardViewUpdateService, 'update');

            const chipInputEvent = { value: 'invalidOption', chipInput: { clear: jasmine.createSpy('clear') } } as any;
            component.addValueToList(chipInputEvent);

            fixture.detectChanges();
            tick(50);

            expect(component.property.value).toEqual(['option1']);
            expect(updateSpy).not.toHaveBeenCalled();
        }));

        it('should filter out already selected options from filteredOptions', fakeAsync(() => {
            component.filteredOptions = [...multivaluedOptions];
            component.property.value = ['option1'];
            component.editedValue = '';
            component.editable = true;
            component.ngOnInit();
            component.ngOnChanges({ property: new SimpleChange(null, component.property, true) } as SimpleChanges);
            fixture.detectChanges();

            component.autocompleteControl.setValue('Op');
            fixture.detectChanges();

            tick(50);

            expect(component.filteredOptions.length).toBe(2);
            expect(component.filteredOptions[0].label).toBe('Option 2');
            expect(component.filteredOptions[1].label).toBe('Option 3');
        }));

        it('should update filteredOptions after option selection', fakeAsync(() => {
            component.filteredOptions = [...multivaluedOptions];
            component.editable = true;
            component.ngOnChanges({ property: new SimpleChange(null, component.property, true) } as SimpleChanges);
            fixture.detectChanges();

            const event = {
                option: {
                    value: 'option1'
                }
            } as MatAutocompleteSelectedEvent;

            component.onOptionSelected(event);
            tick(50);

            expect(component.property.value).toContain('option1');
            expect(component.filteredOptions.length).toBe(2);
            expect(component.filteredOptions[0].label).toBe('Option 2');
            expect(component.filteredOptions[1].label).toBe('Option 3');
        }));

        it('should update filteredOptions after chip removal', fakeAsync(() => {
            component.property.value = ['option1', 'option2'];
            component.filteredOptions = [multivaluedOptions[2]];
            component.editable = true;
            component.ngOnChanges({ property: new SimpleChange(null, component.property, true) } as SimpleChanges);
            fixture.detectChanges();

            component.removeChip('option1');
            tick(100);

            expect(component.property.value).not.toContain('option1');
            expect(component.filteredOptions.length).toBe(2);
            expect(component.filteredOptions[0].label).toBe('Option 1');
            expect(component.filteredOptions[1].label).toBe('Option 3');
        }));
    });

    describe('Validation', () => {
        let cardViewPropertyValidator: CardViewPropertyValidatorDirective;
        let control: FormControl<string | number>;

        beforeEach(() => {
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: true
            });
            component.editable = true;
            fixture.detectChanges();
            const selectElementInjector = getSelectElement().injector;
            cardViewPropertyValidator = selectElementInjector.get(CardViewPropertyValidatorDirective);
            control = selectElementInjector.get(NgModel).control;
        });

        it('should have assigned correct property', () => {
            expect(cardViewPropertyValidator.property).toBe(component.property);
        });

        it('should display correct error', () => {
            cardViewPropertyValidator.validated.emit(['Error 1', 'Error 2']);
            control.setErrors({
                error1: 'Error 1',
                error2: 'Error 2'
            });
            control.markAsTouched();

            fixture.detectChanges();
            expect(testingUtils.getByDirective(MatError).nativeElement.textContent).toBe('Error 1Error 2');
        });
    });
});
