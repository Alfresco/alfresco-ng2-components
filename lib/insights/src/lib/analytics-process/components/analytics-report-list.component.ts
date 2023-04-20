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

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ReportParametersModel } from '../../diagram/models/report/report-parameters.model';
import { AnalyticsService } from '../services/analytics.service';
import { share } from 'rxjs/operators';

export const LAYOUT_LIST = 'LIST';
export const LAYOUT_GRID = 'GRID';

@Component({
    selector: 'adf-analytics-report-list',
    templateUrl: './analytics-report-list.component.html',
    styleUrls: ['./analytics-report-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AnalyticsReportListComponent implements OnInit {
    /** layout Type LIST or GRID. */
    @Input()
    layoutType: string = LAYOUT_LIST;

    /** appId ID of the target app. */
    @Input()
    appId: number;

    /** selectFirst. */
    @Input()
    selectFirst: boolean = false;

    /** report Click. */
    @Output()
    reportClick = new EventEmitter<ReportParametersModel>();

    /** success. */
    @Output()
    success = new EventEmitter();

    /** error. */
    @Output()
    error = new EventEmitter();

    report$: Observable<ReportParametersModel>;
    currentReport: any;
    reports: ReportParametersModel[] = [];

    private reportObserver: Observer<any>;

    constructor(private analyticsService: AnalyticsService) {
        this.report$ = new Observable<ReportParametersModel>((observer) => this.reportObserver = observer)
            .pipe(share());
    }

    ngOnInit() {
        this.initObserver();

        this.getReportList(this.appId);
    }

    initObserver() {
        this.report$.subscribe((report) => {
            this.reports.push(report);
        });
    }

    /**
     * Reload the component
     */
    reload(reportId?: number) {
        this.reset();
        this.getReportList(this.appId, reportId);
    }

    /**
     * Get the report list
     */
    getReportList(appId: number, reportId?: number) {
        this.analyticsService.getReportList(appId).subscribe(
            (res: ReportParametersModel[]) => {
                if (res && res.length === 0) {
                    this.createDefaultReports();
                } else {
                    res.forEach((report) => {
                        this.reportObserver.next(report);
                    });
                    if (reportId) {
                        this.selectReportByReportId(reportId);
                    }
                    if (this.selectFirst) {
                        this.selectFirstReport();
                    }
                    this.success.emit(res);
                }
            },
            (err: any) => {
                this.error.emit(err);
            }
        );
    }

    /**
     * Create the default reports and return the report list
     */
    createDefaultReports() {
        this.analyticsService.createDefaultReports().subscribe(
            () => {
                this.analyticsService.getReportList(this.appId).subscribe(
                    (response: ReportParametersModel[]) => {
                        response.forEach((report) => {
                            this.reportObserver.next(report);
                        });
                        this.success.emit(response);
                    }
                );
            }
        );
    }

    /**
     * Check if the report list is empty
     */
    isReportsEmpty(): boolean {
        return this.reports === undefined || (this.reports && this.reports.length === 0);
    }

    /**
     * Select the current report
     *
     * @param report
     */
    selectReport(report: any) {
        this.currentReport = report;
        this.reportClick.emit(report);
    }

    selectReportByReportId(reportId: number) {
        const reportFound = this.reports.find((report) => report.id === reportId);
        if (reportFound) {
            this.currentReport = reportFound;
            this.reportClick.emit(reportFound);
        }
    }

    selectFirstReport() {
        this.selectReport(this.reports[0]);
        this.selectFirst = false;
    }

    isSelected(report: any): boolean {
        return this.currentReport === report;
    }

    isList(): boolean {
        return this.layoutType === LAYOUT_LIST;
    }

    isGrid(): boolean {
        return this.layoutType === LAYOUT_GRID;
    }

    /**
     * Reset the list
     */
    private reset() {
        if (!this.isReportsEmpty()) {
            this.reports = [];
        }
    }
}
