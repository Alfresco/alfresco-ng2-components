/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    OnDestroy,
    HostListener,
    OnInit,
    ChangeDetectorRef,
    inject
} from '@angular/core';
import { Observable, of, forkJoin, Subject, Subscription } from 'rxjs';
import { switchMap, takeUntil, map, filter } from 'rxjs/operators';
import {
    FormBaseComponent,
    FormFieldModel,
    FormOutcomeEvent,
    FormOutcomeModel,
    WidgetVisibilityService,
    FormService,
    FORM_FIELD_VALIDATORS,
    FormFieldValidator,
    FormValues,
    FormModel,
    ContentLinkModel,
    UploadWidgetContentLinkModel,
    FormEvent,
    ConfirmDialogComponent
} from '@alfresco/adf-core';
import { FormCloudService } from '../services/form-cloud.service';
import { TaskVariableCloud } from '../models/task-variable-cloud.model';
import { TaskDetailsCloudModel } from '../../task/start-task/models/task-details-cloud.model';
import { MatDialog } from '@angular/material/dialog';
import { v4 as uuidGeneration } from 'uuid';
import { FormCloudDisplayMode, FormCloudDisplayModeConfiguration } from '../../services/form-fields.interfaces';
import { FormCloudSpinnerService } from '../services/spinner/form-cloud-spinner.service';
import { DisplayModeService } from '../services/display-mode.service';

@Component({
    selector: 'adf-cloud-form',
    templateUrl: './form-cloud.component.html',
    styleUrls: ['./form-cloud.component.scss']
})
export class FormCloudComponent extends FormBaseComponent implements OnChanges, OnInit, OnDestroy {
    /** App name to fetch corresponding form and values. */
    @Input()
    appName: string = '';

    /** The application version to use when fetching data */
    @Input()
    appVersion?: number;

    /** Task id to fetch corresponding form and values. */
    @Input()
    formId: string;

    /** ProcessInstanceId id to fetch corresponding form and values. */
    @Input()
    processInstanceId: string;

    /** Underlying form model instance. */
    @Input()
    form: FormModel;

    /** Task id to fetch corresponding form and values. */
    @Input()
    taskId: string;

    /** Custom form values map to be used with the rendered form. */
    @Input()
    data: TaskVariableCloud[];

    /** FormFieldValidator allow to override the form field validators provided. */
    @Input()
    fieldValidators: FormFieldValidator[] = [...FORM_FIELD_VALIDATORS];

    /**
     * The available display configurations for the form
     */
    @Input()
    displayModeConfigurations: FormCloudDisplayModeConfiguration[];

    /** Emitted when the form is submitted with the `Save` or custom outcomes. */
    @Output()
    formSaved = new EventEmitter<FormModel>();

    /** Emitted when the form is submitted with the `Complete` outcome. */
    @Output()
    formCompleted = new EventEmitter<FormModel>();

    /** Emitted when the form is loaded or reloaded. */
    @Output()
    formLoaded = new EventEmitter<FormModel>();

    /** Emitted when form values are refreshed due to a data property change. */
    @Output()
    formDataRefreshed = new EventEmitter<FormModel>();

    /** Emitted when form content is clicked. */
    @Output()
    formContentClicked = new EventEmitter<ContentLinkModel>();

    /** Emitted when a display mode configuration is turned on. */
    @Output()
    displayModeOn = new EventEmitter<FormCloudDisplayModeConfiguration>();

    /** Emitted when a display mode configuration is turned off. */
    @Output()
    displayModeOff = new EventEmitter<FormCloudDisplayModeConfiguration>();

    protected subscriptions: Subscription[] = [];
    nodeId: string;
    formCloudRepresentationJSON: any;

    protected onDestroy$ = new Subject<boolean>();

    readonly id: string;
    displayMode: FormCloudDisplayMode;
    style: string = '';

    protected formCloudService = inject(FormCloudService);
    protected formService = inject(FormService);
    protected visibilityService = inject(WidgetVisibilityService);
    protected dialog = inject(MatDialog);
    protected spinnerService = inject(FormCloudSpinnerService);
    protected displayModeService = inject(DisplayModeService);
    protected changeDetector = inject(ChangeDetectorRef);

    constructor() {
        super();

        this.spinnerService.initSpinnerHandling(this.onDestroy$);

        this.id = uuidGeneration();

        this.formService.formContentClicked.pipe(takeUntil(this.onDestroy$)).subscribe((content) => {
            if (content instanceof UploadWidgetContentLinkModel) {
                this.form.setNodeIdValueForViewersLinkedToUploadWidget(content);
                this.onFormDataRefreshed(this.form);
                this.formService.formDataRefreshed.next(new FormEvent(this.form));
            } else {
                this.formContentClicked.emit(content);
            }
        });

        this.formService.updateFormValuesRequested.pipe(takeUntil(this.onDestroy$)).subscribe((valuesToSetIfNotPresent) => {
            this.form.addValuesNotPresent(valuesToSetIfNotPresent);
            this.onFormDataRefreshed(this.form);
        });

        this.formService.formFieldValueChanged.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
            if (this.disableSaveButton) {
                this.disableSaveButton = false;
            }
        });
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        event.stopPropagation();
    }

    ngOnChanges(changes: SimpleChanges) {
        const appName = changes['appName'];

        if (appName?.currentValue) {
            if (this.taskId) {
                this.getFormByTaskId(appName.currentValue, this.taskId, this.appVersion);
            } else if (this.formId) {
                this.getFormById(appName.currentValue, this.formId, this.appVersion);
            }
            return;
        }

        const formId = changes['formId'];
        if (formId?.currentValue && this.appName) {
            this.getFormById(this.appName, formId.currentValue, this.appVersion);
            return;
        }

        const taskId = changes['taskId'];
        if (taskId?.currentValue && this.appName) {
            this.getFormByTaskId(this.appName, taskId.currentValue, this.appVersion);
            return;
        }

        const data = changes['data'];
        if (data?.currentValue) {
            this.refreshFormData();
            return;
        }

        const formRepresentation = changes['form'];
        if (formRepresentation?.currentValue) {
            this.form = formRepresentation.currentValue;
            this.onFormLoaded(this.form);
            return;
        }
    }

    ngOnInit(): void {
        DisplayModeService.displayMode$
            .pipe(
                filter((change) => change.id === this.id),
                takeUntil(this.onDestroy$)
            )
            .subscribe((displayModeChange) => {
                const oldDisplayMode = this.displayMode;
                this.displayMode = displayModeChange.displayMode;

                const oldDisplayModeConfiguration = this.displayModeService.findConfiguration(oldDisplayMode, this.displayModeConfigurations);
                const newDisplayModeConfiguration = this.displayModeService.findConfiguration(
                    displayModeChange.displayMode,
                    this.displayModeConfigurations
                );

                if (oldDisplayModeConfiguration?.displayMode !== newDisplayModeConfiguration?.displayMode) {
                    if (oldDisplayModeConfiguration) {
                        this.displayModeOff.emit(oldDisplayModeConfiguration);
                    }
                    if (newDisplayModeConfiguration) {
                        this.displayModeOn.emit(newDisplayModeConfiguration);
                    }
                }
            });
    }

    /**
     * Invoked when user clicks form refresh button.
     */
    onRefreshClicked() {
        this.loadForm();
    }

    loadForm() {
        if (this.appName && this.taskId) {
            this.getFormByTaskId(this.appName, this.taskId, this.appVersion);
        } else if (this.appName && this.formId) {
            this.getFormById(this.appName, this.formId, this.appVersion);
        }
    }

    findProcessVariablesByTaskId(appName: string, taskId: string): Observable<TaskVariableCloud[]> {
        return this.formCloudService.getTask(appName, taskId).pipe(
            switchMap((task) => {
                if (this.isAProcessTask(task)) {
                    return this.formCloudService.getTaskVariables(appName, taskId);
                } else {
                    return of([]);
                }
            })
        );
    }

    isAProcessTask(taskRepresentation: TaskDetailsCloudModel): boolean {
        return taskRepresentation.processDefinitionId && taskRepresentation.processDefinitionDeploymentId !== 'null';
    }

    getFormByTaskId(appName: string, taskId: string, version?: number): Promise<FormModel> {
        return new Promise<FormModel>((resolve) => {
            forkJoin(this.formCloudService.getTaskForm(appName, taskId, version), this.formCloudService.getTaskVariables(appName, taskId))
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(
                    (data) => {
                        this.formCloudRepresentationJSON = data[0];

                        this.formCloudRepresentationJSON.processVariables = data[1];
                        this.data = data[1];

                        const parsedForm = this.parseForm(this.formCloudRepresentationJSON);
                        this.visibilityService.refreshVisibility(parsedForm, this.data);
                        parsedForm.validateForm();
                        this.form = parsedForm;
                        this.form.nodeId = '-my-';
                        this.onFormLoaded(this.form);
                        resolve(this.form);
                    },
                    (error) => {
                        this.handleError(error);
                        resolve(null);
                    }
                );
        });
    }

    getFormById(appName: string, formId: string, appVersion?: number) {
        this.formCloudService
            .getForm(appName, formId, appVersion)
            .pipe(
                map((form) => {
                    const flattenForm = { ...form.formRepresentation, ...form.formRepresentation.formDefinition };
                    delete flattenForm.formDefinition;
                    return flattenForm;
                }),
                takeUntil(this.onDestroy$)
            )
            .subscribe(
                (form) => {
                    this.formCloudRepresentationJSON = form;
                    this.formCloudRepresentationJSON.processVariables = this.data || [];
                    const parsedForm = this.parseForm(form);
                    this.visibilityService.refreshVisibility(parsedForm);
                    parsedForm?.validateForm();
                    this.form = parsedForm;
                    this.form.nodeId = '-my-';
                    this.onFormLoaded(this.form);
                },
                (error) => {
                    this.handleError(error);
                }
            );
    }

    saveTaskForm() {
        if (this.form && this.appName && this.taskId) {
            this.formCloudService
                .saveTaskForm(this.appName, this.taskId, this.processInstanceId, `${this.form.id}`, this.form.values)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(
                    () => {
                        this.onTaskSaved(this.form);
                    },
                    (error) => this.onTaskSavedError(error)
                );
            this.displayModeService.onSaveTask(this.id, this.displayMode, this.displayModeConfigurations);
        }
    }

    completeTaskForm(outcome?: string) {
        if (this.form?.confirmMessage?.show === true) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    message: this.form.confirmMessage.message
                },
                minWidth: '450px'
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result === true) {
                    this.completeForm(outcome);
                }
            });
        } else {
            this.completeForm(outcome);
        }
        this.displayModeService.onCompleteTask(this.id, this.displayMode, this.displayModeConfigurations);
    }

    private completeForm(outcome?: string) {
        if (this.form && this.appName && this.taskId) {
            this.formCloudService
                .completeTaskForm(this.appName, this.taskId, this.processInstanceId, `${this.form.id}`, this.form.values, outcome, this.appVersion)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(
                    () => {
                        this.onTaskCompleted(this.form);
                    },
                    (error) => this.onTaskCompletedError(error)
                );
        }
    }

    parseForm(formCloudRepresentationJSON?: any): FormModel | null {
        if (formCloudRepresentationJSON) {
            const formValues: FormValues = {};
            (this.data || []).forEach((variable) => {
                formValues[variable.name] = variable.value;
            });

            const form = new FormModel(formCloudRepresentationJSON, formValues, this.readOnly, this.formService);
            if (!form) {
                form.outcomes = this.getFormDefinitionOutcomes(form);
            }
            if (this.fieldValidators && this.fieldValidators.length > 0) {
                form.fieldValidators = this.fieldValidators;
            }
            return form;
        }

        return null;
    }

    /**
     * Get custom set of outcomes for a Form Definition.
     *
     * @param form Form definition model.
     * @returns list of form outcomes
     */
    getFormDefinitionOutcomes(form: FormModel): FormOutcomeModel[] {
        return [new FormOutcomeModel(form, { id: '$save', name: FormOutcomeModel.SAVE_ACTION, isSystem: true })];
    }

    checkVisibility(field: FormFieldModel) {
        if (field?.form) {
            this.visibilityService.refreshVisibility(field.form);
        }
    }

    private refreshFormData() {
        this.form = this.parseForm(this.formCloudRepresentationJSON);
        if (this.form) {
            this.onFormLoaded(this.form);
            this.onFormDataRefreshed(this.form);
        }
    }

    protected onFormLoaded(form: FormModel) {
        if (form) {
            this.displayModeConfigurations = this.displayModeService.getDisplayModeConfigurations(this.displayModeConfigurations);
            this.displayMode = this.displayModeService.switchToDisplayMode(
                this.id,
                this.form.json.displayMode,
                this.displayMode,
                this.displayModeConfigurations
            );

            this.displayModeOn.emit(this.displayModeService.findConfiguration(this.displayMode, this.displayModeConfigurations));
        }

        this.changeDetector.detectChanges();
        this.formLoaded.emit(form);
    }

    protected onFormDataRefreshed(form: FormModel) {
        this.formDataRefreshed.emit(form);
    }

    protected onTaskSaved(form: FormModel) {
        this.formSaved.emit(form);
    }

    protected onTaskSavedError(error: any) {
        this.handleError(error);
    }

    protected onTaskCompleted(form: FormModel) {
        this.formCompleted.emit(form);
    }

    protected onTaskCompletedError(error: any) {
        this.handleError(error);
    }

    protected onExecuteOutcome(outcome: FormOutcomeModel): boolean {
        const args = new FormOutcomeEvent(outcome);

        if (args.defaultPrevented) {
            return false;
        }

        this.executeOutcome.emit(args);
        return !args.defaultPrevented;
    }

    protected storeFormAsMetadata() {}

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    switchToDisplayMode(newDisplayMode?: string) {
        this.displayModeService.switchToDisplayMode(this.id, FormCloudDisplayMode[newDisplayMode], this.displayMode, this.displayModeConfigurations);
    }

    findDisplayConfiguration(displayMode?: string): FormCloudDisplayModeConfiguration {
        return this.displayModeService.findConfiguration(FormCloudDisplayMode[displayMode], this.displayModeConfigurations);
    }
}
