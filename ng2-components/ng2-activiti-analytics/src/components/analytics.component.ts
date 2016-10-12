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
    appId: string;

    @Input()
    reportId: string;

    @Output()
    onSuccess = new EventEmitter();

    @Output()
    onError = new EventEmitter();

    @Output()
    onDropdownChanged = new EventEmitter();

    @Output()
    onShowReport = new EventEmitter();

    @Output()
    onSuccessParamsReport = new EventEmitter();

    @Output()
    onSuccessParamOpt = new EventEmitter();

    reportDetails: ReportModel;

    reportParamQuery = new ReportQuery();

    reports: any[];

    reportForm: FormGroup;

    debug: boolean = false;

    private dropDownSub;
    private paramsReportSub;
    private paramOpts;

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

        this.dropDownSub = this.onDropdownChanged.subscribe((field) => {
            let paramDependOn: ReportParameterModel = this.reportDetails.definition.parameters.find(p => p.dependsOn === field.id);
            if (paramDependOn) {
                this.retrieveParameterOptions(this.reportDetails.definition.parameters, this.appId, this.reportId, field.value);
            }
        });

        this.paramOpts = this.onSuccessParamsReport.subscribe((report: ReportModel) => {
            if (report.hasParameters()) {
                this.retrieveParameterOptions(report.definition.parameters, this.appId);
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        let reportId = changes['reportId'];
        if (reportId && reportId.currentValue) {
            this.getParamsReports(reportId.currentValue);
            return;
        }

        let appId = changes['appId'];
        if (appId && (appId.currentValue || appId.currentValue === null)) {
            this.getParamsReports(this.reportId);
            return;
        }
    }

    public getParamsReports(reportId: string) {
        this.reset();
        this.paramsReportSub = this.analyticsService.getParamsReports(reportId).subscribe(
            (res: ReportModel) => {
                this.reportDetails = res;
                this.onSuccessParamsReport.emit(res);
            },
            (err: any) => {
                console.log(err);
                this.onError.emit(err);
            },
            () => console.log('retrive done')
        );
    }

    private retrieveParameterOptions(parameters: ReportParameterModel[], appId: string, reportId?: string, processDefinitionId?: string) {
        parameters.forEach((param) => {
            this.analyticsService.getParamValuesByType(param.type, appId, reportId, processDefinitionId).subscribe(
                (opts: ParameterValueModel[]) => {
                    param.options = opts;
                    this.onSuccessParamOpt.emit(opts);
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
                this.onShowReport.emit(res);
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
            this.onDropdownChanged.emit(field);
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

    public convertNumber(value: string): number {
        return parseInt(value, 10);
    }

    ngOnDestroy() {
        this.dropDownSub.unsubscribe();
        this.paramOpts.unsubscribe();
        if (this.paramsReportSub) {
            this.paramsReportSub.unsubscribe();
        }
    }
}
