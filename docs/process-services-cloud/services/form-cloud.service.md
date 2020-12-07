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

*   **completeTaskForm**(appName: `string`, taskId: `string`, processInstanceId: `string`, formId: `string`, formValues: [`FormValues`](../../../lib/core/form/components/widgets/core/form-values.ts), outcome: `string`, version: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Completes a task form.
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the target task
    *   *processInstanceId:* `string`  - ID of processInstance
    *   *formId:* `string`  - ID of the form to complete
    *   *formValues:* [`FormValues`](../../../lib/core/form/components/widgets/core/form-values.ts)  - [Form](../../../lib/process-services/src/lib/task-list/models/form.model.ts) values object
    *   *outcome:* `string`  - [Form](../../../lib/process-services/src/lib/task-list/models/form.model.ts) outcome
    *   *version:* `number`  - of the form
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Updated task details
*   **createTemporaryRawRelatedContent**(file: `any`, nodeId: `string`, contentHost: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>

    *   *file:* `any`  -
    *   *nodeId:* `string`  -
    *   *contentHost:* `string`  -
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` -
*   **getBasePath**(appName: `string`): `string`<br/>

    *   *appName:* `string`  -
    *   **Returns** `string` -
*   **getDropDownJsonData**(url: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Parses JSON data to create a corresponding form.
    *   *url:* `string`  - String data to make the request
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Array of FormFieldOption object
*   **getForm**(appName: `string`, formKey: `string`, version?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FormContent`](../../../lib/process-services-cloud/src/lib/services/form-fields.interfaces.ts)`>`<br/>
    Gets a form definition.
    *   *appName:* `string`  - Name of the app
    *   *formKey:* `string`  - key of the target task
    *   *version:* `number`  - (Optional) Version of the form
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FormContent`](../../../lib/process-services-cloud/src/lib/services/form-fields.interfaces.ts)`>` - Form definition
*   **getTask**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Gets details of a task
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the target task
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Details of the task
*   **getTaskForm**(appName: `string`, taskId: `string`, version?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<any>`<br/>
    Gets the form definition of a task.
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the target task
    *   *version:* `number`  - (Optional) Version of the form
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<any>` - Form definition
*   **getTaskVariables**(appName: `string`, taskId: `string`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]>`<br/>
    Gets the variables of a task.
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the target task
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]>` - Task variables
*   **parseForm**(json: `any`, data?: [`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]`, readOnly: `boolean` = `false`): [`FormModel`](../../../lib/core/form/components/widgets/core/form.model.ts)<br/>
    Parses JSON data to create a corresponding form.
    *   *json:* `any`  - JSON data to create the form
    *   *data:* [`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]`  - (Optional) Values for the form's fields
    *   *readOnly:* `boolean`  - Toggles whether or not the form should be read-only
    *   **Returns** [`FormModel`](../../../lib/core/form/components/widgets/core/form.model.ts) - [Form](../../../lib/process-services/src/lib/task-list/models/form.model.ts) created from the JSON specification
*   **saveTaskForm**(appName: `string`, taskId: `string`, processInstanceId: `string`, formId: `string`, values: [`FormValues`](../../../lib/core/form/components/widgets/core/form-values.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>`<br/>
    Saves a task form.
    *   *appName:* `string`  - Name of the app
    *   *taskId:* `string`  - ID of the target task
    *   *processInstanceId:* `string`  - ID of processInstance
    *   *formId:* `string`  - ID of the form to save
    *   *values:* [`FormValues`](../../../lib/core/form/components/widgets/core/form-values.ts)  - [Form](../../../lib/process-services/src/lib/task-list/models/form.model.ts) values object
    *   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` - Updated task details

## See also

*   [Form cloud component](../components/form-cloud.component.md)
