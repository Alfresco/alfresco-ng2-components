---
Title: Form cloud component
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-17
---

# Task Form Component

Shows a form for a task.

Shows Cancel, Save, Complete, Claim and Release buttons. Cancel, Save and Complete buttons are always present. Claim and Release buttons are present according to user's permissions and task's condition (Claimed, Completed etc).

![Task form cloud component screenshot](../../docassets/images/adf-task-form-cloud-1.png)

The following example shows the buttons that are visible when the task's condition is released and the user has the admin permissions

![Task form cloud component screenshot](../../docassets/images/adf-task-form-cloud-3.png)

Save and Complete buttons get disabled when at least one of the form's inputs are invalid.
![Task form cloud component screenshot](../../docassets/images/adf-task-form-cloud-2.png)

## Basic Usage

```html
<adf-cloud-task-form 
    [appName]="appName"
    [taskId]="taskId">
</adf-cloud-task-form>
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
| showNextTaskCheckbox      | `boolean`                             | false         | Toggle rendering of the `Open next task` checkbox.                  |
| showRefreshButton         | `boolean`                             | false         | Toggle rendering of the `Refresh` button.                           |
| showTitle                 | `boolean`                             | true          | Toggle rendering of the form title.                                 |
| showValidationIcon        | `boolean`                             | true          | Toggle rendering of the `Validation` icon.                          |
| taskId                    | `string`                              |               | Task id to fetch corresponding form and values.                     |
| displayModeConfigurations | `FormCloudDisplayModeConfiguration[]` |               | The available display configurations for the form                   |

### Events

| Name                           | Type                                              | Description                                                                                            |
| ------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| cancelClick                    | `EventEmitter<string>`                            | Emitted when the cancel button is clicked.                                                             |
| error                          | `EventEmitter<any>`                               | Emitted when any error occurs.                                                                         |
| executeOutcome                 | `EventEmitter<FormOutcomeEvent>`                  | Emitted when any outcome is executed. Default behaviour can be prevented via `event.preventDefault()`. |
| formCompleted                  | `EventEmitter<FormModel>`                         | Emitted when the form is submitted with the `Complete` outcome.                                        |
| formContentClicked             | `EventEmitter<ContentLinkModel>`                  | Emitted when form content is clicked.                                                                  |
| formSaved                      | `EventEmitter<FormModel>`                         | Emitted when the form is saved.                                                                        |
| nextTaskCheckboxCheckedChanged | `EventEmitter<MatCheckboxChange>`                 | Emitted when the `Open next task` checkbox was toggled.                                                |
| onTaskLoaded                   | `EventEmitter<TaskDetailsCloudModel>`             | Emitted when a task is loaded.                                                                         |
| taskClaimed                    | `EventEmitter<string>`                            | Emitted when the task is claimed.                                                                      |
| taskCompleted                  | `EventEmitter<string>`                            | Emitted when the task is completed.                                                                    |
| taskUnclaimed                  | `EventEmitter<string>`                            | Emitted when the task is unclaimed.                                                                    |
| displayModeOn                  | `EventEmitter<FormCloudDisplayModeConfiguration>` | Emitted when a display mode configuration is turned on.                                                |
| displayModeOff                 | `EventEmitter<FormCloudDisplayModeConfiguration>` | Emitted when a display mode configuration is turned off.                                               |

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
