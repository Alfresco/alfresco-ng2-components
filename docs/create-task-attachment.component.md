# Create Task Attachment Component

Displays Upload Component(Drag and Click) to upload the attachment to a specified task

![task-create-attachment](docassets/images/task-create-attachment.png)

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-create-task-attachment 
    [taskId]="YOUR_TASK_ID" 
    (error)="YOUR_CREATE_ATTACHMENT_ERROR_HANDLER"
    (success)="YOUR_CREATE_ATTACHMENT_SUCCESS_HANDLER">
</adf-create-task-attachment>
```

### Properties

| Name | Type | Description |
| --- | --- | --- |
| taskId | string | (**required**): The numeric ID of the task to display |

### Events

| Name | Description |
| --- | --- |
| error | Raised when the error occurred while creating/uploading the attachment by the user from within the component |
| success | Raised when the attachment created/uploaded successfully from within the component |
