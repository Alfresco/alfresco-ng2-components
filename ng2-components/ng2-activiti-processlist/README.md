# Activiti Task List Component for Angular 2

Displays lists of process instances both active and completed, using any defined process filter, and 
render details of any chosen instance.

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration [prerequisites](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

```sh
npm install --save ng2-activiti-processlist
```

### Dependencies

Add the following dependency to your index.html:

```html
<script src="node_modules/alfresco-js-api/dist/alfresco-js-api.js"></script>
```

You must separately install the following libraries for your application:

- [ng2-translate](https://github.com/ocombe/ng2-translate)
- [ng2-alfresco-core](https://www.npmjs.com/package/ng2-alfresco-core)
- [ng2-alfresco-datatable](https://www.npmjs.com/package/ng2-alfresco-datatable)
- [ng2-activiti-tasklist](https://www.npmjs.com/package/ng2-activiti-tasklist)


```sh
npm install --save ng2-translate ng2-alfresco-core ng2-alfresco-datatable ng2-activiti-tasklist
```

#### Material Design Lite

The style of this component is based on [material design](https://getmdl.io/), so if you want to visualize it correctly you have to add the material
design dependency to your project:

```sh
npm install --save material-design-icons material-design-lite
```

Also make sure you include these dependencies in your `index.html` file:

```html
<!-- Google Material Design Lite -->
<link rel="stylesheet" href="node_modules/material-design-lite/material.min.css">
<script src="node_modules/material-design-lite/material.min.js"></script>
<link rel="stylesheet" href="node_modules/material-design-icons/iconfont/material-icons.css">
```

## Usage

### Activiti Process Instance List

This component renders a list containing all the process instances matched by the filter specified.

```html
<activiti-process-instance-list [filter]="processFilterModel"></activiti-tasklist>
```

#### Options

**filter**: { FilterModel } (required) FilterModel object that
is passed to the process instance list API to filter the returned list.

Example:


```json
{
	"id": 4,
	"name": "Running Processes",
	"recent": false,
	"icon": "glyphicon-align-left",
	"filter": {
		"appDefinitionId": "1",
		"sort": "created-desc",
		"name": "",
		"state": "open",
		"page": "0",
		"size": "25"
	},
	"appId": 1001
}
```

**schemaColumn**: {any} List of columns to display in the process instances datatable

Example:

```json
[
    {type: 'text', key: 'id', title: 'Id', sortable: true},
    {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
    {type: 'text', key: 'started', title: 'Started', sortable: true},
    {type: 'text', key: 'startedBy.email', title: 'Started By', sortable: true}
]
```

#### Events

- **rowClick**: Emitted when a row in the process list is clicked
- **onSuccess**: Emitted when the list of process instances has been loaded successfully from the server
- **onError**: Emitted when an error is encountered loading the list of process instances from the server

### Process Filters component

Process filters are a collection of criteria used to filter process instances, which may be customized
by users. This component displays a list of available filters and allows the user to select any given
filter as the active filter.

The most common usage is in driving a process instance list in order to allow the user to choose which
process instances are displayed in the list.

```html
<activiti-process-instance-filters appId="1001"></activiti-process-instance-filters>
```

#### Options

- **`appId`**: Display filters available to the current user for the application with the specified ID
- **`appName`**: Display filters available to the current user for the application with the specified name

If both `appId` and `appName` are specified then `appName` will take precedence and `appId` will be ignored.

#### Events

- **`onSuccess`**: Emitted when the list of filters hase been successfully loaded from the server
- **`onError`**: Emitted when an error occurred fetching the list of process instance filters, or fetching the 
list of deployed applications when an app name was specified.
- **`filterClick`**: Emitted when the user selects a filter from the list

### Start Process Button component

Displays a button which in turn displays a dialog when clicked, allowing the user
to specify some basic details needed to start a new process instance.

```html
<activiti-start-process-instance></activiti-start-process-instance>
```

#### Options

- **`appId`**: Limit the list of processes which can be started to those contained in the specified app

#### Events

No events are emitted by this component

### Process Details component

This component displays detailed information on a specified process instance

```html
<activiti-process-instance-details processInstanceId="123"></activiti-process-instance-details>
```

#### Options

- **`processInstanceId`** (required): The numeric ID of the process instance to display

#### Events

- **`processCancelledEmitter`**: Emitted when the current process is cancelled by the user from within the component
- **`taskFormCompletedEmitter`**: Emitted when the form associated with an active task is completed from within the component

### Process Instance Details Header component

This is a sub-component of the process details component, which renders some general information about the selected process.

```html
<activiti-process-instance-header processInstance="localProcessDetails"></activiti-process-instance-details>
```

#### Options

- **`processInstance`** (required): Full details of the process instance to display information about

#### Events

- **`processCancelled`**: Emitted when the Cancel Process button shown by the component is clicked

### Process Instance Tasks component

Lists both the active and completed tasks associated with a particular process instance

```html
<activiti-process-instance-tasks processInstanceId="123" showRefreshButton="true"></activiti-process-instance-tasks>
```

#### Options

- **`processInstanceId`** (required): The numeric ID of the process instance to display tasks for
- **`showRefreshButton`** (default: `true`): Whether to show a refresh button next to the list of tasks to allow this to be updated from the server

#### Events

- **`taskFormCompletedEmitter`**: Emitted when the form associated with an active task is completed from within the component

### Process Instance Comments component

Displays comments associated with a particular process instances and allows the user to add new comments

```html
<activiti-process-instance-comments processInstanceId="123"></activiti-process-instance-comments>
```

#### Options

- **`processInstanceId`** (required): The numeric ID of the process instance to display comments for

#### Events

No events are emitted by this component

## Build from sources

Alternatively you can build component from sources with the following commands:

```sh
npm install
npm run build
```

### Build the files and keep watching for changes

```sh
$ npm run build:w
```

### Running unit tests

```sh
npm test
```

### Running unit tests in browser

```sh
npm test-browser
```

This task rebuilds all the code, runs tslint, license checks and other quality check tools
before performing unit testing.

### Code coverage

```sh
npm run coverage
```