---
Title: Claim Task Directive
Added: v3.1.0
Status: Experimental
Last reviewed: 2019-03-25
---

# [Claim task directive](../../../lib/process-services-cloud/src/lib/task/directives/claim-task.directive.ts "Defined in claim-task.directive.ts")

Claims a task

## Basic Usage

```html
<button adf-claim-task [appName]="appName" [taskId]="taskId" (success)="onTaskClaimed()">Complete</button>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` | "" | (Required) The name of the application. |
| taskId | `string` |  | (Required) The id of the task. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task cannot be completed. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task is completed. |
