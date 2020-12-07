---
Title: Form cloud component
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-17
---

# [Task form cloud component](../../../lib/process-services-cloud/src/lib/task/task-form/components/task-form-cloud.component.ts "Defined in task-form-cloud.component.ts")

Shows a [`form`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts) for a task.

Shows Cancel, Save, Complete, Claim and Release buttons. Cancel, Save and Complete buttons are always present. Claim and Release buttons are present according to user's permissions and task's condition (Claimed, Completed etc).

![Task form cloud component screenshot](../../docassets/images/adf-task-form-cloud-1.png)

The following example shows the buttons that are visible when the task's condition is released and the user has the admin permissions

![Task form cloud component screenshot](../../docassets/images/adf-task-form-cloud-3.png)

Save and Complete buttons get disabled when at least one of the form's inputs are invalid.
![Task form cloud component screenshot](../../docassets/images/adf-task-form-cloud-2.png)

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
| --- | --- | --- | --- |
| appName | `string` | "" | App id to fetch corresponding form and values. |
| readOnly | `boolean` | false | Toggle readonly state of the task. |
| showCancelButton | `boolean` | true | Toggle rendering of the `Cancel` button. |
| showCompleteButton | `boolean` | true | Toggle rendering of the `Complete` button. |
| showRefreshButton | `boolean` | false | Toggle rendering of the `Refresh` button. |
| showTitle | `boolean` | true | Toggle rendering of the form title. |
| showValidationIcon | `boolean` | true | Toggle rendering of the `Validation` icon. |
| taskId | `string` |  | Task id to fetch corresponding form and values. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| cancelClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the cancel button is clicked. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when any error occurs. |
| formCompleted | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormModel`](../../../lib/core/form/components/widgets/core/form.model.ts)`>` | Emitted when the form is submitted with the `Complete` outcome. |
| formContentClicked | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ContentLinkModel`](../../../lib/core/form/components/widgets/core/content-link.model.ts)`>` | Emitted when form content is clicked. |
| formSaved | `EventEmitter<FormModel>` | Emitted when the form is saved. |
| taskClaimed | `EventEmitter<string>` | Emitted when the task is claimed. |
| taskCompleted | `EventEmitter<string>` | Emitted when the task is completed. |
| taskUnclaimed | `EventEmitter<string>` | Emitted when the task is unclaimed. |

## See also

*   [Form component](./form-cloud.component.md)
*   [Form field model](../../core/models/form-field.model.md)
*   [Form cloud service](../services/form-cloud.service.md)
