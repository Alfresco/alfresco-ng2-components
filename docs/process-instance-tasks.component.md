# Process Instance Tasks component

Lists both the active and completed tasks associated with a particular process instance

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-process-instance-tasks 
    processInstanceId="YOUR_PROCESS_INSTANCE_ID" 
    showRefreshButton="true">
</adf-process-instance-tasks>
```

### Properties

| Name | Type | Description |
| --- | --- | --- |
| processInstanceId | string | (**required**): The ID of the process instance to display tasks for |
| showRefreshButton | boolean | (default: `true`): Whether to show a refresh button next to the list of tasks to allow this to be updated from the server |

### Events

| Name | Description |
| --- | --- |
| taskFormCompletedEmitter | Raised when the form associated with an active task is completed from within the component |
