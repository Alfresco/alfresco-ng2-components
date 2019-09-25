---
Title: Release notes v3.3.0
---

# Alfresco Application Development Framework (ADF) version 3.3.0 Release Note

These release notes provide information about the **3.3.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.3.0).

See the [ADF roadmap](../roadmap.md) for details of features planned for future
versions of ADF. 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Form field visibility](#form-field-visibility)
    -   [Start a process with a form](#start-a-process-with-a-form)
    -   [Multilingual support for forms](#multilingual-support-for-forms)
    -   [Form validation](#form-validation)
    -   [Form variables](#form-variables)
    -   [REST source for dropdown menu on forms](#rest-source-for-dropdown-menu-on-forms)
    -   [Date format localization](#date-format-localization)
-   [Localisation](#localisation)
-   [References](#references)
-   [Issues addressed](#issues-addressed)

## New package versions

    "@alfresco/adf-content-services" : "3.3.0"
    "@alfresco/adf-process-services" : "3.3.0"
    "@alfresco/adf-core" : "3.3.0"
    "@alfresco/adf-insights" : "3.3.0",
    "@alfresco/adf-extensions": "3.3.0"

## Goals for this release

This is the third minor release since of ADF since February 2019 when version 3 was released.

This release continues to provide additional support for [Activiti 7](https://www.activiti.org/), the next generation Cloud Native implementation of Activiti.

The functionality and enhancements of this release are focused on forms. [`Form`](../../lib/process-services/src/lib/task-list/models/form.model.ts) field visibility has been improved, form validation has been implemented and it is now possible to use form variables. Multilingual support for forms has been enhanced and dropdown menus reading from a REST source have been updated. From an end-user perspective, a process can now be started using a form when the start event contains a valid form. 

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

The following are the most important features of this release:

-   [Form visibility](#form-field-visibility)
-   [Start a process with a form](#start-a-process-with-a-form)
-   [Multilingual support for forms](#multilingual-support-for-forms)
-   [Form validation](#form-validation)
-   [Forms variables](#form-variables)
-   [REST source for dropdown menu on forms](#rest-source-for-dropdown-menu-on-forms)
-   [Date format localization](#date-format-localization)

### Form field visibility

[`Form`](../../lib/process-services/src/lib/task-list/models/form.model.ts) field visibility has been improved to respect the visibility conditions configured for each field in the Modelling Application.

### Start a process with a form

The `adf-cloud-start-process` component now contains the functionality to start a process using a form. 

It is possible start a process with a form and variables:

```html
<adf-cloud-start-process 
     [appId]="YOUR_APP_ID"
     [variables]="{ 'my-key1' : 'myvalue', 'my-key2' : 'myvalue2'}">
</adf-cloud-start-process>
```

It is also possible to start a process with a form and pass in the form values at the same time:

```html
<adf-cloud-start-process 
     [appId]="YOUR_APP_ID"
     [values]="[{'name': 'firstName', 'value': 'MyName'}, {'name': 'lastName', 'value': 'MyLastName'}]">
</adf-cloud-start-process>
```

### Multilingual support for forms

In previous versions it was not possible to translate a label that was defined as part of a form. Is now possible translate form labels using i18n files. 

For example, when modelling your form you can now add a label such as `FORM.FIRSTNAME`. In your `en.json` this would be:

```json
{
  "FORM": {
    "FIRSTNAME": "First Name",
    "LASTNAME": "Last Name"
  }
}
```

and in your `it.json`:

```json
{
  "FORM": {
    "FIRSTNAME": "Nome",
    "LASTNAME": "Cognome"
  }
}
```

Your app will now change the label of the form using the translations files.                   

### Form validation

[`Form`](../../lib/process-services/src/lib/task-list/models/form.model.ts) validation will now display whether a form is valid or invalid. 

### Form variables

[`Form`](../../lib/process-services/src/lib/task-list/models/form.model.ts) variables can now assigned to forms. When creating an application that contains a form, variables can be assigned and will correctly display as the appropriate values when the form is launched.

### REST source for dropdown menu on forms

It is now possible to create a form that contains a dropdown widget that is configured to use a REST Service to populate its values.

### Date format localization

Date formats can now be localized in ADF. By default all dates are localized to `en-US`. This can be changed by adding the localization files provided by Angular. For more information refer to the [internationalization user guide](../user-guide/internationalization.md)

All components have also been refactored to use the same date format and we have created a new [localized date pipe](../core/pipes/localized-date.pipe.md) to format dates and change locales.

## Localisation

This release includes: Arabic, Brazilian Portuguese, Czech, Danish, Dutch, Finnish, French, German, Italian, Japanese, Norwegian (Bokmål), Polish, Russian, Simplified Chinese, Spanish and Swedish versions.

## References

The following is a brief list of references to help you get started with the new release:

-   [Getting started guides with Alfresco Application Development Framework](https://community.alfresco.com/community/application-development-framework/pages/get-started)
-   [Alfresco ADF Documentation on the Builder Network](../README.md)
-   [Gitter chat supporting Alfresco ADF](https://gitter.im/Alfresco/alfresco-ng2-components)
-   [ADF examples on GitHub](https://github.com/Alfresco/adf-examples)
-   [Official GitHub Project - alfresco-ng2-components](https://github.com/Alfresco/alfresco-ng2-components)
-   [Official GitHub Project - alfresco-js-api](https://github.com/Alfresco/alfresco-js-api)
-   [Official GitHub Project - generator-ng2-alfresco-app](https://github.com/Alfresco/generator-ng2-alfresco-app)

Please refer to the [official documentation](http://docs.alfresco.com/) for further details and suggestions.

## Issues addressed

The following is the list of JIRA issues that were closed for this release:

<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4618'>ADF-4618</a>] -         Update the tutorial on RTL languages support
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4653'>ADF-4653</a>] -         Creating the npm audit report
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4655'>ADF-4655</a>] -         Review the documentation for the release
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4656'>ADF-4656</a>] -         Release note for version 3.3.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4657'>ADF-4657</a>] -         Tutorial on how to upgrade from ADF 3.2.1 to ADF 3.3.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4658'>ADF-4658</a>] -         Update the compatibility matrix
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4659'>ADF-4659</a>] -         Generate the list of third party Open Source components
</li>
</ul>
    
<h2>        Feature
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3126'>ADF-3126</a>] -         Automatic translation support for Info Drawer
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4127'>ADF-4127</a>] -         Claim a task on the new generation of BPM engines
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4342'>ADF-4342</a>] -         Date Format in ADF should be centralised
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4349'>ADF-4349</a>] -         Cloud - task-form-component - Create a new component 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4527'>ADF-4527</a>] -         Create a reusable HTML block for the buttons in the task form cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4543'>ADF-4543</a>] -         Language Menu - set text orientation
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4544'>ADF-4544</a>] -         Cloud Task From - Refresh the buttons and form after an action is complete
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4545'>ADF-4545</a>] -         Context Menu - RTL support
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4550'>ADF-4550</a>] -         Get the repository from the Process Storage instead of the app.config.jsonTask
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4558'>ADF-4558</a>] -         Dialogs - RTL support
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4631'>ADF-4631</a>] -         Start Process Cloud - Ability to start a process with a form as start event
</li>
</ul>
                                                                            
<h2>        Story
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4375'>ADF-4375</a>] -         Simplifying the development of ADF Extensions
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4377'>ADF-4377</a>] -         Simplifying the deployment of ADF Extensions
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4484'>ADF-4484</a>] -         Quick themable Snackbar notifications
</li>
</ul>
                                                                                                                                                                    
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-1559'>ADF-1559</a>] -         People control is referencing the rest api instead of enterprise for pictures
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3192'>ADF-3192</a>] -         [Form] - The fields are not properly aligned
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4034'>ADF-4034</a>] -         Task list cloud - The Deleted task is changing the Status from &quot;Deleted&quot; in &quot;Canceled&quot;
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4041'>ADF-4041</a>] -         People Cloud Component - preselected values not working to be filtered by username
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4137'>ADF-4137</a>] -         PeopleCloudComponent - Use new translation key for search label
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4268'>ADF-4268</a>] -         Unable to change any other property in the Info drawer for any other file after trying to change the name to one with special characters
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4293'>ADF-4293</a>] -         The date is not displayed properly when rtl is enabled
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4314'>ADF-4314</a>] -         [Process - Cloud] - can not claim a process task without any assignee
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4338'>ADF-4338</a>] -         [Process-service-cloud] - TaskHeaderCloudComponent is using wrong date format
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4364'>ADF-4364</a>] -         The user is infinitely redirected to the file opened in viewer when clicking on close icon
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4408'>ADF-4408</a>] -         Setting copyContent to false on datatable cell html is not working as expected
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4466'>ADF-4466</a>] -         There are alignment issues in IE11 browser for Multiselect checkboxes.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4467'>ADF-4467</a>] -         Upload File Widget layout issue
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4468'>ADF-4468</a>] -         FormCloud - Not able to show a value of a form variable
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4469'>ADF-4469</a>] -         Changing the name of a file to an already existing one in the Metadata info dialog, errors in console.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4473'>ADF-4473</a>] -         Cloud Task Header - Priority should take only integer values
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4474'>ADF-4474</a>] -         Coud Form - Unable to submit form with date value
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4476'>ADF-4476</a>] -         Cloud start task and start process have different styles
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4478'>ADF-4478</a>] -         Layout container overflowing
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4488'>ADF-4488</a>] -         FormCloud - Not able to render a dropdown with a RestService bind
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4489'>ADF-4489</a>] -         Error should appear in the info drawer when trying to add illegal characters in the Name field
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4495'>ADF-4495</a>] -         Remove Alfresco Dependencies script not working properly on Linux Machine
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4498'>ADF-4498</a>] -         StickyHeader should be disabled when there is no header.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4530'>ADF-4530</a>] -         The multiple process definitions in the app are not displayed in the dropdown when creating a new Process instance.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4531'>ADF-4531</a>] -         The typeahead and filtering based on context doesn&#39;t work for the &#39;Select Process&#39; dropdown in cloud.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4546'>ADF-4546</a>] -         Visibility conditions for Form variables don&#39;t work on Multiline Widget.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4548'>ADF-4548</a>] -         The place holder text for the Dropdown widget is not displayed.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4552'>ADF-4552</a>] -         Rating component not working properly
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4564'>ADF-4564</a>] -         Yeoman&#39;s template for Activiti Cloud contains hardcoded URLs
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4569'>ADF-4569</a>] -         Fix smart build script
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4578'>ADF-4578</a>] -         Language Menu - list shows 2 Arabic entries
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4585'>ADF-4585</a>] -         Can&#39;t save the form or complete the task when the dropdown has a value saved from rest response.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4586'>ADF-4586</a>] -         DropdownCloud - form not preselecting the saved option
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4588'>ADF-4588</a>] -         Copy content not showing correctly for ellipsis cell
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4596'>ADF-4596</a>] -         Assignee field in start task is not translated to any other language
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4597'>ADF-4597</a>] -         Demo shell is not translated Czech when the app language is changed to Czech
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4612'>ADF-4612</a>] -         The linting is not working correctly in &quot;npm-build-all.sh&quot; script 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4623'>ADF-4623</a>] -         Document List row shows &quot;name&quot; instead of metadata
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4625'>ADF-4625</a>] -         Search Input does not respect RTL mode
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4626'>ADF-4626</a>] -         Breadcrumb does not respect RTL
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4634'>ADF-4634</a>] -         [APA] - Different statuses should load for Tasks than for Processes
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4636'>ADF-4636</a>] -         Datatable background only takes table height, not the entire datatable
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4637'>ADF-4637</a>] -         Login/Logout Bug from Applications/ADF
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4640'>ADF-4640</a>] -         Consumer / Contributer can not unshare a file that he shared
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4651'>ADF-4651</a>] -         Task form cloud not displayed
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4661'>ADF-4661</a>] -         The &#39;Start process&#39; and &#39;Cancel&#39; button are displayed on left instead of right.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4665'>ADF-4665</a>] -         [ADF] - Application is refreshed when you have two instances of application opened
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4667'>ADF-4667</a>] -         Document list sorting icon looks cut off in RTL
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4674'>ADF-4674</a>] -         Validation isn&#39;t working in form-cloud
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4677'>ADF-4677</a>] -         Date isn&#39;t displayed properly in DocumentList
</li>
</ul>
            
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4054'>ADF-4054</a>] -         GroupCloudService - Use composite api to fetch group roles
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4232'>ADF-4232</a>] -         e2e - filePreviewPage - expect() calls are never reached
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4288'>ADF-4288</a>] -         Automation task for ADF-3977
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4378'>ADF-4378</a>] -         Creating the adf-extension schematic
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4380'>ADF-4380</a>] -         Enhancing the compilation of plugins to make them dynamic
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4389'>ADF-4389</a>] -         Manage the case of a process definition with name property set to null
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4402'>ADF-4402</a>] -         Move component related styles from demo-shell to ADF components
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4421'>ADF-4421</a>] -          Edit task filters excluded test fix
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4442'>ADF-4442</a>] -         Create a configuration editor option to change the whole app.config.json
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4462'>ADF-4462</a>] -         Create manual and automated test for Restore version does not refresh the document list
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4477'>ADF-4477</a>] -         Add a check for end date for task header cloud tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4482'>ADF-4482</a>] -         Automation tests for Social component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4490'>ADF-4490</a>] -         Create manual and automated tests for task-form cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4496'>ADF-4496</a>] -         Share dialog should raise error notifications for unshare action
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4503'>ADF-4503</a>] -         Check coverage for Number widget
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4505'>ADF-4505</a>] -         Check coverage for Date widget
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4506'>ADF-4506</a>] -         Check coverage for Dropdown widget
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4507'>ADF-4507</a>] -         Check coverage for Amount widget
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4508'>ADF-4508</a>] -         Check coverage for Radio button widget
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4509'>ADF-4509</a>] -         Check coverage for Hyperlink widget
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4512'>ADF-4512</a>] -         Check coverage for Display value widget
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4513'>ADF-4513</a>] -         Check coverage for Display text widget
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4514'>ADF-4514</a>] -         Move widgets pages to Testing package
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4519'>ADF-4519</a>] -         Attach an ACS content to a form
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4521'>ADF-4521</a>] -         Multilingual support for forms
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4529'>ADF-4529</a>] -         Create method to automate the form editor page
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4535'>ADF-4535</a>] -         [FIX E2E] people-group-cloud-component.e2e.ts
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4536'>ADF-4536</a>] -         [FIX E2E] process-custom-filters.e2e.ts
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4538'>ADF-4538</a>] -         [FIX E2E] start-task-custom-app-cloud.e2e.ts C297675
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4540'>ADF-4540</a>] -         [FIX E2E] Task-list-properties.e2e.ts C297480 C297486 C297691
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4541'>ADF-4541</a>] -         [FIX E2E] task-form-cloud-component.e2e.ts  C307095
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4547'>ADF-4547</a>] -         Fix flaky e2e tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4576'>ADF-4576</a>] -         Remove duplicate getDeployedApplicationsByStatus service
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4579'>ADF-4579</a>] -         App Layout - RTL support
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4582'>ADF-4582</a>] -         User preference - set layout orientation based on locale
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4583'>ADF-4583</a>] -         Upload dialog - RTL support
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4584'>ADF-4584</a>] -         Header RTL styling
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4587'>ADF-4587</a>] -         Fix e2e tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4601'>ADF-4601</a>] -         DemoShell - Side navigation RTL support
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4614'>ADF-4614</a>] -         User Preference Service in Process Workspace
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4633'>ADF-4633</a>] -         MatIcon directionality
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4638'>ADF-4638</a>] -         Import the new i18n language 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4639'>ADF-4639</a>] -         ADF CLI to create the third party licenses and npm audit report
</li>
</ul>
                                
<h2>        Feature Documentation
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4435'>ADF-4435</a>] -         Information about claim and unclaim buttons is missing from task form cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4450'>ADF-4450</a>] -         Remove showSaveButton property from task form cloud component
</li>
</ul>
                                
<h2>        Feature Bug
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4309'>ADF-4309</a>] -         [Process-Cloud] - Standalone Task  - Can not claim a task after releasing it
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4311'>ADF-4311</a>] -         [Process-Cloud] - Incorrect label loaded for unclaim option -&gt; &quot;Resqueue&quot; should be &quot;Release&quot;
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4315'>ADF-4315</a>] -         [Process Cloud] - The unclaimed task remains in wrong status
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4433'>ADF-4433</a>] -         The attached form is not displayed on a standalone task
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4436'>ADF-4436</a>] -         The implementation related to claim, unclaim, complete shouldn&#39;t be part of form cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4437'>ADF-4437</a>] -         showRefreshButton property shouldn&#39;t be part of task form cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4439'>ADF-4439</a>] -         Validation icon is displayed even when the form has invalid values
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4440'>ADF-4440</a>] -         Not able to see the form on a completed task
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4441'>ADF-4441</a>] -         Save button should be disabled when form fields values are invalid
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4443'>ADF-4443</a>] -         Able to complete a task that has invalid values on the form
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4445'>ADF-4445</a>] -         showSaveButton property is missing from form-cloud component
</li>
</ul>
    
<h2>        Feature (Task)
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4568'>ADF-4568</a>] -         Automate ADF-4269 - Task of a process cannot be completed if unassigned
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4577'>ADF-4577</a>] -         Automate ADF-4389 - Should display the validation message when Process definition has name property set to null
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4580'>ADF-4580</a>] -         Automate C309878
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4600'>ADF-4600</a>] -         Automate - Should be able to filter groups based on composite roles
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4604'>ADF-4604</a>] -         Fix process-filters-cloud
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4607'>ADF-4607</a>] -         Fix task-list-properties
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4609'>ADF-4609</a>] -         Fix task-form-cloud
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4610'>ADF-4610</a>] -         Fix people-group-cloud-filter-component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4613'>ADF-4613</a>] -         Fix tag-component
</li>
</ul>

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
