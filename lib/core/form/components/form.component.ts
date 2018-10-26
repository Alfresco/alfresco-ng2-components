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

/* tslint:disable */
import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit,
    Output, SimpleChanges, ViewEncapsulation
} from '@angular/core';
import { FormErrorEvent, FormEvent } from './../events/index';
import { EcmModelService } from './../services/ecm-model.service';
import { FormService } from './../services/form.service';
import { NodeService } from './../services/node.service';
import { ContentLinkModel } from './widgets/core/content-link.model';
import {
    FormFieldModel, FormModel, FormOutcomeEvent, FormOutcomeModel,
    FormValues, FormFieldValidator
} from './widgets/core/index';
import { Observable, of } from 'rxjs';
import { WidgetVisibilityService } from './../services/widget-visibility.service';
import { switchMap } from 'rxjs/operators';
import { ValidateFormEvent } from './../events/validate-form.event';
import { Subscription } from 'rxjs';

@Component({
    selector: 'adf-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit, OnChanges, OnDestroy {

    static SAVE_OUTCOME_ID: string = '$save';
    static COMPLETE_OUTCOME_ID: string = '$complete';
    static START_PROCESS_OUTCOME_ID: string = '$startProcess';
    static CUSTOM_OUTCOME_ID: string = '$custom';
    static COMPLETE_BUTTON_COLOR: string = 'primary';
    static COMPLETE_OUTCOME_NAME: string = 'COMPLETE';

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
    formId: string;

    /** Name of the form definition to load and display with custom values. */
    @Input()
    formName: string;

    /** Toggle saving of form metadata. */
    @Input()
    saveMetadata: boolean = false;

    /** Custom form values map to be used with the rendered form. */
    @Input()
    data: FormValues;

    /** Path of the folder where the metadata will be stored. */
    @Input()
    path: string;

    /** Name to assign to the new node where the metadata are stored. */
    @Input()
    nameNode: string;

    /** Toggle rendering of the form title. */
    @Input()
    showTitle: boolean = true;

    /** Toggle rendering of the `Complete` outcome button. */
    @Input()
    showCompleteButton: boolean = true;

    /** If true then the `Complete` outcome button is shown but it will be disabled. */
    @Input()
    disableCompleteButton: boolean = false;

    /** If true then the `Start Process` outcome button is shown but it will be disabled. */
    @Input()
    disableStartProcessButton: boolean = false;

    /** Toggle rendering of the `Save` outcome button. */
    @Input()
    showSaveButton: boolean = true;

    /** Toggle debug options. */
    @Input()
    showDebugButton: boolean = false;

    /** Toggle readonly state of the form. Forces all form widgets to render as readonly if enabled. */
    @Input()
    readOnly: boolean = false;

    /** Toggle rendering of the `Refresh` button. */
    @Input()
    showRefreshButton: boolean = true;

    /** Toggle rendering of the validation icon next to the form title. */
    @Input()
    showValidationIcon: boolean = true;

    /** Contains a list of form field validator instances. */
    @Input()
    fieldValidators: FormFieldValidator[] = [];

    /** Emitted when the form is submitted with the `Save` or custom outcomes. */
    @Output()
    formSaved: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    /** Emitted when the form is submitted with the `Complete` outcome. */
    @Output()
    formCompleted: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    /** Emitted when form content is clicked. */
    @Output()
    formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter<ContentLinkModel>();

    /** Emitted when the form is loaded or reloaded. */
    @Output()
    formLoaded: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    /** Emitted when form values are refreshed due to a data property change. */
    @Output()
    formDataRefreshed: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    /** Emitted when form validations has validation error.*/
    @Output()
    formError: EventEmitter<FormFieldModel[]> = new EventEmitter<FormFieldModel[]>();

    /** Emitted when any outcome is executed. Default behaviour can be prevented
     * via `event.preventDefault()`.
     */
    @Output()
    executeOutcome: EventEmitter<FormOutcomeEvent> = new EventEmitter<FormOutcomeEvent>();

    /**
     * Emitted when any error occurs.
     * @deprecated in 2.4.0, will be renamed as "error" in 3.x.x
     */
    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    debugMode: boolean = false;

    protected subscriptions: Subscription[] = [];

    constructor(protected formService: FormService,
                protected visibilityService: WidgetVisibilityService,
                private ecmModelService: EcmModelService,
                private nodeService: NodeService) {
    }

    hasForm(): boolean {
        return this.form ? true : false;
    }

    isTitleEnabled(): boolean {
        if (this.showTitle) {
            if (this.form && this.form.taskName) {
                return true;
            }
        }
        return false;
    }

    getColorForOutcome(outcomeName: string): string {
        return outcomeName === FormComponent.COMPLETE_OUTCOME_NAME ? FormComponent.COMPLETE_BUTTON_COLOR : '';
    }

    isOutcomeButtonEnabled(outcome: FormOutcomeModel): boolean {
        if (this.form.readOnly) {
            return false;
        }

        if (outcome) {
            // Make 'Save' button always available
            if (outcome.name === FormOutcomeModel.SAVE_ACTION) {
                return true;
            }
            if (outcome.name === FormOutcomeModel.COMPLETE_ACTION) {
                return this.disableCompleteButton ? false : this.form.isValid;
            }
            if (outcome.name === FormOutcomeModel.START_PROCESS_ACTION) {
                return this.disableStartProcessButton ? false : this.form.isValid;
            }
            return this.form.isValid;
        }
        return false;
    }

    isOutcomeButtonVisible(outcome: FormOutcomeModel, isFormReadOnly: boolean): boolean {
        if (outcome && outcome.name) {
            if (outcome.name === FormOutcomeModel.COMPLETE_ACTION) {
                return this.showCompleteButton;
            }
            if (isFormReadOnly) {
                return outcome.isSelected;
            }
            if (outcome.name === FormOutcomeModel.SAVE_ACTION) {
                return this.showSaveButton;
            }
            if (outcome.name === FormOutcomeModel.START_PROCESS_ACTION) {
                return false;
            }
            return true;
        }
        return false;
    }

    ngOnInit() {
        this.subscriptions.push(
            this.formService.formContentClicked.subscribe((content: ContentLinkModel) => {
                this.formContentClicked.emit(content);
            }),
            this.formService.validateForm.subscribe((validateFormEvent: ValidateFormEvent) => {
                if (validateFormEvent.errorsField.length > 0) {
                    this.formError.next(validateFormEvent.errorsField);
                }
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    ngOnChanges(changes: SimpleChanges) {
        let taskId = changes['taskId'];
        if (taskId && taskId.currentValue) {
            this.getFormByTaskId(taskId.currentValue);
            return;
        }

        let formId = changes['formId'];
        if (formId && formId.currentValue) {
            this.getFormDefinitionByFormId(formId.currentValue);
            return;
        }

        let formName = changes['formName'];
        if (formName && formName.currentValue) {
            this.getFormDefinitionByFormName(formName.currentValue);
            return;
        }

        let nodeId = changes['nodeId'];
        if (nodeId && nodeId.currentValue) {
            this.loadFormForEcmNode(nodeId.currentValue);
            return;
        }

        let data = changes['data'];
        if (data && data.currentValue) {
            this.refreshFormData();
            return;
        }
    }

    /**
     * Invoked when user clicks outcome button.
     * @param outcome Form outcome model
     */
    onOutcomeClicked(outcome: FormOutcomeModel): boolean {
        if (!this.readOnly && outcome && this.form) {

            if (!this.onExecuteOutcome(outcome)) {
                return false;
            }

            if (outcome.isSystem) {
                if (outcome.id === FormComponent.SAVE_OUTCOME_ID) {
                    this.saveTaskForm();
                    return true;
                }

                if (outcome.id === FormComponent.COMPLETE_OUTCOME_ID) {
                    this.completeTaskForm();
                    return true;
                }

                if (outcome.id === FormComponent.START_PROCESS_OUTCOME_ID) {
                    this.completeTaskForm();
                    return true;
                }

                if (outcome.id === FormComponent.CUSTOM_OUTCOME_ID) {
                    this.onTaskSaved(this.form);
                    this.storeFormAsMetadata();
                    return true;
                }
            } else {
                // Note: Activiti is using NAME field rather than ID for outcomes
                if (outcome.name) {
                    this.onTaskSaved(this.form);
                    this.completeTaskForm(outcome.name);
                    return true;
                }
            }
        }

        return false;
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

    findProcessVariablesByTaskId(taskId: string): Observable<any> {
        return this.formService.getTask(taskId).pipe(
            switchMap((task: any) => {
                if (this.isAProcessTask(task)) {
                    return this.visibilityService.getTaskProcessVariable(taskId);
                } else {
                    return of({});
                }
            })
        );
    }

    isAProcessTask(taskRepresentation) {
        return taskRepresentation.processDefinitionId && taskRepresentation.processDefinitionDeploymentId !== 'null';
    }

    getFormByTaskId(taskId: string): Promise<FormModel> {
        return new Promise<FormModel>((resolve, reject) => {
            this.findProcessVariablesByTaskId(taskId).subscribe((processVariables) => {
                this.formService
                    .getTaskForm(taskId)
                    .subscribe(
                        form => {
                            const parsedForm = this.parseForm(form);
                            this.visibilityService.refreshVisibility(parsedForm);
                            parsedForm.validateForm();
                            this.form = parsedForm;
                            this.onFormLoaded(this.form);
                            resolve(this.form);
                        },
                        error => {
                            this.handleError(error);
                            // reject(error);
                            resolve(null);
                        }
                    );
            });
        });
    }

    getFormDefinitionByFormId(formId: string) {
        this.formService
            .getFormDefinitionById(formId)
            .subscribe(
                form => {
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
        this.formService
            .getFormDefinitionByName(formName)
            .subscribe(
                id => {
                    this.formService.getFormDefinitionById(id).subscribe(
                        form => {
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
            this.formService
                .saveTaskForm(this.form.taskId, this.form.values)
                .subscribe(
                    () => {
                        this.onTaskSaved(this.form);
                        this.storeFormAsMetadata();
                    },
                    error => this.onTaskSavedError(this.form, error)
                );
        }
    }

    completeTaskForm(outcome?: string) {
        if (this.form && this.form.taskId) {
            this.formService
                .completeTaskForm(this.form.taskId, this.form.values, outcome)
                .subscribe(
                    () => {
                        this.onTaskCompleted(this.form);
                        this.storeFormAsMetadata();
                    },
                    error => this.onTaskCompletedError(this.form, error)
                );
        }
    }

    handleError(err: any): any {
        this.onError.emit(err);
    }

    parseForm(json: any): FormModel {
        if (json) {
            let form = new FormModel(json, this.data, this.readOnly, this.formService);
            if (!json.fields) {
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
            new FormOutcomeModel(form, { id: '$custom', name: FormOutcomeModel.SAVE_ACTION, isSystem: true })
        ];
    }

    checkVisibility(field: FormFieldModel) {
        if (field && field.form) {
            this.visibilityService.refreshVisibility(field.form);
        }
    }

    private refreshFormData() {
        this.form = this.parseForm(this.form.json);
        this.onFormLoaded(this.form);
        this.onFormDataRefreshed(this.form);
    }

    private loadFormForEcmNode(nodeId: string): void {
        this.nodeService.getNodeMetadata(nodeId).subscribe(data => {
                this.data = data.metadata;
                this.loadFormFromActiviti(data.nodeType);
            },
            this.handleError);
    }

    loadFormFromActiviti(nodeType: string): any {
        this.formService.searchFrom(nodeType).subscribe(
            form => {
                if (!form) {
                    this.formService.createFormFromANode(nodeType).subscribe(formMetadata => {
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

    private loadFormFromFormId(formId: string) {
        this.formId = formId;
        this.loadForm();
    }

    private storeFormAsMetadata() {
        if (this.saveMetadata) {
            this.ecmModelService.createEcmTypeForActivitiForm(this.formName, this.form).subscribe(type => {
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
        let args = new FormOutcomeEvent(outcome);

        this.formService.executeOutcome.next(args);
        if (args.defaultPrevented) {
            return false;
        }

        this.executeOutcome.emit(args);
        if (args.defaultPrevented) {
            return false;
        }

        return true;
    }
}
