# Analytics Generator Component

The component generates and shows the charts

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)

<!-- tocstop -->

<!-- markdown-toc end -->

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
| onSuccess | Raised when the charts are loaded |
| onError | Raised when an error occurs during the loading |