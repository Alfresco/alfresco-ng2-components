# Activiti Process List Component for Angular 2
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
  <a href='https://www.npmjs.com/package/ng2-activiti-processlist'>
    <img src='https://img.shields.io/npm/dt/ng2-activiti-processlist.svg' alt='npm downloads' />
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
    npm install ng2-activiti-processlist --save
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

      <!-- Load the Angular Material 2 stylesheet -->
      <link href="node_modules/@angular/material/core/theming/prebuilt/deeppurple-amber.css" rel="stylesheet">
    
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
    - ng2-activiti-processlist

    Please refer to the following example file: [systemjs.config.js](demo/systemjs.config.js) .


## Basic usage

### Activiti Process Instance List

This component renders a list containing all the process instances matched by the parameters specified.

```html
<activiti-process-instance-list [appId]="'1'" [state]="'open'"></activiti-tasklist>
```

Usage example of this component :

**main.ts**
```ts

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FilterRepresentationModel } from 'ng2-activiti-tasklist';
import { CoreModule } from 'ng2-alfresco-core';
import { ActivitiProcessListModule } from 'ng2-activiti-processlist';
import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { ObjectDataTableAdapter, DataSorting } from 'ng2-alfresco-datatable';

@Component({
    selector: 'alfresco-app-demo',
    template: `<activiti-process-instance-list [appId]="appId" [state]="state" [data]="dataProcesses"
             #activitiprocesslist></activiti-process-instance-list>`
})
class MyDemoApp {

    dataProcesses: ObjectDataTableAdapter;

    appId: string = '1';

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

        this.dataProcesses = new ObjectDataTableAdapter([], [
                {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
                {type: 'text', key: 'started', title: 'Started', cssClass: 'hidden', sortable: true}
            ]
        );
        this.dataProcesses.setSorting(new DataSorting('started', 'desc'));

        this.filterRepresentationModel = new FilterRepresentationModel({
            appId: '3003',
            filter: {
                processDefinitionKey: null,
                name: null,
                state: 'running',
                sort: 'created-desc'
            }
        });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        ActivitiProcessListModule
    ],
    declarations: [MyDemoApp],
    bootstrap: [MyDemoApp]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);


```

#### Options

| Name | Description |
| --- | --- |
|`appId`| { appId } The id of the app. |
|`processDefinitionKey`| { processDefinitionKey } The processDefinitionKey of the process. |
|`state`| { state } Define state of the processes. Possible values are running, completed and all |
|`sort`| { sort } Define sort of the processes. Possible values are created-desc, created-asc, ended-desc, ended-asc |
|`schemaColumn`| {any} List of columns to display in the process instances datatable |

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

| Name | Description |
| --- | --- |
| `appId` | Display filters available to the current user for the application with the specified ID |
| `appName` | Display filters available to the current user for the application with the specified name |

If both `appId` and `appName` are specified then `appName` will take precedence and `appId` will be ignored.

#### Events

| Name | Description |
| --- | --- |
| `onSuccess` | Emitted when the list of filters hase been successfully loaded from the server |
| `onError` | Emitted when an error occurs |
| `ilterClick` | Emitted when the user selects a filter from the list |

### How to create an accordion menu with the processes filter

You can create an accordion menu using the AccordionComponent that wrap the activiti task filter.
The AccordionComponent is exposed by the alfresco-core.

```html
<accordion>
    <accordion-group [heading]="'Processes'" [isSelected]="true" [headingIcon]="'assessment'">
        <activiti-process-instance-filters
            [appId]="appId"
            (filterClick)="onProcessFilterClick($event)"
            (onSuccess)="onSuccessProcessFilterList($event)">
        </activiti-process-instance-filters>
    </accordion-group>
</accordion>
```

![how-create-accordion-menu](docs/assets/how-to-create-accordion-menu.png)

### Start Process Button component

Displays a button which in turn displays a dialog when clicked, allowing the user
to specify some basic details needed to start a new process instance.

```html
<activiti-start-process-instance></activiti-start-process-instance>
```

#### Options


| Name | Description |
| --- | --- |
| `appId` | Limit the list of processes which can be started to those contained in the specified app |

#### Events

No events are emitted by this component

### Process Details component

This component displays detailed information on a specified process instance

```html
<activiti-process-instance-details processInstanceId="123"></activiti-process-instance-details>
```

#### Options


| Name | Description |
| --- | --- |
| `processInstanceId` | (required): The numeric ID of the process instance to display |

#### Events


| Name | Description |
| --- | --- |
| `processCancelledEmitter` |  Emitted when the current process is cancelled by the user from within the component |
| `taskFormCompletedEmitter` |  Emitted when the form associated with an active task is completed from within the component |

### Process Instance Details Header component

This is a sub-component of the process details component, which renders some general information about the selected process.

```html
<activiti-process-instance-header processInstance="localProcessDetails"></activiti-process-instance-details>
```

#### Options


| Name | Description |
| --- | --- |
| `processInstance` |  (required): Full details of the process instance to display information about |

#### Events


| Name | Description |
| --- | --- |
| `processCancelled` |  Emitted when the Cancel Process button shown by the component is clicked |

### Process Instance Tasks component

Lists both the active and completed tasks associated with a particular process instance

```html
<activiti-process-instance-tasks processInstanceId="123" showRefreshButton="true"></activiti-process-instance-tasks>
```

#### Options


| Name | Description |
| --- | --- |
| `processInstanceId` |  (required): The numeric ID of the process instance to display tasks for |
| `showRefreshButton` |  (default: `true`): Whether to show a refresh button next to the list of tasks to allow this to be updated from the server |

#### Events

| Name | Description |
| --- | --- |
| `taskFormCompletedEmitter` |  Emitted when the form associated with an active task is completed from within the component |

### Process Instance Comments component

Displays comments associated with a particular process instances and allows the user to add new comments

```html
<activiti-process-instance-comments processInstanceId="123"></activiti-process-instance-comments>
```

#### Options


| Name | Description |
| --- | --- |
| `processInstanceId` | (required): The numeric ID of the process instance to display comments for |

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
