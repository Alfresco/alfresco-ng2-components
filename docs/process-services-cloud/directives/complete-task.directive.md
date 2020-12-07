---
Title: Complete Task Directive
Added: v3.1.0
Status: Experimental
Last reviewed: 2019-03-19
---

# [Complete task directive](../../../lib/process-services-cloud/src/lib/task/directives/complete-task.directive.ts "Defined in complete-task.directive.ts")

Completes a task.

## Basic Usage

```html
<button adf-cloud-complete-task [appName]="appName" [taskId]="taskId" (success)="onTaskCompleted()">Complete</button>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| appName | `string` | "" | (Required) The name of the application. |
| taskId | `string` |  | (Required) The id of the task. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task cannot be completed. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task is completed. |
