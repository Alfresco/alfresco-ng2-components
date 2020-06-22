---
Title: SearchHeader component
Added: v3.9.0
Status: Active
Last reviewed: 2020-19-06
---
# [SearchHeader component](../../../lib/content-services/src/lib/search/components/search-header/search-header.component.ts "Defined in search-header.component.ts")

Displays a button opening a menu designed to filter a document list.

![SearchHeader demo](../../docassets/images/search-header-demo.png)

## Contents

-   [Basic usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [Details](#details)
    -   [example](#example)
-   [See also](#see-also)

## Basic usage

**app.component.html**

```html
<adf-document-list
    ...
    ...> 
    <adf-custom-header-filter-template>
        <ng-template let-col>
            <adf-search-header [col]="col"
                                [currentFolderNodeId]="currentFolderId"
                                [maxItems]="pagination?.maxItems"
                                [skipCount]="pagination?.skipCount"
                                (update)="onFilterUpdate($event)"
                                (clear)="onAllFilterCleared()">
            </adf-search-header>
        </ng-template>
    </adf-custom-header-filter-template>
</adf-document-list>
```

**app.config.json**

```json
```

This component is designed to be used as transcluded inside the document list component. With the good configurations it will allow the user to filter the data displayed by that component.

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| col | `DataColumn` | | The column the filter will be applied on. |
| currentFolderNodeId | `string` | | The id of the current folder of the document list. |
| maxItems | `number` | | Pagination parameter coming from the document list. |
| skipCount | `number` | | An other pagination parameter coming from the document list. |
| widgetContainer | `SearchWidgetContainerComponent` | | View of the child facet widget generated inside the menu. Used to control that widget through the apply and clear buttons. |
| isActive | `boolean` | | A boolean telling if the current data displayed in the document list is affected by that filter. |
| category | `SearchCategory` | | The category of the filter. It contains the information regarding the way the filter is filtering the data. This is get with the column information and the configuration of the search-header inside the config file |
| isFilterServiceActive | `boolean` | | Boolean to check if the SearchHeaderQueryBuilderService is active |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| update | `EventEmitter<NodePaging>` | Emitted when the result of the filter is received from the API, should be passed to the `node` member of the document list. |
| clear | `EventEmitter<any>` | Emitted when the last of all the filters is cleared. This should be used to trigger a `reload()` of the document list with no `node` member. |


## See also

-   [Document list component](document-list.component.md)
-   [Search filter component](search-filter.component.md)
-   [Search component](search.component.md)
-   [Datatable component](../../core/components/datatable.component.md)
-   [Search Query Builder service](../services/search-query-builder.service.md)
