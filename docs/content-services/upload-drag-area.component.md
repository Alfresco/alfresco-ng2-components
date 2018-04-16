---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-16
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
| disabled | `boolean` | false | Toggle component disabled state. |
| parentId | `string` |  | ID of parent folder node. |
| versioning | `boolean` | false | When false, renames the file using an integer suffix if there is a name clash. Set to true to indicate that a major version should be created instead. |

### Events

| Name | Type | Description |
| -- | -- | -- |
| error | `EventEmitter<Object>` | Raised when the file upload goes in error. |
| success | `EventEmitter<Object>` | Emitted when the file is uploaded. |
