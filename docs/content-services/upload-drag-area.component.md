---
Added: v2.0.0
Status: Active
Last reviewed: 2018-05-04
---

# Upload Drag Area Component

Adds a drag and drop area to upload files to ACS.

## Basic Usage

```html
<adf-upload-drag-area (success)="onSuccess($event)">
    <div style="width: 200px; height: 100px; border: 1px solid #888888">
        DRAG HERE
    </div>
</adf-upload-drag-area>
<adf-file-uploading-dialog></adf-file-uploading-dialog>
```

```ts
export class AppComponent {

    public onSuccess(event: Object): void {
        console.log('File uploaded');
    }

}
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| acceptedFilesType | `string` | "\*" | Filter for accepted file types. |
| comment | `string` |  | When you overwrite existing content, you can use the comment field to add a version comment that appears in the version history |
| disabled | `boolean` | false | Toggles component disabled state (if there is no node permission checking). |
| majorVersion | `boolean` | false | majorVersion boolean field to true to indicate a major version should be created. |
| maxFilesSize | `number` |  | Sets a limit on the maximum size (in bytes) of a file to be uploaded. Has no effect if undefined. |
| nodeType | `string` | "cm:content" | Custom node type for uploaded file |
| rootFolderId | `string` | "-root-" | The ID of the root. Use the nodeId for Content Services or the taskId/processId for Process Services. |
| versioning | `boolean` | false | Toggles versioning. |
| parentId | `` |  | **Deprecated:** 2.4.0  use rootFolderId ID of parent folder node. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| beginUpload | `EventEmitter<UploadFilesEvent>()` | Raised after files or folders dropped and before the upload process starts. |
| createFolder | `EventEmitter<Object>` | **Deprecated:** No longer used by the framework |
| error | `EventEmitter<Object>` | Emitted when the file is uploaded successfully. |
| success | `EventEmitter<Object>` | Emitted when an error occurs. |

## Intercepting uploads

You can intercept the upload process by utilizing the `beginUpload` event. 

The event has a type of `UploadFilesEvent` and provides the following APIs:

* **files**: get access to the FileInfo objects that are prepared for the upload
* **pauseUpload**: pause the upload and perform additional tasks, like showing the confirmation dialog
* **resumeUpload**: resume the upload process

## Example

Wire the `beginUpload` event at the template level

```html
<adf-upload-drag-area (beginUpload)="onBeginUpload($event)" ...>
    ...
</adf-upload-drag-area>
```

Create the `onBeginUpload` handler that invokes a confirmation dialog

```ts
import { UploadFilesEvent, ConfirmDialogComponent } from '@alfresco/adf-content-services';

@Component({...})
export class MyComponent {

    onBeginUpload(event: UploadFilesEvent) {
        const files = event.files || [];

        if (files.length > 1) {
            event.pauseUpload();

            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Upload',
                    message: `Are you sure you want to upload ${files.length} file(s)?`
                },
                minWidth: '250px'
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result === true) {
                    event.resumeUpload();
                }
            });
        }
    }

}
```

The example above is going to raise confirmation dialog every time a user uploads more than 1 file.
That can be either 2 or more files, or a folder with multiple entries.
