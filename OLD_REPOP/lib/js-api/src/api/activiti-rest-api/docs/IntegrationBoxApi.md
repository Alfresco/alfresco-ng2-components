# IntegrationboxApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**confirmAuthorisation**](IntegrationBoxApi.md#confirmAuthorisation) | **GET** /enterprise/integration/box/confirm-auth-request | Box Authorization
[**createRepositoryAccount**](IntegrationBoxApi.md#createRepositoryAccount) | **POST** /enterprise/integration/box/{userId}/account | Add Box account
[**deleteRepositoryAccount**](IntegrationBoxApi.md#deleteRepositoryAccount) | **DELETE** /enterprise/integration/box/{userId}/account | Delete account information
[**getBoxPluginStatus**](IntegrationBoxApi.md#getBoxPluginStatus) | **GET** /enterprise/integration/box/status | Get status information
[**getFiles**](IntegrationBoxApi.md#getFiles) | **GET** /enterprise/integration/box/files | List file and folders
[**getRepositoryAccount**](IntegrationBoxApi.md#getRepositoryAccount) | **GET** /enterprise/integration/box/{userId}/account | Get account information
[**updateRepositoryAccount**](IntegrationBoxApi.md#updateRepositoryAccount) | **PUT** /enterprise/integration/box/{userId}/account | Update account information


<a name="confirmAuthorisation"></a>
# **confirmAuthorisation**
> confirmAuthorisation()

Box Authorization

Returns Box OAuth HTML Page

### Example

```javascript
import IntegrationboxApi from 'src/api/activiti-rest-api/docs/IntegrationBoxApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationboxApi = new IntegrationboxApi(this.alfrescoApi);

integrationboxApi.confirmAuthorisation().then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

<a name="createRepositoryAccount"></a>
# **createRepositoryAccount**
> createRepositoryAccount(userIdcredentials)

Add Box account

### Example

```javascript
import IntegrationboxApi from 'src/api/activiti-rest-api/docs/IntegrationBoxApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationboxApi = new IntegrationboxApi(this.alfrescoApi);


integrationboxApi.createRepositoryAccount(userIdcredentials).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **number**| userId | 
 **credentials** | [**UserAccountCredentialsRepresentation**](UserAccountCredentialsRepresentation.md)| credentials | 

### Return type

null (empty response body)

<a name="deleteRepositoryAccount"></a>
# **deleteRepositoryAccount**
> deleteRepositoryAccount(userId)

Delete account information

### Example

```javascript
import IntegrationboxApi from 'src/api/activiti-rest-api/docs/IntegrationBoxApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationboxApi = new IntegrationboxApi(this.alfrescoApi);


integrationboxApi.deleteRepositoryAccount(userId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **number**| userId | 

### Return type

null (empty response body)

<a name="getBoxPluginStatus"></a>
# **getBoxPluginStatus**
> boolean getBoxPluginStatus()

Get status information

### Example

```javascript
import IntegrationboxApi from 'src/api/activiti-rest-api/docs/IntegrationBoxApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationboxApi = new IntegrationboxApi(this.alfrescoApi);

integrationboxApi.getBoxPluginStatus().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

**boolean**

<a name="getFiles"></a>
# **getFiles**
> ResultListDataRepresentationBoxContent getFiles(opts)

List file and folders

### Example

```javascript
import IntegrationboxApi from 'src/api/activiti-rest-api/docs/IntegrationBoxApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationboxApi = new IntegrationboxApi(this.alfrescoApi);

let opts = {
    'filter': filter_example //  | filter
    'parent': parent_example //  | parent
};

integrationboxApi.getFiles(opts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filter** | **string**| filter | [optional] 
 **parent** | **string**| parent | [optional] 

### Return type

[**ResultListDataRepresentationBoxContent**](ResultListDataRepresentationBoxContent.md)

<a name="getRepositoryAccount"></a>
# **getRepositoryAccount**
> getRepositoryAccount(userId)

Get account information

### Example

```javascript
import IntegrationboxApi from 'src/api/activiti-rest-api/docs/IntegrationBoxApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationboxApi = new IntegrationboxApi(this.alfrescoApi);


integrationboxApi.getRepositoryAccount(userId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **number**| userId | 

### Return type

null (empty response body)

<a name="updateRepositoryAccount"></a>
# **updateRepositoryAccount**
> updateRepositoryAccount(userIdcredentials)

Update account information

### Example

```javascript
import IntegrationboxApi from 'src/api/activiti-rest-api/docs/IntegrationBoxApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationboxApi = new IntegrationboxApi(this.alfrescoApi);


integrationboxApi.updateRepositoryAccount(userIdcredentials).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **number**| userId | 
 **credentials** | [**UserAccountCredentialsRepresentation**](UserAccountCredentialsRepresentation.md)| credentials | 

### Return type

null (empty response body)

