---
Added: v2.0.0
Status: Active
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

## Integrating with Document List

```html
<adf-document-list #documentList ...></adf-document-list>

<adf-pagination [target]="documentList" ...>
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
| change | `EventEmitter<PaginationQueryParams>` | Emitted when paginaton changes in any way. |
| changePageNumber | `EventEmitter<Pagination>` | Emitted when the page number changes. |
| changePageSize | `EventEmitter<Pagination>` | Emitted when the page size changes. |
| nextPage | `EventEmitter<Pagination>` | Emitted when the next page is requested. |
| prevPage | `EventEmitter<Pagination>` | Emitted when the previous page is requested. |

## Details

The pagination object is a generic component to paginate component. The Alfresco API are paginated and return a Pagination object. You can use the pagination object to feed the pagination component and then listen to the event which returns the current pagination and query again the API with the options chosen by the user.

Each event helps to detect the certain action that user have made using the component.

For `change` event, a [PaginationQueryParams](https://github.com/Alfresco/alfresco-ng2-components/blob/development/ng2-components/ng2-alfresco-core/src/components/pagination/pagination-query-params.interface.ts) (including the query parameters supported by the REST API, `skipCount` and `maxItems`) is returned.

For all events other than `change`, a new Pagination object is returned as in the following example, with updated properties to be used to query further.

### Custom pagination

The component also provides light integration with external implementations of the pagination.
Any component can implement the `PaginatedComponent` and be used as a value for the `target` property.

```js
export interface PaginatedComponent {

    pagination: Subject<Pagination>;
    updatePagination(params: PaginationQueryParams);

}
```

Your component needs to provide a `pagination` subject to allow Pagination component to reflect to changes.
Every time user interacts with the Pagination, it will call the `updatePagination` method and pass the parameters.

## See also

-   [Infinite Pagination component](infinite-pagination.component.md)
