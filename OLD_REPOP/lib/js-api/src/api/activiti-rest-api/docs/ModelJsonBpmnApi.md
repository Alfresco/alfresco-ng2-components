# ActivitiPublicRestApi.ModelJsonBpmnApi

All URIs are relative to *https://localhost:8080/activiti-app*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getHistoricEditorDisplayJsonClient**](ModelJsonBpmnApi.md#getHistoricEditorDisplayJsonClient) | **GET** /app/rest/process-instances/{processModelId}/history/{processModelHistoryId}/model-json | Export a previous process definition model to JSON
[**getEditorDisplayJsonClient**](ModelJsonBpmnApi.md#getEditorDisplayJsonClient) | **GET** app/rest/models/{processModelId}/model-json | Export a process definition model to JSON
[**getModelJSON**](ModelJsonBpmnApi.md#getModelJSON) | **GET** /app/rest/process-definitions/{processDefinitionId}/model-json | Export a process definition model to JSON
[**getModelJSONForProcessDefinition**](ModelJsonBpmnApi.md#getModelJSONForProcessDefinition) | **GET** /app/rest/process-instances/{processInstanceId}/model-json | Export a process instances model to JSON

<a name="getEditorDisplayJsonClient"></a>
# **getEditorDisplayJsonClient**
> getEditorDisplayJsonClient(processModelId, processModelHistoryId)

Export a previous process definition model to JSON

### Example
```javascript

var processModelId = 789; // Integer | processModelId

var processModelHistoryId = 789; // Integer | processModelHistoryId

this.alfrescoJsApi.activiti.modelJsonBpmnApi.getHistoricEditorDisplayJsonClient(processModelId, processModelHistoryId);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processModelId** | **Integer**| processModelId | 
 **processModelHistoryId** | **Integer**| processModelHistoryId | 

### Return type

JSON definition model 

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getEditorDisplayJsonClient"></a>
# **getEditorDisplayJsonClient**
> getEditorDisplayJsonClient(processModelId)

Export a process instances model to a BPMN 2.0 xml file

### Example
```javascript

var processModelId = 789; // Integer | processModelId

this.alfrescoJsApi.activiti.modelJsonBpmnApi.getEditorDisplayJsonClient(processModelId);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processModelId** | **Integer**| processModelId | 

### Return type

JSON definition model 

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


<a name="getModelJSON"></a>
# **getModelJSON**
> getModelJSON(processDefinitionId)

Export a process definition model to a BPMN 2.0 xml file

### Example
```javascript

var processDefinitionId = 789; // Stringg | processDefinitionId

this.alfrescoJsApi.activiti.modelJsonBpmnApi.getModelJSON(processDefinitionId);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processDefinitionId** | **String**| processDefinitionId |

### Return type

JSON definition model

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


<a name="getModelJSONForProcessDefinition"></a>
# **getModelJSONForProcessDefinition**
> getModelJSONForProcessDefinition(processInstanceId)

Export a process definition model to a BPMN 2.0 xml file

### Example
```javascript

var processInstanceId = 789; // String | processInstanceId

this.alfrescoJsApi.activiti.modelJsonBpmnApi.getModelJSONForProcessDefinition(processInstanceId);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processInstanceId** | **String**| processInstanceId |

### Return type

JSON definition model

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json
