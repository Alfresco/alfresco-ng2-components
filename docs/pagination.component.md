# Pagination Component

Adds pagination to the component it is used with.

![](docassets/images/basic.png)

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)
- [Details](#details)

<!-- tocstop -->

<!-- markdown-toc end -->

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

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| pagination | Pagination | | Pagination object |
| supportedPageSizes | Array&lt;number&gt; | [ 25, 50, 100 ] | An array of page sizes |
| target | PaginatedComponent | | Component that provides custom pagination support |

### Events

| Name | Type | Description |
| --- | --- | --- |
| change | EventEmitter&lt;PaginationQueryParams&gt; | Triggered for any action in pagination |
| nextPage | EventEmitter&lt;Pagination&gt; | Triggered on next page action |
| prevPage | EventEmitter&lt;Pagination&gt; | Triggered on previous page action |
| changePageSize | EventEmitter&lt;Pagination&gt; | Triggered on page size change action |
| changePageNumber | EventEmitter&lt;Pagination&gt; | Triggered on page change action |

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