# TaskformsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**completeTaskForm**](TaskFormsApi.md#completeTaskForm) | **POST** /enterprise/task-forms/{taskId} | Complete a task form
[**getProcessInstanceVariables**](TaskFormsApi.md#getProcessInstanceVariables) | **GET** /enterprise/task-forms/{taskId}/variables | Get task variables
[**getRestFieldValues**](TaskFormsApi.md#getRestFieldValues) | **GET** /enterprise/task-forms/{taskId}/form-values/{field}/{column} | Retrieve column field values
[**getRestFieldValues**](TaskFormsApi.md#getRestFieldValues) | **GET** /enterprise/task-forms/{taskId}/form-values/{field} | Retrieve populated field values
[**getTaskForm**](TaskFormsApi.md#getTaskForm) | **GET** /enterprise/task-forms/{taskId} | Get a task form
[**saveTaskForm**](TaskFormsApi.md#saveTaskForm) | **POST** /enterprise/task-forms/{taskId}/save-form | Save a task form


<a name="completeTaskForm"></a>
# **completeTaskForm**
> completeTaskForm(taskIdcompleteTaskFormRepresentation)

Complete a task form

### Example

```javascript
import TaskformsApi from 'src/api/activiti-rest-api/docs/TaskFormsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskformsApi = new TaskformsApi(this.alfrescoApi);


taskformsApi.completeTaskForm(taskIdcompleteTaskFormRepresentation).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **completeTaskFormRepresentation** | [**CompleteFormRepresentation**](CompleteFormRepresentation.md)| completeTaskFormRepresentation | 

### Return type

null (empty response body)

<a name="getProcessInstanceVariables"></a>
# **getProcessInstanceVariables**
> ProcessInstanceVariableRepresentation getProcessInstanceVariables(taskId)

Get task variables

### Example

```javascript
import TaskformsApi from 'src/api/activiti-rest-api/docs/TaskFormsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskformsApi = new TaskformsApi(this.alfrescoApi);


taskformsApi.getProcessInstanceVariables(taskId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 

### Return type

[**ProcessInstanceVariableRepresentation**](ProcessInstanceVariableRepresentation.md)

<a name="getRestFieldValues"></a>
# **getRestFieldValues**
> FormValueRepresentation getRestFieldValues(taskIdfieldcolumn)

Retrieve column field values

Specific case to retrieve information on a specific column

### Example

```javascript
import TaskformsApi from 'src/api/activiti-rest-api/docs/TaskFormsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskformsApi = new TaskformsApi(this.alfrescoApi);


taskformsApi.getRestFieldValues(taskIdfieldcolumn).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **field** | **string**| field | 
 **column** | **string**| column | 

### Return type

[**FormValueRepresentation**](FormValueRepresentation.md)

<a name="getRestFieldValues"></a>
# **getRestFieldValues**
> FormValueRepresentation getRestFieldValues(taskIdfield)

Retrieve populated field values

Form field values that are populated through a REST backend, can be retrieved via this service

### Example

```javascript
import TaskformsApi from 'src/api/activiti-rest-api/docs/TaskFormsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskformsApi = new TaskformsApi(this.alfrescoApi);


taskformsApi.getRestFieldValues(taskIdfield).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **field** | **string**| field | 

### Return type

[**FormValueRepresentation**](FormValueRepresentation.md)

<a name="getTaskForm"></a>
# **getTaskForm**
> FormDefinitionRepresentation getTaskForm(taskId)

Get a task form

### Example

```javascript
import TaskformsApi from 'src/api/activiti-rest-api/docs/TaskFormsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskformsApi = new TaskformsApi(this.alfrescoApi);


taskformsApi.getTaskForm(taskId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 

### Return type

[**FormDefinitionRepresentation**](FormDefinitionRepresentation.md)

<a name="saveTaskForm"></a>
# **saveTaskForm**
> saveTaskForm(taskIdsaveTaskFormRepresentation)

Save a task form

### Example

```javascript
import TaskformsApi from 'src/api/activiti-rest-api/docs/TaskFormsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskformsApi = new TaskformsApi(this.alfrescoApi);


taskformsApi.saveTaskForm(taskIdsaveTaskFormRepresentation).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **saveTaskFormRepresentation** | [**SaveFormRepresentation**](SaveFormRepresentation.md)| saveTaskFormRepresentation | 

### Return type

null (empty response body)

