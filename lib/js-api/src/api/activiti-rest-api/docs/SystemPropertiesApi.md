# SystempropertiesApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getGlobalDateFormat**](SystemPropertiesApi.md#getGlobalDateFormat) | **GET** /enterprise/system/properties/global-date-format/{tenantId} | Get global date format
[**getPasswordValidationConstraints**](SystemPropertiesApi.md#getPasswordValidationConstraints) | **GET** /enterprise/system/properties/password-validation-constraints/{tenantId} | Get password validation constraints
[**getProperties**](SystemPropertiesApi.md#getProperties) | **GET** /enterprise/system/properties | Retrieve system properties
[**involvedUsersCanEditForms**](SystemPropertiesApi.md#involvedUsersCanEditForms) | **GET** /enterprise/system/properties/involved-users-can-edit-forms/{tenantId} | Get involved users who can edit forms


<a name="getGlobalDateFormat"></a>
# **getGlobalDateFormat**
> GlobalDateFormatRepresentation getGlobalDateFormat(tenantId)

Get global date format

### Example

```javascript
import SystempropertiesApi from 'src/api/activiti-rest-api/docs/SystemPropertiesApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let systempropertiesApi = new SystempropertiesApi(this.alfrescoApi);


systempropertiesApi.getGlobalDateFormat(tenantId).then((data) => {
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

[**GlobalDateFormatRepresentation**](GlobalDateFormatRepresentation.md)

<a name="getPasswordValidationConstraints"></a>
# **getPasswordValidationConstraints**
> PasswordValidationConstraints getPasswordValidationConstraints(tenantId)

Get password validation constraints

### Example

```javascript
import SystempropertiesApi from 'src/api/activiti-rest-api/docs/SystemPropertiesApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let systempropertiesApi = new SystempropertiesApi(this.alfrescoApi);


systempropertiesApi.getPasswordValidationConstraints(tenantId).then((data) => {
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

[**PasswordValidationConstraints**](PasswordValidationConstraints.md)

<a name="getProperties"></a>
# **getProperties**
> SystemPropertiesRepresentation getProperties()

Retrieve system properties

Typical value is AllowInvolveByEmail

### Example

```javascript
import SystempropertiesApi from 'src/api/activiti-rest-api/docs/SystemPropertiesApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let systempropertiesApi = new SystempropertiesApi(this.alfrescoApi);

systempropertiesApi.getProperties().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**SystemPropertiesRepresentation**](SystemPropertiesRepresentation.md)

<a name="involvedUsersCanEditForms"></a>
# **involvedUsersCanEditForms**
> boolean involvedUsersCanEditForms(tenantId)

Get involved users who can edit forms

### Example

```javascript
import SystempropertiesApi from 'src/api/activiti-rest-api/docs/SystemPropertiesApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let systempropertiesApi = new SystempropertiesApi(this.alfrescoApi);


systempropertiesApi.involvedUsersCanEditForms(tenantId).then((data) => {
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

**boolean**

