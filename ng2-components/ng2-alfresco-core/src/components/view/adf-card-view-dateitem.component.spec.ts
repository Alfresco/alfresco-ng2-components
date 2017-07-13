/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { MdDatepickerModule, MdInputModule, MdNativeDateModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewUpdateService } from '../../services/adf-card-view-update.service';
import { CardViewDateItemComponent } from './adf-card-view-dateitem.component';

describe('CardViewDateItemComponent', () => {

    let fixture: ComponentFixture<CardViewDateItemComponent>;
    let component: CardViewDateItemComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MdDatepickerModule,
                MdInputModule,
                MdNativeDateModule
            ],
            declarations: [
                CardViewDateItemComponent
            ],
            providers: [
                CardViewUpdateService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewDateItemComponent);
        component = fixture.componentInstance;
        component.property = <CardViewDateItemModel>{
            type: 'date',
            label: 'Date label',
            value: new Date('07/10/2017'),
            key: 'datekey',
            default: '',
            format: '',
            editable: false,
            get displayValue(): string {
                return 'Jul 10 2017';
            }
        };
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should render the label and value', () => {
        fixture.detectChanges();

        let labelValue = fixture.debugElement.query(By.css('.adf-property-label'));
        expect(labelValue).not.toBeNull();
        expect(labelValue.nativeElement.innerText).toBe('Date label');

        let value = fixture.debugElement.query(By.css('.adf-property-value'));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('Jul 10 2017');
    });

    it('should render value when editable:true', () => {
        component.editable = true;
        component.property.editable = true;
        fixture.detectChanges();

        let value = fixture.debugElement.query(By.css('.adf-property-value'));
        expect(value).not.toBeNull();
        expect(value.nativeElement.innerText.trim()).toBe('Jul 10 2017');
    });

    it('should render the picker and toggle in case of editable:true', () => {
        component.editable = true;
        component.property.editable = true;
        fixture.detectChanges();

        let datePicker = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-${component.property.key}"]`));
        let datePickerToggle = fixture.debugElement.query(By.css(`[data-automation-id="datepickertoggle-${component.property.key}"]`));
        expect(datePicker).not.toBeNull('Datepicker should be in DOM');
        expect(datePickerToggle).not.toBeNull('Datepicker toggle should be shown');
    });

    it('should NOT render the picker and toggle in case of editable:false', () => {
        component.property.editable = false;
        fixture.detectChanges();

        let datePicker = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-${component.property.key}"]`));
        let datePickerToggle = fixture.debugElement.query(By.css(`[data-automation-id="datepickertoggle-${component.property.key}"]`));
        expect(datePicker).toBeNull('Datepicker should NOT be in DOM');
        expect(datePickerToggle).toBeNull('Datepicker toggle should NOT be shown');
    });

    it('should NOT render the picker and toggle in case of editable:true but (general) editable:false', () => {
        component.editable = false;
        component.property.editable = true;
        fixture.detectChanges();

        let datePicker = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-${component.property.key}"]`));
        let datePickerToggle = fixture.debugElement.query(By.css(`[data-automation-id="datepickertoggle-${component.property.key}"]`));
        expect(datePicker).toBeNull('Datepicker should NOT be in DOM');
        expect(datePickerToggle).toBeNull('Datepicker toggle should NOT be shown');
    });

    it('should open the datetimepicker when clicking on the label', () => {
        component.editable = true;
        component.property.editable = true;
        fixture.detectChanges();
        spyOn(component.datepicker, 'open');

        let datePickerLabelToggle = fixture.debugElement.query(By.css(`[data-automation-id="datepicker-label-toggle-${component.property.key}"]`));
        datePickerLabelToggle.triggerEventHandler('click', {});

        expect(component.datepicker.open).toHaveBeenCalled();
    });

    it('should trigger an update event on the CardViewUpdateService', (done) => {
        component.editable = true;
        component.property.editable = true;
        const cardViewUpdateService = TestBed.get(CardViewUpdateService);
        const expectedDate = new Date('11/11/2017');
        fixture.detectChanges();

        cardViewUpdateService.itemUpdated$.subscribe(
            (updateNotification) => {
                expect(updateNotification.target).toBe(component.property);
                expect(updateNotification.changed).toEqual({ value: expectedDate });
                done();
            }
        );

        component.datepicker.selectedChanged.next(expectedDate);
    });
});
