# PredictionsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/private/hxi/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getPredictions**](PredictionsApi.md#getPredictions) | **GET** /nodes/{nodeId}/predictions | Get predictions for node.
[**reviewPrediction**](PredictionsApi.md#reviewPrediction) | **POST** /predictions/{predictionId}/review | Reject or confirm prediction.

<a name="getPredictions"></a>
# **getPredictions**
> PredictionPaging getPredictions(nodeId)

Get predictions for a node.

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | **string** | The identifier of a node. |

### Return type

[**PredictionPaging**](PredictionPaging.md)


<a name="reviewPrediction"></a>
# **reviewPrediction**
> Promise\<void\> reviewPrediction(predictionId, reviewStatus)

Confirm or reject a prediction.

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **predictionId** | **string** | The identifier of a prediction. |
 **reviewStatus** | **ReviewStatus** | Review status for prediction. Can be confirmed or rejected. |

### Return type

**Promise\<void\>**
