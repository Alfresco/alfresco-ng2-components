# DefaultClassificationValuesApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**calculateDefaultDeclassificationDate**](DefaultClassificationValuesApi.md#calculateDefaultDeclassificationDate) | **POST** /default-classification-values/{nodeId}/calculate-declassification-date | Calculate the default declassification date


<a name="calculateDefaultDeclassificationDate"></a>
# **calculateDefaultDeclassificationDate**
> DeclassificationDate calculateDefaultDeclassificationDate(nodeId)

Calculate the default declassification date

Calculates the default declassification date for **nodeId** based on the properties of the node and the current declassification time frame.

### Example
```javascript
import DefaultClassificationValuesApi from 'DefaultClassificationValuesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let defaultclassificationvaluesApi = new DefaultClassificationValuesApi(this.alfrescoApi);


defaultclassificationvaluesApi.calculateDefaultDeclassificationDate(nodeId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | **string**| The identifier of a node. | 

### Return type

[**DeclassificationDate**](DeclassificationDate.md)

