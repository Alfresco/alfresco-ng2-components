---
Title: Form cloud component
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-17
---

# [Task form cloud component](../../../lib/testing/src/lib/process-services-cloud/pages/task-form-cloud-component.page.ts "Defined in task-form-cloud-component.page.ts")

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

## See also

-   [Form component](./form-cloud.component.md)
-   [Form field model](../../core/models/form-field.model.md)
-   [Form cloud service](../services/form-cloud.service.md)
