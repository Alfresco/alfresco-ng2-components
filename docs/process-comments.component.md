# Process Instance Comments component

Displays comments associated with a particular process instance and allows the user to add new comments.

## Basic Usage

```html
<adf-process-instance-comments 
    processInstanceId="YOUR_PROCESS_INSTANCE_ID">
</adf-process-instance-comments>
```

### Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| processInstanceId | `string` | (**required**) The numeric ID of the process instance to display comments for.  |
| readOnly | `boolean` | Should the comments be read-only? <br/> Default value: `true` |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | `EventEmitter<any>` | Emitted when an error occurs. |
