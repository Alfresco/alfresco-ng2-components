# UserprofileApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**changePassword**](UserProfileApi.md#changePassword) | **POST** /enterprise/profile-password | Change user password
[**getProfilePicture**](UserProfileApi.md#getProfilePicture) | **GET** /enterprise/profile-picture | Retrieve user profile picture
[**getProfile**](UserProfileApi.md#getProfile) | **GET** /enterprise/profile | Get user profile
[**updateProfile**](UserProfileApi.md#updateProfile) | **POST** /enterprise/profile | Update user profile
[**uploadProfilePicture**](UserProfileApi.md#uploadProfilePicture) | **POST** /enterprise/profile-picture | Change user profile picture
[**getProfilePictureUrl**](ProfileApi.md#getProfile) | **GET** /app/rest/admin/profile-picture | Retrieve Url user profile picture


<a name="changePassword"></a>
# **changePassword**
> changePassword(changePasswordRepresentation)

Change user password

### Example

```javascript
import UserprofileApi from 'src/api/activiti-rest-api/docs/UserProfileApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userprofileApi = new UserprofileApi(this.alfrescoApi);


userprofileApi.changePassword(changePasswordRepresentation).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **changePasswordRepresentation** | [**ChangePasswordRepresentation**](ChangePasswordRepresentation.md)| changePasswordRepresentation | 

### Return type

null (empty response body)

<a name="getProfilePicture"></a>
# **getProfilePicture**
> Blob getProfilePicture()

Retrieve user profile picture

Generally returns an image file

### Example

```javascript
import UserprofileApi from 'src/api/activiti-rest-api/docs/UserProfileApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userprofileApi = new UserprofileApi(this.alfrescoApi);

userprofileApi.getProfilePicture().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

**Blob**

<a name="getProfile"></a>
# **getProfile**
> UserRepresentation getProfile()

Get user profile

This operation returns account information for the current user. This is useful to get the name, email, the groups that the user is part of, the user picture, etc.

### Example

```javascript
import UserprofileApi from 'src/api/activiti-rest-api/docs/UserProfileApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userprofileApi = new UserprofileApi(this.alfrescoApi);

userprofileApi.getProfile().then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

[**UserRepresentation**](UserRepresentation.md)

<a name="updateProfile"></a>
# **updateProfile**
> UserRepresentation updateProfile(userRepresentation)

Update user profile

Only a first name, last name, email and company can be updated

### Example

```javascript
import UserprofileApi from 'src/api/activiti-rest-api/docs/UserProfileApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userprofileApi = new UserprofileApi(this.alfrescoApi);


userprofileApi.updateProfile(userRepresentation).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userRepresentation** | [**UserRepresentation**](UserRepresentation.md)| userRepresentation | 

### Return type

[**UserRepresentation**](UserRepresentation.md)

<a name="uploadProfilePicture"></a>
# **uploadProfilePicture**
> ImageUploadRepresentation uploadProfilePicture(file)

Change user profile picture

### Example

```javascript
import UserprofileApi from 'src/api/activiti-rest-api/docs/UserProfileApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userprofileApi = new UserprofileApi(this.alfrescoApi);


userprofileApi.uploadProfilePicture(file).then((data) => {
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

[**ImageUploadRepresentation**](ImageUploadRepresentation.md)


<a name="getProfilePictureUrl"></a>
# **getProfilePictureUrl**
> File getProfilePictureUrl()

Retrieve user url profile picture

Generally returns an URL image file

### Example

```javascript
import UserprofileApi from 'src/api/activiti-rest-api/docs/UserProfileApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let userprofileApi = new UserprofileApi(this.alfrescoApi);

userprofileApi.getProfilePictureUrl();
```

### Parameters
This endpoint does not need any parameter.

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json
 