---
Title: Process Details component
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [Process Details component](../../../lib/process-services/src/lib/process-list/components/process-instance-details.component.ts "Defined in process-instance-details.component.ts")

Displays detailed information about a specified process instance

## Basic Usage

```html
<adf-process-instance-details 
    [processInstanceId]="YOUR_PROCESS_INSTANCE_ID">
</adf-process-instance-details>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| processInstanceId | `string` |  | (required) The numeric ID of the process instance to display. |
| showRefreshButton | `boolean` | true | Toggles whether to show or hide the refresh button. |
| showTitle | `boolean` | true | Toggles whether to show or hide the title. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |
| processCancelled | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the current process is cancelled by the user from within the component. |
| showProcessDiagram | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the "show diagram" button is clicked. |
| taskClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`TaskDetailsEvent`](../../../lib/process-services/src/lib/task-list/models/task-details.event.ts)`>` | Emitted when a task is clicked. |
