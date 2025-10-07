# IntegrationalfrescocloudApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**confirmAuthorisation**](IntegrationAlfrescoCloudApi.md#confirmAuthorisation) | **GET** /enterprise/integration/alfresco-cloud/confirm-auth-request | Alfresco Cloud Authorization
[**getAllNetworks**](IntegrationAlfrescoCloudApi.md#getAllNetworks) | **GET** /enterprise/integration/alfresco-cloud/networks | List Alfresco networks
[**getAllSites**](IntegrationAlfrescoCloudApi.md#getAllSites) | **GET** /enterprise/integration/alfresco-cloud/networks/{networkId}/sites | List Alfresco sites
[**getContentInFolderPath**](IntegrationAlfrescoCloudApi.md#getContentInFolderPath) | **GET** /enterprise/integration/alfresco-cloud/networks/{networkId}/sites/{siteId}/folderpath/{folderPath}/content | List files and folders inside a specific folder identified by path
[**getContentInFolder**](IntegrationAlfrescoCloudApi.md#getContentInFolder) | **GET** /enterprise/integration/alfresco-cloud/networks/{networkId}/folders/{folderId}/content | List files and folders inside a specific folder
[**getContentInSite**](IntegrationAlfrescoCloudApi.md#getContentInSite) | **GET** /enterprise/integration/alfresco-cloud/networks/{networkId}/sites/{siteId}/content | List files and folders inside a specific site


<a name="confirmAuthorisation"></a>
# **confirmAuthorisation**
> confirmAuthorisation(code)

Alfresco Cloud Authorization

Returns Alfresco OAuth HTML Page

### Example

```javascript
import IntegrationalfrescocloudApi from 'src/api/activiti-rest-api/docs/IntegrationAlfrescoCloudApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationalfrescocloudApi = new IntegrationalfrescocloudApi(this.alfrescoApi);


integrationalfrescocloudApi.confirmAuthorisation(code).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | **string**| code | 

### Return type

null (empty response body)

<a name="getAllNetworks"></a>
# **getAllNetworks**
> ResultListDataRepresentationAlfrescoNetworkRepresenation getAllNetworks()

List Alfresco networks

### Example

```javascript
import IntegrationalfrescocloudApi from 'src/api/activiti-rest-api/docs/IntegrationAlfrescoCloudApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationalfrescocloudApi = new IntegrationalfrescocloudApi(this.alfrescoApi);

integrationalfrescocloudApi.getAllNetworks().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ResultListDataRepresentationAlfrescoNetworkRepresenation**](ResultListDataRepresentationAlfrescoNetworkRepresenation.md)

<a name="getAllSites"></a>
# **getAllSites**
> ResultListDataRepresentationAlfrescoSiteRepresenation getAllSites(networkId)

List Alfresco sites

Returns ALL Sites

### Example

```javascript
import IntegrationalfrescocloudApi from 'src/api/activiti-rest-api/docs/IntegrationAlfrescoCloudApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationalfrescocloudApi = new IntegrationalfrescocloudApi(this.alfrescoApi);


integrationalfrescocloudApi.getAllSites(networkId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **networkId** | **string**| networkId | 

### Return type

[**ResultListDataRepresentationAlfrescoSiteRepresenation**](ResultListDataRepresentationAlfrescoSiteRepresenation.md)

<a name="getContentInFolderPath"></a>
# **getContentInFolderPath**
> ResultListDataRepresentationAlfrescoContentRepresentation getContentInFolderPath(networkIdopts)

List files and folders inside a specific folder identified by path

### Example

```javascript
import IntegrationalfrescocloudApi from 'src/api/activiti-rest-api/docs/IntegrationAlfrescoCloudApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationalfrescocloudApi = new IntegrationalfrescocloudApi(this.alfrescoApi);

let opts = {
    'siteId': siteId_example //  | siteId
    'path': path_example //  | path
};

integrationalfrescocloudApi.getContentInFolderPath(networkIdopts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **networkId** | **string**| networkId | 
 **siteId** | **string**| siteId | [optional] 
 **path** | **string**| path | [optional] 

### Return type

[**ResultListDataRepresentationAlfrescoContentRepresentation**](ResultListDataRepresentationAlfrescoContentRepresentation.md)

<a name="getContentInFolder"></a>
# **getContentInFolder**
> ResultListDataRepresentationAlfrescoContentRepresentation getContentInFolder(networkIdfolderId)

List files and folders inside a specific folder

### Example

```javascript
import IntegrationalfrescocloudApi from 'src/api/activiti-rest-api/docs/IntegrationAlfrescoCloudApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationalfrescocloudApi = new IntegrationalfrescocloudApi(this.alfrescoApi);


integrationalfrescocloudApi.getContentInFolder(networkIdfolderId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **networkId** | **string**| networkId | 
 **folderId** | **string**| folderId | 

### Return type

[**ResultListDataRepresentationAlfrescoContentRepresentation**](ResultListDataRepresentationAlfrescoContentRepresentation.md)

<a name="getContentInSite"></a>
# **getContentInSite**
> ResultListDataRepresentationAlfrescoContentRepresentation getContentInSite(networkIdsiteId)

List files and folders inside a specific site

### Example

```javascript
import IntegrationalfrescocloudApi from 'src/api/activiti-rest-api/docs/IntegrationAlfrescoCloudApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let integrationalfrescocloudApi = new IntegrationalfrescocloudApi(this.alfrescoApi);


integrationalfrescocloudApi.getContentInSite(networkIdsiteId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **networkId** | **string**| networkId | 
 **siteId** | **string**| siteId | 

### Return type

[**ResultListDataRepresentationAlfrescoContentRepresentation**](ResultListDataRepresentationAlfrescoContentRepresentation.md)

