---
Title: APS Analytics List Component
Added: v2.0.0
Status: Active
---

# [APS Analytics List Component](../../../lib/insights/src/lib/analytics-process/components/analytics-report-list.component.ts "Defined in analytics-report-list.component.ts")

Shows a list of all available reports

## Basic Usage

```html
<adf-analytics-report-list
    [layoutType]="'LIST'">
</adf-analytics-report-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appId | `number` |  | appId ID of the target app. |
| layoutType | `string` | LAYOUT_LIST | layout Type LIST or GRID. |
| selectFirst | `boolean` | false | selectFirst. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | error. |
| reportClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ReportParametersModel`](../../../lib/insights/src/lib/diagram/models/report/report-parameters.model.ts)`>` | report Click. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | success. |
