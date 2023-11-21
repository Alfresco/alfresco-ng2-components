# ProcessscopesApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getRuntimeProcessScopes**](ProcessScopesApi.md#getRuntimeProcessScopes) | **POST** /enterprise/process-scopes | List runtime process scopes


<a name="getRuntimeProcessScopes"></a>
# **getRuntimeProcessScopes**
> ProcessScopeRepresentation getRuntimeProcessScopes(processScopesRequest)

List runtime process scopes

### Example

```javascript
import ProcessscopesApi from 'src/api/activiti-rest-api/docs/ProcessScopesApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let processscopesApi = new ProcessscopesApi(this.alfrescoApi);


processscopesApi.getRuntimeProcessScopes(processScopesRequest).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processScopesRequest** | [**ProcessScopesRequestRepresentation**](ProcessScopesRequestRepresentation.md)| processScopesRequest | 

### Return type

[**ProcessScopeRepresentation**](ProcessScopeRepresentation.md)

