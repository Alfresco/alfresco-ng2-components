# Process Filter Service
Manage Process Filters, which are pre-configured Process Instance queries. 

## Importing

```ts
import { ProcessFilterService, FilterProcessRepresentationModel } from '@alfresco/adf-process-services';

export class SomePageComponent implements OnInit {

  constructor(private processFilterService: ProcessFilterService) {
  }
```

## Methods

#### createDefaultFilters(appId: number): Observable`<any[]>`
Create and return the default filters for a Process App:

```ts
const processAppId = 2;
this.processFilterService.createDefaultFilters(processAppId)
  .subscribe( filters => {
  console.log('filters: ', filters);
}, error => {
  console.log('Error: ', error);
});
```

The response is an array of `FilterProcessRepresentationModel` objects:

```
filters:  
    0: {
       appId: 2
       filter:
            name: ""
            sort: "created-desc"
            state: "running"
       icon: "glyphicon-random"
       id: null
       index: undefined    
       name: "Running"
       recent: true
       }
    1: {id: null, appId: 2, name: "Completed", recent: false, icon: "glyphicon-ok-sign", …}
    2: {id: null, appId: 2, name: "All", recent: true, icon: "glyphicon-th", …}
```

These filters can now be used to get matching process instances for Process App with ID 2, 
such as 'Running', 'Completed', and 'All' .

#### getProcessFilters(appId: number): Observable`<FilterProcessRepresentationModel[]>`
Get all filters defined for a Process App: 

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

```
filters:  
    0: {id: 15, appId: 2, name: "Running", recent: true, icon: "glyphicon-random", …}
    1: {id: 14, appId: 2, name: "Completed", recent: false, icon: "glyphicon-ok-sign", …}
    2: {id: 13, appId: 2, name: "All", recent: false, icon: "glyphicon-th", …}
    3: {id: 3003, appId: 2, name: "Running", recent: false, icon: "glyphicon-random", …}
    4: {id: 3004, appId: 2, name: "Completed", recent: false, icon: "glyphicon-ok-sign", …}
    5: {id: 3005, appId: 2, name: "All", recent: false, icon: "glyphicon-th", …}
 
```
In this example I had run the `createDefaultFilters` method ones and that created the duplicate of 
the default filters.

These filters can now be used to get matching process instances for Process App with ID 2, 
such as 'Running', 'Completed', and 'All' .

#### getProcessFilterById(filterId: number, appId?: number): Observable`<FilterProcessRepresentationModel>` 
Get a specific Process Filter based on its ID, optionally pass in Process App ID to improve performance
when searching for filter: 

```ts
const processAppId = 2;
const filterId = 3003;
this.processFilterService.getProcessFilterById(filterId, processAppId)
  .subscribe( (filter: FilterProcessRepresentationModel) => {
  console.log('filter: ', filter);
}, error => {
  console.log('Error: ', error);
});
```

The response is a `FilterProcessRepresentationModel` object:

```
appId: 2
filter: {sort: "created-desc", name: "", state: "running"}
icon: "glyphicon-random"
id: 3003
name: "Running"
recent: false
```

The filter can now be used to get 'Running' process instances for Process App with ID 2.

#### getProcessFilterByName(filterName: string, appId?: number): Observable`<FilterProcessRepresentationModel>` 
Get a specific Process Filter based on its name, optionally pass in Process App ID to improve performance
when searching for filter: 

```ts
const processAppId = 2;
const filterName = 'Running';
this.processFilterService.getProcessFilterByName(filterName, processAppId)
  .subscribe( (filter: FilterProcessRepresentationModel) => {
  console.log('filter: ', filter);
}, error => {
  console.log('Error: ', error);
});
```

The response is a `FilterProcessRepresentationModel` object:

```
appId: 2
filter: {sort: "created-desc", name: "", state: "running"}
icon: "glyphicon-random"
id: 15
name: "Running"
recent: true
```
If there are several filters with the same name for the Process App, then you get back the 
first one found matching the name.

The filter can now be used to get 'Running' process instances for Process App with ID 2.

#### addProcessFilter(filter: FilterProcessRepresentationModel): Observable`<FilterProcessRepresentationModel>`
Add a new Process Instance filter: 

```ts
const processAppId = 2;
const filterName = 'RunningAsc';
const filterRunningAsc = new FilterProcessRepresentationModel({
  'name': filterName,
  'appId': processAppId,
  'recent': true,
  'icon': 'glyphicon-random',
  'filter': { 'sort': 'created-asc', 'name': 'runningasc', 'state': 'running' }
});
this.processFilterService.addProcessFilter(filterRunningAsc)
  .subscribe( (filterResponse: FilterProcessRepresentationModel) => {
  console.log('filterResponse: ', filterResponse);
}, error => {
  console.log('Error: ', error);
});
```

The response is a `FilterProcessRepresentationModel` object:

```
appId: 2
icon: "glyphicon-random"
id: 3008
name: "RunningAsc"
recent: false
```

The filter can now be used to get 'Running' process instances for 
Process App with ID 2 in created date ascending order. 

See also the `getRunningFilterInstance` method.

#### getRunningFilterInstance(appId: number): FilterProcessRepresentationModel
Convenience method to create and return a filter that matches `running` process instances 
for passed in Process App ID: 

```ts
const processAppId = 2;
const runningFilter: FilterProcessRepresentationModel = this.processFilterService.getRunningFilterInstance(processAppId);
console.log('Running filter', runningFilter);
```

The response is a `FilterProcessRepresentationModel` object:

```
appId: 2
filter: {sort: "created-desc", name: "", state: "running"}
icon: "glyphicon-random"
id: null
index: undefined
name: "Running"
recent: true
```

The filter can now be used to get 'Running' process instances for 
Process App with ID 2 in created date ascending order.

<!-- seealso start -->

<!-- seealso end -->