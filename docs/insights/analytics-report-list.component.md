---
Added: v2.0.0
Status: Active
---
# Activiti Analytics List Component

Shows a list of all available reports

## Basic Usage

```html
<analytics-report-list
    [layoutType]="'LIST'">
</analytics-report-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| layoutType | `string` | `AnalyticsReportListComponent.LAYOUT_LIST` |  |
| appId | `number` |  |  |
| selectFirst | `boolean` | `false` |  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| reportClick | `EventEmitter<ReportParametersModel>` |  |
| success | `EventEmitter<{}>` |  |
| error | `EventEmitter<{}>` |  |
