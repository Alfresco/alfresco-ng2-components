---
Title: Unclaim Task Cloud Directive
Added: v3.9.0
Status: Experimental
Last reviewed: 2020-06-09
---

# [Unclaim Task Cloud directive](../../../lib/process-services-cloud/src/lib/task/directives/unclaim-task-cloud.directive.ts "Defined in unclaim-task-cloud.directive.ts")

Unclaims a task

## Basic Usage

```html
<button adf-cloud-unclaim-task [appName]="appName" [taskId]="taskId" (success)="onTaskUnclaimed()">Unclaim</button>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` | "" | (Required) The name of the application. |
| taskId | `string` | "" | (Required) The id of the task. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task cannot be completed. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task is completed. |
