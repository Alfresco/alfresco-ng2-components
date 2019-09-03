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

import {
    Component, EventEmitter, Input, OnChanges,
    Output, SimpleChanges, OnDestroy
} from '@angular/core';
import { Observable, of, forkJoin, Subject } from 'rxjs';
import { switchMap, takeUntil, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {
    FormBaseComponent,
    FormFieldModel,
    FormOutcomeEvent,
    FormOutcomeModel,
    WidgetVisibilityService,
    FormService,
    NotificationService,
    FormRenderingService,
    FORM_FIELD_VALIDATORS,
    FormFieldValidator,
    FormValues,
    FormModel
} from '@alfresco/adf-core';
import { FormCloudService } from '../services/form-cloud.service';
import { TaskVariableCloud } from '../models/task-variable-cloud.model';
import { DropdownCloudWidgetComponent } from './dropdown-cloud/dropdown-cloud.widget';
import { AttachFileCloudWidgetComponent } from './attach-file-cloud-widget/attach-file-cloud-widget.component';
import { DateCloudWidgetComponent } from './date-cloud/date-cloud.widget';
import { TaskDetailsCloudModel } from '../../task/start-task/models/task-details-cloud.model';

@Component({
    selector: 'adf-cloud-form',
    templateUrl: './form-cloud.component.html'
})
export class FormCloudComponent extends FormBaseComponent implements OnChanges, OnDestroy {

    /** App id to fetch corresponding form and values. */
    @Input()
    appName: string;

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

    @Input()
    fieldValidators: FormFieldValidator[] = [...FORM_FIELD_VALIDATORS];

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

    @Output()
    formContentClicked = new EventEmitter<string>();

    protected subscriptions: Subscription[] = [];
    nodeId: string;
    formCloudRepresentationJSON: any;

    protected onDestroy$ = new Subject<boolean>();

    constructor(protected formCloudService: FormCloudService,
                protected formService: FormService,
                private notificationService: NotificationService,
                private formRenderingService: FormRenderingService,
                protected visibilityService: WidgetVisibilityService) {
        super();

        this.formService.formContentClicked
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((content: any) => {
            this.formContentClicked.emit(content);
        });
        this.formRenderingService.setComponentTypeResolver('upload', () => AttachFileCloudWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('dropdown', () => DropdownCloudWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('date', () => DateCloudWidgetComponent, true);
    }

    ngOnChanges(changes: SimpleChanges) {
        const appName = changes['appName'];
        if (appName && appName.currentValue) {
            if (this.taskId) {
                this.getFormDefinitionWithFolderTask(this.appName, this.taskId, this.processInstanceId);
            } else if (this.formId) {
                this.getFormById(appName.currentValue, this.formId);
            }
            return;
        }

        const formId = changes['formId'];
        if (formId && formId.currentValue && this.appName) {
            this.getFormById(this.appName, formId.currentValue);
            return;
        }

        const taskId = changes['taskId'];
        if (taskId && taskId.currentValue && this.appName) {
            this.getFormByTaskId(this.appName, taskId.currentValue);
            return;
        }

        const data = changes['data'];
        if (data && data.currentValue) {
            this.refreshFormData();
            return;
        }
    }

    /**
     * Invoked when user clicks form refresh button.
     */
    onRefreshClicked() {
        this.loadForm();
    }

    loadForm() {
        if (this.appName && this.taskId) {
            this.getFormByTaskId(this.appName, this.taskId);
        } else if (this.appName && this.formId) {
            this.getFormById(this.appName, this.formId);
        }

    }

    findProcessVariablesByTaskId(appName: string, taskId: string): Observable<TaskVariableCloud[]> {
        return this.formCloudService.getTask(appName, taskId).pipe(
            switchMap(task => {
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

    getFormByTaskId(appName: string, taskId: string): Promise<FormModel> {
        return new Promise<FormModel>(resolve => {
            forkJoin(this.formCloudService.getTaskForm(appName, taskId),
                this.formCloudService.getTaskVariables(appName, taskId))
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(
                    (data) => {
                        this.data = data[1];
                        this.formCloudRepresentationJSON = data[0];
                        const parsedForm = this.parseForm(this.formCloudRepresentationJSON);
                        this.visibilityService.refreshVisibility(<any> parsedForm);
                        parsedForm.validateForm();
                        this.form = parsedForm;
                        this.onFormLoaded(this.form);
                        resolve(this.form);
                    },
                    (error) => {
                        this.handleError(error);
                        // reject(error);
                        resolve(null);
                    }
                );
        });
    }

    getFormById(appName: string, formId: string) {
        this.formCloudService
            .getForm(appName, formId)
            .pipe(
                map((form: any) => {
                    const flattenForm = {...form.formRepresentation, ...form.formRepresentation.formDefinition};
                    delete flattenForm.formDefinition;
                    return flattenForm;
                }),
                takeUntil(this.onDestroy$))
            .subscribe(
                (form) => {
                    const parsedForm = this.parseForm(form);
                    this.visibilityService.refreshVisibility(<any> parsedForm);
                    parsedForm.validateForm();
                    this.form = parsedForm;
                    this.onFormLoaded(this.form);
                },
                (error) => {
                    this.handleError(error);
                }
            );
    }

    getFormDefinitionWithFolderTask(appName: string, taskId: string, processInstanceId: string) {
        this.getFormDefinitionWithFolder(appName, taskId, processInstanceId);
    }

    async getFormDefinitionWithFolder(appName: string, taskId: string, processInstanceId: string) {
        try {
            await this.getFormByTaskId(appName, taskId);

            const hasUploadWidget = (<any> this.form).hasUpload;
            if (hasUploadWidget) {
                try {
                    const processStorageCloudModel = await this.formCloudService.getProcessStorageFolderTask(appName, taskId, processInstanceId).toPromise();
                    this.form.nodeId = processStorageCloudModel.nodeId;
                    this.form.contentHost = processStorageCloudModel.path;
                } catch (error) {
                    this.notificationService.openSnackMessage('The content repo is not configured');
                }
            }

        } catch (error) {
            this.notificationService.openSnackMessage('Form service an error occour');
        }

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
        }
    }

    completeTaskForm(outcome?: string) {
        if (this.form && this.appName && this.taskId) {
            this.formCloudService
                .completeTaskForm(this.appName, this.taskId, this.processInstanceId, `${this.form.id}`, this.form.values, outcome)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(
                    () => {
                        this.onTaskCompleted(this.form);
                    },
                    (error) => this.onTaskCompletedError(error)
                );
        }
    }

    parseForm(formCloudRepresentationJSON: any): FormModel {
        if (formCloudRepresentationJSON) {
            const formValues: FormValues = {};
            (this.data || []).forEach(variable => {
                formValues[variable.name] = variable.value;
            });

            const form = new FormModel(formCloudRepresentationJSON, formValues, this.readOnly);
            if (!form || !form.fields.length) {
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
     * @param form Form definition model.
     */
    getFormDefinitionOutcomes(form: FormModel): FormOutcomeModel[] {
        return [
            new FormOutcomeModel(<any> form, { id: '$save', name: FormOutcomeModel.SAVE_ACTION, isSystem: true })
        ];
    }

    checkVisibility(field: FormFieldModel) {
        if (field && field.form) {
            this.visibilityService.refreshVisibility(field.form);
        }
    }

    private refreshFormData() {
        this.form = this.parseForm(this.formCloudRepresentationJSON);
        this.onFormLoaded(this.form);
        this.onFormDataRefreshed(this.form);
    }

    protected onFormLoaded(form: FormModel) {
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
        if (args.defaultPrevented) {
            return false;
        }

        return true;
    }

    protected storeFormAsMetadata() {
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
