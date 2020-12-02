---
Title: Upload Directive
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-20
---

# [Upload Directive](../../../lib/core/directives/upload.directive.ts "Defined in upload.directive.ts")

Uploads content in response to file drag and drop.

## Basic usage

```html
<button [adf-upload]="true" [multiple]="true" [accept]="'image/*'">
    Upload photos
</button>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| accept | `string` |  | (Click mode only) MIME type filter for files to accept. |
| data | `any` |  | Data to upload. |
| directory | `boolean` |  | (Click mode only) Toggles uploading of directories. |
| enabled | `boolean` | true | Enables/disables uploading. |
| mode | `string[]` | \['drop'] | Upload mode. Can be "drop" (receives dropped files) or "click" (clicking opens a file dialog). Both modes can be active at once. |
| multiple | `boolean` |  | Toggles multiple file uploads. |

## Details

Add the directive to a component or HTML element to enable it to upload files.
You can decorate any element including buttons:

```html
<button [adf-upload]="true" [multiple]="true" [accept]="'image/*'">
    Upload photos
</button>
```

The directive itself does not do any file management, but it collects information about
dropped files and emits events in response.

```html
<div style="width:100px; height:100px"
     [adf-upload]="true"
     [adf-upload-data]="{ some: 'data' }">
    Drop files here...
</div>
```

You can enable or disable upload functionality by binding the directive to a boolean
value or expression:

```html
<div [adf-upload]="true">...</div>
<div [adf-upload]="allowUpload">...</div>
<div [adf-upload]="isUploadEnabled()">...</div>
```

### Modes

The [Upload directive](upload.directive.md) supports two modes:

*   **drop** mode, where the decorated element acts like a drop zone for files (enabled by default)
*   **click** mode, where the decorated element invokes a file dialog to select files or folders.

You can also use both modes together:

```html
<div [adf-upload]="true" mode="['click']">...</div>
<div [adf-upload]="true" mode="['drop']">...</div>
<div [adf-upload]="true" mode="['click', 'drop']">...</div>
```

#### Click mode

In click mode you can provide extra attributes for the file dialog:

*   **directory**, enables directory selection
*   **multiple**, enables multiple file/folder selection
*   **accept**, filters the content accepted

```html
<div style="width: 50px; height: 50px; background-color: brown"
     [adf-upload]="true"
     [multiple]="true"
     [accept]="'image/*'">
</div>

<div style="width: 50px; height: 50px; background-color: blueviolet"
     [adf-upload]="true"
     [multiple]="true"
     [directory]="true">
</div>
```

#### Drop mode

Currently, the [upload directive](upload.directive.md) supports only file drops (single or multiple).
Support for folders and `accept` filters will probably be implemented in a
future version.

### Events

The `upload-files` [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
is emitted when single or multiple files are dropped on the decorated element.
The DOM event is configured to have `bubbling` enabled, so any component up the component tree can handle, process or prevent it:

```html
<div (upload-files)="onUploadFiles($event)">
    <div [adf-upload]="true"></div>
</div>
```

```ts
onUploadFiles(e: CustomEvent) {
    console.log(e.detail.files);

    // your code
}
```

Note that the event will be emitted only if valid
[files](https://developer.mozilla.org/en-US/docs/Web/API/File)
are dropped onto the decorated element.

The `upload-files` event is cancellable, so you can stop propagation of the drop event upwards
when it has been handled by your code:

```ts
onUploadFiles(e: CustomEvent) {
    e.stopPropagation();
    e.preventDefault();

    // your code
}
```

You can also attach arbitrary data to each event which you can then access from external event handlers. A typical scenario is with data tables where you may want to make use of the data row
or make underlying data accessible when files are dropped.

You can use `adf-upload-data` to bind custom values or objects for every event raised:

```html
<div [adf-upload]="true" [adf-upload-data]="dataRow"></div>
<div [adf-upload]="true" [adf-upload-data]="'string value'"></div>
<div [adf-upload]="true" [adf-upload-data]="{ name: 'custom object' }"></div>
<div [adf-upload]="true" [adf-upload-data]="getUploadData()"></div>
```

You can access the following items of the `details` property from the
[CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent):

```ts
detail: {
    sender: UploadDirective,    // directive that raised given event
    data: any,                  // arbitrary data associated (bound)
    files: File[]               // dropped files
}
```

### Styling

The decorated element is styled with the `adf-upload__dragging` CSS class whenever a file is dragged
over it. This lets you change the look and feel of your components when you need different visual
indication. For example, you could draw a dashed border around a table row when an item is dragged
onto it:

```html
<table>
    <tr [adf-upload]="true">
        ...
    </tr>
</table>
```

```css
.adf-upload__dragging > td:first-child {
    border-left: 1px dashed rgb(68,138,255);
}

.adf-upload__dragging > td {
    border-top: 1px dashed rgb(68,138,255);
    border-bottom: 1px dashed rgb(68,138,255);
}

.adf-upload__dragging > td:last-child {
    border-right: 1px dashed rgb(68,138,255);
}
```
