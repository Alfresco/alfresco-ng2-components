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

import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormFieldModel, FormFieldValidator, FormModel, FormOutcomeEvent, FormOutcomeModel } from './widgets';
import { isOutcomeButtonVisible } from './helpers/buttons-visibility';

@Directive({
    standalone: true
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class FormBaseComponent {
    protected _form: FormModel;

    static SAVE_OUTCOME_ID: string = '$save';
    static COMPLETE_OUTCOME_ID: string = '$complete';
    static START_PROCESS_OUTCOME_ID: string = '$startProcess';
    static CUSTOM_OUTCOME_ID: string = '$custom';
    static COMPLETE_BUTTON_COLOR: ThemePalette = 'primary';
    static COMPLETE_OUTCOME_NAME: string = 'COMPLETE';

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

    /** If true then the `Save` outcome button is shown but will be disabled. */
    @Input()
    disableSaveButton: boolean = false;

    /** If true then the `Start Process` outcome button is shown but it will be disabled. */
    @Input()
    disableStartProcessButton: boolean = false;

    /** Toggle rendering of the `Save` outcome button. */
    @Input()
    showSaveButton: boolean = true;

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
    fieldValidators: FormFieldValidator[];

    /** Emitted when the supplied form values have a validation error. */
    @Output()
    formError = new EventEmitter<FormFieldModel[]>();

    /**
     * Emitted when any outcome is executed. Default behaviour can be prevented
     * via `event.preventDefault()`.
     */
    @Output()
    executeOutcome = new EventEmitter<FormOutcomeEvent>();

    /**
     * Emitted when any error occurs.
     */
    @Output()
    error = new EventEmitter<any>();

    /**
     * Custom style that is backed by the form.theme.
     */
    formStyle: string = '';

    get form(): FormModel {
        return this._form;
    }

    /** Underlying form model instance. */
    @Input()
    set form(form: FormModel) {
        this._form = form;

        if (form) {
            const theme = form.theme?.form;
            this.formStyle = theme ? this.flattenStyles(theme) : '';
        } else {
            this.formStyle = '';
        }
    }

    getParsedFormDefinition(): FormBaseComponent {
        return this;
    }

    hasForm(): boolean {
        return !!this.form;
    }

    isTitleEnabled(): boolean {
        let titleEnabled = false;
        if (this.showTitle && this.form) {
            titleEnabled = true;
        }
        return titleEnabled;
    }

    getColorForOutcome(outcomeName: string): ThemePalette {
        return outcomeName === FormBaseComponent.COMPLETE_OUTCOME_NAME ? FormBaseComponent.COMPLETE_BUTTON_COLOR : null;
    }

    isOutcomeButtonEnabled(outcome?: FormOutcomeModel): boolean {
        if (this.form.readOnly) {
            return false;
        }

        if (outcome) {
            if (outcome.skipValidation) {
                return true;
            }
            if (outcome.name === FormOutcomeModel.SAVE_ACTION) {
                return !this.disableSaveButton;
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
        return isOutcomeButtonVisible(outcome, isFormReadOnly, this.showCompleteButton, this.showSaveButton);
    }

    /**
     * Invoked when user clicks outcome button.
     *
     * @param outcome Form outcome model
     * @returns `true` if outcome button was clicked, otherwise `false`
     */
    onOutcomeClicked(outcome: FormOutcomeModel): boolean {
        if (!this.readOnly && outcome && this.form) {
            if (!this.onExecuteOutcome(outcome)) {
                return false;
            }

            if (outcome.isSystem) {
                if (outcome.id === FormBaseComponent.SAVE_OUTCOME_ID) {
                    this.disableSaveButton = true;
                    this.saveTaskForm();
                    return true;
                }

                if (outcome.id === FormBaseComponent.COMPLETE_OUTCOME_ID) {
                    this.disableSaveButton = true;
                    this.disableCompleteButton = true;
                    this.completeTaskForm();
                    return true;
                }

                if (outcome.id === FormBaseComponent.START_PROCESS_OUTCOME_ID) {
                    this.completeTaskForm();
                    return true;
                }

                if (outcome.id === FormBaseComponent.CUSTOM_OUTCOME_ID) {
                    this.onTaskSaved(this.form);
                    this.storeFormAsMetadata();
                    return true;
                }
            } else {
                // Note: Activiti is using NAME field rather than ID for outcomes
                if (outcome.name) {
                    this.completeTaskForm(outcome.name);
                    return true;
                }
            }
        }

        return false;
    }

    handleError(err: any): any {
        this.disableSaveButton = false;
        this.disableCompleteButton = false;
        this.error.emit(err);
    }

    abstract onRefreshClicked(): void;

    abstract saveTaskForm(): void;

    abstract completeTaskForm(outcome?: string): void;

    protected abstract onTaskSaved(form: FormModel): void;

    protected abstract storeFormAsMetadata(): void;

    protected abstract onExecuteOutcome(outcome: FormOutcomeModel): boolean;

    private flattenStyles(styles: { [key: string]: string }): string {
        return Object.entries(styles)
            .map(([key, value]) => `${key}: ${value}`)
            .join(';');
    }
}
