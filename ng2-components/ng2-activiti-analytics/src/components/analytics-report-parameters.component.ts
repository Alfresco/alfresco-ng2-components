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

import { Component, EventEmitter, OnInit, OnChanges, Input, Output, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { AnalyticsService } from '../services/analytics.service';
import { ReportParametersModel, ReportQuery, ParameterValueModel, ReportParameterDetailsModel } from '../models/report.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'analytics-report-parameters',
    templateUrl: './analytics-report-parameters.component.html',
    styleUrls: ['./analytics-report-parameters.component.css']
})
export class AnalyticsReportParametersComponent implements OnInit, OnChanges {

    public static FORMAT_DATE_ACTIVITI: string =  'YYYY-MM-DD';

    @Input()
    appId: string;

    @Input()
    reportId: string;

    @Input()
    debug: boolean = false;

    @Output()
    onSuccess = new EventEmitter();

    @Output()
    onError = new EventEmitter();

    @Output()
    onEdit = new EventEmitter();

    @Output()
    onFormValueChanged = new EventEmitter();

    onDropdownChanged = new EventEmitter();

    onSuccessReportParams = new EventEmitter();

    onSuccessParamOpt = new EventEmitter();

    reportParameters: ReportParametersModel;

    reportForm: FormGroup;

    private dropDownSub;
    private reportParamsSub;
    private paramOpts;
    private isEditable: boolean = false;

    constructor(private translate: AlfrescoTranslationService,
                private analyticsService: AnalyticsService,
                private formBuilder: FormBuilder ) {
        if (translate) {
            translate.addTranslationFolder('ng2-activiti-analytics', 'node_modules/ng2-activiti-analytics/dist/src');
        }
    }

    ngOnInit() {
        this.initForm();

        this.dropDownSub = this.onDropdownChanged.subscribe((field) => {
            let paramDependOn: ReportParameterDetailsModel = this.reportParameters.definition.parameters.find(p => p.dependsOn === field.id);
            if (paramDependOn) {
                this.retrieveParameterOptions(this.reportParameters.definition.parameters, this.appId, this.reportId, field.value);
            }
        });

        this.paramOpts = this.onSuccessReportParams.subscribe((report: ReportParametersModel) => {
            if (report.hasParameters()) {
                this.retrieveParameterOptions(report.definition.parameters, this.appId);
            }
        });

        this.reportForm.valueChanges.subscribe(data => this.onValueChanged(data));
    }

    ngOnChanges(changes: SimpleChanges) {
        let reportId = changes['reportId'];
        if (reportId && reportId.currentValue) {
            this.getReportParams(reportId.currentValue);
        }

        let appId = changes['appId'];
        if (appId && (appId.currentValue || appId.currentValue === null)) {
            this.getReportParams(this.reportId);
        }
    }

    initForm() {
        this.reportForm = this.formBuilder.group({
            dateRange: new FormGroup({}),
            statusGroup: new FormGroup({
                status: new FormControl()
            }),
            processInstanceGroup: new FormGroup({
                slowProcessInstanceInteger: new FormControl()
            }),
            taskGroup: new FormGroup({
                taskName: new FormControl()
            }),
            typeFilteringGroup: new FormGroup({
                typeFiltering: new FormControl()
            }),
            dateIntervalGroup: new FormGroup({
                dateRangeInterval: new FormControl()
            }),
            durationGroup: new FormGroup({
                duration: new FormControl()
            }),
            processDefGroup: new FormGroup({
                processDefinitionId: new FormControl()
            })
        });
    }

    public getReportParams(reportId: string) {
        this.reportParamsSub = this.analyticsService.getReportParams(reportId).subscribe(
            (res: ReportParametersModel) => {
                this.reportParameters = res;
                if (this.reportParameters.hasParameters()) {
                    this.onSuccessReportParams.emit(res);
                } else {
                    this.onSuccess.emit();
                }
            },
            (err: any) => {
                console.log(err);
                this.onError.emit(err);
            }
        );
    }

    private retrieveParameterOptions(parameters: ReportParameterDetailsModel[], appId: string, reportId?: string, processDefinitionId?: string) {
        parameters.forEach((param) => {
            this.analyticsService.getParamValuesByType(param.type, appId, reportId, processDefinitionId).subscribe(
                (opts: ParameterValueModel[]) => {
                    param.options = opts;
                    this.onSuccessParamOpt.emit(opts);
                },
                (err: any) => {
                    console.log(err);
                    this.onError.emit(err);
                }
            );
        });
    }

    onProcessDefinitionChanges(field: any) {
        if (field.value) {
            this.onDropdownChanged.emit(field);
        }
    }

    public submit(values: any) {
        let reportParamQuery = this.convertFormValuesToReportParamQuery(values);
        this.onSuccess.emit(reportParamQuery);
    }

    onValueChanged(values: any) {
        this.onFormValueChanged.emit(values);
        if (this.reportForm && this.reportForm.valid) {
            this.submit(values);
        }
    }

    public convertMomentDate(date: string) {
        return moment(date, AnalyticsReportParametersComponent.FORMAT_DATE_ACTIVITI, true)
                .format(AnalyticsReportParametersComponent.FORMAT_DATE_ACTIVITI) + 'T00:00:00.000Z';
    }

    public convertNumber(value: string): number {
        return value != null ? parseInt(value, 10) : 0;
    }

    convertFormValuesToReportParamQuery(values: any): ReportQuery {
        let reportParamQuery: ReportQuery = new ReportQuery();
        reportParamQuery.dateRange.startDate = this.convertMomentDate(values.dateRange.startDate);
        reportParamQuery.dateRange.endDate = this.convertMomentDate(values.dateRange.endDate);
        reportParamQuery.status = values.statusGroup.status;
        reportParamQuery.processDefinitionId = values.processDefGroup.processDefinitionId;
        reportParamQuery.taskName = values.taskGroup.taskName;
        reportParamQuery.duration = values.durationGroup.duration;
        reportParamQuery.dateRangeInterval = values.dateIntervalGroup.dateRangeInterval;
        reportParamQuery.slowProcessInstanceInteger = this.convertNumber(values.processInstanceGroup.slowProcessInstanceInteger);
        reportParamQuery.typeFiltering = values.typeFilteringGroup.typeFiltering;
        return reportParamQuery;
    }

    ngOnDestroy() {
        this.dropDownSub.unsubscribe();
        this.paramOpts.unsubscribe();
        if (this.reportParamsSub) {
            this.reportParamsSub.unsubscribe();
        }
    }

    public editEnable() {
        this.isEditable =  true;
    }

    public editDisable() {
        this.isEditable = false;
    }

    public editTitle() {
        this.reportParamsSub = this.analyticsService.updateReport(this.reportParameters.id, this.reportParameters.name).subscribe(
            (res: ReportParametersModel) => {
                this.editDisable();
                this.onEdit.emit(this.reportParameters.name);
            },
            (err: any) => {
                console.log(err);
                this.onError.emit(err);
            }
        );
    }
}
