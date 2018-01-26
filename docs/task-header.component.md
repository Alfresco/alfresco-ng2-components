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

## See also

-   [Task Details model](task-details.model.md)
