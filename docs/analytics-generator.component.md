# Analytics Generator Component

Generates and shows charts

## Basic Usage

```html
<adf-analytics-generator 
    [reportId]="reportId" 
    [reportParamQuery]="reportParamQuery">
</adf-analytics>
```

### Properties

| Name | Type | Description |
| --- | --- | -- |
| reportId | string | The report id |
| reportParamQuery | ReportQuery | The object contains all the parameters that the report needs |

### Events

| Name | Description |
| --- | --- |
| success | Raised when the charts are loaded |
| error | Raised when an error occurs during the loading |

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also


<!-- seealso end -->