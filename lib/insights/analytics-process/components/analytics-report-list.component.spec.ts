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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsReportListComponent } from '../components/analytics-report-list.component';
import { ReportParametersModel } from '../../diagram/models/report/reportParameters.model';
import { setupTestBed } from '@alfresco/adf-core';
import { InsightsTestingModule } from '../../testing/insights.testing.module';

declare let jasmine: any;

describe('AnalyticsReportListComponent', () => {

    let reportList = [
        { 'id': 2002, 'name': 'Fake Test Process definition heat map' },
        { 'id': 2003, 'name': 'Fake Test Process definition overview' },
        { 'id': 2004, 'name': 'Fake Test Process instances overview' },
        { 'id': 2005, 'name': 'Fake Test Task overview' },
        { 'id': 2006, 'name': 'Fake Test Task service level agreement' }
    ];

    let reportSelected = { 'id': 2003, 'name': 'Fake Test Process definition overview' };

    let component: AnalyticsReportListComponent;
    let fixture: ComponentFixture<AnalyticsReportListComponent>;
    let element: HTMLElement;

    setupTestBed({
        imports: [InsightsTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalyticsReportListComponent);
        component = fixture.componentInstance;
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
            jasmine.Ajax.stubRequest('http://localhost:9876/bpm/activiti-app/app/rest/reporting/reports').andReturn({
                status: 200,
                contentType: 'json',
                responseText: []
            });

            fixture.detectChanges();

            jasmine.Ajax.stubRequest('http://localhost:9876/bpm/activiti-app/app/rest/reporting/default-reports').andReturn({
                status: 200,
                contentType: 'json',
                responseText: []
            });

            jasmine.Ajax.stubRequest('http://localhost:9876/bpm/activiti-app/app/rest/reporting/reports').andReturn({
                status: 200,
                contentType: 'json',
                responseText: reportList
            });

            component.success.subscribe(() => {
                fixture.detectChanges();
                expect(element.querySelector('#report-list-0 .adf-activiti-filters__entry-icon').innerHTML).toBe('assignment');
                expect(element.querySelector('#report-list-0 > span').innerHTML).toBe('Fake Test Process definition heat map');
                expect(element.querySelector('#report-list-1 > span').innerHTML).toBe('Fake Test Process definition overview');
                expect(element.querySelector('#report-list-2 > span').innerHTML).toBe('Fake Test Process instances overview');
                expect(element.querySelector('#report-list-3 > span').innerHTML).toBe('Fake Test Task overview');
                expect(element.querySelector('#report-list-4 > span').innerHTML).toBe('Fake Test Task service level agreement');
                expect(component.isReportsEmpty()).toBeFalsy();
                done();
            });
        });

        it('Report render the report list relative to a single app', (done) => {
            fixture.detectChanges();

            component.success.subscribe(() => {
                fixture.detectChanges();
                expect(element.querySelector('#report-list-0 .adf-activiti-filters__entry-icon').innerHTML).toBe('assignment');
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

            component.error.subscribe((err) => {
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

        it('Should return true if the current report is selected', () => {
            component.selectReport(reportSelected);
            expect(component.isSelected(reportSelected)).toBe(true);
        });

        it('Should return false if the current report is different', () => {
            component.selectReport(reportSelected);
            let anotherReport = { 'id': 111, 'name': 'Another Fake Test Process definition overview' };
            expect(component.isSelected(anotherReport)).toBe(false);
        });

        it('Should reload the report list', (done) => {
            component.initObserver();
            let report = new ReportParametersModel({ 'id': 2002, 'name': 'Fake Test Process definition heat map' });
            component.reports = [report];
            expect(component.reports.length).toEqual(1);
            component.reload();

            component.success.subscribe(() => {
                expect(component.reports.length).toEqual(5);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: reportList
            });
        });

        it('Should reload the report list and select the report with the given id', (done) => {
            component.initObserver();
            expect(component.reports.length).toEqual(0);

            component.reload(2002);

            component.success.subscribe(() => {
                expect(component.reports.length).toEqual(5);
                expect(component.currentReport).toBeDefined();
                expect(component.currentReport).not.toBeNull();
                expect(component.currentReport.id).toEqual(2002);
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: reportList
            });
        });

    });

    describe('layout', () => {

        it('should display a list by default', () => {
            fixture.detectChanges();
            expect(component.isGrid()).toBe(false);
            expect(component.isList()).toBe(true);
        });

        it('should display a grid when configured to', () => {
            component.layoutType = AnalyticsReportListComponent.LAYOUT_GRID;
            fixture.detectChanges();
            expect(component.isGrid()).toBe(true);
            expect(component.isList()).toBe(false);
        });

        it('should display a list when configured to', () => {
            component.layoutType = AnalyticsReportListComponent.LAYOUT_LIST;
            fixture.detectChanges();
            expect(component.isGrid()).toBe(false);
            expect(component.isList()).toBe(true);
        });
    });

});
