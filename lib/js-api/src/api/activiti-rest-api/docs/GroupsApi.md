# GroupsApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getGroups**](GroupsApi.md#getGroups) | **GET** /enterprise/groups | Query groups
[**getUsersForGroup**](GroupsApi.md#getUsersForGroup) | **GET** /enterprise/groups/{groupId}/users | List members of a group


<a name="getGroups"></a>
# **getGroups**
> ResultListDataRepresentationLightGroupRepresentation getGroups(opts)

Query groups

### Example
```javascript
import GroupsApi from 'GroupsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let groupsApi = new GroupsApi(this.alfrescoApi);

let opts = { 
  'filter': filter_example //  | filter
  'groupId': 789 //  | groupId
  'externalId': externalId_example //  | externalId
  'externalIdCaseInsensitive': externalIdCaseInsensitive_example //  | externalIdCaseInsensitive
  'tenantId': 789 //  | tenantId
};

groupsApi.getGroups(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **filter** | **string**| filter | [optional] 
 **groupId** | **number**| groupId | [optional] 
 **externalId** | **string**| externalId | [optional] 
 **externalIdCaseInsensitive** | **string**| externalIdCaseInsensitive | [optional] 
 **tenantId** | **number**| tenantId | [optional] 

### Return type

[**ResultListDataRepresentationLightGroupRepresentation**](ResultListDataRepresentationLightGroupRepresentation.md)

<a name="getUsersForGroup"></a>
# **getUsersForGroup**
> ResultListDataRepresentationLightUserRepresentation getUsersForGroup(groupId)

List members of a group

### Example
```javascript
import GroupsApi from 'GroupsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let groupsApi = new GroupsApi(this.alfrescoApi);


groupsApi.getUsersForGroup(groupId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **groupId** | **number**| groupId | 

### Return type

[**ResultListDataRepresentationLightUserRepresentation**](ResultListDataRepresentationLightUserRepresentation.md)

