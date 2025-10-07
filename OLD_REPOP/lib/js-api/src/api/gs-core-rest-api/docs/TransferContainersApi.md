# TransferContainersApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getTransferContainer**](TransferContainersApi.md#getTransferContainer) | **GET** /transfer-containers/{transferContainerId} | Get a transfer container
[**listTransfers**](TransferContainersApi.md#listTransfers) | **GET** /transfer-containers/{transferContainerId}/transfers | List transfer container's children
[**updateTransferContainer**](TransferContainersApi.md#updateTransferContainer) | **PUT** /transfer-containers/{transferContainerId} | Update transfer container


<a name="getTransferContainer"></a>
# **getTransferContainer**
> TransferContainerEntry getTransferContainer(transferContainerIdopts)

Get a transfer container

Gets information for transfer container **transferContainerId**

Mandatory fields and the transfer container's aspects and properties are returned by default.

You can use the **include** parameter (include=allowableOperations) to return additional information.


### Example
```javascript
import TransferContainersApi from 'TransferContainersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let transfercontainersApi = new TransferContainersApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the transfer container. Any optional field from the response model can be requested. For example:
* allowableOperations
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

transfercontainersApi.getTransferContainer(transferContainerIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **transferContainerId** | **string**| The identifier of a transfer container. You can also use the -transfers- alias. | 
 **include** | [**string**](string.md)| Returns additional information about the transfer container. Any optional field from the response model can be requested. For example:
* allowableOperations
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

[**TransferContainerEntry**](TransferContainerEntry.md)

<a name="listTransfers"></a>
# **listTransfers**
> TransferContainerAssociationPaging listTransfers(transferContainerIdopts)

List transfer container's children

Returns a list of transfers.

Minimal information for each child is returned by default.

You can use the **include** parameter (include=allowableOperations) to return additional information.


### Example
```javascript
import TransferContainersApi from 'TransferContainersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let transfercontainersApi = new TransferContainersApi(this.alfrescoApi);

let opts = { 
  'skipCount': 56 //  | The number of entities that exist in the collection before those included in this list.
  'maxItems': 56 //  | The maximum number of items to return in the list.
  'include':  //  | Returns additional information about the transfer folders. Any optional field from the response model can be requested. For example:
* allowableOperations
* aspectNames
* properties
* transferPDFIndicator
* transferLocation
* transferAccessionIndicator

  'includeSource': true //  | Also include **source** (in addition to **entries**) with folder information on the specified parent **transferContainerId**.
  'fields':  //  | A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

};

transfercontainersApi.listTransfers(transferContainerIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **transferContainerId** | **string**| The identifier of a transfer container. You can also use the -transfers- alias. | 
 **skipCount** | **number**| The number of entities that exist in the collection before those included in this list. | [optional] 
 **maxItems** | **number**| The maximum number of items to return in the list. | [optional] 
 **include** | [**string**](string.md)| Returns additional information about the transfer folders. Any optional field from the response model can be requested. For example:
* allowableOperations
* aspectNames
* properties
* transferPDFIndicator
* transferLocation
* transferAccessionIndicator
 | [optional] 
 **includeSource** | **boolean**| Also include **source** (in addition to **entries**) with folder information on the specified parent **transferContainerId**. | [optional] 
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

[**TransferContainerAssociationPaging**](TransferContainerAssociationPaging.md)

<a name="updateTransferContainer"></a>
# **updateTransferContainer**
> TransferContainerEntry updateTransferContainer(transferContainerIdnodeBodyUpdateopts)

Update transfer container

Updates the transfer container **transferContainerId**. For example, you can rename transfer container:
JSON
{
  \"name\":\"My new name\"
}

You can also set or update description and title properties:
JSON
{
  \"properties\":
    {
       \"cm:description\": \"New Description\",
       \"cm:title\":\"New Title\"
    }
}

**Note:** Currently there is no optimistic locking for updates, so they are applied in \"last one wins\" order.


### Example
```javascript
import TransferContainersApi from 'TransferContainersApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let transfercontainersApi = new TransferContainersApi(this.alfrescoApi);

let opts = { 
  'include':  //  | Returns additional information about the transfer container. Any optional field from the response model can be requested. For example:
* allowableOperations
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

transfercontainersApi.updateTransferContainer(transferContainerIdnodeBodyUpdateopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **transferContainerId** | **string**| The identifier of a transfer container. You can also use the -transfers- alias. | 
 **nodeBodyUpdate** | [**TransferContainerBodyUpdate**](TransferContainerBodyUpdate.md)| The node information to update. | 
 **include** | [**string**](string.md)| Returns additional information about the transfer container. Any optional field from the response model can be requested. For example:
* allowableOperations
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

[**TransferContainerEntry**](TransferContainerEntry.md)

