---
Title: User Task Cloud Component
Added: 2025-02-05
Status: Active
Last reviewed: 2025-02-05
---

# User Task Cloud Component

Based on property taskDetails: TaskDetailsCloudModel shows a form or a screen. 

## Basic Usage

```html
<adf-cloud-user-task
    [appName]="appName"
    [displayModeConfigurations]="displayConfigurations"
    [showTitle]="false"
    [showValidationIcon]="false"
    [taskId]="taskId"
    (cancelClick)="onCancelForm()"
    (error)="onError($event)"
    (executeOutcome)="onExecuteOutcome($event)"
    (formContentClicked)="onFormContentClicked($event)"
    (formSaved)="onFormSaved()"
    (taskCompleted)="onCompleteTaskForm()"
    (taskUnclaimed)="navigateToSelectedFilter(currentFilter.id)"
    (onTaskLoaded)="onTaskDetailsLoaded($event)"
/>
```

## Class members

### Properties

| Name                      | Type                                  | Default value | Description                                                         |
| ------------------------- | ------------------------------------- | ------------- | ------------------------------------------------------------------- |
| appName                   | `string`                              | ""            | App id to fetch corresponding form and values.                      |
| isNextTaskCheckboxChecked | `boolean`                             | false         | Whether the `Open next task` checkbox is checked by default or not. |
| readOnly                  | `boolean`                             | false         | Toggle readonly state of the task.                                  |
| showCancelButton          | `boolean`                             | true          | Toggle rendering of the `Cancel` button.                            |
| showCompleteButton        | `boolean`                             | true          | Toggle rendering of the `Complete` button.                          |
| showSaveButton            | `boolean`                             | true          | Toggle rendering of the `Save` button.                      |
| showTitle                 | `boolean`                             | true          | Toggle rendering of the form title.                                 |
| showValidationIcon        | `boolean`                             | true          | Toggle rendering of the `Validation` icon.                          |
| taskId                    | `string`                              |               | Task id to fetch corresponding form and values.                     |
| displayModeConfigurations | `FormCloudDisplayModeConfiguration[]` |               | The available display configurations for the form                   |

### Events

| Name                           | Type                                  | Description                                                                                            |
| ------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| cancelClick                    | `EventEmitter<string>`                | Emitted when the cancel button is clicked.                                                             |
| error                          | `EventEmitter<any>`                   | Emitted when any error occurs.                                                                         |
| executeOutcome                 | `EventEmitter<FormOutcomeEvent>`      | Emitted when any outcome is executed. Default behaviour can be prevented via `event.preventDefault()`. |
| formContentClicked             | `EventEmitter<ContentLinkModel>`      | Emitted when form content is clicked.                                                                  |
| formSaved                      | `EventEmitter<FormModel>`             | Emitted when the form is saved.                                                                        |
| nextTaskCheckboxCheckedChanged | `EventEmitter<MatCheckboxChange>`     | Emitted when the `Open next task` checkbox was toggled.                                                |
| onTaskLoaded                   | `EventEmitter<TaskDetailsCloudModel>` | Emitted when a task is loaded.                                                                         |
| taskClaimed                    | `EventEmitter<string>`                | Emitted when the task is claimed.                                                                      |
| taskCompleted                  | `EventEmitter<string>`                | Emitted when the task is completed.                                                                    |
| taskUnclaimed                  | `EventEmitter<string>`                | Emitted when the task is unclaimed.                                                                    |

#### Enabling fullscreen display for the form of the task

Provide a `displayModeConfiguration` array object containing the fullscreen configuration. You can use the configuration provided in the [`DisplayModeService`](../../../lib/process-services-cloud/src/lib/form/services/display-mode.service.ts) as a static member `DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS`, or configure your own if you want to customise the options for the fullscreen display mode.

**MyView.component.html**

```html
<button (click)="adfCloudTaskForm.switchToDisplayMode('fullScreen')">Full screen</button>

<adf-cloud-task-form #adfCloudTaskForm
    [appName]="appName"
    [taskId]="selectedTask?.id"
    [showTitle]="false"
    [showRefreshButton]="false"
    [showValidationIcon]="false"
    [displayModeConfigurations]="displayConfigurations">
</adf-cloud-task-form>
```

**MyView.component.ts**

```ts
import { DisplayModeService } from '@alfresco/adf-process-services-cloud';

export class MyView {

    get displayConfigurations() {
        return DisplayModeService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS;
    }

}
```

When the `displayModeConfigurations` contains the configuration for the fullscreen display, in the header of the form, a button to switch to fullscreen is displayed. Keep in mind that the header of the form is visible only if any of the parameters `showTitle`, `showRefreshButton`or `showValidationIcon` is `true`, but it is also possible to switch to the fullscreen display using a button that you can place wherever you want as shown in the previous example.

## See also

-   [Form component](./form-cloud.component.md)
-   [Form field model](../../core/models/form-field.model.md)
-   [Form cloud service](../services/form-cloud.service.md)
