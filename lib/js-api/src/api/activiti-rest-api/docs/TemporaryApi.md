# ActivitiPublicRestApi.TemporaryApi

All URIs are relative to *https://localhost:8080/activiti-app*

Method | HTTP request | Description
------------- | ------------- | -------------
[**completeTasks**](TemporaryApi.md#completeTasks) | **GET** /api/enterprise/temporary/generate-report-data/complete-tasks | completeTasks
[**generateData**](TemporaryApi.md#generateData) | **GET** /api/enterprise/temporary/generate-report-data/start-process | generateData
[**getHeaders**](TemporaryApi.md#getHeaders) | **GET** /api/enterprise/temporary/example-headers | getHeaders
[**getOptions**](TemporaryApi.md#getOptions) | **GET** /api/enterprise/temporary/example-options | getOptions


<a name="completeTasks"></a>
# **completeTasks**
> completeTasks(userId, processDefinitionKey)

completeTasks

### Example
```javascript

var userId = 789; // Integer | userId

var processDefinitionKey = "processDefinitionKey_example"; // String | processDefinitionKey

this.alfrescoJsApi.activiti.temporaryApi.completeTasks(userId, processDefinitionKey);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Integer**| userId | 
 **processDefinitionKey** | **String**| processDefinitionKey | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="generateData"></a>
# **generateData**
> generateData(userId, processDefinitionKey)

generateData

### Example
```javascript

var userId = 789; // Integer | userId

var processDefinitionKey = "processDefinitionKey_example"; // String | processDefinitionKey

this.alfrescoJsApi.activiti.temporaryApi.generateData(userId, processDefinitionKey);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Integer**| userId | 
 **processDefinitionKey** | **String**| processDefinitionKey | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getHeaders"></a>
# **getHeaders**
> ArrayNode getHeaders()

getHeaders

### Example
```javascript

this.alfrescoJsApi.activiti.temporaryApi.getHeaders();
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ArrayNode**](ArrayNode.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getOptions"></a>
# **getOptions**
> ArrayNode getOptions()

getOptions

### Example
```javascript

this.alfrescoJsApi.activiti.temporaryApi.getOptions();
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**ArrayNode**](ArrayNode.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

