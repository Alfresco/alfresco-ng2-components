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
necessary configuration, see this [page](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

```sh
npm install --save ng2-alfresco-documentlist
```

### Dependencies

Add the following dependency to your index.html:

```html
<script src="node_modules/alfresco-js-api/dist/alfresco-js-api.js"></script>
```

The following component needs to be added to your `systemjs.config.js` file: 

- [ng2-translate](https://github.com/ocombe/ng2-translate)
- [ng2-alfresco-core](https://www.npmjs.com/package/ng2-alfresco-core)
- [ng2-alfresco-datatable](https://www.npmjs.com/package/ng2-alfresco-datatable)

You can get more details in the 
[example implementation](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-alfresco-documentlist/demo/systemjs.config.js).

#### Material Design Lite

The style of this component is based on [material design](https://getmdl.io/), so if you want to visualize it correctly you have to add the material
design dependency to your project:

```sh
npm install --save material-design-icons material-design-lite
```

Also make sure you include these dependencies in your `index.html` file:

```html
<!-- Google Material Design Lite -->
<link rel="stylesheet" href="node_modules/material-design-lite/material.min.css">
<script src="node_modules/material-design-lite/material.min.js"></script>
<link rel="stylesheet" href="node_modules/material-design-icons/iconfont/material-icons.css">
```

## Basic usage

```html
<alfresco-document-list
    #documentList
    [currentFolderPath]="currentPath"
    [contextMenuActions]="true"
    [contentActions]="true"
    [multiselect]="true"
    (folderChange)="onFolderChanged($event)">
</alfresco-document-list>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| navigate | boolean | true | Toggles navigation to folder content or file preview |
| navigationMode | string (click\|dblclick) | dblclick | User interaction for folder navigation or file preview |
| thumbnails | boolean | false | Show document thumbnails rather than icons |
| fallbackThubnail | string |  | Fallback image for row ehre thubnail is missing|
| multiselect | boolean | false | Toggles multiselect mode |
| contentActions | boolean | false | Toggles content actions for each row |
| contextMenuActions | boolean | false | Toggles context menus for each row |
| rowFilter | `RowFilter` | | Custom row filter, [see more](#custom-row-filter).
| imageResolver | `ImageResolver` | | Custom image resolver, [see more](#custom-image-resolver).

### Events

| Name | Description |
| --- | --- |
| nodeClick | Emitted when user clicks the node |
| nodeDblClick | Emitted when user double-clicks the node |
| folderChange | Emitted upon display folder changed |
| preview | Emitted when document preview is requested either with single or double click |


_For a complete example source code please refer to 
[DocumentList Demo](https://github.com/Alfresco/alfresco-ng2-components/tree/master/ng2-components/ng2-alfresco-documentlist/demo) 
repository._

### Breadcrumb

DocumentList provides simple breadcrumb element to indicate the current position within a navigation hierarchy.

```html
<alfresco-document-list-breadcrumb
    [target]="documentList">
</alfresco-document-list-breadcrumb>
```

![Breadcrumb](docs/assets/breadcrumb.png)

Parent folder button is not displayed when breadcrumb is enabled.

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

HTML attributes:

| Name | Type | Default | Description
| --- | --- | --- | --- |
| title | string | | Column title |
| sr-title | string | | Screen reader title, used only when `title` is empty |
| key | string | | Column source key, example: `createdByUser.displayName` |
| sortable | boolean | false | Toggle sorting ability via column header clicks |
| class | string | | CSS class list, example: `full-width ellipsis-cell` |
| type | string | text | Column type, text\|date\|number |
| format | string | | Value format pattern |

For `date` column type the [DatePipe](https://angular.io/docs/ts/latest/api/common/DatePipe-class.html) formatting is used.
For a full list of available `format` values please refer to [DatePipe](https://angular.io/docs/ts/latest/api/common/DatePipe-class.html) documentation.

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
import {
    CONTEXT_MENU_DIRECTIVES,
    CONTEXT_MENU_PROVIDERS
} from 'ng2-alfresco-core';

import {
    DOCUMENT_LIST_DIRECTIVES,
    DOCUMENT_LIST_PROVIDERS
} from 'ng2-alfresco-documentlist';

@Component({
    selector: 'my-view',
    template: `
        <alfresco-document-list>...</alfresco-document-list>
        <context-menu-holder></context-menu-holder>
    `,
    directives: [DOCUMENT_LIST_DIRECTIVES, CONTEXT_MENU_DIRECTIVES],
    providers: [DOCUMENT_LIST_PROVIDERS, CONTEXT_MENU_PROVIDERS]
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
| nodeClick | emitted when user clicks a list node |
| nodeDblClick | emitted when user double-clicks list node |
| folderChange | emitted once current display folder has changed |
| preview | emitted when user acts upon files with either single or double click (depends on `navigation-mode`), recommended for Viewer components integration  |

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
import {
    DocumentActionsService
} from 'ng2-alfresco-documentlist';

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

You can build component from sources with the following commands:

```sh
npm install
npm run build
```

### Build the files and keep watching for changes

```sh
$ npm run build:w
```
    
### Running unit tests

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
