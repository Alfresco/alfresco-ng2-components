# RuntimeappdeploymentsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**deleteAppDeployment**](RuntimeAppDeploymentsApi.md#deleteAppDeployment) | **DELETE** /enterprise/runtime-app-deployments/{appDeploymentId} | Remove an app deployment
[**exportAppDefinition**](RuntimeAppDeploymentsApi.md#exportAppDefinition) | **GET** /enterprise/export-app-deployment/{deploymentId} | Export the app archive for a deployment
[**getAppDefinitions**](RuntimeAppDeploymentsApi.md#getAppDefinitions) | **GET** /enterprise/runtime-app-deployments | Query app deployments
[**getAppDeployment**](RuntimeAppDeploymentsApi.md#getAppDeployment) | **GET** /enterprise/runtime-app-deployments/{appDeploymentId} | Get an app deployment
[**getRuntimeAppDeploymentByDeployment**](RuntimeAppDeploymentsApi.md#getRuntimeAppDeploymentByDeployment) | **GET** /enterprise/runtime-app-deployment | Get an app by deployment ID or DMN deployment ID


<a name="deleteAppDeployment"></a>
# **deleteAppDeployment**
> deleteAppDeployment(appDeploymentId)

Remove an app deployment

### Example

```javascript
import RuntimeappdeploymentsApi from 'src/api/activiti-rest-api/docs/RuntimeAppDeploymentsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let runtimeappdeploymentsApi = new RuntimeappdeploymentsApi(this.alfrescoApi);


runtimeappdeploymentsApi.deleteAppDeployment(appDeploymentId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appDeploymentId** | **number**| appDeploymentId | 

### Return type

null (empty response body)

<a name="exportAppDefinition"></a>
# **exportAppDefinition**
> exportAppDefinition(deploymentId)

Export the app archive for a deployment

### Example

```javascript
import RuntimeappdeploymentsApi from 'src/api/activiti-rest-api/docs/RuntimeAppDeploymentsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let runtimeappdeploymentsApi = new RuntimeappdeploymentsApi(this.alfrescoApi);


runtimeappdeploymentsApi.exportAppDefinition(deploymentId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deploymentId** | **string**| deploymentId | 

### Return type

null (empty response body)

<a name="getAppDefinitions"></a>
# **getAppDefinitions**
> ResultListDataRepresentationAppDeploymentRepresentation getAppDefinitions(opts)

Query app deployments

### Example

```javascript
import RuntimeappdeploymentsApi from 'src/api/activiti-rest-api/docs/RuntimeAppDeploymentsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let runtimeappdeploymentsApi = new RuntimeappdeploymentsApi(this.alfrescoApi);

let opts = {
    'nameLike': nameLike_example //  | nameLike
    'tenantId': 789 //  | tenantId
    'latest': true //  | latest
    'start': 56 //  | start
    'sort': sort_example //  | sort
    'order': order_example //  | order
    'size': 56 //  | size
};

runtimeappdeploymentsApi.getAppDefinitions(opts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nameLike** | **string**| nameLike | [optional] 
 **tenantId** | **number**| tenantId | [optional] 
 **latest** | **boolean**| latest | [optional] 
 **start** | **number**| start | [optional] 
 **sort** | **string**| sort | [optional] 
 **order** | **string**| order | [optional] 
 **size** | **number**| size | [optional] 

### Return type

[**ResultListDataRepresentationAppDeploymentRepresentation**](ResultListDataRepresentationAppDeploymentRepresentation.md)

<a name="getAppDeployment"></a>
# **getAppDeployment**
> AppDeploymentRepresentation getAppDeployment(appDeploymentId)

Get an app deployment

### Example

```javascript
import RuntimeappdeploymentsApi from 'src/api/activiti-rest-api/docs/RuntimeAppDeploymentsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let runtimeappdeploymentsApi = new RuntimeappdeploymentsApi(this.alfrescoApi);


runtimeappdeploymentsApi.getAppDeployment(appDeploymentId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appDeploymentId** | **number**| appDeploymentId | 

### Return type

[**AppDeploymentRepresentation**](AppDeploymentRepresentation.md)

<a name="getRuntimeAppDeploymentByDeployment"></a>
# **getRuntimeAppDeploymentByDeployment**
> AppDeploymentRepresentation getRuntimeAppDeploymentByDeployment(opts)

Get an app by deployment ID or DMN deployment ID

Either a deploymentId or a dmnDeploymentId must be provided

### Example

```javascript
import RuntimeappdeploymentsApi from 'src/api/activiti-rest-api/docs/RuntimeAppDeploymentsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let runtimeappdeploymentsApi = new RuntimeappdeploymentsApi(this.alfrescoApi);

let opts = {
    'deploymentId': deploymentId_example //  | deploymentId
    'dmnDeploymentId': 789 //  | dmnDeploymentId
};

runtimeappdeploymentsApi.getRuntimeAppDeploymentByDeployment(opts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **deploymentId** | **string**| deploymentId | [optional] 
 **dmnDeploymentId** | **number**| dmnDeploymentId | [optional] 

### Return type

[**AppDeploymentRepresentation**](AppDeploymentRepresentation.md)

