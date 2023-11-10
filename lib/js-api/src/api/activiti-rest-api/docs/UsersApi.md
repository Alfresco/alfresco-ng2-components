# UsersApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**executeAction**](UsersApi.md#executeAction) | **POST** /enterprise/users/{userId} | Execute an action for a specific user
[**getProfilePicture**](UsersApi.md#getProfilePicture) | **GET** /enterprise/users/{userId}/picture | Stream user profile picture
[**getUser**](UsersApi.md#getUser) | **GET** /enterprise/users/{userId} | Get a user
[**getUsers**](UsersApi.md#getUsers) | **GET** /enterprise/users | Query users
[**requestPasswordReset**](UsersApi.md#requestPasswordReset) | **POST** /enterprise/idm/passwords | Request a password reset
[**updateUser**](UsersApi.md#updateUser) | **PUT** /enterprise/users/{userId} | Update a user


<a name="executeAction"></a>
# **executeAction**
> executeAction(userIdactionRequest)

Execute an action for a specific user

Typical action is updating/reset password

### Example
```javascript
import UsersApi from 'UsersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let usersApi = new UsersApi(this.alfrescoApi);


usersApi.executeAction(userIdactionRequest).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **number**| userId | 
 **actionRequest** | [**UserActionRepresentation**](UserActionRepresentation.md)| actionRequest | 

### Return type

null (empty response body)

<a name="getProfilePicture"></a>
# **getProfilePicture**
> getProfilePicture(userId)

Stream user profile picture

### Example
```javascript
import UsersApi from 'UsersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let usersApi = new UsersApi(this.alfrescoApi);


usersApi.getProfilePicture(userId).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **number**| userId | 

### Return type

null (empty response body)

<a name="getUser"></a>
# **getUser**
> UserRepresentation getUser(userId)

Get a user

### Example
```javascript
import UsersApi from 'UsersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let usersApi = new UsersApi(this.alfrescoApi);


usersApi.getUser(userId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **number**| userId | 

### Return type

[**UserRepresentation**](UserRepresentation.md)

<a name="getUsers"></a>
# **getUsers**
> ResultListDataRepresentationLightUserRepresentation getUsers(opts)

Query users

A common use case is that a user wants to select another user (eg. when assigning a task) or group.

### Example
```javascript
import UsersApi from 'UsersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let usersApi = new UsersApi(this.alfrescoApi);

let opts = { 
  'filter': filter_example //  | filter
  'email': email_example //  | email
  'externalId': externalId_example //  | externalId
  'externalIdCaseInsensitive': externalIdCaseInsensitive_example //  | externalIdCaseInsensitive
  'excludeTaskId': excludeTaskId_example //  | excludeTaskId
  'excludeProcessId': excludeProcessId_example //  | excludeProcessId
  'groupId': 789 //  | groupId
  'tenantId': 789 //  | tenantId
};

usersApi.getUsers(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filter** | **string**| filter | [optional] 
 **email** | **string**| email | [optional] 
 **externalId** | **string**| externalId | [optional] 
 **externalIdCaseInsensitive** | **string**| externalIdCaseInsensitive | [optional] 
 **excludeTaskId** | **string**| excludeTaskId | [optional] 
 **excludeProcessId** | **string**| excludeProcessId | [optional] 
 **groupId** | **number**| groupId | [optional] 
 **tenantId** | **number**| tenantId | [optional] 

### Return type

[**ResultListDataRepresentationLightUserRepresentation**](ResultListDataRepresentationLightUserRepresentation.md)

<a name="requestPasswordReset"></a>
# **requestPasswordReset**
> requestPasswordReset(resetPassword)

Request a password reset

### Example
```javascript
import UsersApi from 'UsersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let usersApi = new UsersApi(this.alfrescoApi);


usersApi.requestPasswordReset(resetPassword).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resetPassword** | [**ResetPasswordRepresentation**](ResetPasswordRepresentation.md)| resetPassword | 

### Return type

null (empty response body)

<a name="updateUser"></a>
# **updateUser**
> UserRepresentation updateUser(userIduserRequest)

Update a user

### Example
```javascript
import UsersApi from 'UsersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let usersApi = new UsersApi(this.alfrescoApi);


usersApi.updateUser(userIduserRequest).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **number**| userId | 
 **userRequest** | [**UserRepresentation**](UserRepresentation.md)| userRequest | 

### Return type

[**UserRepresentation**](UserRepresentation.md)

