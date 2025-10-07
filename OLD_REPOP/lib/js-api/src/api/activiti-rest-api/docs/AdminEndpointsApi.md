# AdminEndpointsApi

All URIs are relative to */activiti-app/api*

| Method                                                        | HTTP request                                                     | Description                      |
|---------------------------------------------------------------|------------------------------------------------------------------|----------------------------------|
| [createBasicAuthConfiguration](#createBasicAuthConfiguration) | **POST** /enterprise/admin/basic-auths                           | Add an endpoint authorization    |
| [createEndpointConfiguration](#createEndpointConfiguration)   | **POST** /enterprise/admin/endpoints                             | Create an endpoint               |
| [getBasicAuthConfiguration](#getBasicAuthConfiguration)       | **GET** /enterprise/admin/basic-auths/{basicAuthId}              | Get an endpoint authorization    |
| [getBasicAuthConfigurations](#getBasicAuthConfigurations)     | **GET** /enterprise/admin/basic-auths                            | List endpoint authorizations     |
| [getEndpointConfiguration](#getEndpointConfiguration)         | **GET** /enterprise/admin/endpoints/{endpointConfigurationId}    | Get an endpoint                  |
| [getEndpointConfigurations](#getEndpointConfigurations)       | **GET** /enterprise/admin/endpoints                              | List endpoints                   |
| [removeBasicAuthConfiguration](#removeBasicAuthConfiguration) | **DELETE** /enterprise/admin/basic-auths/{basicAuthId}           | Delete an endpoint authorization |
| [removeEndpointConfiguration](#removeEndpointConfiguration)   | **DELETE** /enterprise/admin/endpoints/{endpointConfigurationId} | Delete an endpoint               |
| [updateBasicAuthConfiguration](#updateBasicAuthConfiguration) | **PUT** /enterprise/admin/basic-auths/{basicAuthId}              | Update an endpoint authorization |
| [updateEndpointConfiguration](#updateEndpointConfiguration)   | **PUT** /enterprise/admin/endpoints/{endpointConfigurationId}    | Update an endpoint               |

# createBasicAuthConfiguration

Add an endpoint authorization

**Parameters**

| Name                     | Type                                                                            |
|--------------------------|---------------------------------------------------------------------------------|
| **createRepresentation** | [CreateEndpointBasicAuthRepresentation](#CreateEndpointBasicAuthRepresentation) | 

**Return type**: [EndpointBasicAuthRepresentation](#EndpointBasicAuthRepresentation)

**Example**

```javascript
import { AlfrescoApi, AdminEndpointsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const adminEndpointsApi = new AdminEndpointsApi(alfrescoApi);
const createRepresentation = {};

adminEndpointsApi.createBasicAuthConfiguration(createRepresentation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# createEndpointConfiguration

Create an endpoint

**Parameters**

| Name               | Type                                                                          |
|--------------------|-------------------------------------------------------------------------------|
| **representation** | [EndpointConfigurationRepresentation](EndpointConfigurationRepresentation.md) | 

**Return type**: [EndpointConfigurationRepresentation](EndpointConfigurationRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, AdminEndpointsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const adminEndpointsApi = new AdminEndpointsApi(alfrescoApi);
const representation = {};

adminEndpointsApi.createEndpointConfiguration(representation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# getBasicAuthConfiguration

Get an endpoint authorization

**Parameters**

| Name            | Type   | Description |
|-----------------|--------|-------------|
| **basicAuthId** | number | basicAuthId | 
| **tenantId**    | number | tenantId    | 

**Return type**: [EndpointBasicAuthRepresentation](#EndpointBasicAuthRepresentation)

**Example**

```javascript
import { AlfrescoApi, AdminEndpointsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const adminEndpointsApi = new AdminEndpointsApi(alfrescoApi);
const authId = 0;
const tenantId = 0;

adminEndpointsApi.getBasicAuthConfiguration(authId, tenantId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# getBasicAuthConfigurations

List endpoint authorizations

**Parameters**

| Name         | Type   |
|--------------|--------|
| **tenantId** | number | 

**Return type**: [EndpointBasicAuthRepresentation](#EndpointBasicAuthRepresentation)

**Example**

```javascript
import { AlfrescoApi, AdminEndpointsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const adminEndpointsApi = new AdminEndpointsApi(alfrescoApi);
const tenantId = 0;

adminEndpointsApi.getBasicAuthConfigurations(tenantId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# getEndpointConfiguration

Get an endpoint

**Parameters**

| Name                        | Type   |
|-----------------------------|--------|
| **endpointConfigurationId** | number | 
| **tenantId**                | number | 

**Return type**: [EndpointConfigurationRepresentation](EndpointConfigurationRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, AdminEndpointsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const adminEndpointsApi = new AdminEndpointsApi(alfrescoApi);
const endpointConfigurationId = 0;
const tenantId = 0;

adminEndpointsApi.getEndpointConfiguration(endpointConfigurationId, tenantId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# getEndpointConfigurations

List endpoints

**Parameters**

| Name         | Type   |
|--------------|--------|
| **tenantId** | number | 

**Return type**: [EndpointConfigurationRepresentation](EndpointConfigurationRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, AdminEndpointsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const adminEndpointsApi = new AdminEndpointsApi(alfrescoApi);
const tenantId = 0;

adminEndpointsApi.getEndpointConfigurations(tenantId).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# removeBasicAuthConfiguration

Delete an endpoint authorization

**Parameters**

| Name            | Type   |
|-----------------|--------|
| **basicAuthId** | number | 
| **tenantId**    | number | 

**Example**

```javascript
import { AlfrescoApi, AdminEndpointsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const adminEndpointsApi = new AdminEndpointsApi(alfrescoApi);
const basicAuthId = 0;
const tenantId = 0;

adminEndpointsApi.removeBasicAuthConfiguration(basicAuthId, tenantId).then(() => {
    console.log('API called successfully.');
});
```

# removeEndpointConfiguration

Delete an endpoint

**Parameters**

| Name                        | Type   |
|-----------------------------|--------|
| **endpointConfigurationId** | number | 
| **tenantId**                | number | 

**Example**

```javascript
import { AlfrescoApi, AdminEndpointsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const adminEndpointsApi = new AdminEndpointsApi(alfrescoApi);
const endpointConfigurationId = 0;
const tenantId = 0;

adminendpointsApi.removeEndpointConfiguration(endpointConfigurationId, tenantId).then(() => {
    console.log('API called successfully.');
});
```

# updateBasicAuthConfiguration

Update an endpoint authorization

**Parameters**

| Name                     | Type                                                                            |
|--------------------------|---------------------------------------------------------------------------------|
| **basicAuthId**          | number                                                                          | 
| **createRepresentation** | [CreateEndpointBasicAuthRepresentation](#CreateEndpointBasicAuthRepresentation) | 

**Return type**: [EndpointBasicAuthRepresentation](#EndpointBasicAuthRepresentation)

**Example**

```javascript
import { AlfrescoApi, AdminEndpointsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const adminEndpointsApi = new AdminEndpointsApi(alfrescoApi);
const basicAuthId = 0;
const createRepresentation = {};

adminEndpointsApi.updateBasicAuthConfiguration(basicAuthId, createRepresentation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# updateEndpointConfiguration

Update an endpoint

**Parameters**

| Name                        | Type                                                                          |
|-----------------------------|-------------------------------------------------------------------------------|
| **endpointConfigurationId** | number                                                                        | 
| **representation**          | [EndpointConfigurationRepresentation](EndpointConfigurationRepresentation.md) | 

**Return type**: [EndpointConfigurationRepresentation](EndpointConfigurationRepresentation.md)

**Example**

```javascript
import { AlfrescoApi, AdminEndpointsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const adminEndpointsApi = new AdminEndpointsApi(alfrescoApi);
const endpointConfigurationId = 0;
const representation = {};

adminendpointsApi.updateEndpointConfiguration(endpointConfigurationId, representation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## CreateEndpointBasicAuthRepresentation

**Properties**

| Name     | Type   |
|----------|--------|
| name     | string |
| password | string |
| tenantId | number |
| username | string |

## EndpointBasicAuthRepresentation

**Properties**

| Name        | Type   |
|-------------|--------|
| created     | Date   |
| id          | number |
| lastUpdated | Date   |
| name        | string |
| tenantId    | number |
| username    | string |



