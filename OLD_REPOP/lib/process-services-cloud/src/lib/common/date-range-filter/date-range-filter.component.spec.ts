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

import { DateRangeFilterComponent } from './date-range-filter.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectChange } from '@angular/material/select';
import { DateCloudFilterType } from '../../models/date-cloud-filter.model';
import { DateRangeFilterService } from './date-range-filter.service';
import { mockFilterProperty } from '../mock/date-range-filter.mock';
import { add, endOfDay } from 'date-fns';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatDateRangeInputHarness } from '@angular/material/datepicker/testing';
import { NoopTranslateModule } from '@alfresco/adf-core';

describe('DateRangeFilterComponent', () => {
    let component: DateRangeFilterComponent;
    let fixture: ComponentFixture<DateRangeFilterComponent>;
    let service: DateRangeFilterService;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, DateRangeFilterComponent]
        });
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
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should get on option change', async () => {
        spyOn(service, 'getDateRange');
        spyOn(component.dateTypeChange, 'emit');

        const stateElement = await loader.getHarness(
            MatSelectHarness.with({ selector: '[data-automation-id="adf-cloud-edit-process-property-createdDate"]' })
        );

        await stateElement.clickOptions({ selector: '[data-automation-id="adf-cloud-edit-process-property-options-WEEK"]' });

        expect(service.getDateRange).not.toHaveBeenCalled();
        expect(component.dateTypeChange.emit).toHaveBeenCalled();
    });

    it('should not emit event on `RANGE` option change', async () => {
        spyOn(component.dateTypeChange, 'emit');
        const stateElement = await loader.getHarness(
            MatSelectHarness.with({ selector: '[data-automation-id="adf-cloud-edit-process-property-createdDate"]' })
        );

        await stateElement.clickOptions({ selector: '[data-automation-id="adf-cloud-edit-process-property-options-RANGE"]' });

        expect(component.dateTypeChange.emit).not.toHaveBeenCalled();
    });

    it('should reset date range when no_date type is selected', () => {
        const expectedDate = {
            startDate: null,
            endDate: null
        };
        expect(service.getDateRange(DateCloudFilterType.NO_DATE)).toEqual(expectedDate);
    });

    it('should return correct date when any type is selected', () => {
        const expectedDate = {
            startDate: endOfDay(new Date()).toISOString(),
            endDate: add(endOfDay(new Date()), { days: 1 }).toISOString()
        };
        expect(service.getDateRange(DateCloudFilterType.TOMORROW)).toEqual(expectedDate);
    });

    it('should not emit any date change events when any type is selected', () => {
        spyOn(component.dateChanged, 'emit');
        const value = { value: DateCloudFilterType.RANGE } as MatSelectChange;
        component.onSelectionChange(value);
        expect(component.dateChanged.emit).not.toHaveBeenCalled();
    });

    it('should emit custom date range on date picker closed', () => {
        spyOn(component.dateChanged, 'emit');
        component.onDateRangeClosed();
        expect(component.dateChanged.emit).toHaveBeenCalled();
    });

    it('should show date-range picker when type is range', async () => {
        const value = { value: DateCloudFilterType.RANGE } as MatSelectChange;
        component.onSelectionChange(value);
        fixture.detectChanges();
        await fixture.whenStable();
        const rangePickerElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-date-range-picker');
        expect(rangePickerElement).not.toBeNull();
    });

    it('should preselect values if filterProperty has attribute', () => {
        component.processFilterProperty = mockFilterProperty;
        component.ngOnInit();
        fixture.detectChanges();

        // eslint-disable-next-line no-underscore-dangle
        expect(component.dateRangeForm.get('from').value).toEqual(mockFilterProperty.value._startFrom);
        // eslint-disable-next-line no-underscore-dangle
        expect(component.dateRangeForm.get('to').value).toEqual(mockFilterProperty.value._startTo);
    });

    it('should have floating labels when values are present', async () => {
        const stateElement = await loader.getHarness(
            MatSelectHarness.with({ selector: '[data-automation-id="adf-cloud-edit-process-property-createdDate"]' })
        );

        await stateElement.open();
        const selectField = await loader.getHarness(MatFormFieldHarness.with({ selector: '[data-automation-id="createdDate"]' }));

        expect(await selectField.isLabelFloating()).toBeTrue();
        await stateElement.close();

        component.type = DateCloudFilterType.RANGE;
        fixture.detectChanges();
        const dateRangeElement = await loader.getHarness(MatDateRangeInputHarness);
        await dateRangeElement.openCalendar();
        const dateRangeField = await loader.getHarness(MatFormFieldHarness.with({ selector: '.adf-cloud-date-range-picker' }));

        expect(await dateRangeField.isLabelFloating()).toBeTrue();
        await dateRangeElement.closeCalendar();
    });
});
