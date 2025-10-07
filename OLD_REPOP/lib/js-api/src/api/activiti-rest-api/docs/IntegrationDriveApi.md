# IntegrationdriveApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**confirmAuthorisation**](IntegrationDriveApi.md#confirmAuthorisation) | **GET** /enterprise/integration/google-drive/confirm-auth-request | Drive Authorization
[**getFiles**](IntegrationDriveApi.md#getFiles) | **GET** /enterprise/integration/google-drive/files | List files and folders


<a name="confirmAuthorisation"></a>
# **confirmAuthorisation**
> confirmAuthorisation()

Drive Authorization

Returns Drive OAuth HTML Page

### Example

```javascript
import IntegrationdriveApi from 'src/api/activiti-rest-api/docs/IntegrationDriveApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationdriveApi = new IntegrationdriveApi(this.alfrescoApi);

integrationdriveApi.confirmAuthorisation().then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

<a name="getFiles"></a>
# **getFiles**
> ResultListDataRepresentationGoogleDriveContent getFiles(opts)

List files and folders

### Example

```javascript
import IntegrationdriveApi from 'src/api/activiti-rest-api/docs/IntegrationDriveApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationdriveApi = new IntegrationdriveApi(this.alfrescoApi);

let opts = {
    'filter': filter_example //  | filter
    'parent': parent_example //  | parent
    'currentFolderOnly': true //  | currentFolderOnly
};

integrationdriveApi.getFiles(opts).then((data) => {
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
 **currentFolderOnly** | **boolean**| currentFolderOnly | [optional] 

### Return type

[**ResultListDataRepresentationGoogleDriveContent**](ResultListDataRepresentationGoogleDriveContent.md)

