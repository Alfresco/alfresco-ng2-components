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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';
import { CoreModule, AlfrescoTranslateService } from 'ng2-alfresco-core';
import { DiagramsModule } from 'ng2-activiti-diagrams';

import { AnalyticsReportListComponent } from '../components/analytics-report-list.component';
import { AnalyticsComponent } from '../components/analytics.component';
import { AnalyticsReportParametersComponent } from '../components/analytics-report-parameters.component';
import { AnalyticsReportHeatMapComponent } from '../components/analytics-report-heat-map.component';
import { WIDGET_DIRECTIVES } from '../components/widgets/index';
import { Chart } from '../models/chart.model';
import { AnalyticsService } from '../services/analytics.service';
import { ReportQuery } from '../models/report.model';
import * as analyticMock from '../assets/analyticsComponent.mock';

export const ANALYTICS_DIRECTIVES: any[] = [
    AnalyticsComponent,
    AnalyticsReportParametersComponent,
    AnalyticsReportListComponent,
    AnalyticsReportHeatMapComponent,
    WIDGET_DIRECTIVES
];
export const ANALYTICS_PROVIDERS: any[] = [
    AnalyticsService
];

declare let jasmine: any;
declare let mdDateTimePicker: any;

describe('AnalyticsComponent', () => {

    let component: any;
    let fixture: ComponentFixture<AnalyticsComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    let componentHandler: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DiagramsModule.forRoot()
            ],
            declarations: [
                ...ANALYTICS_DIRECTIVES,
                ...CHART_DIRECTIVES
            ],
            providers: [
                ...ANALYTICS_PROVIDERS
            ]
        }).compileComponents();

        let translateService = TestBed.get(AlfrescoTranslateService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService, 'get').and.callFake((key) => { return Observable.of(key); });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalyticsComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        fixture.detectChanges();
        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);
        window['componentHandler'] = componentHandler;
    });

    describe('Rendering tests', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should render the Process definition overview report ', (done) => {
            component.onSuccess.subscribe((res) => {
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

            let reportParamQuery = new ReportQuery({status: 'All'});
            component.appId = 1;
            component.reportId = 1001;
            component.showReport(reportParamQuery);

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.chartProcessDefOverview
            });
        });

        it('Should render the Task overview report ', (done) => {
            component.onSuccess.subscribe((res) => {
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
                expect(res[1].type).toEqual('table');
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

            let reportParamQuery = new ReportQuery({status: 'All'});
            component.reportId = 1;
            component.showReport(reportParamQuery);

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.chartTaskOverview
            });
        });

        it('Should reset the reports when the onChanged is call', () => {
            let reportId = 1;
            component.reports = [ new Chart({id: 'fake', type: 'fake-type'})];
            let change = new SimpleChange(null, reportId);
            component.ngOnChanges({ 'reportId': change });
            expect(component.reports).toBeUndefined();
        });

        it('Should emit onError event with a 404 response ', (done) => {
            component.onError.subscribe((err) => {
                expect(err).toBeDefined();
                done();
            });

            let reportParamQuery = new ReportQuery({status: 'All'});
            component.reportId = 1;
            component.showReport(reportParamQuery);

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 404,
                contentType: 'json',
                responseText: []
            });
        });
    });
});
