---
Title: Form cloud service
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-12
---

# [Form cloud service](../../../lib/process-services-cloud/src/lib/form/services/form-cloud.service.ts "Defined in form-cloud.service.ts")

Implements Process Services form methods

## Basic Usage

```ts
import { FormCloudService } from '@alfresco/adf-process-services-cloud';

@Component(...)
class MyComponent {

    constructor(formCloudService: FormCloudService) {}

}
```

## Class members

### Methods

-   **completeTaskForm**(appName: `string`, taskId: `string`, formId: `string`, formValues: [`FormValues`](../../../lib/core/form/components/widgets/core/form-values.ts), outcome: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Completes a task form.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the target task
    -   _formId:_ `string`  - ID of the form to complete
    -   _formValues:_ [`FormValues`](../../../lib/core/form/components/widgets/core/form-values.ts)  - [Form](../../../lib/process-services/task-list/models/form.model.ts) values object
    -   _outcome:_ `string`  - (Optional) [Form](../../../lib/process-services/task-list/models/form.model.ts) outcome
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Updated task details
-   **createTemporaryRawRelatedContent**(file: `any`, nodeId: `any`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>

    -   _file:_ `any`  - 
    -   _nodeId:_ `any`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - 

-   **getBasePath**(appName: `string`): `string`<br/>

    -   _appName:_ `string`  - 
    -   **Returns** `string` - 

-   **getDropDownJsonData**(url: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FormFieldOption`](../../../lib/core/form/components/widgets/core/form-field-option.ts)`[]>`<br/>
    Parses JSON data to create a corresponding form.
    -   _url:_ `string`  - String data to make the request
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FormFieldOption`](../../../lib/core/form/components/widgets/core/form-field-option.ts)`[]>` - Array of FormFieldOption object
-   **getForm**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets a form definition.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the target task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Form definition
-   **getProcessStorageFolderTask**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>

    -   _appName:_ `string`  - 
    -   _taskId:_ `string`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - 

-   **getTask**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Gets details of a task
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the target task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Details of the task
-   **getTaskForm**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets the form definition of a task.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the target task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Form definition
-   **getTaskVariables**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]>`<br/>
    Gets the variables of a task.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the target task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]>` - Task variables
-   **parseForm**(json: `any`, data?: [`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]`, readOnly: `boolean` = `false`): [`FormCloud`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts)<br/>
    Parses JSON data to create a corresponding form.
    -   _json:_ `any`  - JSON data to create the form
    -   _data:_ [`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]`  - (Optional) (Optional) Values for the form's fields
    -   _readOnly:_ `boolean`  - Toggles whether or not the form should be read-only
    -   **Returns** [`FormCloud`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts) - [Form](../../../lib/process-services/task-list/models/form.model.ts) created from the JSON specification
-   **saveTaskForm**(appName: `string`, taskId: `string`, formId: `string`, formValues: [`FormValues`](../../../lib/core/form/components/widgets/core/form-values.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Saves a task form.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the target task
    -   _formId:_ `string`  - ID of the form to save
    -   _formValues:_ [`FormValues`](../../../lib/core/form/components/widgets/core/form-values.ts)  - [Form](../../../lib/process-services/task-list/models/form.model.ts) values object
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Updated task details

## See also

-   [Form cloud component](../components/form-cloud.component.md)
