# TaskactionsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**assignTask**](TaskActionsApi.md#assignTask) | **PUT** /enterprise/tasks/{taskId}/action/assign | Assign a task to a user
[**attachForm**](TaskActionsApi.md#attachForm) | **PUT** /enterprise/tasks/{taskId}/action/attach-form | Attach a form to a task
[**claimTask**](TaskActionsApi.md#claimTask) | **PUT** /enterprise/tasks/{taskId}/action/claim | Claim a task
[**completeTask**](TaskActionsApi.md#completeTask) | **PUT** /enterprise/tasks/{taskId}/action/complete | Complete a task
[**delegateTask**](TaskActionsApi.md#delegateTask) | **PUT** /enterprise/tasks/{taskId}/action/delegate | Delegate a task
[**involveGroup**](TaskActionsApi.md#involveGroup) | **POST** /enterprise/tasks/{taskId}/groups/{groupId} | Involve a group with a task
[**involveUser**](TaskActionsApi.md#involveUser) | **PUT** /enterprise/tasks/{taskId}/action/involve | Involve a user with a task
[**removeForm**](TaskActionsApi.md#removeForm) | **DELETE** /enterprise/tasks/{taskId}/action/remove-form | Remove a form from a task
[**removeInvolvedUser**](TaskActionsApi.md#removeInvolvedUser) | **DELETE** /enterprise/tasks/{taskId}/groups/{groupId} | Remove an involved group from a task
[**removeInvolvedUser**](TaskActionsApi.md#removeInvolvedUser) | **PUT** /enterprise/tasks/{taskId}/action/remove-involved | Remove an involved user from a task
[**resolveTask**](TaskActionsApi.md#resolveTask) | **PUT** /enterprise/tasks/{taskId}/action/resolve | Resolve a task
[**unclaimTask**](TaskActionsApi.md#unclaimTask) | **PUT** /enterprise/tasks/{taskId}/action/unclaim | Unclaim a task


<a name="assignTask"></a>
# **assignTask**
> TaskRepresentation assignTask(taskIduserIdentifier)

Assign a task to a user

### Example

```javascript
import TaskactionsApi from 'src/api/activiti-rest-api/docs/TaskActionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskactionsApi = new TaskactionsApi(this.alfrescoApi);


taskactionsApi.assignTask(taskIduserIdentifier).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **userIdentifier** | [**AssigneeIdentifierRepresentation**](AssigneeIdentifierRepresentation.md)| userIdentifier | 

### Return type

[**TaskRepresentation**](TaskRepresentation.md)

<a name="attachForm"></a>
# **attachForm**
> attachForm(taskIdformIdentifier)

Attach a form to a task

### Example

```javascript
import TaskactionsApi from 'src/api/activiti-rest-api/docs/TaskActionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskactionsApi = new TaskactionsApi(this.alfrescoApi);


taskactionsApi.attachForm(taskIdformIdentifier).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **formIdentifier** | [**FormIdentifierRepresentation**](FormIdentifierRepresentation.md)| formIdentifier | 

### Return type

null (empty response body)

<a name="claimTask"></a>
# **claimTask**
> claimTask(taskId)

Claim a task

To claim a task (in case the task is assigned to a group)

### Example

```javascript
import TaskactionsApi from 'src/api/activiti-rest-api/docs/TaskActionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskactionsApi = new TaskactionsApi(this.alfrescoApi);


taskactionsApi.claimTask(taskId).then(() => {
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

<a name="completeTask"></a>
# **completeTask**
> completeTask(taskId)

Complete a task

Use this endpoint to complete a standalone task or task without a form

### Example

```javascript
import TaskactionsApi from 'src/api/activiti-rest-api/docs/TaskActionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskactionsApi = new TaskactionsApi(this.alfrescoApi);


taskactionsApi.completeTask(taskId).then(() => {
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

<a name="delegateTask"></a>
# **delegateTask**
> delegateTask(taskIduserIdentifier)

Delegate a task

### Example

```javascript
import TaskactionsApi from 'src/api/activiti-rest-api/docs/TaskActionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskactionsApi = new TaskactionsApi(this.alfrescoApi);


taskactionsApi.delegateTask(taskIduserIdentifier).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **userIdentifier** | [**UserIdentifierRepresentation**](UserIdentifierRepresentation.md)| userIdentifier | 

### Return type

null (empty response body)

<a name="involveGroup"></a>
# **involveGroup**
> involveGroup(taskIdgroupId)

Involve a group with a task

### Example

```javascript
import TaskactionsApi from 'src/api/activiti-rest-api/docs/TaskActionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskactionsApi = new TaskactionsApi(this.alfrescoApi);


taskactionsApi.involveGroup(taskIdgroupId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **groupId** | **string**| groupId | 

### Return type

null (empty response body)

<a name="involveUser"></a>
# **involveUser**
> involveUser(taskIduserIdentifier)

Involve a user with a task

### Example

```javascript
import TaskactionsApi from 'src/api/activiti-rest-api/docs/TaskActionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskactionsApi = new TaskactionsApi(this.alfrescoApi);


taskactionsApi.involveUser(taskIduserIdentifier).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **userIdentifier** | [**UserIdentifierRepresentation**](UserIdentifierRepresentation.md)| userIdentifier | 

### Return type

null (empty response body)

<a name="removeForm"></a>
# **removeForm**
> removeForm(taskId)

Remove a form from a task

### Example

```javascript
import TaskactionsApi from 'src/api/activiti-rest-api/docs/TaskActionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskactionsApi = new TaskactionsApi(this.alfrescoApi);


taskactionsApi.removeForm(taskId).then(() => {
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

<a name="removeInvolvedUser"></a>
# **removeInvolvedUser**
> removeInvolvedUser(taskIdgroupId)

Remove an involved group from a task

### Example

```javascript
import TaskactionsApi from 'src/api/activiti-rest-api/docs/TaskActionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskactionsApi = new TaskactionsApi(this.alfrescoApi);


taskactionsApi.removeInvolvedUser(taskIdgroupId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **groupId** | **string**| groupId | 

### Return type

null (empty response body)

<a name="removeInvolvedUser"></a>
# **removeInvolvedUser**
> removeInvolvedUser(taskIduserIdentifier)

Remove an involved user from a task

### Example

```javascript
import TaskactionsApi from 'src/api/activiti-rest-api/docs/TaskActionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskactionsApi = new TaskactionsApi(this.alfrescoApi);


taskactionsApi.removeInvolvedUser(taskIduserIdentifier).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **userIdentifier** | [**UserIdentifierRepresentation**](UserIdentifierRepresentation.md)| userIdentifier | 

### Return type

null (empty response body)

<a name="resolveTask"></a>
# **resolveTask**
> resolveTask(taskId)

Resolve a task

### Example

```javascript
import TaskactionsApi from 'src/api/activiti-rest-api/docs/TaskActionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskactionsApi = new TaskactionsApi(this.alfrescoApi);


taskactionsApi.resolveTask(taskId).then(() => {
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

<a name="unclaimTask"></a>
# **unclaimTask**
> unclaimTask(taskId)

Unclaim a task

To unclaim a task (in case the task was assigned to a group)

### Example

```javascript
import TaskactionsApi from 'src/api/activiti-rest-api/docs/TaskActionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let taskactionsApi = new TaskactionsApi(this.alfrescoApi);


taskactionsApi.unclaimTask(taskId).then(() => {
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

