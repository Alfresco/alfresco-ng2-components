# FormService Service

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Events](#events)
  * [Methods](#methods)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```ts
import { FormService, FormEvent, FormFieldEvent } from 'ng2-activiti-form';

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
| --- | --- | --- |
| formLoaded | FormEvent | Raised when form has been loaded or reloaded |
| formFieldValueChanged | FormFieldEvent | Raised when input values change |
| taskCompleted | FormEvent | Raised when a task is completed successfully |
| taskCompletedError | FormErrorEvent | Raised when a task is completed unsuccessfully  |
| taskSaved | FormEvent | Raised when a task is saved successfully |
| taskSavedError | FormErrorEvent | Raised when a task is saved unsuccessfully |
| executeOutcome | FormOutcomeEvent | Raised when a form outcome is executed |
| formEvents | Event | You can subscribe to this event to listen : ( click, blur, change, focus, focusin, focusout, input, invalid, select) of any elements in the form , see doc below |
| validateForm | ValidateFormEvent | Raised each time a form is validated. You can use it to provide custom validation or prevent default behaviour. |
| validateFormField | ValidateFormFieldEvent | Raised each time a form field is validated. You can use it to provide custom validation or prevent default behaviour.|

### Methods

| Name | Params | Returns | Description |
| --- | --- | --- | --- |
| createFormFromANode | (formName: string) | Observable\<any\> | Create a Form with a fields for each metadata properties |
| createForm | (formName: string) | Observable\<any\> | Create a Form |
| addFieldsToAForm | (formId: string, formModel: FormDefinitionModel) | Observable\<any\> | Add Fileds to A form |
| searchFrom | (name: string) | Observable\<any\> | Search For A Form by name |
| getForms | n/a | Observable\<any\> | Get All the forms |
| getProcessDefinitions | n/a | Observable\<any\> | Get Process Definitions |
| getTasks | n/a | Observable\<any\> | Get All the Tasks |
| getTask | (taskId: string) | Observable\<any\> | Get Task |
| saveTaskForm | (taskId: string, formValues: FormValues) | Observable\<any\> | Save Task Form |
| completeTaskForm | (taskId: string, formValues: FormValues, outcome?: string) | Observable\<any\> | Complete Task Form |
| getTaskForm | (taskId: string) | Observable\<any\> | Get Form related to a taskId |
| getFormDefinitionById | (formId: string) | Observable\<any\> | Get Form Definition |
| getFormDefinitionByName | (name: string) | Observable\<any\> | Returns form definition by a given name. |
| getStartFormInstance | (processId: string) | Observable\<any\> | Get start form instance for a given processId |
| getStartFormDefinition | (processId: string) | Observable\<any\> | Get start form definition for a given process |
| getRestFieldValues | (taskId: string, field: string) | Observable\<any\> |  |
| getRestFieldValuesByProcessId | (processDefinitionId: string, field: string) | Observable\<any\> |  |
| getRestFieldValuesColumnByProcessId | (processDefinitionId: string, field: string, column?: string) | Observable\<any\> |  |
| getRestFieldValuesColumn | (taskId: string, field: string, column?: string) | Observable\<any\> |  |
| getWorkflowGroups\ | (filter: string, groupId?: string) | Observable\<GroupModel[]\> |  |
| getWorkflowUsers\ | (filter: string, groupId?: string) | Observable\<GroupUserModel[]\> |  |
