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

/* tslint:disable:component-selector  */

import { FormFieldEvent } from './../../../events/form-field.event';
import { ValidateFormFieldEvent } from './../../../events/validate-form-field.event';
import { ValidateFormEvent } from './../../../events/validate-form.event';
import { FormService } from './../../../services/form.service';
import { ContainerModel } from './container.model';
import { FormFieldTemplates } from './form-field-templates';
import { FormFieldTypes } from './form-field-types';
import { FormFieldModel } from './form-field.model';
import { FormOutcomeModel } from './form-outcome.model';
import { FormValues } from './form-values';
import { FormWidgetModel, FormWidgetModelCache } from './form-widget.model';
import { TabModel } from './tab.model';

import {
    FORM_FIELD_VALIDATORS,
    FormFieldValidator
} from './form-field-validator';
import { FormBaseModel } from './form-base.model';

export class FormModel extends FormBaseModel {

    readonly id: number;
    readonly name: string;
    readonly taskId: string;
    readonly taskName: string = FormModel.UNSET_TASK_NAME;
    processDefinitionId: string;
    private _isValid: boolean = true;

    get isValid(): boolean {
        return this._isValid;
    }

    customFieldTemplates: FormFieldTemplates = {};
    fieldValidators: FormFieldValidator[] = [...FORM_FIELD_VALIDATORS];
    readonly selectedOutcome: string;

    processVariables: any;

    constructor(json?: any, formValues?: FormValues, readOnly: boolean = false, protected formService?: FormService) {
        super();
        this.readOnly = readOnly;

        if (json) {
            this.json = json;

            this.id = json.id;
            this.name = json.name;
            this.taskId = json.taskId;
            this.taskName = json.taskName || json.name || FormModel.UNSET_TASK_NAME;
            this.processDefinitionId = json.processDefinitionId;
            this.customFieldTemplates = json.customFieldTemplates || {};
            this.selectedOutcome = json.selectedOutcome || {};
            this.className = json.className || '';

            const tabCache: FormWidgetModelCache<TabModel> = {};

            this.processVariables = json.processVariables;

            this.tabs = (json.tabs || []).map((t) => {
                const model = new TabModel(this, t);
                tabCache[model.id] = model;
                return model;
            });

            this.fields = this.parseRootFields(json);

            if (formValues) {
                this.loadData(formValues);
            }

            for (let i = 0; i < this.fields.length; i++) {
                const field = this.fields[i];
                if (field.tab) {
                    const tab = tabCache[field.tab];
                    if (tab) {
                        tab.fields.push(field);
                    }
                }
            }

            if (json.fields) {
                const saveOutcome = new FormOutcomeModel(this, {
                    id: FormModel.SAVE_OUTCOME,
                    name: 'SAVE',
                    isSystem: true
                });
                const completeOutcome = new FormOutcomeModel(this, {
                    id: FormModel.COMPLETE_OUTCOME,
                    name: 'COMPLETE',
                    isSystem: true
                });
                const startProcessOutcome = new FormOutcomeModel(this, {
                    id: FormModel.START_PROCESS_OUTCOME,
                    name: 'START PROCESS',
                    isSystem: true
                });

                const customOutcomes = (json.outcomes || []).map((obj) => new FormOutcomeModel(this, obj));

                this.outcomes = [saveOutcome].concat(
                    customOutcomes.length > 0 ? customOutcomes : [completeOutcome, startProcessOutcome]
                );
            }
        }

        this.validateForm();
    }

    onFormFieldChanged(field: FormFieldModel) {
        this.validateField(field);
        if (this.formService) {
            this.formService.formFieldValueChanged.next(new FormFieldEvent(this, field));
        }
    }

    markAsInvalid() {
        this._isValid = false;
    }

    /**
     * Validates entire form and all form fields.
     *
     * @memberof FormModel
     */
    validateForm(): void {
        const validateFormEvent: any = new ValidateFormEvent(this);

        const errorsField: FormFieldModel[] = [];

        const fields = this.getFormFields();
        for (let i = 0; i < fields.length; i++) {
            if (!fields[i].validate()) {
                errorsField.push(fields[i]);
            }
        }

        this._isValid = errorsField.length > 0 ? false : true;

        if (this.formService) {
            validateFormEvent.isValid = this._isValid;
            validateFormEvent.errorsField = errorsField;
            this.formService.validateForm.next(validateFormEvent);
        }

    }

    /**
     * Validates a specific form field, triggers form validation.
     *
     * @param field Form field to validate.
     * @memberof FormModel
     */
    validateField(field: FormFieldModel): void {
        if (!field) {
            return;
        }

        const validateFieldEvent = new ValidateFormFieldEvent(this, field);

        if (this.formService) {
            this.formService.validateFormField.next(validateFieldEvent);
        }

        if (!validateFieldEvent.isValid) {
            this._isValid = false;
            return;
        }

        if (validateFieldEvent.defaultPrevented) {
            return;
        }

        if (!field.validate()) {
            this._isValid = false;
        }

        this.validateForm();
    }

    // Activiti supports 3 types of root fields: container|group|dynamic-table
    private parseRootFields(json: any): FormWidgetModel[] {
        let fields = [];

        if (json.fields) {
            fields = json.fields;
        } else if (json.formDefinition && json.formDefinition.fields) {
            fields = json.formDefinition.fields;
        }

        const formWidgetModel: FormWidgetModel[] = [];

        for (const field of fields) {
            if (field.type === FormFieldTypes.DISPLAY_VALUE) {
                // workaround for dynamic table on a completed/readonly form
                if (field.params) {
                    const originalField = field.params['field'];
                    if (originalField.type === FormFieldTypes.DYNAMIC_TABLE) {
                        formWidgetModel.push(new ContainerModel(new FormFieldModel(this, field)));
                    }
                }
            } else {
                formWidgetModel.push(new ContainerModel(new FormFieldModel(this, field)));
            }
        }

        return formWidgetModel;
    }

    // Loads external data and overrides field values
    // Typically used when form definition and form data coming from different sources
    private loadData(formValues: FormValues) {
        for (const field of this.getFormFields()) {
            if (formValues[field.id]) {
                field.json.value = formValues[field.id];
                field.value = field.parseValue(field.json);
            }
        }
    }
}
