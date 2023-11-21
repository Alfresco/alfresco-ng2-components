<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [BPM](#bpm)
  * [Task Api](#task-api)
    + [List Task](#list-task)
    + [Get Task](#get-task)
    + [Filter Tasks](#filter-tasks)
    + [Complete Task](#complete-task)
    + [Get Task Form](#get-task-form)
    + [Complete Task Form](#complete-task-form)
  * [Process Api](#process-api)
    + [Get Process Instances](#get-process-instances)
  * [Models Api](#models-api)
    + [Get Model](#get-model)
  * [Report Api](#report-api)
    + [Create default Reports](#create-default-reports)
    + [Get Reports](#get-reports)
    + [Report Params](#report-params)
  * [Report Process Definitions](#report-process-definitions)
  * [Tasks of process definition](#tasks-of-process-definition)
  * [Generate reports](#generate-reports)
  * [Update report details](#update-report-details)
  * [Export to csv](#export-to-csv)
  * [Save Report](#save-report)
  * [Delete report](#delete-report)

<!-- tocstop -->

<!-- markdown-toc end -->

# BPM

A complete list of all the BPM methods is available here: [Activiti API](../src/api/activiti-rest-api/README.md).

Below you can find some common examples.

## Task Api

Below you can find some example relative to the Activiti process api for all the possible method go to [Tasks Api](../src/api/activiti-rest-api/docs/TasksApi.md) documentation.

### List Task

```javascript
TasksApi.listTasks(tasksQuery)
```

return a list of task based on the `tasksQuery` query

#### Example

```javascript
import { TasksApi, TaskQueryRepresentation } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*...*/);
const taskApi = TasksApi(alfrescoApi);

const tasksQuery = new TaskQueryRepresentation();

taskApi.listTasks(tasksQuery).then( 
    (data) => {
        console.log('listTasks ' + data);
    }, 
    (error) => {
        console.log('Error' + error);
    });
```

### Get Task

```javascript
TasksApi.getTask(taskId)
```

Returns the [TaskRepresentation](/src/api/activiti-rest-api/docs/TaskRepresentation.md)  of single task by id

**Parameters**

| Name   | Type   | Description |
|--------|--------|-------------|
| taskId | String | taskId      |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const taskApi = TasksApi(this.alfrescoApi);

const taskId = '10'; // String | taskId

taskApi.getTask(taskId).then(
    (data) => {
        console.log('Task representation ' + data);
    }, (error) => {
        console.log('Error' + error);
    });
```

### Filter Tasks

```javascript
TasksApi.filterTasks(requestTasks)
```

Returns the [ResultListDataRepresentation](../src/api/activiti-rest-api/docs/ResultListDataRepresentation«TaskRepresentation».md) that is a filtered list of all the tasks.

**Parameters**

| Name         | Type                                                                                                 | Description  |
|--------------|------------------------------------------------------------------------------------------------------|--------------|
| requestTasks | [TaskFilterRequestRepresentation](../src/api/activiti-rest-api/docs/TaskFilterRequestRepresentation.md) | requestTasks |


**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const taskApi = TasksApi(alfrescoApi);

const requestTasks = new TaskFilterRequestRepresentation({
    appDefinitionId: 1
});

taskApi.filterTasks(requestTasks).then(
    (data) => {
        console.log('Task filter list ' + data);
    }, 
    (error) => {
        console.log('Error' + error);
    });
```

### Complete Task

```javascript
TasksApi.completeTask(taskId)
```

To complete a task (standalone or without a task form).

**Parameters**

| Name       | Type       | Description |
|------------|------------|-------------|
| **taskId** | **String** | taskId      |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const taskApi = TasksApi(alfrescoApi);

const taskId = '10'; // String | taskId

taskApi.taskApi.completeTask(taskId).then(
    () => {
        console.log('Task completed');
    }, 
    (error) => {
        console.log('Error' + error);
    });
```
### Get Task Form

```javascript
TasksApi.getTaskForm(taskId)
```

Retrieve the [Task Form](../src/api/activiti-rest-api/docs/FormDefinitionRepresentation.md) representation.

**Parameters**

| Name       | Type       | Description |
|------------|------------|-------------|
| **taskId** | **String** | taskId      |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const taskApi = TasksApi(this.alfrescoApi);

const taskId = '10';

taskApi.getTaskForm(taskId).then(
    (data) => {
        console.log('Task form representation' + data);
    }, 
    (error) => {
       console.log('Error' + error);
    });
```

### Complete Task Form

completeTaskForm(taskId, completeTaskFormRepresentation)

Complete a Task Form

**Parameters**

| Name                           | Type                                                                                       | Description                    |
|--------------------------------|--------------------------------------------------------------------------------------------|--------------------------------|
| taskId                         | String                                                                                     | taskId                         |
| completeTaskFormRepresentation | [CompleteFormRepresentation](../src/api/activiti-rest-api/docs/CompleteFormRepresentation.md) | completeTaskFormRepresentation |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const taskApi = TasksApi(this.alfrescoApi);

const taskId = '10'; // String | taskId

taskApi.completeTaskForm(taskId, completeTaskFormRepresentation).then(
    () => {
        console.log('Task completed');
    }, 
    (error) => {
        console.log('Error' + error);
    });
```

## Process Api

### Get Process Instances

```javascript
ProcessInstancesApi.getProcessInstances(requestNode)
```

Retrieve a list of process instances, see [ResultListDataRepresentationProcessInstanceRepresentation](../src/api/activiti-rest-api/docs/ResultListDataRepresentation«ProcessInstanceRepresentation».md)

**Parameters**

| Name        | Type                                                                                                       | Description |
|-------------|------------------------------------------------------------------------------------------------------------|-------------|
| requestNode | [ProcessInstanceQueryRepresentation](../src/api/activiti-rest-api/docs/ProcessInstanceQueryRepresentation.md) | requestNode |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const processApi = ProcessApi(alfrescoApi);
const requestNode = new ProcessInstanceQueryRepresentation();

processApi.getProcessInstances(requestNode).then(
    (data) => {
        console.log('All processes' + data);
    }, 
    (error) => {
        console.log('Error' + error);
    });
```

Filtered process:

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const processApi = ProcessApi(this.alfrescoApi);

const requestNode = new ProcessInstanceQueryRepresentation({
    page: 0,
    sort: 'created-desc',
    state: 'completed'
});

processApi.getProcessInstances(requestNode).then(
    (data) => {
       console.log('All processes completed' + data);
    }, 
    (error) => {
       console.log('Error' + error);
    });
```

## Models Api

Below you can find some example relative to the Activiti process api for all the possible method go to [Models Api](../src/api/activiti-rest-api/docs/ModelsApi.md) documentation.

### Get Model

getModel(modelId, opts)

To retrieve details about a particular model (process, form, decision rule or app) return a [ModelRepresentation](../src/api/activiti-rest-api/docs/ModelRepresentation.md)

**Parameters**

| Name               | Type    | Description        | Notes      |
|--------------------|---------|--------------------|------------|
| modelId            | Number  | modelId            |            |
| includePermissions | Boolean | includePermissions | [optional] |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const modelsApi = new ModelsApi(alfrescoApi);

const opts = {
    filter: 'myReusableForms',
    modelType: 2
};

modelsApi.getModels(opts).then(
    (data) => {
        console.log('All your reusable forms' + data);
    }, 
    (error) => {
        console.log('Error' + error);
    });
```

## Report Api

Below you can find some example relative to the Activiti report api for all the possible method go to [Report Api documentation](../src/api/activiti-rest-api/docs/ReportApi.md)

### Create Default Reports

```javascript
ReportApi.createDefaultReports()
```

Creates the default reports

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const reportApi = ReportApi(alfrescoApi);

reportApi.createDefaultReports();
```

### Get Reports

```javascript
ReportApi.getReportList()
```

Retrieve the available report list

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const reportApi = ReportApi(alfrescoApi);

reportApi.getReportList();
```

### Report Params

```javascript
ReportApi.getReportParams(reportId)
```

> Retrieve the parameters referring to the reportId.

**Parameters**

| Name     | Type   | Description |
|----------|--------|-------------|
| reportId | String | reportId    |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const reportApi = ReportApi(alfrescoApi);

const reportId = '1';
reportApi.getReportParams(reportId);
```

## Report Process Definitions

```javascript
ReportApi.getProcessDefinitions()
```

Retrieve the process definition list for all the apps.

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const reportApi = ReportApi(alfrescoApi);

reportApi.getProcessDefinitions();
```

## Tasks of Process Definition

getTasksByProcessDefinitionId(reportId, processDefinitionId)

Retrieves all tasks that refer to the processDefinitionId

**Parameters**

| Name                | Type   | Description           |
|---------------------|--------|-----------------------|
| reportId            | String | reportId              |
| processDefinitionId | String | process definition id |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const reportApi = ReportApi(alfrescoApi);

const reportId = '1';
const processDefinitionId = '1';

reportApi.getTasksByProcessDefinitionId(reportId, processDefinitionId);
```

## Generate reports

```javascript
ReportApi.getReportsByParams(reportId, paramsQuery)
```

Generate the reports based on the input parameters

**Parameters**

| Name        | Type   | Description      |
|-------------|--------|------------------|
| reportId    | String | reportId         |        
| paramsQuery | Object | Query parameters |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const reportApi = ReportApi(alfrescoApi);

const reportId = '1';
const paramsQuery = { status: 'ALL' };

reportApi.getReportsByParams(reportId, paramsQuery);
```
## Update report details

```javascript
ReportApi.updateReport(reportId, name)
```

Update the report details

**Parameters**

| Name     | Type   | Description     |
|----------|--------|-----------------|
| reportId | String | reportId        |
| name     | String | The report name |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const reportApi = ReportApi(alfrescoApi);

const reportId = '1';
const name = 'new report name';

reportApi.updateReport(reportId, name);
```

## Export to CSV

```javascript
ReportApi.exportToCsv(reportId, queryParams)
```

Export a report as csv

**Parameters**

| Name        | Type   | Description      |
|-------------|--------|------------------|
| reportId    | String | reportId         |
| queryParams | Object | Query parameters |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const reportApi = ReportApi(alfrescoApi);

const reportId = '1';
const queryParams = {
    processDefinitionId: 'TEST:99:999',
    dateRange: {
        startDate: '2017-01-01T00:00:00.000Z',
        endDate: '2017-01-24T23:59:59.999Z',
        rangeId: 'currentYear'
    },
    slowProcessInstanceInteger: 10,
    status: 'All',
    __reportName: 'FAKE_REPORT_NAME'
};

reportApi.exportToCsv(reportId, queryParams);
```

## Save Report

```javascript
ReportApi.saveReport(reportId, queryParams)
```

Save a report

**Parameters**

| Name        | Type   | Description      |
|-------------|--------|------------------| 
| reportId    | String | reportId         |
| queryParams | Object | Query parameters |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const reportApi = ReportApi(alfrescoApi);

const reportId = '1';
const queryParams = {
    processDefinitionId: 'TEST:99:999',
    dateRange: {
        startDate: '2017-01-01T00:00:00.000Z',
        endDate: '2017-01-24T23:59:59.999Z',
        rangeId: 'currentYear'
    },
    slowProcessInstanceInteger: 10,
    status: 'All',
    __reportName: 'FAKE_REPORT_NAME'
};

reportApi.saveReport(reportId, queryParams);
```

## Delete report

```javascript
ReportApi.deleteReport(reportId)
```

Delete a report

**Parameters**

| Name     | Type   | Description |
|----------|--------|-------------|
| reportId | String | reportId    |

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const reportApi = ReportApi(alfrescoApi);

const reportId = '1';

reportApi.deleteReport(reportId);
```
