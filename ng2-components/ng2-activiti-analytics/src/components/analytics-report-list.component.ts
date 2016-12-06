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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { AnalyticsService } from '../services/analytics.service';
import { ReportParametersModel } from '../models/report.model';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'analytics-report-list',
    templateUrl: './analytics-report-list.component.html',
    styleUrls: ['./analytics-report-list.component.css']
})
export class AnalyticsReportListComponent implements  OnInit {

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

    constructor(private auth: AlfrescoAuthenticationService,
                private analyticsService: AnalyticsService) {

        this.report$ = new Observable<ReportParametersModel>(observer => this.reportObserver = observer).share();
    }

    ngOnInit() {
        this.report$.subscribe((report: ReportParametersModel) => {
            this.reports.push(report);
        });

        this.getReportListByAppId();
    }

    /**
     * Get the report list by app id
     */
    getReportListByAppId() {
        this.analyticsService.getReportList().subscribe(
            (res: ReportParametersModel[]) => {
                if (res && res.length === 0) {
                    this.createDefaultReports();
                } else {
                    res.forEach((report) => {
                        this.reportObserver.next(report);
                    });
                    this.onSuccess.emit(res);
                }
            },
            (err: any) => {
                this.onError.emit(err);
                console.log(err);
            }
        );
    }

    /**
     * Create the default reports and return the report list
     */
    createDefaultReports() {
        this.analyticsService.createDefaultReports().subscribe(
            () => {
                this.analyticsService.getReportList().subscribe(
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
     * Select the current report
     * @param report
     */
    public selectReport(report: any) {
        this.currentReport = report;
        this.reportClick.emit(report);
    }
}
