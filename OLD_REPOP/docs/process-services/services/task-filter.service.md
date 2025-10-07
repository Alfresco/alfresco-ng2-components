---
Title: Task Filter Service
Added: v2.0.0
Status: Active
Last reviewed: 2018-06-07
---

# [Task Filter Service](../../../lib/process-services/src/lib/task-list/services/task-filter.service.ts "Defined in task-filter.service.ts")

Manage Task Filters, which are pre-configured Task Instance queries.

## Class members

### Methods

-   **addFilter**(filter: `UserTaskFilterRepresentation`): `Observable<UserTaskFilterRepresentation>`<br/>
    Adds a new task filter
    -   _filter:_ `UserTaskFilterRepresentation`  - The new filter to add
    -   **Returns** `Observable<UserTaskFilterRepresentation>` - Details of task filter just added
-   **callApiTaskFilters**(appId?: `number`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<any>`<br/>
    Calls `getUserTaskFilters` from the Alfresco JS API.
    -   _appId:_ `number`  - (Optional) ID of the target app
    -   **Returns** [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)`<any>` - List of task filters
-   **createDefaultFilters**(appId: `number`): `Observable<UserTaskFilterRepresentation>[]>`<br/>
    Creates and returns the default filters for a process app.
    -   _appId:_ `number`  - ID of the target app
    -   **Returns** `Observable<UserTaskFilterRepresentation>[]>` - Array of default filters just created
-   **getCompletedTasksFilterInstance**(appId: `number`, index?: `number`): `UserTaskFilterRepresentation`<br/>
    Creates and returns a filter for "Completed" task instances.
    -   _appId:_ `number`  - ID of the target app
    -   _index:_ `number`  - (Optional) of the filter (optional)
    -   **Returns** `UserTaskFilterRepresentation` - The newly created filter
-   **getOverdueTasksFilterInstance**(appId: `number`, index?: `number`): `UserTaskFilterRepresentation`<br/>
    Creates and returns a filter for "Overdue" task instances.
    -   _appId:_ `number`  - ID of the target app
    -   _index:_ `number`  - (Optional) of the filter (optional)
    -   **Returns** `UserTaskFilterRepresentation` - The newly created filter
-   **getMyTasksFilterInstance**(appId: `number`, index?: `number`): `UserTaskFilterRepresentation`<br/>
    Creates and returns a filter for "My Tasks" task instances.
    -   _appId:_ `number`  - ID of the target app
    -   _index:_ `number`  - (Optional) of the filter (optional)
    -   **Returns** `UserTaskFilterRepresentation` - The newly created filter
-   **getUnassignedTasksFilterInstance**(appId: `number`, index?: `number`): `UserTaskFilterRepresentation`<br/>
    Creates and returns a filter for "Unassigned Tasks" task instances.
    -   _appId:_ `number`  - ID of the target app
    -   _index:_ `number`  - (Optional) of the filter (optional)
    -   **Returns** `UserTaskFilterRepresentation` - The newly created filter
-   **getTaskFilterById**(filterId: `number`, appId?: `number`): `Observable<UserTaskFilterRepresentation>`<br/>
    Gets a task filter by ID.
    -   _filterId:_ `number`  - ID of the filter
    -   _appId:_ `number`  - (Optional) ID of the app for the filter
    -   **Returns** `Observable<UserTaskFilterRepresentation>` - Details of task filter
-   **getTaskFilterByName**(taskName: `string`, appId?: `number`): `Observable<UserTaskFilterRepresentation>`<br/>
    Gets a task filter by name.
    -   _taskName:_ `string`  - Name of the filter
    -   _appId:_ `number`  - (Optional) ID of the app for the filter
    -   **Returns** `ObservableUserTaskFilterRepresentation>` - Details of task filter
-   **updateTaskFilter**(filterId: `number`, updatedFilter: `UserTaskFilterRepresentation`): `Observable<UserTaskFilterRepresentation>`<br/>
    Updates the instance of the filter.
    -   filterId:_ `number`  - ID of a filter to update
    -   updatedFilter:_ `UserTaskFilterRepresentation`  - new filter body
    -   **Returns** `Observable<UserTaskFilterRepresentation>` - Updated filter instance.
-   **getTaskListFilters**(appId?: `number`): `UserTaskFilterRepresentation[]>`<br/>
    Gets all task filters for a process app.
    -   _appId:_ `number`  - (Optional) Optional ID for a specific app
    -   **Returns** `Observable<UserTaskFilterRepresentation[]>` - Array of task filter details

## Details

The methods of this service generally return an instance of `UserTaskFilterRepresentation` or
an array of instances. For example, you could use `getTaskListFilters` as follows:

```ts
const processAppId = 2;

this.taskFilterService.getTaskListFilters(processAppId).subscribe(
    (filters: UserTaskFilterRepresentation[]) => {
      console.log('Task filters: ', filters);
    }, 
    (error) => {
      console.log('Error: ', error);
  }
);
```

The response is an array of `UserTaskFilterRepresentation` objects:

```text
    filters:  
        0: {id: 10, appId: 2, name: "Involved Tasks", recent: true, icon: "glyphicon-align-left", …}
        1: {id: 9, appId: 2, name: "My Tasks", recent: false, icon: "glyphicon-inbox", …}
        2: {id: 11, appId: 2, name: "Unassigned Tasks", recent: false, icon: "glyphicon-record", …}
        3: {id: 12, appId: 2, name: "Completed Tasks", recent: false, icon: "glyphicon-ok-sign", …}
        4: {id: 4004, appId: 2, name: "Completed Tasks", recent: false, icon: "glyphicon-ok-sign", …}
        5: {id: 4005, appId: 2, name: "My Tasks", recent: false, icon: "glyphicon-inbox", …}
        6: {id: 4006, appId: 2, name: "Unassigned Tasks", recent: false, icon: "glyphicon-record", …}
        7: {id: 4007, appId: 2, name: "Involved Tasks", recent: false, icon: "glyphicon-align-left", …}
```

These filters can now be used to get matching task instances for the process app with ID 2,
such as 'Involved Tasks', 'My Tasks', 'Unassigned Tasks', and 'Completed Tasks'.

### Importing

```ts
import { TaskFilterService } from '@alfresco/adf-process-services';

export class SomePageComponent implements OnInit {
    constructor(private taskFilterService: TaskFilterService) {
    }
}
```

## See also

-   [Task Filters component](../components/task-filters.component.md)
-   [Process Filter service](process-filter.service.md)
