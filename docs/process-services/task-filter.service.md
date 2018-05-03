---
Added: v2.0.0
Status: Active
---

# Task Filter Service

Manage Task Filters, which are pre-configured Task Instance queries. 

## Class members

### Methods

-   `createDefaultFilters(appId: number): Observable<FilterRepresentationModel[]>`  
    Creates and returns the default filters for a process app.  
    -   `appId` - ID of the target app
-   `getTaskListFilters(appId?: number): Observable<FilterRepresentationModel[]>`  
    Gets all task filters for a process app.  
    -   `appId` - (Optional) Optional ID for a specific app
-   `getTaskFilterById(filterId: number, appId?: number): Observable<FilterRepresentationModel>`  
    Gets a task filter by ID.  
    -   `filterId` - ID of the filter
    -   `appId` - (Optional) ID of the app for the filter
-   `getTaskFilterByName(taskName: string, appId?: number): Observable<FilterRepresentationModel>`  
    Gets a task filter by name.  
    -   `taskName` - Name of the filter
    -   `appId` - (Optional) ID of the app for the filter
-   `addFilter(filter: FilterRepresentationModel): Observable<FilterRepresentationModel>`  
    Adds a new task filter  
    -   `filter` - The new filter to add
-   `callApiTaskFilters(appId?: number): any`  
    Calls `getUserTaskFilters` from the Alfresco JS API.  
    -   `appId` - (Optional) ID of the target app
-   `getInvolvedTasksFilterInstance(appId: number): FilterRepresentationModel`  
    Creates and returns a filter for "Involved" task instances.  
    -   `appId` - ID of the target app
-   `getMyTasksFilterInstance(appId: number): FilterRepresentationModel`  
    Creates and returns a filter for "My Tasks" task instances.  
    -   `appId` - ID of the target app
-   `getQueuedTasksFilterInstance(appId: number): FilterRepresentationModel`  
    Creates and returns a filter for "Queued Tasks" task instances.  
    -   `appId` - ID of the target app
-   `getCompletedTasksFilterInstance(appId: number): FilterRepresentationModel`  
    Creates and returns a filter for "Completed" task instances.  
    -   `appId` - ID of the target app

## Details

The methods of this service generally return an instance of `FilterRepresentationModel` or
an array of instances. For example, you could use `getTaskListFilters` as follows:

```ts
const processAppId = 2;
this.taskFilterService.getTaskListFilters(processAppId).subscribe( (filters: FilterRepresentationModel[]) => {
  console.log('Task filters: ', filters);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of `FilterRepresentationModel` objects:

    filters:  
        0: {id: 10, appId: 2, name: "Involved Tasks", recent: true, icon: "glyphicon-align-left", …}
        1: {id: 9, appId: 2, name: "My Tasks", recent: false, icon: "glyphicon-inbox", …}
        2: {id: 11, appId: 2, name: "Queued Tasks", recent: false, icon: "glyphicon-record", …}
        3: {id: 12, appId: 2, name: "Completed Tasks", recent: false, icon: "glyphicon-ok-sign", …}
        4: {id: 4004, appId: 2, name: "Completed Tasks", recent: false, icon: "glyphicon-ok-sign", …}
        5: {id: 4005, appId: 2, name: "My Tasks", recent: false, icon: "glyphicon-inbox", …}
        6: {id: 4006, appId: 2, name: "Queued Tasks", recent: false, icon: "glyphicon-record", …}
        7: {id: 4007, appId: 2, name: "Involved Tasks", recent: false, icon: "glyphicon-align-left", …}

These filters can now be used to get matching task instances for the process app with ID 2, 
such as 'Involved Tasks', 'My Tasks', 'Queued Tasks', and 'Completed Tasks'.

### Importing

```ts
import { TaskFilterService, FilterRepresentationModel } from '@alfresco/adf-process-services';

export class SomePageComponent implements OnInit {

  constructor(private taskFilterService: TaskFilterService) {
  }
```

## See also

-   [Task Filters component](task-filters.component.md)
-   [Process Filter service](process-filter.service.md)
