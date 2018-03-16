---
Added: v2.0.0
Status: Active
---
# Upload Button Component

Activates a file upload.

## Basic usage

```html
<adf-upload-button 
    [rootFolderId]="-my-"
    [uploadFolders]="true"
    [multipleFiles]="false"
    [acceptedFilesType]=".jpg,.gif,.png,.svg"
    [versioning]="false"
    (success)="customMethod($event)">
</adf-upload-button>
<adf-file-uploading-dialog></adf-file-uploading-dialog>
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

![Upload notification message](../docassets/images/upload-notification-message.png)

### Upload Version Button Component (Workaround)

Activates a file version upload.
Until further backend API improvements, this component is meant to be used to enrich the feature of node version uploading and to decrease the restrictions currently applied to the node version upload.

```html
<adf-upload-version-button
    staticTitle="Upload new version"
    [node]="node"
    [rootFolderId]="node.parentId"
    [versioning]="true"
    (success)="onUploadSuccess($event)"
    (error)="onUploadError($event)">
</adf-upload-version-button>
```

### Properties and events

Since UploadVersionButtonComponent extends UploadButtonComponent, the properties are the same. Note that some properties doesn't make sense in case of version upload button, thus are just simply ignored. For the version upload button the **node** (which is about to be versioned) is a mandatory input parameter.

Since UploadVersionButtonComponent extends UploadButtonComponent the events are the same.

### Restrictions
At the moment the API only allows new version uploads for a node, if the name of the new version is exactly the same as the old version (**and most importantly the extension**). Because of it, this workaround component uploads the chosen file with the same name as what the original file had (that is the reason, the **node** is a mandatory dependency for this component).

So at the end what this component can and can not do:

**Can**:
- upload a new version from the same file extension regardless of the file name.

**Can not**:
- upload a new version which has a different file extension, than what the originally uploaded file had. (an error message is emitted on the error EventEmitter of the component).
