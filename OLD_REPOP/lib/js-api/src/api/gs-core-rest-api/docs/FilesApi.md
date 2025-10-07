# FilesApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**declareRecord**](FilesApi.md#declareRecord) | **POST** /files/{fileId}/declare | Declare as record


<a name="declareRecord"></a>
# **declareRecord**
> RecordEntry declareRecord(fileIdopts)

Declare as record

Declares the file **fileId** in the unfiled records container. The original file is moved to the Records Management site and a secondary parent association is created in the file's original site.

### Example
```javascript
import FilesApi from 'FilesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let filesApi = new FilesApi(this.alfrescoApi);

let opts = { 
  'hideRecord': true //  | Flag to indicate whether the record should be hidden from the current parent folder.
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

filesApi.declareRecord(fileIdopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fileId** | **string**| The identifier of a non-record file. | 
 **hideRecord** | **boolean**| Flag to indicate whether the record should be hidden from the current parent folder. | [optional] [default to false]
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

