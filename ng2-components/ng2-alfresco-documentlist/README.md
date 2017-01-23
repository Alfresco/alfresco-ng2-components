# DocumentList Component for Angular 2

<p>
  <a title='Build Status Travis' href="https://travis-ci.org/Alfresco/alfresco-ng2-components">
    <img src='https://travis-ci.org/Alfresco/alfresco-ng2-components.svg?branch=master'  alt='travis
    Status' />
  </a>
  <a title='Build Status AppVeyor' href="https://ci.appveyor.com/project/alfresco/alfresco-ng2-components">
    <img src='https://ci.appveyor.com/api/projects/status/github/Alfresco/alfresco-ng2-components'  alt='travis
    Status' />
  </a>
  <a href='https://codecov.io/gh/Alfresco/alfresco-ng2-components'>
    <img src='https://img.shields.io/codecov/c/github/Alfresco/alfresco-ng2-components/master.svg?maxAge=2592000' alt='Coverage Status' />
  </a>
  <a href='https://www.npmjs.com/package/ng2-alfresco-documentlist'>
    <img src='https://img.shields.io/npm/dt/ng2-alfresco-documentlist.svg' alt='npm downloads' />
  </a>
  <a href='https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE'>
     <img src='https://img.shields.io/hexpm/l/plug.svg' alt='license' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-component-green.svg?label=alfresco' alt='alfresco component' />
  </a>
  <a href='https://angular.io/'>
     <img src='https://img.shields.io/badge/style-2-red.svg?label=angular' alt='angular 2' />
  </a>
  <a href='https://www.typescriptlang.org/docs/tutorial.html'>
     <img src='https://img.shields.io/badge/style-lang-blue.svg?label=typescript' alt='typescript' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-%3E5.0.0-blue.svg?label=node%20version' alt='node version' />
  </a>
</p>

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration [prerequisites](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

Follow the 3 steps below:

1. Npm

    ```sh
    npm install ng2-alfresco-documentlist --save
    ```

2. Html

    Include these dependencies in your index.html page:

    ```html

      <!-- Google Material Design Lite -->
      <link rel="stylesheet" href="node_modules/material-design-lite/material.min.css">
      <script src="node_modules/material-design-lite/material.min.js"></script>
      <link rel="stylesheet" href="node_modules/material-design-icons/iconfont/material-icons.css">

      <!-- Polyfill(s) for Safari (pre-10.x) -->
      <script src="node_modules/intl/dist/Intl.min.js"></script>
      <script src="node_modules/intl/locale-data/jsonp/en.js"></script>

      <!-- Polyfill(s) for older browsers -->
      <script src="node_modules/core-js/client/shim.min.js"></script>
      <script src="//cdnjs.cloudflare.com/ajax/libs/dom4/1.8.3/dom4.js"></script>
      <script src="node_modules/element.scrollintoviewifneeded-polyfill/index.js"></script>

      <!-- Polyfill(s) for dialogs -->
      <script src="node_modules/dialog-polyfill/dialog-polyfill.js"></script>
      <link rel="stylesheet" type="text/css" href="node_modules/dialog-polyfill/dialog-polyfill.css" />
      <style>._dialog_overlay { position: static !important; } </style>

      <!-- Modules  -->
      <script src="node_modules/zone.js/dist/zone.js"></script>
      <script src="node_modules/reflect-metadata/Reflect.js"></script>
      <script src="node_modules/systemjs/dist/system.src.js"></script>

    ```

3. SystemJs

    Add the following components to your systemjs.config.js file:

    - ng2-translate
    - alfresco-js-api
    - ng2-alfresco-core
    - ng2-alfresco-datatable
    - ng2-alfresco-documentlist

    Please refer to the following example file: [systemjs.config.js](demo/systemjs
    .config.js) .

## Basic usage

```html
<alfresco-document-list
    #documentList
    [currentFolderId]="'-my-'"
    [contextMenuActions]="true"
    [contentActions]="true"
    [creationMenuActions]="true">
</alfresco-document-list>
```

Usage example of this component :

**main.ts**
```ts

import { NgModule, Component, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule } from 'ng2-alfresco-core';
import { DocumentListModule, DocumentList } from 'ng2-alfresco-documentlist';
import { AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';

@Component({
    selector: 'alfresco-app-demo',
    template: `
        <alfresco-document-list
            #documentList
            [currentFolderId]="'-my-'"
            [contextMenuActions]="true"
            [contentActions]="true"
            [creationMenuActions]="true">
        </alfresco-document-list>
    `
})
class DocumentListDemo {

    @ViewChild(DocumentList)
    documentList: DocumentListComponent;

    constructor(private authService: AlfrescoAuthenticationService, 
                private settingsService: AlfrescoSettingsService) {
        settingsService.ecmHost = 'http://localhost:8080';

        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                console.log(ticket);
                this.documentList.reload();
            },
            error => {
                console.log(error);
            });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        DocumentListModule.forRoot()
    ],
    declarations: [DocumentListDemo],
    bootstrap: [DocumentListDemo]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `currentFolderId` | string | null | Initial node ID of displayed folder. Can be `-root-`, `-shared-`, `-my-`, or a fixed node ID  |
| `folderNode` | `MinimalNodeEntryEntity` | null | Currently displayed folder node | 
| `navigate` | boolean | true | Toggles navigation to folder content or file preview |
| `navigationMode` | string (click\|dblclick) | dblclick | User interaction for folder navigation or file preview |
| `thumbnails` | boolean | false | Show document thumbnails rather than icons |
| `fallbackThubnail` | string |  | Fallback image for row ehre thubnail is missing|
| `multiselect` | boolean | false | Toggles multiselect mode |
| `contentActions` | boolean | false | Toggles content actions for each row |
| `contextMenuActions` | boolean | false | Toggles context menus for each row |
| `creationMenuActions` | boolean | true | Toggles the creation menu actions|
| `rowFilter` | `RowFilter` | | Custom row filter, [see more](#custom-row-filter).
| `imageResolver` | `ImageResolver` | | Custom image resolver, [see more](#custom-image-resolver).

### Events

| Name | Description |
| --- | --- |
| `nodeClick` | Emitted when user clicks the node |
| `nodeDblClick` | Emitted when user double-clicks the node |
| `folderChange` | Emitted upon display folder changed |
| `preview` | Emitted when document preview is requested either with single or double click |

_For a complete example source code please refer to 
[DocumentList Demo](https://github.com/Alfresco/alfresco-ng2-components/tree/master/ng2-components/ng2-alfresco-documentlist/demo) 
repository._

### Setting default folder

You can set current folder path by assigning a value for `currentFolderId` property. 
It can be either one of the well-known locations as **-root-**, **-shared-** or **-my-** or a node ID (guid).

There may be scenarios when it is needed to set default path based on relative string value rather than node ID.
For example when folder name or path is static but it's underlying ID is not (i.e. created manually by admin).
In this case you can use `alfresco-js-api` to get node details based on it's relative path.

Let's try setting default folder to `/Sites/swsdp/documentLibrary` without knowing it's ID beforehand.
For the sake of simplicity example below shows only main points you may need paying attention to:
 
```ts
import { ChangeDetectorRef } from '@angular/core';
import { AlfrescoApiService } from 'ng2-alfresco-core';

export class FilesComponent implements OnInit {

    currentFolderId: string = '-my-';

    constructor(private apiService: AlfrescoApiService,
                private changeDetector: ChangeDetectorRef) {
        // ...
    }

    ngOnInit() {
        let nodes: any = this.apiService.getInstance().nodes;
        nodes.getNodeInfo('-root-', {
            includeSource: true,
            include: ['path', 'properties'],
            relativePath: '/Sites/swsdp/documentLibrary'
        })
        .then(node => {
            console.log(node);
            this.currentFolderId = node.id;
            this.changeDetector.detectChanges();
        });
    }
}
```

We've added `console.log(node)` for the `getNodeInfo` callback just for study and debug purposes. 
It helps examining other valuable information you can have access to if needed:

![documentLibrary](docs/assets/documentLibrary.png)

**Important note**: for this particular scenario you must also trigger `changeDetector.detectChanges()` as in the example above. 

### Calling DocumentList api directly

Typically you will be binding DocumentList properties to your application/component class properties:

```html
<alfresco-document-list [currentFolderId]="myStartFolder"></alfresco-document-list>
```

with the underlying class being implemented similar to the following one:

```ts
@Component(...)
export class MyAppComponent {

    myStartFolder: string = '-my-';
    
}
```

However there may scenarios that require you direct access to DocumentList apis. 
You can get reference to the DocumentList instance by means of Angular **Component Interaction** API.
See more details in [Parent calls a ViewChild](https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#parent-to-view-child) 
section of the official docs.

Here's an example of getting reference:

```html
<alfresco-document-list 
    #documentList
    [currentFolderId]="myStartFolder">
</alfresco-document-list>
```

Note the `#documentList` ID we've just added to be able referencing this component later on.

```ts
import { ViewChild, AfterViewInit } from '@angular/core';
import { DocumentListComponent } from 'ng2-alfresco-documentlist';

@Component(...)
export class MyAppComponent implements AfterViewInit {

    myStartFolder: string = '-my-';
    
    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    ngAfterViewInit() {
        console.log(this.documentList);
    }
}
```

Example above should produce the following browser console output:

![view-child](docs/assets/viewchild.png)

Now you are able accessing DocumentList properties or calling methods directly.

```ts
// print currently displayed folder node object to console
console.log(documentList.folderNode);
```

**Important note**:  
It is important accessing child components at least at the `AfterViewInit` state. 
Any UI click (buttons, links, etc.) event handlers are absolutely fine. This cannot be `ngOnInit` event though.
You can get more details in [Component lifecycle hooks](https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html) article.

### Breadcrumb Component

DocumentList provides simple breadcrumb element to indicate the current position within a navigation hierarchy.

```html
<alfresco-document-list-breadcrumb
    [target]="documentList"
    [folderNode]="documentList.folderNode">
</alfresco-document-list-breadcrumb>
```

![Breadcrumb](docs/assets/breadcrumb.png)

#### Properties

| Name | Type | Description |
| --- | --- | --- |
| `target` | DocumentListComponent | DocumentList component to operate with. Upon clicks will instruct the given component to update. |
| `folderNode` | MinimalNodeEntryEntity | Active node, builds UI based on `folderNode.path.elements` collection. |

### Creation Menu Action

DocumentList provides simple creation menu actions that provide the action to create a new folder.

```html
<alfresco-document-menu-action 
    [folderId]="folderId">
</alfresco-document-menu-action>
```

![Creation Menu Action](docs/assets/document-list-creation-menu-actions-1.png)

When the "New Folder" button is pressed the dialog appears.

![Creation Menu Action](docs/assets/document-list-creation-menu-actions-2.png)


### Custom columns

It is possible to reorder, extend or completely redefine data columns displayed by the component.
By default special `$thumbnail` and `displayName` columns are rendered.

A custom set of columns can look like the following:

```html
<alfresco-document-list ...>
    <content-columns>
        <content-column key="$thumbnail" type="image"></content-column>
        <content-column 
            title="Name" 
            key="name" 
            sortable="true"
            class="full-width ellipsis-cell">
        </content-column>
        <content-column 
            title="Created By" 
            key="createdByUser.displayName"
            sortable="true"
            class="desktop-only">
        </content-column>
        <content-column 
            title="Created On" 
            key="createdAt" 
            type="date" 
            format="medium"
            sortable="true"
            class="desktop-only">
        </content-column>
    </content-columns>
</alfresco-document-list>
```

![Custom columns](docs/assets/custom-columns.png)


Binding to nested properties is also supported. Assuming you have the node structure similar to following:

```json
{
    "nodeRef": "workspace://SpacesStore/8bb36efb-c26d-4d2b-9199-ab6922f53c28",
    "nodeType": "cm:folder",
    "type": "folder",
    "location": {
        "repositoryId": "552ca13e-458b-4566-9f3e-d0f9c92facff",
        "site": "swsdp",
        "siteTitle": "Sample: Web Site Design Project"
    }
}
```

the binding value for the Site column to display location site will be `location.site`:

```html
<alfresco-document-list ...>
    <content-columns>
        <content-column key="$thumbnail" type="image"></content-column>
        <content-column title="Name" key="displayName" class="full-width ellipsis-cell"></content-column>
        <content-column title="Site" key="location.site"></content-column>
    </content-columns>
</alfresco-document-list>
```

### Column definition

Properties:

| Name | Type | Default | Description
| --- | --- | --- | --- |
| `title` | string | | Column title |
| `sr-title` | string | | Screen reader title, used only when `title` is empty |
| `key` | string | | Column source key, example: `createdByUser.displayName` |
| `sortable` | boolean | false | Toggle sorting ability via column header clicks |
| `class` | string | | CSS class list, example: `full-width ellipsis-cell` |
| `type` | string | text | Column type, text\|date\|number |
| `format` | string | | Value format pattern |
| `template` | `TemplateRef<any>` | | Column template |

For `date` column type the [DatePipe](https://angular.io/docs/ts/latest/api/common/DatePipe-class.html) formatting is used.
For a full list of available `format` values please refer to [DatePipe](https://angular.io/docs/ts/latest/api/common/DatePipe-class.html) documentation.

#### Column Template

It is possible providing custom column/cell template that may contain other Angular components or HTML elmements:

```html
<content-column
        title="{{'DOCUMENT_LIST.COLUMNS.DISPLAY_NAME' | translate}}"
        key="name"
        sortable="true"
        class="full-width ellipsis-cell">
    <template let-entry="$implicit">
        <span>Hi! {{entry.data.getValue(entry.row, entry.col)}}</span>
    </template>
</content-column>
```

### Actions

DocumentList supports declarative actions for Documents and Folders.
Each action can be bound to either default out-of-box handler or a custom behavior.
You can define both folder and document actions at the same time.

#### Menu actions

```html
<alfresco-document-list ...>
    <content-actions>

        <content-action
            target="document"
            title="System action"
            handler="system2">
        </content-action>

        <content-action
            target="document"
            title="Custom action"
            (execute)="myCustomAction1($event)">
        </content-action>

    </content-actions>
</alfresco-document-list>
```

```ts
export class MyView {
    // ...

    myCustomAction1(event) {
        let entry = event.value.entry;
        alert(`Custom document action for ${entry.name}`);
    }
}
```

All document actions are rendered as a dropdown menu as on the picture below:

![Document Actions](docs/assets/document-actions.png)


#### Default action handlers

The following action handlers are provided out-of-box:

- **Download** (document)
- **Delete** (document, folder)

All system handler names are case-insensitive, `handler="download"` and `handler="DOWNLOAD"`
will trigger the same `download` action.

##### Download

Initiates download of the corresponding document file.

```html
<alfresco-document-list ...>
    <content-actions>

        <content-action
            target="document"
            title="Download"
            handler="download">
        </content-action>

    </content-actions>
</alfresco-document-list>
```

![Download document action](docs/assets/document-action-download.png)


#### Folder actions

Folder actions have the same declaration as document actions except ```taget="folder"``` attribute value.

```html
<alfresco-document-list ...>
    <content-actions>

        <content-action
            target="folder"
            title="Default folder action 1"
            handler="system1">
        </content-action>

        <content-action
            target="folder"
            title="Custom folder action"
            (execute)="myFolderAction1($event)">
        </content-action>

    </content-actions>
</alfresco-document-list>
```

```ts
export class MyView {
    // ...

    myFolderAction1(event) {
        let entry = event.value.entry;
        alert(`Custom folder action for ${entry.name}`);
    }
}
```

![Folder Actions](docs/assets/folder-actions.png)

### Context Menu

DocumentList also provide integration for 'Context Menu Service' from the 
[ng2-alfresco-core](https://www.npmjs.com/package/ng2-alfresco-core) library.

You can automatically turn all menu actions (for the files and folders) 
into context menu items like shown below:

![Folder context menu](docs/assets/folder-context-menu.png)

Enabling context menu is very simple:

```ts
@Component({
    selector: 'my-view',
    template: `
        <alfresco-document-list>...</alfresco-document-list>
        <context-menu-holder></context-menu-holder>
    `
})
export class MyView {
}
```

This enables context menu items for documents and folders.

### Navigation mode

By default DocumentList component uses 'double-click' mode for navigation.
That means user will see the contents of the folder by double-clicking its name
or icon (similar to Google Drive behaviour). However it is possible switching to 
other modes, like single-click navigation for example.
 
The following navigation modes are supported:

- **click**
- **dblclick**

The following example switches navigation to single clicks:

```html
<alfresco-document-list [navigationMode]="'click'">
</alfresco-document-list>
```

### Events

DocumentList emits the following events:

| Name | Description |
| --- | --- |
| `nodeClick` | emitted when user clicks a list node |
| `nodeDblClick` | emitted when user double-clicks list node |
| `folderChange` | emitted once current display folder has changed |
| `preview` | emitted when user acts upon files with either single or double click (depends on `navigation-mode`), recommended for Viewer components integration  |

## Advanced usage and customization

### Custom row filter

You can create a custom row filter implementation that returns `true` if row should be displayed or `false` to hide it.
Typical row filter implementation is a function that receives `ShareDataRow` as parameter:

```ts
myFilter(row: ShareDataRow): boolean {
    return true;
}
```

_Note that for the sake of simplicity the example code below was reduced to the main points of interest only._

**View1.component.html**
```html
<alfresco-document-list 
    [rowFilter]="folderFilter">
</alfresco-document-list>
```

**View1.component.ts**
```ts

import { RowFilter, ShareDataRow } from 'ng2-alfresco-documentlist';

export class View1 {

    folderFilter: RowFilter;

    constructor() {
    
        // This filter will make document list show only folders
        
        this.folderFilter = (row: ShareDataRow) => {
            let node = row.node.entry;
            
            if (node && node.isFolder) {
                return true;
            }
            
            return false;
        };
    }
}
```

### Custom image resolver

You can create a custom image resolver implementation and take full control over how folder/file icons and thumbnails 
are resolved and what document list should display. 

**Image resolvers are executed only for columns of the `image` type.**

Typical image resolver implementation is a function that receives `DataRow` and `DataColumn` as parameters:

```ts
myImageResolver(row: DataRow, col: DataColumn): string {
    return '/path/to/image';
}
```

Your function can return `null` or `false` values to fallback to default image resolving behavior.

_Note that for the sake of simplicity the example code below was reduced to the main points of interest only._

**View1.component.html**
```html
<alfresco-document-list 
    [imageResolver]="folderImageResolver">
    
    <content-columns>
        <content-column key="name" type="image"></content-column>
    </content-columns>
    
    
</alfresco-document-list>
```

**View1.component.ts**
```ts
import { DataColumn, DataRow } from 'ng2-alfresco-datatable';
import { ImageResolver } from 'ng2-alfresco-documentlist';

export class View1 {

    folderImageResolver: ImageResolver;
    
    constructor() {
        
        // Customize folder icons, leave file icons untouched
        
        this.folderImageResolver = (row: DataRow, col: DataColumn) => {
            let isFolder = <boolean> row.getValue('isFolder');
            if (isFolder) {
                
                // (optional) You may want dynamically getting the column value
                let name = row.getValue(col.key);
                
                // Format image url
                return `http://<my custom path to folder icon>/${name}`;
            }
            
            // For the rest of the cases just fallback to default behaviour.
            return null;
        };
        
    }

}
```

### Hiding columns on small screens

You can hide columns on small screens by means of custom CSS rules:

```css
@media all and (max-width: 768px) {

    alfresco-document-list >>> th.desktop-only .cell-value {
        display: none;
    }

    alfresco-document-list >>> td.desktop-only .cell-value {
        display: none;
    }
}
```

Now you can declare columns and assign `desktop-only` class where needed:

```html
<alfresco-document-list ...>
    <content-columns>
        
        <!-- always visible columns -->
        
        <content-column key="$thumbnail" type="image"></content-column>
        <content-column 
                title="Name" 
                key="name" 
                class="full-width ellipsis-cell">
        </content-column>
        
        <!-- desktop-only columns -->
        
        <content-column
                title="Created by"
                key="createdByUser.displayName"
                class="desktop-only">
        </content-column>
        <content-column
                title="Created on"
                key="createdAt"
                type="date"
                format="medium"
                class="desktop-only">
        </content-column>
    </content-columns>
</alfresco-document-list>
```

**Desktop View**

![Responsive Desktop](docs/assets/responsive-desktop.png)

**Mobile View**

![Responsive Mobile](docs/assets/responsive-mobile.png)

### Custom 'empty folder' template

By default DocumentList provides the following content for the empty folder:

![Default empty folder](docs/assets/empty-folder-template-default.png)

This can be changed by means of the custom html template:

```html
<alfresco-document-list ...>
    <empty-folder-content>
        <template>
            <h1>Sorry, no content here</h1>
        </template>
    </empty-folder-content>
</alfresco-document-list>
```

That will give the following output:

![Custom empty folder](docs/assets/empty-folder-template-custom.png)

### Customizing default actions

It is possible extending or replacing the list of available system actions for documents and folders.
Actions for the documents and folders can be accessed via the following services:

- `DocumentActionsService`, document action menu and quick document actions
- `FolderActionsService`, folder action menu and quick folder actions

Example below demonstrates how a new action handler can be registered with the
`DocumentActionsService`.

```html
<alfresco-document-list ...>
    <content-actions>

        <content-action
            target="document"
            title="My action"
            handler="my-handler">
        </content-action>

    </content-actions>
</alfresco-document-list>
```

You register custom handler called `my-handler` that will be executing `myDocumentActionHandler`
function each time upon being invoked.

```ts
import { DocumentActionsService } from 'ng2-alfresco-documentlist';

export class MyView {

    constructor(documentActions: DocumentActionsService) {
        documentActions.setHandler(
            'my-handler',
            this.myDocumentActionHandler.bind(this)
        );
    }

    myDocumentActionHandler(obj: any) {
        window.alert('my custom action handler');
    }
}
```

The same approach allows changing the way out-of-box action handlers behave.
Registering custom action with the name `download` replaces default one:

```ts
export class MyView {

    constructor(documentActions: DocumentActionsService) {
        documentActions.setHandler(
            'download',
            this.customDownloadBehavior.bind(this)
        );
    }

    customDownloadBehavior(obj: any) {
        window.alert('my custom download behavior');
    }
}
```

Typically you may want populating all your custom actions at the application root level or
by means of custom application service.

## Build from sources

Alternatively you can build component from sources with the following commands:


```sh
npm install
npm run build
```

### Build the files and keep watching for changes

```sh
npm run build:w
```

## Running unit tests

```sh
npm test
```

### Running unit tests in browser

```sh
npm test-browser
```

This task rebuilds all the code, runs tslint, license checks and other quality check tools
before performing unit testing.

### Code coverage

```sh
npm run coverage
```

## Demo

If you want have a demo of how the component works, please check the demo folder :

```sh
cd demo
npm install
npm start
```

## NPM scripts

| Command | Description |
| --- | --- |
| npm run build | Build component |
| npm run build:w | Build component and keep watching the changes |
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)