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

import { AnalyticsReportParametersComponent } from '../components/analytics-report-parameters.component';
import { WIDGET_DIRECTIVES } from '../components/widgets/index';

import { AnalyticsService } from '../services/analytics.service';
import { ReportParametersModel } from '../models/report.model';
import * as moment from 'moment';
import { DebugElement, SimpleChange } from '@angular/core';
import * as analyticParamsMock from '../assets/analyticsParamsReportComponent.mock';

declare let jasmine: any;
declare let mdDateTimePicker: any;

describe('Test ng2-analytics-report-parameters Report Parameters ', () => {

    let component: any;
    let fixture: ComponentFixture<AnalyticsReportParametersComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    let componentHandler: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                AnalyticsReportParametersComponent,
                ...WIDGET_DIRECTIVES
            ],
            providers: [
                AnalyticsService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalyticsReportParametersComponent);
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
            component.onSuccessReportParams.subscribe(() => {
                fixture.detectChanges();
                let dropDown: any = element.querySelector('#select-status');
                expect(element.querySelector('h4').innerHTML).toEqual('Fake Task overview status');
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
                responseText: analyticParamsMock.reportDefParamStatus
            });
        });

        it('Should render a number with the default value when the definition parameter type is \'integer\' ', (done) => {
            component.onSuccessReportParams.subscribe(() => {
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
                responseText: analyticParamsMock.reportDefParamNumber
            });
        });

        it('Should render a duration component when the definition parameter type is \'duration\' ', (done) => {
            component.onSuccessReportParams.subscribe(() => {
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
                responseText: analyticParamsMock.reportDefParamDuration
            });
        });

        it('Should save an Params object when the submit is performed', () => {
            component.onSuccess.subscribe((res) => {
                expect(res.dateRange.startDate).toEqual('2016-09-01T00:00:00.000Z');
                expect(res.dateRange.endDate).toEqual('2016-10-05T00:00:00.000Z');
                expect(res.status).toEqual('All');
                expect(res.processDefinitionId).toEqual('FakeProcess:1:22');
                expect(res.taskName).toEqual('FakeTaskName');
                expect(res.duration).toEqual(22);
                expect(res.dateRangeInterval).toEqual(120);
                expect(res.slowProcessInstanceInteger).toEqual(2);
                expect(res.typeFiltering).toEqual(true);
            });

            let values: any = {
                dateRange: {
                    startDate: '2016-09-01', endDate: '2016-10-05'
                },
                statusGroup: {
                    status: 'All'
                },
                processDefGroup: {
                    processDefinitionId: 'FakeProcess:1:22'
                },
                taskGroup: {
                    taskName: 'FakeTaskName'
                },
                durationGroup: {
                    duration: 22
                },
                dateIntervalGroup: {
                    dateRangeInterval: 120
                },
                processInstanceGroup: {
                    slowProcessInstanceInteger: 2
                },
                typeFilteringGroup: {
                    typeFiltering: true
                }
            };
            component.submit(values);
        });

        it('Should render a checkbox with the value true when the definition parameter type is \'boolean\' ', (done) => {
            component.onSuccessReportParams.subscribe(() => {
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
                responseText: analyticParamsMock.reportDefParamCheck
            });
        });

        it('Should render a date range components when the definition parameter type is \'dateRange\' ', (done) => {
            component.onSuccessReportParams.subscribe(() => {
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
                responseText: analyticParamsMock.reportDefParamDateRange
            });
        });

        it('Should render a dropdown with all the RangeInterval when the definition parameter type is \'dateRangeInterval\' ', (done) => {
            component.onSuccessReportParams.subscribe(() => {
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
                responseText: analyticParamsMock.reportDefParamRangeInterval
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
                responseText: analyticParamsMock.reportDefParamProcessDef
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamProcessDefOptionsNoApp
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
                responseText: analyticParamsMock.reportDefParamProcessDef
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamProcessDefOptionsApp
            });
        });

        it('Should load the task list when a process definition is selected', () => {
            component.onSuccessReportParams.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);
                expect(res[0].id).toEqual('Fake task name 1');
                expect(res[0].name).toEqual('Fake task name 1');
                expect(res[1].id).toEqual('Fake task name 2');
                expect(res[1].name).toEqual('Fake task name 2');
            });

            component.reportId = 100;
            component.reportParameters = new ReportParametersModel(analyticParamsMock.reportDefParamTask);
            component.onProcessDefinitionChanges(analyticParamsMock.fieldProcessDef);

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamTaskOptions
            });
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
                responseText: analyticParamsMock.reportDefParamProcessDef
            });

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

    it('Should convert a string in number', () => {
        let numberConvert = component.convertNumber('2');
        expect(numberConvert).toEqual(2);
    });
});
