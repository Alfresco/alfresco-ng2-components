---
Added: v2.0.0
Status: Active
---
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

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| reportId | `number` |  |  |
| reportParamQuery | `ReportQuery` | `undefined` |  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| success | `EventEmitter<{}>` |  |
| error | `EventEmitter<{}>` |  |
