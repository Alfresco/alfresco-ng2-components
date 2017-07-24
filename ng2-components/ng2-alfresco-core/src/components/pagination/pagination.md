# Pagination Component

## Basic example

```html
<adf-pagination
    [pagination]="pagination"
    (onPaginationEvent)="doSomething($event)"
    (onNextPage)="onNext($event)"
    (onPreviousPage)="onPrevious($event)"
    (onPageChange)="onChange($event)"
    (onPageSizeChange)="onPageChange($event)">
</adf-pagination>
```

Depending on the pagination data, you should see result similar to the following one:

![](../../../docs/pagination/basic.png)

## Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| pagination | Pagination | | Pagination object |
| onPaginationEvent | EventEmitter&lt;Pagination&gt; | | Triggered for any action in pagination |
| onNextPage | EventEmitter&lt;Pagination&gt; | | Triggered on next page action |
| onPreviousPage | EventEmitter&lt;Pagination&gt; | | Triggered on previous page action |
| onPageChange | EventEmitter&lt;Pagination&gt; | | Triggered on page change action |
| onPageSizeChange | EventEmitter&lt;Pagination&gt; | | Triggered on page size change action |

Each event helps to detect the certain action that user have made using the component.

To make it simple, since all events emit a [Pagination object](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/Pagination.md), there is the `onPaginationEvent` that's triggered with every action (e.g. when `onNextPage` is triggered, `onPaginationEvent` is triggered as well). This helps when you want to have a single method to treat the pagination changes.

For each event, a new [Pagination object](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/Pagination.md) is returned as in the folowing example, with updated properties to be used to query further.

We'll take a default [Pagination object](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/Pagination.md):

```js
{
    count: 10,
    hasMoreItems: true,
    totalItems: 99,
    skipCount: 40,
    maxItems: 20
};
```

### `onNextPage` 
emits a new [Pagination object](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/Pagination.md), with the `skipCount` property updated (based on `maxItems`, it increases the amount to be skipped):
```js
{
    // ...,
    skipCount: 60
}
```
*please note that `onPaginationEvent` also emits the same, updated, [Pagination object](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/Pagination.md).*