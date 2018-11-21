---
Added: v3.0.0
Status: Active
Last reviewed: 2018-11-30
---

# Start Process Cloud Component

Starts a process.

![adf-start-process ](../docassets/images/startProcess.png)

## Contents

-   [Basic Usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [Details](#details)
    -   [Starting a process with a default name and pre-selected process definition name](#starting-a-process-with-a-default-name-and-pre-selected-process-definition-name)

## Basic Usage

```html
<adf-cloud-start-process 
   [appName]="YOUR_APP_NAME">
</adf-cloud-start-process>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` |  | Limit the list of processes that can be started to those contained in the specified app. |
| name | `string` | "" | (optional) Name to assign to the current process. |
| processDefinitionName | `string` |  | (optional) Definition name of the process to start. |
| showSelectProcessDropdown | `boolean` | true | (optional) Hide or show the process selection dropdown. |
| variables |  `Map<string, object>[]` |  | (optional) Variables in the input to the process. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| cancel | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessInstance`](../../lib/process-services/process-list/models/process-instance.model.ts)`>` | Emitted when the process is canceled. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessInstance`](../../lib/process-services/process-list/models/process-instance.model.ts)`>` | Emitted when an error occurs. |
| start | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ProcessInstance`](../../lib/process-services/process-list/models/process-instance.model.ts)`>` | Emitted when the process starts. |
 
## Details

### Starting a process with a default name and a pre-selected process definition name

```html
 <adf-cloud-start-process 
      [appId]="YOUR_APP_ID"
      [name]="PROCESS_NAME"
      [processDefinitionName]="PROCESS_DEFINITION_NAME">
 </adf-cloud-start-process>		 
```
You can use the `processDefinitionName` property to select which process will be selected by default on the dropdown (when there is more than one process to choose from). Use the `name` property to set the name shown on the dropdown item.

If the app contains only one process definition, this process definition will be selected by default
