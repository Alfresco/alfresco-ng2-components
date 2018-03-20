---
Added: v2.0.0
Status: Active
---
# Task Standalone component

This component can be used when there is no form attached to a task.

## Contents

-   [Basic Usage](#basic-usage)

    -   [Properties](#properties)
    -   [Events](#events)

## Basic Usage

```html
<adf-task-standalone
    [taskName]= "taskname">
</adf-task-standalone>
```
### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| taskName | `string` |  | Name of the task  |
| isCompleted | `boolean` | `false` | If true then Task completed message is shown and `Complete` and `Cancel` buttons are hidden |
| hasCompletePermission | `boolean` | `true` | Toggle rendering of the `Complete` button.  |
| hideCancelButton | `boolean` | `true` | Toggle rendering of the `Cancel` button.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| cancel | `EventEmitter<void>` | Emitted when the `Cancel` button is clicked.  |
| complete | `EventEmitter<void>` | Emitted when the form associated with the task is completed.  |

