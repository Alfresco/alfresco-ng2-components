---
Title: Document List component
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-12
---

# [Document List component](../../lib/content-services/document-list/components/document-list.component.ts "Defined in document-list.component.ts")

Displays the documents from a repository.

![Custom columns](../docassets/images/custom-columns.png)

## Contents

-   [Basic Usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [Details](#details)
    -   [DOM Events](#dom-events)
    -   [Conditional visibility](#conditional-visibility)
    -   [Card view](#card-view)
    -   [Pagination strategy](#pagination-strategy)
    -   [Data Sources](#data-sources)
    -   [Setting default folder](#setting-default-folder)
    -   [Calling DocumentList api directly](#calling-documentlist-api-directly)
    -   [Underlying node object](#underlying-node-object)
    -   [Custom columns](#custom-columns)
    -   [Date Column](#date-column)
    -   [Location Column](#location-column)
    -   [Actions](#actions)
    -   [Navigation mode](#navigation-mode)
-   [Advanced usage and customization](#advanced-usage-and-customization)
    -   [Custom row filter](#custom-row-filter)
    -   [Custom image resolver](#custom-image-resolver)
    -   [Custom 'empty folder' template](#custom-empty-folder-template)
    -   [Custom 'permission denied' template](#custom-permission-denied-template)
-   [See also](#see-also)

## Basic Usage

```html
<adf-document-list
    #documentList
    [currentFolderId]="'-my-'"
    [contextMenuActions]="true"
    [contentActions]="true">
</adf-document-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| allowDropFiles | `boolean` | false | Toggle file drop support for rows (see [Upload Directive](../core/upload.directive.md) for further details) |
| contentActions | `boolean` | false | Toggles content actions for each row |
| contentActionsPosition | `string` | "right" | Position of the content actions dropdown menu. Can be set to "left" or "right". |
| contextMenuActions | `boolean` | false | Toggles context menus for each row |
| currentFolderId | `string` | null | The ID of the folder node to display or a reserved string alias for special sources |
| display | `string` | DisplayMode.List | Change the display mode of the table. Can be "list" or "gallery". |
| emptyFolderImageUrl | `string` |  | Custom image for empty folder. Default value: './assets/images/empty_doc_lib.svg' |
| enableInfiniteScrolling | `boolean` | false | (**Deprecated:** 2.3.0) Set document list to work in infinite scrolling mode |
| folderNode | [`MinimalNodeEntryEntity`](../content-services/document-library.model.md) | null | (**Deprecated:** 2.3.0 - use currentFolderId or node) Currently displayed folder node |
| imageResolver | `any \| null` | null | Custom image resolver |
| includeFields | `string[]` |  | Include additional information about the node in the server request. For example: association, isLink, isLocked and others. |
| loading | `boolean` | false | Toggles the loading state and animated spinners for the component. Used in combination with `navigate=false` to perform custom navigation and loading state indication. |
| locationFormat | `string` | "/" | The default route for all the location-based columns (if declared). |
| maxItems | `number` |  | Default value is stored into user preference settings use it only if you are not using the pagination |
| multiselect | `boolean` | false | Toggles multiselect mode |
| navigate | `boolean` | true | Toggles navigation to folder content or file preview |
| navigationMode | `string` |  | User interaction for folder navigation or file preview. Valid values are "click" and "dblclick". Default value: "dblclick" |
| node | [`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts) | null | The Document list will show all the nodes contained in the [NodePaging](../../lib/content-services/document-list/models/document-library.model.ts) entity |
| permissionsStyle | [`PermissionStyleModel`](../../lib/content-services/document-list/models/permissions-style.model.ts)`[]` | \[] | Define a set of CSS styles to apply depending on the permission of the user on that node. See the [Permission Style model](../../lib/content-services/document-list/models/permissions-style.model.ts) page for further details and examples. |
| rowFilter | `any \| null` | null | Custom row filter |
| rowStyle | `string` |  | The inline style to apply to every row. See the Angular NgStyle docs for more details and usage examples. |
| rowStyleClass | `string` |  | The CSS class to apply to every row |
| selectionMode | `string` | "single" | Row selection mode. Can be null, `single` or `multiple`. For `multiple` mode, you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows. |
| showHeader | `boolean` | true | Toggles the header |
| skipCount | `number` | 0 | (**Deprecated:** 2.3.0 - define it in pagination) Number of elements to skip over for pagination purposes |
| sorting | `string[]` | ['name', 'asc'] | Defines default sorting. The format is an array of 2 strings `[key, direction]` i.e. `['name', 'desc']` or `['name', 'asc']`. Set this value only if you want to override the default sorting detected by the component based on columns. |
| sortingMode | `string` | "client" | Defines sorting mode. Can be either `client` (items in the list are sorted client-side) or `server` (the ordering supplied by the server is used without further client-side sorting). Note that the `server` option _does not_ request the server to sort the data before delivering it. |
| thumbnails | `boolean` | false | Show document thumbnails rather than icons |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the API fails to get the Document List data |
| folderChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`NodeEntryEvent`](../../lib/content-services/document-list/components/node.event.ts)`>` | Emitted when the current display folder changes |
| nodeClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`NodeEntityEvent`](../../lib/content-services/document-list/components/node.event.ts)`>` | Emitted when the user clicks a list node |
| nodeDblClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`NodeEntityEvent`](../../lib/content-services/document-list/components/node.event.ts)`>` | Emitted when the user double-clicks a list node |
| preview | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`NodeEntityEvent`](../../lib/content-services/document-list/components/node.event.ts)`>` | Emitted when the user acts upon files with either single or double click (depends on `navigation-mode`). Useful for integration with the [Viewer component](../core/viewer.component.md). |
| ready | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`NodePaging`](../../lib/content-services/document-list/models/document-library.model.ts)`>` | Emitted when the Document List has loaded all items and is ready for use |

## Details

The properties `currentFolderId`, `folderNode` and `node` set the initial folder shown by
the Document List. They cannot be used together, so choose the one that suits your use case
best.
Document list will automatically show special icons for : `Smart Folder`, `Link to a Folder` and `Folder with rules` as showed in the picture below : 

![Document List Folders](../docassets/images/document-list-special-folder-icon.png)

### DOM Events

Below are the DOM events the DocumentList component emits.
All of them are _bubbling_, meaning you can handle them in any component up the parent hierarchy, even if the DocumentList is wrapped by one or more other components.

| Name | Description |
| ---- | ----------- |
| node-click | Emitted when user clicks the node |
| node-dblclick | Emitted when user double-clicks the node |
| node-select | Emitted when user selects a node |
| node-unselect | Emitted when user unselects a node |

Every event is represented by a [CustomEvent](https://developer.mozilla.org/en/docs/Web/API/CustomEvent) instance. Each event will
have at least the following properties as part of the `Event.detail` property value:

```ts
{
    sender: DocumentListComponent,
    node: MinimalNodeEntity
}
```

See the [DataTable](../core/datatable.component.md) documentation for further details about
the other DOM events that the [Document List component](../content-services/document-list.component.md) bubbles up from the DataTable.

Below is a basic example of handling DOM events in the parent elements.

```html
<div (node-click)="onNodeClicked($event)" 
(node-dblclick)="onNodeDblClicked($event)">
    <div>
        <adf-upload-drag-area ...>
             <adf-document-list ...>
                ...
             </adf-document-list>
        </adf-upload-drag-area>
    </div>
</div>
```

### Conditional visibility

You can use `ngIf` directives to provide conditional visibility support for the columns:

```html
<data-column
    *nfIg="showNameColumn"
    key="name"
    title="MY.RESOURCE.KEY">
</data-column>
```

### Card view

The Document List has an option to display items as "cards" instead of the
standard view:

![card-view](../docassets/images/document-list-card-view.png)

Set the `[display]` property to "gallery" to enable card view mode:

```html
<adf-document-list
    [currentFolderId]="'-my-'"
    [display]="'gallery'">
</adf-document-list>
```

### Pagination strategy

The Document List by default supports 2 types of pagination: **finite** and **infinite**: 

-   With **finite** pagination, the Document List needs 2 parameters: `maxItems` and `skipCount`. These set the maximum number of items shown in a single page and the start
    offset of the first item in the page (ie, the number of items you need to skip to get there).
-   You can enable **infinite** pagination by setting the same parameters plus an extra third
    parameter: `enableInfiniteScrolling`.

### Data Sources

You can use any of the following options to set the folder that the Document List will display:

#### Node ID

The unique identifier of the Node. Gets automatically updated when you perform navigation to other folders.

#### Repository aliases

You can use one of the well-known reserved aliases:

-   `-root-`
-   `-shared-`
-   `-my-`

#### Document List aliases

The [Document List component](../content-services/document-list.component.md) also provides support for the following reserved aliases:

-   `-trashcan-`,
-   `-sharedlinks-`
-   `-sites-`
-   `-mysites-`
-   `-favorites-`
-   `-recent-`

Note that due to the nature of the data, these sources do not support navigation.
You may want to handle single and double clicks yourself to perform navigation to other sources.

The [Document List component](../content-services/document-list.component.md) supports default presets for all the custom sources mentioned earlier.
If you don't provide any custom column definition with the [Data Column](#custom-columns)
component then a default preset will be automatically used at runtime.

Some of the presets use the Location columns that allow you to navigate to the parent folder of the node
(eg, navigating from the "Favorite" node to the folder that contains it).
You can set the default location format using the `locationFormat` property to avoid redefining the entire column layout.

The default column layout for non-reserved views is:

-   Icon
-   Name
-   Size
-   Modified (date)
-   Modified by

**Trashcan**

```html
<adf-document-list
    currentFolderId="-trashcan-"
    locationFormat="/files">
</adf-document-list>
```

Default layout:

-   Icon
-   Name
-   Location
-   Size
-   Deleted
-   Deleted by

**Shared Links**

```html
<adf-document-list
    currentFolderId="-sharedlinks-"
    locationFormat="/files">
</adf-document-list>
```

Default layout:

-   Icon
-   Name
-   Location
-   Size
-   Modified
-   Modified by
-   Shared by

**Sites**

```html
<adf-document-list
    currentFolderId="-sites-">
</adf-document-list>
```

Default layout:

-   Icon
-   Title
-   Status

**My Sites**

```html
<adf-document-list
    currentFolderId="-mysites-">
</adf-document-list>
```

Default layout:

-   Icon
-   Title
-   Status

**Favorites**

```html
<adf-document-list
    currentFolderId="-favorites-"
    locationFormat="/files">
</adf-document-list>
```

Default layout:

-   Icon
-   Name
-   Location
-   Size
-   Modified
-   Modified by

**Recent Files**

```html
<adf-document-list
    currentFolderId="-recent-"
    locationFormat="/files">
</adf-document-list>
```

Default layout:

-   Icon
-   Name
-   Location

### Setting default folder

You can set the current folder path by assigning a value to the `currentFolderId` property. 
It can be either one of the well-known locations (such as **-root-**, **-shared-** or **-my-**),
or a node ID (guid).

There may be scenarios where you need to set the default path based on a relative string value rather than a node ID.
This might happen, for example, when the folder name or path is static but its underlying ID
is not (i.e. created manually by admin).
In this case you can use the `alfresco-js-api` to get the details of a node based on its
relative path.

The example below shows how to set the default folder to `/Sites/swsdp/documentLibrary`
without knowing its ID beforehand. For the sake of simplicity, the example below shows only the main
points you should pay attention to:

```ts
import { ChangeDetectorRef } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';

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

```html
<adf-document-list
    [currentFolderId]="currentFolderId">
</adf-document-list>
```

The `console.log(node)` for the `getNodeInfo` callback is just for study and debug purposes. 
It is useful for examining other information that you can access if necessary:

![documentLibrary](../docassets/images/documentLibrary.png)

**Important note**: for this particular scenario you must also trigger `changeDetector.detectChanges()` as in the example above. 

### Calling DocumentList api directly

Typically you will bind Document List properties to your application/component class properties:

```html
<adf-document-list 
    [currentFolderId]="myStartFolder">
</adf-document-list>
```

...with the underlying class implemented as in the following example:

```ts
@Component(...)
export class MyAppComponent {

    myStartFolder: string = '-my-';
    
}
```

However there may be scenarios where you need direct access to the Document List APIs. 
You can get a reference to the Document List instance using the Angular **Component Interaction** API.
See the [Parent calls a ViewChild](https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#parent-to-view-child) 
section of the Angular docs for more information.

Below is an example of getting a reference:

```html
<adf-document-list 
    #documentList
    [currentFolderId]="myStartFolder">
</adf-document-list>
```

Note that the `#documentList` ID allows the component to be referenced elsewhere.

```ts
import { ViewChild, AfterViewInit } from '@angular/core';
import { DocumentListComponent } from '@alfresco/adf-content-services';

@Component({...})
export class MyAppComponent implements AfterViewInit {

    myStartFolder: string = '-my-';
    
    @ViewChild(DocumentListComponent)
    documentList: DocumentListComponent;

    ngAfterViewInit() {
        console.log(this.documentList);
    }
}
```

The example above should produce the following browser console output:

![view-child](../docassets/images/viewchild.png)

Now you can access Document List properties or call methods directly:

```ts
// print currently displayed folder node object to console
console.log(documentList.folderNode);
```

**Important note**:  
You must not access child components any earlier in the component lifecycle than
the `AfterViewInit` state. Any UI click (buttons, links, etc.) event handlers are fine but
an earlier event like `ngOnInit` is not.
See the Angular
[Component lifecycle hooks](https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html)
documentation for a full explanation of the component lifecycle.

### Underlying node object

The [Document List component](../content-services/document-list.component.md) assigns an instance of 
[MinimalNode](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/MinimalNode.md)
(defined in the [Alfresco JS API](https://github.com/Alfresco/alfresco-js-api)) as the data context
for each row. You can make use of the properties of this object when defining custom columns:

```js
export interface MinimalNode {
    id: string;
    parentId: string;
    name: string;
    nodeType: string;
    isFolder: boolean;
    isFile: boolean;
    modifiedAt: Date;
    modifiedByUser: UserInfo;
    createdAt: Date;
    createdByUser: UserInfo;
    content: ContentInfo;
    path: PathInfoEntity;
    properties: NodeProperties;
}
```

Binding to nested properties is also supported. You can define a column key as a property path similar to the following:

```text
createdByUser.displayName
```

Here's a short example:

```html
<adf-document-list ...>
    <data-columns>
        <data-column key="$thumbnail" type="image"></data-column>
        <data-column title="Name" key="name" class="full-width ellipsis-cell"></data-column>
        <data-column
            title="Created By" 
            key="createdByUser.displayName">
        </data-column>
    </data-columns>
</adf-document-list>
```

### Custom columns

You can reorder, extend or completely redefine data columns displayed by the component.
By default, special `$thumbnail` and `displayName` columns are rendered.

A custom set of columns might look like the following:

```html
<adf-document-list ...>
    <data-columns>
        <data-column key="$thumbnail" type="image"></data-column>
        <data-column
            title="Name" 
            key="name" 
            sortable="true"
            class="full-width ellipsis-cell">
        </data-column>
        <data-column
            title="Created By" 
            key="createdByUser.displayName"
            sortable="true"
            class="desktop-only">
        </data-column>
        <data-column
            title="Created On" 
            key="createdAt" 
            type="date" 
            format="medium"
            sortable="true"
            class="desktop-only">
        </data-column>
    </data-columns>
</adf-document-list>
```

![Custom columns](../docassets/images/custom-columns.png)

You can also use the HTML-based schema declaration used by
[DataTable](../core/datatable.component.md), [Task List](../process-services/task-list.component.md) and other components:

```html
<adf-datatable [data]="data" ...>
    <data-columns>
        <data-column type="image" key="icon" [sortable]="false"></data-column>
        <data-column key="id" title="Id"></data-column>
        <data-column key="createdOn" title="Created"></data-column>
        <data-column key="name" title="Name" class="full-width name-column"></data-column>
        <data-column key="createdBy.name" title="Created By"></data-column>
    </data-columns>
</adf-datatable>
```

You can also add tooltips, styling, automatic column title translation and other features. See the [DataColumn component page](../core/data-column.component.md) for more information about specifying and customizing columns.

### Date Column

For the `date` column type, the Angular [DatePipe](https://angular.io/docs/ts/latest/api/common/DatePipe-class.html) formatting is used.
See the [DatePipe](https://angular.io/docs/ts/latest/api/common/DatePipe-class.html) documentation
for a full list of `format` values it supports.

ADF also supports an additional `timeAgo` value for the `format` property.
This renders date values using the popular
["Time from now"](https://momentjs.com/docs/#/displaying/fromnow/) format.

### Location Column

This column displays a clickable location link pointing to the parent path of the node.

**Important note**:

_For granular permissions, the Location Column may or may not render the link location_

You would normally use this with custom navigation or when displaying content from sources like:

-   Sites
-   My Sites
-   Shared Links
-   Recent Files
-   Favorites
-   Trashcan

...or any other location where the user needs to be able to navigate to the node parent
folder easily.

Note that the parent node is evaluated automatically.
The generated link will have a URL based on the `format` property value with the node `id`
value appended:

```text
/<format>/:id
```

For example:

```html
<data-column
    key="path"
    type="location"
    format="/files"
    title="Location">
</data-column>
```

All links rendered in the column above will have an address mapped to `/files`:

```text
/files/node-1-id
/files/node-2-id
...
```

### Actions

You can add actions to a dropdown menu for each item shown in a Document List. Several
built-in actions are available (**delete**, **download**, **copy** and **move**) but
you can also define your own actions. See the
[Content Action component](content-action.component.md)
for more information and examples.

You can also use the [Context Menu directive](../core/context-menu.directive.md) from the 
[ADF Core](https://www.npmjs.com/package/ng2-alfresco-core) library to show the
actions you have defined in a context menu:

```ts
@Component({
    selector: 'my-view',
    template: `
        <adf-document-list [contextMenuActions]="true">...</adf-document-list>
        <context-menu-holder></context-menu-holder>
    `
})
export class MyView {
}
```

![Folder context menu](../docassets/images/folder-context-menu.png)

This single extra line in the template enables context menu items for documents and folders.

### Navigation mode

By default, the [Document List component](../content-services/document-list.component.md) uses 'double-click' mode for navigation.
That means that the user will see the contents of the folder when they double-click its name
or icon (in a similar manner to Google Drive). However, there is also a single-click mode that
may be sometimes be useful.

The following example switches navigation to single clicks:

```html
<adf-document-list 
    [navigationMode]="'click'">
</adf-document-list>
```

## Advanced usage and customization

### Custom row filter

You can create a custom row filter function that returns `true` if the row should be
displayed or `false` if it should be hidden.
A typical row filter implementation receives a [`ShareDataRow`](../../lib/content-services/document-list/data/share-data-row.model.ts) object as a parameter:

```ts
myFilter(row: ShareDataRow): boolean {
    return true;
}
```

_Note that for the sake of simplicity the example code below was reduced to the main points of interest only._

**View1.component.html**

```html
<adf-document-list 
    [rowFilter]="folderFilter">
</adf-document-list>
```

**View1.component.ts**

```ts
import { RowFilter, ShareDataRow } from '@alfresco/adf-content-services';

export class View1 {

    folderFilter: RowFilter;

    constructor() {
    
        // This filter will make the document list show only folders
        
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

You can create a custom image resolver function to manage the way folder/file icons and thumbnails 
are resolved (ie, which image is shown for which item). 

**Note:** Image resolvers are executed only for columns of the `image` type.

A typical image resolver implementation receives [`DataRow`](../../lib/core/datatable/data/data-row.model.ts) and [`DataColumn`](../../lib/core/datatable/data/data-column.model.ts) objects as parameters:

```ts
myImageResolver(row: DataRow, col: DataColumn): string {
    return '/path/to/image';
}
```

Your function can return `null` or `false` values to fall back to the default image
resolving behavior.

_Note that for the sake of simplicity the example code below was reduced to the main points of interest only._

**View1.component.html**

```html
<adf-document-list 
    [imageResolver]="folderImageResolver">
    
    <data-columns>
        <data-column key="name" type="image"></data-column>
    </data-columns>
    
</adf-document-list>
```

**View1.component.ts**

```ts
import { DataColumn, DataRow } from '@alfresco/adf-core';
import { ImageResolver } from '@alfresco/adf-content-services';

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

### Custom 'empty folder' template

By default, the Document List provides the following content for the empty folder:

![Default empty folder](../docassets/images/empty-folder-template-default.png)

However, you can change this by defining your own custom HTML template:

```html
<adf-document-list ...>
    <empty-folder-content>
        <ng-template>
            <h1>Sorry, no content here</h1>
        </ng-template>
    </empty-folder-content>
</adf-document-list>
```

This will give the following output:

![Custom empty folder](../docassets/images/empty-folder-template-custom.png)

### Custom 'permission denied' template

By default, the Document List shows the following content when permission
is denied:

![Default no permission](../docassets/images/no-permission-default.png)

You can change this by defining your own custom HTML template:

```html
<adf-document-list ...>
    <no-permission-content>
        <ng-template>
            <h1>You don't have permissions</h1>
        </ng-template>
    </no-permission-content>
</adf-document-list>
```

This will give the following output:

![Custom no permission](../docassets/images/no-permission-custom.png)

## See also

-   [Datatable component](../core/datatable.component.md)
-   [Data column component](../core/data-column.component.md)
-   [Pagination component](../core/pagination.component.md)
-   [Infinite pagination component](../core/infinite-pagination.component.md)
-   [Sites dropdown component](sites-dropdown.component.md)
-   [Metadata indicators](../user-guide/metadata-indicators.md)
-   [Document library model](document-library.model.md)
-   [Nodes api service](../core/nodes-api.service.md)
-   [Breadcrumb component](breadcrumb.component.md)
-   [Content action component](content-action.component.md)
-   [Content node selector component](content-node-selector.component.md)
-   [Document list service](document-list.service.md)
-   [Dropdown breadcrumb component](dropdown-breadcrumb.component.md)
-   [Permissions style model](permissions-style.model.md)
-   [Version manager component](version-manager.component.md)
-   [Viewer component](../core/viewer.component.md)
