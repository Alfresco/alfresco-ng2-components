---
Title: Process Instance Tasks component
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [Process Instance Tasks component](../../../lib/process-services/src/lib/process-list/components/process-instance-tasks.component.ts "Defined in process-instance-tasks.component.ts")

Lists both the active and completed tasks associated with a particular process instance

## Basic Usage

```html
<adf-process-instance-tasks 
    processInstanceId="YOUR_PROCESS_INSTANCE_ID" 
    showRefreshButton="true">
</adf-process-instance-tasks>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| processInstanceDetails | [`ProcessInstance`](../../../lib/process-services/src/lib/process-list/models/process-instance.model.ts) |  | (**required**) The ID of the process instance to display tasks for. |
| showRefreshButton | `boolean` | true | Toggles whether to show a refresh button next to the list of tasks to allow it to be updated from the server. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |
| taskClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`TaskDetailsEvent`](../../../lib/process-services/src/lib/task-list/models/task-details.event.ts)`>` | Emitted when a task is clicked. |
