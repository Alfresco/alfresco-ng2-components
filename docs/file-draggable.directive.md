# File Draggable directive
Provide drag-and-drop features for an element such as a `div`.

## Basic Usage

```html
<div [file-draggable]="true" id="DragAndDropBorder" class="drag-and-drop-border"
     (filesDropped)="onFilesDropped($event)"
     (filesEntityDropped)="onFilesEntityDropped($event)"
     (folderEntityDropped)="onFolderEntityDropped($event)"
     dropzone="" webkitdropzone="*" #dragAndDropArea>
  <ng-content></ng-content>
  Drag and Drop files here!
</div>
```

Some sample CSS to show the drag and drop area:

```css
.drag-and-drop-border {
  vertical-align: middle;
  text-align: center;
  border: double;
  background-color: lightblue;
  width: 400px;
  height: 100px;
}
```

Event handler implementations:

```ts
export class SomeComponent implements OnInit {

 onFilesDropped(files: File[]): void {
    if (files.length) {
      // Use for example the uploadService to upload files to ACS
      console.log('# of files dropped: ', files.length);
    }
  }

  onFilesEntityDropped(item: any): void {
    // Use for example the uploadService to upload files to ACS
    console.log('# of files dropped: ', item);
  }

  onFolderEntityDropped(folder: any): void {
    if (folder.isDirectory) {
      // Use for example the uploadService to upload folder content to ACS
      console.log('Folder dropped: ', folder);
    }
  }
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| file-draggable | boolean | true | Toggles between enable/disable of the drag-and-drop functionality. |

### Events

| Name | Description |
| --- | --- |
| filesEntityDropped | Emitted when one or more files are dragged and dropped onto the draggable element, such as a `div` |
| folderEntityDropped | Emitted when a directory is dragged and dropped onto the draggable element, such as a `div`|
| filesDropped | Emitted when one or more files are dragged and dropped onto the draggable element, such as a `div`|

## Details
Typically you would use the Upload Drag Area component instead of this directive.

<!-- seealso start -->

<!-- seealso end -->