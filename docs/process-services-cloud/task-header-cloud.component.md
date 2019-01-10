# [Task Header component](../../lib/process-services-cloud/task-header/components/task-header-cloud.component.ts "Defined in task-header.component.ts")

Shows all the information related to a task.

![adf-task-header](../docassets/images/adf-task-header.png)

## Basic Usage

```html
<adf-cloud-task-header
    [appName]="applicationName"
    [taskId]="taskId">
</adf-cloud-task-header>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| formName | `string` | null | The name of the form. |
| appName | `string` |  | (required) The name of the application. |
| taskId | `string` |  | (required) The id of the Task. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| claim | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task is claimed. |
| unclaim | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task is unclaimed (ie, requeued). |

## Details

The component populates an internal array of 
[CardViewModel](../core/card-view.component.md) with the information that we want to display.

By default all properties are displayed:

**_assignee_**, **_status_**, **_priority_**, **_dueDate_**, **_category_**, **_parentName_**, **_created_**, **_id_**, **_description_**, **_formName_**. 

However, you can also choose which properties to show using a configuration in `app.config.json`:

```json
    "adf-cloud-task-header": {
        "presets": {
            "properties" : [ "assignee", "status", "priority", "parentName"]
        }
    }
```

With this configuration, only the four listed properties will be shown.
