# Activiti Checklist Component

Shows the checklist task functionality.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-checklist 
    [readOnly]="false" 
    [taskId]="taskId" 
    [assignee]="taskAssignee.id" 
</adf-checklist>
```

### Properties

| Name | Type | Description |
| --- | --- | --- |
| taskId | string | (**required**) The id of the parent task which sub tasks are attached on. |
| readOnlyForm | boolean | Toggle readonly state of the form. Enforces all form widgets render readonly if enabled. |
| assignee | string | (**required**) The assignee id where the subtasks are assigned to. |
