---
Title: User Task Cloud Buttons Component
Added: 2025-02-05
Status: Active
Last reviewed: 2025-02-05
---

# User Task Cloud Buttons Component

Provides reusable component with buttons related to tasks. It contains three buttons: cancel, claim, unclaim. 
Visibility of each button is controlled by input property.

## Basic Usage

```html
<adf-cloud-user-task-cloud-buttons
    [appName]="appName"
    [canClaimTask]="canClaimTask()"
    [canUnclaimTask]="canUnclaimTask()"
    [showCancelButton]="showCancelButton"
    [taskId]="taskId"
    (cancelClick)="onCancelClick()"
    (claimTask)="onClaimTask()"
    (unclaimTask)="onUnclaimTask()"
    (error)="onError($event)"
/>
```

## Class members

### Properties

| Name                      | Type                                  | Default value | Description                                       |
|---------------------------|---------------------------------------|---------------|---------------------------------------------------|
| appName                   | `string`                              | ""            | App id to fetch corresponding form and values.    |
| canClaimTask              | `boolean`                             |               | Boolean informing if a task can be claimed.       |
| canUnclaimTask            | `boolean`                             |               | Boolean informing if a task can be unclaimed.     |
| taskId                    | `string`                              |               | Task id to fetch corresponding form and values.   |
| showCancelButton          | `boolean`                             | true          | Toggle rendering of the `Cancel` button.          |


### Events

| Name               | Type                   | Description                                |
|--------------------|------------------------|--------------------------------------------|
| cancelClick        | `EventEmitter<any>`    | Emitted when the task is cancelled.        |
| error              | `EventEmitter<any>`    | Emitted when any error occurs.             |
| claimTask          | `EventEmitter<string>` | Emitted when the task is claimed.          |
| unclaimTask        | `EventEmitter<string>` | Emitted when the task is unclaimed.        |


