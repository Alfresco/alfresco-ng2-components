---
Title: Task Standalone component
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [Task Standalone component](../../../lib/process-services/src/lib/task-list/components/task-standalone.component.ts "Defined in task-standalone.component.ts")

This component can be used when the task doesn't belong to any processes.

## Basic Usage

```html
<adf-task-standalone
    [taskName]= "taskname">
</adf-task-standalone>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| hasCompletePermission | `boolean` | true | Toggles rendering of the `Complete` button. |
| hideCancelButton | `boolean` | true | Toggles rendering of the `Cancel` button. |
| isCompleted | `boolean` | false | If true then Task completed message is shown and `Complete` and `Cancel` buttons are hidden. |
| taskId | `any` |  | Id of the task. |
| taskName | `any` |  | Name of the task. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| cancel | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<void>` | Emitted when the "Cancel" button is clicked. |
| complete | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<void>` | Emitted when the form associated with the task is completed. |
| showAttachForm | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<void>` | Emitted when the form associated with the form task is attached. |
