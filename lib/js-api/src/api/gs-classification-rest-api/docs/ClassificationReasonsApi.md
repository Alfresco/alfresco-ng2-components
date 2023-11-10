# ClassificationReasonsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createClassificationReason**](ClassificationReasonsApi.md#createClassificationReason) | **POST** /classification-reasons | Create a classification reason
[**deleteClassificationReason**](ClassificationReasonsApi.md#deleteClassificationReason) | **DELETE** /classification-reasons/{classificationReasonId} | Delete a classification reason
[**listClassificationReasons**](ClassificationReasonsApi.md#listClassificationReasons) | **GET** /classification-reasons | List all classification reasons
[**showClassificationReasonById**](ClassificationReasonsApi.md#showClassificationReasonById) | **GET** /classification-reasons/{classificationReasonId} | Get classification reason information
[**updateClassificationReason**](ClassificationReasonsApi.md#updateClassificationReason) | **PUT** /classification-reasons/{classificationReasonId} | Update a classification reason


<a name="createClassificationReason"></a>
# **createClassificationReason**
> ClassificationReasonEntry createClassificationReason(classificationReason)

Create a classification reason

Creates a new classification reason.

**Note:** You can create more than one reason by specifying a list of reasons in the JSON body.
For example, the following JSON body creates two classification reasons:
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
import ClassificationReasonsApi from 'ClassificationReasonsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationreasonsApi = new ClassificationReasonsApi(this.alfrescoApi);


classificationreasonsApi.createClassificationReason(classificationReason).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **classificationReason** | [**ClassificationReasonBody**](ClassificationReasonBody.md)| Classification reason | 

### Return type

[**ClassificationReasonEntry**](ClassificationReasonEntry.md)

<a name="deleteClassificationReason"></a>
# **deleteClassificationReason**
> deleteClassificationReason(classificationReasonId)

Delete a classification reason

Deletes the classification reason  **classificationReasonId**. You can't delete a classification reason that is being used to classify content. There must be at least one classification reason.

### Example
```javascript
import ClassificationReasonsApi from 'ClassificationReasonsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationreasonsApi = new ClassificationReasonsApi(this.alfrescoApi);


classificationreasonsApi.deleteClassificationReason(classificationReasonId).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **classificationReasonId** | **string**| The identifier for the classification reason | 

### Return type

null (empty response body)

<a name="listClassificationReasons"></a>
# **listClassificationReasons**
> ClassificationReasonsPaging listClassificationReasons(opts)

List all classification reasons

Gets all classification reasons.

### Example
```javascript
import ClassificationReasonsApi from 'ClassificationReasonsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationreasonsApi = new ClassificationReasonsApi(this.alfrescoApi);

let opts = { 
  'skipCount': 56 //  | The number of entities that exist in the collection before those included in this list.
  'maxItems': 56 //  | The maximum number of items to return in the list.
  'fields':  //  | A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

};

classificationreasonsApi.listClassificationReasons(opts).then((data) => {
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
 **fields** | [**string**](string.md)| A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.
 | [optional] 

### Return type

[**ClassificationReasonsPaging**](ClassificationReasonsPaging.md)

<a name="showClassificationReasonById"></a>
# **showClassificationReasonById**
> ClassificationReasonEntry showClassificationReasonById(classificationReasonId)

Get classification reason information

Gets the classification reason  **classificationReasonId**.

### Example
```javascript
import ClassificationReasonsApi from 'ClassificationReasonsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationreasonsApi = new ClassificationReasonsApi(this.alfrescoApi);


classificationreasonsApi.showClassificationReasonById(classificationReasonId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **classificationReasonId** | **string**| The identifier for the classification reason | 

### Return type

[**ClassificationReasonEntry**](ClassificationReasonEntry.md)

<a name="updateClassificationReason"></a>
# **updateClassificationReason**
> ClassificationReasonEntry updateClassificationReason(classificationReasonIdclassificationReason)

Update a classification reason

Updates the classification reason with id **classificationReasonId**. For example, you can change a classification reason code or description.

### Example
```javascript
import ClassificationReasonsApi from 'ClassificationReasonsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let classificationreasonsApi = new ClassificationReasonsApi(this.alfrescoApi);


classificationreasonsApi.updateClassificationReason(classificationReasonIdclassificationReason).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **classificationReasonId** | **string**| The identifier for the classification reason | 
 **classificationReason** | [**ClassificationReasonBody**](ClassificationReasonBody.md)| Classification reason | 

### Return type

[**ClassificationReasonEntry**](ClassificationReasonEntry.md)

