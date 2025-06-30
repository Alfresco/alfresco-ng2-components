/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ADF_DATE_FORMATS, AdfDateFnsAdapter, DownloadService, ToolbarComponent, ToolbarTitleComponent } from '@alfresco/adf-core';
import {
    AfterContentChecked,
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReportParameterDetailsModel } from '../../diagram/models/report/report-parameter-details.model';
import { ReportParametersModel } from '../../diagram/models/report/report-parameters.model';
import { ReportQuery } from '../../diagram/models/report/report-query.model';
import { AnalyticsService } from '../services/analytics.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { WIDGET_DIRECTIVES } from './widgets';
import { MatButtonModule } from '@angular/material/button';
import { ButtonsMenuComponent } from './buttons-menu/buttons-menu.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const FORMAT_DATE_ACTIVITI = 'YYYY-MM-DD';

export interface ReportFormProps {
    taskGroup?: FormGroup<{
        taskName: FormControl<string | null>;
    }>;
    processDefGroup?: FormGroup<{
        processDefinitionId: FormControl<string | null>;
    }>;
    dateIntervalGroup?: FormGroup<{
        dateRangeInterval: FormControl<string | null>;
    }>;
    dateRange?: FormGroup<{
        startDate?: FormControl<string | null>;
        endDate?: FormControl<string | null>;
    }>;
    statusGroup?: FormGroup<{
        status: FormControl<string | null>;
    }>;
    typeFilteringGroup?: FormGroup<{
        typeFiltering: FormControl<boolean | null>;
    }>;
    durationGroup?: FormGroup<{
        duration: FormControl<number | null>;
    }>;
    processInstanceGroup?: FormGroup<{
        slowProcessInstanceInteger: FormControl<string | null>;
    }>;
}

export interface ReportFormValues {
    taskGroup?: {
        taskName?: string;
    };
    processDefGroup?: {
        processDefinitionId?: string;
    };
    dateIntervalGroup?: {
        dateRangeInterval?: string;
    };
    dateRange?: {
        startDate?: string;
        endDate?: string;
    };
    statusGroup?: {
        status?: string;
    };
    typeFilteringGroup?: {
        typeFiltering?: boolean;
    };
    durationGroup?: {
        duration?: number;
    };
    processInstanceGroup?: {
        slowProcessInstanceInteger?: string;
    };
}

@Component({
    selector: 'adf-analytics-report-parameters',
    standalone: true,
    imports: [
        CommonModule,
        TranslatePipe,
        MatIconModule,
        ReactiveFormsModule,
        ToolbarComponent,
        ToolbarTitleComponent,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        ...WIDGET_DIRECTIVES,
        MatDialogModule,
        FormsModule,
        MatButtonModule,
        ButtonsMenuComponent
    ],
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter }
    ],
    templateUrl: './analytics-report-parameters.component.html',
    styleUrls: ['./analytics-report-parameters.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AnalyticsReportParametersComponent implements OnInit, OnChanges, AfterContentChecked {
    /** appId ID of the target app. */
    @Input()
    appId: number;

    /** reportId. */
    @Input()
    reportId: string;

    /** hideComponent. */
    @Input()
    hideComponent = false;

    /** success. */
    @Output()
    success = new EventEmitter<ReportQuery>();

    /** error. */
    @Output()
    error = new EventEmitter();

    /** edit. */
    @Output()
    edit = new EventEmitter<string>();

    /** form Value Changed. */
    @Output()
    formValueChanged = new EventEmitter();

    /** save Report Success. */
    @Output()
    saveReportSuccess = new EventEmitter<string>();

    /** delete Report Success. */
    @Output()
    deleteReportSuccess = new EventEmitter<string>();

    @ViewChild('reportNameDialog')
    reportNameDialog: any;

    onDropdownChanged = new EventEmitter<ReportParameterDetailsModel>();
    successReportParams = new EventEmitter<ReportParametersModel>();
    successParamOpt = new EventEmitter();

    reportParameters: ReportParametersModel;
    reportForm: FormGroup<ReportFormProps>;
    action: string;
    isEditable: boolean = false;
    reportName: string;
    reportParamQuery: ReportQuery;
    formValidState: boolean = false;

    private hideParameters: boolean = true;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private analyticsService: AnalyticsService,
        private formBuilder: FormBuilder,
        private downloadService: DownloadService,
        private dialog: MatDialog,
        private dateAdapter: AdfDateFnsAdapter
    ) {}

    ngOnInit() {
        this.onDropdownChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((field: any) => {
            const paramDependOn = this.reportParameters.definition.parameters.find((param) => param.dependsOn === field.id);
            if (paramDependOn) {
                this.retrieveParameterOptions(this.reportParameters.definition.parameters, this.appId, this.reportId, field.value);
            }
        });

        this.successReportParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((report) => {
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
        if (reportId?.currentValue) {
            this.reportId = reportId.currentValue;
            this.getReportParams(reportId.currentValue);
        }

        const appId = changes['appId'];
        if (appId && (appId.currentValue || appId.currentValue === null)) {
            this.getReportParams(this.reportId);
        }
    }

    getReportParams(reportId: string) {
        this.analyticsService.getReportParams(reportId).subscribe(
            (res: ReportParametersModel) => {
                this.reportParameters = res;
                if (this.reportParameters.hasParameters()) {
                    this.successReportParams.emit(res);
                } else {
                    this.reportForm = this.formBuilder.group<ReportFormProps>({});
                    this.success.emit();
                }
            },
            (err: any) => {
                this.error.emit(err);
            }
        );
    }

    onProcessDefinitionChanges(field: ReportParameterDetailsModel) {
        if (field.value) {
            this.onDropdownChanged.emit(field);
        }
    }

    public submit(values: ReportFormValues) {
        this.reportParamQuery = this.convertFormValuesToReportParamQuery(values);
        this.success.emit(this.reportParamQuery);
    }

    onValueChanged(values: ReportFormValues) {
        this.formValueChanged.emit(values);
        if (this.reportForm?.valid) {
            this.submit(values);
        }
    }

    onStatusChanged() {
        if (this.reportForm && !this.reportForm.pending && this.reportForm.dirty) {
            this.formValidState = this.reportForm.valid;
        }
    }

    private parseDate(input: string) {
        const date = this.dateAdapter.parse(input, FORMAT_DATE_ACTIVITI);
        return this.dateAdapter.format(date, FORMAT_DATE_ACTIVITI) + 'T00:00:00.000Z';
    }

    parseNumber(value: string): number {
        return value != null ? parseInt(value, 10) : 0;
    }

    private convertFormValuesToReportParamQuery(values: ReportFormValues): ReportQuery {
        const reportParamQuery = new ReportQuery();
        if (values.dateRange) {
            reportParamQuery.dateRange.startDate = this.parseDate(values.dateRange.startDate);
            reportParamQuery.dateRange.endDate = this.parseDate(values.dateRange.endDate);
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
            reportParamQuery.slowProcessInstanceInteger = this.parseNumber(values.processInstanceGroup.slowProcessInstanceInteger);
        }
        if (values.typeFilteringGroup) {
            reportParamQuery.typeFiltering = values.typeFilteringGroup.typeFiltering;
        }
        return reportParamQuery;
    }

    editEnable() {
        this.isEditable = true;
    }

    editDisable() {
        this.isEditable = false;
    }

    editTitle() {
        this.analyticsService.updateReport(`${this.reportParameters.id}`, this.reportParameters.name).subscribe(
            () => {
                this.editDisable();
                this.edit.emit(this.reportParameters.name);
            },
            (err) => {
                this.error.emit(err);
            }
        );
    }

    showDialog(event: string) {
        this.dialog.open(this.reportNameDialog, { width: '500px' });
        this.action = event;

        const date = this.dateAdapter.format(new Date(), FORMAT_DATE_ACTIVITI);
        this.reportName = `${this.reportParameters.name} ( ${date} )`;
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

    private resetActions() {
        this.action = '';
        this.reportName = '';
    }

    isSaveAction(): boolean {
        return this.action === 'Save';
    }

    private doExport(paramQuery: ReportQuery) {
        this.analyticsService.exportReportToCsv(this.reportId, paramQuery).subscribe((data: any) => {
            const blob: Blob = new Blob([data], { type: 'text/csv' });
            this.downloadService.downloadBlob(blob, paramQuery.reportName + '.csv');
        });
    }

    private doSave(paramQuery: ReportQuery) {
        this.analyticsService.saveReport(this.reportId, paramQuery).subscribe(() => {
            this.saveReportSuccess.emit(this.reportId);
        });
    }

    deleteReport(reportId: string) {
        this.analyticsService.deleteReport(reportId).subscribe(() => {
            this.deleteReportSuccess.emit(reportId);
        });
    }

    ngAfterContentChecked() {
        if (this.reportForm?.valid) {
            this.reportForm.markAsDirty();
        }
    }

    toggleParameters() {
        this.hideParameters = !this.hideParameters;
    }

    isParametersHide(): boolean {
        return this.hideParameters;
    }

    isFormValid(): boolean {
        return this.reportForm?.dirty && this.reportForm.valid;
    }

    get taskGroup(): FormGroup {
        return this.reportForm.controls.taskGroup;
    }

    get processDefGroup(): FormGroup {
        return this.reportForm.controls.processDefGroup;
    }

    get dateIntervalGroup(): FormGroup {
        return this.reportForm.controls.dateIntervalGroup;
    }

    get dateRange(): FormGroup {
        return this.reportForm.controls.dateRange;
    }

    get statusGroup(): FormGroup {
        return this.reportForm.controls.statusGroup;
    }

    get typeFilteringGroup(): FormGroup {
        return this.reportForm.controls.typeFilteringGroup;
    }

    get durationGroup(): FormGroup {
        return this.reportForm.controls.durationGroup;
    }

    get processInstanceGroup(): FormGroup {
        return this.reportForm.controls.processInstanceGroup;
    }

    private generateFormGroupFromParameter(parameters: ReportParameterDetailsModel[]) {
        const formBuilderGroup: ReportFormProps = {};

        parameters.forEach((param) => {
            switch (param.type) {
                case 'dateRange':
                    formBuilderGroup.dateRange = new FormGroup({}, Validators.required);
                    break;
                case 'processDefinition':
                    formBuilderGroup.processDefGroup = new FormGroup(
                        {
                            processDefinitionId: new FormControl(null, Validators.required, null)
                        },
                        Validators.required
                    );
                    break;
                case 'duration':
                    formBuilderGroup.durationGroup = new FormGroup(
                        {
                            duration: new FormControl(null, Validators.required, null)
                        },
                        Validators.required
                    );
                    break;
                case 'dateInterval':
                    formBuilderGroup.dateIntervalGroup = new FormGroup(
                        {
                            dateRangeInterval: new FormControl(null, Validators.required, null)
                        },
                        Validators.required
                    );
                    break;
                case 'boolean':
                    formBuilderGroup.typeFilteringGroup = new FormGroup(
                        {
                            typeFiltering: new FormControl(null, Validators.required, null)
                        },
                        Validators.required
                    );
                    break;
                case 'task':
                    formBuilderGroup.taskGroup = new FormGroup(
                        {
                            taskName: new FormControl(null, Validators.required, null)
                        },
                        Validators.required
                    );
                    break;
                case 'integer':
                    formBuilderGroup.processInstanceGroup = new FormGroup(
                        {
                            slowProcessInstanceInteger: new FormControl(null, Validators.required, null)
                        },
                        Validators.required
                    );
                    break;
                case 'status':
                    formBuilderGroup.statusGroup = new FormGroup(
                        {
                            status: new FormControl(null, Validators.required, null)
                        },
                        Validators.required
                    );
                    break;
                default:
                    return;
            }
        });
        this.reportForm = this.formBuilder.group<ReportFormProps>(formBuilderGroup);
        this.reportForm.valueChanges.subscribe((data) => this.onValueChanged(data));
        this.reportForm.statusChanges.subscribe(() => this.onStatusChanged());
    }

    private retrieveParameterOptions(parameters: ReportParameterDetailsModel[], appId: number, reportId?: string, processDefinitionId?: string) {
        parameters.forEach((param) => {
            this.analyticsService.getParamValuesByType(param.type, appId, reportId, processDefinitionId).subscribe(
                (opts) => {
                    param.options = opts;
                    this.successParamOpt.emit(opts);
                },
                (err: any) => {
                    this.error.emit(err);
                }
            );
        });
    }
}
