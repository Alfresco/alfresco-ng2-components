---
Title: Diagram Component
Added: v2.0.0
Status: Active
---

# [Diagram Component](../../../lib/insights/src/lib/diagram/components/diagram.component.ts "Defined in diagram.component.ts")

Displays process diagrams.

## Basic Usage

This component shows the diagram of a process.

```html
<adf-diagram 
    [processDefinitionId]="processDefinitionId">
</adf-diagram>
```

The below component shows the diagram of a running process instance with the activities highlighted according to their state (Active/Completed/Pending).

```html
<adf-diagram 
    [processInstanceId]="processInstanceId">
</adf-diagram>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| height | `number` | 500 | height. |
| metricColor | `any` |  | metricColor. |
| metricPercentages | `any` |  | metricPercentages. |
| metricType | `string` | "" | metricType. |
| processDefinitionId | `any` |  | processDefinitionId. |
| processInstanceId | `any` |  | processInstanceId. |
| width | `number` | 1000 | width. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | error. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | success. |
