---
Title: Process Filter Service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-13
---

# [Process Filter Service](../../../lib/process-services/src/lib/process-list/services/process-filter.service.ts "Defined in process-filter.service.ts")

Manage Process Filters, which are pre-configured Process Instance queries.

## Class members

### Methods

-   **addProcessFilter**(filter: [`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)`>`<br/>
    Adds a filter.
    -   _filter:_ [`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)  - The filter to add
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)`>` - The filter just added
-   **callApiProcessFilters**(appId?: `number`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`ResultListDataRepresentationUserProcessInstanceFilterRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/ResultListDataRepresentation%C2%ABUserProcessInstanceFilterRepresentation%C2%BB.md)`>`<br/>
    Calls `getUserProcessInstanceFilters` from the Alfresco JS API.
    -   _appId:_ `number`  - (Optional) ID of the target app
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<`[`ResultListDataRepresentationUserProcessInstanceFilterRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/ResultListDataRepresentation%C2%ABUserProcessInstanceFilterRepresentation%C2%BB.md)`>` - List of filter details
-   **createDefaultFilters**(appId: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)`[]>`<br/>
    Creates and returns the default filters for an app.
    -   _appId:_ `number`  - ID of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)`[]>` - Default filters just created
-   **getProcessFilterById**(filterId: `number`, appId?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)`>`<br/>
    Retrieves the process filter by ID.
    -   _filterId:_ `number`  - ID of the filter
    -   _appId:_ `number`  - (Optional) ID of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)`>` - Details of the filter
-   **getProcessFilterByName**(filterName: `string`, appId?: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)`>`<br/>
    Retrieves the process filter by name.
    -   _filterName:_ `string`  - Name of the filter
    -   _appId:_ `number`  - (Optional) ID of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)`>` - Details of the filter
-   **getProcessFilters**(appId: `number`): [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)`[]>`<br/>
    Gets all filters defined for a Process App.
    -   _appId:_ `number`  - ID of the target app
    -   **Returns** [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)`[]>` - Array of filter details
-   **getRunningFilterInstance**(appId: `number`, index?: `number`): [`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts)<br/>
    Creates and returns a filter that matches "running" process instances.
    -   _appId:_ `number`  - ID of the target app
    -   _index:_ `number`  - (Optional) of the filter (optional)
    -   **Returns** [`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts) - Filter just created

## Details

The methods of this service generally return an instance of
[`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts) or an array of instances. For example, you
could use `getProcessFilters` as follows:

```ts
const processAppId = 2;
this.processFilterService.getProcessFilters(processAppId)
  .subscribe( (filters: FilterProcessRepresentationModel[]) => {
  console.log('filters: ', filters);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of [`FilterProcessRepresentationModel`](../../../lib/process-services/src/lib/process-list/models/filter-process.model.ts) objects:

        filters:  
            0: {id: 15, appId: 2, name: "Running", recent: true, icon: "glyphicon-random", …}
            1: {id: 14, appId: 2, name: "Completed", recent: false, icon: "glyphicon-ok-sign", …}
            2: {id: 13, appId: 2, name: "All", recent: false, icon: "glyphicon-th", …}
            3: {id: 3003, appId: 2, name: "Running", recent: false, icon: "glyphicon-random", …}
            4: {id: 3004, appId: 2, name: "Completed", recent: false, icon: "glyphicon-ok-sign", …}
            5: {id: 3005, appId: 2, name: "All", recent: false, icon: "glyphicon-th", …}

You can use the returned filters to get matching process instances for the process app with ID 2,
such as 'Running', 'Completed', 'All', etc.

## See also

-   [Process Filters component](../components/process-filters.component.md)
-   [Task Filter service](task-filter.service.md)
