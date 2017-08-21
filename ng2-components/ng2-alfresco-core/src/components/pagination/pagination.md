# Pagination Component

## Basic example

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

Depending on the pagination data, you should see result similar to the following one:

![](../../../docs/pagination/basic.png)

## Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| pagination | Pagination | | Pagination object |
| supportedPageSizes | Array&lt;number&gt; | [ 25, 50, 100 ] | An array of page sizes |
| change | EventEmitter&lt;PaginationQueryParams&gt; | | Triggered for any action in pagination |
| nextPage | EventEmitter&lt;Pagination&gt; | | Triggered on next page action |
| prevPage | EventEmitter&lt;Pagination&gt; | | Triggered on previous page action |
| changePageSize | EventEmitter&lt;Pagination&gt; | | Triggered on page size change action |
| changePageNumber | EventEmitter&lt;Pagination&gt; | | Triggered on page change action |

Each event helps to detect the certain action that user have made using the component.

For `change` event, a [PaginationQueryParams](https://github.com/Alfresco/alfresco-ng2-components/tree/master/ng2-components/ng2-alfresco-core/src/components/pagination/pagination-query-params.ts) (including the query params supported by the REST API, `skipCount` and `maxItems`) is returned.

For all other events, other than `change`, a new [Pagination object](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/Pagination.md) is returned as in the folowing example, with updated properties to be used to query further.
