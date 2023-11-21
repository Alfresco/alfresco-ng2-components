# UserfiltersApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUserProcessInstanceFilter**](UserFiltersApi.md#createUserProcessInstanceFilter) | **POST** /enterprise/filters/processes | Create a process instance filter
[**createUserTaskFilter**](UserFiltersApi.md#createUserTaskFilter) | **POST** /enterprise/filters/tasks | Create a task filter
[**deleteUserProcessInstanceFilter**](UserFiltersApi.md#deleteUserProcessInstanceFilter) | **DELETE** /enterprise/filters/processes/{userFilterId} | Delete a process instance filter
[**deleteUserTaskFilter**](UserFiltersApi.md#deleteUserTaskFilter) | **DELETE** /enterprise/filters/tasks/{userFilterId} | Delete a task filter
[**getUserProcessInstanceFilter**](UserFiltersApi.md#getUserProcessInstanceFilter) | **GET** /enterprise/filters/processes/{userFilterId} | Get a process instance filter
[**getUserProcessInstanceFilters**](UserFiltersApi.md#getUserProcessInstanceFilters) | **GET** /enterprise/filters/processes | List process instance filters
[**getUserTaskFilter**](UserFiltersApi.md#getUserTaskFilter) | **GET** /enterprise/filters/tasks/{userFilterId} | Get a task filter
[**getUserTaskFilters**](UserFiltersApi.md#getUserTaskFilters) | **GET** /enterprise/filters/tasks | List task filters
[**orderUserProcessInstanceFilters**](UserFiltersApi.md#orderUserProcessInstanceFilters) | **PUT** /enterprise/filters/processes | Re-order the list of user process instance filters
[**orderUserTaskFilters**](UserFiltersApi.md#orderUserTaskFilters) | **PUT** /enterprise/filters/tasks | Re-order the list of user task filters
[**updateUserProcessInstanceFilter**](UserFiltersApi.md#updateUserProcessInstanceFilter) | **PUT** /enterprise/filters/processes/{userFilterId} | Update a process instance filter
[**updateUserTaskFilter**](UserFiltersApi.md#updateUserTaskFilter) | **PUT** /enterprise/filters/tasks/{userFilterId} | Update a task filter


<a name="createUserProcessInstanceFilter"></a>
# **createUserProcessInstanceFilter**
> UserProcessInstanceFilterRepresentation createUserProcessInstanceFilter(userProcessInstanceFilterRepresentation)

Create a process instance filter

### Example

```javascript
import UserfiltersApi from 'src/api/activiti-rest-api/docs/UserFiltersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userfiltersApi = new UserfiltersApi(this.alfrescoApi);


userfiltersApi.createUserProcessInstanceFilter(userProcessInstanceFilterRepresentation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userProcessInstanceFilterRepresentation** | [**UserProcessInstanceFilterRepresentation**](UserProcessInstanceFilterRepresentation.md)| userProcessInstanceFilterRepresentation | 

### Return type

[**UserProcessInstanceFilterRepresentation**](UserProcessInstanceFilterRepresentation.md)

<a name="createUserTaskFilter"></a>
# **createUserTaskFilter**
> UserTaskFilterRepresentation createUserTaskFilter(userTaskFilterRepresentation)

Create a task filter

### Example

```javascript
import UserfiltersApi from 'src/api/activiti-rest-api/docs/UserFiltersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userfiltersApi = new UserfiltersApi(this.alfrescoApi);


userfiltersApi.createUserTaskFilter(userTaskFilterRepresentation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userTaskFilterRepresentation** | [**UserTaskFilterRepresentation**](UserTaskFilterRepresentation.md)| userTaskFilterRepresentation | 

### Return type

[**UserTaskFilterRepresentation**](UserTaskFilterRepresentation.md)

<a name="deleteUserProcessInstanceFilter"></a>
# **deleteUserProcessInstanceFilter**
> deleteUserProcessInstanceFilter(userFilterId)

Delete a process instance filter

### Example

```javascript
import UserfiltersApi from 'src/api/activiti-rest-api/docs/UserFiltersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userfiltersApi = new UserfiltersApi(this.alfrescoApi);


userfiltersApi.deleteUserProcessInstanceFilter(userFilterId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userFilterId** | **number**| userFilterId | 

### Return type

null (empty response body)

<a name="deleteUserTaskFilter"></a>
# **deleteUserTaskFilter**
> deleteUserTaskFilter(userFilterId)

Delete a task filter

### Example

```javascript
import UserfiltersApi from 'src/api/activiti-rest-api/docs/UserFiltersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userfiltersApi = new UserfiltersApi(this.alfrescoApi);


userfiltersApi.deleteUserTaskFilter(userFilterId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userFilterId** | **number**| userFilterId | 

### Return type

null (empty response body)

<a name="getUserProcessInstanceFilter"></a>
# **getUserProcessInstanceFilter**
> UserProcessInstanceFilterRepresentation getUserProcessInstanceFilter(userFilterId)

Get a process instance filter

### Example

```javascript
import UserfiltersApi from 'src/api/activiti-rest-api/docs/UserFiltersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userfiltersApi = new UserfiltersApi(this.alfrescoApi);


userfiltersApi.getUserProcessInstanceFilter(userFilterId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userFilterId** | **number**| userFilterId | 

### Return type

[**UserProcessInstanceFilterRepresentation**](UserProcessInstanceFilterRepresentation.md)

<a name="getUserProcessInstanceFilters"></a>
# **getUserProcessInstanceFilters**
> ResultListDataRepresentationUserProcessInstanceFilterRepresentation getUserProcessInstanceFilters(opts)

List process instance filters

Returns filters for the current user, optionally filtered by *appId*.

### Example

```javascript
import UserfiltersApi from 'src/api/activiti-rest-api/docs/UserFiltersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userfiltersApi = new UserfiltersApi(this.alfrescoApi);

let opts = {
    'appId': 789 //  | appId
};

userfiltersApi.getUserProcessInstanceFilters(opts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appId** | **number**| appId | [optional] 

### Return type

[**ResultListDataRepresentationUserProcessInstanceFilterRepresentation**](ResultListDataRepresentationUserProcessInstanceFilterRepresentation.md)

<a name="getUserTaskFilter"></a>
# **getUserTaskFilter**
> UserTaskFilterRepresentation getUserTaskFilter(userFilterId)

Get a task filter

### Example

```javascript
import UserfiltersApi from 'src/api/activiti-rest-api/docs/UserFiltersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userfiltersApi = new UserfiltersApi(this.alfrescoApi);


userfiltersApi.getUserTaskFilter(userFilterId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userFilterId** | **number**| userFilterId | 

### Return type

[**UserTaskFilterRepresentation**](UserTaskFilterRepresentation.md)

<a name="getUserTaskFilters"></a>
# **getUserTaskFilters**
> ResultListDataRepresentationUserTaskFilterRepresentation getUserTaskFilters(opts)

List task filters

Returns filters for the current user, optionally filtered by *appId*.

### Example

```javascript
import UserfiltersApi from 'src/api/activiti-rest-api/docs/UserFiltersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userfiltersApi = new UserfiltersApi(this.alfrescoApi);

let opts = {
    'appId': 789 //  | appId
};

userfiltersApi.getUserTaskFilters(opts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appId** | **number**| appId | [optional] 

### Return type

[**ResultListDataRepresentationUserTaskFilterRepresentation**](ResultListDataRepresentationUserTaskFilterRepresentation.md)

<a name="orderUserProcessInstanceFilters"></a>
# **orderUserProcessInstanceFilters**
> orderUserProcessInstanceFilters(filterOrderRepresentation)

Re-order the list of user process instance filters

### Example

```javascript
import UserfiltersApi from 'src/api/activiti-rest-api/docs/UserFiltersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userfiltersApi = new UserfiltersApi(this.alfrescoApi);


userfiltersApi.orderUserProcessInstanceFilters(filterOrderRepresentation).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filterOrderRepresentation** | [**UserFilterOrderRepresentation**](UserFilterOrderRepresentation.md)| filterOrderRepresentation | 

### Return type

null (empty response body)

<a name="orderUserTaskFilters"></a>
# **orderUserTaskFilters**
> orderUserTaskFilters(filterOrderRepresentation)

Re-order the list of user task filters

### Example

```javascript
import UserfiltersApi from 'src/api/activiti-rest-api/docs/UserFiltersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userfiltersApi = new UserfiltersApi(this.alfrescoApi);


userfiltersApi.orderUserTaskFilters(filterOrderRepresentation).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filterOrderRepresentation** | [**UserFilterOrderRepresentation**](UserFilterOrderRepresentation.md)| filterOrderRepresentation | 

### Return type

null (empty response body)

<a name="updateUserProcessInstanceFilter"></a>
# **updateUserProcessInstanceFilter**
> UserProcessInstanceFilterRepresentation updateUserProcessInstanceFilter(userFilterIduserProcessInstanceFilterRepresentation)

Update a process instance filter

### Example

```javascript
import UserfiltersApi from 'src/api/activiti-rest-api/docs/UserFiltersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userfiltersApi = new UserfiltersApi(this.alfrescoApi);


userfiltersApi.updateUserProcessInstanceFilter(userFilterIduserProcessInstanceFilterRepresentation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userFilterId** | **number**| userFilterId | 
 **userProcessInstanceFilterRepresentation** | [**UserProcessInstanceFilterRepresentation**](UserProcessInstanceFilterRepresentation.md)| userProcessInstanceFilterRepresentation | 

### Return type

[**UserProcessInstanceFilterRepresentation**](UserProcessInstanceFilterRepresentation.md)

<a name="updateUserTaskFilter"></a>
# **updateUserTaskFilter**
> UserTaskFilterRepresentation updateUserTaskFilter(userFilterIduserTaskFilterRepresentation)

Update a task filter

### Example

```javascript
import UserfiltersApi from 'src/api/activiti-rest-api/docs/UserFiltersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userfiltersApi = new UserfiltersApi(this.alfrescoApi);


userfiltersApi.updateUserTaskFilter(userFilterIduserTaskFilterRepresentation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userFilterId** | **number**| userFilterId | 
 **userTaskFilterRepresentation** | [**UserTaskFilterRepresentation**](UserTaskFilterRepresentation.md)| userTaskFilterRepresentation | 

### Return type

[**UserTaskFilterRepresentation**](UserTaskFilterRepresentation.md)

