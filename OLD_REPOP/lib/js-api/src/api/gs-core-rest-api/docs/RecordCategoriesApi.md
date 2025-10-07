# RecordCategoriesApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createRecordCategoryChild**](RecordCategoriesApi.md#createRecordCategoryChild) | **POST** /record-categories/{recordCategoryId}/children | Create a record category or a record folder
[**deleteRecordCategory**](RecordCategoriesApi.md#deleteRecordCategory) | **DELETE** /record-categories/{recordCategoryId} | Delete a record category
[**getRecordCategory**](RecordCategoriesApi.md#getRecordCategory) | **GET** /record-categories/{recordCategoryId} | Get a record category
[**listRecordCategoryChildren**](RecordCategoriesApi.md#listRecordCategoryChildren) | **GET** /record-categories/{recordCategoryId}/children | List record category's children
[**updateRecordCategory**](RecordCategoriesApi.md#updateRecordCategory) | **PUT** /record-categories/{recordCategoryId} | Update a record category


<a name="createRecordCategoryChild"></a>
# **createRecordCategoryChild**
> RecordCategoryChildEntry createRecordCategoryChild(recordCategoryIdnodeBodyCreateopts)

Create a record category or a record folder

Create a record category or a record folder as a primary child of **recordCategoryId**.

You can set the **autoRename** boolean field to automatically resolve name clashes. If there is a name clash, then
the API method tries to create
a unique name using an integer suffix.

This API method also supports record category or record folder creation using application/json.

You must specify at least a **name** and **nodeType**.

You can create a category like this:
JSON
{
  \"name\":\"My Record Category\",
  \"nodeType\":\"rma:recordCategory\"
}


You can create a record folder like this:
JSON
{
  \"name\":\"My Record Folder\",
  \"nodeType\":\"rma:recordFolder\"
}


You can create a record folder inside a container hierarchy (applies to record categories as well):
JSON
{
  \"name\":\"My Fileplan Component\",
  \"nodeType\":\"rma:recordFolder\",
  \"relativePath\":\"X/Y/Z\"
}

The **relativePath** specifies the container structure to create relative to the node (record category or record folder). Containers in the
**relativePath** that do not exist are created before the node is created. The container type is decided considering
the type of the parent container and the type of the node to be created.

You can set properties when creating a record category (applies to record folders as well):
JSON
{
  \"name\":\"My Record Category\",
  \"nodeType\":\"rma:recordCategory\",
  \"properties\":
  {
    \"rma:vitalRecordIndicator\":\"true\",
    \"rma:reviewPeriod\":\"month|1\"
  }
}


Any missing aspects are applied automatically. You can set aspects explicitly, if needed, using an **aspectNames** field.

**Note:** You can create more than one child by
specifying a list of nodes in the JSON body. For example, the following JSON
body creates a record category and a record folder inside the specified **categoryId**:
JSON
[
  {
    \"name\":\"My Record Category\",
    \"nodeType\":\"rma:recordCategory\"
  },
  {
    \"name\":\"My Record Folder\",
    \"nodeType\":\"rma:recordFolder\"
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
import RecordCategoriesApi from 'RecordCategoriesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let recordcategoriesApi = new RecordCategoriesApi(this.alfrescoApi);

let opts = { 
  'autoRename': true //  | If true, then  a name clash will cause an attempt to auto rename by finding a unique name using an integer suffix.

  'include':  //  | Returns additional information about the record category. Any optional field from the response model can be requested. For example:
* allowableOperations
* hasRetentionSchedule
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

recordcategoriesApi.createRecordCategoryChild(recordCategoryIdnodeBodyCreateopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **recordCategoryId** | **string**| The identifier of a record category. | 
 **nodeBodyCreate** | [**RMNodeBodyCreateWithRelativePath**](RMNodeBodyCreateWithRelativePath.md)| The node information to create.
 | 
 **autoRename** | **boolean**| If true, then  a name clash will cause an attempt to auto rename by finding a unique name using an integer suffix.
 | [optional] 
 **include** | [**string**](string.md)| Returns additional information about the record category. Any optional field from the response model can be requested. For example:
* allowableOperations
* hasRetentionSchedule
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

[**RecordCategoryChildEntry**](RecordCategoryChildEntry.md)

<a name="deleteRecordCategory"></a>
# **deleteRecordCategory**
> deleteRecordCategory(recordCategoryId)

Delete a record category

Deletes record category **recordCategoryId**.


### Example
```javascript
import RecordCategoriesApi from 'RecordCategoriesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let recordcategoriesApi = new RecordCategoriesApi(this.alfrescoApi);


recordcategoriesApi.deleteRecordCategory(recordCategoryId).then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **recordCategoryId** | **string**| The identifier of a record category. | 

### Return type

null (empty response body)

<a name="getRecordCategory"></a>
# **getRecordCategory**
> RecordCategoryEntry getRecordCategory(recordCategoryIdopts)

Get a record category

Gets information for record category **recordCategoryId**

Mandatory fields and the record category's aspects and properties are returned by default.

You can use the **include** parameter (include=allowableOperations) to return additional information.


### Example
```javascript
import RecordCategoriesApi from 'RecordCategoriesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let recordcategoriesApi = new RecordCategoriesApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the record category. Any optional field from the response model can be requested. For example:
* allowableOperations
* hasRetentionSchedule
* path

  'relativePath': relativePath_example //  | Return information on children in the record category resolved by this path. The path is relative to **recordCategoryId**.

  'fields':  //  | A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

};

recordcategoriesApi.getRecordCategory(recordCategoryIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **recordCategoryId** | **string**| The identifier of a record category. | 
 **include** | [**string**](string.md)| Returns additional information about the record category. Any optional field from the response model can be requested. For example:
* allowableOperations
* hasRetentionSchedule
* path
 | [optional] 
 **relativePath** | **string**| Return information on children in the record category resolved by this path. The path is relative to **recordCategoryId**.
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

[**RecordCategoryEntry**](RecordCategoryEntry.md)

<a name="listRecordCategoryChildren"></a>
# **listRecordCategoryChildren**
> RecordCategoryChildPaging listRecordCategoryChildren(recordCategoryIdopts)

List record category's children

Returns a list of record categories and/or record folders.

Minimal information for each child is returned by default.

You can use the **include** parameter (include=allowableOperations) to return additional information.

The list of child nodes includes primary children and secondary children, if there are any.


### Example
```javascript
import RecordCategoriesApi from 'RecordCategoriesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let recordcategoriesApi = new RecordCategoriesApi(this.alfrescoApi);

let opts = { 
  'skipCount': 56 //  | The number of entities that exist in the collection before those included in this list.
  'maxItems': 56 //  | The maximum number of items to return in the list.
  'where': where_example //  | Optionally filter the list. Here are some examples:

*   where=(nodeType='rma:recordFolder')

*   where=(nodeType='rma:recordCategory')

*   where=(isRecordFolder=true AND isClosed=false)

  'include':  //  | Returns additional information about the record category child. Any optional field from the response model can be requested. For example:
* allowableOperations
* aspectNames
* hasRetentionSchedule
* isClosed
* isRecordCategory
* isRecordFolder
* path
* properties

  'relativePath': relativePath_example //  | Return information on children in the record category resolved by this path. The path is relative to **recordCategoryId**.

  'includeSource': true //  | Also include **source** (in addition to **entries**) with folder information on the parent node – either the specified parent **recordCategoryId**, or as resolved by **relativePath**.
  'fields':  //  | A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

};

recordcategoriesApi.listRecordCategoryChildren(recordCategoryIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **recordCategoryId** | **string**| The identifier of a record category. | 
 **skipCount** | **number**| The number of entities that exist in the collection before those included in this list. | [optional] 
 **maxItems** | **number**| The maximum number of items to return in the list. | [optional] 
 **where** | **string**| Optionally filter the list. Here are some examples:

*   where=(nodeType='rma:recordFolder')

*   where=(nodeType='rma:recordCategory')

*   where=(isRecordFolder=true AND isClosed=false)
 | [optional] 
 **include** | [**string**](string.md)| Returns additional information about the record category child. Any optional field from the response model can be requested. For example:
* allowableOperations
* aspectNames
* hasRetentionSchedule
* isClosed
* isRecordCategory
* isRecordFolder
* path
* properties
 | [optional] 
 **relativePath** | **string**| Return information on children in the record category resolved by this path. The path is relative to **recordCategoryId**.
 | [optional] 
 **includeSource** | **boolean**| Also include **source** (in addition to **entries**) with folder information on the parent node – either the specified parent **recordCategoryId**, or as resolved by **relativePath**. | [optional] 
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

[**RecordCategoryChildPaging**](RecordCategoryChildPaging.md)

<a name="updateRecordCategory"></a>
# **updateRecordCategory**
> RecordCategoryEntry updateRecordCategory(recordCategoryIdrecordCategoryBodyUpdateopts)

Update a record category

Updates record category **recordCategoryId**. For example, you can rename a record category:
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

**Note:** If you want to add or remove aspects, then you must use **GET /record-categories/{recordCategoryId}** first to get the complete set of *aspectNames*.

**Note:** Currently there is no optimistic locking for updates, so they are applied in \"last one wins\" order.


### Example
```javascript
import RecordCategoriesApi from 'RecordCategoriesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let recordcategoriesApi = new RecordCategoriesApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the record category. Any optional field from the response model can be requested. For example:
* allowableOperations
* hasRetentionSchedule
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

recordcategoriesApi.updateRecordCategory(recordCategoryIdrecordCategoryBodyUpdateopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **recordCategoryId** | **string**| The identifier of a record category. | 
 **recordCategoryBodyUpdate** | [**FilePlanComponentBodyUpdate**](FilePlanComponentBodyUpdate.md)| The record category information to update. | 
 **include** | [**string**](string.md)| Returns additional information about the record category. Any optional field from the response model can be requested. For example:
* allowableOperations
* hasRetentionSchedule
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

[**RecordCategoryEntry**](RecordCategoryEntry.md)

