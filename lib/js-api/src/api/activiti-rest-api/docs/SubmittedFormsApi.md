# SubmittedformsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getFormSubmittedForms**](SubmittedFormsApi.md#getFormSubmittedForms) | **GET** /enterprise/form-submitted-forms/{formId} | List submissions for a form
[**getProcessSubmittedForms**](SubmittedFormsApi.md#getProcessSubmittedForms) | **GET** /enterprise/process-submitted-forms/{processId} | List submissions for a process instance
[**getSubmittedFrom**](SubmittedFormsApi.md#getSubmittedFrom) | **GET** /enterprise/submitted-forms/{submittedFormId} | Get a form submission
[**getTaskSubmittedForms**](SubmittedFormsApi.md#getTaskSubmittedForms) | **GET** /enterprise/task-submitted-form/{taskId} | Get the submitted form for a task


<a name="getFormSubmittedForms"></a>
# **getFormSubmittedForms**
> ResultListDataRepresentationSubmittedFormRepresentation getFormSubmittedForms(formIdopts)

List submissions for a form

### Example

```javascript
import SubmittedformsApi from 'src/api/activiti-rest-api/docs/SubmittedFormsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let submittedformsApi = new SubmittedformsApi(this.alfrescoApi);

let opts = {
    'submittedBy': 789 //  | submittedBy
    'start': 56 //  | start
    'size': 56 //  | size
};

submittedformsApi.getFormSubmittedForms(formIdopts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **formId** | **number**| formId | 
 **submittedBy** | **number**| submittedBy | [optional] 
 **start** | **number**| start | [optional] 
 **size** | **number**| size | [optional] 

### Return type

[**ResultListDataRepresentationSubmittedFormRepresentation**](ResultListDataRepresentationSubmittedFormRepresentation.md)

<a name="getProcessSubmittedForms"></a>
# **getProcessSubmittedForms**
> ResultListDataRepresentationSubmittedFormRepresentation getProcessSubmittedForms(processId)

List submissions for a process instance

### Example

```javascript
import SubmittedformsApi from 'src/api/activiti-rest-api/docs/SubmittedFormsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let submittedformsApi = new SubmittedformsApi(this.alfrescoApi);


submittedformsApi.getProcessSubmittedForms(processId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processId** | **string**| processId | 

### Return type

[**ResultListDataRepresentationSubmittedFormRepresentation**](ResultListDataRepresentationSubmittedFormRepresentation.md)

<a name="getSubmittedFrom"></a>
# **getSubmittedFrom**
> SubmittedFormRepresentation getSubmittedFrom(submittedFormId)

Get a form submission

### Example

```javascript
import SubmittedformsApi from 'src/api/activiti-rest-api/docs/SubmittedFormsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let submittedformsApi = new SubmittedformsApi(this.alfrescoApi);


submittedformsApi.getSubmittedFrom(submittedFormId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **submittedFormId** | **number**| submittedFormId | 

### Return type

[**SubmittedFormRepresentation**](SubmittedFormRepresentation.md)

<a name="getTaskSubmittedForms"></a>
# **getTaskSubmittedForms**
> SubmittedFormRepresentation getTaskSubmittedForms(taskId)

Get the submitted form for a task

### Example

```javascript
import SubmittedformsApi from 'src/api/activiti-rest-api/docs/SubmittedFormsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let submittedformsApi = new SubmittedformsApi(this.alfrescoApi);


submittedformsApi.getTaskSubmittedForms(taskId).then((data) => {
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

[**SubmittedFormRepresentation**](SubmittedFormRepresentation.md)

