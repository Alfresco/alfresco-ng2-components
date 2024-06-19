# LegalHoldApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getHolds**](LegalHoldApi.md#getHolds) | **GET** /file-plans/{filePlanId}/holds | Get legal holds list

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
