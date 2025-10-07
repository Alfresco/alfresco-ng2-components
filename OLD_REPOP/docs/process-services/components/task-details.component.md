---
Title: Task Details component
Added: v2.0.0
Status: Active
Last reviewed: 2024-05-21
---

# Task Details Component

Shows the details of the task ID passed in as input.

## Basic Usage

```html
<adf-task-details 
    [taskId]="taskId">
</adf-task-details>
```

## Class members

### Properties

| Name                   | Type                   | Default value | Description                                                                           |
|------------------------|------------------------|---------------|---------------------------------------------------------------------------------------|
| debugMode              | `boolean`              | false         | Toggles debug mode.                                                                   |
| fieldValidators        | `FormFieldValidator[]` | \[]           | Field validators for use with the form.                                               |
| readOnlyForm           | `boolean`              | false         | Toggles read-only state of the form. All form widgets render as read-only if enabled. |
| showChecklist          | `boolean`              | true          | Toggles `Checklist` feature for the Header component.                                 |
| showComments           | `boolean`              | true          | Toggles `Comments` feature for the Header component.                                  |
| showFormCompleteButton | `boolean`              | true          | Toggles rendering of the `Complete` outcome button.                                   |
| showFormRefreshButton  | `boolean`              | true          | Toggles rendering of the `Refresh` button.                                            |
| showFormSaveButton     | `boolean`              | true          | Toggles rendering of the `Save` outcome button.                                       |
| showFormTitle          | `boolean`              | false         | Toggles rendering of the form title.                                                  |
| showHeader             | `boolean`              | true          | Toggles task details Header component.                                                |
| showHeaderContent      | `boolean`              | true          | Toggles collapsed/expanded state of the Header component.                             |
| showInvolvePeople      | `boolean`              | true          | Toggles `Involve People` feature for the Header component.                            |
| showNextTask           | `boolean`              | true          | Automatically renders the next task when the current one is completed.                |
| taskId                 | `string`               |               | (**required**) The id of the task whose details we are asking for.                    |

### Events

| Name               | Type                               | Description                                                                                            |
|--------------------|------------------------------------|--------------------------------------------------------------------------------------------------------|
| assignTask         | `EventEmitter<void>`               | Emitted when a task is assigned.                                                                       |
| claimedTask        | `EventEmitter<string>`             | Emitted when a task is claimed.                                                                        |
| error              | `EventEmitter<any>`                | Emitted when an error occurs.                                                                          |
| executeOutcome     | `EventEmitter<FormOutcomeEvent>`   | Emitted when any outcome is executed. Default behaviour can be prevented via `event.preventDefault()`. |
| formCompleted      | `EventEmitter<FormModel>`          | Emitted when the form is submitted with the `Complete` outcome.                                        |
| formContentClicked | `EventEmitter<ContentLinkModel>`   | Emitted when the form field content is clicked.                                                        |
| formLoaded         | `EventEmitter<FormModel>`          | Emitted when the form is loaded or reloaded.                                                           |
| formSaved          | `EventEmitter<FormModel>`          | Emitted when the form is submitted with the `Save` or custom outcomes.                                 |
| taskCreated        | `EventEmitter<TaskRepresentation>` | Emitted when a checklist task is created.                                                              |
| taskDeleted        | `EventEmitter<string>`             | Emitted when a checklist task is deleted.                                                              |
| unClaimedTask      | `EventEmitter<string>`             | Emitted when a task is unclaimed.                                                                      |
