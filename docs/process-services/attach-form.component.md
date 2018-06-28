---
Added: v2.0.0
Status: Active
---

# Attach Form component

This component can be used when there is no form attached to a task and we want to add one.

## Basic Usage

```html
<adf-attach-form
    [taskId]="taskid">
</adf-attach-form>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| taskId | `string` | | Id of the task. |

### Events

| Name | Type | Description |
| -- | -- | -- |
| cancelAttachForm | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<void>` | Emitted when the "Cancel" button is clicked. |
| completeAttachForm | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<void>` | Emitted when the form associated with the task is completed. |
