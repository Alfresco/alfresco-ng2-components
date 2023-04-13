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

import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { ReportQuery } from '../../diagram/models/report/report-query.model';
import { Chart } from '../../diagram/models/chart/chart.model';
import { AnalyticsService } from '../services/analytics.service';

@Component({
    selector: 'adf-analytics-generator',
    templateUrl: './analytics-generator.component.html',
    styleUrls: ['./analytics-generator.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AnalyticsGeneratorComponent implements OnChanges {

    /** reportId. */
    @Input()
    reportId: string;

    /** reportParamQuery. */
    @Input()
    reportParamQuery: ReportQuery = undefined;

    /** success. */
    @Output()
    success = new EventEmitter();

    /** error. */
    @Output()
    error = new EventEmitter();

    reports: Chart[];

    showDetails: boolean = false;
    currentChartPosition: number;

    public barChartOptions: any = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }],
            xAxes: [{
                ticks: {
                },
                stacked: true
            }]
        }
    };

    constructor(private analyticsService: AnalyticsService) {
    }

    ngOnChanges() {
        if (this.reportId && this.reportParamQuery) {
            this.generateReport(this.reportId, this.reportParamQuery);
        } else {
            this.reset();
        }
    }

    public generateReport(reportId: string, reportParamQuery: any) {
        if (reportParamQuery === undefined || reportParamQuery === null) {
            reportParamQuery = {};
        }
        this.analyticsService.getReportsByParams(reportId, reportParamQuery).subscribe(
            (res) => {
                this.reports = res;
                if (this.reports) {
                    this.selectFirstReport();
                }
                this.success.emit(res);
            },
            (err: any) => {
                this.error.emit(err);
            }
        );
    }

    public reset() {
        if (this.reports) {
            this.reports = undefined;
        }
    }

    public refresh(report): void {
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
        const clone = JSON.parse(JSON.stringify(report));
        report.datasets = clone.datasets;
    }

    toggleDetailsTable() {
        this.showDetails = !this.showDetails;
    }

    isShowDetails(): boolean {
        return this.showDetails;
    }

    isCurrent(position: number): boolean {
        return position === this.currentChartPosition;
    }

    selectCurrent(position: number) {
        this.currentChartPosition = position;
    }

    selectFirstReport() {
        this.selectCurrent(0);
    }
}
