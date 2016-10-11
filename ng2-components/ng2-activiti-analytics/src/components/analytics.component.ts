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

import { Component, EventEmitter, OnInit, OnChanges, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { AnalyticsService } from '../services/analytics.service';
import { ReportModel, ReportQuery, ParameterValueModel, ReportParameterModel } from '../models/report.model';
import { Chart } from '../models/chart.model';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'activiti-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements  OnInit, OnChanges {

    @ViewChild('processDefinition')
    processDefinition: any;

    @Input()
    reportId: string;

    @Output()
    onSuccess = new EventEmitter();

    @Output()
    onError = new EventEmitter();

    reportDetails: ReportModel;

    reportParamQuery = new ReportQuery();

    reports: any[];

    reportForm: FormGroup;

    debug: boolean = true;

    constructor(private translate: AlfrescoTranslationService,
                private analyticsService: AnalyticsService,
                private formBuilder: FormBuilder ) {
        console.log('AnalyticsComponent');
        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-analytics/src');
        }
    }

    ngOnInit() {
        this.reportForm = this.formBuilder.group({
            dateRange: new FormGroup({})
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        let reportId = changes['reportId'];
        if (reportId && reportId.currentValue) {
            this.getParamsReports(reportId.currentValue);
            return;
        }
    }

    public getParamsReports(reportId: string) {
        this.reset();
        this.analyticsService.getParamsReports(reportId).subscribe(
            (res: ReportModel) => {
                this.reportDetails = res;
                if (this.reportDetails.hasParameters()) {
                    this.retrieveParameterOptions(this.reportDetails.definition.parameters);
                } else {
                    this.onSuccess.emit(res);
                }
            },
            (err: any) => {
                console.log(err);
                this.onError.emit(err);
            },
            () => console.log('retrive done')
        );
    }

    private retrieveParameterOptions(parameters: ReportParameterModel[]) {
        parameters.forEach((param) => {
            this.analyticsService.getParamValuesByType(param.type).subscribe(
                (opts: ParameterValueModel[]) => {
                    param.options = opts;
                    this.onSuccess.emit(this.reportDetails);
                },
                (err: any) => {
                    console.log(err);
                    this.onError.emit(err);
                },
                () => console.log(`${param.type} options loaded`)
            );
        });
    }

    public showReport() {
        this.analyticsService.getReportsByParams(this.reportDetails.id, this.reportParamQuery).subscribe(
            (res: Chart[]) => {
                this.reports = res;
                this.onSuccess.emit(res);
            },
            (err: any) => {
                this.onError.emit(err);
                console.log(err);
            },
            () => console.log('Login done')
        );
    }

    onNumberChanges(field: any) {
        this.reset();
        this.reportParamQuery.slowProcessInstanceInteger = parseInt(field.value, 10);
    }

    onDurationChanges(field: any) {
        this.reset();
        if (field && field.value) {
            this.reportParamQuery.duration = parseInt(field.value, 10);
        }
    }

    onTypeFilteringChanges(field: any) {
        this.reset();
        this.reportParamQuery.typeFiltering = field.value;
    }

    onStatusChanges(field: any) {
        this.reset();
        this.reportParamQuery.status = field.value;
    }

    onProcessDefinitionChanges(field: any) {
        this.reset();
        if (field.value) {
            this.reportParamQuery.processDefinitionId = field.value;
            this.analyticsService.getTasksByProcessDefinitionId(this.reportId, this.reportParamQuery.processDefinitionId).subscribe(
                (res: any) => {
                    let paramTask: ReportParameterModel = this.reportDetails.definition.parameters.find(p => p.type === 'task');
                    if (paramTask) {
                        paramTask.options = res;
                    }
                });
        }
    }

    onTaskChanges(field: any) {
        this.reset();
        this.reportParamQuery.taskName = field.value;
    }

    onDateRangeChange(dateRange: any) {
        this.reset();
        this.reportParamQuery.dateRange.startDate = dateRange.startDate;
        this.reportParamQuery.dateRange.endDate = dateRange.endDate;
    }

    onDateRangeIntervalChange(field: any) {
        this.reset();
        this.reportParamQuery.dateRangeInterval = field.value;
    }

    public reset() {
        this.reports = null;
    }

    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    public convertNumber(value: string): number {
        return parseInt(value, 10);
    }
}
