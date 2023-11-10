# TasksApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createIdentityLink**](TasksApi.md#createIdentityLink) | **POST** /enterprise/tasks/{taskId}/identitylinks | List the users and groups involved with a task
[**createNewTask**](TasksApi.md#createNewTask) | **POST** /enterprise/tasks | Create a standalone task
[**deleteIdentityLink**](TasksApi.md#deleteIdentityLink) | **DELETE** /enterprise/tasks/{taskId}/identitylinks/{family}/{identityId}/{type} | Remove a user or group involvement from a task
[**deleteTask**](TasksApi.md#deleteTask) | **DELETE** /enterprise/tasks/{taskId} | Delete a task
[**filterTasks**](TasksApi.md#filterTasks) | **POST** /enterprise/tasks/filter | Filter a list of tasks
[**getIdentityLinkType**](TasksApi.md#getIdentityLinkType) | **GET** /enterprise/tasks/{taskId}/identitylinks/{family}/{identityId}/{type} | Get a user or group involvement with a task
[**getIdentityLinksForFamily**](TasksApi.md#getIdentityLinksForFamily) | **GET** /enterprise/tasks/{taskId}/identitylinks/{family} | List either the users or groups involved with a process instance
[**getIdentityLinks**](TasksApi.md#getIdentityLinks) | **GET** /enterprise/tasks/{taskId}/identitylinks | getIdentityLinks
[**getTaskAuditLog**](TasksApi.md#getTaskAuditLog) | **GET** /enterprise/tasks/{taskId}/audit | Get the audit log for a task
[**getTask**](TasksApi.md#getTask) | **GET** /enterprise/tasks/{taskId} | Get a task
[**listHistoricTasks**](TasksApi.md#listHistoricTasks) | **POST** /enterprise/historic-tasks/query | Query historic tasks
[**listTasks**](TasksApi.md#listTasks) | **POST** /enterprise/tasks/query | List tasks
[**updateTask**](TasksApi.md#updateTask) | **PUT** /enterprise/tasks/{taskId} | Update a task


<a name="createIdentityLink"></a>
# **createIdentityLink**
> IdentityLinkRepresentation createIdentityLink(taskIdidentityLinkRepresentation)

List the users and groups involved with a task

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.createIdentityLink(taskIdidentityLinkRepresentation).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **identityLinkRepresentation** | [**IdentityLinkRepresentation**](IdentityLinkRepresentation.md)| identityLinkRepresentation | 

### Return type

[**IdentityLinkRepresentation**](IdentityLinkRepresentation.md)

<a name="createNewTask"></a>
# **createNewTask**
> TaskRepresentation createNewTask(taskRepresentation)

Create a standalone task

A standalone task is one which is not associated with any process instance.

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.createNewTask(taskRepresentation).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskRepresentation** | [**TaskRepresentation**](TaskRepresentation.md)| taskRepresentation | 

### Return type

[**TaskRepresentation**](TaskRepresentation.md)

<a name="deleteIdentityLink"></a>
# **deleteIdentityLink**
> deleteIdentityLink(taskIdfamilyidentityIdtype)

Remove a user or group involvement from a task

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.deleteIdentityLink(taskIdfamilyidentityIdtype).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **family** | **string**| family | 
 **identityId** | **string**| identityId | 
 **type** | **string**| type | 

### Return type

null (empty response body)

<a name="deleteTask"></a>
# **deleteTask**
> deleteTask(taskId)

Delete a task

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.deleteTask(taskId).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 

### Return type

null (empty response body)

<a name="filterTasks"></a>
# **filterTasks**
> ResultListDataRepresentationTaskRepresentation filterTasks(tasksFilter)

Filter a list of tasks

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.filterTasks(tasksFilter).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tasksFilter** | [**TaskFilterRequestRepresentation**](TaskFilterRequestRepresentation.md)| tasksFilter | 

### Return type

[**ResultListDataRepresentationTaskRepresentation**](ResultListDataRepresentationTaskRepresentation.md)

<a name="getIdentityLinkType"></a>
# **getIdentityLinkType**
> IdentityLinkRepresentation getIdentityLinkType(taskIdfamilyidentityIdtype)

Get a user or group involvement with a task

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.getIdentityLinkType(taskIdfamilyidentityIdtype).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **family** | **string**| family | 
 **identityId** | **string**| identityId | 
 **type** | **string**| type | 

### Return type

[**IdentityLinkRepresentation**](IdentityLinkRepresentation.md)

<a name="getIdentityLinksForFamily"></a>
# **getIdentityLinksForFamily**
> IdentityLinkRepresentation getIdentityLinksForFamily(taskIdfamily)

List either the users or groups involved with a process instance

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.getIdentityLinksForFamily(taskIdfamily).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **family** | **string**| family | 

### Return type

[**IdentityLinkRepresentation**](IdentityLinkRepresentation.md)

<a name="getIdentityLinks"></a>
# **getIdentityLinks**
> IdentityLinkRepresentation getIdentityLinks(taskId)

getIdentityLinks

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.getIdentityLinks(taskId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 

### Return type

[**IdentityLinkRepresentation**](IdentityLinkRepresentation.md)

<a name="getTaskAuditLog"></a>
# **getTaskAuditLog**
> TaskAuditInfoRepresentation getTaskAuditLog(taskId)

Get the audit log for a task

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.getTaskAuditLog(taskId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 

### Return type

[**TaskAuditInfoRepresentation**](TaskAuditInfoRepresentation.md)

<a name="getTask"></a>
# **getTask**
> TaskRepresentation getTask(taskId)

Get a task

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.getTask(taskId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 

### Return type

[**TaskRepresentation**](TaskRepresentation.md)

<a name="listHistoricTasks"></a>
# **listHistoricTasks**
> ResultListDataRepresentationTaskRepresentation listHistoricTasks(queryRequest)

Query historic tasks

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.listHistoricTasks(queryRequest).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **queryRequest** | [**HistoricTaskInstanceQueryRepresentation**](HistoricTaskInstanceQueryRepresentation.md)| queryRequest | 

### Return type

[**ResultListDataRepresentationTaskRepresentation**](ResultListDataRepresentationTaskRepresentation.md)

<a name="listTasks"></a>
# **listTasks**
> ResultListDataRepresentationTaskRepresentation listTasks(tasksQuery)

List tasks

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.listTasks(tasksQuery).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tasksQuery** | [**TaskQueryRepresentation**](TaskQueryRepresentation.md)| tasksQuery | 

### Return type

[**ResultListDataRepresentationTaskRepresentation**](ResultListDataRepresentationTaskRepresentation.md)

<a name="updateTask"></a>
# **updateTask**
> TaskRepresentation updateTask(taskIdupdated)

Update a task

You can edit only name, description and dueDate (ISO 8601 string).

### Example
```javascript
import TasksApi from 'TasksApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let tasksApi = new TasksApi(this.alfrescoApi);


tasksApi.updateTask(taskIdupdated).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **updated** | [**TaskUpdateRepresentation**](TaskUpdateRepresentation.md)| updated | 

### Return type

[**TaskRepresentation**](TaskRepresentation.md)

