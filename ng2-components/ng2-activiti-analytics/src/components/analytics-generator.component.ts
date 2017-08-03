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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { Chart } from '../models/chart.model';
import { ReportQuery } from '../models/report.model';
import { AnalyticsService } from '../services/analytics.service';

@Component({
    selector: 'adf-analytics-generator, activiti-analytics-generator',
    templateUrl: './analytics-generator.component.html',
    styleUrls: ['./analytics-generator.component.css']
})
export class AnalyticsGeneratorComponent implements OnChanges {

    @Input()
    reportId: number;

    @Input()
    reportParamQuery: ReportQuery = undefined;

    @Output()
    onSuccess = new EventEmitter();

    @Output()
    onError = new EventEmitter();

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

    constructor(translateService: AlfrescoTranslationService,
                private analyticsService: AnalyticsService) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-analytics', 'assets/ng2-activiti-analytics');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.reportId && this.reportParamQuery) {
            this.generateReport(this.reportId, this.reportParamQuery);
        } else {
            this.reset();
        }
    }

    public generateReport(reportId, reportParamQuery) {
        if (reportParamQuery === undefined || reportParamQuery === null) {
            reportParamQuery = {};
        }
        this.analyticsService.getReportsByParams(reportId, reportParamQuery).subscribe(
            (res: Chart[]) => {
                this.reports = res;
                if (this.reports) {
                    this.selectFirstReport();
                }
                this.onSuccess.emit(res);
            },
            (err: any) => {
                this.onError.emit(err);
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
        let clone = JSON.parse(JSON.stringify(report));
        report.datasets = clone.datasets;
    }

    toggleDetailsTable() {
        this.showDetails = !this.showDetails;
    }

    isShowDetails(): boolean {
        return this.showDetails;
    }

    isCurrent(position: number) {
        return position === this.currentChartPosition ? true : false;
    }

    selectCurrent(position: number) {
        this.currentChartPosition = position;
    }

    selectFirstReport() {
        this.selectCurrent(0);
    }
}
