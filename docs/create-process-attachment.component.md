# Create Process Attachment component

Displays Upload Component(Drag and Click) to upload the attachment to a specified process instance

![process-create-attachment](docassets/images/process-create-attachment.png)

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-create-process-attachment 
    [processInstanceId]="YOUR_PROCESS_INSTANCE_ID"
    (error)="YOUR_CREATE_ATTACHMENT_ERROR_HANDLER"
    (success)="YOUR_CREATE_ATTACHMENT_SUCCESS_HANDLER">
</adf-create-process-attachment>
```

### Properties

| Name | Type | Description |
| --- | --- | --- |
| processInstanceId | string | (**required**): The ID of the process instance to display |

### Events

| Name | Description |
| --- | --- |
| error | Raised when the error occurred while creating/uploading the attachment by the user from within the component |
| success | Raised when the attachment created/uploaded successfully from within the component |
