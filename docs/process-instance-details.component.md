# Process Details component

Displays detailed information on a specified process instance

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-process-instance-details 
    processInstanceId="YOUR_PROCESS_INSTANCE_ID">
</adf-process-instance-details>
```

### Properties

| Name | Type | Description |
| --- | --- | --- |
| processInstanceId | string | (required): The numeric ID of the process instance to display |

### Events

| Name | Description |
| --- | --- |
| processCancelledEmitter | Raised when the current process is cancelled by the user from within the component |
| taskFormCompletedEmitter | Raised when the form associated with an active task is completed from within the component |
| showProcessDiagram | Raised when the show diagram button is clicked |