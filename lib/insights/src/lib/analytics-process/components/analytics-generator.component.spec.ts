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

import { Chart } from '../../diagram/models/chart/chart.model';
import { ReportQuery } from '../../diagram/models/report/report-query.model';
import * as analyticMock from '../../mock';
import { AnalyticsGeneratorComponent } from '../components/analytics-generator.component';
import { setupTestBed } from '@alfresco/adf-core';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('AnalyticsGeneratorComponent', () => {

    let component: any;
    let fixture: ComponentFixture<AnalyticsGeneratorComponent>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            InsightsTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalyticsGeneratorComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should render the Process definition overview report ', (done) => {
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(res.length).toEqual(3);

            expect(res[0]).toBeDefined();
            expect(res[0].type).toEqual('table');
            expect(res[0].datasets).toBeDefined();
            expect(res[0].datasets.length).toEqual(4);
            expect(res[0].datasets[0][0]).toEqual('__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-TOTAL-PROCESS-DEFINITIONS');
            expect(res[0].datasets[0][1]).toEqual('9');
            expect(res[0].datasets[1][0]).toEqual('__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-TOTAL-PROCESS-INSTANCES');
            expect(res[0].datasets[1][1]).toEqual('41');
            expect(res[0].datasets[2][0]).toEqual('__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-ACTIVE-PROCESS-INSTANCES');
            expect(res[0].datasets[2][1]).toEqual('3');
            expect(res[0].datasets[3][0]).toEqual('__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-COMPLETED-PROCESS-INSTANCES');
            expect(res[0].datasets[3][1]).toEqual('38');

            expect(res[1]).toBeDefined();
            expect(res[1].type).toEqual('pie');

            expect(res[2]).toBeDefined();
            expect(res[2].type).toEqual('table');

            done();
        });

        component.reportId = 1001;
        component.reportParamQuery = new ReportQuery({status: 'All'});
        component.ngOnChanges();

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.chartProcessDefOverview
            });
        });
    });

    it('Should render the Process definition overview report when [onChanges] is called ', (done) => {
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(res.length).toEqual(3);

            expect(res[0]).toBeDefined();
            expect(res[0].type).toEqual('table');
            expect(res[0].datasets).toBeDefined();
            expect(res[0].datasets.length).toEqual(4);
            expect(res[0].datasets[0][0]).toEqual('__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-TOTAL-PROCESS-DEFINITIONS');
            expect(res[0].datasets[0][1]).toEqual('9');
            expect(res[0].datasets[1][0]).toEqual('__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-TOTAL-PROCESS-INSTANCES');
            expect(res[0].datasets[1][1]).toEqual('41');
            expect(res[0].datasets[2][0]).toEqual('__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-ACTIVE-PROCESS-INSTANCES');
            expect(res[0].datasets[2][1]).toEqual('3');
            expect(res[0].datasets[3][0]).toEqual('__KEY_REPORTING.DEFAULT-REPORTS.PROCESS-DEFINITION-OVERVIEW.GENERAL-TABLE-COMPLETED-PROCESS-INSTANCES');
            expect(res[0].datasets[3][1]).toEqual('38');

            expect(res[1]).toBeDefined();
            expect(res[1].type).toEqual('pie');

            expect(res[2]).toBeDefined();
            expect(res[2].type).toEqual('table');

            done();
        });

        component.reportId = 1001;
        component.reportParamQuery = new ReportQuery({status: 'All'});
        component.ngOnChanges();

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.chartProcessDefOverview
            });
        });
    });

    it('Should render the Task overview report ', (done) => {
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(res.length).toEqual(3);

            expect(res[0]).toBeDefined();
            expect(res[0].type).toEqual('bar');
            expect(res[0].labels).toBeDefined();
            expect(res[0].labels.length).toEqual(2);
            expect(res[0].labels[0]).toEqual('2016-09-30T00:00:00.000+0000');
            expect(res[0].labels[1]).toEqual('2016-10-04T00:00:00.000+0000');
            expect(res[0].datasets[0].label).toEqual('series1');
            expect(res[0].datasets[0].data[0]).toEqual(3);
            expect(res[0].datasets[0].data[1]).toEqual(1);

            expect(res[1]).toBeDefined();
            expect(res[1].type).toEqual('masterDetailTable');
            expect(res[1].datasets).toBeDefined();
            expect(res[1].datasets.length).toEqual(2);
            expect(res[1].datasets[0][0]).toEqual('fake 1 user task');
            expect(res[1].datasets[0][1]).toEqual('1');
            expect(res[1].datasets[0][2]).toEqual('2.0');
            expect(res[1].datasets[0][3]).toEqual('3.0');
            expect(res[1].datasets[0][4]).toEqual('4.0');
            expect(res[1].datasets[0][5]).toEqual('5.0');
            expect(res[1].datasets[0][6]).toEqual('6.0');
            expect(res[1].datasets[1][0]).toEqual('fake 2 user task');
            expect(res[1].datasets[1][1]).toEqual('1');
            expect(res[1].datasets[1][2]).toEqual('2.0');
            expect(res[1].datasets[1][3]).toEqual('3.0');
            expect(res[1].datasets[1][4]).toEqual('4.0');
            expect(res[1].datasets[1][5]).toEqual('5.0');
            expect(res[1].datasets[1][6]).toEqual('6.0');

            expect(res[2]).toBeDefined();
            expect(res[2].type).toEqual('multiBar');
            expect(res[2].labels).toBeDefined();
            expect(res[2].labels.length).toEqual(3);
            expect(res[2].labels[0]).toEqual(1);
            expect(res[2].labels[1]).toEqual(2);
            expect(res[2].labels[2]).toEqual(3);
            expect(res[2].datasets[0].label).toEqual('averages');
            expect(res[2].datasets[0].data[0]).toEqual(0);
            expect(res[2].datasets[0].data[1]).toEqual(5);
            expect(res[2].datasets[0].data[2]).toEqual(2);
            expect(res[2].datasets[1].label).toEqual('minima');
            expect(res[2].datasets[1].data[0]).toEqual(0);
            expect(res[2].datasets[1].data[1]).toEqual(0);
            expect(res[2].datasets[1].data[2]).toEqual(0);
            expect(res[2].datasets[2].label).toEqual('maxima');
            expect(res[2].datasets[2].data[0]).toEqual(0);
            expect(res[2].datasets[2].data[1]).toEqual(29);
            expect(res[2].datasets[2].data[2]).toEqual(29);

            done();
        });

        component.reportId = 1;
        component.reportParamQuery = new ReportQuery({status: 'All'});
        component.ngOnChanges();

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.chartTaskOverview
            });
        });
    });

    it('Should reset the reports when the onChanged is call', () => {
        component.reports = [new Chart({id: 'fake', type: 'fake-type'})];
        component.reportId = 1;
        component.ngOnChanges();

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.reports).toBeUndefined();
        });
    });

    it('Should emit onError event with a 404 response ', (done) => {
        component.error.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

        component.reportId = 1;
        component.reportParamQuery = new ReportQuery({status: 'All'});
        component.ngOnChanges();

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 404,
                contentType: 'json',
                responseText: []
            });
        });
    });
});
