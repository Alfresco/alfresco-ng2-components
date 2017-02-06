# Activiti Form Component for Angular 2
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
  <a href='https://www.npmjs.com/package/ng2-activiti-form'>
    <img src='https://img.shields.io/npm/dtng2-activiti-form.svg' alt='npm downloads' />
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

## Library Contents

### Components

- [ActivitiForm](#activitiform-component)
- ActivitiStartForm

### Services

- [FormService](#formservice)
- ActivitiAlfrescoContentService
- EcmModelService
- FormRenderingService
- NodeService
- WidgetVisibilityService

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration, see this [page](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

Follow the 3 steps below:

1. Npm

    ```sh
    npm install ng2-activiti-form --save
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

    - moment
    - ng2-translate
    - ng2-alfresco-core
    - alfresco-js-api
    - ng2-activiti-form

    Please refer to the following example file: [systemjs.config.js](demo/systemjs
    .config.js) .

## ActivitiForm Component

### Basic usage

The component shows a Form from Activiti

```html
<activiti-form [taskId]="taskId"></activiti-form>
```

Usage example of this component :

**main.ts**

```ts
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule, AlfrescoSettingsService, AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { ActivitiFormModule } from 'ng2-activiti-form';

@Component({
    selector: 'activiti-app-demo',
    template: `<activiti-form [taskId]="77501"></activiti-form>`
})

export class FormDemoComponent {

    constructor(private authService: AlfrescoAuthenticationService, private settingsService: AlfrescoSettingsService) {
        settingsService.bpmHost = 'http://localhost:9999';

        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                console.log(ticket);
            },
            error => {
                console.log(error);
            });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        ActivitiFormModule.forRoot()
    ],
    declarations: [FormDemoComponent],
    bootstrap: [FormDemoComponent]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
```

### Display form instance by task id

```html
<activiti-form 
    [taskId]="selectedTask?.id">
</activiti-form>
```

For an existing Task both form and values will be fetched and displayed.

### Display form definition by form id

```html
<activiti-form 
    [formId]="selectedFormDefinition?.id"
    [data]="customData">
</activiti-form>
```

Only form definition will be fetched.

### Display form definition by form name

```html
<activiti-form 
    [formName]="selectedFormDefinition?.name"
    [data]="customData">
</activiti-form>
```

### Display form definition by ECM nodeId

In this case the metadata of the node are showed in an activiti Form.
If there is no form definied in activiti for the type of the node,
a new form will be automaticaly created in Activiti.

```html
<activiti-form 
    [nodeId]="'e280be3a-6584-45a1-8bb5-89bfe070262e'">
</activiti-form>
```

### Display form definition by form name, and store the form field as metadata.

The param nameNode is optional.

```html
<activiti-form 
    [formName]="'activitiForms:patientFolder'"
    [saveMetadata]="true"
    [path]="'/Sites/swsdp/documentLibrary'"
    [nameNode]="'test'">
</activiti-form>
```

### Display form definition by ECM nodeId

In this case the metadata of the node are showed in an activiti Form,
and store the form field as metadata. The param nameNode is optional.

```html
<activiti-form 
    [nodeId]="'e280be3a-6584-45a1-8bb5-89bfe070262e'"
    [saveMetadata]="true"
    [path]="'/Sites/swsdp/documentLibrary'"
    [nameNode]="'test'">
</activiti-form>
```

### Configuration

#### Properties

The recommended set of properties can be found in the following table:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `taskId` | string |  | Task id to fetch corresponding form and values. |
| `formId` | string | | The id of the form definition to load and display with custom values. |
| `formName` | string | | Name of hte form definition to load and display with custom values. |
| `data` | FormValues | | Custom form values map to be used with the rendered form. |
| `showTitle` | boolean | true | Toggle rendering of the form title. |
| `showCompleteButton` | boolean | true | Toggle rendering of the `Complete` outcome button. |
| `showSaveButton` | boolean | true | Toggle rendering of the `Save` outcome button. |
| `showDebugButton` | boolean | false | Toggle debug options. |
| `readOnly` | boolean | false | Toggle readonly state of the form. Enforces all form widgets render readonly if enabled. |
| `showRefreshButton` | boolean | true | Toggle rendering of the `Refresh` button. |
| `showValidationIcon` | boolean | true | Toggle rendering of the validation icon next form title. |
| `saveMetadata` | boolean | false | Store the value of the form as metadata. |
| `path` | string |  |  Path of the folder where to store the metadata. |
| `nameNode` (optional) | string | true | Name to assign to the new node where the metadata are stored. |

##### Advanced properties
 
 The following properties are for complex customisation purposes:
 
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `form` | FormModel | | Underlying form model instance. |
| `debugMode` | boolean | false | Toggle debug mode, allows displaying additional data for development and debugging purposes. |

#### Events

| Name | Description |
| --- | --- |
| `formLoaded` | Invoked when form is loaded or reloaded. |
| `formSaved` | Invoked when form is submitted with `Save` or custom outcomes.  |
| `formCompleted` | Invoked when form is submitted with `Complete` outcome.  |
| `executeOutcome` | Invoked when any outcome is executed, default behaviour can be prevented via `event.preventDefault()` |
| `onError` | Invoked at any error |

All `form*` events receive an instance of the `FormModel` as event argument for ease of development:

**MyView.component.html**
```html
<activiti-form 
    [taskId]="selectedTask?.id"
    (formSaved)="onFormSaved($event)">
</activiti-form>
```

**MyView.component.ts**
```ts
onFormSaved(form: FormModel) {
    console.log(form);
}
```

#### Controlling outcome execution behaviour

If absolutely needed it is possible taking full control over form outcome execution by means of `executeOutcome` event. 
This event is fired upon each outcome execution, both system and custom ones.

You can prevent default behaviour by calling `event.preventDefault()`. 
This allows for example having custom form validation scenarios and/or additional validation summary presentation.

Alternatively you may want just running additional code on outcome execution without suppressing default one.

**MyView.component.html**
```html
<activiti-form 
    [taskId]="selectedTask?.id"
    executeOutcome="validateForm($event)">
</activiti-form>
```

**MyView.component.ts**
```ts
import { FormOutcomeEvent } from 'ng2-activiti-form';

export class MyView {

    validateForm(event: FormOutcomeEvent) {
        let outcome = event.outcome;
        
        // you can also get additional properties of outcomes 
        // if you defined them within outcome definition
        
        if (outcome) {
            let form = outcome.form;
            if (form) {
                // check/update the form here
                event.preventDefault();
            }
        }
    }
    
}
```

There are two additional functions that can be of a great value when controlling outcomes:

- `saveTaskForm()` - saves current form
- `completeTaskForm(outcome?: string)` - save and complete form with a given outcome name

**Please note that if `event.preventDefault()` is not called then default outcome behaviour 
will also be executed after your custom code.**

## Activiti Content Component

### Basic usage

The component shows the content preview.

```html
<activiti-content [contentId]="'1001'"></activiti-content>
```

### Configuration

#### Properties

The recommended set of properties can be found in the following table:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `contentId` | string |  | The content id to show. |

#### Events

| Name | Description |
| --- | --- |
| `contentClick` | Invoked when the content is clicked. |

## FormService

```ts
import { Component } from '@angular/core';
import { FormService, FormEvent, FormFieldEvent } from 'ng2-activiti-form';

@Component(...)
class MyComponent {

    constructor(private formService: FormService) {

        formService.formLoaded.subscribe((e: FormEvent) => {
            console.log(`Form loaded: ${e.form.id}`);
        });

        formService.formFieldValueChanged.subscribe((e: FormFieldEvent) => {
            console.log(`Field value changed. Form: ${e.form.id}, Field: ${e.field.id}, Value: ${e.field.value}`);
        });

    }

}
```

### Events

| Name | Args Type | Description |
| --- | --- | --- |
| formLoaded | FormEvent | Raised when form has been loaded or reloaded |
| formFieldValueChanged | FormFieldEvent | Raised when input values change |
| taskCompleted | FormEvent | Raised when a task is completed successfully |
| taskCompletedError | FormErrorEvent | Raised when a task is completed unsuccessfully  |
| taskSaved | FormEvent | Raised when a task is saved successfully |
| taskSavedError | FormErrorEvent | Raised when a task is saved unsuccessfully |

### Methods

| Name | Params | Returns | Description |
| --- | --- | --- | --- |
| createFormFromANode | (formName: string) | Observable\<any\> | Create a Form with a fields for each metadata properties |
| createForm | (formName: string) | Observable\<any\> | Create a Form |
| addFieldsToAForm | (formId: string, formModel: FormDefinitionModel) | Observable\<any\> | Add Fileds to A form |
| searchFrom | (name: string) | Observable\<any\> | Search For A Form by name |
| getForms | n/a | Observable\<any\> | Get All the forms |
| getProcessDefinitions | n/a | Observable\<any\> | Get Process Definitions |
| getTasks | n/a | Observable\<any\> | Get All the Tasks |
| getTask | (taskId: string) | Observable\<any\> | Get Task |
| saveTaskForm | (taskId: string, formValues: FormValues) | Observable\<any\> | Save Task Form |
| completeTaskForm | (taskId: string, formValues: FormValues, outcome?: string) | Observable\<any\> | Complete Task Form |
| getTaskForm | (taskId: string) | Observable\<any\> | Get Form related to a taskId |
| getFormDefinitionById | (formId: string) | Observable\<any\> | Get Form Definition |
| getFormDefinitionByName | (name: string) | Observable\<any\> | Returns form definition by a given name. |
| getStartFormInstance | (processId: string) | Observable\<any\> | Get start form instance for a given processId |
| getStartFormDefinition | (processId: string) | Observable\<any\> | Get start form definition for a given process |
| createTemporaryRawRelatedContent | (file: any) | Observable\<any\> | Save File |
| getRestFieldValues | (taskId: string, field: string) | Observable\<any\> |  |
| getRestFieldValuesByProcessId | (processDefinitionId: string, field: string) | Observable\<any\> |  |
| getRestFieldValuesColumnByProcessId | (processDefinitionId: string, field: string, column?: string) | Observable\<any\> |  |
| getRestFieldValuesColumn | (taskId: string, field: string, column?: string) | Observable\<any\> |  |
| getWorkflowGroups\* | (filter: string, groupId?: string) | Observable\<GroupModel[]\> |  |
| getWorkflowUsers\* | (filter: string, groupId?: string) | Observable\<GroupUserModel[]\> |  |

\* _Uses private Activiti WebApp api_

## See also

- [Form Stencils with Angular 2](docs/stencils.md)
- [Form Extensibility and Customisation](docs/extensibility.md).

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
