# ModelsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createModel**](ModelsApi.md#createModel) | **POST** /enterprise/models | Create a new model
[**deleteModel**](ModelsApi.md#deleteModel) | **DELETE** /enterprise/models/{modelId} | Delete a model
[**duplicateModel**](ModelsApi.md#duplicateModel) | **POST** /enterprise/models/{modelId}/clone | Duplicate an existing model
[**getModelJSON**](ModelsApi.md#getModelJSON) | **GET** /enterprise/models/{modelId}/editor/json | Get model content
[**getModelThumbnail**](ModelsApi.md#getModelThumbnail) | **GET** /enterprise/models/{modelId}/thumbnail | Get a model's thumbnail image
[**getModel**](ModelsApi.md#getModel) | **GET** /enterprise/models/{modelId} | Get a model
[**getModelsToIncludeInAppDefinition**](ModelsApi.md#getModelsToIncludeInAppDefinition) | **GET** /enterprise/models-for-app-definition | List process definition models shared with the current user
[**getModels**](ModelsApi.md#getModels) | **GET** /enterprise/models | List models (process, form, decision rule or app)
[**importNewVersion**](ModelsApi.md#importNewVersion) | **POST** /enterprise/models/{modelId}/newversion | Create a new version of a model
[**importProcessModel**](ModelsApi.md#importProcessModel) | **POST** /enterprise/process-models/import | Import a BPMN 2.0 XML file
[**saveModel**](ModelsApi.md#saveModel) | **POST** /enterprise/models/{modelId}/editor/json | Update model content
[**updateModel**](ModelsApi.md#updateModel) | **PUT** /enterprise/models/{modelId} | Update a model
[**validateModel**](ModelsApi.md#validateModel) | **POST** /enterprise/models/{modelId}/editor/validate | Validate model content


<a name="createModel"></a>
# **createModel**
> ModelRepresentation createModel(modelRepresentation)

Create a new model

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);


modelsApi.createModel(modelRepresentation).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelRepresentation** | [**ModelRepresentation**](ModelRepresentation.md)| modelRepresentation | 

### Return type

[**ModelRepresentation**](ModelRepresentation.md)

<a name="deleteModel"></a>
# **deleteModel**
> deleteModel(modelIdopts)

Delete a model

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);

let opts = { 
  'cascade': true //  | cascade
  'deleteRuntimeApp': true //  | deleteRuntimeApp
};

modelsApi.deleteModel(modelIdopts).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 
 **cascade** | **boolean**| cascade | [optional] 
 **deleteRuntimeApp** | **boolean**| deleteRuntimeApp | [optional] 

### Return type

null (empty response body)

<a name="duplicateModel"></a>
# **duplicateModel**
> ModelRepresentation duplicateModel(modelIdmodelRepresentation)

Duplicate an existing model

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);


modelsApi.duplicateModel(modelIdmodelRepresentation).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 
 **modelRepresentation** | [**ModelRepresentation**](ModelRepresentation.md)| modelRepresentation | 

### Return type

[**ModelRepresentation**](ModelRepresentation.md)

<a name="getModelJSON"></a>
# **getModelJSON**
> ObjectNode getModelJSON(modelId)

Get model content

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);


modelsApi.getModelJSON(modelId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 

### Return type

[**ObjectNode**](ObjectNode.md)

<a name="getModelThumbnail"></a>
# **getModelThumbnail**
> string getModelThumbnail(modelId)

Get a model's thumbnail image

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);


modelsApi.getModelThumbnail(modelId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 

### Return type

**string**

<a name="getModel"></a>
# **getModel**
> ModelRepresentation getModel(modelIdopts)

Get a model

Models act as containers for process, form, decision table and app definitions

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);

let opts = { 
  'includePermissions': true //  | includePermissions
};

modelsApi.getModel(modelIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 
 **includePermissions** | **boolean**| includePermissions | [optional] 

### Return type

[**ModelRepresentation**](ModelRepresentation.md)

<a name="getModelsToIncludeInAppDefinition"></a>
# **getModelsToIncludeInAppDefinition**
> ResultListDataRepresentationModelRepresentation getModelsToIncludeInAppDefinition()

List process definition models shared with the current user

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);

modelsApi.getModelsToIncludeInAppDefinition().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ResultListDataRepresentationModelRepresentation**](ResultListDataRepresentationModelRepresentation.md)

<a name="getModels"></a>
# **getModels**
> ResultListDataRepresentationModelRepresentation getModels(opts)

List models (process, form, decision rule or app)

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);

let opts = { 
  'filter': filter_example //  | filter
  'sort': sort_example //  | sort
  'modelType': 56 //  | modelType
  'referenceId': 789 //  | referenceId
};

modelsApi.getModels(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filter** | **string**| filter | [optional] 
 **sort** | **string**| sort | [optional] 
 **modelType** | **number**| modelType | [optional] 
 **referenceId** | **number**| referenceId | [optional] 

### Return type

[**ResultListDataRepresentationModelRepresentation**](ResultListDataRepresentationModelRepresentation.md)

<a name="importNewVersion"></a>
# **importNewVersion**
> ModelRepresentation importNewVersion(modelIdfile)

Create a new version of a model

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);


modelsApi.importNewVersion(modelIdfile).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 
 **file** | **Blob**| file | 

### Return type

[**ModelRepresentation**](ModelRepresentation.md)

<a name="importProcessModel"></a>
# **importProcessModel**
> ModelRepresentation importProcessModel(file)

Import a BPMN 2.0 XML file

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);


modelsApi.importProcessModel(file).then((data) => {
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

[**ModelRepresentation**](ModelRepresentation.md)

<a name="saveModel"></a>
# **saveModel**
> ModelRepresentation saveModel(modelIdvalues)

Update model content

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);


modelsApi.saveModel(modelIdvalues).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 
 **values** | **any**| values | 

### Return type

[**ModelRepresentation**](ModelRepresentation.md)

<a name="updateModel"></a>
# **updateModel**
> ModelRepresentation updateModel(modelIdupdatedModel)

Update a model

This method allows you to update the metadata of a model. In order to update the content of the model you will need to call the specific endpoint for that model type.

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);


modelsApi.updateModel(modelIdupdatedModel).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 
 **updatedModel** | [**ModelRepresentation**](ModelRepresentation.md)| updatedModel | 

### Return type

[**ModelRepresentation**](ModelRepresentation.md)

<a name="validateModel"></a>
# **validateModel**
> ValidationErrorRepresentation validateModel(modelIdopts)

Validate model content

### Example
```javascript
import ModelsApi from 'ModelsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let modelsApi = new ModelsApi(this.alfrescoApi);

let opts = { 
  'values':  //  | values
};

modelsApi.validateModel(modelIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 
 **values** | **any**| values | [optional] 

### Return type

[**ValidationErrorRepresentation**](ValidationErrorRepresentation.md)

