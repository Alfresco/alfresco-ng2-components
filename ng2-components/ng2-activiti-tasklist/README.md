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

    Please refer to the following example file: [systemjs.config.js](demo/systemjs.config.js) .


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
import { CoreModule, AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { ObjectDataTableAdapter, DataSorting } from 'ng2-alfresco-datatable';

@Component({
    selector: 'alfresco-app-demo',
    template: `
        <activiti-tasklist 
            [appId]="appId" 
            [state]="state" 
            [assignment]="assignment" 
            [data]="dataTasks">
        </activiti-tasklist>
    `
})
class MyDemoApp {

    dataTasks: ObjectDataTableAdapter;
    appId: string = '1';
    assignment: string = 'assignee';
    state: string = 'open';

    constructor(private authService: AlfrescoAuthenticationService, 
                private settingsService: AlfrescoSettingsService) {
        settingsService.bpmHost = 'http://localhost:9999';

        this.authService.login('admin', 'admin').subscribe(
            ticket => console.log(ticket),
            error => console.log(error)
        );

        this.dataTasks = new ObjectDataTableAdapter([], [
            {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
            {type: 'text', key: 'started', title: 'Started', cssClass: 'hidden', sortable: true}
        ]);
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
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
```

You can also use HTML-based schema declaration like shown below:

```html
<activiti-tasklist ...>
    <data-columns>
        <data-column key="name" title="NAME" class="full-width name-column"></data-column>
        <data-column key="created" title="Created" class="hidden"></data-column>
    </data-columns>
</activiti-tasklist>
```

### DataColumn Properties

Here's the list of available properties you can define for a Data Column definition.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| key | string | | Data source key, can be either column/property key like `title` or property path like `createdBy.name` |
| type | string (text\|image\|date) | text | Value type |
| format | string | | Value format (if supported by components), for example format of the date |
| sortable | boolean | true | Toggles ability to sort by this column, for example by clicking the column header |
| title | string | | Display title of the column, typically used for column headers |
| template | `TemplateRef` | | Custom column template |
| sr-title | string | | Screen reader title, used for accessibility purposes |
| class | string | | Additional CSS class to be applied to column (header and cells) |

### Events

| Name | Description |
| --- | --- |
| `onSuccess` | The event is emitted when the task list is loaded |
| `rowClick` | The event is emitted when the task in the list is clicked |

### Properties


| Name | Type | Default | Description |
| --- | --- | --- | --- |
|`appId`| { string } || The id of the app. |
|`processDefinitionKey`| { string } || The processDefinitionKey of the process. |
|`assignment`| { string } || The assignment of the process. <ul>Possible values are: <li>assignee : where the current user is the assignee</li> <li>candidate: where the current user is a task candidate </li><li>group_x: where the task is assigned to a group where the current user is a member of.</li> <li>no value: where the current user is involved</li> </ul> |
|`state`| { string } || Define state of the processes. Possible values are: completed, active  |
|`hasIcon` | boolean | true | Show/Hide the icon on the left . |
|`landingTaskId`| { string } | | Define which task id should be selected after the reloading. If the task id doesn't exist or nothing is passed it will select the first task |
|`sort`| { string } ||Define the sort of the processes. Possible values are : created-desc, created-asc, due-desc, due-asc |
| `data` | { DataTableAdapter }| (optional)|JSON object that represent the number and the type of the columns that you want show 

Example:

```json
[
 {"type": "text", "key": "id", "title": "Id"},
 {"type": "text", "key": "name", "title": "Name", "cssClass": "full-width name-column", "sortable": true},
 {"type": "text", "key": "formKey", "title": "Form Key", "sortable": true},
 {"type": "text", "key": "created", "title": "Created", "sortable": true}
]
```

## Basic usage example Activiti Task Details

The component shows the details of the task id passed in input

```html
<activiti-task-details [taskId]="taskId"></activiti-task-details>
```

#### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `taskId` | string | | (**required**) The id of the task details that we are asking for. |
| `showNextTask` | boolean | true | Automatically render the next one, when the task is completed. |
| `showFormTitle` | boolean | true | Toggle rendering of the form title. |
| `readOnlyForm` | boolean | false | Toggle readonly state of the form. Enforces all form widgets render readonly if enabled. |
| `showFormRefreshButton` | true | optional | Toggle rendering of the `Refresh` button. |
| `showFormSaveButton` | true | optional | Toggle rendering of the `Save` outcome button. |
| `showFormCompleteButton` | true | optional | Toggle rendering of the Form `Complete` outcome button |
| `peopleIconImageUrl` | string | | Define a custom people icon image |
| `showHeader` | boolean | true | Toggle task details Header component |
| `showHeaderContent` | boolean | true | Toggle collapsed/expanded state of the Header component |
| `showInvolvePeople` | boolean | true | Toggle `Involve People` feature for Header component |
| `showComments` | boolean | true | Toggle `Comments` feature for Header component |
| `showChecklist` | boolean | true | Toggle `Checklist` feature for Header component |

#### Events

| Name | Description |
| --- | --- |
| `formLoaded` | Invoked when form is loaded or reloaded. |
| `formSaved` | Invoked when form is submitted with `Save` or custom outcomes.  |
| `formCompleted` | Invoked when form is submitted with `Complete` outcome.  |
| `taskCreated` | Invoked when a checklist task is created.  |
| `executeOutcome` | Invoked when any outcome is executed, default behaviour can be prevented via `event.preventDefault()` |
| `onError` | Invoked at any error |

### Custom 'empty Activiti Task Details' template

By default the Activiti Task Details provides the following message for the empty task details:

```
No Tasks
```

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

Note that can put any HTML content as part of the template, includuing other Angualr components.

## Basic usage example Activiti Apps

The component shows all the available apps.

```html
<activiti-apps [layoutType]="'GRID'"></activiti-apps>
```

#### Events

| Name | Description |
| --- | --- |
| `appClick` |  Invoked when an app is clicked |

#### Options

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `layoutType` | {string} | required | Define the layout of the apps. There are two possible values: GRID or LIST. |
| `filtersAppId` | {Object} |  | Provide a way to filter the apps to show. |


### How filter the activiti apps 

If you want show some specific apps you can specify them through the filtersAppId parameters

```html
<activiti-apps [filtersAppId]="'[{defaultAppId: 'tasks'}, {deploymentId: '15037'}, {name : 'my app name'}]'"></activiti-apps>
```

In this specific case only the Tasks app, the app with deploymentId 15037 and the app with "my app name" will be showed
![how-filter-apps](docs/assets/how-filter-apps.png)

You can use inside the filter one of the following property 
```json
{ 
    "defaultAppId": "string", 
    "deploymentId": "string", 
    "name": "string", 
    "id": "number", 
    "modelId": "number",
    "tenantId": "number"
}
```

## Basic usage example Activiti Filter

The component shows all the available filters.

```html
<activiti-filters></activiti-filters>
```

#### Events

| Name | Description |
| --- | --- |
| `filterClick` |  The event is emitted when the filter in the  list is clicked  |
| `onSuccess` |  The event is emitted when the list is loaded  |
| `onError` |  The event is emitted if there is an error during the loading  |

#### Options

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `filterParam` | {[Filter Params  models](#filter-params--models)} | optional | The params to filter the task filter. If there is no match the default one (first filter of the list) is selected |
| `appId` | {string} | optional | Display filters available to the current user for the application with the specified ID. |
| `appName` | {string} | optional | Display filters available to the current user for the application with the specified name. |
| `hasIcon` | {boolean} | optional | Toggle to show or not the filter's icon. |

If both `appId` and `appName` are specified then `appName` will take precedence and `appId` will be ignored.

### How filter the activiti task filters

 ```html
<activiti-filters [filterParam]="{name:'My tasks'}"></activiti-filters>
 ```

You can use inside the filterParam one of the following property.
## Filter Params  models
```json
{
    "id": "number",
    "name": "string",
    "index": "number"
}
```

| Name | Description |
| --- | --- |
| `id` |  The id of the task filter |
| `name` |  The name of the task filter, lowercase is checked |
| `index` |  The position of the filter in the array. The first position is 0 |



### How to create an accordion menu with the task filter

You can create an accordion menu using the AccordionComponent that wrap the activiti task filter.
The AccordionComponent is exposed by the alfresco-core.

```html
<adf-accordion>
    <adf-accordion-group [heading]="'Tasks'" [isSelected]="true" [headingIcon]="'assignment'">
        <activiti-filters
            [appId]="appId"
            [hasIcon]="false"
            (filterClick)="onTaskFilterClick($event)"
            (onSuccess)="onSuccessTaskFilterList($event)"
            #activitifilter>
        </activiti-filters>
    </adf-accordion-group>
</adf-accordion>
```

![how-create-accordion-menu](docs/assets/how-to-create-accordion-menu.png)

## Basic usage example Activiti Checklist

The component shows the checklist task functionality.

```html
<activiti-checklist></activiti-checklist>
```

#### Options

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `taskId` | {string} | required | The id of the parent task which sub tasks are attached on. |
| `readOnlyForm` | {boolean} | optional | Toggle readonly state of the form. Enforces all form widgets render readonly if enabled. |
| `assignee` | {string} | required | The assignee id where the subtasks are assigned to. |

## Basic usage example Activiti Checklist

The component shows all the available filters.

```html
<activiti-checklist [readOnly]="false" [taskId]="taskId" [assignee]="taskAssignee.id" #activitichecklist></activiti-checklist>
```

### Task Attachment List component

This component displays attached documents on a specified task

```html
<adf-task-attachment-list [taskId]="YOUR_TASK_ID" 
(attachmentClick)="YOUR_ATTACHMENT_CLICK_EMITTER_HANDLER"></adf-task-attachment-list>
```
![task-attachment-list-sample](docs/assets/task-attachment-list.png)

#### Options


| Name | Description |
| --- | --- |
| `taskId` | (required): The numeric ID of the task to display |

#### Events


| Name | Description |
| --- | --- |
| `attachmentClick` |  Emitted when the attachment double clicked or selected view option from context menu by the user from within the component and return a Blob obj of the object clicker|
| `success` |  Emitted when the attachment list fetch all the attach and return a list of attachments |
| `error` |  Emitted when the attachment list is not able to fetch the attachments for example network error   |


### Create Task Attachment component

This component displays Upload Component(Drag and Click) to upload the attachment to a specified task

```html
<adf-create-task-attachment [taskId]="YOUR_TASK_ID" 
(error)="YOUR_CREATE_ATTACHMENT_ERROR_HANDLER"
(success)="YOUR_CREATE_ATTACHMENT_SUCCESS_HANDLER"></adf-create-task-attachment>
```

![task-create-attachment](docs/assets/task-create-attachment.png)

#### Options


| Name | Description |
| --- | --- |
| `taskId` | (required): The numeric ID of the task to display |

#### Events


| Name | Description |
| --- | --- |
| `error` |  Emitted when the error occured while creating/uploading the attachment by the user from within the component |
| `success` |  Emitted when the attachement created/uploaded successfully from within the component |

## Build from sources

Alternatively you can build component from sources with the following commands:


```sh
npm install
npm run build
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
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)
