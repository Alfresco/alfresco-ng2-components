---
Added: v2.0.0
Status: Active
Last reviewed: 2018-03-21
---

# Task Header component

Shows all the information related to a task.

![adf-task-header](../docassets/images/adf-task-header.png)

## Basic Usage

```html
<adf-task-header
    [taskDetails]="taskDetails">
</adf-task-header>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| formName | `string` | `null` | The name of the form.  |
| taskDetails | `TaskDetailsModel` |  | (required) Details related to the task.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| claim | `EventEmitter<any>` | Emitted when the task is claimed. |
| unclaim | `EventEmitter<any>` | Emitted when the task is unclaimed (ie, requeued). |

## Details

The component populates an internal array of 
[CardViewModel](../core/card-view.component.md) with the information that we want to display.

By default all properties are displayed:

***assignee***, ***status***, ***priority***, ***dueDate***, ***category***, ***parentName***, ***created***, ***id***, ***description***, ***formName***. 

However, you can also choose which properties to show using a configuration in `app.config.json`:

```json

    "adf-task-header": {
      "presets": {
          "properties" : [ "assignee", "status", "priority", "parentName"]
      }
    },

```
With this configuration, only the four listed properties will be shown.

## See also

-   [Task Details model](task-details.model.md)
