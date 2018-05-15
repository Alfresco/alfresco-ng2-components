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
| -- | -- | -- |
| createFolder | `EventEmitter<Object>` | Emitted when a folder is created. |
| error | `EventEmitter<Object>` | Emitted when an error occurs. |
| success | `EventEmitter<Object>` | Emitted when the file is uploaded successfully. |
