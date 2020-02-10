/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { ContentService, LogService } from '@alfresco/adf-core';
import {
    AfterContentChecked,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment-es6';
import { ParameterValueModel } from '../../diagram/models/report/parameterValue.model';
import { ReportParameterDetailsModel } from '../../diagram/models/report/reportParameterDetails.model';
import { ReportParametersModel } from '../../diagram/models/report/reportParameters.model';
import { ReportQuery } from '../../diagram/models/report/reportQuery.model';
import { AnalyticsService } from '../services/analytics.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-analytics-report-parameters',
    templateUrl: './analytics-report-parameters.component.html',
    styleUrls: ['./analytics-report-parameters.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AnalyticsReportParametersComponent implements OnInit, OnChanges, OnDestroy, AfterContentChecked {

    public static FORMAT_DATE_ACTIVITI: string = 'YYYY-MM-DD';

    /** appId ID of the target app. */
    @Input()
    appId: number;

    /** reportId. */
    @Input()
    reportId: string;

    /** hideComponent. */
    @Input()
    hideComponent: boolean = false;

    /** success. */
    @Output()
    success = new EventEmitter();

    /** error. */
    @Output()
    error = new EventEmitter();

    /** edit. */
    @Output()
    edit = new EventEmitter();

    /** form Value Changed. */
    @Output()
    formValueChanged = new EventEmitter();

    /** save Report Success. */
    @Output()
    saveReportSuccess = new EventEmitter();

    /** delete Report Success. */
    @Output()
    deleteReportSuccess = new EventEmitter();

    @ViewChild('reportNameDialog', { static: false })
    reportNameDialog: any;

    onDropdownChanged = new EventEmitter();

    successReportParams = new EventEmitter<ReportParametersModel>();

    successParamOpt = new EventEmitter();

    reportParameters: ReportParametersModel;

    reportForm: FormGroup;

    action: string;

    isEditable: boolean = false;

    reportName: string;

    reportParamQuery: ReportQuery;
    private hideParameters: boolean = true;
    formValidState: boolean = false;
    private onDestroy$ = new Subject<boolean>();

    constructor(private analyticsService: AnalyticsService,
                private formBuilder: FormBuilder,
                private logService: LogService,
                private contentService: ContentService,
                private dialog: MatDialog) {

    }

    ngOnInit() {
        this.onDropdownChanged
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((field: any) => {
                const paramDependOn = this.reportParameters.definition.parameters.find(
                    (param) => param.dependsOn === field.id
                );
                if (paramDependOn) {
                    this.retrieveParameterOptions(
                        this.reportParameters.definition.parameters, this.appId, this.reportId, field.value
                    );
                }
            });

        this.successReportParams
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(report => {
                if (report.hasParameters()) {
                    this.retrieveParameterOptions(report.definition.parameters, this.appId);
                    this.generateFormGroupFromParameter(report.definition.parameters);
                }
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.isEditable = false;
        if (this.reportForm) {
            this.reportForm.reset();
        }

        const reportId = changes['reportId'];
        if (reportId && reportId.currentValue) {
            this.reportId = reportId.currentValue;
            this.getReportParams(reportId.currentValue);
        }

        const appId = changes['appId'];
        if (appId && (appId.currentValue || appId.currentValue === null)) {
            this.getReportParams(this.reportId);
        }
    }

    private generateFormGroupFromParameter(parameters: ReportParameterDetailsModel[]) {
        const formBuilderGroup: any = {};
        parameters.forEach((param: ReportParameterDetailsModel) => {
            switch (param.type) {
                case 'dateRange':
                    formBuilderGroup.dateRange = new FormGroup({}, Validators.required);
                    break;
                case 'processDefinition':
                    formBuilderGroup.processDefGroup = new FormGroup({
                        processDefinitionId: new FormControl(null, Validators.required, null)
                    }, Validators.required);
                    break;
                case 'duration':
                    formBuilderGroup.durationGroup = new FormGroup({
                        duration: new FormControl(null, Validators.required, null)
                    }, Validators.required);
                    break;
                case 'dateInterval':
                    formBuilderGroup.dateIntervalGroup = new FormGroup({
                        dateRangeInterval: new FormControl(null, Validators.required, null)
                    }, Validators.required);
                    break;
                case 'boolean':
                    formBuilderGroup.typeFilteringGroup = new FormGroup({
                        typeFiltering: new FormControl(null, Validators.required, null)
                    }, Validators.required);
                    break;
                case 'task':
                    formBuilderGroup.taskGroup = new FormGroup({
                        taskName: new FormControl(null, Validators.required, null)
                    }, Validators.required);
                    break;
                case 'integer':
                    formBuilderGroup.processInstanceGroup = new FormGroup({
                        slowProcessInstanceInteger: new FormControl(null, Validators.required, null)
                    }, Validators.required);
                    break;
                case 'status':
                    formBuilderGroup.statusGroup = new FormGroup({
                        status: new FormControl(null, Validators.required, null)
                    }, Validators.required);
                    break;
                default:
                    return;
            }
        });
        this.reportForm = this.formBuilder.group(formBuilderGroup);
        this.reportForm.valueChanges.subscribe((data) => this.onValueChanged(data));
        this.reportForm.statusChanges.subscribe(() => this.onStatusChanged());
    }

    public getReportParams(reportId: string) {
        this.analyticsService.getReportParams(reportId).subscribe(
            (res: ReportParametersModel) => {
                this.reportParameters = res;
                if (this.reportParameters.hasParameters()) {
                    this.successReportParams.emit(res);
                } else {
                    this.reportForm = this.formBuilder.group({});
                    this.success.emit();
                }
            },
            (err: any) => {
                this.error.emit(err);
            }
        );
    }

    private retrieveParameterOptions(parameters: ReportParameterDetailsModel[], appId: number, reportId?: string, processDefinitionId?: string) {
        parameters.forEach((param) => {
            this.analyticsService.getParamValuesByType(param.type, appId, reportId, processDefinitionId).subscribe(
                (opts: ParameterValueModel[]) => {
                    param.options = opts;
                    this.successParamOpt.emit(opts);
                },
                (err: any) => {
                    this.error.emit(err);
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
        this.reportParamQuery = this.convertFormValuesToReportParamQuery(values);
        this.success.emit(this.reportParamQuery);
    }

    onValueChanged(values: any) {
        this.formValueChanged.emit(values);
        if (this.reportForm && this.reportForm.valid) {
            this.submit(values);
        }
    }

    onStatusChanged() {
        if (this.reportForm && !this.reportForm.pending && this.reportForm.dirty) {
            this.formValidState = this.reportForm.valid;
        }
    }

    public convertMomentDate(date: string) {
        return moment(date, AnalyticsReportParametersComponent.FORMAT_DATE_ACTIVITI, true)
            .format(AnalyticsReportParametersComponent.FORMAT_DATE_ACTIVITI) + 'T00:00:00.000Z';
    }

    public getTodayDate() {
        return moment().format(AnalyticsReportParametersComponent.FORMAT_DATE_ACTIVITI);
    }

    public convertNumber(value: string): number {
        return value != null ? parseInt(value, 10) : 0;
    }

    convertFormValuesToReportParamQuery(values: any): ReportQuery {
        const reportParamQuery: ReportQuery = new ReportQuery();
        if (values.dateRange) {
            reportParamQuery.dateRange.startDate = this.convertMomentDate(values.dateRange.startDate);
            reportParamQuery.dateRange.endDate = this.convertMomentDate(values.dateRange.endDate);
        }
        if (values.statusGroup) {
            reportParamQuery.status = values.statusGroup.status;
        }
        if (values.processDefGroup) {
            reportParamQuery.processDefinitionId = values.processDefGroup.processDefinitionId;
        }
        if (values.taskGroup) {
            reportParamQuery.taskName = values.taskGroup.taskName;
        }
        if (values.durationGroup) {
            reportParamQuery.duration = values.durationGroup.duration;
        }
        if (values.dateIntervalGroup) {
            reportParamQuery.dateRangeInterval = values.dateIntervalGroup.dateRangeInterval;
        }
        if (values.processInstanceGroup) {
            reportParamQuery.slowProcessInstanceInteger = this.convertNumber(values.processInstanceGroup.slowProcessInstanceInteger);
        }
        if (values.typeFilteringGroup) {
            reportParamQuery.typeFiltering = values.typeFilteringGroup.typeFiltering;
        }
        return reportParamQuery;
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    public editEnable() {
        this.isEditable = true;
    }

    public editDisable() {
        this.isEditable = false;
    }

    public editTitle() {
        this.analyticsService
            .updateReport(`${this.reportParameters.id}`, this.reportParameters.name)
            .subscribe(
                () => {
                    this.editDisable();
                    this.edit.emit(this.reportParameters.name);
                },
                err => {
                    this.error.emit(err);
                }
            );
    }

    public showDialog(event: string) {
        this.dialog.open(this.reportNameDialog, { width: '500px' });
        this.action = event;
        this.reportName = this.reportParameters.name + ' ( ' + this.getTodayDate() + ' )';
    }

    closeDialog() {
        this.dialog.closeAll();
    }

    performAction(action: string, reportParamQuery: ReportQuery) {
        reportParamQuery.reportName = this.reportName;
        this.closeDialog();
        if (action === 'Save') {
            this.doSave(reportParamQuery);
        } else if (action === 'Export') {
            this.doExport(reportParamQuery);
        }
        this.resetActions();
    }

    resetActions() {
        this.action = '';
        this.reportName = '';
    }

    isSaveAction() {
        return this.action === 'Save';
    }

    doExport(paramQuery: ReportQuery) {
        this.analyticsService.exportReportToCsv(this.reportId, paramQuery).subscribe(
            (data: any) => {
                const blob: Blob = new Blob([data], { type: 'text/csv' });
                this.contentService.downloadBlob(blob, paramQuery.reportName + '.csv');
            });
    }

    doSave(paramQuery: ReportQuery) {
        this.analyticsService.saveReport(this.reportId, paramQuery).subscribe(() => {
            this.saveReportSuccess.emit(this.reportId);
        });
    }

    deleteReport(reportId: string) {
        this.analyticsService.deleteReport(reportId).subscribe(() => {
            this.deleteReportSuccess.emit(reportId);
        }, (error) => this.logService.error(error));
    }

    ngAfterContentChecked() {
        if (this.reportForm && this.reportForm.valid) {
            this.reportForm.markAsDirty();
        }
    }

    toggleParameters() {
        this.hideParameters = !this.hideParameters;
    }

    isParametersHide() {
        return this.hideParameters;
    }

    isFormValid() {
        return this.reportForm && this.reportForm.dirty && this.reportForm.valid;
    }
}
