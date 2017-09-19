# Activiti Task List component

Renders a list containing all the tasks matched by the parameters specified.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)
- [Details](#details)
  * [DataTableAdapter example](#datatableadapter-example)
  * [DataColumn Features](#datacolumn-features)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-tasklist 
    [appId]="'1'" 
    [state]="'open'" 
    [assignment]="'assignee'">
</adf-tasklist>
```

You can also use HTML-based schema declaration like shown below:

```html
<adf-tasklist ...>
    <data-columns>
        <data-column key="name" title="NAME" class="full-width name-column"></data-column>
        <data-column key="created" title="Created" class="hidden"></data-column>
    </data-columns>
</adf-tasklist>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| appId | string || The id of the app. |
| processDefinitionKey | string || The processDefinitionKey of the process. |
| processInstanceId | string || The processInstanceId of the process. |
| page | number | 0 | The page of the tasks to fetch. |
| size | number | 5 | The number of tasks to fetch. |
| assignment | string || The assignment of the process. <ul>Possible values are: <li>assignee : where the current user is the assignee</li> <li>candidate: where the current user is a task candidate </li><li>group_x: where the task is assigned to a group where the current user is a member of.</li> <li>no value: where the current user is involved</li> </ul> |
| state | string || Define state of the processes. Possible values are: `completed`, `active` |
| hasIcon | boolean | true | Toggle the icon on the left . |
| landingTaskId | string | | Define which task id should be selected after the reloading. If the task id doesn't exist or nothing is passed it will select the first task |
| sort | string | | Define the sort of the processes. Possible values are : `created-desc`, `created-asc`, `due-desc`, `due-asc` |
| data | DataTableAdapter | | JSON object that represent the number and the type of the columns that you want show (see the [example](#datatableadapter-example) section below) |

### Events

| Name | Description |
| --- | --- |
| onSuccess | Raised when the task list is loaded |
| rowClick | Raised when the task in the list is clicked |

## Details

This component displays lists of process instances both active and completed, using any defined process filter, and
render details of any chosen instance.

### DataTableAdapter example

```json
[
 {"type": "text", "key": "id", "title": "Id"},
 {"type": "text", "key": "name", "title": "Name", "cssClass": "full-width name-column", "sortable": true},
 {"type": "text", "key": "formKey", "title": "Form Key", "sortable": true},
 {"type": "text", "key": "created", "title": "Created", "sortable": true}
]
```

### DataColumn Features

You can customize the styling of a column and also add features like tooltips and automatic translation of column titles. See the DataColumn docs for more information about these features.