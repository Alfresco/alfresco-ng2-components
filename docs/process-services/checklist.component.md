---
Added: v2.0.0
Status: Active
---
# Checklist Component

Shows the checklist task functionality.

## Basic Usage

```html
<adf-checklist 
    [readOnly]="false" 
    [taskId]="taskId" 
    [assignee]="taskAssignee.id" 
</adf-checklist>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| taskId | `string` |  | (required) The id of the parent task to which subtasks are attached. |
| readOnly | `boolean` | `false` | Toggle readonly state of the form. All form widgets will render as readonly if enabled. |
| assignee | `string` |  | (required) The assignee id that the subtasks are assigned to.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| checklistTaskCreated | `EventEmitter<TaskDetailsModel>` | Emitted when a new checklist task is created. |
| checklistTaskDeleted | `EventEmitter<string>` | Emitted when a checklist task is deleted. |
| error | `EventEmitter<any>` | Emitted when an error occurs. |
