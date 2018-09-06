---
Added: v2.0.0
Status: Active
Last reviewed: 2018-08-07
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

### [Transclusions](../user-guide/transclusion.md)

You can supply any content in the `<adf-upload-drag-area>` to display
as the drag/drop target:

```html
<adf-upload-drag-area (success)="onSuccess($event)">
    <div style="width: 200px; height: 100px; border: 1px solid #888888">
        DRAG HERE
    </div>
</adf-upload-drag-area>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| acceptedFilesType | `string` | "\*" | Filter for accepted file types. |
| comment | `string` |  | When you overwrite existing content, you can use the comment field to add a version comment that appears in the version history |
| disabled | `boolean` | false | Toggles component disabled state (if there is no node permission checking). |
| majorVersion | `boolean` | false | majorVersion boolean field to true to indicate a major version should be created. |
| maxFilesSize | `number` |  | Sets a limit on the maximum size (in bytes) of a file to be uploaded. Has no effect if undefined. |
| nodeType | `string` | "cm:content" | Custom node type for uploaded file |
| rootFolderId | `string` | "-root-" | The ID of the root. Use the nodeId for Content Services or the taskId/processId for Process Services. |
| versioning | `boolean` | false | Toggles versioning. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| beginUpload | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`UploadFilesEvent`](../../lib/content-services/upload/components/upload-files.event.ts)`>` | Raised after files or folders dropped and before the upload process starts. |
| createFolder | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Object>` | Emitted when a folder is created. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Object>` | Emitted when an error occurs. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Object>` | Emitted when the file is uploaded successfully. |

## Details

### Intercepting uploads

You can intercept the upload process using the `beginUpload` event. 

The event has a type of [`UploadFilesEvent`](../../lib/content-services/upload/components/upload-files.event.ts) and provides the following APIs:

-   **files**: accesses the [`FileInfo`](../../lib/core/utils/file-utils.ts) objects that are prepared for the upload
-   **pauseUpload**: pauses the upload and performs additional tasks, like showing the confirmation dialog
-   **resumeUpload**: resumes the upload process

### Example

Wire the `beginUpload` event at the template level:

```html
<adf-upload-drag-area (beginUpload)="onBeginUpload($event)" ...>
    ...
</adf-upload-drag-area>
```

Create the `onBeginUpload` handler that invokes a confirmation dialog:

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

The example above shows a confirmation dialog every time a user uploads more than 1 file.
This could be either a selection of 2 or more files, or a folder with multiple entries.
