# IdmsyncApi

All URIs are relative to */activiti-app/api*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getLogFile**](IDMSyncApi.md#getLogFile) | **GET** /enterprise/idm-sync-log-entries/{syncLogEntryId}/logfile | Get log file for a sync log entry
[**getSyncLogEntries**](IDMSyncApi.md#getSyncLogEntries) | **GET** /enterprise/idm-sync-log-entries | List sync log entries


<a name="getLogFile"></a>
# **getLogFile**
> getLogFile(syncLogEntryId)

Get log file for a sync log entry

### Example

```javascript
import IdmsyncApi from 'src/api/activiti-rest-api/docs/IDMSyncApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let idmsyncApi = new IdmsyncApi(this.alfrescoApi);


idmsyncApi.getLogFile(syncLogEntryId).then(() => {
    console.log('API called successfully.');
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **syncLogEntryId** | **number**| syncLogEntryId | 

### Return type

null (empty response body)

<a name="getSyncLogEntries"></a>
# **getSyncLogEntries**
> SyncLogEntryRepresentation getSyncLogEntries(opts)

List sync log entries

### Example

```javascript
import IdmsyncApi from 'src/api/activiti-rest-api/docs/IDMSyncApi';
import {AlfrescoApi} from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let idmsyncApi = new IdmsyncApi(this.alfrescoApi);

let opts = {
    'tenantId': 789 //  | tenantId
    'page': 56 //  | page
    'start': 56 //  | start
    'size': 56 //  | size
};

idmsyncApi.getSyncLogEntries(opts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tenantId** | **number**| tenantId | [optional] 
 **page** | **number**| page | [optional] 
 **start** | **number**| start | [optional] 
 **size** | **number**| size | [optional] 

### Return type

[**SyncLogEntryRepresentation**](SyncLogEntryRepresentation.md)

