---
Title: Diagram Component
Added: v2.0.0
Status: Active
---

# [Diagram Component](../../lib/insights/diagram/components/diagram.component.ts "Defined in diagram.component.ts")

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
| height | `number` | 500 |  |
| metricColor | `any` |  |  |
| metricPercentages | `any` |  |  |
| metricType | `string` | "" |  |
| processDefinitionId | `any` |  |  |
| processInstanceId | `any` |  |  |
| width | `number` | 1000 |  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Object>` |  |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Object>` |  |
