# Activiti Process Instance List

This component renders a list containing all the process instances matched by the parameters specified.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)
- [Details](#details)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

**app.component.html**

```html
<adf-process-instance-list 
    [appId]="'1'" 
    [state]="'open'">
</adf-process-instance-list>
```

### Properties

| Name | Description |
| --- | --- |
| appId | The id of the app. |
| processDefinitionKey | The processDefinitionKey of the process. |
| state | Define state of the processes. Possible values are `running`, `completed` and `all` |
| sort | Define sort of the processes. Possible values are `created-desc`, `created-asc`, `ended-desc`, `ended-asc` |
| schemaColumn | List of columns to display in the process instances datatable (see the [Details](#details) section below) |

### Events

- **rowClick**: Emitted when a row in the process list is clicked
- **onSuccess**: Emitted when the list of process instances has been loaded successfully from the server
- **onError**: Emitted when an error is encountered loading the list of process instances from the server

## Details

Example value for the schemaColumn property (see [Properties](#properties) section above):

```json
[
    {type: 'text', key: 'id', title: 'Id', sortable: true},
    {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
    {type: 'text', key: 'started', title: 'Started', sortable: true},
    {type: 'text', key: 'startedBy.email', title: 'Started By', sortable: true}
]
```
