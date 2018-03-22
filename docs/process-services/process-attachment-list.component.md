---
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-21
---

# Process Attachment List component

Displays attached documents on a specified process instance

![process-attachment-list-sample](../docassets/images/process-attachment-list.png)

## Basic Usage

```html
<adf-process-attachment-list
    [processInstanceId]="YOUR_PROCESS_INSTANCE_ID"
    (attachmentClick)="YOUR_ATTACHMENT_CLICK_EMITTER_HANDLER">
</adf-process-attachment-list>
```

Make sure to override the UploadService with the ProcessUploadService

```ts
import { UploadService } from '@alfresco/adf-core';
import { ProcessUploadService } from '@alfresco/adf-process-services';

@Component({
    selector: 'my-custom-process-attachment',
    providers: [
        { provide: UploadService, useClass: ProcessUploadService }
    ]
})
export class MyCustomProcessAttachmentComponent {
    constructor() {}
}
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| processInstanceId | `string` |  | (**required**) The ID of the process instance to display.  |
| disabled | `boolean` | `false` | Disable/Enable read-only mode for attachment list.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| attachmentClick | `EventEmitter<{}>` | Emitted when the attachment is double-clicked or the view option is selected from the context menu by the user from within the component. Returns a Blob representing the object that was clicked. |
| success | `EventEmitter<{}>` | Emitted when the attachment list has fetched all the attachments. Returns a list of attachments. |
| error | `EventEmitter<any>` | Emitted when the attachment list is not able to fetch the attachments (eg, following a network error). |

## Details

### How to Add Drag and Drop Functionality

You can wrap the attachment list with an
[Upload Drag Area component](../content-services/upload-drag-area.component.md)
to let the user upload attachments to empty lists. When you do this, you can also supply
a custom _no content template_ (using &lt;adf-empty-list>) to invite the user to add their attachments:

<!-- {% raw %} -->

```html
<adf-upload-drag-area
    [parentId]="YOUR_PROCESS_ID"
    [showNotificationBar]="BOOLEAN">
    <adf-process-attachment-list  
        [processId]="YOUR_PROCESS_ID"
        (attachmentClick)="YOUR_HANDLER">
            <div adf-empty-list> //no content template
                <adf-empty-list>
                    <div adf-empty-list-header>{{This List is empty}}</div>
                    <div adf-empty-list-body>{{Drag and drop to upload}}</div>
                    <div adf-empty-list-footer>
                        <img [src]="Your custom image URL"></div> 
                </adf-empty-list>
            </div>
    </adf-process-attachment-list>
</adf-upload-drag-area>
```

<!-- {% endraw %} -->

If the List is empty, the custom no-content template we passed is displayed.

![custom-no-content-drag-drop-template-sample](../docassets/images/custom-no-content-drag-drop-template.png)

A default template will be used if you don't supply a custom one to override it:

![default-no-content-template-sample](../docassets/images/default-no-content-template.png)