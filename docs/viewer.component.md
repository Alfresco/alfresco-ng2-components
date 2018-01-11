# Alfresco Viewer component

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

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| fileNodeId | string |  | Node Id of the file to load |
| urlFile | string |  | If you want to load an external file that does not come from ECM you can use this Url where to load the file |
| urlFileViewer | string | null | Viewer to use with the `urlFile` address (`pdf`, `image`, `media`, `text`). Used when `urlFile` has no filename and extension. |
| urlBlob | Blob |  | If you want to load a Blob File |
| overlayMode | boolean | false | If `true` show the Viewer full page over the present content otherwise will fit the parent div |
| showViewer | boolean | true | Hide or show the viewer |
| showToolbar | boolean | true | Hide or show the toolbar |
| displayName | string |  | You can specify the name of the file |
| allowGoBack | boolean | true | Allow `back` navigation |
| allowDownload | boolean | true | Toggle download feature |
| allowPrint | boolean | false | Toggle printing feature |
| allowShare | boolean | false | Toggle sharing feature |
| allowSidebar | boolean | false | Toggle sidebar feature |
| showSidebar | boolean | false | Toggles sidebar visibility. Requires `allowSidebar` to be set to `true`. |
| sidebarPosition | string | right | The position of the sidebar. Can be `left` or `right`. |
| sidebarTemplate | TemplateRef<any> | null | The template intended to be used as a sidebar. The template context contains the loaded node data. |

### Events

| Name | Argument Type | Cancelable | Description |
| ---- | ------------- | ---------- | ----------- |
| goBack | any | Yes | Raised when user clicks the 'Back' button. |
| download | any | Yes | Raised when user clicks the 'Download' button. |
| print | any | Yes | Raised when user clicks the 'Print' button. |
| share | any | Yes | Raised when user clicks the 'Share' button. |

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

### Supported file formats

| Type | Extension |
| ---- | --------- |
| Media | wav, Mp3, Mp4, WebM, Ogv |
| Images | png, jpg, jpeg, gif, bmp |
| Text | pdf, txt |

### PDF Conversion

For unsupported extensions or mime types the viewer will try to fetch PDF rendition utilising the [renditions service api](https://community.alfresco.com/docs/DOC-5879-rendition-service)

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
