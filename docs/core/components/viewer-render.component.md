---
Title: Viewer Render component
Added: v6.0.0
Status: Active
Last reviewed: 2022-11-25
---

# [Viewer render component](../../../lib/core/src/lib/viewer/components/viewer-render.component.ts "Defined in viewer-render.component.ts")

Displays content from an ACS repository.

See it live: [Viewer Quickstart](https://embed.plnkr.co/iTuG1lFIXfsP95l6bDW6/)

## Contents

-   [Basic usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [Keyboard shortcuts](#keyboard-shortcuts)
-   [Details](#details)
    -   [Custom file parameters](#custom-file-parameters)
    -   [Supported file formats](#supported-file-formats)
    -   [Configuring PDF.js library](#configuring-pdfjs-library)
    -   [Extending the Viewer](#extending-the-viewer)
    -   [Custom layout](#custom-layout)
-   [See also](#see-also)

## Basic usage

Using with file url:

```html
<adf-viewer-render 
    [overlayMode]="true" 
    [urlFile]="'filename.pdf'">
</adf-viewer-render>
```

Using with file [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob):

```html
<adf-viewer-render 
    [overlayMode]="true" 
    [blobFile]="myBlobVar">
</adf-viewer-render>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| allowFullScreen | `boolean` | true | Toggles the 'Full Screen' feature. |
| allowThumbnails | `boolean` | true | Toggles PDF thumbnails. |
| blobFile | [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) |  | Loads a [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) File |
| fileName | `string` |  | Override Content filename. |
| isLoading | `boolean` | false | Override loading status |
| mimeType | `string` |  | MIME type of the file content (when not determined by the filename extension). |
| readOnly | `boolean` | true | Enable when where is possible the editing functionalities |
| thumbnailsTemplate | [`TemplateRef`](https://angular.io/api/core/TemplateRef)`<any>` | null | The template for the pdf thumbnails. |
| tracks | [`Track`](../../../lib/core/src/lib/viewer/models/viewer.model.ts)`[]` | \[] | media subtitles for the media player |
| urlFile | `string` | "" | If you want to load an external file that does not come from ACS you can use this URL to specify where to load the file from. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| close | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>` | Emitted when the img is submitted in the img viewer. |
| extensionChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the filename extension changes. |
| submitFile | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)`>` | Emitted when the img is submitted in the img viewer. |

## Keyboard shortcuts

| Name | Description |
| ---- | ----------- |
| Esc | Close the viewer (overlay mode only). |
| Left | Invoke 'Navigate before' action. |
| Right | Invoke 'Navigate next' action. |
| Ctrl+F | Activate full-screen mode. |

## Details

The component controller class implementation might look like the following:

```ts
export class OverlayViewerComponent {

    @Input()
    showViewer: boolean = false;

    nodeId: string;

    showPreview(event) {
        if (event.value.entry.isFile) {
            this.nodeId = event.value.entry.id;
            this.showViewer = true;
        }
    }
}
```

### Custom file parameters

You can provide custom file parameters, for example a value for the `mimeType` or `displayName` when using URL values that have no file names or extensions:

```html
<adf-viewer-render
    [displayName]="fileName"
    [allowGoBack]="false"
    [mimeType]="mimeType"
    [urlFile]="fileUrl">
</adf-viewer-render>
```

### Supported file formats

The [Viewer render component](viewer.component.md) consists of separate Views that handle particular file types or type families based on either a file extension or a mime type:

-   PDF View
    -   application/pdf
    -   \*.pdf
-   Image View
    -   image/png
    -   image/jpeg
    -   image/gif
    -   image/bmp
    -   image/svg+xml
    -   \*.png
    -   \*.jpg
    -   \*.jpeg
    -   \*.gif
    -   \*.bpm
    -   \*.svg
-   Text View
    -   text/plain
    -   text/csv
    -   text/xml
    -   text/html
    -   application/x-javascript
    -   \*.txt
    -   \*.xml
    -   \*.js
    -   \*.html
    -   \*.json
    -   \*.ts
-   Media View
    -   video/mp4
    -   video/webm
    -   video/ogg
    -   audio/mpeg
    -   audio/ogg
    -   audio/wav
    -   \*.wav
    -   \*.mp4
    -   \*.mp3
    -   \*.webm
    -   \*.ogg

### Configuring PDF.js library

Configure your webpack-enabled application with the PDF.js library as follows.

1.  Install pdfjs-dist

```sh
npm install pdfjs-dist
```

2.  Update `vendors.ts` by appending the following code. This will enable the [Viewer render component](viewer.component.md)
    and compatibility mode for all browsers. It will also configure the web worker for the PDF.js
    library to render PDF files in the background:

```ts
// PDF.js
require('pdfjs-dist/web/compatibility.js');
const pdfjsLib = require('pdfjs-dist');
pdfjsLib.PDFJS.workerSrc = './pdf.worker.js';
require('pdfjs-dist/web/pdf_viewer.js');
```

3.  Update the `plugins` section of the `webpack.common.js` file with the following lines:

```js
new CopyWebpackPlugin([
    ...
    {
        from: 'node_modules/pdfjs-dist/build/pdf.worker.js',
        to: 'pdf.worker.js'
    }
])
```

The [Viewer render component](viewer.component.md) should now be able to display PDF files.

### Extending the Viewer

#### Internal extension mechanism

The Viewer supports dynamically-loaded viewer preview extensions, to know more about it [Preview Extension component](../../extensions/components/preview-extension.component.md). This 

#### Code extension mechanism]

You can define your own custom handler to handle other file formats that are not yet supported by
the [Viewer render component](viewer.component.md). Below is an example that shows how to use the `adf-viewer-render-extension`
to handle 3D data files:

```html
<adf-viewer-render [nodeId]="nodeId">
    
    <adf-viewer-extension [supportedExtensions]="['obj','3ds']" #extension>
        <ng-template let-urlFileContent="urlFileContent" let-extension="extension">
            <threed-viewer 
                [urlFile]="urlFileContent" 
                [extension]="extension">
            </threed-viewer>
        </ng-template>
    </adf-viewer-extension>

</adf-viewer-render> 
```

Note: you need to add the `ng2-3d-editor` dependency to your `package.json` file to make the example above work.

You can define multiple `adf-viewer-render-extension` templates if required:

```html
<adf-viewer-render [nodeId]="nodeId">

    <adf-viewer-extension [supportedExtensions]="['xls','xlsx']" #extension>
        <ng-template let-urlFileContent="urlFileContent">
            <my-custom-xls-component 
                urlFileContent="urlFileContent">
            </my-custom-xls-component>
        </ng-template>
    </adf-viewer-extension>

    <adf-viewer-render-extension [supportedExtensions]="['txt']" #extension>
        <ng-template let-urlFileContent="urlFileContent" >               
            <my-custom-txt-component 
                urlFileContent="urlFileContent">
            </my-custom-txt-component>
        </ng-template>
    </adf-viewer-render-extension>
</adf-viewer-render> 
```

### Custom layout

The [Viewer render component](viewer.component.md) lets you transclude custom content in several different places as
explained in the sections below.

#### Custom zoom scaling

You can set a default zoom scaling value for pdf viewer by adding the following code in `app.config.json`.
Note: For the pdf viewer the value has to be within the range of 25 - 1000.

"adf-viewer-render": {
"pdf-viewer-scaling": 150
}

In the same way you can set a default zoom scaling value for the image viewer by adding the following code in `app.config.json`.

"adf-viewer-render": {
"image-viewer-scaling": 150
}

By default the viewer's zoom scaling is set to 100%.

## See also

-   [Alfresco Viewer component](../../content-services/components/document-list.component.md)
-   [Viewer Render component](../../core/components/viewer-render.component.md)
