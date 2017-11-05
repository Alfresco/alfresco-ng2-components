# Process Audit Directive

Fetches the Process Audit information in the pdf or json format.

![adf-process-audit-directive](docassets/images/adf-process-audit-directive.png)

## Basic Usage

```html
<button
    adf-process-audit
    [processId]="processId"
    [format]="'pdf'"
    [download]="true"
    mat-icon-button (clicked)="onAuditClick($event)" (error)="onAuditError($event)" >
    <mat-icon>assignment_ind</mat-icon>
</button>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| processId | string | | (**required**) The id of the process. |
| format | string | pdf | In whitch format you want the task audit information (pdf or json). |
| download | boolean | false | True If you want download the file on the click event. |
| fileName | string | Audit | Represent the name of the file to download in case the format is pdf. |

### Events

| Name | Description |
| --- | --- |
| clicked | Raised when the task audit info is ready |
| error | Raised if there is an error during fetching task information |
