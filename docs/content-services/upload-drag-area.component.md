---
Added: v2.0.0
Status: Active
---
# Upload Drag Area Component

Adds a drag and drop area to upload files to Alfresco.

## Basic Usage

```html
<adf-upload-drag-area (success)="onSuccess($event)">
    <div style="width: 200px; height: 100px; border: 1px solid #888888">
        DRAG HERE
    </div>
</adf-upload-drag-area>
<file-uploading-dialog></file-uploading-dialog>
```

```ts
export class AppComponent {

    public onSuccess(event: Object): void {
        console.log('File uploaded');
    }

}
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| disabled | boolean | false | Toggle component disabled state |
| parentId | string | '-root-' | The ID of the folder in which the files will be uploaded. |
| versioning | boolean | false |  Versioning false is the default uploader behaviour and it renames the file using an integer suffix if there is a name clash. Versioning true to indicate that a major version should be created  | 

### Events

| Name | Description |
| --- | --- |
| success | Raised when the file is uploaded |
