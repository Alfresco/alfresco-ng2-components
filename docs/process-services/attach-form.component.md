---
Added: v2.0.0
Status: Active
Last reviewed: 2018-09-14
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
| ---- | ---- | ------------- | ----------- |
| formKey | `any` |  | Identifier of the form to attach. |
| taskId | `any` |  | Id of the task. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| cancelAttachForm | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<void>` | Emitted when the "Cancel" button is clicked. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<void>` | Emitted when the form is attached successfully. |
