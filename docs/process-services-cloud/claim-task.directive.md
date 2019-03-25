---
Title: Claim Task Directive
Added: v3.1.0
Status: Experimental
Last reviewed: 2019-03-05
---

# [Claim task directive](../../lib/process-services-cloud/src/lib/task/directives/claim-task.directive.ts "Defined in claim-task.directive.ts")

Claim a task

## Basic Usage

```html
<button adf-claim-task [appName]="appName" [taskId]="taskId" (success)="onTaskClaimed()">Complete</button>
```
## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| taskId | `string` | empty |(Required) The id of the task. |
| appName | `string` | empty | (Required) The name of the application. |
| success | `EventEmitter<any>` | empty | Emitted when the task is completed. |
| error | `EventEmitter<any>` | empty | Emitted when the task cannot be completed.  |