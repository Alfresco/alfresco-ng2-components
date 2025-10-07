---
Title: Screen Cloud Component
Added: 2025-02-05
Status: Active
Last reviewed: 2025-02-05
---

# Screen Cloud Component

Provides space for a dynamic component. Dynamic component should implement interface UserTaskCustomUi. 
Dynamic component must be registered with service that extends ScreenRenderingService. Key for component
is a string taken from property formKey stored in xml. In component this value is stored in property screenId.
To register component use method register, example:

```typescript
import { ScreenRenderingService } from '@alfresco/adf-process-services-cloud';

export class YourService extends ScreenRenderingService {

    constructor() {
        super();
        this.register(
            {
                [formKeyThatIdentifiesDynamicComponent]: () => DynamicComponent
            },
            true
        );
    }
}
```

## Basic Usage

```html
<adf-cloud-task-screen 
    [appName]="appName"
    [canClaimTask]="canClaimTask()"
    [canUnclaimTask]="canUnclaimTask()"
    [processInstanceId]="taskDetails.processInstanceId"
    [rootProcessInstanceId]="taskDetails.rootProcessInstanceId"
    [screenId]="screenId"
    [showCancelButton]="showCancelButton"
    [taskName]="taskDetails.name"
    [taskId]="taskId"
    (cancelTask)="onCancelClick()"
    (claimTask)="onClaimTask()"
    (error)="onError($event)"
    (taskCompleted)="onCompleteTask()"
    (taskSaved)="onFormSaved()"
    (unclaimTask)="onUnclaimTask()"
/>
```

## Class members

### Properties

| Name                      | Type                                  | Default value | Description                                       |
|---------------------------|---------------------------------------|---------------|---------------------------------------------------|
| appName                   | `string`                              | ""            | App id to fetch corresponding form and values.    |
| canClaimTask              | `boolean`                             |               | Boolean informing if a task can be claimed.       |
| canUnclaimTask            | `boolean`                             |               | Boolean informing if a task can be unclaimed.     |
| isNextTaskCheckboxChecked | `boolean`                             | false         | Whether the `Open next task` checkbox is checked by default or not. |
| processInstanceId         | `string`                              |               | Process Instance Id to fetch corresponding data.  |
| rootProcessInstanceId     | `string`                              |               | Root Process Instance Id to fetch corresponding data.  |
| readOnly                  | `boolean`                             | false         | Toggle readonly state of the task.                |
| showCancelButton          | `boolean`                             | true          | Toggle rendering of the `Cancel` button.          |
| showNextTaskCheckbox      | `boolean`                             | false         | Toggle rendering of the `Open next task` checkbox (controlled internally by parent component). |
| screenId                  | `string`                              |               | Screen id to create dynamic component             |
| taskId                    | `string`                              |               | Task id to fetch corresponding form and values.   |
| taskName                  | `string`                              |               | Name of the task.                                 |


### Events

| Name               | Type                   | Description                                |
|--------------------|------------------------|--------------------------------------------|
| cancelTask         | `EventEmitter<any>`    | Emitted when the task is cancelled.        |
| error              | `EventEmitter<any>`    | Emitted when any error occurs.             |
| taskSaved          | `EventEmitter`         | Emitted when the task is saved.            |
| claimTask          | `EventEmitter<string>` | Emitted when the task is claimed.          |
| taskCompleted      | `EventEmitter<string>` | Emitted when the task is completed.        |
| unclaimTask        | `EventEmitter<string>` | Emitted when the task is unclaimed.        |


#### Enabling fullscreen display for the dynamic component

Dynamic component must implement logic for method switchToDisplayMode.

**MyView.component.html**

```html
<button (click)="adfCloudTaskScreen.switchToDisplayMode('fullScreen')">Full screen</button>

<adf-cloud-task-screen  
    #adfCloudTaskScreen
    [appName]="appName"
    [canClaimTask]="canClaimTask()"
    [canUnclaimTask]="canUnclaimTask()"
    [processInstanceId]="taskDetails.processInstanceId"
    [rootProcessInstanceId]="taskDetails.rootProcessInstanceId"
    [screenId]="screenId"
    [showCancelButton]="showCancelButton"
    [taskName]="taskDetails.name"
    [taskId]="taskId"
    (cancelTask)="onCancelClick()"
    (claimTask)="onClaimTask()"
    (error)="onError($event)"
    (taskCompleted)="onCompleteTask()"
    (taskSaved)="onFormSaved()"
    (unclaimTask)="onUnclaimTask()"
/>
```
