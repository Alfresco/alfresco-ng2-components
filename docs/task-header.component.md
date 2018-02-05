# Task Header component

Shows all the information related to a task.

![adf-task-header](docassets/images/adf-task-header.png)

## Basic Usage

```html
<adf-task-header
    [taskDetails]="taskDetails">
</adf-task-header>
```

### Properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| taskDetails | [TaskDetailsModel](task-details.model.md) |  | (**required**) Details related to the task. |
| formName | string |  | The name of the form. |

### Events

| Name | Description |
| ---- | ----------- |
| claim | Raised when the task is claimed. |
| unclaim | Raised when the task is unclaimed (requeued). |

## Details

The purpose of the component is to populate the local variable called `properties` (array of CardViewModel), with all the information that we want to display.

## Customise the property showed
By default all the property are showed :
***assignee***, ***status***, ***priority***, ***dueDate***, ***category***, ***parentName***, ***created-by***, ***created***, ***id***, ***description***, ***formName***. 

It is possible to customise the showed property via the "app.config.json".
This is how the configuration looks like:

```json

    "adf-task-header": {
      "presets": {
          "properties" : [ "assignee", "status", "priority", "parentName"]
      }
    },

```
In this way only the listed property will be showed.

## See also

-   [Task Details model](task-details.model.md)
