# Form service

Implements Process Services form methods

## Basic Usage

```ts
import { FormService, FormEvent, FormFieldEvent } from '@alfresco/adf-core';

@Component(...)
class MyComponent {

    constructor(formService: FormService) {

        formService.formLoaded.subscribe(
            (e: FormEvent) => {
                console.log(`Form loaded: ${e.form.id}`);
            }
        );

        formService.formFieldValueChanged.subscribe(
            (e: FormFieldEvent) => {
                console.log(`Field value changed. Form: ${e.form.id}, Field: ${e.field.id}, Value: ${e.field.value}`);
            }
        );

    }

}
```

### Events

| Name | Args Type | Description |
| ---- | --------- | ----------- |
| formLoaded | FormEvent | Raised when form has been loaded or reloaded |
| formFieldValueChanged | FormFieldEvent | Raised when input values change |
| taskCompleted | FormEvent | Raised when a task is completed successfully |
| taskCompletedError | FormErrorEvent | Raised when a task is completed unsuccessfully |
| taskSaved | FormEvent | Raised when a task is saved successfully |
| taskSavedError | FormErrorEvent | Raised when a task is saved unsuccessfully |
| executeOutcome | FormOutcomeEvent | Raised when a form outcome is executed |
| formEvents | Event | You can subscribe to this event to listen : ( click, blur, change, focus, focusin, focusout, input, invalid, select) of any elements in the form , see doc below |
| validateForm | ValidateFormEvent | Raised each time a form is validated. You can use it to provide custom validation or prevent default behaviour. |
| validateFormField | ValidateFormFieldEvent | Raised each time a form field is validated. You can use it to provide custom validation or prevent default behaviour. |

### Methods

| Name | Params | Returns | Description |
| ---- | ------ | ------- | ----------- |
| createFormFromANode | (formName: string) | Observable\\&lt;any> | Create a Form with a fields for each metadata properties |
| createForm | (formName: string) | Observable\\&lt;any> | Create a Form |
| addFieldsToAForm | (formId: string, formModel: FormDefinitionModel) | Observable\\&lt;any> | Add Fileds to A form |
| searchFrom | (name: string) | Observable\\&lt;any> | Search For A Form by name |
| getForms | n/a | Observable\\&lt;any> | Get All the forms |
| getProcessDefinitions | n/a | Observable\\&lt;any> | Get Process Definitions |
| getTasks | n/a | Observable\\&lt;any> | Get All the Tasks |
| getTask | (taskId: string) | Observable\\&lt;any> | Get Task |
| saveTaskForm | (taskId: string, formValues: FormValues) | Observable\\&lt;any> | Save Task Form |
| completeTaskForm | (taskId: string, formValues: FormValues, outcome?: string) | Observable\\&lt;any> | Complete Task Form |
| getTaskForm | (taskId: string) | Observable\\&lt;any> | Get Form related to a taskId |
| getFormDefinitionById | (formId: string) | Observable\\&lt;any> | Get Form Definition |
| getFormDefinitionByName | (name: string) | Observable\\&lt;any> | Returns form definition by a given name. |
| getStartFormInstance | (processId: string) | Observable\\&lt;any> | Get start form instance for a given processId |
| getStartFormDefinition | (processId: string) | Observable\\&lt;any> | Get start form definition for a given process |
| getRestFieldValues | (taskId: string, field: string) | Observable\\&lt;any> |  |
| getRestFieldValuesByProcessId | (processDefinitionId: string, field: string) | Observable\\&lt;any> |  |
| getRestFieldValuesColumnByProcessId | (processDefinitionId: string, field: string, column?: string) | Observable\\&lt;any> |  |
| getRestFieldValuesColumn | (taskId: string, field: string, column?: string) | Observable\\&lt;any> |  |
| getWorkflowGroups\\ | (filter: string, groupId?: string) | Observable\\&lt;GroupModel\[]> |  |
| getWorkflowUsers\\ | (filter: string, groupId?: string) | Observable\\&lt;GroupUserModel\[]> |  |
