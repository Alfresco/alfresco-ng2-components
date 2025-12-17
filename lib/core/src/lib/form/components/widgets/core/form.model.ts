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

import { FormFieldEvent } from '../../../events/form-field.event';
import { ValidateFormFieldEvent } from '../../../events/validate-form-field.event';
import { ValidateFormEvent } from '../../../events/validate-form.event';
import { ContainerModel } from './container.model';
import { ContainerColumnModel } from './container-column.model';
import { FormFieldTypes } from './form-field-types';
import { FormFieldModel } from './form-field.model';
import { FormValues } from './form-values';
import { TabModel } from './tab.model';

import { FormVariableModel } from './form-variable.model';
import { ProcessVariableModel } from './process-variable.model';
import { FormOutcomeModel } from './form-outcome.model';
import { FormFieldValidator, FORM_FIELD_VALIDATORS } from './form-field-validator';
import { FormFieldTemplates } from './form-field-templates';
import { UploadWidgetContentLinkModel } from './upload-widget-content-link.model';
import { FormValidationService } from '../../../services/form-validation-service.interface';
import { ProcessFormModel } from './process-form-model.interface';
import { WidgetTypeEnum, WidgetVisibilityModel } from '../../../models/widget-visibility.model';
import { ThemeModel } from './theme.model';

export interface ConfirmMessage {
    show: boolean;
    message: string;
}
export interface FormRepresentationModel {
    [key: string]: any;

    id?: string | number;
    name?: string;
    taskId?: string;
    taskName?: string;
    processDefinitionId?: string;
    customFieldTemplates?: {
        [key: string]: string;
    };
    selectedOutcome?: string;
    fields?: any[];
    tabs?: any[];
    outcomes?: any[];
    formDefinition?: {
        [key: string]: any;
        fields?: any[];
    };
    displayMode: string;
    theme?: ThemeModel;
}
export class FormModel implements ProcessFormModel {
    static readonly UNSET_TASK_NAME: string = 'Nameless task';
    static readonly SAVE_OUTCOME: string = '$save';
    static readonly COMPLETE_OUTCOME: string = '$complete';
    static readonly START_PROCESS_OUTCOME: string = '$startProcess';
    private readonly GLOBAL_EXPRESSION_REGEX = /\$\{(\s|\S)+?\}/gm;
    private readonly FORM_PREFIX = 'form.';
    private readonly FIELD_PREFIX = 'field.';
    private readonly VARIABLE_PREFIX = 'variable.';
    private readonly PROCESS_VARIABLES_PREFIX = 'process.variable.';

    readonly id: string | number;
    readonly name: string;
    readonly taskId: string;
    readonly confirmMessage: ConfirmMessage;
    readonly taskName = FormModel.UNSET_TASK_NAME;
    readonly processDefinitionId: string;
    readonly enableFixedSpace: boolean;
    readonly displayMode: any;

    fieldsCache: FormFieldModel[] = [];

    json: any;
    nodeId: string;
    values: FormValues = {};
    tabs: TabModel[] = [];
    fields: (ContainerModel | FormFieldModel)[] = [];
    outcomes: FormOutcomeModel[] = [];
    fieldValidators: FormFieldValidator[] = [];
    customFieldTemplates: FormFieldTemplates = {};
    theme?: ThemeModel;
    selectedOutcomeId?: string;
    selectedOutcome: string;

    className: string;
    readOnly = false;
    isValid = true;
    processVariables: ProcessVariableModel[] = [];
    variables: FormVariableModel[] = [];
    enableParentVisibilityCheck: boolean = false;

    constructor(
        json?: any,
        formValues?: FormValues,
        readOnly: boolean = false,
        protected formService?: FormValidationService,
        enableFixedSpace?: boolean,
        injectedFieldValidators?: FormFieldValidator[]
    ) {
        this.readOnly = readOnly;
        this.json = json;

        if (json) {
            this.id = json.id;
            this.name = json.name;
            this.taskId = json.taskId;
            this.taskName = json.taskName || json.name || FormModel.UNSET_TASK_NAME;
            this.processDefinitionId = json.processDefinitionId;
            this.customFieldTemplates = json.customFieldTemplates || {};
            this.selectedOutcome = json.selectedOutcome;
            this.className = json.className || '';
            this.variables = json.variables || json.formDefinition?.variables || [];
            this.processVariables = json.processVariables || [];
            this.enableFixedSpace = enableFixedSpace;
            this.confirmMessage = json.confirmMessage || {};
            this.displayMode = json.displayMode;
            this.theme = json.theme || json.formDefinition?.theme;

            this.tabs = (json.tabs || []).map((tabJson) => new TabModel(this, tabJson));

            this.fields = this.parseRootFields(json);
            this.fieldsCache = this.getFormFields();

            if (formValues) {
                this.loadData(formValues);
            }

            this.parseOutcomes();
        }

        this.loadInjectedFieldValidators(injectedFieldValidators);
        this.validateForm();
    }

    onFormFieldChanged(field: FormFieldModel) {
        this.validateField(field);

        if (this.formService) {
            this.formService.formFieldValueChanged.next(new FormFieldEvent(this, field));
        }
    }

    onRepeatableSectionChanged() {
        this.fieldsCache = this.getFormFields([], true);
    }

    /**
     * Validates entire form and all form fields.
     */
    validateForm(): void {
        const validateFormEvent: any = new ValidateFormEvent(this);

        const errorsField: FormFieldModel[] = this.fieldsCache.filter((field) => {
            if (!FormFieldTypes.isReactiveType(field.type)) {
                return !field.validate();
            } else {
                return field.validationSummary.isActive();
            }
        });

        this.isValid = errorsField.length <= 0;

        if (this.formService) {
            validateFormEvent.isValid = this.isValid;
            validateFormEvent.errorsField = errorsField;
            this.formService.validateForm.next(validateFormEvent);
        }
    }

    /**
     * Validates a specific form field, triggers form validation.
     *
     * @param field Form field to validate.
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
            this.markAsInvalid();
            return;
        }

        if (validateFieldEvent.defaultPrevented) {
            return;
        }

        if (!FormFieldTypes.isReactiveType(field.type) && !field.validate()) {
            this.markAsInvalid();
        }

        this.validateForm();
    }

    // Activiti supports 4 types of root fields: container|group|dynamic-table|section
    private parseRootFields(json: any): (ContainerModel | FormFieldModel)[] {
        let fields = [];

        if (json.fields) {
            fields = json.fields;
        } else if (json.formDefinition?.fields) {
            fields = json.formDefinition.fields;
        }

        const rootElements: (ContainerModel | FormFieldModel)[] = [];
        let currentRootElement;
        for (const field of fields) {
            if (field?.type === FormFieldTypes.DYNAMIC_TABLE) {
                currentRootElement = new FormFieldModel(this, field);
            } else {
                currentRootElement = new ContainerModel(new FormFieldModel(this, field));
            }

            if (field.tab) {
                const tab = this.tabs.find((currentTab) => field.tab === currentTab.id);
                if (tab) {
                    tab.fields.push(currentRootElement);
                }
            }

            rootElements.push(currentRootElement);
        }

        return rootElements;
    }

    // Loads external data and overrides field values
    // Typically used when form definition and form data coming from different sources
    private loadData(formValues: FormValues) {
        for (const field of this.fieldsCache) {
            const variableId = `variables.${field.name}`;

            if (this.canOverrideFieldValueWithProcessValue(field, variableId, formValues)) {
                field.json.value = formValues[variableId] || formValues[field.id];
                field.value = field.parseValue(field.json);
            }
            field.value = this.resolveExpressionString(field.value);
        }
    }

    private canOverrideFieldValueWithProcessValue(field: FormFieldModel, variableId: string, formValues: FormValues): boolean {
        return !FormFieldTypes.isConstantValueType(field.type) && (this.isDefined(formValues[variableId]) || this.isDefined(formValues[field.id]));
    }

    private isDefined(value: string): boolean {
        return value !== undefined && value !== null;
    }

    /**
     * Returns a form variable that matches the identifier.
     *
     * @param identifier The `name` or `id` value.
     * @returns form variable model
     */
    getFormVariable(identifier: string): FormVariableModel {
        if (identifier) {
            return this.variables.find((variable) => variable.name === identifier || variable.id === identifier);
        }
        return undefined;
    }

    /**
     * Returns a value of the form variable that matches the identifier.
     * Provides additional conversion of types (date, boolean).
     *
     * @param identifier The `name` or `id` value
     * @returns form variable value
     */
    getDefaultFormVariableValue(identifier: string): any {
        const variable = this.getFormVariable(identifier);

        if (variable && Object.prototype.hasOwnProperty.call(variable, 'value')) {
            return this.parseValue(variable.type, variable.value);
        }

        return undefined;
    }

    /**
     * Returns a process variable value.
     * When mapping a process variable with a form variable the mapping
     * is already resolved by the rest API with the name of variables.formVariableName
     *
     * @param name Variable name
     * @returns process variable value
     */
    getProcessVariableValue(name: string): any {
        let value;
        if (this.processVariables?.length) {
            const names = [`variables.${name}`, name];

            const processVariable = this.processVariables.find((entry) => names.includes(entry.name));

            if (processVariable) {
                value = this.parseValue(processVariable.type, processVariable.value);
            }
        }

        if (!value) {
            value = this.getDefaultFormVariableValue(name);
        }

        return value;
    }

    protected parseValue(type: string, value: any): any {
        if (type && value) {
            switch (type) {
                case 'date':
                    return value.toString().includes('T') ? value : `${value}T00:00:00.000Z`;
                case 'boolean':
                    return typeof value === 'string' ? JSON.parse(value) : value;
                default:
                    return value;
            }
        }

        return value;
    }

    hasTabs(): boolean {
        return this.tabs && this.tabs.length > 0;
    }

    hasFields(): boolean {
        return this.fields && this.fields.length > 0;
    }

    hasOutcomes(): boolean {
        return this.outcomes && this.outcomes.length > 0;
    }

    getFieldById(fieldId: string): FormFieldModel {
        return this.fieldsCache.find((field) => field.id === fieldId);
    }

    getFormFields(filterTypes?: string[], isDynamic: boolean = false): FormFieldModel[] {
        if (this.fieldsCache?.length && !isDynamic) {
            return this.filterFieldsByType(this.fieldsCache, filterTypes);
        }

        const formFieldModel: FormFieldModel[] = [];
        this.processFields(this.fields, formFieldModel);
        return this.filterFieldsByType(formFieldModel, filterTypes);
    }

    private processFields(fields: (ContainerModel | FormFieldModel)[], formFieldModel: FormFieldModel[]): void {
        fields.forEach((field) => {
            if (this.isRepeatableSectionField(field)) {
                this.handleRepeatableSectionField(field, formFieldModel);
            } else if (this.isContainerField(field)) {
                this.handleContainerField(field, formFieldModel);
            } else if (this.isSectionField(field)) {
                this.handleSectionField(field, formFieldModel);
            } else if (this.isFormField(field)) {
                this.handleSingleField(field, formFieldModel);
            }
        });
    }

    private isContainerField(field: ContainerModel | FormFieldModel): field is ContainerModel {
        return field instanceof ContainerModel;
    }

    private isFormField(field: ContainerModel | FormFieldModel): field is FormFieldModel {
        return field instanceof FormFieldModel;
    }

    private isSectionField(field: ContainerModel | FormFieldModel): field is FormFieldModel {
        return field.type === FormFieldTypes.SECTION;
    }

    private isRepeatableSectionField(field: ContainerModel | FormFieldModel): field is ContainerModel {
        return field.type === FormFieldTypes.REPEATABLE_SECTION;
    }

    private handleSectionField(section: FormFieldModel, formFieldModel: FormFieldModel[]): void {
        formFieldModel.push(section);
        section.columns.forEach((column) => {
            this.processFields(column.fields, formFieldModel);
        });
    }

    private handleRepeatableSectionField(repeatableSection: ContainerModel, formFieldModel: FormFieldModel[]): void {
        formFieldModel.push(repeatableSection.field);
        for (const row of repeatableSection.field.rows) {
            for (const column of row.columns) {
                this.processFields(column.fields, formFieldModel);
            }
        }
    }

    private handleContainerField(container: ContainerModel, formFieldModel: FormFieldModel[]): void {
        formFieldModel.push(container.field);
        container.field.columns.forEach((column) => {
            this.processFields(column.fields, formFieldModel);
        });
    }

    private handleSingleField(field: FormFieldModel, formFieldModel: FormFieldModel[]): void {
        formFieldModel.push(field);
        if (field.fields) {
            this.processFields(Object.values(field.fields), formFieldModel);
        }
    }

    private filterFieldsByType(fields: FormFieldModel[], types?: string[]): FormFieldModel[] {
        if (!types?.length) {
            return fields;
        }

        return fields.filter((field) => types.includes(field?.type));
    }

    markAsInvalid(): void {
        this.isValid = false;
    }

    protected parseOutcomes() {
        if (!this.json.fields) return;

        const saveOutcome = new FormOutcomeModel(this, {
            id: FormModel.SAVE_OUTCOME,
            name: FormOutcomeModel.SAVE_ACTION,
            isSystem: true
        });

        const completeOutcome = new FormOutcomeModel(this, {
            id: FormModel.COMPLETE_OUTCOME,
            name: FormOutcomeModel.COMPLETE_ACTION,
            isSystem: true
        });

        const startProcessOutcome = new FormOutcomeModel(this, {
            id: FormModel.START_PROCESS_OUTCOME,
            name: FormOutcomeModel.START_PROCESS_ACTION,
            isSystem: true
        });

        const customOutcomes = (this.json.outcomes ?? ([] as FormModel[])).map((formModel: FormModel) => new FormOutcomeModel(this, formModel));
        this.outcomes = [saveOutcome].concat(customOutcomes.length > 0 ? customOutcomes : [completeOutcome, startProcessOutcome]);
    }

    addValuesNotPresent(valuesToSetIfNotPresent: FormValues) {
        this.fieldsCache.forEach((field) => {
            if (valuesToSetIfNotPresent[field.id] && (!this.values[field.id] || this.isValidDropDown(field.id))) {
                this.values[field.id] = valuesToSetIfNotPresent[field.id];
                field.json.value = this.values[field.id];
                field.value = field.parseValue(field.json);
            }
        });
    }

    private isValidDropDown(key: string): boolean {
        const field = this.getFieldById(key);
        if (field.type === FormFieldTypes.DROPDOWN) {
            if (field.hasMultipleValues) {
                return Array.isArray(this.values[key]);
            }
            return typeof this.values[key] === 'string' ? this.values[key] === 'empty' : Object.keys(this.values[key]).length === 0;
        }
        return false;
    }

    setNodeIdValueForViewersLinkedToUploadWidget(linkedUploadWidgetContentSelected: UploadWidgetContentLinkModel) {
        const linkedWidgetType = linkedUploadWidgetContentSelected?.options?.linkedWidgetType ?? 'uploadWidget';

        const subscribedViewers = this.fieldsCache.filter(
            (field) => linkedUploadWidgetContentSelected.uploadWidgetId === field.params[linkedWidgetType]
        );

        subscribedViewers.forEach((viewer) => {
            this.values[viewer.id] = linkedUploadWidgetContentSelected.id;
            viewer.json.value = this.values[viewer.id];
            viewer.value = viewer.parseValue(viewer.json);
        });
    }

    changeFieldVisibility(fieldId: string, visibility: boolean): void {
        const visibilityRule: WidgetVisibilityModel = new WidgetVisibilityModel();

        const field = this.getFieldById(fieldId);
        if (field) {
            visibilityRule.operator = visibility ? 'empty' : '!empty';
            visibilityRule.leftType = WidgetTypeEnum.field;
            field.visibilityCondition = visibilityRule;
            field.isVisible = visibility;
        }
    }

    changeFieldDisabled(fieldId: string, disabled: boolean): void {
        const field = this.getFieldById(fieldId);
        if (field) {
            field.readOnly = this.readOnly || disabled;
        }
    }

    changeFieldRequired(fieldId: string, required: boolean): void {
        const field = this.getFieldById(fieldId);
        if (field) {
            field.required = required;
        }
    }

    changeFieldValue(fieldId: string, value: any): void {
        const field = this.getFieldById(fieldId);
        if (field) {
            field.value = value;
        }
        const resolvedValue = typeof value === 'string' ? this.resolveExpressionString(value) : value;
        field.value = resolvedValue;
    }

    changeVariableValue(variableId: string, value: any): void {
        const variable = this.getFormVariable(variableId);
        if (variable) {
            variable.value = value;
        }
    }

    private loadInjectedFieldValidators(injectedFieldValidators: FormFieldValidator[]): void {
        this.fieldValidators = injectedFieldValidators ? [...FORM_FIELD_VALIDATORS, ...injectedFieldValidators] : [...FORM_FIELD_VALIDATORS];
    }

    /**
     * Checks if a field or any of its parent containers/groups/sections is hidden.
     * Returns true if the field should skip validation (field or parent is hidden).
     *
     * Parent visibility is only checked if:
     * - `enableParentVisibilityCheck` is true
     * - `field.checkParentVisibilityForValidation` is true (field opt-in enabled)
     *
     * @param field The form field to check
     * @returns true if field or parent is hidden, false otherwise
     */
    isFieldOrParentHidden(field: FormFieldModel): boolean {
        if (!field) {
            return false;
        }

        if (!field.isVisible) {
            return true;
        }

        if (this.enableParentVisibilityCheck && field.checkParentVisibilityForValidation) {
            return this.hasHiddenParent(field);
        }

        return false;
    }

    /**
     * Checks if the given field has a hidden parent container/group/section.
     *
     * @param targetField The form field to check
     * @returns true if field has a hidden parent, false otherwise
     */
    private hasHiddenParent(targetField: FormFieldModel): boolean {
        if (!targetField || !this.fields || this.fields.length === 0) {
            return false;
        }

        for (const rootElement of this.fields) {
            const parent = this.findParentInElement(rootElement, targetField);
            if (parent && !parent.isVisible) {
                return true;
            }
        }

        return false;
    }

    /**
     * Recursively searches for a field within an element (container/group/section).
     * Returns the parent element if field is found within it, null otherwise.
     *
     * @param element The container/group/section to search in
     * @param targetField The form field to find
     * @returns Parent element if field found, null otherwise
     */
    private findParentInElement(element: ContainerModel | FormFieldModel, targetField: FormFieldModel): ContainerModel | FormFieldModel | null {
        if (!element || !targetField) {
            return null;
        }

        const columns = this.getColumnsFromElement(element);
        if (!columns || columns.length === 0) {
            return null;
        }

        return this.searchFieldsInColumns(columns, element, targetField);
    }

    private getColumnsFromElement(element: ContainerModel | FormFieldModel): ContainerColumnModel[] | null {
        if (element instanceof ContainerModel) {
            return element.field?.columns || null;
        } else if (element instanceof FormFieldModel && element.type === FormFieldTypes.SECTION) {
            return element.columns || null;
        }
        return null;
    }

    private searchFieldsInColumns(
        columns: ContainerColumnModel[],
        parentElement: ContainerModel | FormFieldModel,
        targetField: FormFieldModel
    ): ContainerModel | FormFieldModel | null {
        for (const column of columns) {
            if (!column?.fields || column.fields.length === 0) {
                continue;
            }

            const result = this.searchFieldsInColumn(column.fields, parentElement, targetField);
            if (result) {
                return result;
            }
        }

        return null;
    }

    private searchFieldsInColumn(
        fields: FormFieldModel[],
        parentElement: ContainerModel | FormFieldModel,
        targetField: FormFieldModel
    ): ContainerModel | FormFieldModel | null {
        for (const field of fields) {
            if (!field) {
                continue;
            }

            if (field.id === targetField.id) {
                return parentElement;
            }

            if (field.type === FormFieldTypes.SECTION) {
                const nestedParent = this.findParentInElement(field, targetField);
                if (nestedParent) {
                    return !parentElement.isVisible ? parentElement : nestedParent;
                }
            }
        }

        return null;
    }

    private resolveExpression(expression: any): any {
        if (expression === undefined || expression === null) {
            return expression;
        }

        // ensure we operate on a trimmed string
        let formValue = String(expression).trim();

        // unwrap ${...} if present so prefixes can be properly detected
        if (formValue.startsWith('${') && formValue.endsWith('}')) {
            formValue = formValue.slice(2, -1).trim();
        }

        if (formValue.startsWith(this.FIELD_PREFIX)) {
            const field = formValue.slice(this.FIELD_PREFIX.length);
            return this.getFieldById(field)?.value;
        } else if (formValue.startsWith(this.VARIABLE_PREFIX)) {
            const variable = formValue.slice(this.VARIABLE_PREFIX.length);
            return this.getProcessVariableValue(variable);
        } else if (formValue.startsWith(this.FORM_PREFIX)) {
            const formVariable = formValue.slice(this.FORM_PREFIX.length);
            return this.getDefaultFormVariableValue(formVariable);
        } else if (formValue.startsWith(this.PROCESS_VARIABLES_PREFIX)) {
            const processVariable = formValue.slice(this.PROCESS_VARIABLES_PREFIX.length);
            return this.getProcessVariableValue(processVariable);
        } else {
            return formValue;
        }
    }

    private resolveExpressionString(expression: string): any {
        let result = expression || '';

        const matches = result.match(this.GLOBAL_EXPRESSION_REGEX);

        if (matches) {
            for (const match of matches) {
                let expressionResult = this.resolveExpression(match);
                // avoid embedding the literal "null" or "undefined" into strings
                if (expressionResult === null || expressionResult === undefined) {
                    expressionResult = '';
                } else if (typeof expressionResult !== 'string') {
                    expressionResult = JSON.stringify(expressionResult);
                }
                result = result.replace(match, expressionResult);
            }
        }

        try {
            result = JSON.parse(result);
        } catch {
            return null;
        }

        return result;
    }
}
