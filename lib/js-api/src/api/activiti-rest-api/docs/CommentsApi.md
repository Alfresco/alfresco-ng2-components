# CommentsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addProcessInstanceComment**](CommentsApi.md#addProcessInstanceComment) | **POST** /enterprise/process-instances/{processInstanceId}/comments | Add a comment to a process instance
[**addTaskComment**](CommentsApi.md#addTaskComment) | **POST** /enterprise/tasks/{taskId}/comments | Add a comment to a task
[**getProcessInstanceComments**](CommentsApi.md#getProcessInstanceComments) | **GET** /enterprise/process-instances/{processInstanceId}/comments | Get comments for a process
[**getTaskComments**](CommentsApi.md#getTaskComments) | **GET** /enterprise/tasks/{taskId}/comments | Get comments for a task


<a name="addProcessInstanceComment"></a>
# **addProcessInstanceComment**
> CommentRepresentation addProcessInstanceComment(commentRequestprocessInstanceId)

Add a comment to a process instance

### Example
```javascript
import CommentsApi from 'CommentsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let commentsApi = new CommentsApi(this.alfrescoApi);


commentsApi.addProcessInstanceComment(commentRequestprocessInstanceId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **commentRequest** | [**CommentRepresentation**](CommentRepresentation.md)| commentRequest | 
 **processInstanceId** | **string**| processInstanceId | 

### Return type

[**CommentRepresentation**](CommentRepresentation.md)

<a name="addTaskComment"></a>
# **addTaskComment**
> CommentRepresentation addTaskComment(commentRequesttaskId)

Add a comment to a task

### Example
```javascript
import CommentsApi from 'CommentsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let commentsApi = new CommentsApi(this.alfrescoApi);


commentsApi.addTaskComment(commentRequesttaskId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **commentRequest** | [**CommentRepresentation**](CommentRepresentation.md)| commentRequest | 
 **taskId** | **string**| taskId | 

### Return type

[**CommentRepresentation**](CommentRepresentation.md)

<a name="getProcessInstanceComments"></a>
# **getProcessInstanceComments**
> ResultListDataRepresentationCommentRepresentation getProcessInstanceComments(processInstanceIdopts)

Get comments for a process

### Example
```javascript
import CommentsApi from 'CommentsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let commentsApi = new CommentsApi(this.alfrescoApi);

let opts = { 
  'latestFirst': true //  | latestFirst
};

commentsApi.getProcessInstanceComments(processInstanceIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processInstanceId** | **string**| processInstanceId | 
 **latestFirst** | **boolean**| latestFirst | [optional] 

### Return type

[**ResultListDataRepresentationCommentRepresentation**](ResultListDataRepresentationCommentRepresentation.md)

<a name="getTaskComments"></a>
# **getTaskComments**
> ResultListDataRepresentationCommentRepresentation getTaskComments(taskIdopts)

Get comments for a task

### Example
```javascript
import CommentsApi from 'CommentsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let commentsApi = new CommentsApi(this.alfrescoApi);

let opts = { 
  'latestFirst': true //  | latestFirst
};

commentsApi.getTaskComments(taskIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **latestFirst** | **boolean**| latestFirst | [optional] 

### Return type

[**ResultListDataRepresentationCommentRepresentation**](ResultListDataRepresentationCommentRepresentation.md)

