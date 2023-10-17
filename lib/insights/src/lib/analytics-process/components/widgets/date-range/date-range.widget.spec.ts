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
import { DateRangeWidgetComponent } from './date-range.widget';
import { TranslateModule } from '@ngx-translate/core';
import { InsightsTestingModule } from '../../../../testing/insights.testing.module';
import { ReportParameterDetailsModel } from '../../../../diagram/models/report/report-parameter-details.model';
import { format } from 'date-fns';

describe('DateRangeWidgetComponent', () => {
    let fixture: ComponentFixture<DateRangeWidgetComponent>;
    let widget: DateRangeWidgetComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                InsightsTestingModule
            ]
        });

        fixture = TestBed.createComponent(DateRangeWidgetComponent);
        widget = fixture.componentInstance;
    });

    it('should init the start date and end date from the field model', async () => {
        const field = new ReportParameterDetailsModel({
            value: {
                startDate: '2023-03-13',
                endDate: '2023-04-14'
            }
        });

        widget.field = field;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(format(widget.startDateValue, 'yyyy-MM-dd')).toEqual('2023-03-13');
        expect(format(widget.endDateValue, 'yyyy-MM-dd')).toEqual('2023-04-14');
    });

    it('should emit dateRangeChanged with empty time/zone', async () => {
        const field = new ReportParameterDetailsModel({
            value: {
                startDate: '2023-03-13',
                endDate: '2023-04-14'
            }
        });

        widget.field = field;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(widget.dateRange.valid).toBeTrue();

        let emitted: { startDate: string; endDate: string };
        widget.dateRangeChanged.subscribe((value) => emitted = value);

        widget.onGroupValueChanged();

        expect(emitted.startDate).toBe('2023-03-13T00:00:00.000Z');
        expect(emitted.endDate).toBe('2023-04-14T00:00:00.000Z');
    });

    it('should validate date range', async () => {
        const field = new ReportParameterDetailsModel({
            value: {
                startDate: '2023-03-13',
                endDate: '2023-01-14'
            }
        });

        widget.field = field;

        fixture.detectChanges();
        await fixture.whenStable();

        expect(widget.dateRange.valid).toBeFalse();
    });
});
