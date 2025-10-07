# ContentApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createRelatedContentOnProcessInstance**](ContentApi.md#createRelatedContentOnProcessInstance) | **POST** /enterprise/process-instances/{processInstanceId}/content | Attach existing content to a process instance
[**createRelatedContentOnProcessInstance**](ContentApi.md#createRelatedContentOnProcessInstance) | **POST** /enterprise/process-instances/{processInstanceId}/raw-content | Upload content and attach to a process instance
[**createRelatedContentOnTask**](ContentApi.md#createRelatedContentOnTask) | **POST** /enterprise/tasks/{taskId}/content | Attach existing content to a task
[**createRelatedContentOnTask**](ContentApi.md#createRelatedContentOnTask) | **POST** /enterprise/tasks/{taskId}/raw-content | Upload content and attach to a task
[**createTemporaryRawRelatedContent**](ContentApi.md#createTemporaryRawRelatedContent) | **POST** /enterprise/content/raw | Upload content and create a local representation
[**createTemporaryRelatedContent**](ContentApi.md#createTemporaryRelatedContent) | **POST** /enterprise/content | Create a local representation of content from a remote repository
[**deleteContent**](ContentApi.md#deleteContent) | **DELETE** /enterprise/content/{contentId} | Remove a local content representation
[**getContent**](ContentApi.md#getContent) | **GET** /enterprise/content/{contentId} | Get a local content representation
[**getRawContent**](ContentApi.md#getRawContent) | **GET** /enterprise/content/{contentId}/rendition/{renditionType} | Stream content rendition
[**getRawContent**](ContentApi.md#getRawContent) | **GET** /enterprise/content/{contentId}/raw | Stream content from a local content representation
[**getRelatedContentForProcessInstance**](ContentApi.md#getRelatedContentForProcessInstance) | **GET** /enterprise/process-instances/{processInstanceId}/content | List content attached to a process instance
[**getRelatedContentForTask**](ContentApi.md#getRelatedContentForTask) | **GET** /enterprise/tasks/{taskId}/content | List content attached to a task
[**getProcessesAndTasksOnContent**](ContentApi.md#getProcessesAndTasksOnContent) | **GET** enterprise/content/document-runtime | Lists processes and tasks on workflow started with provided document

<a name="createRelatedContentOnProcessInstance"></a>
# **createRelatedContentOnProcessInstance**
> RelatedContentRepresentation createRelatedContentOnProcessInstance(processInstanceIdrelatedContentopts)

Attach existing content to a process instance

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let contentApi = new ContentApi(this.alfrescoApi);

let opts = { 
  'isRelatedContent': true //  | isRelatedContent
};

contentApi.createRelatedContentOnProcessInstance(processInstanceIdrelatedContentopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processInstanceId** | **string**| processInstanceId | 
 **relatedContent** | [**RelatedContentRepresentation**](RelatedContentRepresentation.md)| relatedContent | 
 **isRelatedContent** | **boolean**| isRelatedContent | [optional] 

### Return type

[**RelatedContentRepresentation**](RelatedContentRepresentation.md)

<a name="createRelatedContentOnProcessInstance"></a>
# **createRelatedContentOnProcessInstance**
> RelatedContentRepresentation createRelatedContentOnProcessInstance(processInstanceIdfileopts)

Upload content and attach to a process instance

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let contentApi = new ContentApi(this.alfrescoApi);

let opts = { 
  'isRelatedContent': true //  | isRelatedContent
};

contentApi.createRelatedContentOnProcessInstance(processInstanceIdfileopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processInstanceId** | **string**| processInstanceId | 
 **file** | **Blob**| file | 
 **isRelatedContent** | **boolean**| isRelatedContent | [optional] 

### Return type

[**RelatedContentRepresentation**](RelatedContentRepresentation.md)

<a name="createRelatedContentOnTask"></a>
# **createRelatedContentOnTask**
> RelatedContentRepresentation createRelatedContentOnTask(taskIdrelatedContentopts)

Attach existing content to a task

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let contentApi = new ContentApi(this.alfrescoApi);

let opts = { 
  'isRelatedContent': true //  | isRelatedContent
};

contentApi.createRelatedContentOnTask(taskIdrelatedContentopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **relatedContent** | [**RelatedContentRepresentation**](RelatedContentRepresentation.md)| relatedContent | 
 **isRelatedContent** | **boolean**| isRelatedContent | [optional] 

### Return type

[**RelatedContentRepresentation**](RelatedContentRepresentation.md)

<a name="createRelatedContentOnTask"></a>
# **createRelatedContentOnTask**
> RelatedContentRepresentation createRelatedContentOnTask(taskIdfileopts)

Upload content and attach to a task

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let contentApi = new ContentApi(this.alfrescoApi);

let opts = { 
  'isRelatedContent': true //  | isRelatedContent
};

contentApi.createRelatedContentOnTask(taskIdfileopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **file** | **Blob**| file | 
 **isRelatedContent** | **boolean**| isRelatedContent | [optional] 

### Return type

[**RelatedContentRepresentation**](RelatedContentRepresentation.md)

<a name="createTemporaryRawRelatedContent"></a>
# **createTemporaryRawRelatedContent**
> RelatedContentRepresentation createTemporaryRawRelatedContent(file)

Upload content and create a local representation

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let contentApi = new ContentApi(this.alfrescoApi);


contentApi.createTemporaryRawRelatedContent(file).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | **Blob**| file | 

### Return type

[**RelatedContentRepresentation**](RelatedContentRepresentation.md)

<a name="createTemporaryRelatedContent"></a>
# **createTemporaryRelatedContent**
> RelatedContentRepresentation createTemporaryRelatedContent(relatedContent)

Create a local representation of content from a remote repository

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let contentApi = new ContentApi(this.alfrescoApi);


contentApi.createTemporaryRelatedContent(relatedContent).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **relatedContent** | [**RelatedContentRepresentation**](RelatedContentRepresentation.md)| relatedContent | 

### Return type

[**RelatedContentRepresentation**](RelatedContentRepresentation.md)

<a name="deleteContent"></a>
# **deleteContent**
> deleteContent(contentId)

Remove a local content representation

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let contentApi = new ContentApi(this.alfrescoApi);


contentApi.deleteContent(contentId).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contentId** | **number**| contentId | 

### Return type

null (empty response body)

<a name="getContent"></a>
# **getContent**
> RelatedContentRepresentation getContent(contentId)

Get a local content representation

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let contentApi = new ContentApi(this.alfrescoApi);


contentApi.getContent(contentId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contentId** | **number**| contentId | 

### Return type

[**RelatedContentRepresentation**](RelatedContentRepresentation.md)

<a name="getRawContent"></a>
# **getRawContent**
> getRawContent(contentIdrenditionType)

Stream content rendition

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let contentApi = new ContentApi(this.alfrescoApi);


contentApi.getRawContent(contentIdrenditionType).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contentId** | **number**| contentId | 
 **renditionType** | **string**| renditionType | 

### Return type

null (empty response body)

<a name="getRawContent"></a>
# **getRawContent**
> getRawContent(contentId)

Stream content from a local content representation

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let contentApi = new ContentApi(this.alfrescoApi);


contentApi.getRawContent(contentId).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **contentId** | **number**| contentId | 

### Return type

null (empty response body)

<a name="getRelatedContentForProcessInstance"></a>
# **getRelatedContentForProcessInstance**
> ResultListDataRepresentationRelatedContentRepresentation getRelatedContentForProcessInstance(processInstanceIdopts)

List content attached to a process instance

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let contentApi = new ContentApi(this.alfrescoApi);

let opts = { 
  'isRelatedContent': true //  | isRelatedContent
};

contentApi.getRelatedContentForProcessInstance(processInstanceIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processInstanceId** | **string**| processInstanceId | 
 **isRelatedContent** | **boolean**| isRelatedContent | [optional] 

### Return type

[**ResultListDataRepresentationRelatedContentRepresentation**](ResultListDataRepresentationRelatedContentRepresentation.md)

<a name="getRelatedContentForTask"></a>
# **getRelatedContentForTask**
> ResultListDataRepresentationRelatedContentRepresentation getRelatedContentForTask(taskIdopts)

List content attached to a task

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let contentApi = new ContentApi(this.alfrescoApi);

let opts = { 
  'isRelatedContent': true //  | isRelatedContent
};

contentApi.getRelatedContentForTask(taskIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **string**| taskId | 
 **isRelatedContent** | **boolean**| isRelatedContent | [optional] 

### Return type

[**ResultListDataRepresentationRelatedContentRepresentation**](ResultListDataRepresentationRelatedContentRepresentation.md)

<a name="getProcessesAndTasksOnContent"></a>
# **getProcessesAndTasksOnContent**
> ResultListDataRepresentationRelatedProcessTask getProcessesAndTasksOnContent(sourceId, source, size, page)

Lists processes and tasks on workflow started with provided document

### Example
```javascript
import ContentApi from 'ContentApi';
import { AlfrescoApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi();
alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

const contentApi = new ContentApi(alfrescoApi);

contentApi.getProcessesAndTasksOnContent('sourceId', 'source').then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **sourceId** | **string** | id of the document that workflow or task was started with | |
| **source** | **string** | source of the document that workflow or task was started with | |
| **sourceId** | **number** | size of the entries to get | optional param |
| **sourceId** | **number** | page number | optional param |

### Return type

[**ResultListDataRepresentationRelatedProcessTask**](ResultListDataRepresentationRelatedProcessTask.md)



