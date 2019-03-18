---
Title: Complete Cloud Task
Added: v3.1.0
Status: Experimental
Last reviewed: 2019-02-28
---

# [Complete task directive](../../lib/process-services-cloud/src/lib/task/task-header/directives/complete-task.directive.ts "Defined in complete-task.directive.ts")

Complete a task

## Basic Usage

```html
<button adf-cloud-complete-task [appName]="appName" [taskId]="taskId" (success)="onTaskCompleted()">Complete</button>
```
## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| taskId | `string` | empty |(Required) The id of the task. |
| appName | `string` | empty | (Required) The name of the application. |
| success | `EventEmitter<any>` | empty | Emitted when the task is completed. |
| error | `EventEmitter<any>` | empty | Emitted when the task cannot be completed.  |