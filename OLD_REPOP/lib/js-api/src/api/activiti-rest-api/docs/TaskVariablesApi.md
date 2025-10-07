# TaskvariablesApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createTaskVariable**](TaskVariablesApi.md#createTaskVariable) | **POST** /enterprise/tasks/{taskId}/variables | Create variables
[**deleteAllLocalTaskVariables**](TaskVariablesApi.md#deleteAllLocalTaskVariables) | **DELETE** /enterprise/tasks/{taskId}/variables | Create or update variables
[**deleteVariable**](TaskVariablesApi.md#deleteVariable) | **DELETE** /enterprise/tasks/{taskId}/variables/{variableName} | Delete a variable
[**getVariable**](TaskVariablesApi.md#getVariable) | **GET** /enterprise/tasks/{taskId}/variables/{variableName} | Get a variable
[**getVariables**](TaskVariablesApi.md#getVariables) | **GET** /enterprise/tasks/{taskId}/variables | List variables
[**updateVariable**](TaskVariablesApi.md#updateVariable) | **PUT** /enterprise/tasks/{taskId}/variables/{variableName} | Update a variable


<a name="createTaskVariable"></a>
# **createTaskVariable**
> RestVariable createTaskVariable(taskIdrestVariables)

Create variables

### Example

```javascript
import TaskvariablesApi from 'src/api/activiti-rest-api/docs/TaskVariablesApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskvariablesApi = new TaskvariablesApi(this.alfrescoApi);


taskvariablesApi.createTaskVariable(taskIdrestVariables).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **restVariables** | [**RestVariable**](RestVariable.md)| restVariables | 

### Return type

[**RestVariable**](RestVariable.md)

<a name="deleteAllLocalTaskVariables"></a>
# **deleteAllLocalTaskVariables**
> deleteAllLocalTaskVariables(taskId)

Create or update variables

### Example

```javascript
import TaskvariablesApi from 'src/api/activiti-rest-api/docs/TaskVariablesApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskvariablesApi = new TaskvariablesApi(this.alfrescoApi);


taskvariablesApi.deleteAllLocalTaskVariables(taskId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 

### Return type

null (empty response body)

<a name="deleteVariable"></a>
# **deleteVariable**
> deleteVariable(taskIdvariableNameopts)

Delete a variable

### Example

```javascript
import TaskvariablesApi from 'src/api/activiti-rest-api/docs/TaskVariablesApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskvariablesApi = new TaskvariablesApi(this.alfrescoApi);

let opts = {
    'scope': scope_example //  | scope
};

taskvariablesApi.deleteVariable(taskIdvariableNameopts).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **variableName** | **string**| variableName | 
 **scope** | **string**| scope | [optional] 

### Return type

null (empty response body)

<a name="getVariable"></a>
# **getVariable**
> RestVariable getVariable(taskIdvariableNameopts)

Get a variable

### Example

```javascript
import TaskvariablesApi from 'src/api/activiti-rest-api/docs/TaskVariablesApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskvariablesApi = new TaskvariablesApi(this.alfrescoApi);

let opts = {
    'scope': scope_example //  | scope
};

taskvariablesApi.getVariable(taskIdvariableNameopts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **variableName** | **string**| variableName | 
 **scope** | **string**| scope | [optional] 

### Return type

[**RestVariable**](RestVariable.md)

<a name="getVariables"></a>
# **getVariables**
> RestVariable getVariables(taskIdopts)

List variables

### Example

```javascript
import TaskvariablesApi from 'src/api/activiti-rest-api/docs/TaskVariablesApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskvariablesApi = new TaskvariablesApi(this.alfrescoApi);

let opts = {
    'scope': scope_example //  | scope
};

taskvariablesApi.getVariables(taskIdopts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **scope** | **string**| scope | [optional] 

### Return type

[**RestVariable**](RestVariable.md)

<a name="updateVariable"></a>
# **updateVariable**
> RestVariable updateVariable(taskIdvariableNamerestVariable)

Update a variable

### Example

```javascript
import TaskvariablesApi from 'src/api/activiti-rest-api/docs/TaskVariablesApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskvariablesApi = new TaskvariablesApi(this.alfrescoApi);


taskvariablesApi.updateVariable(taskIdvariableNamerestVariable).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **variableName** | **string**| variableName | 
 **restVariable** | [**RestVariable**](RestVariable.md)| restVariable | 

### Return type

[**RestVariable**](RestVariable.md)

