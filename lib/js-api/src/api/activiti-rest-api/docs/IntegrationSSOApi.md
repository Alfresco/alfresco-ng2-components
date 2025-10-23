# IntegrationSSOApi

All URIs are relative to */activiti-app/api*

| Method                                                                  | HTTP request                                                   | Description           |
|------------------------------------------------------------------------ | -------------------------------------------------------------- | ----------------------|
| [**getAccountInformation**](#getAccountInformation) | **GET** /api/enterprise/integration/sso/{repositoryId}/account | Get account information |


## getAccountInformation 

Returns account information.

### Example

```javascript
import { AlfrescoApi, IntegrationSSOApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationSSOApi = new IntegrationSSOApi(this.alfrescoApi);

integrationSSOApi.getAccountInformation('1').then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters
| Name             | Type       | Description                                       | Notes |
|----------------- | ---------- | ------------------------------------------------- | ----- |
| **repositoryId** | **string** | Alfresco Repository instance ID configured in APS |       |

### Return type

`Promise<SSOUserAccountCredentialsRepresentation>`
