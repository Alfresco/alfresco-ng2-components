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
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewDateItemComponent } from './card-view-dateitem.component';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { CardViewDatetimeItemModel } from '../../models/card-view-datetimeitem.model';
import { AppConfigService } from '../../../app-config/app-config.service';
import { DatetimeAdapter, MatDatetimepickerInputEvent } from '@mat-datetimepicker/core';
import { DateAdapter } from '@angular/material/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { addMinutes } from 'date-fns';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';
import { MatFormField } from '@angular/material/form-field';
import { AdfDateFnsAdapter } from '../../../common/utils/date-fns-adapter';
import { AdfDateTimeFnsAdapter } from '../../../common/utils/datetime-fns-adapter';

describe('CardViewDateItemComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<CardViewDateItemComponent>;
    let component: CardViewDateItemComponent;
    let appConfigService: AppConfigService;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CardViewDateItemComponent]
        });
        appConfigService = TestBed.inject(AppConfigService);
        appConfigService.config.dateValues = {
            defaultDateFormat: 'shortDate',
            defaultDateTimeFormat: 'M/d/yy, h:mm a',
            defaultLocale: 'uk'
        };

        fixture = TestBed.createComponent(CardViewDateItemComponent);
        component = fixture.componentInstance;
        component.property = new CardViewDateItemModel({
            label: 'Date label',
            value: new Date('07/10/2017'),
            key: 'dateKey',
            default: '',
            format: '',
            editable: false
        });

        loader = TestbedHarnessEnvironment.loader(fixture);
        testingUtils = new UnitTestingUtils(fixture.debugElement, loader);
    });

    afterEach(() => fixture.destroy());

    const getPropertyLabel = (): string => testingUtils.getInnerTextByCSS('.adf-property-label');
    const getPropertyValue = (): string => testingUtils.getInputByCSS('.adf-invisible-date-input').value;
    const getDefaultValue = (): string =>
        testingUtils.getInnerTextByDataAutomationId('card-' + component.property.type + '-value-' + component.property.key);
    const getDateTime = (): string => testingUtils.getInnerTextByDataAutomationId('datepicker-label-toggle-' + component.property.key);

    it('should render the label and value', () => {
        fixture.detectChanges();

        expect(getPropertyLabel()).toBe('Date label');
        expect(getPropertyValue().trim()).toBe('07/10/2017');
    });

    it('should NOT render the default as value if the value is empty, editable:false and displayEmpty is false', () => {
        component.property = new CardViewDateItemModel({
            label: 'Date label',
            value: '',
            key: 'dateKey',
            default: 'FAKE-DEFAULT-KEY',
            format: '',
            editable: false
        });
        component.editable = true;
        component.displayEmpty = false;
        fixture.detectChanges();

        expect(getPropertyValue().trim()).toBe('');
    });

    it('should render the default as value if the value is empty, editable:false and displayEmpty is true', () => {
        component.property = new CardViewDateItemModel({
            label: 'Date label',
            value: '',
            key: 'dateKey',
            default: 'FAKE-DEFAULT-KEY',
            format: '',
            editable: false
        });
        component.editable = true;
        component.displayEmpty = true;
        fixture.detectChanges();

        expect(getDefaultValue()).toBe('FAKE-DEFAULT-KEY');
    });

    it('should render the default as value if the value is empty and editable:true', () => {
        component.property = new CardViewDateItemModel({
            label: 'Date label',
            value: '',
            key: 'dateKey',
            default: 'FAKE-DEFAULT-KEY',
            format: '',
            editable: true
        });
        component.displayClearAction = false;
        component.editable = true;
        fixture.detectChanges();

        expect(getDateTime().trim()).toBe('FAKE-DEFAULT-KEY');
    });

    it('should render value when editable:true', () => {
        component.displayClearAction = false;
        component.editable = true;
        component.property.editable = true;
        fixture.detectChanges();

        expect(getDateTime().trim()).toBe('Jul 10, 2017');
    });

    it('should render the picker and toggle in case of editable:true', () => {
        component.editable = true;
        component.property.editable = true;
        fixture.detectChanges();

        const datePicker = testingUtils.getByDataAutomationId(`datepicker-${component.property.key}`);
        const datePickerToggle = testingUtils.getByDataAutomationId(`datepickertoggle-${component.property.key}`);
        expect(datePicker).not.toBeNull('Datepicker should be in DOM');
        expect(datePickerToggle).not.toBeNull('Datepicker toggle should be shown');
    });

    it('should NOT render the picker and toggle in case of editable:false', () => {
        component.property.editable = false;
        fixture.detectChanges();

        const datePicker = testingUtils.getByDataAutomationId(`datepicker-${component.property.key}`);
        const datePickerToggle = testingUtils.getByDataAutomationId(`datepickertoggle-${component.property.key}`);
        expect(datePicker.classes['cdk-visually-hidden']).toBeTrue();
        expect(datePickerToggle.classes['cdk-visually-hidden']).toBeTrue();
    });

    it('should NOT render the picker and toggle in case of editable:true but (general) editable:false', () => {
        component.editable = false;
        component.property.editable = true;
        fixture.detectChanges();

        expect(component.isEditable).toBe(false);
        const datePicker = testingUtils.getByDataAutomationId(`datepicker-${component.property.key}`);
        const datePickerToggle = testingUtils.getByDataAutomationId(`datepickertoggle-${component.property.key}`);
        expect(datePicker.classes['cdk-visually-hidden']).toBeTrue();
        expect(datePickerToggle.classes['cdk-visually-hidden']).toBeTrue();
    });

    it('should open the datepicker when clicking on the label', () => {
        component.editable = true;
        component.property.editable = true;
        fixture.detectChanges();
        spyOn(component.datepicker, 'open');

        testingUtils.getByDataAutomationId(`datepicker-label-toggle-${component.property.key}`).nativeElement.click();

        expect(component.datepicker.open).toHaveBeenCalled();
    });

    it('should trigger an update event on the CardViewUpdateService', () => {
        const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
        const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
        component.editable = true;
        component.property.editable = true;
        const expectedDate = new Date('Jul 10 2017');
        fixture.detectChanges();
        const property = { ...component.property };

        component.onDateChanged({ value: addMinutes(expectedDate, expectedDate.getTimezoneOffset()) } as MatDatetimepickerInputEvent<Date>);
        expect(itemUpdatedSpy).toHaveBeenCalledWith({
            target: property,
            changed: {
                dateKey: expectedDate
            }
        });
    });

    it('should update the property value after a successful update attempt', async () => {
        component.editable = true;
        component.property.editable = true;
        component.property.value = null;
        const expectedDate = new Date('Jul 10 2017');
        fixture.detectChanges();

        component.onDateChanged({ value: addMinutes(expectedDate, expectedDate.getTimezoneOffset()) } as MatDatetimepickerInputEvent<Date>);

        await fixture.whenStable();
        expect(component.property.value).toEqual(expectedDate);
    });

    it('should copy value to clipboard on double click', () => {
        const clipboardService = TestBed.inject(ClipboardService);
        spyOn(clipboardService, 'copyContentToClipboard');

        component.editable = false;
        fixture.detectChanges();

        testingUtils.doubleClickByDataAutomationId('datepicker-label-toggle-' + component.property.key);

        fixture.detectChanges();
        expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith('Jul 10, 2017', 'CORE.METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE');
    });

    describe('clear icon', () => {
        it('should render the clear icon in case of displayClearAction:true', () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = new Date('Jul 10 2017');
            fixture.detectChanges();

            const datePickerClearToggle = testingUtils.getByDataAutomationId(`datepicker-date-clear-${component.property.key}`);
            expect(datePickerClearToggle).not.toBeNull('Clean Icon should be in DOM');
        });

        it('should not render the clear icon in case of property value empty', () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = null;
            fixture.detectChanges();

            const datePickerClearToggle = testingUtils.getByDataAutomationId(`datepicker-date-clear-${component.property.key}`);
            expect(datePickerClearToggle).toBeNull('Clean Icon should not be in DOM');
        });

        it('should not render the clear icon in case of displayClearAction:false', () => {
            component.editable = true;
            component.property.editable = true;
            component.displayClearAction = false;
            component.property.value = new Date('Jul 10 2017');
            fixture.detectChanges();

            const datePickerClearToggle = testingUtils.getByDataAutomationId(`datepicker-date-clear-${component.property.key}`);
            expect(datePickerClearToggle).toBeNull('Clean Icon should not be in DOM');
        });

        it('should remove the property value after a successful clear attempt', async () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = new Date('Jul 10 2017');
            fixture.detectChanges();

            component.onDateClear();

            await fixture.whenStable();
            expect(component.property.value).toBeNull();
        });

        it('should remove the property default value after a successful clear attempt', async () => {
            component.editable = true;
            component.property.editable = true;
            component.property.default = 'Jul 10 2017';
            fixture.detectChanges();

            component.onDateClear();

            await fixture.whenStable();
            expect(component.property.default).toBeNull();
        });

        it('should remove actual and default value after a successful clear attempt', async () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
            component.editable = true;
            component.property.editable = true;
            component.property.default = 'Jul 10 2017';
            component.property.value = new Date('Jul 10 2017');
            fixture.detectChanges();
            const property = { ...component.property };

            component.onDateClear();

            expect(itemUpdatedSpy).toHaveBeenCalledWith({
                target: property,
                changed: {
                    dateKey: null
                }
            });

            await fixture.whenStable();

            expect(component.property.value).toBeNull();
            expect(component.property.default).toBeNull();
        });

        it('should not touch the form control when onDateClear is called and allowManualInput is false', () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = new Date('Jul 10 2017');
            fixture.detectChanges();

            const spy = spyOn(component.cardViewDateTimeControl, 'setValue');
            component.onDateClear();

            expect(spy).not.toHaveBeenCalled();
        });
    });

    it('should be possible update a date-time', async () => {
        component.editable = true;
        component.property.editable = true;
        component.property.default = 'Jul 10 2017 00:01:00';
        component.property.key = 'fake-key';
        component.property.value = new Date('Jul 10 2017 00:01:00');
        const expectedDate = new Date('Jul 10 2018 00:00:00');
        fixture.detectChanges();

        await fixture.whenStable();
        fixture.detectChanges();
        expect(testingUtils.getInnerTextByDataAutomationId('card-date-value-fake-key')).toEqual('Jul 10, 2017');
        component.onDateChanged({ value: expectedDate } as MatDatetimepickerInputEvent<Date>);

        fixture.detectChanges();
        expect(addMinutes(component.property.value, component.property.value.getTimezoneOffset())).toEqual(expectedDate);
    });

    it('should render chips for multivalue dates when chips are enabled', async () => {
        component.property = new CardViewDateItemModel({
            label: 'Text label',
            value: ['Jul 10 2017 00:01:00', 'Jul 11 2017 00:01:00', 'Jul 12 2017 00:01:00'],
            key: 'textkey',
            editable: true,
            multivalued: true
        });

        fixture.detectChanges();
        await fixture.whenStable();

        const chips = await testingUtils.getMatChips();
        expect(chips.length).toBe(3);
        expect(await chips[0].getText()).toBe('Jul 10, 2017');
        expect(await chips[1].getText()).toBe('Jul 11, 2017');
        expect(await chips[2].getText()).toBe('Jul 12, 2017');
    });

    it('should render chips for multivalue datetimes when chips are enabled', async () => {
        component.property = new CardViewDatetimeItemModel({
            label: 'Text label',
            value: ['Jul 10 2017 00:01:00', 'Jul 11 2017 00:01:00', 'Jul 12 2017 00:01:00'],
            key: 'textkey',
            editable: true,
            multivalued: true
        });

        fixture.detectChanges();
        await fixture.whenStable();

        const chips = await testingUtils.getMatChips();
        expect(chips.length).toBe(3);
        expect(await chips[0].getText()).toBe('Jul 10, 2017, 0:01');
        expect(await chips[1].getText()).toBe('Jul 11, 2017, 0:01');
        expect(await chips[2].getText()).toBe('Jul 12, 2017, 0:01');
    });

    describe('allowManualInput', () => {
        beforeEach(() => {
            fixture.componentRef.setInput(
                'property',
                new CardViewDateItemModel({
                    label: 'Date label',
                    value: new Date('07/10/2017'),
                    key: 'dateKey',
                    default: '',
                    format: 'yyyy-MM-dd',
                    editable: true,
                    allowManualInput: true
                })
            );
            fixture.componentRef.setInput('editable', true);
        });

        it('should render a visible typeable input when allowManualInput is true', () => {
            fixture.detectChanges();

            const manualInput = testingUtils.getByDataAutomationId('datepicker-manual-input-dateKey');
            expect(manualInput).not.toBeNull();
            const invisibleInput = fixture.nativeElement.querySelector('.adf-invisible-date-input');
            expect(invisibleInput).toBeNull();
        });

        it('should NOT render the span-button when allowManualInput is true', () => {
            fixture.detectChanges();

            const spanButton = testingUtils.getByDataAutomationId('datepicker-label-toggle-dateKey');
            expect(spanButton).toBeNull();
        });

        it('should render the invisible input and span-button when allowManualInput is false', () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date('07/10/2017'),
                key: 'dateKey',
                default: '',
                format: '',
                editable: true,
                allowManualInput: false
            });
            fixture.detectChanges();

            const invisibleInput = fixture.nativeElement.querySelector('.adf-invisible-date-input');
            expect(invisibleInput).not.toBeNull();
            const spanButton = testingUtils.getByDataAutomationId('datepicker-label-toggle-dateKey');
            expect(spanButton).not.toBeNull();
        });

        it('should still render the datepicker toggle and picker when allowManualInput is true', () => {
            fixture.detectChanges();

            const datePickerToggle = testingUtils.getByDataAutomationId(`datepickertoggle-${component.property.key}`);
            const datePicker = testingUtils.getByDataAutomationId(`datepicker-${component.property.key}`);
            expect(datePickerToggle).not.toBeNull();
            expect(datePicker).not.toBeNull();
        });

        it('should still render the clear icon when allowManualInput is true and value exists', () => {
            fixture.detectChanges();

            const clearIcon = testingUtils.getByDataAutomationId(`datepicker-date-clear-${component.property.key}`);
            expect(clearIcon).not.toBeNull();
        });

        it('should update the property when a date is changed via the picker', () => {
            const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
            const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
            fixture.detectChanges();

            const expectedDate = new Date('Jul 10 2018');
            component.onDateChanged({ value: addMinutes(expectedDate, expectedDate.getTimezoneOffset()) } as MatDatetimepickerInputEvent<Date>);

            expect(itemUpdatedSpy).toHaveBeenCalled();
        });

        it('should sync the form control value on init', () => {
            fixture.detectChanges();

            expect(component.cardViewDateTimeControl.value).not.toBeNull();
        });

        it('should clear the form control value when onDateClear is called', () => {
            fixture.detectChanges();

            component.onDateClear();
            expect(component.cardViewDateTimeControl.value).toBeNull();
        });

        it('should disable the form control when property.editable is false', () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date('07/10/2017'),
                key: 'dateKey',
                default: '',
                format: 'yyyy-MM-dd',
                editable: false,
                allowManualInput: true
            });
            component.editable = true;
            fixture.detectChanges();

            expect(component.cardViewDateTimeControl.disabled).toBeTrue();
        });

        it('should disable the form control when component editable is false', () => {
            component.editable = false;
            fixture.detectChanges();

            expect(component.cardViewDateTimeControl.disabled).toBeTrue();
        });

        it('should disable the form control when editable input changes to false after init', () => {
            fixture.detectChanges();
            expect(component.cardViewDateTimeControl.disabled).toBeFalse();

            fixture.componentRef.setInput('editable', false);
            fixture.detectChanges();

            expect(component.cardViewDateTimeControl.disabled).toBeTrue();
        });

        it('should re-enable the form control when editable input changes back to true after being disabled', () => {
            fixture.componentRef.setInput('editable', false);
            fixture.detectChanges();
            expect(component.cardViewDateTimeControl.disabled).toBeTrue();

            fixture.componentRef.setInput('editable', true);
            fixture.detectChanges();

            expect(component.cardViewDateTimeControl.disabled).toBeFalse();
        });

        it('should disable the form control when property changes to non-editable after init', () => {
            fixture.detectChanges();
            expect(component.cardViewDateTimeControl.disabled).toBeFalse();

            fixture.componentRef.setInput(
                'property',
                new CardViewDateItemModel({
                    label: 'Date label',
                    value: new Date('07/10/2017'),
                    key: 'dateKey',
                    default: '',
                    format: 'yyyy-MM-dd',
                    editable: false,
                    allowManualInput: true
                })
            );
            fixture.detectChanges();

            expect(component.cardViewDateTimeControl.disabled).toBeTrue();
        });

        it('should have null form control value when property has no value', () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: null,
                key: 'dateKey',
                default: '',
                format: 'yyyy-MM-dd',
                editable: true,
                allowManualInput: true
            });
            component.editable = true;
            fixture.detectChanges();

            expect(component.cardViewDateTimeControl.value).toBeNull();
        });

        it('should render placeholder with default value when property has default', () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: null,
                key: 'dateKey',
                default: 'Select a date',
                format: 'yyyy-MM-dd',
                editable: true,
                allowManualInput: true
            });
            component.editable = true;
            fixture.detectChanges();

            const manualInput = testingUtils.getByDataAutomationId('datepicker-manual-input-dateKey');
            expect(manualInput.nativeElement.placeholder).toContain('Select a date');
        });

        it('should render empty placeholder when property has no default', () => {
            fixture.detectChanges();

            const manualInput = testingUtils.getByDataAutomationId('datepicker-manual-input-dateKey');
            expect(manualInput.nativeElement.placeholder).toBe('');
        });

        it('should sync form control value with valueDate when date is changed via picker', () => {
            fixture.detectChanges();

            const expectedDate = new Date('Jul 10 2018');
            component.onDateChanged({ value: addMinutes(expectedDate, expectedDate.getTimezoneOffset()) } as MatDatetimepickerInputEvent<Date>);

            expect(component.cardViewDateTimeControl.value).not.toBeNull();
            expect(component.cardViewDateTimeControl.value instanceof Date).toBeTrue();
        });
    });

    describe('format changes', () => {
        it('should re-apply format when property.format changes with allowManualInput', () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date('07/10/2017'),
                key: 'dateKey',
                format: 'dd/MM/yyyy',
                editable: true,
                allowManualInput: true
            });
            component.editable = true;
            fixture.detectChanges();

            const datetimeAdapter = fixture.debugElement.injector.get(DatetimeAdapter) as AdfDateTimeFnsAdapter;
            expect(datetimeAdapter.displayFormat).toBe('dd/MM/yyyy');

            component.property.format = 'yyyy-MM-dd';
            fixture.detectChanges();

            expect(datetimeAdapter.displayFormat).toBe('yyyy-MM-dd');
        });

        it('should not re-apply format when property.format has not changed', () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date('07/10/2017'),
                key: 'dateKey',
                format: 'dd/MM/yyyy',
                editable: true,
                allowManualInput: true
            });
            component.editable = true;
            fixture.detectChanges();

            const datetimeAdapter = fixture.debugElement.injector.get(DatetimeAdapter) as AdfDateTimeFnsAdapter;
            const formatBefore = datetimeAdapter.displayFormat;
            fixture.detectChanges();

            expect(datetimeAdapter.displayFormat).toBe(formatBefore);
        });

        it('should reset adapters to defaults when custom format is removed in manual input mode', () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date('07/10/2017'),
                key: 'dateKey',
                format: 'dd/MM/yyyy',
                editable: true,
                allowManualInput: true
            });
            component.editable = true;
            fixture.detectChanges();

            const datetimeAdapter = fixture.debugElement.injector.get(DatetimeAdapter) as AdfDateTimeFnsAdapter;
            const dateAdapter = fixture.debugElement.injector.get(DateAdapter) as AdfDateFnsAdapter;
            expect(datetimeAdapter.displayFormat).toBe('dd/MM/yyyy');
            expect(dateAdapter.displayFormat).toBe('dd/MM/yyyy');

            component.property.format = '';
            fixture.detectChanges();

            expect(datetimeAdapter.displayFormat).toBeNull();
            expect(dateAdapter.displayFormat).toBe('MMM dd');
        });

        it('should reset datetime adapter when custom format is removed for datetime property in manual input mode', () => {
            component.property = new CardViewDatetimeItemModel({
                label: 'Datetime label',
                value: new Date('07/10/2017 10:15'),
                key: 'datetimeKey',
                format: 'yyyy-MM-dd HH:mm',
                editable: true,
                allowManualInput: true
            });
            component.editable = true;
            fixture.detectChanges();

            const datetimeAdapter = fixture.debugElement.injector.get(DatetimeAdapter) as AdfDateTimeFnsAdapter;
            expect(datetimeAdapter.displayFormat).toBe('yyyy-MM-dd HH:mm');

            component.property.format = '';
            fixture.detectChanges();

            expect(datetimeAdapter.displayFormat).toBeNull();
        });

        it('should fallback to adapter defaults for Angular alias format when allowManualInput is false', () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date('07/10/2017'),
                key: 'dateKey',
                format: 'short',
                editable: true,
                allowManualInput: false
            });
            component.editable = true;
            fixture.detectChanges();

            const dateAdapter = fixture.debugElement.injector.get(DateAdapter) as AdfDateFnsAdapter;
            const datetimeAdapter = fixture.debugElement.injector.get(DatetimeAdapter) as AdfDateTimeFnsAdapter;

            expect(dateAdapter.displayFormat).toBe('MMM dd');
            expect(datetimeAdapter.displayFormat).toBeNull();
        });

        it('should re-set form control value when format changes and control has value', () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date('07/10/2017'),
                key: 'dateKey',
                format: 'dd/MM/yyyy',
                editable: true,
                allowManualInput: true
            });
            component.editable = true;
            fixture.detectChanges();

            const spy = spyOn(component.cardViewDateTimeControl, 'setValue');
            component.property.format = 'yyyy-MM-dd';
            fixture.detectChanges();

            expect(spy).toHaveBeenCalled();
        });

        it('should not re-set form control value when format changes but allowManualInput is false', () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date('07/10/2017'),
                key: 'dateKey',
                format: 'dd/MM/yyyy',
                editable: true,
                allowManualInput: false
            });
            component.editable = true;
            fixture.detectChanges();

            const spy = spyOn(component.cardViewDateTimeControl, 'setValue');
            component.property.format = 'yyyy-MM-dd';
            fixture.detectChanges();

            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('CardViewDateItemModel allowManualInput', () => {
        it('should default allowManualInput to false when not specified', () => {
            const model = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date(),
                key: 'dateKey'
            });
            expect(model.allowManualInput).toBeFalse();
        });

        it('should set allowManualInput to true when specified', () => {
            const model = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date(),
                key: 'dateKey',
                allowManualInput: true
            });
            expect(model.allowManualInput).toBeTrue();
        });

        it('should keep allowManualInput false when explicitly set to false', () => {
            const model = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date(),
                key: 'dateKey',
                allowManualInput: false
            });
            expect(model.allowManualInput).toBeFalse();
        });

        it('should emit when format changes', () => {
            const model = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date(),
                key: 'dateKey',
                format: 'dd/MM/yyyy'
            });
            const formatChangeSpy = jasmine.createSpy('formatChangeSpy');
            model.formatChanges$.subscribe(formatChangeSpy);

            model.format = 'yyyy-MM-dd';

            expect(formatChangeSpy).toHaveBeenCalledOnceWith('yyyy-MM-dd');
        });

        it('should not emit when format is assigned the same value', () => {
            const model = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date(),
                key: 'dateKey',
                format: 'dd/MM/yyyy'
            });
            const formatChangeSpy = jasmine.createSpy('formatChangeSpy');
            model.formatChanges$.subscribe(formatChangeSpy);

            model.format = 'dd/MM/yyyy';

            expect(formatChangeSpy).not.toHaveBeenCalled();
        });
    });

    describe('FloatLabel behavior', () => {
        it('should set floatLabel to "always" when property has default value and is editable', async () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date('07/10/2017'),
                key: 'dateKey',
                default: 'Default Value',
                format: '',
                editable: true
            });
            component.editable = true;
            fixture.detectChanges();

            expect(testingUtils.getByDirective(MatFormField).componentInstance.floatLabel).toBe('always');
        });

        it('should set floatLabel to auto when property has no default value and is editable', async () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date('07/10/2017'),
                key: 'dateKey',
                default: '',
                format: '',
                editable: true
            });
            component.editable = true;
            fixture.detectChanges();

            expect(testingUtils.getByDirective(MatFormField).componentInstance.floatLabel).toBe('auto');
        });

        it('should set floatLabel to auto when property has null default value and is editable', async () => {
            component.property = new CardViewDateItemModel({
                label: 'Date label',
                value: new Date('07/10/2017'),
                key: 'dateKey',
                default: null,
                format: '',
                editable: true
            });
            component.editable = true;
            fixture.detectChanges();
            expect(testingUtils.getByDirective(MatFormField).componentInstance.floatLabel).toBe('auto');
        });
    });
});
