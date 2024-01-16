---
Title: Infinite Scroll Datasource
Added: v6.6.0
Status: Active
Last reviewed: 2024-01-15
---

# [Infinite Scroll Datasource](../../../lib/content-services/src/lib/infinite-scroll-datasource/infinite-scroll-datasource.ts "Defined in infinite-scroll-datasource.ts")

Contains abstract class acting as a baseline for various datasources for infinite scrolls. 

## Basic Usage

First step to use infinite scroll datasource in any component is creating a datasource class extending `InfiniteScrollDatasource` using specific source of data e.g. one of the content endpoints.
```ts
export class VersionListDataSource extends InfiniteScrollDatasource<VersionEntry> {
    constructor(private versionsApi: VersionsApi, private node: Node) {
        super();
    }

    getNextBatch(pagingOptions: ContentPagingQuery): Observable<VersionEntry[]> {
        return from(this.versionsApi.listVersionHistory(this.node.id, pagingOptions)).pipe(
            take(1),
            map((versionPaging) => versionPaging.list.entries)
        );
    }
}
```

Then in component that will have the infinite scroll define the datasource as instance of a class created in previous step, optionally you can set custom size of the items batch or listen to loading state changes:
```ts
 this.versionsDataSource = new VersionListDataSource(this.versionsApi, this.node);
this.versionsDataSource.batchSize = 50;
this.versionsDataSource.isLoading.pipe(takeUntil(this.onDestroy$)).subscribe((isLoading) => this.isLoading = isLoading);
```

Final step is to add the [CdkVirtualScrollViewport](https://material.angular.io/cdk/scrolling/api#CdkVirtualScrollViewport) with [CdkVirtualFor](https://material.angular.io/cdk/scrolling/api#CdkVirtualForOf) loop displaying items from the datasource.
```html
<cdk-virtual-scroll-viewport appendOnly itemSize="88">
    <div *cdkVirtualFor="let version of versionsDataSource"></div>
</cdk-virtual-scroll-viewport>
```

When user will scroll down to the bottom of the list next batch of items will be fetched until all items are visible.

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| batchSize | `number` | 100 | Determines how much items will be fetched within one batch. |
| firstItem | `T` | | Returns the first item ever fetched. |
| isLoading | [`Observable`](https://rxjs.dev/api/index/class/Observable)`<boolean>` | | Observable representing the state of loading the first batch. |
| itemsCount | `number` | | Number of items fetched so far. |

### Methods

-   **connect**(collectionViewer: [`CollectionViewer`](https://material.angular.io/cdk/collections/api)): [`Observable`](https://rxjs.dev/api/index/class/Observable)`<T>`<br/>
    Called by the virtual scroll viewport to receive a stream that emits the data array that should be rendered.
    -   collectionViewer:_ [`CollectionViewer`](https://material.angular.io/cdk/collections/api)  - collection viewer providing view changes that are listened to so that next batch can be fetched
    -   **Returns** [`Observable`](https://rxjs.dev/api/index/class/Observable)`<T>` - Data stream containing fetched items.
-   **disconnect**(): void<br/>
    Called when viewport is destroyed, disconnects the datasource, unsubscribes from the view changes.
-   **reset**(): void<br/>
    Resets the datasource by fetching the first batch.
