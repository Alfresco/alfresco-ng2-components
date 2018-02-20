# Process Audit Directive

Fetches the Process Audit information in the pdf or json format.

![adf-process-audit-directive](docassets/images/adf-process-audit-directive.png)

## Basic Usage

```html
<button
    adf-process-audit
    [process-id]="processId"
    [format]="'pdf'"
    [download]="true"
    mat-icon-button (clicked)="onAuditClick($event)" (error)="onAuditError($event)" >
    <mat-icon>assignment_ind</mat-icon>
</button>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| processId | `string` |  | ID of the process.  |
| fileName | `string` | `'Audit'` | Name of the file to download (for PDF downloads).  |
| format | `string` | `'pdf'` | Format for the audit information (can be "pdf" or "json").  |
| download | `boolean` | `true` | Enables downloading of the audit file on clicking.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| clicked | `EventEmitter<any>` | Emitted when the decorated element is clicked.  |
| error | `EventEmitter<any>` | Emitted when an error occurs.  |
