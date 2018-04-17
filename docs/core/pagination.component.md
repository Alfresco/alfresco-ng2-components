---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-16
---

# Pagination Component

Adds pagination to the component it is used with.

![](../docassets/images/basic.png)

## Basic Usage

```html
<adf-pagination
    [pagination]="pagination"
    [supportedPageSizes]="sizes"
    (change)="onChange($event)"
    (nextPage)="onNextPage($event)"
    (prevPage)="onPreviousPage($event)"
    (changePageSize)="onChangePageSize($event)"
    (changePageNumber)="onChangePageNumber($event)">
</adf-pagination>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| target | `PaginatedComponent` |  | Component that provides custom pagination support.  |
| supportedPageSizes | `number[]` | `[5, 25, 50, 100]` | An array of page sizes.  |
| pagination | `Pagination` |  | Pagination object.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| change | `EventEmitter<PaginationQueryParams>` | Emitted when pagination changes in any way.  |
| changePageNumber | `EventEmitter<Pagination>` | Emitted when the page number changes.  |
| changePageSize | `EventEmitter<Pagination>` | Emitted when the page size changes.  |
| nextPage | `EventEmitter<Pagination>` | Emitted when the next page is requested.  |
| prevPage | `EventEmitter<Pagination>` | Emitted when the previous page is requested.  |

## Details

You can use the Pagination component to add pagination features to other components. The Alfresco
APIs make use of pagination to reduce the amount of data transferred in a single call. The start offset
and number of items in the page are passed during the call. The items of interest will be
returned along with a Pagination object. You can use this object to set up the pagination component
and then subscribe to one of the page change events. This will return updated pagination data that you
can pass to a subsequent API call.

Each event corresponds to a particular action from the user. For the `change` event, a
[PaginationQueryParams](https://github.com/Alfresco/alfresco-ng2-components/blob/development/ng2-components/ng2-alfresco-core/src/components/pagination/pagination-query-params.interface.ts) object is returned. This contains the query
parameters supported by the REST API, `skipCount` and `maxItems`. 

For all events other than `change`, a new Pagination object is returned as in the following example. The
new object contains updated properties that you can use to fetch the next page of information.

### Integrating with the Document List component

```html
<adf-document-list #documentList ...></adf-document-list>

<adf-pagination [target]="documentList" ...>
</adf-pagination>
```

### Custom pagination

The component also makes it easy to integrate your own implementation of pagination.
You can supply any component that implements the `PaginatedComponent` interface as the value of the
`target` property.

```js
export interface PaginatedComponent {

    pagination: Subject<Pagination>;
    updatePagination(params: PaginationQueryParams);

}
```

Your component must provide a `pagination` subject to allow the Pagination component to respond to changes.
Every time user interacts with the Pagination component, it will call the `updatePagination` method
and pass the updated parameters.

## See also

-   [Infinite Pagination component](infinite-pagination.component.md)
