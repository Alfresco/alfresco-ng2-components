---
Title: Unclaim Task Directive
Added: v3.9.0
Status: Experimental
Last reviewed: 2020-06-09
---

# [Unclaim Task directive](../../../lib/process-services/src/lib/task-list/components/task-form/unclaim-task.directive.ts "Defined in unclaim-task.directive.ts")

Unclaims a task

## Basic Usage

```html
<button adf-unclaim-task [appName]="appName" [taskId]="taskId" (success)="onTaskUnclaimed()">Unclaim</button>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| taskId | `string` | "" | (Required) The id of the task. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task cannot be completed. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task is completed. |
