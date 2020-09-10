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
import { DateCloudFilterType } from '../../models/date-cloud-filter.model';
import { DateRangeFilterService } from './date-range-filter.service';
import moment from 'moment-es6';

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

    it('should emit date range when any type is selected', () => {
        spyOn(component.dateChanged, 'emit');
        const value = <MatSelectChange> { value: DateCloudFilterType.TOMORROW };
        component.onSelectionChange(value);
        const expectedDate = {
            startDate: moment().endOf('day').toDate(),
            endDate: moment().add(1, 'days').startOf('day').toDate()
        };
        expect(component.dateChanged.emit).toHaveBeenCalledWith(expectedDate);
    });

    it('should not emit any date change events when range type is selected', () => {
        spyOn(component.dateChanged, 'emit');
        const value = <MatSelectChange> { value: DateCloudFilterType.RANGE };
        component.onSelectionChange(value);
        expect(component.dateChanged.emit).not.toHaveBeenCalled();
    });

    it('should emit custom date range on date picker closed', () => {
        spyOn(component.dateChanged, 'emit');
        component.onDateRangeClosed();
        expect(component.dateChanged.emit).toHaveBeenCalled();
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
