---
Title: Task Form component
Added: v2.0.0
Status: Active
Last reviewed: 2020-04-21
---

# [Task Form component](../../../lib/process-services/src/lib/task-list/components/task-form/task-form.component.ts "Defined in task-form.component.ts")

Shows a [`form`](../../../lib/process-services/src/lib/task-list/models/form.model.ts) for a task.

## Basic Usage

```html
<adf-task-form 
    [taskId]="taskId">
</adf-task-form>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| fieldValidators | [`FormFieldValidator`](../../../lib/core/src/lib/form/components/widgets/core/form-field-validator.ts)`[]` | \[] | Field validators for use with the form. |
| readOnlyForm | `boolean` | false | Toggles read-only state of the form. All form widgets render as read-only if enabled. |
| showCancelButton | `boolean` | true | Toggle rendering of the `Cancel` button. |
| showFormCompleteButton | `boolean` | true | Toggles rendering of the `Complete` outcome button. |
| showFormRefreshButton | `boolean` | true | Toggles rendering of the `Refresh` button. |
| showFormSaveButton | `boolean` | true | Toggles rendering of the `Save` outcome button. |
| showFormTitle | `boolean` | false | Toggles rendering of the form title. |
| showFormValidationIcon | `boolean` | true | Toggle rendering of the validation icon next to the form title. |
| taskId | `string` |  | (**required**) The id of the task whose details we are asking for. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| cancel | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<void>` | Emitted when the "Cancel" button is clicked. |
| completed | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<void>` | Emitted when the form associated with the task is completed. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |
| executeOutcome | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormOutcomeEvent`](../../../lib/core/src/lib/form/components/widgets/core/form-outcome-event.model.ts)`>` | Emitted when any outcome is executed. Default behaviour can be prevented via `event.preventDefault()`. |
| formCompleted | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts)`>` | Emitted when the form is submitted with the `Complete` outcome. |
| formContentClicked | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ContentLinkModel`](../../../lib/core/src/lib/form/components/widgets/core/content-link.model.ts)`>` | Emitted when the form field content is clicked. |
| formError | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormFieldModel`](../../core/models/form-field.model.md)`[]>` | Emitted when the supplied form values have a validation error. |
| formLoaded | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts)`>` | Emitted when the form is loaded or reloaded. |
| formSaved | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts)`>` | Emitted when the form is submitted with the `Save` or custom outcomes. |
| showAttachForm | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<void>` | Emitted when the form associated with the form task is attached. |
| taskClaimed | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the task is claimed. |
| taskUnclaimed | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the task is unclaimed (ie, requeued).. |

## See also

-   [Form component](./form.component.md)
-   [Form field model](../../core/models/form-field.model.md)
-   [Form service](../../core/services/form.service.md)
