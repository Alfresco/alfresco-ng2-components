---
Added: v2.0.0
Status: Active
---
# Diagram Component

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

| Name | Type | Description |
| --- | --- | -- |
| metricPercentages | any | The array that contains the percentage of time for each element |
| processInstanceId | any | |
| metricColor | any | The array that contains the color for each element |
| metricType | any | The string that specifies the metric type |
| width | number | |
| height | number | |

### Events

| Name | Description |
| --- | --- |
| success | Raised when the diagrams elements are loaded |
| error | Raised when an error occurs during loading |