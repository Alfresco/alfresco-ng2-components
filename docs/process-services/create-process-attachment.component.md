---
Title: Create Process Attachment component
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-14
---

# [Create Process Attachment component](../../process-services/attachment/create-process-attachment.component.ts "Defined in create-process-attachment.component.ts")

Displays an Upload Component (Drag and Click) to upload an attachment to a specified process instance

![process-create-attachment](https://github.com/Alfresco/alfresco-ng2-components/blob/development/docs/docassets/images/process-create-attachment.png)

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
| ---- | ---- | ------------- | ----------- |
| processInstanceId | `string` |  | (required) The ID of the process instance to display. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs while creating or uploading an attachment from the user within the component. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an attachment is successfully created or uploaded from within the component. |
