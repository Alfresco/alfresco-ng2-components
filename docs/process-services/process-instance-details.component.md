---
Added: v2.0.0
Status: Active
---
# Process Details component

Displays detailed information on a specified process instance

## Basic Usage

```html
<adf-process-instance-details 
    processInstanceId="YOUR_PROCESS_INSTANCE_ID">
</adf-process-instance-details>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| processInstanceId | `string` |  | (required) The numeric ID of the process instance to display.  |
| showTitle | `boolean` | `true` | Toggles whether to show or hide the title.  |
| showRefreshButton | `boolean` | `true` | Toggles whether to show or hide the refresh button.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| processCancelled | `EventEmitter<any>` | Emitted when the current process is cancelled by the user from within the component. |
| error | `EventEmitter<any>` | Emitted when an error occurs. |
| taskClick | `EventEmitter<TaskDetailsEvent>` | Emitted when a task is clicked. |
| showProcessDiagram | `EventEmitter<any>` | Emitted when the "show diagram" button is clicked. |
