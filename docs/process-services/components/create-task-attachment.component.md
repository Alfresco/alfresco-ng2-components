---
Title: Create Task Attachment Component
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-14
---

# [Create Task Attachment Component](../../../lib/process-services/src/lib/attachment/create-task-attachment.component.ts "Defined in create-task-attachment.component.ts")

Displays an Upload Component (Drag and Click) to upload the attachment to a specified task.

![task-create-attachment](../../docassets/images/task-create-attachment.png)

## Basic Usage

```html
<adf-create-task-attachment 
    [taskId]="YOUR_TASK_ID" 
    (error)="YOUR_CREATE_ATTACHMENT_ERROR_HANDLER"
    (success)="YOUR_CREATE_ATTACHMENT_SUCCESS_HANDLER">
</adf-create-task-attachment>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| taskId | `string` |  | (required) The numeric ID of the task to display. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs while creating or uploading an  attachment from the user within the component. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an attachment is created or uploaded successfully from within the component. |
