# AdmintenantsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createTenant**](AdminTenantsApi.md#createTenant) | **POST** /enterprise/admin/tenants | Create a tenant
[**deleteTenant**](AdminTenantsApi.md#deleteTenant) | **DELETE** /enterprise/admin/tenants/{tenantId} | Delete a tenant
[**getTenantEvents**](AdminTenantsApi.md#getTenantEvents) | **GET** /enterprise/admin/tenants/{tenantId}/events | Get tenant events
[**getTenantLogo**](AdminTenantsApi.md#getTenantLogo) | **GET** /enterprise/admin/tenants/{tenantId}/logo | Get a tenant's logo
[**getTenant**](AdminTenantsApi.md#getTenant) | **GET** /enterprise/admin/tenants/{tenantId} | Get a tenant
[**getTenants**](AdminTenantsApi.md#getTenants) | **GET** /enterprise/admin/tenants | List tenants
[**update**](AdminTenantsApi.md#update) | **PUT** /enterprise/admin/tenants/{tenantId} | Update a tenant
[**uploadTenantLogo**](AdminTenantsApi.md#uploadTenantLogo) | **POST** /enterprise/admin/tenants/{tenantId}/logo | Update a tenant's logo


<a name="createTenant"></a>
# **createTenant**
> LightTenantRepresentation createTenant(createTenantRepresentation)

Create a tenant

Only a tenant manager may access this endpoint

### Example

```javascript
import AdmintenantsApi from 'src/api/activiti-rest-api/docs/AdminTenantsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let admintenantsApi = new AdmintenantsApi(this.alfrescoApi);


admintenantsApi.createTenant(createTenantRepresentation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createTenantRepresentation** | [**CreateTenantRepresentation**](CreateTenantRepresentation.md)| createTenantRepresentation | 

### Return type

[**LightTenantRepresentation**](LightTenantRepresentation.md)

<a name="deleteTenant"></a>
# **deleteTenant**
> deleteTenant(tenantId)

Delete a tenant

### Example

```javascript
import AdmintenantsApi from 'src/api/activiti-rest-api/docs/AdminTenantsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let admintenantsApi = new AdmintenantsApi(this.alfrescoApi);


admintenantsApi.deleteTenant(tenantId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenantId** | **number**| tenantId | 

### Return type

null (empty response body)

<a name="getTenantEvents"></a>
# **getTenantEvents**
> TenantEvent getTenantEvents(tenantId)

Get tenant events

### Example

```javascript
import AdmintenantsApi from 'src/api/activiti-rest-api/docs/AdminTenantsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let admintenantsApi = new AdmintenantsApi(this.alfrescoApi);


admintenantsApi.getTenantEvents(tenantId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenantId** | **number**| tenantId | 

### Return type

[**TenantEvent**](TenantEvent.md)

<a name="getTenantLogo"></a>
# **getTenantLogo**
> getTenantLogo(tenantId)

Get a tenant's logo

### Example

```javascript
import AdmintenantsApi from 'src/api/activiti-rest-api/docs/AdminTenantsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let admintenantsApi = new AdmintenantsApi(this.alfrescoApi);


admintenantsApi.getTenantLogo(tenantId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenantId** | **number**| tenantId | 

### Return type

null (empty response body)

<a name="getTenant"></a>
# **getTenant**
> TenantRepresentation getTenant(tenantId)

Get a tenant

### Example

```javascript
import AdmintenantsApi from 'src/api/activiti-rest-api/docs/AdminTenantsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let admintenantsApi = new AdmintenantsApi(this.alfrescoApi);


admintenantsApi.getTenant(tenantId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenantId** | **number**| tenantId | 

### Return type

[**TenantRepresentation**](TenantRepresentation.md)

<a name="getTenants"></a>
# **getTenants**
> LightTenantRepresentation getTenants()

List tenants

Only a tenant manager may access this endpoint

### Example

```javascript
import AdmintenantsApi from 'src/api/activiti-rest-api/docs/AdminTenantsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let admintenantsApi = new AdmintenantsApi(this.alfrescoApi);

admintenantsApi.getTenants().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**LightTenantRepresentation**](LightTenantRepresentation.md)

<a name="update"></a>
# **update**
> TenantRepresentation update(tenantIdcreateTenantRepresentation)

Update a tenant

### Example

```javascript
import AdmintenantsApi from 'src/api/activiti-rest-api/docs/AdminTenantsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let admintenantsApi = new AdmintenantsApi(this.alfrescoApi);


admintenantsApi.update(tenantIdcreateTenantRepresentation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenantId** | **number**| tenantId | 
 **createTenantRepresentation** | [**CreateTenantRepresentation**](CreateTenantRepresentation.md)| createTenantRepresentation | 

### Return type

[**TenantRepresentation**](TenantRepresentation.md)

<a name="uploadTenantLogo"></a>
# **uploadTenantLogo**
> ImageUploadRepresentation uploadTenantLogo(tenantIdfile)

Update a tenant's logo

### Example

```javascript
import AdmintenantsApi from 'src/api/activiti-rest-api/docs/AdminTenantsApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let admintenantsApi = new AdmintenantsApi(this.alfrescoApi);


admintenantsApi.uploadTenantLogo(tenantIdfile).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenantId** | **number**| tenantId | 
 **file** | **Blob**| file | 

### Return type

[**ImageUploadRepresentation**](ImageUploadRepresentation.md)

