# RuntimeappdefinitionsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deployAppDefinitions**](RuntimeAppDefinitionsApi.md#deployAppDefinitions) | **POST** /enterprise/runtime-app-definitions | Deploy a published app
[**getAppDefinition**](RuntimeAppDefinitionsApi.md#getAppDefinition) | **GET** /enterprise/runtime-app-definitions/{appDefinitionId} | Get a runtime app
[**getAppDefinitions**](RuntimeAppDefinitionsApi.md#getAppDefinitions) | **GET** /enterprise/runtime-app-definitions | List runtime apps


<a name="deployAppDefinitions"></a>
# **deployAppDefinitions**
> deployAppDefinitions(saveObject)

Deploy a published app

Deploying an app allows the user to see it on his/her landing page. Apps must be published before they can be deployed.

### Example

```javascript
import RuntimeappdefinitionsApi from 'src/api/activiti-rest-api/docs/RuntimeAppDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let runtimeappdefinitionsApi = new RuntimeappdefinitionsApi(this.alfrescoApi);


runtimeappdefinitionsApi.deployAppDefinitions(saveObject).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **saveObject** | [**RuntimeAppDefinitionSaveRepresentation**](RuntimeAppDefinitionSaveRepresentation.md)| saveObject | 

### Return type

null (empty response body)

<a name="getAppDefinition"></a>
# **getAppDefinition**
> AppDefinitionRepresentation getAppDefinition(appDefinitionId)

Get a runtime app

### Example

```javascript
import RuntimeappdefinitionsApi from 'src/api/activiti-rest-api/docs/RuntimeAppDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let runtimeappdefinitionsApi = new RuntimeappdefinitionsApi(this.alfrescoApi);


runtimeappdefinitionsApi.getAppDefinition(appDefinitionId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appDefinitionId** | **number**| appDefinitionId | 

### Return type

[**AppDefinitionRepresentation**](AppDefinitionRepresentation.md)

<a name="getAppDefinitions"></a>
# **getAppDefinitions**
> ResultListDataRepresentationAppDefinitionRepresentation getAppDefinitions()

List runtime apps

When a user logs in into Alfresco Process Services Suite, a landing page is displayed containing all the apps that the user is allowed to see and use. These are referred to as runtime apps.

### Example

```javascript
import RuntimeappdefinitionsApi from 'src/api/activiti-rest-api/docs/RuntimeAppDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let runtimeappdefinitionsApi = new RuntimeappdefinitionsApi(this.alfrescoApi);

runtimeappdefinitionsApi.getAppDefinitions().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ResultListDataRepresentationAppDefinitionRepresentation**](ResultListDataRepresentationAppDefinitionRepresentation.md)

