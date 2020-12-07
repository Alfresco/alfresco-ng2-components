---
Title: Comments Component
Added: v2.0.0
Status: Active
---

# [Comments Component](../../../lib/core/comments/comments.component.ts "Defined in comments.component.ts")

Displays comments from users involved in a specified task or content and allows an involved user to add a comment to a task or a content.

![adf-comments](../../docassets/images/adf-comments.png)

## Basic Usage Task

```html
<adf-comments
    [taskId]="YOUR_TASK_ID"
    [readOnly]="YOUR_READ_ONLY_FLAG">
</adf-comments>
```

## Basic Usage Content

```html
<adf-comments
    [nodeId]="YOUR_NODE_ID"
    [readOnly]="YOUR_READ_ONLY_FLAG">
</adf-comments>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| nodeId | `string` |  | The numeric ID of the node. |
| readOnly | `boolean` | false | Are the comments read only? |
| taskId | `string` |  | The numeric ID of the task. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs while displaying/adding a comment. |
