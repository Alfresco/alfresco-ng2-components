# Alfresco Bpm Form component for Angular 2

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the 
necessary configuration, see this [page](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

```sh
npm install --save ng2-activiti-form
```

### Dependencies

Add the following dependency to your index.html:

```html
<script src="node_modules/alfresco-js-api/dist/alfresco-js-api.js"></script>
```

You must separately install the following libraries for your application:
 
- [ng2-translate](https://github.com/ocombe/ng2-translate)
- [ng2-alfresco-core](https://www.npmjs.com/package/ng2-alfresco-core)

```sh
npm install --save ng2-translate ng2-alfresco-core
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
#### Dialogs Polyfill

To make the dialog working with all the browser you have to add the dialog polyfill to you project:

```sh
npm install --save dialog-polyfill
```

Also make sure you include these dependencies in your `index.html` file:

```html
<!-- Polyfill(s) for dialogs -->
<script src="node_modules/dialog-polyfill/dialog-polyfill.js"></script>
<link rel="stylesheet" type="text/css" href="node_modules/dialog-polyfill/dialog-polyfill.css" />
<style>
._dialog_overlay {
    position: static !important;
}
</style>
```

## Basic usage examples

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

Only form definition will be fetched

### Display form definition by form name

```html
<activiti-form 
    [formName]="selectedFormDefinition?.name"
    [data]="customData">
</activiti-form>
```

### Display form definition by ECM nodeId, in this case the metadata of the node are showed in an activiti Form. If there are no form 
definied in activiti for the type of the node, a new form will be automaticaly created in activiti.

```html
<activiti-form 
    [nodeId]="'e280be3a-6584-45a1-8bb5-89bfe070262e'">
</activiti-form>
```

### Display form definition by form name, and store the form field as metadata. The param nameNode is optional.

```html
<activiti-form 
    [formName]="'activitiForms:patientFolder'"
    [saveMetadata]="true"
    [path]="'/Sites/swsdp/documentLibrary'"
    [nameNode]="'test'">
</activiti-form>
```

### Display form definition by ECM nodeId, in this case the metadata of the node are showed in an activiti Form, and store the form field
  as metadata. The param nameNode is optional.

```html
<activiti-form 
    [nodeId]="'e280be3a-6584-45a1-8bb5-89bfe070262e'"
    [saveMetadata]="true"
    [path]="'/Sites/swsdp/documentLibrary'"
    [nameNode]="'test'">
</activiti-form>
```

## Configuration

### Properties

The recommended set of properties can be found in the following table:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| taskId | string |  | Task id to fetch corresponding form and values. |
| formId | string | | The id of the form definition to load and display with custom values. |
| formName | string | | Name of hte form definition to load and display with custom values. |
| data | `FormValues` | | Custom form values map to be used with the rendered form. |
| showTitle | boolean | true | Toggle rendering of the form title. |
| showCompleteButton | boolean | true | Toggle rendering of the `Complete` outcome button. |
| showSaveButton | boolean | true | Toggle rendering of the `Save` outcome button. |
| showDebugButton | boolean | false | Toggle debug options. |
| readOnly | boolean | false | Toggle readonly state of the form. Enforces all form widgets render readonly if enabled. |
| showRefreshButton | boolean | true | Toggle rendering of the `Refresh` button. |
| saveMetadata | boolean | false | Store the value of the form as metadata. |
| path | string |  |  Path of the folder where to store the metadata. |
| nameNode (optional) | string | true | Name to assign to the new node where the metadata are stored. |


 *   {path} string - path of the folder where the to store the metadata
 *
 *   {nameNode} string (optional) - name of the node stored, if not defined the node will be sotred with an uuid as name
#### Advanced properties
 
 The following properties are for complex customisation purposes:
 
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| form | `FormModel` | | Underlying form model instance. |
| debugMode | boolean | false | Toggle debug mode, allows displaying additional data for development and debugging purposes. |

### Events

| Name | Description |
| --- | --- |
| formLoaded | Invoked when form is loaded or reloaded. |
| formSaved | Invoked when form is submitted with `Save` or custom outcomes.  |
| formCompleted | Invoked when form is submitted with `Complete` outcome.  |
| executeOutcome | Invoked when any outcome is executed, default behaviour can be prevented via `event.preventDefault()` |
| onError | Invoked at any error |

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

## Supported form widgets

- [x] Tabs
- [x] Text
- [x] Multiline Text
- [x] Number
- [x] Checkbox
- [ ] Date
- Dropdown
  * [x] Manual
  * [x] REST service
  * [ ] Data source
- [x] Typeahead
- [ ] Amount
- [x] Radio buttons
- [x] People
- [x] Group of People
- [ ] Dynamic Table
- [x] Hyperlink
- Header
  * [x] Plain header
  * [x] Collapsible header
- [x] Attach file **
- [x] Display value
- [x] Display text

** Files may be uploaded from a user's device if the file source selected is
'Local file' or 'All sources' and 'link to files' is not selected. Alternatively
you can link to files in a configured Alfresco repository by selecting this source
explicitly from the list and making sure that 'link to files' is selected. Copying
files from Alfresco into Activiti via the control (no linking) is not currently
supported, nor is allowing the user to choose between more than one source.

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
