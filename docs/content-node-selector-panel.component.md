# Content Node Selector Panel component

Opens a [Content Node Selector](content-node-selector.component.md) in its own dialog window.

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

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| currentFolderId | string | null | Node ID of the folder currently listed |
| dropdownHideMyFiles | boolean | false | Hide the "My Files" option added to the site list by default. [See More](sites-dropdown.component.md) |
| dropdownSiteList | [SitePaging](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SitePaging.md) |  | custom site for site dropdown same as siteList. [See More](sites-dropdown.component.md#properties) |
| rowFilter | RowFilter | null | Custom row filter function. [See More](document-list.component.md#custom-row-filter) |
| imageResolver | ImageResolver | null | Custom image resolver function. [See More](document-list.component.md#custom-image-resolver) |
| pageSize | number | 10 | Number of items shown per page in the list |

### Events

| Name | Description |
| ---- | ----------- |
| select | Emitted when the user has selected an item |

## Details

This component opens a _content node selector_ in its own dialog window. This behaves a lot like the
standard file open/save dialogs used by applications to choose files. Full details are given in the
[Content Node Selector component](content-node-selector.component.md) page (this is similar but does
not manage the dialog window for you). Also, the
[Content Node Dialog service](content-node-dialog.service.md) has several methods that give you
finer control over the behavior of the dialog.

## See also

-   [Content Node Selector component](content-node-selector.component.md)
-   [Content Node Dialog service](content-node-dialog.service.md)
