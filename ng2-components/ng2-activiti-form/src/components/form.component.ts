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
import { AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormErrorEvent, FormEvent } from './../events/index';
import { EcmModelService } from './../services/ecm-model.service';
import { FormService } from './../services/form.service';
import { NodeService } from './../services/node.service';
import { ContentLinkModel } from './widgets/core/content-link.model';
import { FormFieldModel, FormModel, FormOutcomeEvent, FormOutcomeModel, FormValues } from './widgets/core/index';

import { WidgetVisibilityService } from './../services/widget-visibility.service';

declare var componentHandler: any;

@Component({
    selector: 'adf-form, activiti-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewChecked, OnChanges {

    static SAVE_OUTCOME_ID: string = '$save';
    static COMPLETE_OUTCOME_ID: string = '$complete';
    static START_PROCESS_OUTCOME_ID: string = '$startProcess';
    static CUSTOM_OUTCOME_ID: string = '$custom';

    @Input()
    form: FormModel;

    @Input()
    taskId: string;

    @Input()
    nodeId: string;

    @Input()
    formId: string;

    @Input()
    formName: string;

    @Input()
    saveMetadata: boolean = false;

    @Input()
    data: FormValues;

    @Input()
    path: string;

    @Input()
    nameNode: string;

    @Input()
    showTitle: boolean = true;

    @Input()
    showCompleteButton: boolean = true;

    @Input()
    disableCompleteButton: boolean = false;

    @Input()
    showSaveButton: boolean = true;

    @Input()
    showDebugButton: boolean = false;

    @Input()
    readOnly: boolean = false;

    @Input()
    showRefreshButton: boolean = true;

    @Input()
    showValidationIcon: boolean = true;

    @Output()
    formSaved: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formCompleted: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter<ContentLinkModel>();

    @Output()
    formLoaded: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formDataRefreshed: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    executeOutcome: EventEmitter<FormOutcomeEvent> = new EventEmitter<FormOutcomeEvent>();

    @Output()
    onError: EventEmitter<any> = new EventEmitter<any>();

    debugMode: boolean = false;

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
        this.formService.formContentClicked.subscribe((content: ContentLinkModel) => {
            this.formContentClicked.emit(content);
        });
    }

    ngAfterViewChecked() {
        this.setupMaterialComponents();
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
     * @returns {boolean} True if outcome action was executed, otherwise false.
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

    loadFormProcessVariables(taskId: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.formService.getTask(taskId).subscribe(
                task => {
                    if (this.isAProcessTask(task)) {
                        this.visibilityService.getTaskProcessVariable(taskId).subscribe(_ => {
                            resolve(true);
                        });
                    } else {
                        resolve(true);
                    }
                },
                error => {
                    this.handleError(error);
                    resolve(false);
                }
            );
        });
    }

    isAProcessTask(taskRepresentation) {
        return taskRepresentation.processDefinitionId && taskRepresentation.processDefinitionDeploymentId !== 'null';
    }

    setupMaterialComponents(): boolean {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
            return true;
        }
        return false;
    }

    getFormByTaskId(taskId: string): Promise<FormModel> {
        return new Promise<FormModel>((resolve, reject) => {
            this.loadFormProcessVariables(this.taskId).then(_ => {
                this.formService
                    .getTaskForm(taskId)
                    .subscribe(
                    form => {
                        this.form = new FormModel(form, this.data, this.readOnly, this.formService);
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
            return form;
        }
        return null;
    }

    /**
     * Get custom set of outcomes for a Form Definition.
     * @param form Form definition model.
     * @returns {FormOutcomeModel[]} Outcomes for a given form definition.
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
        this.form = new FormModel(this.form.json, this.data, this.readOnly, this.formService);
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
