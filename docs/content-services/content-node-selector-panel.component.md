---
Added: v2.1.0
Status: Active
Last reviewed: 2018-04-16
---

# Content Node Selector Panel component

Opens a Content Node Selector in its own dialog window.

![Content Node Selector screenshot](../docassets/images/ContentNodeSelector.png)

## Basic Usage

```html
    <adf-content-node-selector-panel
        [currentFolderId]="currentFolderId"
        [dropdownHideMyFiles]="dropdownHideMyFiles"
        [dropdownSiteList]="dropdownSiteList"
        [rowFilter]="rowFilter"
        [imageResolver]="imageResolver"
        (select)="onSelect($event)">
    </adf-content-node-selector-panel>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| currentFolderId | `string` | `null` | Node ID of the folder currently listed.  |
| dropdownHideMyFiles | `boolean` | `false` | Hide the "My Files" option added to the site list by default. See the [Sites Dropdown component](sites-dropdown.component.md) for more information. |
| dropdownSiteList | `SitePaging` | `null` | Custom site for site dropdown same as siteList. See the [Sites Dropdown component](sites-dropdown.component.md) for more information. |
| rowFilter | `RowFilter` | `null` | Custom row filter function. See the [Document List component](document-list.component.md#custom-row-filter) for more information. |
| imageResolver | `ImageResolver` | `null` | Custom image resolver function. See the [Document List component](document-list.component.md#custom-row-filter) for more information.  |
| pageSize | `number` |  | Number of items shown per page in the list.  |
| isSelectionValid | `ValidationFunction` | `defaultValidation` | Function used to decide if the selected node has permission to be selected. Default value is a function that always returns true. |
| breadcrumbTransform | `(node: any) => any` |  | Transformation to be performed on the chosen/folder node before building the breadcrumb UI. Can be useful when custom formatting is needed for the breadcrumb. You can change the path elements from the node that are used to build the breadcrumb using this function. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| select | `EventEmitter<MinimalNodeEntryEntity[]>` | Emitted when the user has chosen an item.  |

## Details

This component opens a _content node selector_ in its own dialog window. This behaves a lot like the
standard file open/save dialogs used by applications to choose files. Full details are given in the
[Content Node Selector component](content-node-selector.component.md) page (this is similar but does
not manage the dialog window for you). Also, the
[Content Node Dialog service](content-node-dialog.service.md) has several methods that give you
finer control over the behavior of the dialog.

### Using the breadcrumbTransform function

The `breadcrumbTransform` property lets you modify the Node object that is used to generate the
list of breadcrumbs. You can use this, for example, to remove path elements that are not
relevant to the use case. See the [Breadcrumb component](breadcrumb.component.md) page for an
example of how to use this function.

## See also

-   [Content Node Selector component](content-node-selector.component.md)
-   [Content Node Dialog service](content-node-dialog.service.md)
