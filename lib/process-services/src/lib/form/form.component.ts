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

import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
    SimpleChanges,
    OnInit,
    OnDestroy,
    OnChanges,
    inject
} from '@angular/core';
import {
    WidgetVisibilityService,
    FormService,
    FormBaseComponent,
    FormOutcomeModel,
    FormEvent,
    FormErrorEvent,
    FormFieldModel,
    FormModel,
    FormOutcomeEvent,
    FormValues,
    ContentLinkModel,
    TaskProcessVariableModel
} from '@alfresco/adf-core';
import { from, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { EcmModelService } from './services/ecm-model.service';
import { ModelService } from './services/model.service';
import { EditorService } from './services/editor.service';
import { TaskService } from './services/task.service';
import { TaskFormService } from './services/task-form.service';
import { TaskRepresentation } from '@alfresco/js-api';
import { NodesApiService } from '@alfresco/adf-content-services';
import { FormDefinitionModel } from './model/form-definition.model';

@Component({
    selector: 'adf-form',
    templateUrl: './form.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FormComponent extends FormBaseComponent implements OnInit, OnDestroy, OnChanges {
    protected formService = inject(FormService);
    protected taskFormService = inject(TaskFormService);
    protected taskService = inject(TaskService);
    protected editorService = inject(EditorService);
    protected modelService = inject(ModelService);
    protected visibilityService = inject(WidgetVisibilityService);
    protected ecmModelService = inject(EcmModelService);
    protected nodeService = inject(NodesApiService);

    /** Underlying form model instance. */
    @Input()
    form: FormModel;

    /** Task id to fetch corresponding form and values. */
    @Input()
    taskId: string;

    /** Content Services node ID for the form metadata. */
    @Input()
    nodeId: string;

    /** The id of the form definition to load and display with custom values. */
    @Input()
    formId: number;

    /** Name of the form definition to load and display with custom values. */
    @Input()
    formName: string;

    /** Toggle saving of form metadata. */
    @Input()
    saveMetadata: boolean = false;

    /** Custom form values map to be used with the rendered form. */
    @Input()
    data: FormValues;

    /** The form will set a prefixed space for invisible fields. */
    @Input()
    enableFixedSpacedForm: boolean = true;

    /** Emitted when the form is submitted with the `Save` or custom outcomes. */
    @Output()
    formSaved = new EventEmitter<FormModel>();

    /** Emitted when the form is submitted with the `Complete` outcome. */
    @Output()
    formCompleted = new EventEmitter<FormModel>();

    /** Emitted when form content is clicked. */
    @Output()
    formContentClicked = new EventEmitter<ContentLinkModel>();

    /** Emitted when the form is loaded or reloaded. */
    @Output()
    formLoaded = new EventEmitter<FormModel>();

    /** Emitted when form values are refreshed due to a data property change. */
    @Output()
    formDataRefreshed = new EventEmitter<FormModel>();

    debugMode: boolean = false;

    protected onDestroy$ = new Subject<boolean>();

    constructor() {
        super();
    }

    ngOnInit() {
        this.formService.formContentClicked
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(content => this.formContentClicked.emit(content));

        this.formService.validateForm
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(validateFormEvent => {
                if (validateFormEvent.errorsField.length > 0) {
                    this.formError.next(validateFormEvent.errorsField);
                }
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnChanges(changes: SimpleChanges) {
        const taskId = changes['taskId'];
        if (taskId && taskId.currentValue) {
            this.getFormByTaskId(taskId.currentValue);
            return;
        }

        const formId = changes['formId'];
        if (formId && formId.currentValue) {
            this.getFormDefinitionByFormId(formId.currentValue);
            return;
        }

        const formName = changes['formName'];
        if (formName && formName.currentValue) {
            this.getFormDefinitionByFormName(formName.currentValue);
            return;
        }

        const nodeId = changes['nodeId'];
        if (nodeId && nodeId.currentValue) {
            this.loadFormForEcmNode(nodeId.currentValue);
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
        if (this.taskId) {
            this.getFormByTaskId(this.taskId);
            return;
        }

        if (this.formId) {
            this.getFormDefinitionByFormId(this.formId);
            return;
        }

        if (this.formName) {
            this.getFormDefinitionByFormName(this.formName);
            return;
        }
    }

    findProcessVariablesByTaskId(taskId: string): Observable<TaskProcessVariableModel[]> {
        return this.taskService.getTask(taskId).pipe(
            switchMap((task: TaskRepresentation) => {
                if (this.isAProcessTask(task)) {
                    return this.taskFormService.getTaskProcessVariable(taskId);
                } else {
                    return of([]);
                }
            })
        );
    }

    isAProcessTask(taskRepresentation) {
        return taskRepresentation.processDefinitionId && taskRepresentation.processDefinitionDeploymentId !== 'null';
    }

    getFormByTaskId(taskId: string): Promise<FormModel> {
        return new Promise<FormModel>(resolve => {
            this.findProcessVariablesByTaskId(taskId).subscribe((taskProcessVariables) => {
                this.taskFormService
                    .getTaskForm(taskId)
                    .subscribe(
                        (form) => {
                            const parsedForm = this.parseForm(form);
                            this.visibilityService.refreshVisibility(parsedForm, taskProcessVariables);
                            parsedForm.validateForm();
                            this.form = parsedForm;
                            this.onFormLoaded(this.form);
                            resolve(this.form);
                        },
                        (error) => {
                            this.handleError(error);
                            resolve(null);
                        }
                    );
            });
        });
    }

    getFormDefinitionByFormId(formId: number) {
        this.editorService
            .getFormDefinitionById(formId)
            .subscribe(
                (form) => {
                    this.formName = form.name;
                    this.form = this.parseForm(form);
                    this.visibilityService.refreshVisibility(this.form);
                    this.form.validateForm();
                    this.onFormLoaded(this.form);
                },
                (error) => {
                    this.handleError(error);
                }
            );
    }

    getFormDefinitionByFormName(formName: string) {
        this.modelService
            .getFormDefinitionByName(formName)
            .subscribe(
                (id) => {
                    this.editorService.getFormDefinitionById(id).subscribe(
                        (form) => {
                            this.form = this.parseForm(form);
                            this.visibilityService.refreshVisibility(this.form);
                            this.form.validateForm();
                            this.onFormLoaded(this.form);
                        },
                        (error) => {
                            this.handleError(error);
                        }
                    );
                },
                (error) => {
                    this.handleError(error);
                }
            );
    }

    saveTaskForm() {
        if (this.form && this.form.taskId) {
            this.taskFormService
                .saveTaskForm(this.form.taskId, this.form.values)
                .subscribe(
                    () => {
                        this.onTaskSaved(this.form);
                        this.storeFormAsMetadata();
                    },
                    (error) => this.onTaskSavedError(this.form, error)
                );
        }
    }

    completeTaskForm(outcome?: string) {
        if (this.form && this.form.taskId) {
            this.taskFormService
                .completeTaskForm(this.form.taskId, this.form.values, outcome)
                .subscribe(
                    () => {
                        this.onTaskCompleted(this.form);
                        this.storeFormAsMetadata();
                    },
                    (error) => this.onTaskCompletedError(this.form, error)
                );
        }
    }

    handleError(err: any): any {
        this.error.emit(err);
    }

    parseForm(formRepresentationJSON: any): FormModel {
        if (formRepresentationJSON) {
            const form = new FormModel(formRepresentationJSON, this.data, this.readOnly, this.formService, this.enableFixedSpacedForm);
            if (!formRepresentationJSON.fields) {
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
     */
    getFormDefinitionOutcomes(form: FormModel): FormOutcomeModel[] {
        return [
            new FormOutcomeModel(form, {id: '$save', name: FormOutcomeModel.SAVE_ACTION, isSystem: true})
        ];
    }

    checkVisibility(field: FormFieldModel) {
        if (field && field.form) {
            this.visibilityService.refreshVisibility(field.form);
        }
    }

    loadFormFromActiviti(nodeType: string): any {
        this.modelService.searchFrom(nodeType).subscribe(
            (form) => {
                if (!form) {
                    this.createFormFromANode(nodeType).subscribe((formMetadata) => {
                        this.loadFormFromFormId(formMetadata.id);
                    });
                } else {
                    this.loadFormFromFormId(form.id);
                }
            },
            (error) => {
                this.handleError(error);
            }
        );
    }


    /**
     * Creates a Form with a field for each metadata property.
     *
     * @param formName Name of the new form
     * @returns The new form
     */
    createFormFromANode(formName: string): Observable<any> {
        return new Observable((observer) => {
            this.modelService.createForm(formName).subscribe(
                (form) => {
                    this.ecmModelService.searchEcmType(formName, EcmModelService.MODEL_NAME).subscribe(
                        (customType) => {
                            const formDefinitionModel = new FormDefinitionModel(form.id, form.name, form.lastUpdatedByFullName, form.lastUpdated, customType.entry.properties);
                            from(
                                this.editorService.saveForm(form.id, formDefinitionModel)
                            ).subscribe((formData) => {
                                observer.next(formData);
                                observer.complete();
                            }, (err) => this.handleError(err));
                        },
                        (err) => this.handleError(err));
                },
                (err) => this.handleError(err));
        });
    }

    protected storeFormAsMetadata() {
        if (this.saveMetadata) {
            this.ecmModelService.createEcmTypeForActivitiForm(this.formName, this.form).subscribe((type) => {
                    this.nodeService.createNodeMetadata(type.nodeType || type.entry.prefixedName, EcmModelService.MODEL_NAMESPACE, this.form.values, this.path, this.nameNode);
                },
                (error) => {
                    this.handleError(error);
                }
            );
        }
    }

    protected onFormLoaded(form: FormModel) {
        this.formLoaded.emit(form);
        this.formService.formLoaded.next(new FormEvent(form));
    }

    protected onFormDataRefreshed(form: FormModel) {
        this.formDataRefreshed.emit(form);
        this.formService.formDataRefreshed.next(new FormEvent(form));
    }

    protected onTaskSaved(form: FormModel) {
        this.formSaved.emit(form);
        this.formService.taskSaved.next(new FormEvent(form));
    }

    protected onTaskSavedError(form: FormModel, error: any) {
        this.handleError(error);
        this.formService.taskSavedError.next(new FormErrorEvent(form, error));
    }

    protected onTaskCompleted(form: FormModel) {
        this.formCompleted.emit(form);
        this.formService.taskCompleted.next(new FormEvent(form));
    }

    protected onTaskCompletedError(form: FormModel, error: any) {
        this.handleError(error);
        this.formService.taskCompletedError.next(new FormErrorEvent(form, error));
    }

    protected onExecuteOutcome(outcome: FormOutcomeModel): boolean {
        const args = new FormOutcomeEvent(outcome);

        this.formService.executeOutcome.next(args);
        if (args.defaultPrevented) {
            return false;
        }

        this.executeOutcome.emit(args);
        return !args.defaultPrevented;
    }

    private refreshFormData() {
        this.form = this.parseForm(this.form.json);
        this.onFormLoaded(this.form);
        this.onFormDataRefreshed(this.form);
    }

    private loadFormForEcmNode(nodeId: string): void {
        this.nodeService.getNodeMetadata(nodeId).subscribe((data) => {
                this.data = data.metadata;
                this.loadFormFromActiviti(data.nodeType);
            },
            this.handleError);
    }

    private loadFormFromFormId(formId: number) {
        this.formId = formId;
        this.loadForm();
    }
}
