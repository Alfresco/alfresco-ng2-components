# AppdefinitionsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteAppDefinition**](AppDefinitionsApi.md#deleteAppDefinition) | **DELETE** /enterprise/app-definitions/{appDefinitionId} | deleteAppDefinition
[**exportAppDefinition**](AppDefinitionsApi.md#exportAppDefinition) | **GET** /enterprise/app-definitions/{modelId}/export | Export an app definition
[**getAppDefinition**](AppDefinitionsApi.md#getAppDefinition) | **GET** /enterprise/app-definitions/{modelId} | Get an app definition
[**importAndPublishApp**](AppDefinitionsApi.md#importAndPublishApp) | **POST** /enterprise/app-definitions/publish-app | importAndPublishApp
[**importAndPublishApp**](AppDefinitionsApi.md#importAndPublishApp) | **POST** /enterprise/app-definitions/{modelId}/publish-app | importAndPublishApp
[**importAppDefinition**](AppDefinitionsApi.md#importAppDefinition) | **POST** /enterprise/app-definitions/import | Import a new app definition
[**updateAppDefinition**](AppDefinitionsApi.md#importAppDefinition) | **POST** /enterprise/app-definitions/{modelId}/import | Update the content of an existing app
[**publishAppDefinition**](AppDefinitionsApi.md#publishAppDefinition) | **POST** /enterprise/app-definitions/{modelId}/publish | Publish an app definition
[**updateAppDefinition**](AppDefinitionsApi.md#updateAppDefinition) | **PUT** /enterprise/app-definitions/{modelId} | Update an app definition


<a name="deleteAppDefinition"></a>
# **deleteAppDefinition**
> deleteAppDefinition(appDefinitionId)

deleteAppDefinition

### Example

```javascript
import AppdefinitionsApi from 'src/api/activiti-rest-api/docs/AppDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let appdefinitionsApi = new AppdefinitionsApi(this.alfrescoApi);


appdefinitionsApi.deleteAppDefinition(appDefinitionId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appDefinitionId** | **number**| appDefinitionId | 

### Return type

null (empty response body)

<a name="exportAppDefinition"></a>
# **exportAppDefinition**
> exportAppDefinition(modelId)

Export an app definition

This will return a zip file containing the app definition model and all related models (process definitions and forms).

### Example

```javascript
import AppdefinitionsApi from 'src/api/activiti-rest-api/docs/AppDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let appdefinitionsApi = new AppdefinitionsApi(this.alfrescoApi);


appdefinitionsApi.exportAppDefinition(modelId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId from a runtime app or the id of an app definition model | 

### Return type

null (empty response body)

<a name="getAppDefinition"></a>
# **getAppDefinition**
> AppDefinitionRepresentation getAppDefinition(modelId)

Get an app definition

### Example

```javascript
import AppdefinitionsApi from 'src/api/activiti-rest-api/docs/AppDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let appdefinitionsApi = new AppdefinitionsApi(this.alfrescoApi);


appdefinitionsApi.getAppDefinition(modelId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| Application definition ID | 

### Return type

[**AppDefinitionRepresentation**](AppDefinitionRepresentation.md)

<a name="importAndPublishApp"></a>
# **importAndPublishApp**
> AppDefinitionUpdateResultRepresentation importAndPublishApp(file)

importAndPublishApp

### Example

```javascript
import AppdefinitionsApi from 'src/api/activiti-rest-api/docs/AppDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let appdefinitionsApi = new AppdefinitionsApi(this.alfrescoApi);


appdefinitionsApi.importAndPublishApp(file).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | **Blob**| file | 

### Return type

[**AppDefinitionUpdateResultRepresentation**](AppDefinitionUpdateResultRepresentation.md)

<a name="importAndPublishApp"></a>
# **importAndPublishApp**
> AppDefinitionUpdateResultRepresentation importAndPublishApp(modelIdfile)

importAndPublishApp

### Example

```javascript
import AppdefinitionsApi from 'src/api/activiti-rest-api/docs/AppDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let appdefinitionsApi = new AppdefinitionsApi(this.alfrescoApi);


appdefinitionsApi.importAndPublishApp(modelIdfile).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 
 **file** | **Blob**| file | 

### Return type

[**AppDefinitionUpdateResultRepresentation**](AppDefinitionUpdateResultRepresentation.md)

<a name="importAppDefinition"></a>
# **importAppDefinition**
> AppDefinitionRepresentation importAppDefinition(fileopts)

Import a new app definition

Allows a zip file to be uploaded containing an app definition and any number of included models.<p>This is useful to bootstrap an environment (for users or continuous integration).<p>Before using any processes included in the import the app must be published and deployed.

### Example

```javascript
import AppdefinitionsApi from 'src/api/activiti-rest-api/docs/AppDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let appdefinitionsApi = new AppdefinitionsApi(this.alfrescoApi);

let opts = {
    'renewIdmEntries': renewIdmEntries_example //  | Whether to renew user and group identifiers
};

appdefinitionsApi.importAppDefinition(fileopts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | **Blob**| file | 
 **renewIdmEntries** | **string**| Whether to renew user and group identifiers | [optional] [default to false]

### Return type

[**AppDefinitionRepresentation**](AppDefinitionRepresentation.md)

<a name="updateAppDefinition"></a>
# **importAppDefinition**
> updateAppDefinition importAppDefinition(modelIdfile)

Update the content of an existing app

Imports an app inside an existing app definition and creates a new version<p>Before using any new or updated processes included in the import the app must be (re-)published and deployed.

### Example

```javascript
import AppdefinitionsApi from 'src/api/activiti-rest-api/docs/AppDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let appdefinitionsApi = new AppdefinitionsApi(this.alfrescoApi);


appdefinitionsApi.updateAppDefinition(modelIdfile).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 
 **file** | **Blob**| file | 

### Return type

[**AppDefinitionRepresentation**](AppDefinitionRepresentation.md)

<a name="publishAppDefinition"></a>
# **publishAppDefinition**
> AppDefinitionUpdateResultRepresentation publishAppDefinition(modelIdpublishModel)

Publish an app definition

Publishing an app definition makes it available for use. The application must not have any validation errors or an error will be returned.<p>Before an app definition can be used by other users, it must also be deployed for their use

### Example

```javascript
import AppdefinitionsApi from 'src/api/activiti-rest-api/docs/AppDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let appdefinitionsApi = new AppdefinitionsApi(this.alfrescoApi);


appdefinitionsApi.publishAppDefinition(modelIdpublishModel).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| modelId | 
 **publishModel** | [**AppDefinitionPublishRepresentation**](AppDefinitionPublishRepresentation.md)| publishModel | 

### Return type

[**AppDefinitionUpdateResultRepresentation**](AppDefinitionUpdateResultRepresentation.md)

<a name="updateAppDefinition"></a>
# **updateAppDefinition**
> AppDefinitionUpdateResultRepresentation updateAppDefinition(modelIdupdatedModel)

Update an app definition

### Example

```javascript
import AppdefinitionsApi from 'src/api/activiti-rest-api/docs/AppDefinitionsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let appdefinitionsApi = new AppdefinitionsApi(this.alfrescoApi);


appdefinitionsApi.updateAppDefinition(modelIdupdatedModel).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **modelId** | **number**| Application definition ID | 
 **updatedModel** | [**AppDefinitionSaveRepresentation**](AppDefinitionSaveRepresentation.md)| updatedModel | 

### Return type

[**AppDefinitionUpdateResultRepresentation**](AppDefinitionUpdateResultRepresentation.md)

