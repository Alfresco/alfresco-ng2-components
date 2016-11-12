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
import { CoreModule } from 'ng2-alfresco-core';
import { AnalyticsReportListComponent } from '../components/analytics-report-list.component';
import { AnalyticsService } from '../services/analytics.service';
import { DebugElement }    from '@angular/core';

declare let jasmine: any;

describe('Test ng2-activiti-analytics Report list', () => {

    let reportList = [
        {'id': 2002, 'name': 'Fake Test Process definition heat map'},
        {'id': 2003, 'name': 'Fake Test Process definition overview'},
        {'id': 2004, 'name': 'Fake Test Process instances overview'},
        {'id': 2005, 'name': 'Fake Test Task overview'},
        {'id': 2006, 'name': 'Fake Test Task service level agreement'}
    ];

    let reportSelected = {'id': 2003, 'name': 'Fake Test Process definition overview'};

    let component: any;
    let fixture: ComponentFixture<AnalyticsReportListComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                AnalyticsReportListComponent
            ],
            providers: [
                AnalyticsService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalyticsReportListComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
        element = fixture.nativeElement;
    });

    describe('Rendering tests', () => {

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Report return true with undefined reports', () => {
            expect(component.isReportsEmpty()).toBeTruthy();

        });

        it('Report return true with an empty reports', () => {
            component.reports = [];
            expect(component.isReportsEmpty()).toBeTruthy();
        });

        it('should return the default reports when the report list is empty', (done) => {
            fixture.detectChanges();

            component.onSuccess.subscribe(() => {
                fixture.detectChanges();
                expect(element.querySelector('#report-list-0 > i').innerHTML).toBe('assignment');
                expect(element.querySelector('#report-list-0 > span').innerHTML).toBe('Fake Test Process definition heat map');
                expect(element.querySelector('#report-list-1 > span').innerHTML).toBe('Fake Test Process definition overview');
                expect(element.querySelector('#report-list-2 > span').innerHTML).toBe('Fake Test Process instances overview');
                expect(element.querySelector('#report-list-3 > span').innerHTML).toBe('Fake Test Task overview');
                expect(element.querySelector('#report-list-4 > span').innerHTML).toBe('Fake Test Task service level agreement');
                expect(component.isReportsEmpty()).toBeFalsy();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: []
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: []
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: reportList
            });
        });

        it('Report render the report list relative to a single app', (done) => {
            fixture.detectChanges();

            component.onSuccess.subscribe(() => {
                fixture.detectChanges();
                expect(element.querySelector('#report-list-0 > i').innerHTML).toBe('assignment');
                expect(element.querySelector('#report-list-0 > span').innerHTML).toBe('Fake Test Process definition heat map');
                expect(element.querySelector('#report-list-1 > span').innerHTML).toBe('Fake Test Process definition overview');
                expect(element.querySelector('#report-list-2 > span').innerHTML).toBe('Fake Test Process instances overview');
                expect(element.querySelector('#report-list-3 > span').innerHTML).toBe('Fake Test Task overview');
                expect(element.querySelector('#report-list-4 > span').innerHTML).toBe('Fake Test Task service level agreement');
                expect(component.isReportsEmpty()).toBeFalsy();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: reportList
            });
        });

        it('Report emit an error with a empty response', (done) => {
            fixture.detectChanges();

            component.onError.subscribe((err) => {
                expect(err).toBeDefined();
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 404,
                contentType: 'json',
                responseText: []
            });
        });

        it('Should return the current report when one report is selected', () => {
            component.reportClick.subscribe(() => {
                expect(component.currentReport).toEqual(reportSelected);
            });

            component.selectReport(reportSelected);
        });

    });

});
