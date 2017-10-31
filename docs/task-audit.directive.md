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

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| taskId | string | | (**required**) The id of the task. |
| format | string | pdf | In whitch format you want the task audit information (pdf or json). |
| download | boolean | false | True If you want download the file on the click event. |
| fileName | string | Audit | Represent the name of the file to download in case the format is pdf. |

### Events

| Name | Description |
| --- | --- |
| clicked | Raised when the task audit info is ready |
| error | Raised if there is an error during fetching task information |
