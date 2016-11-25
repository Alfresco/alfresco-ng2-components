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

Displays lists of process instances both active and completed, using any defined process filter, and
render details of any chosen instance.

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration [prerequisites](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

Follow the 3 steps below:

1. Npm

    ```sh
    npm install ng2-activiti-tasklist --save
    ```

2. Html

    Include these dependencies in your index.html page:

    ```html

      <!-- Moment js -->
      <script src="node_modules/moment/min/moment.min.js"></script>

      <!-- Date picker -->
      <script src="node_modules/md-date-time-picker/dist/js/mdDateTimePicker.min.js"></script>
      <script src="node_modules/md-date-time-picker/dist/js/draggabilly.pkgd.min.js"></script>
      <link rel="stylesheet" href="node_modules/md-date-time-picker/dist/css/mdDateTimePicker.css" media="all">

      <!-- Google Material Design Lite -->
      <link rel="stylesheet" href="node_modules/material-design-lite/material.min.css">
      <script src="node_modules/material-design-lite/material.min.js"></script>
      <link rel="stylesheet" href="node_modules/material-design-icons/iconfont/material-icons.css">

      <!-- Polyfill(s) for Safari (pre-10.x) -->
      <script src="node_modules/intl/dist/Intl.min.js"></script>
      <script src="node_modules/intl/locale-data/jsonp/en.js"></script>

      <!-- Polyfill(s) for older browsers -->
      <script src="node_modules/core-js/client/shim.min.js"></script>
      <script src="//cdnjs.cloudflare.com/ajax/libs/dom4/1.8.3/dom4.js"></script>
      <script src="node_modules/element.scrollintoviewifneeded-polyfill/index.js"></script>

      <!-- Polyfill(s) for dialogs -->
      <script src="node_modules/dialog-polyfill/dialog-polyfill.js"></script>
      <link rel="stylesheet" type="text/css" href="node_modules/dialog-polyfill/dialog-polyfill.css" />
      <style>._dialog_overlay { position: static !important; } </style>

      <!-- Modules  -->
      <script src="node_modules/zone.js/dist/zone.js"></script>
      <script src="node_modules/reflect-metadata/Reflect.js"></script>
      <script src="node_modules/systemjs/dist/system.src.js"></script>

    ```

3. SystemJs

    Add the following components to your systemjs.config.js file:

    - ng2-translate
    - alfresco-js-api
    - ng2-alfresco-core
    - ng2-activiti-form
    - ng2-alfresco-datatable
    - ng2-activiti-tasklist

    Please refer to the following example file: [systemjs.config.js](demo/systemjs
    .config.js) .

## Basic usage example Activiti Task List

This component renders a list containing all the tasks matched by the parameters specified.

```html
<activiti-tasklist [appId]="'1'" [state]="'open'" [assignment]="'assignee'"></activiti-tasklist>
```

Usage example of this component :

**main.ts**
```ts

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ActivitiTaskListModule } from 'ng2-activiti-tasklist';
import { CoreModule } from 'ng2-alfresco-core';
import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { ObjectDataTableAdapter, DataSorting } from 'ng2-alfresco-datatable';

@Component({
    selector: 'alfresco-app-demo',
    template: `<activiti-tasklist [appId]="appId" [state]="state" [assignment]="assignment" [data]="dataTasks"></activiti-tasklist>`
})
class MyDemoApp {

    dataTasks: ObjectDataTableAdapter;

    appId: string = '1';

    assignment: string = 'assignee';

    state: string = 'open';

    constructor(private authService: AlfrescoAuthenticationService, private settingsService: AlfrescoSettingsService) {
        settingsService.bpmHost = 'http://localhost:9999';

        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                console.log(ticket);
            },
            error => {
                console.log(error);
            });

        this.dataTasks = new ObjectDataTableAdapter([], [
                {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
                {type: 'text', key: 'started', title: 'Started', cssClass: 'hidden', sortable: true}
            ]
        );
        this.dataTasks.setSorting(new DataSorting('started', 'desc'));
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        ActivitiTaskListModule.forRoot()
    ],
    declarations: [MyDemoApp],
    bootstrap: [MyDemoApp]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);


```

#### Events

| Name | Description |
| --- | --- |
| `onSuccess` | The event is emitted when the task list is loaded |
| `rowClick` | The event is emitted when the task in the list is clicked |

#### Options

| Name | Description |
| --- | --- |
|`appId`| { appId } The id of the app. |
|`processDefinitionKey`| { processDefinitionKey } The processDefinitionKey of the process. |
|`assignment`| { assignment } The assignment of the process.
Possible values are:
assignee : where the current user is the assignee
candidate: where the current user is a task candidate
group_x: where the task is assigned to a group where the current user is a member of. The groups can be fetched through the profile REST endpoint
no value: where the current user is involved |
|`state`| { state } Define state of the processes. Possible values are: completed, active |
|`sort`| { sort } Define the sort of the processes. Possible values are created-desc, created-asc, due-desc, due-asc |
| `schemaColumn` | { any[] } optional) JSON object that represent the number and the type of the columns that you want show |

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

| Name | Description |
| --- | --- |
| `formLoaded` | Invoked when form is loaded or reloaded. |
| `formSaved` | Invoked when form is submitted with `Save` or custom outcomes.  |
| `formCompleted` | Invoked when form is submitted with `Complete` outcome.  |
| `executeOutcome` | Invoked when any outcome is executed, default behaviour can be prevented via `event.preventDefault()` |
| `onError` | Invoked at any error |

#### Options

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `taskId` | {string} | required | The id of the task details that we are asking for. |
| `showNextTask` | {boolean} | optional | Automatically render the next one, when the task is completed. |
| `showFormTitle` | {boolean} | optional | Toggle rendering of the form title. |
| `readOnlyForm` | {boolean} | optional | Toggle readonly state of the form. Enforces all form widgets render readonly if enabled. |
| `showFormRefreshButton` | {boolean} | optional | Toggle rendering of the `Refresh` button. |
| `showFormSaveButton` | {boolean} | optional | Toggle rendering of the `Save` outcome button. |
| `showFormCompleteButton` | {boolean} | optional | Toggle rendering of the Form `Complete` outcome button |

### Custom 'empty Activiti Task Details' template

By default the Activiti Task Details provides the following message for the empty task details:

'No Tasks'


This can be changed by adding the following custom html template:

```html
<activiti-task-details [taskId]="taskId">
    <no-task-details-template>
        <template>
             <h1>Sorry, no tasks here</h1>
             <img src="example.jpg">
        </template>
    </no-task-details-template>
</activiti-task-details>    
```

## Basic usage example Activiti Apps

The component shows all the available apps.

```html
<activiti-apps [layoutType]="'GRID'"></activiti-filters>
```

#### Events

| Name | Description |
| --- | --- |
| `appClick` |  Invoked when an app is clicked |

#### Options

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `layoutType` | {string} | required | Define the layout of the apps. There are two possible values: GRID or LIST. |

## Basic usage example Activiti Filter

The component shows all the available filters.

```html
<activiti-filters></activiti-filters>
```

#### Events

| Name | Description |
| --- | --- |
| `filterClick` |  The event is emitted when the filter in the  list is clicked  |

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

## Running unit tests

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

## Demo

If you want have a demo of how the component works, please check the demo folder :

```sh
cd demo
npm install
npm start
```

## NPM scripts

| Command | Description |
| --- | --- |
| npm run build | Build component |
| npm run build:w | Build component and keep watching the changes |
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)
