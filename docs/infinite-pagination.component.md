# Infinite Pagination component

Adds "infinite" pagination to the component it is used with.

![Infinite Pagination screenshot](docassets/images/InfPagination.png)

## Basic Usage

```html
<adf-infinite-pagination
    [pageSize]="pageSize"
    [loading]="infiniteLoading"
    (loadMore)="loadNextPage($event)">
</adf-infinite-pagination>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| pagination | Pagination | `InfinitePaginationComponent.DEFAULT_PAGINATION` | Pagination object |
| pageSize | number | `InfinitePaginationComponent.DEFAULT_PAGE_SIZE` | Number of items that are added with each "load more" event |
| loading | boolean | false |  |

### Events

| Name | Description |
| --- | --- |
| loadMore | Emitted when the "Load More" button is clicked |

## Details

Pagination is the process of dividing a list into separate ranges or "pages" with a
certain number of items each. This allows a long list to be delivered in manageable pieces
rather than all at once. "Infinite" pagination means that there is no upper limit on
the number of items that can be displayed visually; a single page is shown initially but
the user can extend the list one page at a time by clicking a "Load More" button.

The `loadMore` event is emitted when the button is pressed. It is passed a
[Pagination](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/Pagination.md)
parameter which contains the details of the current page (the start offset of the
page within the list to be shown, whether there are more items left to show, etc).

See the [Pagination component](pagination.component.md) for more information about the alternative "finite" pagination scheme.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Document list component](document-list.component.md)
- [Pagination component](pagination.component.md)
<!-- seealso end -->
