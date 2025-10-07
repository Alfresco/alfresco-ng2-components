# DeclassificationExemptionsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createDeclassificationExemption**](DeclassificationExemptionsApi.md#createDeclassificationExemption) | **POST** /declassification-exemptions | Create a declassification exemption
[**deleteDeclassificationExemption**](DeclassificationExemptionsApi.md#deleteDeclassificationExemption) | **DELETE** /declassification-exemptions/{declassificationExemptionId} | Delete a declassification exemption
[**listDeclassificationExemptions**](DeclassificationExemptionsApi.md#listDeclassificationExemptions) | **GET** /declassification-exemptions | List all declassification exemptions
[**showDeclassificationExemptionById**](DeclassificationExemptionsApi.md#showDeclassificationExemptionById) | **GET** /declassification-exemptions/{declassificationExemptionId} | Get declassification exemption information
[**updateDeclassificationExemption**](DeclassificationExemptionsApi.md#updateDeclassificationExemption) | **PUT** /declassification-exemptions/{declassificationExemptionId} | Update a declassification exemption


<a name="createDeclassificationExemption"></a>
# **createDeclassificationExemption**
> DeclassificationExemptionEntry createDeclassificationExemption(declassificationExemption)

Create a declassification exemption

Creates a new declassification exemption.

**Note:** You can create more than one exemption by specifying a list of exemptions in the JSON body.
For example, the following JSON body creates two declassification exemptions:
JSON
[
  {
    \"code\":\"My Code1\",
    \"description\":\"My Description1\"
  },
  {
    \"code\":\"My Code2\",
    \"description\":\"My Description2\"
  }
]

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

JSON
{
  \"list\": {
    \"pagination\": {
      \"count\": 2,
      \"hasMoreItems\": false,
      \"totalItems\": 2,
      \"skipCount\": 0,
      \"maxItems\": 100
    },
    \"entries\": [
      {
        \"entry\": {
          ...
        }
      },
      {
        \"entry\": {
          ...
        }
      }
    ]
  }
}



### Example
```javascript
import DeclassificationExemptionsApi from 'DeclassificationExemptionsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let declassificationexemptionsApi = new DeclassificationExemptionsApi(this.alfrescoApi);


declassificationexemptionsApi.createDeclassificationExemption(declassificationExemption).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **declassificationExemption** | [**DeclassificationExemptionBody**](DeclassificationExemptionBody.md)| Declassification exemption | 

### Return type

[**DeclassificationExemptionEntry**](DeclassificationExemptionEntry.md)

<a name="deleteDeclassificationExemption"></a>
# **deleteDeclassificationExemption**
> deleteDeclassificationExemption(declassificationExemptionId)

Delete a declassification exemption

Deletes the declassification exemption with id **declassificationExemptionId**. You can't delete a classification exemption that is being used to classify content.

### Example
```javascript
import DeclassificationExemptionsApi from 'DeclassificationExemptionsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let declassificationexemptionsApi = new DeclassificationExemptionsApi(this.alfrescoApi);


declassificationexemptionsApi.deleteDeclassificationExemption(declassificationExemptionId).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **declassificationExemptionId** | **string**| The identifier for the declassification exemption | 

### Return type

null (empty response body)

<a name="listDeclassificationExemptions"></a>
# **listDeclassificationExemptions**
> DeclassificationExemptionsPaging listDeclassificationExemptions(opts)

List all declassification exemptions

Gets all declassification exemptions.

### Example
```javascript
import DeclassificationExemptionsApi from 'DeclassificationExemptionsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let declassificationexemptionsApi = new DeclassificationExemptionsApi(this.alfrescoApi);

let opts = { 
  'skipCount': 56 //  | The number of entities that exist in the collection before those included in this list.
  'maxItems': 56 //  | The maximum number of items to return in the list.
};

declassificationexemptionsApi.listDeclassificationExemptions(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **skipCount** | **number**| The number of entities that exist in the collection before those included in this list. | [optional] 
 **maxItems** | **number**| The maximum number of items to return in the list. | [optional] 

### Return type

[**DeclassificationExemptionsPaging**](DeclassificationExemptionsPaging.md)

<a name="showDeclassificationExemptionById"></a>
# **showDeclassificationExemptionById**
> DeclassificationExemptionEntry showDeclassificationExemptionById(declassificationExemptionId)

Get declassification exemption information

Gets the declassification exemption with id **declassificationExemptionId**.

### Example
```javascript
import DeclassificationExemptionsApi from 'DeclassificationExemptionsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let declassificationexemptionsApi = new DeclassificationExemptionsApi(this.alfrescoApi);


declassificationexemptionsApi.showDeclassificationExemptionById(declassificationExemptionId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **declassificationExemptionId** | **string**| The identifier for the declassification exemption | 

### Return type

[**DeclassificationExemptionEntry**](DeclassificationExemptionEntry.md)

<a name="updateDeclassificationExemption"></a>
# **updateDeclassificationExemption**
> DeclassificationExemptionEntry updateDeclassificationExemption(declassificationExemptionIddeclassificationExemption)

Update a declassification exemption

Updates the declassification exemption with id **declassificationExemptionId**. For example, you can rename a declassification exemption.

### Example
```javascript
import DeclassificationExemptionsApi from 'DeclassificationExemptionsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let declassificationexemptionsApi = new DeclassificationExemptionsApi(this.alfrescoApi);


declassificationexemptionsApi.updateDeclassificationExemption(declassificationExemptionIddeclassificationExemption).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **declassificationExemptionId** | **string**| The identifier for the declassification exemption | 
 **declassificationExemption** | [**DeclassificationExemptionBody**](DeclassificationExemptionBody.md)| Declassification exemption | 

### Return type

[**DeclassificationExemptionEntry**](DeclassificationExemptionEntry.md)

