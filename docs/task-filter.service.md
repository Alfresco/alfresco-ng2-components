# Task Filter Service
Manage Task Filters, which are pre-configured Task Instance queries. 

## Importing

```ts
import { TaskFilterService, FilterRepresentationModel } from '@alfresco/adf-process-services';

export class SomePageComponent implements OnInit {

  constructor(private taskFilterService: TaskFilterService) {
  }
```

## Methods

#### createDefaultFilters(appId: number): Observable`<FilterRepresentationModel[]>`
Create and return the default task filters for a Process App:

```ts
const processAppId = 2;
this.taskFilterService.createDefaultFilters(processAppId).subscribe( (filters: FilterRepresentationModel[]) => {
  console.log('Task filters: ', filters);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of `FilterRepresentationModel` objects:

```
filters:  
    0: {
        appId: 2
        filter : {
            assignment: "involved"
            dueAfter: null
            dueBefore: null
            name: null
            processDefinitionId: null
            processDefinitionKey: null
            sort: "created-desc"
            state: "open"      
        }
       icon: "glyphicon-align-left"
       id: null
       index: undefined
       name: "Involved Tasks"
       recent: false
       1: {id: null, appId: 2, name: "My Tasks", recent: false, icon: "glyphicon-inbox", …}
       2: {id: null, appId: 2, name: "Queued Tasks", recent: false, icon: "glyphicon-record", …}
       3: {id: null, appId: 2, name: "Completed Tasks", recent: true, icon: "glyphicon-ok-sign", …}
```

These filters can now be used to get matching Task Instances for Process App with ID 2, 
such as 'Involved Tasks', 'My Tasks', 'Queued Tasks', and 'Completed Tasks'.

#### getTaskListFilters(appId?: number): Observable`<any>`
Get all task filters defined for a Process App: 

```ts
const processAppId = 2;
this.taskFilterService.getTaskListFilters(processAppId).subscribe( (filters: FilterRepresentationModel[]) => {
  console.log('Task filters: ', filters);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of `FilterRepresentationModel` objects:

```
filters:  
    0: {id: 10, appId: 2, name: "Involved Tasks", recent: true, icon: "glyphicon-align-left", …}
    1: {id: 9, appId: 2, name: "My Tasks", recent: false, icon: "glyphicon-inbox", …}
    2: {id: 11, appId: 2, name: "Queued Tasks", recent: false, icon: "glyphicon-record", …}
    3: {id: 12, appId: 2, name: "Completed Tasks", recent: false, icon: "glyphicon-ok-sign", …}
    4: {id: 4004, appId: 2, name: "Completed Tasks", recent: false, icon: "glyphicon-ok-sign", …}
    5: {id: 4005, appId: 2, name: "My Tasks", recent: false, icon: "glyphicon-inbox", …}
    6: {id: 4006, appId: 2, name: "Queued Tasks", recent: false, icon: "glyphicon-record", …}
    7: {id: 4007, appId: 2, name: "Involved Tasks", recent: false, icon: "glyphicon-align-left", …}
```
In this example I had run the `createDefaultFilters` method once, and that created the duplicate of 
the default filters.

These filters can now be used to get matching Task Instances for Process App with ID 2, 
such as 'Involved Tasks', 'My Tasks', 'Queued Tasks', and 'Completed Tasks'.

If you want to return all filters regardless of Process App, and filter out duplicates, 
then you can just leave out the Process App number:

```ts
this.taskFilterService.getTaskListFilters().subscribe( (filters: FilterRepresentationModel[]) => {
  console.log('Task filters: ', filters);
}, error => {
  console.log('Error: ', error);
});
```

#### getTaskFilterById(filterId: number, appId?: number): Observable`<FilterRepresentationModel>` 
Get a specific Task Filter based on its ID, optionally pass in Process App ID to improve performance
when searching for filter: 

```ts
const processAppId = 2;
const taskFilterId = 4007;
this.taskFilterService.getTaskFilterById(taskFilterId, processAppId).subscribe( (filter: FilterRepresentationModel) => {
  console.log('Task filter: ', filter);
}, error => {
  console.log('Error: ', error);
});
```

The response is a `FilterRepresentationModel` object:

```
Task filter:
    appId: 2
    filter: 
        assignment: "involved"
        sort: "created-desc"
        state: "open"
    icon: "glyphicon-align-left"
    id: 4007
    name: "Involved Tasks"
    recent: false
```

The filter can now be used to get 'Involved Tasks' Task Instances for Process App with ID 2.

#### getTaskFilterByName(taskName: string, appId?: number): Observable`<FilterRepresentationModel>` 
Get a specific Task Filter based on its name, optionally pass in Process App ID to improve performance
when searching for filter: 

```ts
const processAppId = 2;
const taskFilterName = 'Completed Tasks';
this.taskFilterService.getTaskFilterByName(taskFilterName, processAppId).subscribe( (filter: FilterRepresentationModel) => {
  console.log('Task filter: ', filter);
}, error => {
  console.log('Error: ', error);
});
```

The response is a `FilterRepresentationModel` object:

```
appId: 2
filter: {sort: "created-desc", name: "", state: "completed", assignment: "involved"}
icon: "glyphicon-ok-sign"
id: 12
name: "Completed Tasks"
recent: false
```
If there are several filters with the same name for the Process App, then you get back the 
first one found matching the name.

The filter can now be used to get 'Completed Tasks' Task Instances for Process App with ID 2.

#### addFilter(filter: FilterRepresentationModel): Observable`<FilterRepresentationModel>`
Add a new Task Instance filter: 

```ts
const processAppId = 2;
const filterName = 'InvolvedAsc';
const filterInvolvedAsc = new FilterRepresentationModel({
  'name': filterName,
  'appId': processAppId,
  'recent': false,
  'icon': 'glyphicon-align-left',
  'filter': { 'assignment': 'involved', 'sort': 'created-asc', 'state': 'open' }
});

this.taskFilterService.addFilter(filterInvolvedAsc).subscribe( (filterResponse: FilterRepresentationModel) => {
  console.log('Task filter: ', filterResponse);
}, error => {
  console.log('Error: ', error);
});
```

The response is a `FilterRepresentationModel` object:

```
appId: 2
icon: "glyphicon-align-left"
id: 4008
name: "InvolvedAsc"
recent: false
```

The filter can now be used to get 'Involved' Task Instances for 
Process App with ID 2 in created date ascending order. 

#### getRunningFilterInstance(appId: number): FilterProcessRepresentationModel
Convenience method to create and return a filter that matches `involved` Task Instances 
for passed in Process App ID: 

```ts
const processAppId = 2;
const involvedFilter: FilterRepresentationModel = this.taskFilterService.getInvolvedTasksFilterInstance(processAppId);
console.log('Involved filter', involvedFilter);
```

The response is a `FilterRepresentationModel` object:

```
appId: 2
filter:
    assignment: "involved"
    dueAfter: null
    dueBefore: null
    name: null
    processDefinitionId: null
    processDefinitionKey: null
    sort: "created-desc"
    state: "open"
icon: "glyphicon-align-left"
id: null
index: undefined
name: "Involved Tasks"
recent: false
```

Use the `addFilter` to add this filter to a Process App.

#### getMyTasksFilterInstance(appId: number): FilterProcessRepresentationModel
Convenience method to create and return a filter that matches `My Tasks` Task Instances 
for passed in Process App ID: 

```ts
const processAppId = 2;
const myTasksFilter: FilterRepresentationModel = this.taskFilterService.getMyTasksFilterInstance(processAppId);
console.log('My Tasks filter', myTasksFilter);
```

The response is a `FilterRepresentationModel` object:

```
appId: 2
filter:
    assignment: "assignee"
    dueAfter: null
    dueBefore: null
    name: null
    processDefinitionId: null
    processDefinitionKey: null
    sort: "created-desc"
    state: "open"
icon: "glyphicon-inbox"
id: null
index: undefined
name: "My Tasks"
recent: false
```

Use the `addFilter` to add this filter to a Process App.

#### getQueuedTasksFilterInstance(appId: number): FilterProcessRepresentationModel
Convenience method to create and return a filter that matches `Queued Tasks` Task Instances 
for passed in Process App ID: 

```ts
const processAppId = 2;
const queuedTasksFilter: FilterRepresentationModel = this.taskFilterService.getQueuedTasksFilterInstance(processAppId);
console.log('Queued Tasks filter', queuedTasksFilter);
```

The response is a `FilterRepresentationModel` object:

```
appId: 2
filter:
    assignment: "candidate"
    dueAfter: null
    dueBefore: null
    name: null
    processDefinitionId: null
    processDefinitionKey: null
    sort: "created-desc"
    state: "open"
icon: "glyphicon-record"
id: null
index: undefined
name: "Queued Tasks"
recent: false
```

Use the `addFilter` to add this filter to a Process App.

#### getCompletedTasksFilterInstance(appId: number): FilterProcessRepresentationModel
Convenience method to create and return a filter that matches `Completed Tasks` Task Instances 
for passed in Process App ID: 

```ts
const processAppId = 2;
const completedTasksFilter: FilterRepresentationModel = this.taskFilterService.getCompletedTasksFilterInstance(processAppId);
console.log('Completed Tasks filter', completedTasksFilter);
```

The response is a `FilterRepresentationModel` object:

```
appId: 2
filter:
    assignment: "involved"
    dueAfter: null
    dueBefore: null
    name: null
    processDefinitionId: null
    processDefinitionKey: null
    sort: "created-desc"
    state: "completed"
icon: "glyphicon-ok-sign"
id: null
index: undefined
name: "Completed Tasks"
recent: true
```

Use the `addFilter` to add this filter to a Process App.

<!-- seealso start -->

<!-- seealso end -->