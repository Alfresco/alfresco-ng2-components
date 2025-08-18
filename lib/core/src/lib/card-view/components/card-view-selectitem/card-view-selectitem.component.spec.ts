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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardViewSelectItemModel } from '../../models/card-view-selectitem.model';
import { CardViewSelectItemComponent } from './card-view-selectitem.component';
import { of } from 'rxjs';
import { AppConfigService } from '../../../app-config/app-config.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { DebugElement, SimpleChange } from '@angular/core';

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
        const getReadOnlyElement = (): DebugElement => testingUtils.getByDataAutomationClass('read-only-value');

        it('should render custom label when editable is set to false', () => {
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: false
            });
            fixture.detectChanges();

            expect(testingUtils.getInnerTextByDataAutomationId('card-select-label-key')).toBe('Select box label');
        });

        it('should render readOnly value is editable property is FALSE', () => {
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: false
            });

            component.ngOnChanges({});
            fixture.detectChanges();
            const selectBox = testingUtils.getByDataAutomationClass('select-box');

            expect(getReadOnlyElement()).not.toBeNull();
            expect(selectBox).toBeNull();
        });

        it('should read only value have title', () => {
            component.property = new CardViewSelectItemModel({
                ...mockDefaultProps,
                editable: false
            });

            fixture.detectChanges();

            const inputEl = getReadOnlyElement().nativeElement as HTMLInputElement;
            expect(inputEl.value).toBe('Two');
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

            expect(component.value).toEqual('two');
            expect(component.isEditable).toBe(true);

            const options = await testingUtils.getMatSelectOptions();
            expect(options.length).toEqual(4);
            await options[1].click();

            expect(component.value).toEqual('one');
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

            expect(component.value).toEqual(2);
            expect(component.isEditable).toBe(true);

            const options = await testingUtils.getMatSelectOptions();

            expect(options.length).toEqual(4);
            await options[1].click();

            expect(component.value).toEqual(1);
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
            const not_editable_label = fixture.nativeElement.querySelector('.adf-property-label-not-editable');
            const field = await testingUtils.getMatFormFieldByCSS('.adf-property-value');

            expect(await field.hasLabel()).toBeTrue();
            expect(not_editable_label).toBeNull();
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
            component.ngOnChanges({});
            fixture.detectChanges();

            expect(component.autocompleteControl.value).toBe('initial value');
        });

        it('should emit autocompleteInputValue$ with new value on autocompleteControl change', async () => {
            const autocompleteValueSpy = spyOn(cardViewUpdateService.autocompleteInputValue$, 'next');
            component.editedValue = '';
            component.editable = true;
            component.ngOnChanges({
                property: new SimpleChange(undefined, component.property, true)
            });
            fixture.detectChanges();

            component.autocompleteControl.setValue('new value');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(autocompleteValueSpy).toHaveBeenCalledWith('new value');
        });

        it('should update value correctly on option selected', () => {
            cardViewUpdateService.update = jasmine.createSpy('update');
            const event: MatAutocompleteSelectedEvent = {
                option: {
                    value: '1'
                }
            } as MatAutocompleteSelectedEvent;

            component.ngOnChanges({});
            fixture.detectChanges();

            component.onOptionSelected(event);
            fixture.detectChanges();

            expect(component.autocompleteControl.value).toBe('Option 1');
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
            component.ngOnChanges({});
            fixture.detectChanges();

            const options = await testingUtils.typeAndGetOptionsForMatAutoComplete(fixture, 'Op');
            expect(options.length).toBe(2);
            expect(await options[0].getText()).toContain('Option 1');
            expect(await options[1].getText()).toContain('Option 2');
        });
    });
});
