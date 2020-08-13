---
Title: Content Node Selector component
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-16
---

# [Content Node Selector component](../../../lib/content-services/src/lib/content-node-selector/content-node-selector.component.ts "Defined in content-node-selector.component.ts")

Allows a user to select items from a Content Services repository.

![Content Node Selector screenshot](../../docassets/images/ContentNodeSelector.png)

## Details

The [Content Node Selector component](content-node-selector.component.md) works a lot like the standard File Open/Save
dialog used by desktop applications except that it chooses items from a Content Services
repository rather than the filesystem. For example, the
[Document List component](document-list.component.md) uses a selector to choose the targets
of Copy/Move actions (see the [Content Action component](content-action.component.md) for
more information).

### Showing the dialog

Unlike most components, the [Content Node Selector Component](content-node-selector.component.md) is typically shown in a dialog box
rather than the main page and you are responsible for opening the dialog yourself. You can use the
[Angular Material Dialog](https://material.angular.io/components/dialog/overview) for this,
as shown in the usage example. ADF provides the [`ContentNodeSelectorComponentData`](../../../lib/content-services/src/lib/content-node-selector/content-node-selector.component-data.interface.ts) interface
to work with the Dialog's
[data option](https://material.angular.io/components/dialog/overview#sharing-data-with-the-dialog-component-):

```ts
export interface ContentNodeSelectorComponentData {
    title: string;
    actionName?: string;
    currentFolderId: string;
    dropdownHideMyFiles?: boolean;
    restrictRootToCurrentFolderId?: boolean;
    dropdownSiteList?: SitePaging;
    rowFilter?: any;
    where?: string;
    imageResolver?: any;
    selectionMode?: 'multiple' | 'single';
    isSelectionValid?: (entry: Node) => boolean;
    breadcrumbTransform?: (node) => any;
    excludeSiteContent?: string[];
    select: Subject<Node[]>;
    showSearch?: boolean;
    showFilesInResult?: boolean;
    showDropdownSiteList?: boolean;
    showLocalUploadButton?: boolean;
    multipleUpload?: boolean;
}
```

The properties are described in the table below:

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| title | `string` | "" | Dialog title |
| actionName | `string` | "" | Text to appear on the dialog's main action button ("Move", "Copy", etc) |
| currentFolderId | `string` | `null` | [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) ID of the folder currently listed. |
| dropdownHideMyFiles | `boolean` | `false` | Hide the "My Files" option added to the site list by default. See the [Sites Dropdown component](sites-dropdown.component.md) for more information. |
| dropdownSiteList | [`SitePaging`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SitePaging.md) | `null` | Custom site for site dropdown same as siteList. See the [Sites Dropdown component](sites-dropdown.component.md) for more information. |
| rowFilter | [`RowFilter`](../../../lib/content-services/src/lib/document-list/data/row-filter.model.ts) | `null` | Custom row filter function. See the [Row Filter Model](../models/row-filter.model.md) page for more information. |
| where | `string` | `null` | Custom _where_ filter function. See the [Document List component](document-list.component.md) for more information. |
| imageResolver | [`ImageResolver`](../../../lib/content-services/src/lib/document-list/data/image-resolver.model.ts) | `null` | Custom image resolver function. See the [Image Resolver Model](../models/image-resolver.model.md) page for more information. |
| pageSize | `number` |  | Number of items shown per page in the list. |
| isSelectionValid | [`ValidationFunction`](../../../lib/content-services/src/lib/content-node-selector/content-node-selector-panel.component.ts) | `defaultValidation` | Function used to decide if the selected node has permission to be selected. Default value is a function that always returns true. |
| breadcrumbTransform | `(node: any) => any` |  | Transformation to be performed on the chosen/folder node before building the breadcrumb UI. Can be useful when custom formatting is needed for the breadcrumb. You can change the path elements from the node that are used to build the breadcrumb using this function. |
| select | [`Subject<Node>`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) |  | Event emitted with the current node selection when the dialog closes |
| showSearch | `boolean` | `true` | Render search input |
| showDropdownSiteList | `boolean` | `true` | Render sites list dropdown menu |

If you don't want to manage the dialog yourself then it is easier to use the
[Content Node Selector Panel component](content-node-selector-panel.component.md), or the
methods of the [Content Node Dialog service](../services/content-node-dialog.service.md), which create
the dialog for you.

### Usage example

```ts
import { MatDialog } from '@angular/material/dialog';
import { ContentNodeSelectorComponentData, ContentNodeSelectorComponent} from '@adf/content-services'
import { Subject } from 'rxjs/Subject';
 ...

constructor(dialog: MatDialog ... ) {}

openSelectorDialog() {
    data: ContentNodeSelectorComponentData = {
        title: "Choose an item",
        actionName: "Choose",
        currentFolderId: someFolderId,
        select: new Subject<Node[]>()
    };

    this.dialog.open(
        ContentNodeSelectorComponent,
        {
            data, panelClass: 'adf-content-node-selector-dialog',
            width: '630px'
        }
    );

    data.select.subscribe((selections: Node[]) => {
        // Use or store selection...
    }, 
    (error)=>{
        //your error handling
    }, 
    ()=>{
        //action called when an action or cancel is clicked on the dialog
        this.dialog.closeAll();
    });
}
```

All the results will be streamed to the select [subject](http://reactivex.io/rxjs/manual/overview.html#subject) present in the [`ContentNodeSelectorComponentData`](../../../lib/content-services/src/lib/content-node-selector/content-node-selector.component-data.interface.ts) object passed to the dialog.
When the dialog action is selected by clicking, the `data.select` stream will be completed.

### RowFilter and ImageResolver

The [Content Node Selector](content-node-selector.component.md) uses a
[Document List](document-list.component.md) to display the
items that the user can choose. As with the standard Document List, you can supply a custom
**row filter** function (to hide items that can't be chosen) and a custom **image resolver**
function (to select an image to show in a particular list cell). For example, you could use
a row filter to hide document nodes in a folder selector. See the
[Row Filter Model](../models/row-filter.model.md) and [Image Resolver Model](../models/image-resolver.model.md)
pages for more information.

### Using the breadcrumbTransform function

The `breadcrumbTransform` property of [`ContentNodeSelectorComponentData`](../../../lib/content-services/src/lib/content-node-selector/content-node-selector.component-data.interface.ts) lets you modify
the [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) object that is used to generate the
list of breadcrumbs. You can use this, for example, to remove path elements that are not
relevant to the use case. See the [Breadcrumb component](breadcrumb.component.md) page for an
example of how to use this function.

## See also

-   [Document list component](document-list.component.md)
-   [Content Node Selector Panel component](content-node-selector-panel.component.md)
-   [Content Node Dialog service](../services/content-node-dialog.service.md)
