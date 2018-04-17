---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-16
---

# Task Details component

Shows the details of the task ID passed in as input.

## Basic Usage

```html
<adf-task-details 
    [taskId]="taskId">
</adf-task-details>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| debugMode | `boolean` | `false` | Toggles debug mode.  |
| taskId | `string` |  | (**required**) The id of the task whose details we are asking for.  |
| showNextTask | `boolean` | `true` | Automatically renders the next task when the current one is completed.  |
| showHeader | `boolean` | `true` | Toggles task details Header component.  |
| showHeaderContent | `boolean` | `true` | Toggles collapsed/expanded state of the Header component.  |
| showInvolvePeople | `boolean` | `true` | Toggles `Involve People` feature for the Header component.  |
| showComments | `boolean` | `true` | Toggles `Comments` feature for the Header component.  |
| showChecklist | `boolean` | `true` | Toggles `Checklist` feature for the Header component.  |
| showFormTitle | `boolean` | `true` | Toggles rendering of the form title.  |
| showFormCompleteButton | `boolean` | `true` | Toggles rendering of the `Complete` outcome button.  |
| showFormSaveButton | `boolean` | `true` | Toggles rendering of the `Save` outcome button.  |
| readOnlyForm | `boolean` | `false` | Toggles read-only state of the form. All form widgets render as read-only if enabled. |
| showFormRefreshButton | `boolean` | `true` | Toggles rendering of the `Refresh` button.  |
| fieldValidators | `any[]` | `[]` | Field validators for use with the form.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| formSaved | `EventEmitter<any>` | Emitted when the form is submitted with the `Save` or custom outcomes.  |
| formCompleted | `EventEmitter<any>` | Emitted when the form is submitted with the `Complete` outcome.  |
| formContentClicked | `EventEmitter<any>` | Emitted when the form field content is clicked.  |
| formLoaded | `EventEmitter<any>` | Emitted when the form is loaded or reloaded.  |
| taskCreated | `EventEmitter<TaskDetailsModel>` | Emitted when a checklist task is created.  |
| taskDeleted | `EventEmitter<string>` | Emitted when a checklist task is deleted.  |
| error | `EventEmitter<any>` | Emitted when an error occurs.  |
| executeOutcome | `EventEmitter<any>` | Emitted when any outcome is executed. Default behaviour can be prevented via `event.preventDefault()`. |
| assignTask | `EventEmitter<void>` | Emitted when a task is assigned.  |
| claimedTask | `EventEmitter<string>` | Emitted when a task is claimed.  |
| unClaimedTask | `EventEmitter<string>` | Emitted when a task is unclaimed.  |

## Details

### Custom 'empty Task Details' template

By default the Task Details component shows a simple "No Tasks"  message when there are
no details. You can change this by adding the a custom HTML template as in the following
example:

```html
<adf-task-details [taskId]="taskId">
    <no-task-details-template>
        <ng-template>
             <h1>Sorry, no tasks here</h1>
             <img src="example.jpg">
        </ng-template>
    </no-task-details-template>
</adf-task-details>    
```

Note that you can use any HTML content in the template, including other Angular components.
