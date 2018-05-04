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

import { ContentService, LogService, MenuButton } from '@alfresco/adf-core';
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
import { MatDialog } from '@angular/material';
import moment from 'moment-es6';
import { ParameterValueModel } from '../../diagram/models/report/parameterValue.model';
import { ReportParameterDetailsModel } from '../../diagram/models/report/reportParameterDetails.model';
import { ReportParametersModel } from '../../diagram/models/report/reportParameters.model';
import { ReportQuery } from '../../diagram/models/report/reportQuery.model';
import { AnalyticsService } from '../services/analytics.service';

// @deprecated 2.3.0 analytics-report-parameters tag removed
@Component({
    selector: 'adf-analytics-report-parameters, analytics-report-parameters',
    templateUrl: './analytics-report-parameters.component.html',
    styleUrls: ['./analytics-report-parameters.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AnalyticsReportParametersComponent implements OnInit, OnChanges, OnDestroy, AfterContentChecked {

    public static FORMAT_DATE_ACTIVITI: string = 'YYYY-MM-DD';

    @Input()
    appId: number;

    @Input()
    reportId: string;

    @Input()
    hideComponent: boolean = false;

    @Output()
    success = new EventEmitter();

    @Output()
    error = new EventEmitter();

    @Output()
    edit = new EventEmitter();

    @Output()
    formValueChanged = new EventEmitter();

    @Output()
    saveReportSuccess = new EventEmitter();

    @Output()
    deleteReportSuccess = new EventEmitter();

    @ViewChild('reportNameDialog')
    reportNameDialog: any;

    onDropdownChanged = new EventEmitter();

    successReportParams = new EventEmitter();

    successParamOpt = new EventEmitter();

    reportParameters: ReportParametersModel;

    reportForm: FormGroup;

    action: string;

    isEditable: boolean = false;

    reportName: string;

    buttons: MenuButton[] = [];

    private dropDownSub;
    private reportParamsSub;
    private paramOpts;
    private reportParamQuery: ReportQuery;
    private hideParameters: boolean = true;
    formValidState: boolean = false;

    constructor(private analyticsService: AnalyticsService,
                private formBuilder: FormBuilder,
                private logService: LogService,
                private contentService: ContentService,
                private dialog: MatDialog) {

    }

    ngOnInit() {
        this.dropDownSub = this.onDropdownChanged.subscribe((field) => {
            let paramDependOn: ReportParameterDetailsModel = this.reportParameters.definition.parameters.find(p => p.dependsOn === field.id);
            if (paramDependOn) {
                this.retrieveParameterOptions(this.reportParameters.definition.parameters, this.appId, this.reportId, field.value);
            }
        });

        this.paramOpts = this.successReportParams.subscribe((report: ReportParametersModel) => {
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

        let reportId = changes['reportId'];
        if (reportId && reportId.currentValue) {
            this.reportId = reportId.currentValue;
            this.getReportParams(reportId.currentValue);
            this.setButtons();
        }

        let appId = changes['appId'];
        if (appId && (appId.currentValue || appId.currentValue === null)) {
            this.getReportParams(this.reportId);
        }
    }

    private generateFormGroupFromParameter(parameters: ReportParameterDetailsModel[]) {
        let formBuilderGroup: any = {};
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
        this.reportForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.reportForm.statusChanges.subscribe(data => this.onStatusChanged(data));
    }

    public getReportParams(reportId: string) {
        this.reportParamsSub = this.analyticsService.getReportParams(reportId).subscribe(
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

    onStatusChanged(status: any) {
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
        let reportParamQuery: ReportQuery = new ReportQuery();
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
        this.dropDownSub.unsubscribe();
        this.paramOpts.unsubscribe();
        if (this.reportParamsSub) {
            this.reportParamsSub.unsubscribe();
        }
    }

    public editEnable() {
        this.isEditable = true;
    }

    public editDisable() {
        this.isEditable = false;
    }

    public editTitle() {
        this.reportParamsSub = this.analyticsService.updateReport(this.reportParameters.id, this.reportParameters.name).subscribe(
            (res: ReportParametersModel) => {
                this.editDisable();
                this.edit.emit(this.reportParameters.name);
            },
            (err: any) => {
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
                let blob: Blob = new Blob([data], { type: 'text/csv' });
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
        }, error => this.logService.error(error));
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

    setButtons() {
        this.buttons = [
            new MenuButton({
                label: 'ANALYTICS.MESSAGES.ICON-SETTING',
                icon: 'settings',
                handler: this.toggleParameters.bind(this)
            }),
            new MenuButton({
                label: 'ANALYTICS.MESSAGES.ICON-DELETE',
                icon: 'delete',
                handler: this.deleteReport.bind(this, this.reportId),
                id: 'delete-button'
            }),
            new MenuButton({
                label: 'ANALYTICS.MESSAGES.ICON-EXPORT-CSV',
                icon: 'file_download',
                handler: this.showDialog.bind(this, 'Export'),
                id: 'export-button',
                isVisible: this.isFormValid.bind(this)
            }),
            new MenuButton({
                label: 'ANALYTICS.MESSAGES.ICON-SAVE',
                icon: 'save',
                handler: this.showDialog.bind(this, 'Save'),
                id: 'save-button',
                isVisible: this.isFormValid.bind(this)
            })
        ];
    }
}
