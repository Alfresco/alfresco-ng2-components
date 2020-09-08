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

import { DateRangeFilterComponent } from './date-range-filter.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from 'core';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { By } from '@angular/platform-browser';
import { MatSelectChange } from '@angular/material/select';
import moment from 'moment-es6';
import { DateCloudFilterType } from '../../models/date-cloud-filter.model';
import { DateRangeFilterService } from './date-range-filter.service';

describe('DateRangeFilterComponent', () => {
    let component: DateRangeFilterComponent;
    let fixture: ComponentFixture<DateRangeFilterComponent>;
    let service: DateRangeFilterService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DateRangeFilterComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(DateRangeFilterService);

        component.processFilterProperty = {
            key: 'createdDate',
            label: 'mock-filter',
            value: null,
            type: 'dateRange',
            options: null
        };
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should get on option change', async () => {
        spyOn(service, 'getDateRange');
        const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-createdDate"] .mat-select-trigger');
        stateElement.click();
        fixture.detectChanges();

        const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        options[2].nativeElement.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(service.getDateRange).toHaveBeenCalled();
    });

    it('should emit today range', () => {
        spyOn(component.dateChanged, 'emit');
        const value = <MatSelectChange> { value: DateCloudFilterType.TODAY };
        component.onSelectionChange(value);
        const expectedDate = {
            startDate: moment().startOf('day').toDate(),
            endDate: moment().endOf('day').toDate()
        };
        expect(component.dateChanged.emit).toHaveBeenCalledWith(expectedDate);
    });

    it('should emit month range', () => {
        spyOn(component.dateChanged, 'emit');
        const value = <MatSelectChange> { value: DateCloudFilterType.MONTH };
        component.onSelectionChange(value);
        const expectedDate = {
            startDate: moment().startOf('month').toDate(),
            endDate: moment().endOf('month').toDate()
        };
        expect(component.dateChanged.emit).toHaveBeenCalledWith(expectedDate);
    });

    it('should emit year range', () => {
        spyOn(component.dateChanged, 'emit');
        const value = <MatSelectChange> { value: DateCloudFilterType.YEAR };
        component.onSelectionChange(value);
        const expectedDate = {
            startDate: moment().startOf('year').toDate(),
            endDate: moment().endOf('year').toDate()
        };
        expect(component.dateChanged.emit).toHaveBeenCalledWith(expectedDate);
    });

    it('should emit quarter range', () => {
        spyOn(component.dateChanged, 'emit');
        const value = <MatSelectChange> { value: DateCloudFilterType.QUARTER };
        component.onSelectionChange(value);
        const currentDate = new Date();
        const quarter = Math.floor((currentDate.getMonth() / 3));
        const firstDate = new Date(currentDate.getFullYear(), quarter * 3, 1);
        const expectedDate = {
            startDate: firstDate,
            endDate: new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0)
        };
        expect(component.dateChanged.emit).toHaveBeenCalledWith(expectedDate);
    });

    it('should reset date range when no_date type is selected', () => {
        spyOn(component.dateChanged, 'emit');
        const value = <MatSelectChange> { value: DateCloudFilterType.NO_DATE };
        component.onSelectionChange(value);
        const expectedDate = {
            startDate: null,
            endDate: null
        };
        expect(component.dateChanged.emit).toHaveBeenCalledWith(expectedDate);
    });

    it('should reset date range when range type is selected', () => {
        spyOn(component.dateChanged, 'emit');
        const value = <MatSelectChange> { value: DateCloudFilterType.RANGE };
        component.onSelectionChange(value);
        const expectedDate = {
            startDate: null,
            endDate: null
        };
        expect(component.dateChanged.emit).toHaveBeenCalledWith(expectedDate);
    });

    it('should throw error no supported type is selected', () => {
        expect(function () { service.getDateRange(null); } ).toThrow(new Error('ADF_CLOUD_EDIT_PROCESS_FILTER.ERROR.INVALID_DATE_FILTER'));
    });

    it('should show date-range picker when type is range', async () => {
        const value = <MatSelectChange> { value: DateCloudFilterType.RANGE };
        component.onSelectionChange(value);
        fixture.detectChanges();
        await fixture.whenStable();
        const rangePickerElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-date-range-picker');
        expect(rangePickerElement).not.toBeNull();
    });
});
