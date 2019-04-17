---
Title: Form cloud component
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-17
---

# [Task form cloud component](../../../lib/process-services-cloud/src/lib/form/components/task-form-cloud.component.ts "Defined in task-form-cloud.component.ts")

Shows a [`form`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts) for a task.

## Contents

-   [Basic Usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [See also](#see-also)

## Basic Usage

```html
<adf-task-form-cloud 
    [appName]="appName"
    [taskId]="taskId">
</adf-task-form-cloud>
```


## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` |  | App id to fetch corresponding form and values. |
| taskId | `string` |  | Task id to fetch corresponding form and values. |
| showRefreshButton | `boolean` | false | Toggle rendering of the `Refresh` button. |
| showValidationIcon | `boolean` | true | Toggle rendering of the `Validation` icon. |
| showCancelButton | `boolean` | true | Toggle rendering of the `Cancel` outcome button. |
| showCompleteButton | `boolean` | true | Toggle rendering of the `Complete` outcome button. |
| showSaveButton | `boolean` | true | Toggle rendering of the `Save` outcome button. |
| readOnly | `boolean` | false | Toggle readonly state of the task. |


### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| formSaved | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormCloud`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts)`>` | Emitted when the form is saved. |
| formCompleted | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormCloud`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts)`>` | Emitted when the form is submitted with the `Complete` outcome. |
| taskCompleted | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`string`>` | Emitted when the task is completed. |
| taskClaimed | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`string`>` | Emitted when the task is claimed. |
| taskUnclaimed | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`string`>` | Emitted when the task is unclaimed. |
| cancelClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`string`>` | Emitted when the cancel button is clicked. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when any error occurs. |


## See also

-   [Form component](./form-cloud.component.md)
-   [Form field model](../../core/models/form-field.model.md)
-   [Form cloud service](../services/form-cloud.service.md)
