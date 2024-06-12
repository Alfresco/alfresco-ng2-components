# LegalHoldApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getHolds**](LegalHoldApi.md#getHolds) | **GET** /file-plans/{filePlanId}/holds | Get legal holds list
[**createHold**](LegalHoldApi.md#createHold) | **POST** /file-plans/{filePlanId}/holds | Create legal holds
[**assignHold**](LegalHoldApi.md#assignHold) | **POST** /holds/{holdId}/children | Assign nodes to legal hold

<a name="getHolds"></a>
# **getHolds**
> HoldPaging getHolds(filePlanId, opts)

Get legal holds list.

### Example
```javascript
import LegalHoldApi from 'LegalHoldApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let legalHoldApi = new LegalHoldApi(this.alfrescoApi);

let opts = { 
  'skipCount': 56 //  | The number of entities that exist in the collection before those included in this list.
  'maxItems': 56 //  | The maximum number of items to return in the list.
};

legalHoldApi.getHolds('-filePlan-', opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Default value  | Description
------------- | ------------- | ------------- | -------------
 **filePlanId** | **string** | | The site details 
 **skipCount** | **number**| `0` | The number of entities that exist in the collection before those included in this list. [optional] 
 **maxItems** | **number**| `100` | The maximum number of items to return in the list. [optional] 

### Return type

[**HoldPaging**](HoldPaging.md)

<a name="createHold"></a>
# **createHold**
> CreateHoldEntry createHold(filePlanId, holds)

Create legal holds.

### Example

```javascript
import LegalHoldApi from 'LegalHoldApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let legalHoldApi = new LegalHoldApi(this.alfrescoApi);

let opts = { 
  name: 'Hold 1',
  reason: 'Reason 1'
};

legalHoldApi.createHold('-filePlan-', holds).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Default value  | Description
------------- | ------------- | ------------- | -------------
 **filePlanId** | **string** | | The site details 
 **holds** | **Hold[]**| `0` | Array of new holds.

### Return type

[**CreateHoldEntry**](CreateHoldEntry.md)

<a name="assignHold"></a>
# **assignHold**
> AssignedHoldEntry assignHold(holdId, nodesIds)

Assign nodes to legal hold.

### Example

```javascript
import LegalHoldApi from 'LegalHoldApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let legalHoldApi = new LegalHoldApi(this.alfrescoApi);

let opts = [{
    id: 'nodeId'
}];

legalHoldApi.createHold(nodeId, nodesIds).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Default value  | Description
------------- | ------------- | ------------- | -------------
 **holdId** | **string** | | hold id
 **nodesIds** | **AssignedHold[]**| `0` | nodes ids assigned to a hold

### Return type

[**AssignedHoldEntry**](AssignedHoldEntry.md)

