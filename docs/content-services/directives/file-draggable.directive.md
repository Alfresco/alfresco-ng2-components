---
Title: File Draggable directive
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-10
---

# [File Draggable directive](../../../lib/content-services/src/lib/upload/directives/file-draggable.directive.ts "Defined in file-draggable.directive.ts")

Provides drag-and-drop features for an element such as a `div`.

## Basic Usage

```html
<div [adf-file-draggable]="true" id="DragAndDropBorder" class="drag-and-drop-border"
     (filesDropped)="onFilesDropped($event)"
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

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| enabled | `boolean` | true | Enables/disables drag-and-drop functionality. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| filesDropped | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<File[]>` | Emitted when one or more files are dragged and dropped onto the draggable element. |
| folderEntityDropped | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when a directory is dragged and dropped onto the draggable element. |

## Details

Typically you would use the [Upload Drag Area component](../components/upload-drag-area.component.md) instead of this directive.

### Event handler implementations

```ts
export class SomeComponent implements OnInit {

 onFilesDropped(files: File[]): void {
    if (files.length) {
      // Use for example the uploadService to upload files to ACS
      console.log('# of files dropped: ', files.length);
    }
  }

  onFolderEntityDropped(folder: any): void {
    if (folder.isDirectory) {
      // Use for example the uploadService to upload folder content to ACS
      console.log('Folder dropped: ', folder);
    }
  }
```

## See also

*   [Upload Drag Area component](../components/upload-drag-area.component.md)
