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
    Output, SimpleChanges, ViewEncapsulation
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { WidgetVisibilityService } from '../../../../../core/form/services/widget-visibility.service';
import { FormValues, FormFieldValidator, FormFieldModel, FormOutcomeEvent, FormOutcomeModel } from '@alfresco/adf-core';
import { FormCloudService } from '../services/form-cloud.services';
import { FormCloudModel } from '../models/form-cloud.model';

@Component({
    selector: 'adf-cloud-form',
    templateUrl: './form-cloud.component.html',
    styleUrls: ['./form-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormCloudComponent implements OnChanges {

    static SAVE_OUTCOME_ID: string = '$save';
    static COMPLETE_OUTCOME_ID: string = '$complete';
    static START_PROCESS_OUTCOME_ID: string = '$startProcess';
    static CUSTOM_OUTCOME_ID: string = '$custom';
    static COMPLETE_BUTTON_COLOR: string = 'primary';
    static COMPLETE_OUTCOME_NAME: string = 'COMPLETE';

    /** App id to fetch corresponding form and values. */
    @Input()
    appName: string;

    /** Task id to fetch corresponding form and values. */
    @Input()
    formId: string;

    /** Task id to fetch corresponding form and values. */
    @Input()
    taskId: string;

    /** Toggle saving of form metadata. */
    @Input()
    saveMetadata: boolean = false;

    /** Custom form values map to be used with the rendered form. */
    @Input()
    data: FormValues;

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
    formSaved: EventEmitter<FormCloudModel> = new EventEmitter<FormCloudModel>();

    /** Emitted when the form is submitted with the `Complete` outcome. */
    @Output()
    formCompleted: EventEmitter<FormCloudModel> = new EventEmitter<FormCloudModel>();

    /** Emitted when the form is loaded or reloaded. */
    @Output()
    formLoaded: EventEmitter<FormCloudModel> = new EventEmitter<FormCloudModel>();

    /** Emitted when form values are refreshed due to a data property change. */
    @Output()
    formDataRefreshed: EventEmitter<FormCloudModel> = new EventEmitter<FormCloudModel>();

    /** Emitted when the supplied form values have a validation error.*/
    @Output()
    formError: EventEmitter<FormFieldModel[]> = new EventEmitter<FormFieldModel[]>();

    /** Emitted when any outcome is executed. Default behaviour can be prevented
     * via `event.preventDefault()`.
     */
    @Output()
    executeOutcome: EventEmitter<FormOutcomeEvent> = new EventEmitter<FormOutcomeEvent>();

    /**
     * Emitted when any error occurs.
     */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    debugMode: boolean = false;

    form: FormCloudModel;

    protected subscriptions: Subscription[] = [];

    constructor(protected formService: FormCloudService,
                protected visibilityService: WidgetVisibilityService) {
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
        return outcomeName === FormCloudComponent.COMPLETE_OUTCOME_NAME ? FormCloudComponent.COMPLETE_BUTTON_COLOR : '';
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

    ngOnChanges(changes: SimpleChanges) {
        let appName = changes['appName'];
        if (appName && appName.currentValue) {
            if (this.taskId) {
                this.getFormByTaskId(appName.currentValue, this.taskId);
            } else if (this.formId) {
                this.getForm(appName.currentValue, this.formId);
            }
            return;
        }
        
        let taskId = changes['taskId'];
        if (taskId && taskId.currentValue && this.appName) {
            this.getFormByTaskId(this.appName, taskId.currentValue);
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
                if (outcome.id === FormCloudComponent.SAVE_OUTCOME_ID) {
                    this.saveTaskForm();
                    return true;
                }

                if (outcome.id === FormCloudComponent.COMPLETE_OUTCOME_ID) {
                    this.completeTaskForm();
                    return true;
                }

                if (outcome.id === FormCloudComponent.START_PROCESS_OUTCOME_ID) {
                    this.completeTaskForm();
                    return true;
                }

                if (outcome.id === FormCloudComponent.CUSTOM_OUTCOME_ID) {
                    this.saveTaskForm();
                    this.onTaskSaved(this.form);
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
        if (this.appName && this.taskId) {
            this.getFormByTaskId(this.appName, this.taskId);
        } else if (this.appName && this.taskId) {
            this.getForm(this.appName, this.formId);
        } 

    }

    findProcessVariablesByTaskId(appName:string, taskId: string): Observable<any> {
        return this.formService.getTask(appName, taskId).pipe(
            switchMap((task: any) => {
                return of({});
            })
        );
    }

    isAProcessTask(taskRepresentation) {
        return taskRepresentation.processDefinitionId && taskRepresentation.processDefinitionDeploymentId !== 'null';
    }

    getFormByTaskId(appName, taskId: string): Promise<FormCloudModel> {
        return new Promise<FormCloudModel>((resolve, reject) => {
            this.findProcessVariablesByTaskId(appName, taskId).subscribe((processVariables) => {
                this.formService
                    .getTaskForm(appName, taskId)
                    .subscribe(
                        form => {
                            const parsedForm = this.parseForm(form);
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

    getForm(appName: string, formId: string) {
            this.formService
                .getForm(appName, formId)
                .subscribe(
                    form => {
                        const parsedForm = this.parseForm(form);
                        parsedForm.validateForm();
                        this.form = parsedForm;
                    },
                    error => {
                        this.handleError(error);
                    }
                );
    }



    saveTaskForm() {
        if (this.form && this.taskId) {
            this.formService
                .saveTaskForm(this.appName, this.taskId, this.form.id, this.form.values)
                .subscribe(
                    () => {
                        this.onTaskSaved(this.form);
                    },
                    error => this.onTaskSavedError(this.form, error)
                );
        }
    }

    completeTaskForm(outcome?: string) {
        if (this.form && this.taskId) {
            this.formService
                .completeTaskForm(this.appName, this.taskId, this.form.id, this.form.values, outcome)
                .subscribe(
                    () => {
                        this.onTaskCompleted(this.form);
                    },
                    error => this.onTaskCompletedError(this.form, error)
                );
        }
    }

    handleError(err: any): any {
        this.error.emit(err);
    }

    parseForm(json: any): FormCloudModel {
        if (json) {
            let form = new FormCloudModel(json, this.data, this.readOnly);
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
    getFormDefinitionOutcomes(form: FormCloudModel): FormOutcomeModel[] {
        return [
            new FormOutcomeModel(<any>form, { id: '$custom', name: FormOutcomeModel.SAVE_ACTION, isSystem: true })
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



    protected onFormLoaded(form: FormCloudModel) {
        this.formLoaded.emit(form);
    }

    protected onFormDataRefreshed(form: FormCloudModel) {
        this.formDataRefreshed.emit(form);
    }

    protected onTaskSaved(form: FormCloudModel) {
        this.formSaved.emit(form);
    }

    protected onTaskSavedError(form: FormCloudModel, error: any) {
        this.handleError(error);
    }

    protected onTaskCompleted(form: FormCloudModel) {
        this.formCompleted.emit(form);
    }

    protected onTaskCompletedError(form: FormCloudModel, error: any) {
        this.handleError(error);
    }

    protected onExecuteOutcome(outcome: FormOutcomeModel): boolean {
        let args = new FormOutcomeEvent(outcome);

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
