---
Title: Release notes v3.2.0
---

# Alfresco Application Development Framework (ADF) version 3.2.0 Release Note

These release notes provide information about the **3.2.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.2.0).

See the [ADF roadmap](../roadmap.md) for details of features planned for future
versions of ADF. 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [More on Activiti 7](#more-on-activiti-7)
    -   [Five more languages available](#five-more-languages-available)
    -   [List separator configuration in multi-value metadata](#list-separator-configuration-in-multi-value-metadata)
    -   [Option to chose which panel to show first in info drawer](#option-to-chose-which-panel-to-show-first-in-info-drawer)
    -   [Confirm Dialog third extra button option and  custom HTML message](#confirm-dialog-third-extra-button-option-and--custom-html-message)
    -   [Configuration option to change the default viewer zoom](#configuration-option-to-change-the-default-viewer-zoom)
    -   [Drop events for DataTable component](#drop-events-for-datatable-component)
    -   [Sidenav Layout Direction property](#sidenav-layout-direction-property)
    -   [Custom local storages prefix property](#custom-local-storages-prefix-property)
    -   [Datatable Component new  Json cell type](#datatable-component-new--json-cell-type)
-   [Localisation](#localisation)
-   [References](#references)
-   [Issues addressed](#issues-addressed)

## New package versions

    "@alfresco/adf-content-services" : "3.2.0"
    "@alfresco/adf-process-services" : "3.2.0"
    "@alfresco/adf-core" : "3.2.0"
    "@alfresco/adf-insights" : "3.2.0",
    "@alfresco/adf-extensions": "3.2.0"

## Goals for this release

This is the second minor release since ADF version 3 which was released in February 2019.

This release goes a step further in the direction of complete support for [Activiti 7](https://www.activiti.org/), the next generation Cloud Native implementation of Activiti. Also, some enhancements have been introduced to the Metadata viewer to properly manage multi-value properties, together with the event handling during header row action, to properly manage use cases like the drag & drop feature, requested from some developers.

We are pleased to announce that starting from ADF 3.2, five more languages are now supported, together with the other ten. The new languages are: Danish, Finnish, Swedish, Czech, Polish.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

Below are the most important new features of this release:

-   [More on Activiti 7](#more-on-activiti-7)
-   [Five more languages supported](#five-more-languages-supported)
-   [Event handling during header row action](#event-handling-during-header-row-action)
-   [List separator configuration in multi-value metadata](#list-separator-configuration-in-multi-value-metadata)

### More on Activiti 7

In ADF 3.0.0 (released in February) we announced the introduction of the new `*Cloud` package. This contains a set of components to support [Activiti 7](https://www.activiti.org/), the next generation Cloud Native implementation of Activiti BPM Engine. With the ADF 3.2 release, the journey continues with more supported features, like:

#### Task Form component

This component is responsible to show the form renderer in case the task has a form attached or the standard standalone card with the Claim/Release/Complete buttons.

```html
<adf-cloud-task-form 
    [appName]="appName"
    [taskId]="taskId">
</adf-cloud-task-form>
```

For more details refer to the:

-   [`TaskFormCloudComponent`](../process-services-cloud/components/task-form-cloud.component.md).

#### Form Cloud

This component is responsible to render the form cloud definition attached to the task.

```html
<adf-cloud-form 
    [appName]="appName"
    [taskId]="taskId">
</adf-cloud-form>
```

In case the form has an upload widget and the alfresco content has been configured\*, the attached file will be stored into the alfresco  repository.

Note\*:
Don't forget to set the `providers` property to `ALL`  and `ecmHost` value in the `app.config.json`.
e.g.

```json
"ecmHost": "http://alfrescocontent.example.com",
"bpmHost": "http://alfrescoaps2.example.com",
"providers": "ALL"
```

For more details refer to the:

-   [`FormCloudComponent`](../process-services-cloud/components/form-cloud.component.md).

#### New permission template to app list

A new message template is now displayed  when a user doesn't have  permissions 

#### Cloud form definition selector component

Cloud form definition selector component is a dropdown that shows all the form present in your app.

```html
<adf-cloud-form-definition-selector
    [appName]="'simple-app'"
    (selectForm)="onFormSelect($event)">
</adf-cloud-form-definition-selector>
```

For more details refer to the:

-   [`FormDefinitionSelectorCloudComponent`](../process-services-cloud/components/form-definition-selector-cloud.component.md).

#### Start a standalone task with a form

The start task cloud is now using the `cloud-form-definition-selector` that allows the user to attach a form to a task

### Five more languages available

Starting from ADF 3.2, five more languages are now available, together with the other ten already in the list. The new languages supported are: Danish, Finnish, Swedish, Czech, Polish.

### List separator configuration in multi-value metadata

As of this version of ADF, developers can configure the list separator of multi-value properties into the metadata viewer. Since this version of ADF, to customize the separator you can set it in your `app.config.json` file inside your `content-metadata` configuration. Below an example.

```json
"content-metadata": {
    "presets": {
        ...
    },
    "multi-value-pipe-separator" : " - "
}
```

For more details refer to the:

-   [Content Metadata Card component](../content-services/components/content-metadata-card.component.md) 

### Option to chose which panel to show first in info drawer

Is now possible define which aspect show expanded by default in the metadata card applying the optional property `displayAspect`

![feature-1](https://user-images.githubusercontent.com/14145706/56648273-a45efd80-66a0-11e9-866b-4f13c7df4b80.gif)

For more details refer to the:

-   [Content Metadata Card component](../content-services/components/content-metadata-card.component.md) 

### Confirm Dialog third extra button option and  custom HTML message

Is now possible add an extra button in the Confirm Dialog

#### Dialog inputs

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| title | `string` | `Confirm` | It will be placed in the dialog title section. |
| yesLabel | `string` | `yes` | It will be placed first in the dialog action section |
| noLabel | `string` | `no` | It will be placed last in the dialog action section |
| thirdOptionLabel (optional) | `string` |  | It is not a mandatory input. it will be rendered in between yes and no label |
| message | `string` | `Do you want to proceed?` | It will be rendered in the dialog content area |
| htmlContent | `HTML` |  | It will be rendered in the dialog content area |

![yes-all](https://user-images.githubusercontent.com/14145706/56139451-87e30700-5fb6-11e9-8121-e58008231df2.png)

For more details refer to the:

-   [Confirm Dialog](../content-services/dialogs/confirm.dialog.md) 

### Configuration option to change the default viewer zoom

You can set a default zoom scaling value for pdf viewer by adding the following code in `app.config.json`.
Note: For the pdf viewer the value has to be within the range of 25 - 1000.

```json
 "adf-viewer": {
      "pdf-viewer-scaling": 150
    }
```

In the same way, you can set a default zoom scaling value for the image viewer by adding the following code in `app.config.json`.

```json
 "adf-viewer": {
      "image-viewer-scaling": 150
    }
```

By default, the viewer's zoom scaling is set to 100%.

For more details refer to the:

-   [Viewer Component](../docs/core/components/viewer.component.md) 

### Drop events for DataTable component

#### Drop Events

Below are the four new DOM events emitted by the DataTable component.
These events bubble up the component tree and can be handled by any parent component.

| Name | Description |
| ---- | ----------- |
| header-dragover | Raised when dragging content over the header. |
| header-drop | Raised when data is dropped on the column header. |
| cell-dragover | Raised when dragging data over the cell. |
| cell-drop | Raised when data is dropped on the column cell. |

#### Drop Events

All custom DOM events related to `drop` handling expose the following interface:

```ts
export interface DataTableDropEvent {
    detail: {
        target: 'cell' | 'header';
        event: Event;
        column: DataColumn;
        row?: DataRow
    };

    preventDefault(): void;
}
```

Note that `event` is the original `drop` event,
and `row` is not available for Header events.

According to the [HTML5 Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API),
you need to handle both `dragover` and `drop` events to handle the drop correctly.

Given that DataTable raises bubbling DOM events, you can handle drop behavior from the parent elements as well:

```html
<div
    (header-dragover)="onDragOver($event)"
    (header-drop)="onDrop($event)"
    (cell-dragover)="onDragOver($event)"
    (cell-drop)="onDrop($event)">
    
    <adf-datatable [data]="data">
    </adf-datatable>
</div>
```

### Sidenav Layout Direction property

If you use the  [Sidenav Layout component](../core/components/sidenav-layout.component.md) you can  choose set the direction property in it using the property direction ans set it to **'rtl'**

```html
<adf-sidenav-layout
   [direction]="'rtl'">
......
</adf-sidenav-layout>
```

![preview](https://user-images.githubusercontent.com/3947156/55820667-507ee100-5b04-11e9-81ee-a9951982b237.gif)

### Custom local storages prefix property

 If you are using multiple ADF apps, you might want to set the following configuration so that the apps have specific storages and are independent of others when setting and getting data from the local storage.

 In order to achieve this, you will only need to set your app identifier under the `storagePrefix` property of the app in your `app.config.json` file.

```json
"application": {
   "storagePrefix": "ADF_Identifier"
}
```

### Datatable Component new  Json cell type

The datale is now able to render in a better way JSON text :

Show Json formated value inside datatable component.

```html
<adf-datatable ...>
  <data-columns>
       <data-column key="entry.json" type="json" title="Json Column"></data-column>
   </data-columns>
</adf-datatable>
```

## Localisation

This release includes: French, German, Italian, Spanish, Arabic, Japanese, Dutch, Norwegian (Bokmål), Russian, Danish, Finnish, Swedish, Czech, Polish, Brazilian Portuguese and Simplified Chinese versions.

## References

Below is a brief list of references to help you start using the new release:

-   [Getting started guides with Alfresco Application Development Framework](https://community.alfresco.com/community/application-development-framework/pages/get-started)
-   [Alfresco ADF Documentation on the Builder Network](../README.md)
-   [Gitter chat supporting Alfresco ADF](https://gitter.im/Alfresco/alfresco-ng2-components)
-   [ADF examples on GitHub](https://github.com/Alfresco/adf-examples)
-   [Official GitHub Project - alfresco-ng2-components](https://github.com/Alfresco/alfresco-ng2-components)
-   [Official GitHub Project - alfresco-js-api](https://github.com/Alfresco/alfresco-js-api)
-   [Official GitHub Project - generator-ng2-alfresco-app](https://github.com/Alfresco/generator-ng2-alfresco-app)

Please refer to the [official documentation](http://docs.alfresco.com/) for further details and suggestions.

## Issues addressed

Below is the list of JIRA issues that were closed for this release.

<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4356'>ADF-4356</a>] -         How to build an ADF application on top of Activiti 7 Community Edition
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4391'>ADF-4391</a>] -         Doc review for 3.2
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4413'>ADF-4413</a>] -         Activiti 7 and ADF tutorial
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4414'>ADF-4414</a>] -         Release note for version 3.2.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4415'>ADF-4415</a>] -         Create the list of third party Open Source components for ADF 3.2 release
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4416'>ADF-4416</a>] -         Create the upgrade guide from ADF 3.1 to ADF 3.2 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4417'>ADF-4417</a>] -         Update the compatibility matrix for ADF 3.2
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4429'>ADF-4429</a>] -         Process List Cloud - Remove the pagination parameters
</li>
</ul>
    
<h2>        Feature
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3794'>ADF-3794</a>] -         Update individual rows without reloading DocumentList
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3887'>ADF-3887</a>] -         Using multiple ADF apps from the same browser/user
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3912'>ADF-3912</a>] -         Document-List is not able to retrieve the -file-plan- information from the node
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4128'>ADF-4128</a>] -         Task Cloud completion/back
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4213'>ADF-4213</a>] -         Event handling during header row action.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4219'>ADF-4219</a>] -         List separator configuration in multi-value metadata
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4327'>ADF-4327</a>] -         Confirm Dialog does not support template injection
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4328'>ADF-4328</a>] -         Storage Service should stream the values when they are changed
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4340'>ADF-4340</a>] -         APW - Form - Upload a file from a form
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4349'>ADF-4349</a>] -         Cloud - task-form-component - Create a new component 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4359'>ADF-4359</a>] -         Add the possibility to chose wich panel to show first in info-drawer
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4362'>ADF-4362</a>] -         No-growing cells on Datatable component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4409'>ADF-4409</a>] -         Cloud - Make sure ADF is compatible with activiti 7 community and enterprise
</li>
</ul>
                                                                        
<h2>        Epic
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-1452'>ADF-1452</a>] -         Documentation
</li>
</ul>
    
<h2>        Story
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3797'>ADF-3797</a>] -         Task management view - Task with Form
</li>
</ul>
                                                                                                                                                                
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-1954'>ADF-1954</a>] -         [IE11] Breadcrumbs are not well aligned
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3228'>ADF-3228</a>] -         User can access the version manager dialog for a locked file
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3678'>ADF-3678</a>] -         Custom Process Filter - Different results in APS than in ADF 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3934'>ADF-3934</a>] -         People Cloud Component - Remove the concept of assignee
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3969'>ADF-3969</a>] -         ADF - Start Task page, fields are not properly aligned.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3983'>ADF-3983</a>] -         [App List ] - Should be displayed a message to inform the user that has no application
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4043'>ADF-4043</a>] -         [Demo Shell] People Cloud Component -  Roles are displayed once with &#39; &#39; and once with &quot; &quot; 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4093'>ADF-4093</a>] -         Activiti Cloud - EditProcessFilter - the status are not correct
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4096'>ADF-4096</a>] -         TaskList Cloud component is missing fileName attribute 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4142'>ADF-4142</a>] -         ProcessDefinitionKey is not exposed by the edit task cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4193'>ADF-4193</a>] -         SearchQueryBuilderService - execute() error handling
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4198'>ADF-4198</a>] -         &#39;Escape&#39; key doesn&#39;t work to close the User Profile dialog.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4216'>ADF-4216</a>] -         Recently uploaded files are missing &#39;ago&#39; in the Created column.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4242'>ADF-4242</a>] -         Inconsistent format date for process and task header components
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4250'>ADF-4250</a>] -         Improve Error Component to display more accurate info about errors
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4263'>ADF-4263</a>] -         [EditProcessFilterCloudComponent] Unit tests are failing.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4270'>ADF-4270</a>] -         Empty value is displayed on name field when checking the details of a process without name
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4273'>ADF-4273</a>] -         Decide if description field of process header cloud component needs to be removed 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4274'>ADF-4274</a>] -         Group Cloud component - the group is not preselected and is still displayed in the dropdown.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4275'>ADF-4275</a>] -         People Cloud Component: Preselect validation on User Id doesn&#39;t work.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4303'>ADF-4303</a>] -         [Process Cloud] Start Process - Can not complete a task with the assigned user
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4307'>ADF-4307</a>] -         processDefinitionKey property is not supported by sort edit task
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4321'>ADF-4321</a>] -         Not able to filter by taskId in edit task filter cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4334'>ADF-4334</a>] -         Editing a multi-valued content property causes it to be stored as a single value (rather than a multi-value collection)
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4339'>ADF-4339</a>] -         The rows in documentList are not properly aligned on IE11
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4343'>ADF-4343</a>] -         Host Settings Dialog closes on Enter key pressed
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4352'>ADF-4352</a>] -         When the SSO identity service is wrongly configured no login error message is displayed
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4357'>ADF-4357</a>] -         Cannot complete a task with the assigned user
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4360'>ADF-4360</a>] -         Ellipsis not working on Date Cell
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4361'>ADF-4361</a>] -         [Accessibility]On Login page, the user is not able to navigate using tab key
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4363'>ADF-4363</a>] -         Cloud page layout broken
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4371'>ADF-4371</a>] -         CLONE - [Upload new version] File is completely deleted when user cancels the upload
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4372'>ADF-4372</a>] -         Json type Date Column breaks datatable layout when json is too long
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4374'>ADF-4374</a>] -         Fix Sticky Header Feature in Datatable Component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4386'>ADF-4386</a>] -         fix style for CopyContentDirective 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4393'>ADF-4393</a>] -         TaskDetails - Remove readOnly property from TaskDetailsCloud
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4400'>ADF-4400</a>] -         CLONE - Restore version does not refresh the document list
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4401'>ADF-4401</a>] -         Nested &#39;adf-datatable-cell&#39; items cause display &amp; functional issues
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4403'>ADF-4403</a>] -         Adf clipboard directive - It should have a default placeholder/Position
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4404'>ADF-4404</a>] -         Type ahead form control does not work for URLs
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4405'>ADF-4405</a>] -         Copy link to share not working
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4418'>ADF-4418</a>] -         [Demo-Shell][Cloud]The task is not completed when clicking on complete button
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4420'>ADF-4420</a>] -         End date is empty when task is completed on task header cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4430'>ADF-4430</a>] -         The error message on metadata property with valid value is still displayed if it had once an invalid value
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4432'>ADF-4432</a>] -         TaskFormCloudComponent - should be read only if the task is unclaimed
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4434'>ADF-4434</a>] -         Custom Empty Content Template message is not centered.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4455'>ADF-4455</a>] -         Remove whitespace in multivalue metadata fields
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4460'>ADF-4460</a>] -         Can&#39;t complete task with an empty upload file widget
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4468'>ADF-4468</a>] -         FormCloud - Not able to show a value of a form variable
</li>
</ul>
            
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3876'>ADF-3876</a>] -         StartTaskCloud - Be able to start a task with a form
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3962'>ADF-3962</a>] -         [E2E] Automate tests for Content Services with SSO
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4028'>ADF-4028</a>] -         Automate tests for Processlist multiselect
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4046'>ADF-4046</a>] -         Automation test for copy/move file inside a folder
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4047'>ADF-4047</a>] -         Automate test for dropping file in a folder
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4059'>ADF-4059</a>] -         Automate test for copying/moving a node to a folder in a different page
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4191'>ADF-4191</a>] -         Fix and enable the viewer tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4272'>ADF-4272</a>] -         Datatable - Create a new directive to copy/paste cells text
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4277'>ADF-4277</a>] -         Automate C305041- Should filter the People and Groups with the Application name filter.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4278'>ADF-4278</a>] -         Automate C305033 - Should fetch the preselect users
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4279'>ADF-4279</a>] -         AAA - LandingPage layout not aligned 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4292'>ADF-4292</a>] -         Create manual test cases and automate them for new process list properties
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4295'>ADF-4295</a>] -         AuthGuardSSO - Provide a way to validate the client role
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4298'>ADF-4298</a>] -         Automate tests for Info Drawer 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4302'>ADF-4302</a>] -         Move the cloud folder inside app-layout into components folder
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4308'>ADF-4308</a>] -         Add another property on DataColumnComponent to render json data
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4310'>ADF-4310</a>] -         Add manual and automated test cases for edit task filter cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4312'>ADF-4312</a>] -         Update backend CS in terraform
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4320'>ADF-4320</a>] -         Move cloud folder in root
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4323'>ADF-4323</a>] -         Add style fixes from ACA
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4335'>ADF-4335</a>] -         Update webdriver-manager before running the e2e tests inside test-e2e-lib.sh script
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4336'>ADF-4336</a>] -          Move APS Cloud pages to adf-test
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4337'>ADF-4337</a>] -         Automate ADF-4048
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4344'>ADF-4344</a>] -         Fix cloud automated tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4350'>ADF-4350</a>] -         Fix failing e2e tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4351'>ADF-4351</a>] -         Change APS2 services url pattern form -service/ to /service/
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4354'>ADF-4354</a>] -         Fix failing cloud tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4365'>ADF-4365</a>] -         [e2e] Create startTaskCloudComponent page in @adf-testing package
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4383'>ADF-4383</a>] -         Update the documentation for Edit Process Filter Cloud Component.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4384'>ADF-4384</a>] -         Support custom filters with Recent Files source
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4387'>ADF-4387</a>] -         Configuration option to change the default image zoom
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4406'>ADF-4406</a>] -         Confirm Dialog doesn&#39;t support a third extra button option to be customised
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4410'>ADF-4410</a>] -         CLONE - Upload dialog - version upload
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4411'>ADF-4411</a>] -         Create script to remove Alfresco dependencies
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4422'>ADF-4422</a>] -         Fix Should display processes ordered by id when Id  test 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4447'>ADF-4447</a>] -         Automate C307975
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4451'>ADF-4451</a>] -         Automate Event handling during header row action.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4454'>ADF-4454</a>] -         Map upload field to UploadCloudWidget in task cloud form 
</li>
</ul>
                                                                
<h2>        Feature Bug
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4311'>ADF-4311</a>] -         [Process-Cloud] - Incorrect label loaded for unclaim option -&gt; &quot;Resqueue&quot; should be &quot;Release&quot;
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4394'>ADF-4394</a>] -         JSON is not supported.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4423'>ADF-4423</a>] -         Copy Content tooltip is not displayed correctly
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4433'>ADF-4433</a>] -         The attached form is not displayed on a standalone task
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4437'>ADF-4437</a>] -         showRefreshButton property shouldn&#39;t be part of task form cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4444'>ADF-4444</a>] -         Upload Drag&amp;Drop area is not working properly
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4445'>ADF-4445</a>] -         showSaveButton property is missing from form-cloud component
</li>
</ul>
    
<h2>        Feature (Task)
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4241'>ADF-4241</a>] -         Automate tests for process header cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4367'>ADF-4367</a>] -         Automate test for task/process date format
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4368'>ADF-4368</a>] -         Add a way to pass json property to datatable
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4373'>ADF-4373</a>] -         Automation test for accurate error messages
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4388'>ADF-4388</a>] -         Create automated tests for Id in edit task filter cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4390'>ADF-4390</a>] -         Add a way to test that the developer can use this directive by changing the data-column in demo-shell
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4396'>ADF-4396</a>] -         Automation for cancelling new version upload
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4407'>ADF-4407</a>] -         Automate test for user without permission redirection
</li>
</ul>

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
