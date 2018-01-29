# Process Instance Tasks component

Lists both the active and completed tasks associated with a particular process instance

## Basic Usage

```html
<adf-process-instance-tasks 
    processInstanceId="YOUR_PROCESS_INSTANCE_ID" 
    showRefreshButton="true">
</adf-process-instance-tasks>
```

### Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| processInstanceDetails | `ProcessInstance` | (**required**) The ID of the process instance to display tasks for.  |
| showRefreshButton | `boolean` | Toggles whether to show a refresh button next to the list of tasks to allow it to be updated from the server. <br/> Default value: `true` |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | `EventEmitter<any>` | Emitted when an error occurs. |
| taskClick | `EventEmitter<TaskDetailsEvent>` | Emitted when a task is clicked. |
