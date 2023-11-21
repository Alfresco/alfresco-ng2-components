# RecordFoldersApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createRecordFolderChild**](RecordFoldersApi.md#createRecordFolderChild) | **POST** /record-folders/{recordFolderId}/records | Create a record
[**deleteRecordFolder**](RecordFoldersApi.md#deleteRecordFolder) | **DELETE** /record-folders/{recordFolderId} | Delete a record folder
[**getRecordFolder**](RecordFoldersApi.md#getRecordFolder) | **GET** /record-folders/{recordFolderId} | Get a record folder
[**listRecordFolderChildren**](RecordFoldersApi.md#listRecordFolderChildren) | **GET** /record-folders/{recordFolderId}/records | List records
[**updateRecordFolder**](RecordFoldersApi.md#updateRecordFolder) | **PUT** /record-folders/{recordFolderId} | Update a record folder


<a name="createRecordFolderChild"></a>
# **createRecordFolderChild**
> RecordEntry createRecordFolderChild(recordFolderIdrecordBodyCreateopts)

Create a record

Create a record as a primary child of **recordFolderId**.

This endpoint supports both JSON and multipart/form-data (file upload).

**Using multipart/form-data**

Use the **filedata** field to represent the content to upload, for example, the following curl command will
create a node with the contents of test.txt in the test user's home folder.

curl -utest:test -X POST host:port/alfresco/api/-default-/public/gs/versions/1/record-folders/{recordFolderId}/records -F filedata=@test.txt

This API method also supports record creation using application/json.

You must specify at least a **name** and **nodeType**.


You can create a non-electronic record like this:
JSON
{
  \"name\":\"My Non-electronic Record\",
  \"nodeType\":\"rma:nonElectronicDocument\",
  \"properties\":
    {
      \"cm:description\":\"My Non-electronic Record Description\",
      \"cm:title\":\"My Non-electronic Record Title\",
      \"rma:box\":\"My Non-electronic Record Box\",
      \"rma:file\":\"My Non-electronic Record File\",
      \"rma:numberOfCopies\":1,
      \"rma:physicalSize\":30,
      \"rma:shelf\":\"My Non-electronic Record Shelf\",
      \"rma:storageLocation\":\"My Non-electronic Record Location\"
    }
}


You can create an empty electronic record:
JSON
{
  \"name\":\"My Electronic Record\",
  \"nodeType\":\"cm:content\"
}


Any missing aspects are applied automatically. You can set aspects explicitly, if needed, using an **aspectNames** field.

**Note:** You can create more than one child by
specifying a list of nodes in the JSON body. For example, the following JSON
body creates a record category and a record folder inside the specified **categoryId**:
JSON
[
  {
    \"name\":\"Record 1\",
    \"nodeType\":\"cm:content\"
  },
  {
    \"name\":\"Record 2\",
    \"nodeType\":\"cm:content\"
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
import RecordFoldersApi from 'RecordFoldersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let recordfoldersApi = new RecordFoldersApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the record. Any optional field from the response model can be requested. For example:
* allowableOperations
* content
* isCompleted
* path

  'fields':  //  | A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

};

recordfoldersApi.createRecordFolderChild(recordFolderIdrecordBodyCreateopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **recordFolderId** | **string**| The identifier of a record folder. | 
 **recordBodyCreate** | [**RMNodeBodyCreate**](RMNodeBodyCreate.md)| The record information to create.

This field is ignored for multipart/form-data content uploads.
 | 
 **include** | [**string**](string.md)| Returns additional information about the record. Any optional field from the response model can be requested. For example:
* allowableOperations
* content
* isCompleted
* path
 | [optional] 
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

[**RecordEntry**](RecordEntry.md)

<a name="deleteRecordFolder"></a>
# **deleteRecordFolder**
> deleteRecordFolder(recordFolderId)

Delete a record folder

Deletes record folder **recordFolderId**. Deleted file plan components cannot be recovered, they are deleted permanently.


### Example
```javascript
import RecordFoldersApi from 'RecordFoldersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let recordfoldersApi = new RecordFoldersApi(this.alfrescoApi);


recordfoldersApi.deleteRecordFolder(recordFolderId).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **recordFolderId** | **string**| The identifier of a record folder. | 

### Return type

null (empty response body)

<a name="getRecordFolder"></a>
# **getRecordFolder**
> RecordFolderEntry getRecordFolder(recordFolderIdopts)

Get a record folder

Gets information for record folder **recordFolderId**

Mandatory fields and the record folder's aspects and properties are returned by default.

You can use the **include** parameter (include=allowableOperations) to return additional information.


### Example
```javascript
import RecordFoldersApi from 'RecordFoldersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let recordfoldersApi = new RecordFoldersApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the record folders. Any optional field from the response model can be requested. For example:
* allowableOperations
* isClosed
* path

  'fields':  //  | A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

};

recordfoldersApi.getRecordFolder(recordFolderIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **recordFolderId** | **string**| The identifier of a record folder. | 
 **include** | [**string**](string.md)| Returns additional information about the record folders. Any optional field from the response model can be requested. For example:
* allowableOperations
* isClosed
* path
 | [optional] 
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

[**RecordFolderEntry**](RecordFolderEntry.md)

<a name="listRecordFolderChildren"></a>
# **listRecordFolderChildren**
> RecordFolderAssociationPaging listRecordFolderChildren(recordFolderIdopts)

List records

Gets a list of records.

Minimal information for each record is returned by default.

The list of records includes primary children and secondary children, if there are any.

You can use the **include** parameter (include=allowableOperations) to return additional information.


### Example
```javascript
import RecordFoldersApi from 'RecordFoldersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let recordfoldersApi = new RecordFoldersApi(this.alfrescoApi);

let opts = { 
  'skipCount': 56 //  | The number of entities that exist in the collection before those included in this list.
  'maxItems': 56 //  | The maximum number of items to return in the list.
  'where': where_example //  | Optionally filter the list. Here are some examples:

*   where=(nodeType='my:specialNodeType')

*   where=(nodeType='my:specialNodeType INCLUDESUBTYPES')

*   where=(isPrimary=true)

  'include':  //  | Returns additional information about the records. Any optional field from the response model can be requested. For example:
* allowableOperations
* aspectNames
* association
* content
* isCompleted
* path
* properties

  'includeSource': true //  | Also include **source** (in addition to **entries**) with record information on the parent folder – the specified parent **recordFolderId**
  'fields':  //  | A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

};

recordfoldersApi.listRecordFolderChildren(recordFolderIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **recordFolderId** | **string**| The identifier of a record folder. | 
 **skipCount** | **number**| The number of entities that exist in the collection before those included in this list. | [optional] 
 **maxItems** | **number**| The maximum number of items to return in the list. | [optional] 
 **where** | **string**| Optionally filter the list. Here are some examples:

*   where=(nodeType='my:specialNodeType')

*   where=(nodeType='my:specialNodeType INCLUDESUBTYPES')

*   where=(isPrimary=true)
 | [optional] 
 **include** | [**string**](string.md)| Returns additional information about the records. Any optional field from the response model can be requested. For example:
* allowableOperations
* aspectNames
* association
* content
* isCompleted
* path
* properties
 | [optional] 
 **includeSource** | **boolean**| Also include **source** (in addition to **entries**) with record information on the parent folder – the specified parent **recordFolderId** | [optional] 
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

[**RecordFolderAssociationPaging**](RecordFolderAssociationPaging.md)

<a name="updateRecordFolder"></a>
# **updateRecordFolder**
> RecordFolderEntry updateRecordFolder(recordFolderIdrecordFolderBodyUpdateopts)

Update a record folder

Updates record folder **recordFolderId**. For example, you can rename a record folder:
JSON
{
  \"name\":\"My new name\"
}

You can also set or update one or more properties:
JSON
{
  \"properties\":
    {
       \"rma:vitalRecordIndicator\": true,
       \"rma:reviewPeriod\":\"month|6\"
    }
}

**Note:** if you want to add or remove aspects, then you must use **GET /record-folders/{recordFolderId}** first to get the complete set of *aspectNames*.

**Note:** Currently there is no optimistic locking for updates, so they are applied in \"last one wins\" order.


### Example
```javascript
import RecordFoldersApi from 'RecordFoldersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let recordfoldersApi = new RecordFoldersApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the record folders. Any optional field from the response model can be requested. For example:
* allowableOperations
* isClosed
* path

  'fields':  //  | A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

};

recordfoldersApi.updateRecordFolder(recordFolderIdrecordFolderBodyUpdateopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **recordFolderId** | **string**| The identifier of a record folder. | 
 **recordFolderBodyUpdate** | [**FilePlanComponentBodyUpdate**](FilePlanComponentBodyUpdate.md)| The record folder information to update. | 
 **include** | [**string**](string.md)| Returns additional information about the record folders. Any optional field from the response model can be requested. For example:
* allowableOperations
* isClosed
* path
 | [optional] 
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

[**RecordFolderEntry**](RecordFolderEntry.md)

