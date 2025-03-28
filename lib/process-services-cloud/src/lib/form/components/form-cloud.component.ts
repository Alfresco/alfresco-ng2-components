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

import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    EventEmitter,
    HostListener,
    Inject,
    inject,
    InjectionToken,
    Input,
    OnChanges,
    OnInit,
    Optional,
    Output,
    SimpleChanges
} from '@angular/core';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import {
    ConfirmDialogComponent,
    ContentLinkModel,
    FormatSpacePipe,
    FormBaseComponent,
    FormEvent,
    FormFieldModel,
    FormFieldValidator,
    FormModel,
    FormOutcomeEvent,
    FormOutcomeModel,
    FormRendererComponent,
    FormService,
    FormValues,
    ToolbarComponent,
    ToolbarDividerComponent,
    UploadWidgetContentLinkModel,
    WidgetVisibilityService
} from '@alfresco/adf-core';
import { FormCloudService } from '../services/form-cloud.service';
import { TaskVariableCloud } from '../models/task-variable-cloud.model';
import { TaskDetailsCloudModel } from '../../task/models/task-details-cloud.model';
import { MatDialog } from '@angular/material/dialog';
import { v4 as uuidGeneration } from 'uuid';
import { FormCloudDisplayMode, FormCloudDisplayModeConfiguration } from '../../services/form-fields.interfaces';
import { FormCloudSpinnerService } from '../services/spinner/form-cloud-spinner.service';
import { DisplayModeService } from '../services/display-mode.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { A11yModule } from '@angular/cdk/a11y';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

export const FORM_CLOUD_FIELD_VALIDATORS_TOKEN = new InjectionToken<FormFieldValidator[]>('FORM_CLOUD_FIELD_VALIDATORS_TOKEN');

@Component({
    selector: 'adf-cloud-form',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        FormatSpacePipe,
        MatButtonModule,
        MatCardModule,
        FormRendererComponent,
        MatIconModule,
        ToolbarDividerComponent,
        ToolbarComponent,
        A11yModule,
        MatCheckboxModule
    ],
    providers: [FormCloudSpinnerService],
    templateUrl: './form-cloud.component.html',
    styleUrls: ['./form-cloud.component.scss']
})
export class FormCloudComponent extends FormBaseComponent implements OnChanges, OnInit {
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

    /** Task id to fetch corresponding form and values. */
    @Input()
    taskId: string;

    /** Custom form values map to be used with the rendered form. */
    @Input()
    data: TaskVariableCloud[];

    /** The available display configurations for the form */
    @Input()
    displayModeConfigurations: FormCloudDisplayModeConfiguration[];

    /** Toggle rendering of the `Open next task` checkbox. */
    @Input()
    showNextTaskCheckbox = false;

    /** Whether the `Open next task` checkbox is checked by default or not. */
    @Input()
    isNextTaskCheckboxChecked = false;

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

    /** Emitted when the `Open next task` checkbox was toggled. */
    @Output()
    nextTaskCheckboxCheckedChanged = new EventEmitter<MatCheckboxChange>();

    protected subscriptions: Subscription[] = [];
    nodeId: string;
    formCloudRepresentationJSON: any;
    fieldValidators: FormFieldValidator[] = [];

    readonly id: string;
    displayMode: string;
    displayConfiguration: FormCloudDisplayModeConfiguration = DisplayModeService.DEFAULT_DISPLAY_MODE_CONFIGURATIONS[0];
    style: string = '';

    protected formCloudService = inject(FormCloudService);
    protected formService = inject(FormService);
    protected visibilityService = inject(WidgetVisibilityService);
    protected dialog = inject(MatDialog);
    protected spinnerService = inject(FormCloudSpinnerService);
    protected displayModeService = inject(DisplayModeService);
    protected changeDetector = inject(ChangeDetectorRef);

    private readonly destroyRef = inject(DestroyRef);

    constructor(@Optional() @Inject(FORM_CLOUD_FIELD_VALIDATORS_TOKEN) injectedFieldValidators?: FormFieldValidator[]) {
        super();
        this.loadInjectedFieldValidators(injectedFieldValidators);
        this.spinnerService.initSpinnerHandling(this.destroyRef);

        this.id = uuidGeneration();

        this.formService.formContentClicked.pipe(takeUntilDestroyed()).subscribe((content) => {
            if (content instanceof UploadWidgetContentLinkModel) {
                this.form.setNodeIdValueForViewersLinkedToUploadWidget(content);
                this.onFormDataRefreshed(this.form);
                this.formService.formDataRefreshed.next(new FormEvent(this.form));
            } else {
                this.formContentClicked.emit(content);
            }
        });

        this.formService.updateFormValuesRequested.pipe(takeUntilDestroyed()).subscribe((valuesToSetIfNotPresent) => {
            this.form.addValuesNotPresent(valuesToSetIfNotPresent);
            this.onFormDataRefreshed(this.form);
        });

        this.formService.formFieldValueChanged.pipe(takeUntilDestroyed()).subscribe(() => {
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
                takeUntilDestroyed(this.destroyRef)
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

                this.displayConfiguration = newDisplayModeConfiguration;
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
                .pipe(takeUntilDestroyed(this.destroyRef))
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
                takeUntilDestroyed(this.destroyRef)
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
                .pipe(takeUntilDestroyed(this.destroyRef))
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
                .pipe(takeUntilDestroyed(this.destroyRef))
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

            const form = new FormModel(formCloudRepresentationJSON, formValues, this.readOnly, this.formService, undefined, this.fieldValidators);
            if (!form) {
                form.outcomes = this.getFormDefinitionOutcomes(form);
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

            this.displayConfiguration = this.displayModeService.findConfiguration(this.displayMode, this.displayModeConfigurations);

            this.displayModeOn.emit(this.displayConfiguration);
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

    switchToDisplayMode(newDisplayMode?: string) {
        this.displayModeService.switchToDisplayMode(this.id, FormCloudDisplayMode[newDisplayMode], this.displayMode, this.displayModeConfigurations);
    }

    findDisplayConfiguration(displayMode?: string): FormCloudDisplayModeConfiguration {
        return this.displayModeService.findConfiguration(FormCloudDisplayMode[displayMode], this.displayModeConfigurations);
    }

    loadInjectedFieldValidators(injectedFieldValidators: FormFieldValidator[]): void {
        if (injectedFieldValidators && injectedFieldValidators?.length) {
            this.fieldValidators = [...this.fieldValidators, ...injectedFieldValidators];
        }
    }

    onNextTaskCheckboxCheckedChanged(event: MatCheckboxChange) {
        this.nextTaskCheckboxCheckedChanged.emit(event);
    }
}
