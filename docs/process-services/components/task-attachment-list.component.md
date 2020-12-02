---
Title: Task Attachment List Component
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-14
---

# [Task Attachment List Component](../../../lib/process-services/src/lib/attachment/task-attachment-list.component.ts "Defined in task-attachment-list.component.ts")

Displays documents attached to a specified task.

![task-attachment-list-sample](../../docassets/images/task-attachment-list.png)

## Contents

*   [Basic Usage](#basic-usage)
    *   [Transclusions](#transclusions)
*   [Class members](#class-members)
    *   [Properties](#properties)
    *   [Events](#events)
*   [Details](#details)
    *   [How to Add Drag and Drop Functionality](#how-to-add-drag-and-drop-functionality)
*   [See also](#see-also)

## Basic Usage

```html
<adf-task-attachment-list 
    [taskId]="YOUR_TASK_ID" 
    (attachmentClick)="YOUR_HANDLER">
</adf-task-attachment-list>
```

### [Transclusions](../../user-guide/transclusion.md)

Any content inside the `<adf-task-attachment-list>` element will be displayed
when the list is empty:

```html
<adf-task-attachment-list ...>
    <div><!-- Custom empty list message goes here --></div>
</adf-task-attachment-list>
```

![custom-no-content-drag-drop-template-sample](../../docassets/images/custom-no-content-drag-drop-template.png)

A default "no content" template is displayed if you don't supply one to override it:

![default-no-content-template-sample](../../docassets/images/default-no-content-template.png)

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| disabled | `boolean` | false | Disable/Enable read only mode for attachment list. |
| taskId | `string` |  | (**required**) The ID of the task to display. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| attachmentClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the attachment is double-clicked or a view option is selected from the context menu by the user from within the component. Returns a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) representing the clicked object. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs while fetching the attachments. |
| success | `EventEmitter<any>` | Emitted when the attachment list has fetched all the attachments. Returns a list of attachments. |

## Details

### How to Add Drag and Drop Functionality

You can wrap the component with an [Upload Drag Area component](../../content-services/components/upload-drag-area.component.md)
to enable the user to upload attachments for empty lists. When you do this, you can also pass
a custom *no content template* as shown below. The component invites the user to drag files to
upload whenever the list is empty.

<!-- {% raw %} -->

```html
<adf-upload-drag-area
    [rootFolderId]="YOUR_TASK_ID"
    [showNotificationBar]="BOOLEAN">
    <adf-task-attachment-list  
        [taskId]="YOUR_TASK_ID"
        (attachmentClick)="YOUR_HANDLER">
        <adf-empty-list>
            <div adf-empty-list-header>{{This List is empty}}</div>
            <div adf-empty-list-body>{{Drag and drop to upload}}</div>
            <div adf-empty-list-footer>
                <img [src]="Your custom image URL"></div> 
        </adf-empty-list>
    </adf-task-attachment-list>
</adf-upload-drag-area>
```

<!-- {% endraw %} -->

```ts
import { UploadService } from '@alfresco/adf-core';
import { TaskUploadService } from '@alfresco/adf-process-services';
```

Make sure you override the [`UploadService`](../../core/services/upload.service.md) with the [`TaskUploadService`](../../../lib/process-services/src/lib/task-list/services/task-upload.service.ts)

```ts
@Component({
    selector: 'my-custom-task-attachment',
    providers: [
        { provide: UploadService, useClass: TaskUploadService }
    ]
})
export class MyCustomTaskAttachmentComponent {
    constructor() {}
}
```

## See also

*   [Upload Drag Area Component](../../content-services/components/upload-drag-area.component.md)
