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

-   **completeTaskForm**(appName: `string`, taskId: `string`, processInstanceId: `string`, formId: `string`, formValues: [`FormValues`](../../../lib/core/src/lib/form/components/widgets/core/form-values.ts), outcome: `string`, version: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Completes a task form.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the target task
    -   _processInstanceId:_ `string`  - ID of processInstance
    -   _formId:_ `string`  - ID of the form to complete
    -   _formValues:_ [`FormValues`](../../../lib/core/src/lib/form/components/widgets/core/form-values.ts)  - [Form](../../../lib/process-services/src/lib/task-list/models/form.model.ts) values object
    -   _outcome:_ `string`  - [Form](../../../lib/process-services/src/lib/task-list/models/form.model.ts) outcome
    -   _version:_ `number`  - of the form
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Updated task details
-   **createTemporaryRawRelatedContent**(file: `any`, nodeId: `string`, contentHost: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>

    -   _file:_ `any`  - 
    -   _nodeId:_ `string`  - 
    -   _contentHost:_ `string`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - 

-   **getBasePath**(appName: `string`): `string`<br/>

    -   _appName:_ `string`  - 
    -   **Returns** `string` - 

-   **getForm**(appName: `string`, formKey: `string`, version?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FormContent`](../../../lib/process-services-cloud/src/lib/services/form-fields.interfaces.ts)`>`<br/>
    Gets a form definition.
    -   _appName:_ `string`  - Name of the app
    -   _formKey:_ `string`  - key of the target task
    -   _version:_ `number`  - (Optional) Version of the form
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FormContent`](../../../lib/process-services-cloud/src/lib/services/form-fields.interfaces.ts)`>` - Form definition
-   **getRestWidgetData**(formName: `string`, widgetId: `string`, body: `any` = `{}`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FormFieldOption`](../../../lib/core/src/lib/form/components/widgets/core/form-field-option.ts)`[]>`<br/>

    -   _formName:_ `string`  - 
    -   _widgetId:_ `string`  - 
    -   _body:_ `any`  - 
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FormFieldOption`](../../../lib/core/src/lib/form/components/widgets/core/form-field-option.ts)`[]>` - 

-   **getTask**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Gets details of a task
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the target task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Details of the task
-   **getTaskForm**(appName: `string`, taskId: `string`, version?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets the form definition of a task.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the target task
    -   _version:_ `number`  - (Optional) Version of the form
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Form definition
-   **getTaskVariables**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]>`<br/>
    Gets the variables of a task.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the target task
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]>` - Task variables
-   **parseForm**(json: `any`, data?: [`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]`, readOnly: `boolean` = `false`): [`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts)<br/>
    Parses JSON data to create a corresponding form.
    -   _json:_ `any`  - JSON data to create the form
    -   _data:_ [`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]`  - (Optional) Values for the form's fields
    -   _readOnly:_ `boolean`  - Toggles whether or not the form should be read-only
    -   **Returns** [`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts) - [Form](../../../lib/process-services/src/lib/task-list/models/form.model.ts) created from the JSON specification
-   **saveTaskForm**(appName: `string`, taskId: `string`, processInstanceId: `string`, formId: `string`, values: [`FormValues`](../../../lib/core/src/lib/form/components/widgets/core/form-values.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Saves a task form.
    -   _appName:_ `string`  - Name of the app
    -   _taskId:_ `string`  - ID of the target task
    -   _processInstanceId:_ `string`  - ID of processInstance
    -   _formId:_ `string`  - ID of the form to save
    -   _values:_ [`FormValues`](../../../lib/core/src/lib/form/components/widgets/core/form-values.ts)  - [Form](../../../lib/process-services/src/lib/task-list/models/form.model.ts) values object
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Updated task details

## See also

-   [Form cloud component](../components/form-cloud.component.md)
