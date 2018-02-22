---
Added: v2.0.0
Status: Active
---
# Upload Button Component

Activates a file upload.

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

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| disabled | `boolean` | `false` | Toggles component disabled state (if there is no node permission checking).  |
| uploadFolders | `boolean` | `false` | Allows/disallows upload folders (only for Chrome).  |
| multipleFiles | `boolean` | `false` | Allows/disallows multiple files  |
| versioning | `boolean` | `false` | Toggles versioning.  |
| acceptedFilesType | `string` | `'*'` | List of allowed file extensions, for example: ".jpg,.gif,.png,.svg".  |
| maxFilesSize | `number` |  | Sets a limit on the maximum size (in bytes) of a file to be uploaded. Has no effect if undefined. |
| staticTitle | `string` |  | Defines the text of the upload button.  |
| tooltip | `string` | `null` | Custom tooltip text.  |
| rootFolderId | `string` | `'-root-'` | The ID of the root. Use the nodeId for Content Services or the taskId/processId for Process Services. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| success | `EventEmitter<{}>` | Emitted when the file is uploaded successfully. |
| error | `EventEmitter<{}>` | Emitted when an error occurs. |
| createFolder | `EventEmitter<{}>` | Emitted when a folder is created. |
| permissionEvent | `EventEmitter<PermissionModel>` | Emitted when delete permission is missing. |

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
