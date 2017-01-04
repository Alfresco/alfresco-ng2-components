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

import { Component, EventEmitter, OnChanges, Input, Output, SimpleChanges } from '@angular/core';
import { AlfrescoTranslateService } from 'ng2-alfresco-core';
import { AnalyticsService } from '../services/analytics.service';
import { ReportQuery } from '../models/report.model';
import { Chart } from '../models/chart.model';

@Component({
    moduleId: module.id,
    selector: 'activiti-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnChanges {

    @Input()
    appId: string;

    @Input()
    reportId: number;

    @Input()
    debug: boolean = false;

    @Output()
    onSuccess = new EventEmitter();

    @Output()
    editReport = new EventEmitter();

    @Output()
    onError = new EventEmitter();

    reportParamQuery = new ReportQuery();

    reports: Chart[];

    showDetails: boolean = false;

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

    constructor(private translateService: AlfrescoTranslateService,
                private analyticsService: AnalyticsService) {
        console.log('AnalyticsComponent');
        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-analytics', 'node_modules/ng2-activiti-analytics/src');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.reset();
    }

    public showReport($event) {
        this.reportParamQuery = $event;
        this.analyticsService.getReportsByParams(this.reportId, this.reportParamQuery).subscribe(
            (res: Chart[]) => {
                this.reports = res;
                this.onSuccess.emit(res);
            },
            (err: any) => {
                this.onError.emit(err);
                console.log(err);
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

    public onEditReport(name: string) {
        this.editReport.emit(name);
    }

    toggleDetailsTable() {
        this.showDetails = !this.showDetails;
    }

    isShowDetails(): boolean {
        return this.showDetails;
    }
}
