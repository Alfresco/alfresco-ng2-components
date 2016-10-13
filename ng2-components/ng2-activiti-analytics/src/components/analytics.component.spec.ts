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
import {
    CoreModule
} from 'ng2-alfresco-core';

import { AnalyticsReportListComponent } from '../components/analytics-report-list.component';
import { AnalyticsComponent } from '../components/analytics.component';
import { WIDGET_DIRECTIVES } from '../components/widgets/index';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';

import { AnalyticsService } from '../services/analytics.service';
import { ReportModel, ReportQuery } from '../models/report.model';
import { Chart } from '../models/chart.model';
import * as moment from 'moment';
import { DebugElement, SimpleChange } from '@angular/core';
import * as analyticMock from '../assets/analyticsComponent.mock';

export const ANALYTICS_DIRECTIVES: any[] = [
    AnalyticsComponent,
    AnalyticsReportListComponent,
    WIDGET_DIRECTIVES
];
export const ANALYTICS_PROVIDERS: any[] = [
    AnalyticsService
];

declare let jasmine: any;
declare let mdDateTimePicker: any;

describe('Test ng2-activiti-analytics Report ', () => {

    let component: any;
    let fixture: ComponentFixture<AnalyticsComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    let componentHandler: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                ...ANALYTICS_DIRECTIVES,
                ...CHART_DIRECTIVES
            ],
            providers: [
                ...ANALYTICS_PROVIDERS
            ]
        }).compileComponents();
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

        it('Should initialize the Report form with a Form Group ', () => {
            expect(component.reportForm.get('dateRange')).toBeDefined();
            expect(component.reportForm.get('dateRange').get('startDate')).toBeDefined();
            expect(component.reportForm.get('dateRange').get('endDate')).toBeDefined();
        });

        it('Should render a dropdown with all the status when the definition parameter type is \'status\' ', (done) => {
            component.onSuccessParamsReport.subscribe(() => {
                fixture.detectChanges();
                let dropDown: any = element.querySelector('#select-status');
                expect(element.querySelector('h1').innerHTML).toEqual('Fake Task overview status');
                expect(dropDown).toBeDefined();
                expect(dropDown.length).toEqual(4);
                expect(dropDown[0].innerHTML).toEqual('Choose One');
                expect(dropDown[1].innerHTML).toEqual('All');
                expect(dropDown[2].innerHTML).toEqual('Active');
                expect(dropDown[3].innerHTML).toEqual('Complete');
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.reportDefParamStatus
            });
        });

        it('Should render a number with the default value when the definition parameter type is \'integer\' ', (done) => {
            component.onSuccessParamsReport.subscribe(() => {
                fixture.detectChanges();
                let numberElement: any = element.querySelector('#slowProcessInstanceInteger');
                expect(numberElement.value).toEqual('10');

                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.reportDefParamNumber
            });
        });

        it('Should render a duration component when the definition parameter type is \'duration\' ', (done) => {
            component.onSuccessParamsReport.subscribe(() => {
                fixture.detectChanges();
                let numberElement: any = element.querySelector('#duration');
                expect(numberElement.value).toEqual('0');

                let dropDown: any = element.querySelector('#select-duration');
                expect(dropDown).toBeDefined();
                expect(dropDown.length).toEqual(4);
                expect(dropDown[0].innerHTML).toEqual('Seconds');
                expect(dropDown[1].innerHTML).toEqual('Minutes');
                expect(dropDown[2].innerHTML).toEqual('Hours');
                expect(dropDown[3].innerHTML).toEqual('Days');
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.reportDefParamDuration
            });
        });

        it('Should render a checkbox with the value true when the definition parameter type is \'boolean\' ', (done) => {
            component.onSuccessParamsReport.subscribe(() => {
                fixture.detectChanges();
                let checkElement: any = element.querySelector('#typeFiltering');
                expect(checkElement.checked).toBeTruthy();
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.reportDefParamCheck
            });
        });

        it('Should render a date range components when the definition parameter type is \'dateRange\' ', (done) => {
            component.onSuccessParamsReport.subscribe(() => {
                fixture.detectChanges();
                let today = moment().format('YYYY-MM-DD');

                const startDate: any = element.querySelector('#startDateInput');
                const endDate: any = element.querySelector('#endDateInput');

                expect(startDate.value).toEqual(today);
                expect(endDate.value).toEqual(today);
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.reportDefParamDateRange
            });
        });

        it('Should render a dropdown with all the RangeInterval when the definition parameter type is \'dateRangeInterval\' ', (done) => {
            component.onSuccessParamsReport.subscribe(() => {
                fixture.detectChanges();
                let dropDown: any = element.querySelector('#select-dateRangeInterval');
                expect(dropDown).toBeDefined();
                expect(dropDown.length).toEqual(5);
                expect(dropDown[0].innerHTML).toEqual('By hour');
                expect(dropDown[1].innerHTML).toEqual('By day');
                expect(dropDown[2].innerHTML).toEqual('By week');
                expect(dropDown[3].innerHTML).toEqual('By month');
                expect(dropDown[4].innerHTML).toEqual('By year');
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.reportDefParamRangeInterval
            });
        });

        it('Should render a dropdown with all the process definition when the definition parameter type is \'processDefinition\' and the' +
            ' reportId change', (done) => {
            component.onSuccessParamOpt.subscribe(() => {
                fixture.detectChanges();
                let dropDown: any = element.querySelector('#select-processDefinitionId');
                expect(dropDown).toBeDefined();
                expect(dropDown.length).toEqual(5);
                expect(dropDown[0].innerHTML).toEqual('Choose One');
                expect(dropDown[1].innerHTML).toEqual('Fake Process Test 1 Name  (v 1) ');
                expect(dropDown[2].innerHTML).toEqual('Fake Process Test 1 Name  (v 2) ');
                expect(dropDown[3].innerHTML).toEqual('Fake Process Test 2 Name  (v 1) ');
                expect(dropDown[4].innerHTML).toEqual('Fake Process Test 3 Name  (v 1) ');
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.first().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.reportDefParamProcessDef
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.reportDefParamProcessDefOptions
            });
        });

        it('Should render a dropdown with all the process definition when the definition parameter type is \'processDefinition\' and the' +
            ' appId change', (done) => {
            component.onSuccessParamOpt.subscribe(() => {
                fixture.detectChanges();
                let dropDown: any = element.querySelector('#select-processDefinitionId');
                expect(dropDown).toBeDefined();
                expect(dropDown.length).toEqual(3);
                expect(dropDown[0].innerHTML).toEqual('Choose One');
                expect(dropDown[1].innerHTML).toEqual('Fake Process Test 1 Name  (v 1) ');
                expect(dropDown[2].innerHTML).toEqual('Fake Process Test 1 Name  (v 2) ');
                done();
            });

            let appId = 1;
            component.appId = appId;
            let change = new SimpleChange(null, appId);
            component.ngOnChanges({ 'appId': change });

            jasmine.Ajax.requests.first().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.reportDefParamProcessDef
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.reportDefParamProcessDefOptionsApp
            });
        });

        it('Should render the Process definition overview report ', (done) => {
            component.onShowReport.subscribe((res) => {
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

            component.reportDetails = new ReportModel({
                id: 1,
                definition:
                '{ "parameters" :[{"id":"status","type":"status", "options": [{"id": "all", "name" :"all"}],"value":null}]}'
            });

            component.reportParamQuery = new ReportQuery({status: 'All'});
            component.showReport();

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.chartProcessDefOverview
            });
        });

        it('Should render the Task overview report ', (done) => {
            component.onShowReport.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);

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

                done();
            });

            component.reportDetails = new ReportModel({
                id: 1,
                definition:
                    '{ "parameters" :[{"id":"status","type":"status", "options": [{"id": "all", "name" :"all"}],"value":null}]}'
            });

            component.reportParamQuery = new ReportQuery({status: 'All'});
            component.showReport();

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.chartTaskOverview
            });
        });

        it('Should reset the report and save the number value onNumberChanges method', () => {
            component.reports = [ new Chart({id: 'fake', type: 'fake-type'})];
            component.onNumberChanges(analyticMock.fieldNumber);

            expect(component.reports).toBeNull();
            expect(component.reportParamQuery.slowProcessInstanceInteger).toEqual(102);
        });

        it('Should reset the report and save the duration value onDurationChanges method', () => {
            component.reports = [ new Chart({id: 'fake', type: 'fake-type'})];
            component.onDurationChanges(analyticMock.fieldDuration);

            expect(component.reports).toBeNull();
            expect(component.reportParamQuery.duration).toEqual(30);
        });

        it('Should reset the report and save the status value onStatusChanges method', () => {
            component.reports = [ new Chart({id: 'fake', type: 'fake-type'})];
            component.onStatusChanges(analyticMock.fieldStatus);

            expect(component.reports).toBeNull();
            expect(component.reportParamQuery.status).toEqual('fake-value');
        });

        it('Should reset the report and save the typeFiltering value onTypeFilteringChanges method', () => {
            component.reports = [ new Chart({id: 'fake', type: 'fake-type'})];
            component.onTypeFilteringChanges(analyticMock.fieldTypeFiltering);

            expect(component.reports).toBeNull();
            expect(component.reportParamQuery.typeFiltering).toBeFalsy();
        });

        it('Should reset the report and save the taskName value onTaskChanges method', () => {
            component.reports = [ new Chart({id: 'fake', type: 'fake-type'})];
            component.onTaskChanges(analyticMock.fieldTask);

            expect(component.reports).toBeNull();
            expect(component.reportParamQuery.taskName).toEqual('fake-task-name');
        });

        it('Should reset the report and save the dateRange value onDateRangeChange method', () => {
            component.reports = [ new Chart({id: 'fake', type: 'fake-type'})];
            component.onDateRangeChange(analyticMock.fieldDateRange);

            expect(component.reports).toBeNull();
            expect(component.reportParamQuery.dateRange.startDate).toEqual('2016-10-12T00:00:00.000Z');
            expect(component.reportParamQuery.dateRange.endDate).toEqual('2016-10-14T00:00:00.000Z');
        });

        it('Should reset the report and save the dateRangeInterval value onDateRangeIntervalChange method', () => {
            component.reports = [ new Chart({id: 'fake', type: 'fake-type'})];
            component.onDateRangeIntervalChange(analyticMock.fieldDateRangeInterval);

            expect(component.reports).toBeNull();
            expect(component.reportParamQuery.dateRangeInterval).toEqual('fake-date-interval');
        });

        it('Should reset the report and save the processDefinitionId value onProcessDefinitionChanges method', () => {
            component.reports = [ new Chart({id: 'fake', type: 'fake-type'})];
            component.reportDetails = new ReportModel({
                id: 1,
                definition:
                    '{ "parameters" :[{"id":"processDefinitionId","type":"processDefinition","value":null}]}'
            });
            component.onProcessDefinitionChanges(analyticMock.fieldProcessDef);

            expect(component.reports).toBeNull();
            expect(component.reportParamQuery.processDefinitionId).toEqual('fake-process-name:1:15027');
        });

        it('Should load the task list when a process definition is selected', () => {
            component.onSuccessParamsReport.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);
                expect(res[0].id).toEqual('Fake task name 1');
                expect(res[0].name).toEqual('Fake task name 1');
                expect(res[1].id).toEqual('Fake task name 2');
                expect(res[1].name).toEqual('Fake task name 2');
            });

            component.reportId = 100;
            component.reports = [ new Chart({id: 'fake', type: 'fake-type'})];
            component.reportDetails = new ReportModel(analyticMock.reportDefParamTask);
            component.onProcessDefinitionChanges(analyticMock.fieldProcessDef);

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.reportDefParamTaskOptions
            });
        });

        it('Should convert a string in number', () => {
            let numberConvert = component.convertNumber('2');
            expect(numberConvert).toEqual(2);
        });

        it('Should emit an error with a 404 response when the options response is not found', (done) => {
            component.onError.subscribe((err) => {
                expect(err).toBeDefined();
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.first().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticMock.reportDefParamProcessDef
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 404,
                contentType: 'json',
                responseText: []
            });
        });

        it('Should emit an error with a 404 response when the  Process definition overview response is not found ', (done) => {
            component.onError.subscribe((err) => {
                expect(err).toBeDefined();
                done();
            });

            component.reportDetails = new ReportModel({
                id: 1,
                definition:
                    '{ "parameters" :[{"id":"status","type":"status", "options": [{"id": "all", "name" :"all"}],"value":null}]}'
            });

            component.reportParamQuery = new ReportQuery({status: 'All'});
            component.showReport();

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 404,
                contentType: 'json',
                responseText: []
            });
        });

        it('Should emit an error with a 404 response when the report parameters response is not found', (done) => {
            component.onError.subscribe((err) => {
                expect(err).toBeDefined();
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 404,
                contentType: 'json',
                responseText: []
            });
        });
    });
});
