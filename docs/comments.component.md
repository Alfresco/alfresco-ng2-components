# ADF Comments Component

Displays comments from users involved in a specified task and allows an involved user to add a comment to the task.

![adf-comments](docassets/images/adf-comments.png)

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-comments
    [taskId]="YOUR_TASK_ID"
    [readOnly]="YOUR_READ_ONLY_FLAG">
</adf-comments>
```

### Properties

| Name | Type | Description |
| --- | --- | --- |
| taskId | string | The numeric ID of the task |
| readOnly | boolean | The boolean flag |

### Events

| Name | Description |
| --- | --- |
| error | Raised when an error occurs while displaying/adding a comment |
