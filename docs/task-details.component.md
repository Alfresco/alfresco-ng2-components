# Activiti Task Details component

Shows the details of the task id passed in input

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)
- [Details](#details)
  * [Custom 'empty Activiti Task Details' template](#custom-empty-activiti-task-details-template)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-task-details 
    [taskId]="taskId">
</adf-task-details>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| taskId | string | | (**required**) The id of the task details that we are asking for. |
| showNextTask | boolean | true | Automatically render the next one, when the task is completed. |
| showFormTitle | boolean | true | Toggle rendering of the form title. |
| readOnlyForm | boolean | false | Toggle readonly state of the form. Enforces all form widgets render readonly if enabled. |
| showFormRefreshButton | boolean | true | Toggle rendering of the `Refresh` button. |
| showFormSaveButton | boolean | true| Toggle rendering of the `Save` outcome button. |
| showFormCompleteButton | boolean | true | Toggle rendering of the Form `Complete` outcome button |
| peopleIconImageUrl | string | | Define a custom people icon image |
| showHeader | boolean | true | Toggle task details Header component |
| showInvolvePeople | boolean | true | Toggle `Involve People` feature for Header component |
| showComments | boolean | true | Toggle `Comments` feature for Header component |
| showChecklist | boolean | true | Toggle `Checklist` feature for Header component |
| fieldValidators | FormFieldValidator[] | [] | Field validators for use with the form. |

### Events

| Name | Description |
| --- | --- |
| formLoaded | Raised when form is loaded or reloaded. |
| formSaved | Raised when form is submitted with `Save` or custom outcomes.  |
| formCompleted | Raised when form is submitted with `Complete` outcome.  |
| taskCreated | Raised when a checklist task is created.  |
| executeOutcome | Raised when any outcome is executed, default behaviour can be prevented via `event.preventDefault()` |
| error | Raised at any error |

## Details

### Custom 'empty Activiti Task Details' template

By default the Activiti Task Details provides the following message for the empty task details:

```html
No Tasks
```

This can be changed by adding the following custom html template:

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

Note that can put any HTML content as part of the template, including other Angular components.
