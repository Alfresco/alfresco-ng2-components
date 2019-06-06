---
Title: Form cloud component
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-17
---

# [Task form cloud component](../../../lib/process-services-cloud/src/lib/task/task-form/components/task-form-cloud.component.ts "Defined in task-form-cloud.component.ts")

Shows a [`form`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts) for a task.

## Basic Usage

```html
<adf-cloud-task-form 
    [appName]="appName"
    [taskId]="taskId">
</adf-cloud-task-form>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` |  | App id to fetch corresponding form and values. |
| readOnly | `boolean` | false | Toggle readonly state of the task. |
| showCancelButton | `boolean` | true | Toggle rendering of the `Cancel` button. |
| showCompleteButton | `boolean` | true | Toggle rendering of the `Complete` button. |
| showRefreshButton | `boolean` | false | Toggle rendering of the `Refresh` button. |
| showValidationIcon | `boolean` | true | Toggle rendering of the `Validation` icon. |
| taskId | `string` |  | Task id to fetch corresponding form and values. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| cancelClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the cancel button is clicked. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when any error occurs. |
| formCompleted | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormCloud`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts)`>` | Emitted when the form is submitted with the `Complete` outcome. |
| formSaved | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormCloud`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts)`>` | Emitted when the form is saved. |
| taskClaimed | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the task is claimed. |
| taskCompleted | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the task is completed. |
| taskUnclaimed | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the task is unclaimed. |

## See also

-   [Form component](./form-cloud.component.md)
-   [Form field model](../../core/models/form-field.model.md)
-   [Form cloud service](../services/form-cloud.service.md)
