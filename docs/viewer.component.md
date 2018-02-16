# Viewer component

Displays content from an ACS repository.

See it live: [Viewer Quickstart](https://embed.plnkr.co/iTuG1lFIXfsP95l6bDW6/)

## Contents

-   [Basic usage](#basic-usage)

    -   [Properties](#properties)
    -   [Events](#events)

-   [Details](#details)

    -   [Integrating with DocumentList component](#integrating-with-documentlist-component)
    -   [Supported file formats](#supported-file-formats)
    -   [PDF Conversion](#pdf-conversion)
    -   [Configuring PDF.js library](#configuring-pdfjs-library)
    -   [Custom toolbar](#custom-toolbar)
    -   [Custom sidebar](#custom-sidebar)
    -   [Custom "Open With" menu](#custom-open-with-menu)
    -   [Custom "More actions" menu](#custom-more-actions-menu)
    -   [Extending the Viewer](#extending-the-viewer)

## Basic usage

Using with node id:

```html
<adf-viewer 
    [showViewer]="true" 
    [overlayMode]="true" 
    [fileNodeId]="'d367023a-7ebe-4f3a-a7d0-4f27c43f1045'">
</adf-viewer>
```

Using with file url:

```html
<adf-viewer 
    [overlayMode]="true" 
    [urlFile]="'filename.pdf'">
</adf-viewer>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| urlFile | `string` | `''` | If you want to load an external file that does not come from ACS you can use this URL to specify where to load the file from. |
| urlFileViewer | `string` | `null` | Viewer to use with the `urlFile` address (`pdf`, `image`, `media`, `text`). Used when `urlFile` has no filename and extension. |
| blobFile | `Blob` |  | Loads a Blob File  |
| fileNodeId | `string` | `null` | Node Id of the file to load.  |
| sharedLinkId | `string` | `null` | Shared link id (to display shared file).  |
| overlayMode | `boolean` | `false` | If `true` then show the Viewer as a full page over the current content. Otherwise fit inside the parent div. |
| showViewer | `boolean` | `true` | Hide or show the viewer  |
| showToolbar | `boolean` | `true` | Hide or show the toolbar  |
| displayName | `string` |  | Specifies the name of the file when it is not available from the URL.  |
| allowGoBack | `boolean` | `true` | Allows `back` navigation  |
| allowDownload | `boolean` | `true` | Toggles downloading.  |
| allowPrint | `boolean` | `false` | Toggles printing.  |
| allowShare | `boolean` | `false` | Toggles sharing.  |
| allowFullScreen | `boolean` | `true` | Toggles the 'Full Screen' feature.  |
| allowNavigate | `boolean` | `false` | Toggles before/next navigation. You can use the arrow buttons to navigate between documents in the collection. |
| canNavigateBefore | `boolean` | `true` | Toggles the "before" ("&lt;") button. Requires `allowNavigate` to be enabled.  |
| canNavigateNext | `boolean` | `true` | Toggles the next (">") button. Requires `allowNavigate` to be enabled.  |
| allowSidebar | `boolean` | `false` | Toggles the sidebar.  |
| showSidebar | `boolean` | `false` | Toggles sidebar visibility. Requires `allowSidebar` to be set to `true`.  |
| sidebarPosition | `string` | `'right'` | The position of the sidebar. Can be `left` or `right`.  |
| sidebarTemplate | `TemplateRef<any>` | `null` | The template for the sidebar. The template context contains the loaded node data.  |
| allowThumbnails | `boolean` | `true` | Enables pdf viewer thumbnails.  |
| thumbnailsTemplate | `TemplateRef<any>` | `null` | Custom template content for thumbnails.  |
| mimeType | `string` |  | MIME type of the file content (when not determined by the filename extension).  |
| fileName | `string` |  | Content filename.  |
| downloadUrl | `string` | `null` | URL to download.  |
| maxRetries | `number` | `5` | Number of times the Viewer will retry fetching content Rendition. There is a delay of at least one second between attempts. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| goBack | `EventEmitter<BaseEvent<any>>` | Emitted when user clicks the 'Back' button. |
| download | `EventEmitter<BaseEvent<any>>` | Emitted when user clicks the 'Download' button. |
| print | `EventEmitter<BaseEvent<any>>` | Emitted when user clicks the 'Print' button. |
| share | `EventEmitter<BaseEvent<any>>` | Emitted when user clicks the 'Share' button. |
| showViewerChange | `EventEmitter<boolean>` | Emitted when the viewer is shown or hidden. |
| extensionChange | `EventEmitter<string>` | Emitted when the filename extension changes. |
| navigateBefore | `EventEmitter<{}>` | Emitted when user clicks 'Navigate Before' ("&lt;") button. |
| navigateNext | `EventEmitter<{}>` | Emitted when user clicks 'Navigate Next' (">") button. |

### Keyboard shortcuts

| Name | Description |
| ---- | ----------- |
| Esc | Close the viewer (overlay mode only). |
| Left | Invoke 'Navigate before' action. |
| Right | Invoke 'Navigate next' action. |
| Ctrl+F | Activate full-screen mode. |

## Details

### Integrating with DocumentList component

Below is the most simple integration of Viewer and DocumentList components within your custom component:

```html
<adf-document-list
    currentFolderId="-my-"
    (preview)="showPreview($event)">
</adf-document-list>

<adf-viewer
    [(showViewer)]="showViewer"
    [overlayMode]="true"
    [fileNodeId]="nodeId">
</adf-viewer>
```

And the component controller class implementation can look like the following:

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
<adf-viewer
    [displayName]="fileName"
    [allowGoBack]="false"
    [mimeType]="mimeType"
    [urlFile]="fileUrl">
</adf-viewer>
```

### Supported file formats

The Viewer component consists of separate Views that handle particular types of type families based on either a file extension or a mime type:

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

### Content Renditions

For those extensions and mime types that cannot be natively displayed in the browser, the Viewer will try to fetch corresponding rendition by utilising the [renditions service api](https://community.alfresco.com/docs/DOC-5879-rendition-service).

For the full list of supported types please refer to: [File types that support preview and thumbnail generation](http://docs.alfresco.com/5.2/references/valid-transformations-preview.html).

### Configuring PDF.js library

In order to configure your webpack-enabled application with the PDF.js library please follow the next steps.

Install pdfjs-dist

```sh
npm install pdfjs-dist
```

Update `vendors.ts` by appending the following:

```ts
// PDF.js
require('pdfjs-dist/web/compatibility.js');
const pdfjsLib = require('pdfjs-dist');
pdfjsLib.PDFJS.workerSrc = './pdf.worker.js';
require('pdfjs-dist/web/pdf_viewer.js');
```

The code above enables the "viewer" component and "compatibility" mode for all the browsers.
It also configures the web worker for PDF.js library to render PDF files in the background.

Update the `plugins` section of the `webpack.common.js` file with the next lines:

```js
new CopyWebpackPlugin([
    ...
    {
        from: 'node_modules/pdfjs-dist/build/pdf.worker.js',
        to: 'pdf.worker.js'
    }
])
```

The Viewer component now should be able displaying PDF files.

### Custom toolbar

You can replace standard viewer toolbar with your custom implementation.

```html
<adf-viewer>
    <adf-viewer-toolbar>
        <h1>toolbar</h1>
    </adf-viewer-toolbar>
</adf-viewer>
```

Everything you put inside the "adf-viewer-toolbar" tags is going to be rendered instead of the toolbar.

### Custom sidebar

The Viewer component also supports custom sidebar components and layouts.
The `allowSidebar` property should be set to `true` to enable this feature.

Custom sidebar for the viewer can be injected in two different ways:

-   using transclusion
-   using template **(only works when using the viewer with fileNodeId)**

#### Using transclusion

```html
<adf-viewer [allowSidebar]="true">
    <adf-viewer-sidebar>
        <h1>My info</h1>
    </adf-viewer-sidebar>
</adf-viewer>
```

Everything you put inside the "adf-viewer-sidebar" tags is going to be rendered.

#### Using template injection (only works when using the viewer with fileNodeId)

```html
<ng-template let-node="node" #sidebarTemplate>
    <adf-content-metadata-card [node]="node"></adf-content-metadata-card>
</ng-template>
<adf-viewer [allowSidebar]="true" [sidebarTemplate]="sidebarTemplate"></adf-viewer>
```

### Custom thumbnails

By default, the pdf viewer comes with its own thumbnails list but this can be replaced
by providing a custom template and binding to context property `viewer` to access PDFJS.PDFViewer
instance.

```javascript
import { Component, Input } from '@angular/core';

@Component({
    selector: 'custom-thumbnails',
    template: '<p> Custom Thumbnails Component </p>'
})
export class CustomThumbnailsComponent {
    @Input() pdfViewer: any;

    ...
}
```

```html
<ng-template let-pdfViewer="viewer" #customThumbnailsTemplate>
    <custom-thumbnails [pdfViewer]="pdfViewer"></custom-thumbnails>
</ng-template>

<adf-viewer [thumbnailsTemplate]="customThumbnailsTemplate"></adf-viewer>
```

### Custom "Open With" menu

You can enable custom "Open With" menu by providing at least one action inside the "adf-viewer-open-with" tag:

```html
<adf-viewer [fileNodeId]="nodeId">

    <adf-viewer-open-with>
        <button mat-menu-item>
            <mat-icon>dialpad</mat-icon>
            <span>Option 1</span>
        </button>
        <button mat-menu-item disabled>
            <mat-icon>voicemail</mat-icon>
            <span>Option 2</span>
        </button>
        <button mat-menu-item>
            <mat-icon>notifications_off</mat-icon>
            <span>Option 3</span>
        </button>
    </adf-viewer-open-with>

</adf-viewer>
```

![Open with](docassets/images/viewer-open-with.png)

### Custom "More actions" menu

You can enable custom "More actions" menu by providing at least one action inside the "adf-viewer-more-actions" tag:

```html
<adf-viewer [fileNodeId]="nodeId">

    <adf-viewer-more-actions>
        <button mat-menu-item>
            <mat-icon>dialpad</mat-icon>
            <span>Action One</span>
        </button>
        <button mat-menu-item disabled>
            <mat-icon>voicemail</mat-icon>
            <span>Action Two</span>
        </button>
        <button mat-menu-item>
            <mat-icon>notifications_off</mat-icon>
            <span>Action Three</span>
        </button>
    </adf-viewer-more-actions>

</adv-viewer>
```

![More actions](docassets/images/viewer-more-actions.png)

### Extending the Viewer

If you want to handle other file formats that are not yet supported by the Viewer component,
you can define your own custom handler.

Below you can find an example with the use of `adf-viewer-extension` if you can handle 3d files

```html
<adf-viewer [fileNodeId]="fileNodeId">
    
    <adf-viewer-extension [supportedExtensions]="['obj','3ds']" #extension>
        <ng-template let-urlFileContent="urlFileContent" let-extension="extension">
            <threed-viewer 
                [urlFile]="urlFileContent" 
                [extension]="extension">
            </threed-viewer>
        </ng-template>
    </adf-viewer-extension>

</adf-viewer> 
```

Note: you need adding `ng2-3d-editor` dependency to your `package.json` file to make the example above work.

It is possible to define multiple `adf-viewer-extension` templates:

```html
<adf-viewer [fileNodeId]="fileNodeId">

    <adf-viewer-extension [supportedExtensions]="['xls','xlsx']" #extension>
        <ng-template let-urlFileContent="urlFileContent">
            <my-custom-xls-component 
                urlFileContent="urlFileContent">
            </my-custom-xls-component>
        </ng-template>
    </adf-viewer-extension>

    <adf-viewer-extension [supportedExtensions]="['txt']" #extension>
        <ng-template let-urlFileContent="urlFileContent" >               
            <my-custom-txt-component 
                urlFileContent="urlFileContent">
            </my-custom-txt-component>
        </ng-template>
    </adf-viewer-extension>
</adf-viewer> 
```
