---
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-21
---

# Process Filter Service

Manage Process Filters, which are pre-configured Process Instance queries. 

## Methods

-   `getProcessFilters(appId: number): Observable<FilterProcessRepresentationModel[]>`  
    Gets all filters defined for a Process App.  
    -   `appId` - ID of the target app
-   `getProcessFilterById(filterId: number, appId?: number): Observable<FilterProcessRepresentationModel>`  
    Retrieves the process filter by ID.  
    -   `filterId` - ID of the filter
    -   `appId` - (Optional) ID of the target app
-   `getProcessFilterByName(filterName: string, appId?: number): Observable<FilterProcessRepresentationModel>`  
    Retrieves the process filter by name.  
    -   `filterName` - Name of the filter
    -   `appId` - (Optional) ID of the target app
-   `createDefaultFilters(appId: number): Observable<FilterProcessRepresentationModel[]>`  
    Creates and returns the default filters for an app.  
    -   `appId` - ID of the target app
-   `getRunningFilterInstance(appId: number): FilterProcessRepresentationModel`  
    Creates and returns a filter that matches "running" process instances.  
    -   `appId` - ID of the target app
-   `addProcessFilter(filter: FilterProcessRepresentationModel): Observable<FilterProcessRepresentationModel>`  
    Adds a filter.  
    -   `filter` - The filter to add
-   `callApiProcessFilters(appId?: number): any`  
    Calls `getUserProcessInstanceFilters` from the Alfresco JS API.  
    -   `appId` - (Optional) ID of the target app

## Details

The methods of this service generally return an instance of
`FilterProcessRepresentationModel` or an array of instances. For example, you
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

The response is an array of `FilterProcessRepresentationModel` objects:

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

- [Process Filters component](process-filters.component.md)
- [Task Filter service](task-filter.service.md)
