# Activiti Process List library

Contains the Activiti Process Instance List component and other related components and classes.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Activiti Process Instance List](#activiti-process-instance-list)
  * [Basic Usage](#basic-usage)
    + [Properties](#properties)
    + [Events](#events)
  * [Details](#details)
- [Process Filters Component](#process-filters-component)
  * [Basic Usage](#basic-usage-1)
    + [Properties](#properties-1)
    + [Events](#events-1)
  * [Details](#details-1)
    + [How filter the activiti process filters](#how-filter-the-activiti-process-filters)
    + [FilterParamsModel](#filterparamsmodel)
    + [How to create an accordion menu with the processes filter](#how-to-create-an-accordion-menu-with-the-processes-filter)
- [Start Process component](#start-process-component)
  * [Basic Usage](#basic-usage-2)
    + [Properties](#properties-2)
    + [Events](#events-2)
- [Process Details component](#process-details-component)
  * [Basic Usage](#basic-usage-3)
    + [Properties](#properties-3)
    + [Events](#events-3)
- [Process Instance Details Header component](#process-instance-details-header-component)
  * [Basic Usage](#basic-usage-4)
    + [Properties](#properties-4)
    + [Events](#events-4)
- [Process Instance Tasks component](#process-instance-tasks-component)
  * [Basic Usage](#basic-usage-5)
    + [Properties](#properties-5)
    + [Events](#events-5)
- [Process Instance Comments component](#process-instance-comments-component)
  * [Basic Usage](#basic-usage-6)
    + [Properties](#properties-6)
- [Process Attachment List component](#process-attachment-list-component)
  * [Basic Usage](#basic-usage-7)
    + [Properties](#properties-7)
    + [Events](#events-6)
- [Create Process Attachment component](#create-process-attachment-component)
  * [Basic Usage](#basic-usage-8)
    + [Properties](#properties-8)
    + [Events](#events-7)
- [Process Audit Directive](#process-audit-directive)
  * [Basic Usage](#basic-usage-9)
    + [Properties](#properties-9)
    + [Events](#events-8)
- [Project Information](#project-information)
  * [Prerequisites](#prerequisites)
  * [Install](#install)
  * [Build from sources](#build-from-sources)
  * [NPM scripts](#npm-scripts)
  * [Demo](#demo)
  * [License](#license)

<!-- tocstop -->

<!-- markdown-toc end -->

<!-- Displays lists of process instances both active and completed, using any defined process filter, and renders details for any chosen instance.-->

## Activiti Process Instance List

This component renders a list containing all the process instances matched by the parameters specified.

### Basic Usage

**app.component.html**

```html
<adf-process-instance-list 
    [appId]="'1'" 
    [state]="'open'">
</adf-process-instance-list>
```

#### Properties

| Name | Description |
| --- | --- |
| appId | The id of the app. |
| processDefinitionKey | The processDefinitionKey of the process. |
| state | Define state of the processes. Possible values are `running`, `completed` and `all` |
| sort | Define sort of the processes. Possible values are `created-desc`, `created-asc`, `ended-desc`, `ended-asc` |
| schemaColumn | List of columns to display in the process instances datatable (see the [Details](#details) section below) |

#### Events

- **rowClick**: Emitted when a row in the process list is clicked
- **onSuccess**: Emitted when the list of process instances has been loaded successfully from the server
- **onError**: Emitted when an error is encountered loading the list of process instances from the server

### Details

Example value for the schemaColumn property (see [Properties](#properties) section above):

```json
[
    {type: 'text', key: 'id', title: 'Id', sortable: true},
    {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
    {type: 'text', key: 'started', title: 'Started', sortable: true},
    {type: 'text', key: 'startedBy.email', title: 'Started By', sortable: true}
]
```

## Process Filters Component

Collection of criteria used to filter process instances, which may be customized by users.

### Basic Usage

```html
<adf-process-instance-filters
    appId="1001">
</adf-process-instance-filters>
```

#### Properties

| Name | Type | Description |
| --- | --- | --- |
| filterParam | [FilterParamsModel](#filterparamsmodel) | The params to filter the task filter. If there is no match the default one (first filter of the list) is selected |
| appId | string | Display filters available to the current user for the application with the specified ID. |
| appName | string | Display filters available to the current user for the application with the specified name. |
| hasIcon | boolean | Toggle to show or not the filter's icon. |

If both `appId` and `appName` are specified then `appName` will take precedence and `appId` will be ignored.

#### Events

| Name | Description |
| --- | --- |
| onSuccess | Raised when the list of filters has been successfully loaded from the server |
| onError | Raised when an error occurs |
| filterClick | Raised when the user selects a filter from the list |

### Details

This component displays a list of available filters and allows the user to select any given
filter as the active filter.

The most common usage is in driving a process instance list to allow the user to choose which
process instances are displayed in the list.

#### How filter the activiti process filters

 ```html
<adf-process-instance-filters 
    [filterParam]="{index: 0}">
</adf-filters>
 ```

You can use inside the filterParam one of the properties defined by [FilterParamsModel](#filterparamsmodel) (see below).

#### FilterParamsModel

```json
{
    "id": "number",
    "name": "string",
    "index": "number"
}
```

| Name | Type | Description |
| --- | --- | --- |
| id | string | The id of the task filter. |
| name | string | The name of the task filter, lowercase is checked. |
| index | number | Zero-based position of the filter in the array. |

#### How to create an accordion menu with the processes filter

You can create an accordion menu using the AccordionComponent that wrap the activiti task filter.
The AccordionComponent is exposed by the alfresco-core.

```html
<adf-accordion>
    <adf-accordion-group 
        [heading]="'Processes'" 
        [isSelected]="true" 
        [headingIcon]="'assessment'">
        <adf-process-instance-filters
            [appId]="appId"
            (filterClick)="onProcessFilterClick($event)"
            (onSuccess)="onSuccessProcessFilterList($event)">
        </adf-process-instance-filters>
    </adf-accordion-group>
</adf-accordion>
```

![how-create-accordion-menu](docs/assets/how-to-create-accordion-menu.png)

## Start Process component

Displays Start Process, allowing the user to specify some basic details needed to start a new process instance.

### Basic Usage

```html
<adf-start-process 
    appId="YOUR_APP_ID" >
</adf-start-process>
```
![adf-start-process ](docs/assets/start-process.png)

#### Properties

| Name | Description |
| --- | --- |
| appId |  (required): Limit the list of processes which can be started to those contained in the specified app |
| variables | Variables in input to the process [RestVariable](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-activiti-rest-api/docs/RestVariable.md)|

#### Events

| Name | Description |
| --- | --- |
| start | Raised when the process start |
| cancel | Raised when the process canceled |
| error | Raised when the start process fail |

## Process Details component

Displays detailed information on a specified process instance

### Basic Usage

```html
<adf-process-instance-details 
    processInstanceId="YOUR_PROCESS_INSTANCE_ID">
</adf-process-instance-details>
```

#### Properties

| Name | Type | Description |
| --- | --- | --- |
| processInstanceId | string | (required): The numeric ID of the process instance to display |

#### Events

| Name | Description |
| --- | --- |
| processCancelledEmitter | Raised when the current process is cancelled by the user from within the component |
| taskFormCompletedEmitter | Raised when the form associated with an active task is completed from within the component |
| showProcessDiagram | Raised when the show diagram button is clicked |

## Process Instance Details Header component

Sub-component of the process details component, which renders some general information about the selected process.

### Basic Usage

```html
<adf-process-instance-header   
    processInstance="localProcessDetails">
</adf-process-instance-details>
```
![adf-process-instance-header](docs/assets/adf-process-instance-header-attachment.png)

#### Properties

| Name | Type| Description |
| --- | --- | --- |
| processInstance | [ProcessInstanceModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-processlist/src/models/process-instance.model.ts) | (**required**): Full details of the process instance to display information about |

#### Events

This component does not define any events.

## Process Instance Tasks component

Lists both the active and completed tasks associated with a particular process instance

### Basic Usage

```html
<adf-process-instance-tasks 
    processInstanceId="YOUR_PROCESS_INSTANCE_ID" 
    showRefreshButton="true">
</adf-process-instance-tasks>
```

#### Properties

| Name | Type | Description |
| --- | --- | --- |
| processInstanceId | string | (**required**): The ID of the process instance to display tasks for |
| showRefreshButton | boolean | (default: `true`): Whether to show a refresh button next to the list of tasks to allow this to be updated from the server |

#### Events

| Name | Description |
| --- | --- |
| taskFormCompletedEmitter | Raised when the form associated with an active task is completed from within the component |

## Process Instance Comments component

Displays comments associated with a particular process instance and allows the user to add new comments

### Basic Usage

```html
<adf-process-instance-comments 
    processInstanceId="YOUR_PROCESS_INSTANCE_ID">
</adf-process-instance-comments>
```

#### Properties

| Name | Type | Description |
| --- | --- | --- |
| processInstanceId | string | (**required**): The numeric ID of the process instance to display comments for |

## Process Attachment List component

Displays attached documents on a specified process instance

### Basic Usage

```html
<adf-process-attachment-list
    [processInstanceId]="YOUR_PROCESS_INSTANCE_ID"
    (attachmentClick)="YOUR_ATTACHMENT_CLICK_EMITTER_HANDLER">
</adf-process-attachment-list>
```
![process-attachment-list-sample](docs/assets/process-attachment-list.png)

#### Properties

| Name | Type | Description |
| --- | --- | -- |
| processInstanceId | string | (**required**): The ID of the process instance to display |
| disabled | boolean | false | Disable/Enable read only mode for attachement list |

#### Events

| Name | Description |
| --- | --- |
| attachmentClick | Raised when the attachment double clicked or selected view option from context menu by the user from within the component and return a Blob obj of the object clicker|
| success | Raised when the attachment list fetch all the attach and return a list of attachments |
| error | Raised when the attachment list is not able to fetch the attachments for example network error   |

## Create Process Attachment component

Displays Upload Component(Drag and Click) to upload the attachment to a specified process instance

### Basic Usage

```html
<adf-create-process-attachment 
    [processInstanceId]="YOUR_PROCESS_INSTANCE_ID"
    (error)="YOUR_CREATE_ATTACHMENT_ERROR_HANDLER"
    (success)="YOUR_CREATE_ATTACHMENT_SUCCESS_HANDLER">
</adf-create-process-attachment>
```

![process-create-attachment](docs/assets/process-create-attachment.png)

#### Properties

| Name | Type | Description |
| --- | --- | --- |
| processInstanceId | string | (**required**): The ID of the process instance to display |

#### Events

| Name | Description |
| --- | --- |
| error | Raised when the error occurred while creating/uploading the attachment by the user from within the component |
| success | Raised when the attachment created/uploaded successfully from within the component |

## Process Audit Directive

Provide a way to fetch the Process Audit information in the pdf or json format.

### Basic Usage

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

![adf-process-audit-directive](docs/assets/adf-process-audit-directive.png)

#### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| taskId | string | | (**required**) The id of the task. |
| format | string | pdf | In whitch format you want the task audit information (pdf or json). |
| download | boolean | false | True If you want download the file on the click event. |
| fileName | string | Audit | Represent the name of the file to download in case the format is pdf. |

#### Events

| Name | Description |
| --- | --- |
| clicked | Raised when the task audit info is ready |
| error | Raised if there is an error during fetching task information |

## Project Information

### Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration [prerequisites](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

> If you plan using this component with projects generated by Angular CLI, please refer to the following article: [Using ADF with Angular CLI](https://github.com/Alfresco/alfresco-ng2-components/wiki/Angular-CLI)

### Install

```sh
npm install ng2-activiti-processlist
```

### Build from sources

You can build component from sources with the following commands:

```sh
npm install
npm run build
```

> The `build` task rebuilds all the code, runs tslint, license checks 
> and other quality check tools before performing unit testing.

### NPM scripts

| Command | Description |
| --- | --- |
| npm run build | Build component |
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

### Demo

Please check the demo folder for a demo project

```sh
cd demo
npm install
npm start
```

### License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)
