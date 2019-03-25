---
Title: Unclaim Task Directive
Added: v3.1.0
Status: Experimental
Last reviewed: 2019-03-05
---

# [Unclaim task directive](../../lib/process-services-cloud/src/lib/task/directives/unclaim-task.directive.ts "Defined in unclaim-task.directive.ts")

Unclaim a task

## Basic Usage

```html
<button adf-unclaim-task [appName]="appName" [taskId]="taskId" (success)="onTaskUnclaimed()">Complete</button>
```
## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| taskId | `string` | empty |(Required) The id of the task. |
| appName | `string` | empty | (Required) The name of the application. |
| success | `EventEmitter<any>` | empty | Emitted when the task is completed. |
| error | `EventEmitter<any>` | empty | Emitted when the task cannot be completed.  |