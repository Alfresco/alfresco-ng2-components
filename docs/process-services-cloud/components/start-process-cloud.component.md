---
Title: Start Process Cloud Component
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-03-20
---

# [Start Process Cloud Component](../../../lib/process-services-cloud/src/lib/process/start-process/components/start-process-cloud.component.ts "Defined in start-process-cloud.component.ts")

Starts a process.

![adf-start-process](../../docassets/images/startProcess.png)

## Contents

*   [Basic Usage](#basic-usage)
*   [Class members](#class-members)
    *   [Properties](#properties)
    *   [Events](#events)
*   [Details](#details)
    *   [Starting a process with a default name and a pre-selected process definition name](#starting-a-process-with-a-default-name-and-a-pre-selected-process-definition-name)
    *   [Starting a process with variables](#starting-a-process-with-variables)
    *   [Starting a process with values passed to the form](#starting-a-process-with-values-passed-to-the-form)

## Basic Usage

```html
<adf-cloud-start-process 
   [appName]="YOUR_APP_NAME">
</adf-cloud-start-process>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| appName | `string` | "" | (required) Name of the app. |
| maxNameLength | `number` |  | Maximum length of the process name. |
| name | `string` | "" | Name of the process. |
| processDefinitionName | `string` |  | Name of the process definition. |
| showSelectProcessDropdown | `boolean` | true | Show/hide the process dropdown list. |
| values | [`TaskVariableCloud`](../../../lib/process-services-cloud/src/lib/form/models/task-variable-cloud.model.ts)`[]` |  | Parameter to pass form field values in the start form if one is associated. |
| variables | `Function` |  | Variables to attach to the payload. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| cancel | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>` | Emitted when the starting process is cancelled |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessInstanceCloud`](../../../lib/process-services-cloud/src/lib/process/start-process/models/process-instance-cloud.model.ts)`>` | Emitted when an error occurs. |
| formContentClicked | `EventEmitter<ContentLinkModel>` | Emitted when form content is clicked. |
| processDefinitionSelection | `EventEmitter<ProcessDefinitionCloud>` | Emitted when process definition selection changes. |
| success | `EventEmitter<ProcessInstanceCloud>` | Emitted when the process is successfully started. |

## Details

### Starting a process with a default name and a pre-selected process definition name

```html
 <adf-cloud-start-process 
      [appName]="YOUR_APP_NAME"
      [name]="PROCESS_NAME"
      [processDefinitionName]="PROCESS_DEFINITION_NAME">
 </adf-cloud-start-process>		 
```

You can use the `processDefinitionName` property to select which process will be selected by default on the dropdown (when there is more than one process to choose from). Use the `name` property to set the name shown on the dropdown item.

If the app contains only one process definition, this process definition will be selected by default

### Starting a process with variables

```html
 <adf-cloud-start-process 
      [appName]="YOUR_APP_NAME"
      [variables]="{ 'my-key1' : 'myvalue', 'my-key2' : 'myvalue2'}">
 </adf-cloud-start-process>		 
```

### Starting a process with values passed to the form

```html
 <adf-cloud-start-process 
      [appName]="YOUR_APP_NAME"
      [values]="[{'name': 'firstName', 'value': 'MyName'}, {'name': 'lastName', 'value': 'MyLastName'}]">
 </adf-cloud-start-process>		 
```
