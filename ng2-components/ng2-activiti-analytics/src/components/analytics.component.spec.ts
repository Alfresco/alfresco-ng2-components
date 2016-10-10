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

import { DebugElement, SimpleChange }    from '@angular/core';

export const ANALYTICS_DIRECTIVES: any[] = [
    AnalyticsComponent,
    AnalyticsReportListComponent,
    WIDGET_DIRECTIVES
];
export const ANALYTICS_PROVIDERS: any[] = [
    AnalyticsService
];

declare let jasmine: any;

describe('Test ng2-activiti-analytics Report ', () => {

    let reportDefParamStatus = {
        'id': 2005,
        'name': 'Fake Task overview status',
        'created': '2016-10-05T15:39:40.222+0000',
        'definition': '{ "parameters" :[{"id":"status","name":null,"nameKey":null,"type":"status","value":null,"dependsOn":null}]}'
    };

    let reportDefParamRangeInterval = {
        'id': 2006,
        'name': 'Fake Task overview RangeInterval',
        'created': '2016-10-05T15:39:40.222+0000',
        'definition': '{ "parameters" :[{"id":"dateRangeInterval","name":null,"nameKey":null,"type":"dateInterval","value":null,"dependsOn":null}]}'
    };

    let reportDefParamProcessDef = {
        'id': 2006,
        'name': 'Fake Task overview ProcessDefinition',
        'created': '2016-10-05T15:39:40.222+0000',
        'definition': '{ "parameters" :[{"id":"processDefinitionId","name":null,"nameKey":null,"type":"processDefinition","value":null,"dependsOn":null}]}'
    };

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
            fixture.detectChanges();

            expect(component.reportForm.get('dateRange')).toBeDefined();
            expect(component.reportForm.get('dateRange').get('startDate')).toBeDefined();
            expect(component.reportForm.get('dateRange').get('endDate')).toBeDefined();
        });

        it('Should render a dropdown with all the status when the definition parameter type is \'status\' ', (done) => {
            fixture.detectChanges();

            component.onSuccess.subscribe(() => {
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
                responseText: reportDefParamStatus
            });
        });

        it('Should render a dropdown with all the RangeInterval when the definition parameter type is \'dateRangeInterval\' ', (done) => {
            fixture.detectChanges();

            component.onSuccess.subscribe(() => {
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
                responseText: reportDefParamRangeInterval
            });
        });

        it('Should render a dropdown with all the process definition when the definition parameter type is \'processDefinition\' ', (done) => {
            fixture.detectChanges();

            component.onSuccess.subscribe(() => {
                fixture.detectChanges();
                let dropDown: any = element.querySelector('#select-processDefinition');
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
                responseText: reportDefParamProcessDef
            });
        });

        it('Should emit an error with a 404 response', (done) => {
            fixture.detectChanges();

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
