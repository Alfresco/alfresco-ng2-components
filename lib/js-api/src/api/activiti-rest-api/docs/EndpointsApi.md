# EndpointsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getEndpointConfiguration**](EndpointsApi.md#getEndpointConfiguration) | **GET** /enterprise/editor/endpoints/{endpointConfigurationId} | Get an endpoint configuration
[**getEndpointConfigurations**](EndpointsApi.md#getEndpointConfigurations) | **GET** /enterprise/editor/endpoints | List endpoint configurations


<a name="getEndpointConfiguration"></a>
# **getEndpointConfiguration**
> EndpointConfigurationRepresentation getEndpointConfiguration(endpointConfigurationId)

Get an endpoint configuration

### Example
```javascript
import EndpointsApi from 'EndpointsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let endpointsApi = new EndpointsApi(this.alfrescoApi);


endpointsApi.getEndpointConfiguration(endpointConfigurationId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **endpointConfigurationId** | **number**| endpointConfigurationId | 

### Return type

[**EndpointConfigurationRepresentation**](EndpointConfigurationRepresentation.md)

<a name="getEndpointConfigurations"></a>
# **getEndpointConfigurations**
> EndpointConfigurationRepresentation getEndpointConfigurations()

List endpoint configurations

### Example
```javascript
import EndpointsApi from 'EndpointsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let endpointsApi = new EndpointsApi(this.alfrescoApi);

endpointsApi.getEndpointConfigurations().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**EndpointConfigurationRepresentation**](EndpointConfigurationRepresentation.md)

