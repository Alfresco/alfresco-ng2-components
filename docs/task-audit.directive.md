# Task Audit Directive

Fetches the Task Audit information in the pdf or json format.

![adf-task-audit-directive](docassets/images/adf-task-audit-directive.png)

## Basic Usage

```html
<button
    adf-task-audit
    [task-id]="taskId"
    [download]="download"
    mat-icon-button (clicked)="onAuditClick($event)" (error)="onAuditError($event)" >
    <mat-icon>assignment_ind</mat-icon>
</button>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| taskId | `string` |  | (**required**) The id of the task.  |
| fileName | `string` | `'Audit'` | Name of the downloaded file (for PDF downloads).  |
| format | `string` | `'pdf'` | Format of the audit information. Can be "pdf" or "json".  |
| download | `boolean` | `true` | Enables downloading of the audit when the decorated element is clicked.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| clicked | `EventEmitter<any>` | Emitted when the decorated element is clicked.  |
| error | `EventEmitter<any>` | Emitted when an error occurs.  |
