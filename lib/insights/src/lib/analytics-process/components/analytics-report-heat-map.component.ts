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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AnalyticsService } from '../services/analytics.service';

@Component({
    selector: 'adf-analytics-report-heat-map, analytics-report-heat-map',
    templateUrl: './analytics-report-heat-map.component.html'
})
export class AnalyticsReportHeatMapComponent implements  OnInit {

    /** reportId. */
    @Input()
    report: any;

    /** success. */
    @Output()
    success = new EventEmitter();

    /** error. */
    @Output()
    error = new EventEmitter();

    field: any = {};

    metricForm: UntypedFormGroup;
    currentMetric: string;
    currentMetricColors: any;
    metricType: string;

    constructor(private analyticsService: AnalyticsService,
                private formBuilder: UntypedFormBuilder) {
    }

    ngOnInit() {
        this.initForm();
        this.field.id = 'metrics';
        this.field.value = 'totalCount';

        this.analyticsService.getMetricValues().subscribe(
            (opts: any[]) => {
                this.field.options = opts;
                this.success.emit(opts);
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
            metricGroup: new UntypedFormGroup({
                metric: new UntypedFormControl()
            })
        });
    }

    hasMetric(): boolean {
        return !!(this.report.totalCountsPercentages ||
            this.report.totalTimePercentages ||
            this.report.avgTimePercentages);
    }

    get metricGroup(): UntypedFormGroup {
        return this.metricForm.controls.metricGroup as UntypedFormGroup;
    }

}
