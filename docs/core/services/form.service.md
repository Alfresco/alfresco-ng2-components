---
Title: Form service
Added: v2.0.0
Status: Active
---

# [Form service](../../../lib/core/src/lib/form/services/form.service.ts "Defined in form.service.ts")

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
| formLoaded | [`FormEvent`](../../../lib/core/src/lib/form/events/form.event.ts) | Raised when form has been loaded or reloaded |
| formFieldValueChanged | [`FormFieldEvent`](../../../lib/core/src/lib/form/events/form-field.event.ts) | Raised when input values change |
| taskCompleted | [`FormEvent`](../../../lib/core/src/lib/form/events/form.event.ts) | Raised when a task is completed successfully |
| taskCompletedError | [`FormErrorEvent`](../../../lib/core/src/lib/form/events/form-error.event.ts) | Raised when a task is completed unsuccessfully |
| taskSaved | [`FormEvent`](../../../lib/core/src/lib/form/events/form.event.ts) | Raised when a task is saved successfully |
| taskSavedError | [`FormErrorEvent`](../../../lib/core/src/lib/form/events/form-error.event.ts) | Raised when a task is saved unsuccessfully |
| executeOutcome | [`FormOutcomeEvent`](../../../lib/core/src/lib/form/components/widgets/core/form-outcome-event.model.ts) | Raised when a form outcome is executed |
| formEvents | Event | You can subscribe to this event to listen : ( click, blur, change, focus, focusin, focusout, input, invalid, select) of any elements in the form , see doc below |
| validateForm | [`ValidateFormEvent`](../../../lib/core/src/lib/form/events/validate-form.event.ts) | Raised each time a form is validated. You can use it to provide custom validation or prevent default behaviour. |
| validateFormField | [`ValidateFormFieldEvent`](../../../lib/core/src/lib/form/events/validate-form-field.event.ts) | Raised each time a form field is validated. You can use it to provide custom validation or prevent default behaviour. |

### Methods

-   `parseForm(json: any, data?:`[`FormValues,`](lib/core/src/lib/form/components/widgets/core/form-values.ts)`readOnly: boolean = false):`[`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts)  
    Parses JSON data to create a corresponding [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) model.

    -   `json` - JSON to create the form
    -   `data` - (Optional) Values for the form fields
    -   `readOnly` - Should the form fields be read-only?

-   `createFormFromANode(formName: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Create a [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) with a field for each metadata property.

    -   `formName` - Name of the new form

-   `createForm(formName: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Create a [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts).

    -   `formName` - Name of the new form

-   `saveForm(formId: string, formModel: FormDefinitionModel):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Saves a form.  

    -   `formId` - ID of the form to save 
    -   `formModel` - [`Model`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/model-rest-api/model/model.ts) data for the form

-   `searchFrom(name: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Search for a form by name.  

    -   `name` - The form name to search for

-   `getForms():`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Gets all the forms.  

-   `getProcessDefinitions():`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Get Process Definitions  

-   `getProcessVariablesById(processInstanceId: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any[]>`  
    Get instance variables for a process.  

    -   `processInstanceId` - ID of the target process

-   `getTasks():`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Gets all the tasks.  

-   `getTask(taskId: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Gets a task.  

    -   `taskId` - Task Id

-   `saveTaskForm(taskId: string, formValues: FormValues):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Save Task [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts).

    -   `taskId` - Task Id
    -   `formValues` - [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) Values

-   `completeTaskForm(taskId: string, formValues:`[`FormValues,`](lib/core/src/lib/form/components/widgets/core/form-values.ts)`outcome?: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Complete Task [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts)

    -   `taskId` - Task Id
    -   `formValues` - [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) Values
    -   `outcome` - (Optional) [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) Outcome

-   `getTaskForm(taskId: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Get [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) related to a taskId  

    -   `taskId` - Task Id

-   `getFormDefinitionById(formId: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Get [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) [`Definition`](../../../lib/cli/node_modules/@alfresco/js-api/src/api/content-rest-api/model/definition.ts)  

    -   `formId` - [`Form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) Id

-   `getFormDefinitionByName(name: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Returns form definition with a given name.  

    -   `name` - The form name

-   `getStartFormInstance(processId: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Get start form instance for a given processId  

    -   `processId` - Process definition ID

-   `getProcessInstance(processId: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Gets a process instance.  

    -   `processId` - ID of the process to get

-   `getStartFormDefinition(processId: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Get start form definition for a given process  

    -   `processId` - Process definition ID

-   `getRestFieldValues(taskId: string, field: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Gets values of fields populated by a REST backend.  

    -   `taskId` - Task identifier
    -   `field` - Field identifier

-   `getRestFieldValuesByProcessId(processDefinitionId: string, field: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Gets values of fields populated by a REST backend using a process ID.  

    -   `processDefinitionId` - Process identifier
    -   `field` - Field identifier

-   `getRestFieldValuesColumnByProcessId(processDefinitionId: string, field: string, column?: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Gets column values of fields populated by a REST backend using a process ID.  

    -   `processDefinitionId` - Process identifier
    -   `field` - Field identifier
    -   `column` - (Optional) Column identifier

-   `getRestFieldValuesColumn(taskId: string, field: string, column?: string):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Gets column values of fields populated by a REST backend.  

    -   `taskId` - Task identifier
    -   `field` - Field identifier
    -   `column` - (Optional) Column identifier

-   `getUserProfileImageApi(userId: number): string`  
    Returns a URL for the profile picture of a user.  

    -   `userId` - ID of the target user

-   [`getWorkflowUsers(filter: string, groupId?: string): Observable<UserProcessModel[]>`](../../core/models/user-process.model.md)  
    Gets a list of workflow users.  

    -   `filter` - Filter to select specific users
    -   `groupId` - (Optional) Group ID for the search

-   [`getWorkflowGroups(filter: string, groupId?: string): Observable<GroupModel[]>`](../../../lib/core/src/lib/form/components/widgets/core/group.model.ts)  
    Gets a list of groups in a workflow.  

    -   `filter` - Filter to select specific groups
    -   `groupId` - (Optional) Group ID for the search

-   `getFormId(res: any): string`  
    Gets the ID of a form.  

    -   `res` - Object representing a form

-   `toJson(res: any): any`  
    Creates a JSON representation of form data.  

    -   `res` - Object representing form data

-   `toJsonArray(res: any): any`  
    Creates a JSON array representation of form data.  

    -   `res` - Object representing form data

-   `handleError(error: any):`[`Observable`](http://reactivex.io/documentation/observable.html)`<any>`  
    Reports an error message.  
    -   `error` - Data object with optional \`message\` and \`status\` fields for the error
