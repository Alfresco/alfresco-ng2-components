---
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-13
---

# Start Task Component

Creates/Starts a new task for the specified app

![adf-start-task](../docassets/images/adf-start-task.png)

## Basic Usage

```html
<adf-start-task
    [appId]="YOUR_APP_ID">
</adf-start-task>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appId | `number` |  | (required) The id of the app. |
| taskModelForm | `FormGroup` |  | FormGroup for the new task |
| taskDetailsModel | `TaskDetailsModel` |  | Model for the task |
| forms$ | `Observable<Form[]>;` |  | Forms for the dropdown list |
| maxTaskNameLength | `number` | 100 | Maximum mask name length |
| defaultTaskName | `string` |  | Default Task Name |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| cancel | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<void>` | Emitted when the cancel button is clicked by the user. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the task is successfully created. |
