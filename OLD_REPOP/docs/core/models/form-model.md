---
Title: Form model
Added: 2025-02-19
Status: Active
Last reviewed: 2025-02-19
---

# [Form model](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts "Defined in form.model.ts")

Contains the value and metadata for a form.

## Properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
|UNSET_TASK_NAME| string | 'Nameless task'|static property|
|SAVE_OUTCOME| string | '$save'|static property|
|COMPLETE_OUTCOME| string | '$complete'|static property|
|START_PROCESS_OUTCOME| string | '$startProcess'|static property|
|id| string | number||id of form|
|name| string||form name|
|taskId| string||task id|
|confirmMessage| ConfirmMessage||confirmation message|
|taskName |string| FormModel.UNSET_TASK_NAME|task name|
|processDefinitionId| string||Process definition id |
|selectedOutcome| string||selected outcome|
|enableFixedSpace| boolean||should fixed space be enabled|
|displayMode| any||which mode should be displayed|
|fieldsCache| FormFieldModel[] | []|cache for fields|
|json| any||json with form configuration|
|nodeId| string||id of node|
|values| FormValues | {}|form values|
|tabs| TabModel[] | []|tabs|
|fields| (ContainerModel | FormFieldModel)[] | []|form fields|
|outcomes| FormOutcomeModel[] | []|set of outcomes|
|fieldValidators| FormFieldValidator[] | []|validators for fields|
|customFieldTemplates| FormFieldTemplates | {}|custom templates|
|theme?| ThemeModel||theme|
|className| string||class name|
|readOnly | false||is form read only|
|isValid | true||is form valid|
|processVariables| ProcessVariableModel[] | []|process variables|
|variables| FormVariableModel[] | []|variables|

## Methods

-   `onFormFieldChanged(field: FormFieldModel)`
    Triggered when field is changed. Validates field and calls FormService
-   `validateForm(): void`
    Validates entire form and all form fields.
-   `validateField(field: FormFieldModel): void`
    Validates a specific form field, triggers form validation.
-   `parseRootFields(json: any): (ContainerModel | FormFieldModel)[]`
    Activiti supports 3 types of root fields: container|group|dynamic-table
-   `loadData(formValues: FormValues)`
    Loads external data and overrides field values. Typically used when form definition and form data coming from different sources
-   `canOverrideFieldValueWithProcessValue(field: FormFieldModel, variableId: string, formValues: FormValues): boolean`
    Checks if field value can be overriden with process value
-   `isDefined(value: string): boolean`
    Check if variable is defined
-   `getFormVariable(identifier: string): FormVariableModel`
    Returns a form variable that matches the identifier.
-   `getDefaultFormVariableValue(identifier: string): any`
    Returns a value of the form variable that matches the identifier. Provides additional conversion of types (date, boolean).
-   `getProcessVariableValue(name: string): any`
    Returns a process variable value. When mapping a process variable with a form variable the mapping is already resolved by the rest API with the name of variables.formVariableName.
-   `parseValue(type: string, value: any): any`
    Parse value data and boolean
-   `hasTabs(): boolean`
    Check if form has tabs
-   `hasFields(): boolean`
    Check if there are any fields
-   `hasOutcomes(): boolean`
    Check if form has outcomes
-   `getFieldById(fieldId: string): FormFieldModel`
    Find field by id
-   `getFormFields(filterTypes?: string[]): FormFieldModel[]`
    Get form fields
-   `processFields(fields: (ContainerModel | FormFieldModel)[], formFieldModel: FormFieldModel[]): void`
    Process fields
-   `isContainerField(field: ContainerModel | FormFieldModel): field is ContainerModel`
    Check if it is container
-   `isSectionField(field: ContainerModel | FormFieldModel): field is FormFieldModel`
    Check if it is section
-   `handleSectionField(section: FormFieldModel, formFieldModel: FormFieldModel[]): void`
    Handle section
-   `handleContainerField(container: ContainerModel, formFieldModel: FormFieldModel[]): void`
    Handle container
-   `handleSingleField(field: FormFieldModel, formFieldModel: FormFieldModel[]): void`
    Handle single field
-   `filterFieldsByType(fields: FormFieldModel[], types?: string[]): FormFieldModel[]`
    Filter fields based on type
-   `markAsInvalid(): void`
    Set form as invalid
-   `parseOutcomes()`
    Parse outcomes from json
-   `addValuesNotPresent(valuesToSetIfNotPresent: FormValues)`
    Set values if they are not present
-   `isValidDropDown(key: string): boolean`
    Validates dropdown
-   `setNodeIdValueForViewersLinkedToUploadWidget(linkedUploadWidgetContentSelected: UploadWidgetContentLinkModel)`
    Set node id
-   `changeFieldVisibility(fieldId: string, visibility: boolean): void`
    Changes field visibility
-   `changeFieldDisabled(fieldId: string, disabled: boolean): void`
    Changes disabled status of field
-   `changeFieldRequired(fieldId: string, required: boolean): void`
    Changes required status of field
-   `changeFieldValue(fieldId: string, value: any): void`
    Changes field value
-   `changeVariableValue(variableId: string, value: any): void`
    Changes variable value
-   `loadInjectedFieldValidators(injectedFieldValidators: FormFieldValidator[]): void`
    Checks it there are any injectedValidators and adds them to the array of field validators.
