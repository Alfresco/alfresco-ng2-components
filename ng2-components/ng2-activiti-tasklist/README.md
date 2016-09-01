# Activiti Task List Component for Angular 2
<p>
  <a title='Build Status Travis' href="https://travis-ci.org/Alfresco/alfresco-ng2-components">
    <img src='https://travis-ci.org/Alfresco/alfresco-ng2-components.svg?branch=master'  alt='travis
    Status' />
  </a>
  <a title='Build Status AppVeyor' href="https://ci.appveyor.com/project/alfresco/alfresco-ng2-components">
    <img src='https://ci.appveyor.com/api/projects/status/github/Alfresco/alfresco-ng2-components'  alt='travis
    Status' />
  </a>
  <a href='https://codecov.io/gh/Alfresco/alfresco-ng2-components'>
    <img src='https://img.shields.io/codecov/c/github/Alfresco/alfresco-ng2-components/master.svg?maxAge=2592000' alt='Coverage Status' />
  </a>
  <a href='https://www.npmjs.com/package/ng2-activiti-tasklist'>
    <img src='https://img.shields.io/npm/dt/ng2-activiti-tasklist.svg' alt='npm downloads' />
  </a>
  <a href='https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE'>
     <img src='https://img.shields.io/hexpm/l/plug.svg' alt='license' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-component-green.svg?label=alfresco' alt='alfresco component' />
  </a>
  <a href='https://angular.io/'>
     <img src='https://img.shields.io/badge/style-2-red.svg?label=angular' alt='angular 2' />
  </a>
  <a href='https://www.typescriptlang.org/docs/tutorial.html'>
     <img src='https://img.shields.io/badge/style-lang-blue.svg?label=typescript' alt='typescript' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-%3E5.0.0-blue.svg?label=node%20version' alt='node version' />
  </a>
</p>

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration, see this [page](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

```sh
npm install --save ng2-activiti-tasklist
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


```sh
npm install --save ng2-translate ng2-alfresco-core ng2-alfresco-datatable
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

## Basic usage example Activiti Task List
The component shows the list of all the tasks filter by the
FilterModel passed in input.
```html
<activiti-tasklist [taskFilter]="taskFilterModel"></activiti-tasklist>
```

#### Events
**onSuccess**: The event is emitted when the task list is loaded
**rowClick**: The event is emitted when the task in the list is
clicked<br />

#### Options

**taskFilter**: { FilterModel } required) FilterModel object that
is passed to the task list API to filter the task list.
Example:
```json
{
	"id": 4,
	"name": "Involved Tasks",
	"recent": false,
	"icon": "glyphicon-align-left",
	"filter": {
		"appDefinitionId": "1",
		"processDefinitionId": "1533",
		"sort": "created-desc",
		"name": "",
		"state": "open",
		"assignment": "involved",
		"page": "0",
		"size": "25"
	}
}
```
**schemaColumn**: { any[] } optional) JSON object that represent
the number and the type of the columns that you want show
Example:
```json
[
 {type: 'text', key: 'id', title: 'Id'},
 {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
 {type: 'text', key: 'formKey', title: 'Form Key', sortable: true},
 {type: 'text', key: 'created', title: 'Created', sortable: true}
]
```

## Basic usage example Activiti Task Details
The component shows the details of the task id passed in input
```html
<activiti-task-details [taskId]="taskId"></activiti-task-details>
```

#### Events
No events

#### Options

**taskId**: { string } required) The id of the task details that we
are asking for.

## Basic usage example Activiti Filter
The component shows all the available filters.

```html
<activiti-filters></activiti-filters>
```

#### Events
**filterClick**: The event is emitted when the filter in the  list is
 clicked

#### Options
No options

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
