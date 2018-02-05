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

The purpose of the component is to populate the local variable called `properties` (array of CardViewModel), with all the information that we want to display.

## See also

-   [Task Details model](task-details.model.md)
