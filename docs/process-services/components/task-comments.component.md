---
Title: Task Comments Component
Added: v5.1.0
Status: Active
---

# [Task Comments Component](../../../lib/process-services/src/lib/task-comments/task-comments.component.ts "Defined in task-comments.component.md")

Displays comments from users involved in a specified task and allows an involved user to add a comment to a task.

![adf-comments](../../docassets/images/adf-comments.png)

## Basic Usage Task

```html
<adf-task-comments
    [taskId]="YOUR_TASK_ID"
    [readOnly]="YOUR_READ_ONLY_FLAG">
</adf-task-comments>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| taskId | `string` |  | The numeric ID of the task. |
| readOnly | `boolean` | false | Are the comments read only? |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs while displaying/adding a comment. |
