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

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { AnalyticsService } from '../services/analytics.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'analytics-report-heat-map',
    templateUrl: './analytics-report-heat-map.component.html'
})
export class AnalyticsReportHeatMapComponent implements  OnInit {

    @Input()
    report: any;

    @Output()
    onSuccess = new EventEmitter();

    @Output()
    onError = new EventEmitter();

    field: any = {};

    metricForm: FormGroup;
    currentMetric: string;
    currentMetricColors: string;
    metricType: string;

    constructor(private translateService: AlfrescoTranslationService,
                private analyticsService: AnalyticsService,
                private formBuilder: FormBuilder) {
        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-analytics', 'node_modules/ng2-activiti-analytics/src');
        }
    }

    ngOnInit() {
        this.initForm();
        this.field.id = 'metrics';
        this.field.value = 'totalCount';

        this.analyticsService.getMetricValues().subscribe(
            (opts: any[]) => {
                this.field.options = opts;
                this.onSuccess.emit(opts);
            }
        );
    }

    onMetricChanges(field: any) {
        if (field.value === 'totalCount') {
            this.currentMetric = this.report.totalCountValues;
            this.currentMetricColors = this.report.totalCountsPercentages;
            this.metricType = 'times';
        } else if (field.value === 'totalTime') {
            this.currentMetric = this.report.totalTimeValues;
            this.currentMetricColors = this.report.totalTimePercentages;
            this.metricType = 'hours';
        } else if (field.value === 'avgTime') {
            this.currentMetric = this.report.avgTimeValues;
            this.currentMetricColors = this.report.avgTimePercentages;
            this.metricType = 'hours';
        }
    }

    initForm() {
        this.metricForm = this.formBuilder.group({
            metricGroup: new FormGroup({
                metric: new FormControl()
            })
        });
    }

    hasMetric() {
        return (this.report.totalCountsPercentages ||
        this.report.totalTimePercentages ||
        this.report.avgTimePercentages) ? true : false;
    }

}
