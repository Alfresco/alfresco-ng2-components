# Process Attachment List component

Displays attached documents on a specified process instance

![process-attachment-list-sample](docassets/images/process-attachment-list.png)

## Basic Usage

```html
<adf-process-attachment-list
    [processInstanceId]="YOUR_PROCESS_INSTANCE_ID"
    (attachmentClick)="YOUR_ATTACHMENT_CLICK_EMITTER_HANDLER">
</adf-process-attachment-list>
```

If the List is empty, a default no content template is displayed.

![default-no-content-template-sample](docassets/images/default-no-content-template.png)

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

### How to Add Drag and Drop Functionality

If we want user to be able to upload attachments for empty lists, We can wrap our component with upload drag area component. In that case, We should also pass a custom *no content template* as shown below with our component urging the user to drag files to upload whenever the list is empty.

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

If the List is empty, the custom no-content template we passed is displayed.

![custom-no-content-drag-drop-template-sample](docassets/images/custom-no-content-drag-drop-template.png)

### Properties

| Name | Type | Description |
| --- | --- | -- |
| processInstanceId | string |  | (**required**): The ID of the process instance to display |
| disabled | boolean | false | Disable/Enable read only mode for attachement list |

### Events

| Name | Description |
| --- | --- |
| attachmentClick | Raised when the attachment double clicked or selected view option from context menu by the user from within the component and return a Blob obj of the object clicker|
| success | Raised when the attachment list fetch all the attach and return a list of attachments |
| error | Raised when the attachment list is not able to fetch the attachments for example network error   |
