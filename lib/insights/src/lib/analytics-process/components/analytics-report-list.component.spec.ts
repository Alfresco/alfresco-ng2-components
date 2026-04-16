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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsReportListComponent, LAYOUT_GRID, LAYOUT_LIST } from '../components/analytics-report-list.component';
import { ReportParametersModel } from '../../diagram/models/report/report-parameters.model';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { AnalyticsService } from '../services/analytics.service';
import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';

describe('AnalyticsReportListComponent', () => {
    const reportList = [
        { id: 2002, name: 'Fake Test Process definition heat map' },
        { id: 2003, name: 'Fake Test Process definition overview' },
        { id: 2004, name: 'Fake Test Process instances overview' },
        { id: 2005, name: 'Fake Test Task overview' },
        { id: 2006, name: 'Fake Test Task service level agreement' }
    ];

    const reportSelected = { id: 2003, name: 'Fake Test Process definition overview' } as ReportParametersModel;

    let component: AnalyticsReportListComponent;
    let fixture: ComponentFixture<AnalyticsReportListComponent>;
    let element: HTMLElement;
    let analyticsService: AnalyticsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [InsightsTestingModule]
        });
        analyticsService = TestBed.inject(AnalyticsService);

        // Spy on both methods before creating the component
        spyOn(analyticsService, 'getReportList').and.returnValue(of(reportList as any));
        spyOn(analyticsService, 'createDefaultReports').and.returnValue(of([] as any));

        fixture = TestBed.createComponent(AnalyticsReportListComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Rendering tests', () => {
        it('Report return true with undefined reports', () => {
            expect(component.isReportsEmpty()).toBeTruthy();
        });

        it('Report return true with an empty reports', () => {
            component.reports = [];
            expect(component.isReportsEmpty()).toBeTruthy();
        });

        it('Report render the report list relative to a single app', (done) => {
            // Don't call initObserver() manually - ngOnInit will call it

            // Use take(1) to only handle the first emission
            component.success.pipe(take(1)).subscribe(() => {
                fixture.detectChanges();
                expect(element.querySelector('#report-list-0 .adf-activiti-filters__entry-icon').innerHTML).toBe('assignment');
                expect(element.querySelector('#report-list-0 .adf-text').innerHTML).toBe('Fake Test Process definition heat map');
                expect(element.querySelector('#report-list-1 .adf-text').innerHTML).toBe('Fake Test Process definition overview');
                expect(element.querySelector('#report-list-2 .adf-text').innerHTML).toBe('Fake Test Process instances overview');
                expect(element.querySelector('#report-list-3 .adf-text').innerHTML).toBe('Fake Test Task overview');
                expect(element.querySelector('#report-list-4 .adf-text').innerHTML).toBe('Fake Test Task service level agreement');
                expect(component.isReportsEmpty()).toBeFalsy();
                done();
            });

            fixture.detectChanges(); // This triggers ngOnInit which calls initObserver() and getReportList()
        });

        it('Report emit an error with a empty response', (done) => {
            const errorMessage = 'Not found';
            (analyticsService.getReportList as jasmine.Spy).and.returnValue(throwError(() => errorMessage));

            component.error.pipe(take(1)).subscribe((err) => {
                expect(err).toBeDefined();
                done();
            });

            fixture.detectChanges(); // Trigger ngOnInit which calls getReportList
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
            const anotherReport = { id: 111, name: 'Another Fake Test Process definition overview' };
            expect(component.isSelected(anotherReport)).toBe(false);
        });

        it('Should reload the report list', (done) => {
            fixture.detectChanges(); // Trigger ngOnInit to set up observer

            const report = new ReportParametersModel({ id: 2002, name: 'Fake Test Process definition heat map' });
            component.reports = [report];
            expect(component.reports.length).toEqual(1);

            // Subscribe BEFORE calling reload - use take(1) to handle only the first emission
            component.success.pipe(take(1)).subscribe(() => {
                expect(component.reports.length).toEqual(5);
                done();
            });

            component.reload();
        });

        it('Should reload the report list and select the report with the given id', (done) => {
            fixture.detectChanges(); // Trigger ngOnInit to set up observer

            // Reset to empty after ngOnInit populated it
            component.reports = [];
            expect(component.reports.length).toEqual(0);

            // Subscribe BEFORE calling reload - use take(1) to handle only the first emission
            component.success.pipe(take(1)).subscribe(() => {
                expect(component.reports.length).toEqual(5);
                expect(component.currentReport).toBeDefined();
                expect(component.currentReport).not.toBeNull();
                expect(component.currentReport.id).toEqual(2002);
                done();
            });

            component.reload(2002);
        });
    });

    describe('layout', () => {
        it('should display a list by default', () => {
            fixture.detectChanges();
            expect(component.isGrid()).toBe(false);
            expect(component.isList()).toBe(true);
        });

        it('should display a grid when configured to', () => {
            component.layoutType = LAYOUT_GRID;
            fixture.detectChanges();
            expect(component.isGrid()).toBe(true);
            expect(component.isList()).toBe(false);
        });

        it('should display a list when configured to', () => {
            component.layoutType = LAYOUT_LIST;
            fixture.detectChanges();
            expect(component.isGrid()).toBe(false);
            expect(component.isList()).toBe(true);
        });
    });
});
