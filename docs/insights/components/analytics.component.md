---
Title: APS Analytics Component
Added: v2.0.0
Status: Active
---

# [APS Analytics Component](../../../lib/insights/src/lib/analytics-process/components/analytics.component.ts "Defined in analytics.component.ts")

Shows the charts related to the reportId passed as input

![Analytics-without-parameters](../../docassets/images/analytics-without-parameters.png)

## Basic Usage

```html
<adf-analytics 
    [appId]="1001" 
    [reportId]="2006">
</adf-analytics>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appId | `number` |  |  |
| hideParameters | `boolean` | false |  |
| reportId | `number` |  |  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| editReport | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<>` |  |
| reportDeleted | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<>` |  |
| reportSaved | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<>` |  |
