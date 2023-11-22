# AdminusersApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**bulkUpdateUsers**](AdminUsersApi.md#bulkUpdateUsers) | **PUT** /enterprise/admin/users | Bulk update a list of users
[**createNewUser**](AdminUsersApi.md#createNewUser) | **POST** /enterprise/admin/users | Create a user
[**getUser**](AdminUsersApi.md#getUser) | **GET** /enterprise/admin/users/{userId} | Get a user
[**getUsers**](AdminUsersApi.md#getUsers) | **GET** /enterprise/admin/users | Query users
[**updateUserDetails**](AdminUsersApi.md#updateUserDetails) | **PUT** /enterprise/admin/users/{userId} | Update a user


<a name="bulkUpdateUsers"></a>
# **bulkUpdateUsers**
> bulkUpdateUsers(update)

Bulk update a list of users

### Example

```javascript
import AdminusersApi from 'src/api/activiti-rest-api/docs/AdminUsersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let adminusersApi = new AdminusersApi(this.alfrescoApi);


adminusersApi.bulkUpdateUsers(update).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **update** | [**BulkUserUpdateRepresentation**](BulkUserUpdateRepresentation.md)| update | 

### Return type

null (empty response body)

<a name="createNewUser"></a>
# **createNewUser**
> UserRepresentation createNewUser(userRepresentation)

Create a user

### Example

```javascript
import AdminusersApi from 'src/api/activiti-rest-api/docs/AdminUsersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let adminusersApi = new AdminusersApi(this.alfrescoApi);


adminusersApi.createNewUser(userRepresentation).then((data) => {
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

<a name="getUser"></a>
# **getUser**
> AbstractUserRepresentation getUser(userIdopts)

Get a user

### Example

```javascript
import AdminusersApi from 'src/api/activiti-rest-api/docs/AdminUsersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let adminusersApi = new AdminusersApi(this.alfrescoApi);

let opts = {
    'summary': true //  | summary
};

adminusersApi.getUser(userIdopts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **number**| userId | 
 **summary** | **boolean**| summary | [optional] 

### Return type

[**AbstractUserRepresentation**](AbstractUserRepresentation.md)

<a name="getUsers"></a>
# **getUsers**
> ResultListDataRepresentationAbstractUserRepresentation getUsers(opts)

Query users

### Example

```javascript
import AdminusersApi from 'src/api/activiti-rest-api/docs/AdminUsersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let adminusersApi = new AdminusersApi(this.alfrescoApi);

let opts = {
    'filter': filter_example //  | filter
    'status': status_example //  | status
    'accountType': accountType_example //  | accountType
    'sort': sort_example //  | sort
    'company': company_example //  | company
    'start': 56 //  | start
    'page': 56 //  | page
    'size': 56 //  | size
    'groupId': 789 //  | groupId
    'tenantId': 789 //  | tenantId
    'summary': true //  | summary
};

adminusersApi.getUsers(opts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filter** | **string**| filter | [optional] 
 **status** | **string**| status | [optional] 
 **accountType** | **string**| accountType | [optional] 
 **sort** | **string**| sort | [optional] 
 **company** | **string**| company | [optional] 
 **start** | **number**| start | [optional] 
 **page** | **number**| page | [optional] 
 **size** | **number**| size | [optional] 
 **groupId** | **number**| groupId | [optional] 
 **tenantId** | **number**| tenantId | [optional] 
 **summary** | **boolean**| summary | [optional] 

### Return type

[**ResultListDataRepresentationAbstractUserRepresentation**](ResultListDataRepresentationAbstractUserRepresentation.md)

<a name="updateUserDetails"></a>
# **updateUserDetails**
> updateUserDetails(userIduserRepresentation)

Update a user

### Example

```javascript
import AdminusersApi from 'src/api/activiti-rest-api/docs/AdminUsersApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let adminusersApi = new AdminusersApi(this.alfrescoApi);


adminusersApi.updateUserDetails(userIduserRepresentation).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **number**| userId | 
 **userRepresentation** | [**UserRepresentation**](UserRepresentation.md)| userRepresentation | 

### Return type

null (empty response body)

