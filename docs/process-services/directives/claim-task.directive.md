---
Title: Claim Task Directive
Added: v3.9.0
Status: Experimental
Last reviewed: 2020-06-09
---

# [Claim task directive](../../../lib/process-services/src/lib/task-list/components/task-form/claim-task.directive.ts "Defined in claim-task.directive.ts")

Claims a task

## Basic Usage

```html
<button adf-claim-task [taskId]="taskId" (success)="onTaskClaimed()">Claim</button>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| taskId | `string` |  | (Required) The id of the task. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task cannot be claimed. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task is claimed. |
