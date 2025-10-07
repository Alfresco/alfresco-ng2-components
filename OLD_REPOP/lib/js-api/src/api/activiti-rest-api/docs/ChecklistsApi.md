# ChecklistsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addSubtask**](ChecklistsApi.md#addSubtask) | **POST** /enterprise/tasks/{taskId}/checklist | Create a task checklist
[**getChecklist**](ChecklistsApi.md#getChecklist) | **GET** /enterprise/tasks/{taskId}/checklist | Get checklist for a task
[**orderChecklist**](ChecklistsApi.md#orderChecklist) | **PUT** /enterprise/tasks/{taskId}/checklist | Change the order of items on a checklist


<a name="addSubtask"></a>
# **addSubtask**
> TaskRepresentation addSubtask(taskIdtaskRepresentation)

Create a task checklist

### Example
```javascript
import ChecklistsApi from 'ChecklistsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let checklistsApi = new ChecklistsApi(this.alfrescoApi);


checklistsApi.addSubtask(taskIdtaskRepresentation).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **taskRepresentation** | [**TaskRepresentation**](TaskRepresentation.md)| taskRepresentation | 

### Return type

[**TaskRepresentation**](TaskRepresentation.md)

<a name="getChecklist"></a>
# **getChecklist**
> ResultListDataRepresentationTaskRepresentation getChecklist(taskId)

Get checklist for a task

### Example
```javascript
import ChecklistsApi from 'ChecklistsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let checklistsApi = new ChecklistsApi(this.alfrescoApi);


checklistsApi.getChecklist(taskId).then((data) => {
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

[**ResultListDataRepresentationTaskRepresentation**](ResultListDataRepresentationTaskRepresentation.md)

<a name="orderChecklist"></a>
# **orderChecklist**
> orderChecklist(taskIdorderRepresentation)

Change the order of items on a checklist

### Example
```javascript
import ChecklistsApi from 'ChecklistsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let checklistsApi = new ChecklistsApi(this.alfrescoApi);


checklistsApi.orderChecklist(taskIdorderRepresentation).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **orderRepresentation** | [**ChecklistOrderRepresentation**](ChecklistOrderRepresentation.md)| orderRepresentation | 

### Return type

null (empty response body)

