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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { ReportParametersModel } from '../models/report.model';
import { AnalyticsService } from '../services/analytics.service';

@Component({
    selector: ' adf-analytics-report-list, analytics-report-list',
    templateUrl: './analytics-report-list.component.html',
    styleUrls: ['./analytics-report-list.component.css']
})
export class AnalyticsReportListComponent implements OnInit {

    public static LAYOUT_LIST: string = 'LIST';
    public static LAYOUT_GRID: string = 'GRID';

    @Input()
    layoutType: string = AnalyticsReportListComponent.LAYOUT_LIST;

    @Input()
    appId: string;

    @Input()
    selectFirst: boolean = false;

    @Output()
    reportClick: EventEmitter<ReportParametersModel> = new EventEmitter<ReportParametersModel>();

    @Output()
    onSuccess = new EventEmitter();

    @Output()
    onError = new EventEmitter();

    private reportObserver: Observer<any>;
    report$: Observable<any>;

    currentReport: any;

    reports: ReportParametersModel[] = [];

    constructor(private analyticsService: AnalyticsService) {
        this.report$ = new Observable<ReportParametersModel>(observer => this.reportObserver = observer).share();
    }

    ngOnInit() {
        this.initObserver();

        this.getReportList(this.appId);
    }

    initObserver() {
        this.report$.subscribe((report: ReportParametersModel) => {
            this.reports.push(report);
        });
    }

    /**
     * Reload the component
     */
    reload(reportId?) {
        this.reset();
        this.getReportList(this.appId, reportId);
    }

    /**
     * Get the report list
     */
    getReportList(appId: string, reportId?: string) {
        this.analyticsService.getReportList(appId).subscribe(
            (res: ReportParametersModel[]) => {
                if (res && res.length === 0) {
                    this.createDefaultReports();
                } else {
                    res.forEach((report) => {
                        this.reportObserver.next(report);
                    });
                    if (reportId) {
                        console.log('SELEZIONO IL REPORT!');
                        this.selectReportByReportId(reportId);
                    }
                    if (this.selectFirst) {
                        this.selectFirstReport();
                    }
                    this.onSuccess.emit(res);
                }
            },
            (err: any) => {
                this.onError.emit(err);
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
                        this.onSuccess.emit(response);
                    }
                );
            }
        );
    }

    /**
     * Check if the report list is empty
     * @returns {boolean|ReportParametersModel[]}
     */
    isReportsEmpty(): boolean {
        return this.reports === undefined || (this.reports && this.reports.length === 0);
    }

    /**
     * Reset the list
     */
    private reset() {
        if (!this.isReportsEmpty()) {
            this.reports = [];
        }
    }

    /**
     * Select the current report
     * @param report
     */
    public selectReport(report: any) {
        this.currentReport = report;
        this.reportClick.emit(report);
    }

    public selectReportByReportId(reportId) {
        let reportFound = this.reports.find(report => report.id === reportId);
        if (reportFound) {
            this.currentReport = reportFound;
            this.reportClick.emit(reportFound);
        }
    }

    selectFirstReport() {
        this.selectReport(this.reports[0]);
        this.selectFirst = false;
    }

    isSelected(report: any) {
        return this.currentReport === report ? true : false;
    }

    isList() {
        return this.layoutType === AnalyticsReportListComponent.LAYOUT_LIST;
    }

    isGrid() {
        return this.layoutType === AnalyticsReportListComponent.LAYOUT_GRID;
    }
}
