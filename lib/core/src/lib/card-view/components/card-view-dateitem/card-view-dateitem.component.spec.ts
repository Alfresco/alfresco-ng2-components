/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { By } from '@angular/platform-browser';
import { setupTestBed } from '../../../testing/setup-test-bed';
import moment from 'moment';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewDateItemComponent } from './card-view-dateitem.component';
import { CoreTestingModule } from '../../../testing/core.testing.module';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { CardViewDatetimeItemModel } from '../../models/card-view-datetimeitem.model';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from '@alfresco/adf-core';

describe('CardViewDateItemComponent', () => {

    let fixture: ComponentFixture<CardViewDateItemComponent>;
    let component: CardViewDateItemComponent;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
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
    });

    afterEach(() => fixture.destroy());

    it('should pick date format from appConfigService', () => {
        expect(component.dateFormat).toEqual('shortDate');
    });

    it('should render the label and value', () => {
        fixture.detectChanges();

        const labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
        expect(labelValue).not.toBeNull();
        expect(labelValue.nativeElement.innerText).toBe('Date label');

        const value = fixture.debugElement.query(By.css('.adf-property-value'));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('Jul 10, 2017');
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

        const value = fixture.debugElement.query(By.css('.adf-property-value'));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('');
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

        const value = fixture.debugElement.query(By.css('.adf-property-value'));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
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

        const value = fixture.debugElement.query(By.css('.adf-property-value'));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('FAKE-DEFAULT-KEY');
    });

    it('should render value when editable:true', () => {
        component.displayClearAction = false;
        component.editable = true;
        component.property.editable = true;
        fixture.detectChanges();

        const value = fixture.debugElement.query(By.css('.adf-property-value'));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('Jul 10, 2017');
    });

    it('should render the picker and toggle in case of editable:true', () => {
        component.editable = true;
        component.property.editable = true;
        fixture.detectChanges();

        const datePicker = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-${component.property.key}"]`));
        const datePickerToggle = fixture.debugElement.query(By.css(`[data-automation-id="datepickertoggle-${component.property.key}"]`));
        expect(datePicker).not.toBeNull('Datepicker should be in DOM');
        expect(datePickerToggle).not.toBeNull('Datepicker toggle should be shown');
    });

    it('should NOT render the picker and toggle in case of editable:false', () => {
        component.property.editable = false;
        fixture.detectChanges();

        const datePicker = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-${component.property.key}"]`));
        const datePickerToggle = fixture.debugElement.query(By.css(`[data-automation-id="datepickertoggle-${component.property.key}"]`));
        expect(datePicker).toBeNull('Datepicker should NOT be in DOM');
        expect(datePickerToggle).toBeNull('Datepicker toggle should NOT be shown');
    });

    it('should NOT render the picker and toggle in case of editable:true but (general) editable:false', () => {
        component.editable = false;
        component.property.editable = true;
        fixture.detectChanges();

        expect(component.isEditable()).toBe(false);
        const datePicker = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-${component.property.key}"]`));
        const datePickerToggle = fixture.debugElement.query(By.css(`[data-automation-id="datepickertoggle-${component.property.key}"]`));
        expect(datePicker).toBeNull('Datepicker should NOT be in DOM');
        expect(datePickerToggle).toBeNull('Datepicker toggle should NOT be shown');
    });

    it('should open the datepicker when clicking on the label', () => {
        component.editable = true;
        component.property.editable = true;
        fixture.detectChanges();
        spyOn(component.datepicker, 'open');

        const datePickerLabelToggle = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-label-toggle-${component.property.key}"]`));
        datePickerLabelToggle.triggerEventHandler('click', {});

        expect(component.datepicker.open).toHaveBeenCalled();
    });

    it('should trigger an update event on the CardViewUpdateService', () => {
        const cardViewUpdateService = TestBed.inject(CardViewUpdateService);
        const itemUpdatedSpy = spyOn(cardViewUpdateService.itemUpdated$, 'next');
        component.editable = true;
        component.property.editable = true;
        const expectedDate = moment('Jul 10 2017', 'MMM DD YYYY');
        fixture.detectChanges();
        const property = { ...component.property };

        component.onDateChanged({ value: expectedDate });
        expect(itemUpdatedSpy).toHaveBeenCalledWith({
            target: property,
            changed: {
                dateKey: expectedDate.toDate()
            }
        });
    });

    it('should update the property value after a successful update attempt', async () => {
        component.editable = true;
        component.property.editable = true;
        component.property.value = null;
        const expectedDate = moment('Jul 10 2017', 'MMM DD YY');
        fixture.detectChanges();

        component.onDateChanged({ value: expectedDate });

        await fixture.whenStable();
        expect(component.property.value).toEqual(expectedDate.toDate());
    });

    it('should copy value to clipboard on double click', () => {
        const clipboardService = TestBed.inject(ClipboardService);
        spyOn(clipboardService, 'copyContentToClipboard');

        component.editable = false;
        fixture.detectChanges();

        const doubleClickEl = fixture.debugElement.query(By.css(`[data-automation-id="card-dateitem-${component.property.key}"]`));
        doubleClickEl.triggerEventHandler('dblclick', new MouseEvent('dblclick'));

        fixture.detectChanges();
        expect(clipboardService.copyContentToClipboard).toHaveBeenCalledWith('Jul 10, 2017', 'CORE.METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE');
    });

    describe('clear icon', () => {
        it('should render the clear icon in case of displayClearAction:true', () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = 'Jul 10 2017';
            fixture.detectChanges();

            const datePickerClearToggle = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-date-clear-${component.property.key}"]`));
            expect(datePickerClearToggle).not.toBeNull('Clean Icon should be in DOM');
        });

        it('should not render the clear icon in case of property value empty', () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = null;
            fixture.detectChanges();

            const datePickerClearToggle = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-date-clear--${component.property.key}"]`));
            expect(datePickerClearToggle).toBeNull('Clean Icon should not be in DOM');
        });

        it('should not render the clear icon in case of displayClearAction:false', () => {
            component.editable = true;
            component.property.editable = true;
            component.displayClearAction = false;
            component.property.value = 'Jul 10 2017';
            fixture.detectChanges();

            const datePickerClearToggle = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-date-clear--${component.property.key}"]`));
            expect(datePickerClearToggle).toBeNull('Clean Icon should not be in DOM');
        });

        it('should remove the property value after a successful clear attempt', async () => {
            component.editable = true;
            component.property.editable = true;
            component.property.value = 'Jul 10 2017';
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
            component.property.value = 'Jul 10 2017';
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
    });

    it('should be possible update a date-time', async () => {
        component.editable = true;
        component.property.editable = true;
        component.property.default = 'Jul 10 2017 00:01:00';
        component.property.key = 'fake-key';
        component.dateFormat = 'M/d/yy, h:mm a';
        component.property.value = 'Jul 10 2017 00:01:00';
        const expectedDate = moment('Jul 10 2018', 'MMM DD YY h:m:s');
        fixture.detectChanges();

        await fixture.whenStable();
        fixture.detectChanges();
        const element = fixture.debugElement.nativeElement.querySelector('span[data-automation-id="card-date-value-fake-key"]');
        expect(element).toBeDefined();
        expect(element.innerText).toEqual('Jul 10, 2017');
        component.onDateChanged({ value: expectedDate });

        fixture.detectChanges();
        expect(component.property.value).toEqual(expectedDate.toDate());
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
        const valueChips = fixture.debugElement.queryAll(By.css(`mat-chip`));
        expect(valueChips).not.toBeNull();
        expect(valueChips.length).toBe(3);
        expect(valueChips[0].nativeElement.innerText.trim()).toBe('Jul 10, 2017');
        expect(valueChips[1].nativeElement.innerText.trim()).toBe('Jul 11, 2017');
        expect(valueChips[2].nativeElement.innerText.trim()).toBe('Jul 12, 2017');
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
        const valueChips = fixture.debugElement.queryAll(By.css(`mat-chip`));
        expect(valueChips).not.toBeNull();
        expect(valueChips.length).toBe(3);
        expect(valueChips[0].nativeElement.innerText.trim()).toBe('Jul 10, 2017, 0:01');
        expect(valueChips[1].nativeElement.innerText.trim()).toBe('Jul 11, 2017, 0:01');
        expect(valueChips[2].nativeElement.innerText.trim()).toBe('Jul 12, 2017, 0:01');
    });
});
