# Upload Directive

Allows your components or common HTML elements reacting on File drag and drop in order to upload content.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic usage

The directive itself does not do any file management process,
but collects information on dropped files and raises corresponding events instead.

```html
<div style="width:100px; height:100px"
     [adf-upload]="true"
     [adf-upload-data]="{ some: 'data' }">
    Drop files here...
</div>
```

It is possible controlling when upload behaviour is enabled/disabled by binding directive to a `boolean` value or expression:

```html
<div [adf-upload]="true">...</div>
<div [adf-upload]="allowUpload">...</div>
<div [adf-upload]="isUploadEnabled()">...</div>
```

You can decorate any element including buttons, for example:

```html
<button [adf-upload]="true" [multiple]="true" [accept]="'image/*'">
    Upload photos
</button>
```

## Details

Used by attaching to an element or component.

### Modes

Directive supports several modes:

- **drop** mode, where decorated element acts like a drop zone for files (**default** mode)
- **click** mode, where decorated element invokes File Dialog to select files or folders.

It is also possible combining modes together.

```html
<div [adf-upload]="true" mode="['click']">...</div>
<div [adf-upload]="true" mode="['drop']">...</div>
<div [adf-upload]="true" mode="['click', 'drop']">...</div>
```

#### Click mode

For the click mode you can provide additional attributes for the File Dialog:

- **directory**, enables directory selection
- **multiple**, enables multiple file/folder selection
- **accept**, filters the content accepted

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

For the moment upload directive supports only Files (single or multiple).
Support for Folders and `accept` filters is subject to implement.

### Events

Once a single or multiple files are dropped on the decorated element the `upload-files` [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) is raised.
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

Please note that event will be raised only if valid [Files](https://developer.mozilla.org/en-US/docs/Web/API/File) were dropped onto the decorated element.

The `upload-files` event is cancellable, so you can stop propagation of the drop event to upper levels in case it has been already handled by your code:

```ts
onUploadFiles(e: CustomEvent) {
    e.stopPropagation();
    e.preventDefault();

    // your code
}
```

It is also possible attaching arbitrary data to each event in order to access it from within external event handlers.
A typical scenario is data tables where you may want to handle also the data row and/or underlying data to be accessible upon files drop.

You may be using `adf-upload-data` to bind custom values or objects for every event raised:

```html
<div [adf-upload]="true" [adf-upload-data]="dataRow"></div>
<div [adf-upload]="true" [adf-upload-data]="'string value'"></div>
<div [adf-upload]="true" [adf-upload-data]="{ name: 'custom object' }"></div>
<div [adf-upload]="true" [adf-upload-data]="getUploadData()"></div>
```

As part of the `details` property of the [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) you can get access to the following:

```ts
detail: {
    sender: UploadDirective,    // directive that raised given event
    data: any,                  // arbitrary data associated (bound)
    files: File[]               // dropped files
}
```

### Styling

The decorated element gets `adf-upload__dragging` CSS class name in the class list every time files are dragged over it.
This allows changing look and feel of your components in case additional visual indication is required, 
for example you may want drawing a dashed border around the table row on drag:

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