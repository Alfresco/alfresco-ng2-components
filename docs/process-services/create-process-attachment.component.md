---
Added: v2.0.0
Status: Active
---

# Create Process Attachment component

Displays Upload Component (Drag and Click) to upload the attachment to a specified process instance

![process-create-attachment](../docassets/images/process-create-attachment.png)

## Basic Usage

```html
<adf-create-process-attachment 
    [processInstanceId]="YOUR_PROCESS_INSTANCE_ID"
    (error)="YOUR_CREATE_ATTACHMENT_ERROR_HANDLER"
    (success)="YOUR_CREATE_ATTACHMENT_SUCCESS_HANDLER">
</adf-create-process-attachment>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| processInstanceId | `string` |  | (required) The ID of the process instance to display. |

### Events

| Name | Type | Description |
| -- | -- | -- |
| error | `EventEmitter<any>` | Emitted when an error occurs while creating or uploading an attachment from the user within the component. |
| success | `EventEmitter<any>` | Emitted when an attachment is successfully created or uploaded from within the component. |
