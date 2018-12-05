---
Title: Analytics Generator Component
Added: v2.0.0
Status: Active
---

# [Analytics Generator Component](../../lib/insights/analytics-process/components/analytics-generator.component.ts "Defined in analytics-generator.component.ts")

Generates and shows charts

## Basic Usage

```html
<adf-analytics-generator 
    [reportId]="reportId" 
    [reportParamQuery]="reportParamQuery">
</adf-analytics>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| reportId | `number` |  |  |
| reportParamQuery | [`ReportQuery`](../../lib/insights/diagram/models/report/reportQuery.model.ts) | undefined |  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Object>` |  |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Object>` |  |
