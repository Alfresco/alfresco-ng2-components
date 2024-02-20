---
Title: Form cloud component
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-17
---

# [Task form cloud component](../../../lib/process-services-cloud/src/lib/task/task-form/components/task-form-cloud.component.ts "Defined in task-form-cloud.component.ts")

Shows a [`form`](../../../lib/process-services-cloud/src/lib/form/models/form-cloud.model.ts) for a task.

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

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` | "" | App id to fetch corresponding form and values. |
| readOnly | `boolean` | false | Toggle readonly state of the task. |
| showCancelButton | `boolean` | true | Toggle rendering of the `Cancel` button. |
| showCompleteButton | `boolean` | true | Toggle rendering of the `Complete` button. |
| showRefreshButton | `boolean` | false | Toggle rendering of the `Refresh` button. |
| showTitle | `boolean` | true | Toggle rendering of the form title. |
| showValidationIcon | `boolean` | true | Toggle rendering of the `Validation` icon. |
| taskId | `string` |  | Task id to fetch corresponding form and values. |
| displayModeConfigurations | [`FormCloudDisplayModeConfiguration`](../../../lib/process-services-cloud/src/lib/services/form-fields.interfaces.ts)`[]` |  | The available display configurations for the form |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| cancelClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the cancel button is clicked. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when any error occurs. |
| executeOutcome | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormOutcomeEvent`](../../../lib/core/src/lib/form/components/widgets/core/form-outcome-event.model.ts)`>` | Emitted when any outcome is executed. Default behaviour can be prevented via `event.preventDefault()`. |
| formCompleted | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts)`>` | Emitted when the form is submitted with the `Complete` outcome. |
| formContentClicked | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ContentLinkModel`](../../../lib/core/src/lib/form/components/widgets/core/content-link.model.ts)`>` | Emitted when form content is clicked. |
| formSaved | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormModel`](../../../lib/core/src/lib/form/components/widgets/core/form.model.ts)`>` | Emitted when the form is saved. |
| onTaskLoaded | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`TaskDetailsCloudModel`](../../../lib/process-services-cloud/src/lib/task/start-task/models/task-details-cloud.model.ts)`>` | Emitted when a task is loaded\`. |
| taskClaimed | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the task is claimed. |
| taskCompleted | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the task is completed. |
| taskUnclaimed | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the task is unclaimed. |
| displayModeOn | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormCloudDisplayModeConfiguration`](../../../lib/process-services-cloud/src/lib/services/form-fields.interfaces.ts)`>` | Emitted when a display mode configuration is turned on. |
| displayModeOff | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FormCloudDisplayModeConfiguration`](../../../lib/process-services-cloud/src/lib/services/form-fields.interfaces.ts)`>` | Emitted when a display mode configuration is turned off. |

#### Enabling fullscreen display for the form of the task

Provide a `displayModeConfiguration` array object containing the fullscreen configuration. You can use the configuration provided in the [`CloudFormRenderingService`](../../../lib/process-services-cloud/src/lib/form/components/cloud-form-rendering.service.ts) as a static member `CloudFormRenderingService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS`, or configure your own if you want to customise the options for the fullscreen display mode.

**MyView.component.html**

```html
<button (click)="displayFormInFullscreenMode()">

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
import { ViewChild } from '@angular/core';
import { CloudFormRenderingService, TaskFormCloudComponent } from '@alfresco/adf-process-services-cloud';

export class MyView {

    @ViewChild('adfCloudTaskForm', { static: true })
    adfCloudTaskForm: TaskFormCloudComponent;

    get displayConfigurations() {
        return CloudFormRenderingService.IMPLEMENTED_DISPLAY_MODE_CONFIGURATIONS;
    }

    displayFormInFullscreenMode() {
        this.adfCloudTaskForm.switchToDisplayMode('fullScreen');
    }

}
```

When the `displayModeConfigurations` contains the configuration for the fullscreen display, in the header of the form, a button to switch to fullscreen is displayed. Keep in mind that the header of the form is visible only if any of the parameters `showTitle`, `showRefreshButton`or `showValidationIcon` is `true`, but it is also possible to switch to the fullscreen display using a button that you can place wherever you want as shown in the previous example.

## See also

-   [Form component](./form-cloud.component.md)
-   [Form field model](../../core/models/form-field.model.md)
-   [Form cloud service](../services/form-cloud.service.md)
