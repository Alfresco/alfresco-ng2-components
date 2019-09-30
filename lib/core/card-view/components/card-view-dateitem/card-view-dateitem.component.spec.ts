/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { setupTestBed } from '../../../testing/setupTestBed';
import moment from 'moment-es6';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewDateItemComponent } from './card-view-dateitem.component';
import { CoreTestingModule } from '../../../testing/core.testing.module';

describe('CardViewDateItemComponent', () => {

    let fixture: ComponentFixture<CardViewDateItemComponent>;
    let component: CardViewDateItemComponent;

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
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

    afterEach(() => {
        fixture.destroy();
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

    it('should trigger an update event on the CardViewUpdateService', (done) => {
        component.editable = true;
        component.property.editable = true;
        const cardViewUpdateService = TestBed.get(CardViewUpdateService);
        const expectedDate = moment('Jul 10 2017', 'MMM DD YY');
        fixture.detectChanges();

        const disposableUpdate = cardViewUpdateService.itemUpdated$.subscribe(
            (updateNotification) => {
                expect(updateNotification.target).toBe(component.property);
                expect(updateNotification.changed).toEqual({ dateKey: expectedDate.toDate() });
                disposableUpdate.unsubscribe();
                done();
            }
        );

        component.onDateChanged({ value: expectedDate });
    });

    it('should update the property value after a successful update attempt', async(() => {
        component.editable = true;
        component.property.editable = true;
        component.property.value = null;
        const expectedDate = moment('Jul 10 2017', 'MMM DD YY');
        fixture.detectChanges();

        component.onDateChanged({ value: expectedDate });

        fixture.whenStable().then(
            () => {
                expect(component.property.value).toEqual(expectedDate.toDate());
            }
        );
    }));

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

    it('should remove the property value after a successful clear attempt', async(() => {
        component.editable = true;
        component.property.editable = true;
        component.property.value = 'Jul 10 2017';
        fixture.detectChanges();

        component.onDateClear();

        fixture.whenStable().then(
            () => {
                expect(component.property.value).toBeNull();
            }
        );
    }));

    it('should remove the property default value after a successful clear attempt', async(() => {
        component.editable = true;
        component.property.editable = true;
        component.property.default = 'Jul 10 2017';
        fixture.detectChanges();

        component.onDateClear();

        fixture.whenStable().then(
            () => {
                expect(component.property.default).toBeNull();
            }
        );
    }));

    it('should remove actual and default value after a successful clear attempt', async(() => {
        component.editable = true;
        component.property.editable = true;
        component.property.default = 'Jul 10 2017';
        component.property.value = 'Jul 10 2017';
        fixture.detectChanges();

        component.onDateClear();

        fixture.whenStable().then(
            () => {
                expect(component.property.value).toBeNull();
                expect(component.property.default).toBeNull();
            }
        );
    }));
});
