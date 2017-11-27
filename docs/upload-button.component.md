# Upload Button Component

## Basic Usage

```html
<adf-upload-button 
    [rootFolderId]="-my-"
    [uploadFolders]="true"
    [multipleFiles]="false"
    [acceptedFilesType]=".jpg,.gif,.png,.svg"
    [versioning]="false"
    (success)="customMethod($event)">
</adf-upload-button>
<file-uploading-dialog></file-uploading-dialog>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| disabled | boolean | false | Toggle component disabled state if there is no node permission checking |
| uploadFolders | boolean | false | Allow/disallow upload folders (only for Chrome) |
| multipleFiles | boolean | false | Allow/disallow multiple files |
| acceptedFilesType | string | * |  array of allowed file extensions , example: ".jpg,.gif,.png,.svg" |
| maxFilesSize | number |  |  if defined allow to upload files only with this max file size. the size of a file is in bytes  |
| rootFolderId | string | '-root-' | The ID of the root. It can be the nodeId if you are using the upload for the Content Service or taskId/processId for the Process Service. |
| versioning | boolean | false | Versioning false is the default uploader behaviour and it renames the file using an integer suffix if there is a name clash. Versioning true to indicate that a major version should be created |
| staticTitle | string | (predefined) | define the text of the upload button |
| tooltip | string | | Custom tooltip |

### Events

| Name | Description |
| --- | --- |
| success | Raised when the file is uploaded |
| permissionEvent | permissionEvent that is raised when the delete permission is missing |

## Details

### How to show notification message with no permission

You can show a notification error when the user doesn't have the right permission to perform the action.
The UploadButtonComponent provides the event permissionEvent that is raised when the delete permission is missing
You can subscribe to this event from your component and use the NotificationService to show a message.

```html
<adf-upload-button
    [rootFolderId]="currentFolderId"
    (permissionEvent)="onUploadPermissionFailed($event)">
</adf-upload-button>
```

```ts
export class MyComponent {

    onUploadPermissionFailed(event: any) {
        this.notificationService.openSnackMessage(
            `you don't have the ${event.permission} permission to ${event.action} the ${event.type} `, 4000
        );
    }

}
```

![Upload notification message](docassets/images/upload-notification-message.png)
