# ActivitiPublicRestApi.ReportApi

All URIs are relative to *https://localhost:8080/activiti-app*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createDefaultReports**](ReportApi.md#createDefaultReports) | **POST** /app/rest/reporting/default-reports | Create the default reports
[**getReportList**](ReportApi.md#getReportList) | **GET** /app/rest/reporting/reports |  Retrieve the available report list.
[**getReportParams**](ReportApi.md#getReportParams) | **GET** /app/rest/reporting/report-params/{reportId} |  Retrieve the parameters referring to the reportId.
[**getProcessDefinitions**](ReportApi.md#getProcessDefinitions) | **GET** /app/rest/reporting/process-definitions |  Retrieve the process definition list for all the apps.
[**getTasksByProcessDefinitionId**](ReportApi.md#getTasksByProcessDefinitionId) | **GET** /app/rest/reporting/report-params/{reportId}/tasks | Retrieves all tasks that refer to the processDefinitionId
[**getReportsByParams**](ReportApi.md#getReportsByParams) | **GET** /app/rest/reporting/report-params/{reportId} | Generate the reports
[**updateReport**](ReportApi.md#updateReport) | **PUT** /app/rest/reporting/reports/{reportId} | Update the report
[**exportToCsv**](ReportApi.md#exportToCsv) | **POST** /app/rest/reporting/reports/{reportId}/export-to-csv | Export a report as csv
[**saveReport**](ReportApi.md#saveReport) | **POST** /app/rest/reporting/reports/{reportId} | Save the report
[**deleteReport**](ReportApi.md#deleteReport) | **DELETE** /app/rest/reporting/reports/{reportId} | Delete a report

<a name="createDefaultReports"></a>
# **createDefaultReports**
> createDefaultReports()

Create the default reports

### Example
```javascript

this.alfrescoJsApi.activiti.reportApi.createDefaultReports();
```

### Parameters
No parameters required.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getReportList"></a>
# **getReportList**
> [ReportParametersDefinition] getReportList()

Retrieve the available report list.

### Example
```javascript

this.alfrescoJsApi.activiti.reportApi.getReportList();
```

### Parameters
No parameters required.

### Return type

[**[ReportParametersDefinition]**](ReportParametersDefinition.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="getReportParams"></a>
# **getReportParams**
> ReportParametersDefinition getReportParams(reportId)

Retrieve the parameters referring to the reportId.

### Example
```javascript

var reportId = "1"; // String | reportId

this.alfrescoJsApi.activiti.reportApi.getReportParams(reportId);
```

### Parameters
Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **reportId** | **String**| reportId |

### Return type

[**ReportParametersDefinition**](ReportParametersDefinition.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getProcessDefinitions"></a>
# **getProcessDefinitions**
> ParameterValueRepresentation getProcessDefinitions()

Retrieve the process definition list for all the apps.

### Example
```javascript

this.alfrescoJsApi.activiti.reportApi.getProcessDefinitions();
```

### Parameters
No parameters required.

### Return type

[**ParameterValueRepresentation**](ParameterValueRepresentation.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getTasksByProcessDefinitionId"></a>
# **getTasksByProcessDefinitionId**
> [&#39;String&#39;] getTasksByProcessDefinitionId(reportId, processDefinitionId)

Retrieves all tasks that refer to the processDefinitionId

### Example
```javascript

var reportId = "1"; // String | reportId
var processDefinitionId = "1"; // String | processDefinitionId

this.alfrescoJsApi.activiti.reportApi.getTasksByProcessDefinitionId(reportId, processDefinitionId);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **reportId** | **String**| reportId |
 **processDefinitionId** | **String**| process definition id |

### Return type

**[&#39;String&#39;]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getReportsByParams"></a>
# **getReportsByParams**
> ReportCharts getReportsByParams(reportId, paramsQuery)

Generate the reports based on the input parameters

### Example
```javascript

var reportId = "1"; // String | reportId
var paramsQuery = {status: 'ALL'}; // Object | paramsQuery

this.alfrescoJsApi.activiti.reportApi.getReportsByParams(reportId, paramsQuery);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **reportId** | **String**| reportId |
 **paramsQuery** | **Object**| Query parameters |

### Return type

[**ReportCharts**](ReportCharts.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="updateReport"></a>
# **updateReport**
> updateReport(reportId, name)

Update the report details

### Example
```javascript

var reportId = "1"; // String | reportId
var name = "new Fake name"; // String | name

this.alfrescoJsApi.activiti.reportApi.updateReport(reportId, name);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **reportId** | **String**| reportId |
 **name** | **String**| The report name |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="exportToCsv"></a>
# **exportToCsv**
> exportToCsv(reportId, queryParams)

Export a report as csv

### Example
```javascript

var reportId = "1"; // String | reportId
var queryParams = {
            'processDefinitionId': 'TEST:99:999',
            'dateRange': {
                'startDate': '2017-01-01T00:00:00.000Z',
                'endDate': '2017-01-24T23:59:59.999Z',
                'rangeId': 'currentYear'
            },
            'slowProcessInstanceInteger': 10,
            'status': 'All',
            '__reportName': 'FAKE_REPORT_NAME'
        };

this.alfrescoJsApi.activiti.reportApi.exportToCsv(reportId, queryParams);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **reportId** | **String**| reportId |
 **queryParams** | **Object**| Query parameters |

### Return type

**[&#39;String&#39;]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="saveReport"></a>
# **saveReport**
> saveReport(reportId, queryParams)

Save a report

### Example
```javascript

var reportId = "1"; // String | reportId
var queryParams = {
            'processDefinitionId': 'TEST:99:999',
            'dateRange': {
                'startDate': '2017-01-01T00:00:00.000Z',
                'endDate': '2017-01-24T23:59:59.999Z',
                'rangeId': 'currentYear'
            },
            'slowProcessInstanceInteger': 10,
            'status': 'All',
            '__reportName': 'FAKE_REPORT_NAME'
        };

this.alfrescoJsApi.activiti.reportApi.saveReport(reportId, queryParams);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **reportId** | **String**| reportId |
 **queryParams** | **Object**| Query parameters |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteReport"></a>
# **deleteReport**
> deleteReport(reportId)

Delete a report

### Example
```javascript

var reportId = "1"; // String | reportId

this.alfrescoJsApi.activiti.reportApi.deleteReport(reportId);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **reportId** | **String**| reportId |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json
