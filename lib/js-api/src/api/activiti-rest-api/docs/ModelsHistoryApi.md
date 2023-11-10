# ModelshistoryApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getModelHistoryCollection**](ModelsHistoryApi.md#getModelHistoryCollection) | **GET** /enterprise/models/{modelId}/history | List a model's historic versions
[**getProcessModelHistory**](ModelsHistoryApi.md#getProcessModelHistory) | **GET** /enterprise/models/{modelId}/history/{modelHistoryId} | Get a historic version of a model


<a name="getModelHistoryCollection"></a>
# **getModelHistoryCollection**
> ResultListDataRepresentationModelRepresentation getModelHistoryCollection(modelIdopts)

List a model's historic versions

### Example

```javascript
import ModelshistoryApi from 'src/api/activiti-rest-api/docs/ModelsHistoryApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelshistoryApi = new ModelshistoryApi(this.alfrescoApi);

let opts = {
    'includeLatestVersion': true //  | includeLatestVersion
};

modelshistoryApi.getModelHistoryCollection(modelIdopts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 
 **includeLatestVersion** | **boolean**| includeLatestVersion | [optional] 

### Return type

[**ResultListDataRepresentationModelRepresentation**](ResultListDataRepresentationModelRepresentation.md)

<a name="getProcessModelHistory"></a>
# **getProcessModelHistory**
> ModelRepresentation getProcessModelHistory(modelIdmodelHistoryId)

Get a historic version of a model

### Example

```javascript
import ModelshistoryApi from 'src/api/activiti-rest-api/docs/ModelsHistoryApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelshistoryApi = new ModelshistoryApi(this.alfrescoApi);


modelshistoryApi.getProcessModelHistory(modelIdmodelHistoryId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 
 **modelHistoryId** | **number**| modelHistoryId | 

### Return type

[**ModelRepresentation**](ModelRepresentation.md)

