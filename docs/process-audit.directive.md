# Process Audit Directive

Provide a way to fetch the Process Audit information in the pdf or json format.

![adf-process-audit-directive](docassets/images/adf-process-audit-directive.png)

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<button
    adf-process-audit
    [process-id]="processId"
    [format]="'pdf'"
    [download]="true"
    md-icon-button (clicked)="onAuditClick($event)" (error)="onAuditError($event)" >
    <md-icon>assignment_ind</md-icon>
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
