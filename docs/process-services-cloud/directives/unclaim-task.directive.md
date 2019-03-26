---
Title: Unclaim Task Directive
Added: v3.1.0
Status: Experimental
Last reviewed: 2019-03-25
---

# [Unclaim task directive](../../../lib/process-services-cloud/src/lib/task/directives/unclaim-task.directive.ts "Defined in unclaim-task.directive.ts")

Unclaims a task

## Basic Usage

```html
<button adf-unclaim-task [appName]="appName" [taskId]="taskId" (success)="onTaskUnclaimed()">Complete</button>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` |  | (Required) The name of the application. |
| taskId | `string` |  | (Required) The id of the task. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task cannot be completed. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task is completed. |
