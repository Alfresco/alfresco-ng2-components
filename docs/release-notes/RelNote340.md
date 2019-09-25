---
Title: Release notes v3.4.0
---

# Alfresco Application Development Framework (ADF) version 3.4.0 Release Note

These release notes provide information about the **3.4.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.4.0).

See the [ADF roadmap](../roadmap.md) for details of features planned for future
versions of ADF. 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Form field visibility](#form-field-visibility)
    -   [Preference service](#preference-service)
    -   [Forms in standalone tasks](#forms-in-standalone-tasks)
    -   [Angular and Material upgrade](#angular-and-material-upgrade)
-   [Localisation](#localisation)
-   [References](#references)
-   [Issues addressed](#issues-addressed)

## New package versions

    "@alfresco/adf-content-services" : "3.4.0"
    "@alfresco/adf-process-services" : "3.4.0"
    "@alfresco/adf-core" : "3.4.0"
    "@alfresco/adf-insights" : "3.4.0",
    "@alfresco/adf-extensions": "3.4.0"

## Goals for this release

This is the fourth minor release of ADF since February 2019 when version 3.0.0 was released.

The highlights of this release include additional support for [Activiti 7](https://www.activiti.org/) and an Angular Material upgrade. 

Further enhancements have been made to forms in this release including improvements to form field visibility and the ability to attach forms to standalone tasks. End users can now also take advantage of the preference service to store custom filters for task and process lists and have them accessible between different sessions and devices. 

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

The following are the most important features of this release:

-   [Form visibility](#form-field-visibility)
-   [Preference service](#preference-service)
-   [Forms in standalone tasks](#forms-in-standalone-tasks)
-   [Angular Material upgrade](#angular-material-upgrade)

### Form field visibility

Visibility conditions form fields has been enhanced to cover additional use cases within the Modeling Application. In this release of ADF the relevant components have been updated to support this new set of capabilities.

### Preference service

The [edit process filter cloud component](https://www.alfresco.com/abn/adf/docs/process-services-cloud/components/edit-process-filter-cloud.component/) and [edit task filter cloud component](https://www.alfresco.com/abn/adf/docs/process-services-cloud/components/edit-task-filter-cloud.component/) were introduced in a previous release of ADF to support custom filters for end users. The limitation of the components was that the filters were stored in a user's local browser storage and only available until that session expired.

In this release a server side preference service now stores that information, so that task and process list filters can be stored on a user-by-user basis and be made available between sessions and devices.

**Note** This functionality is not available in the community edition, Activiti Cloud. Custom filters are still stored in the local browser storage for community implementations.

### Forms in standalone tasks

Forms can now be used in standalone tasks and not just those that form part of a user task within a process. To be able to use a form in a standalone task, the modeler needs to explicitly allow it during its design. 

The following is an example JSON of a form definition with the new boolean property `standAlone` which toggles whether the form is available to attach to standalone tasks:

```json
{
    "formRepresentation": {
        "id": "form-5601d74a-77b6-4fc5-88b3-3bdcd1e914cc",
        "name": "holiday-request-form",
        "description": "A form to request leave",
        "version": 2,
        "standAlone": true,
        "formDefinition": {
        ...
```

### Angular and Material upgrade

ADF has been updated to :

    - @angular/material*  7.3.7
    - @angular/* 7.2.15

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

<h2>        Documentation
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4776'>ADF-4776</a>] -         Release note for version 3.4.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4777'>ADF-4777</a>] -         Creating the npm audit report for ADF 3.4.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4778'>ADF-4778</a>] -         Generate the list of third party Open Source components for 3.4.0
</li>
</ul>
    
<h2>        Feature
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4461'>ADF-4461</a>] -         Form Cloud - Refactor the formService and split validation responsibility
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4590'>ADF-4590</a>] -         Cloud start task - Change the model
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4694'>ADF-4694</a>] -         Not able to attach multiple files from ACS repository with an attach file widget 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4699'>ADF-4699</a>] -         Allow a form to be used (or not used) in standalone tasks
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4731'>ADF-4731</a>] -         [Process - Cloud] - Improve IdentityUserService
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4755'>ADF-4755</a>] -         [CardViewDate&amp;SelectItemComponent] Provide a way to reset date and add None option as default.
</li>
</ul>
                                                                            
<h2>        Story
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4614'>ADF-4614</a>] -         User preferences in process filters
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4711'>ADF-4711</a>] -         User preferences in task filters
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4713'>ADF-4713</a>] -         Number formatting for ADF based applications
</li>
</ul>
                                                                                                                                                                        
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4041'>ADF-4041</a>] -         People Cloud Component - preselected values not working to be filtered by username
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4314'>ADF-4314</a>] -         [Process - Cloud] - can not claim a process task without any assignee
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4424'>ADF-4424</a>] -         Password dialog does not close when pressing Escape
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4480'>ADF-4480</a>] -         Viewer shows endless spinner for unsupported files
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4574'>ADF-4574</a>] -         The form variable value is not displayed in a display value widget
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4635'>ADF-4635</a>] -         [APA] - The Status drop-down is looking different for Processes than for Tasks
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4682'>ADF-4682</a>] -         The Date is not saved correctly on Process-services form.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4696'>ADF-4696</a>] -         &quot;Ownable&quot; and &quot;Lockable&quot; aspect Owner property is incorrectly displayed
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4704'>ADF-4704</a>] -         Unreliable unit tests - StartProcessCloudComponent
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4709'>ADF-4709</a>] -         Fix travis run on the App Generator
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4715'>ADF-4715</a>] -         Fix filter processes - remove CREATED status
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4716'>ADF-4716</a>] -         Dynamic Table not working properly (regression)
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4717'>ADF-4717</a>] -         Unreliable e2e tests - process-filter-results.e2e.ts
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4720'>ADF-4720</a>] -         FormFieldModel - Error loaded: TypeError: Cannot read property &#39;find&#39; of undefined
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4721'>ADF-4721</a>] -         Date not properly displayed in date picker and date time picker
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4722'>ADF-4722</a>] -         Wrong date is displayed when updating row of dynamic table
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4726'>ADF-4726</a>] -         File Size header not aligned with cell content below
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4729'>ADF-4729</a>] -         AboutComponent - doesn&#39;t work in case the versions.json is in a subdomain
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4732'>ADF-4732</a>] -         Breadcrumb folder names do not shrink when path is too long to fit the screen
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4754'>ADF-4754</a>] -         Fix Date related e2e tests on ADF
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4756'>ADF-4756</a>] -         Fix Content services e2e tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4758'>ADF-4758</a>] -         Can not complete a task that has an invisible field on a form with a value
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4765'>ADF-4765</a>] -         The form rendering components should not consider text and date as equals when they both have same value
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4774'>ADF-4774</a>] -         Field remains visible when having visibility condition of 2 checkboxes that are not equal
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4775'>ADF-4775</a>] -         Form date fields - Incorrect validation for date fields - Only YYYY-MM-DD date display format is working 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4782'>ADF-4782</a>] -         Visibility condition chaining is not working on ADF
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4788'>ADF-4788</a>] -         Form with Date widget with assigned process variable failing to complete
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4790'>ADF-4790</a>] -         Field is visible when visibility condition between a checkbox field and a value/variable is false
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4791'>ADF-4791</a>] -         Form - Visibility conditions not working correctly when comparing two empty fields
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4792'>ADF-4792</a>] -         Unable to instantiate a basic process instance with the attached project.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4793'>ADF-4793</a>] -         The filters don&#39;t work on community-edition.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4795'>ADF-4795</a>] -         The form is editable after completing the task in aps1.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4800'>ADF-4800</a>] -         The datetime is saved an hour less when completing a form task in Process Services APS1
</li>
</ul>
            
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4026'>ADF-4026</a>] -         Implement edit process filters automated tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4426'>ADF-4426</a>] -         Move CSS overrides from ACA to ADF - 2nd round
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4448'>ADF-4448</a>] -         Automate - Should be able to start a task with a form
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4457'>ADF-4457</a>] -         Clear AppConfigService from StorageService (and static import of app.config.json?)
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4592'>ADF-4592</a>] -         Remove e2e tests that are automating &quot;demo shell&quot; features
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4594'>ADF-4594</a>] -         Disable Animations Module for e2e testing
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4642'>ADF-4642</a>] -         Add unit test to test the typeahead filtering unit test on start process cloud.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4647'>ADF-4647</a>] -         Implement Download Service
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4660'>ADF-4660</a>] -         Automate ADF-3883 - Testing the various Process Filter results.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4671'>ADF-4671</a>] -         Automate - C311277 Start Process Cloud - Should be able to start a process with a form as start event
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4684'>ADF-4684</a>] -         Content Metadata Card dates should be localised
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4687'>ADF-4687</a>] -         Automate C311280 - Task header cloud component will pick up the default date format specified in the app configuration
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4697'>ADF-4697</a>] -         Automate - attach content to process-cloud task form using upload widget.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4698'>ADF-4698</a>] -         Automate C311296 - Should be able to attach single or multiple files through externally defined content link
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4705'>ADF-4705</a>] -         [Testing]Automate forms manual test cases for checkbox widget 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4707'>ADF-4707</a>] -         ContentNodeSelectorComponent Search doesn&#39;t include Properties
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4710'>ADF-4710</a>] -         Apply the new VisibilityCondition format in ADF components
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4733'>ADF-4733</a>] -         AdfCli - Create a dispatcher command to run commands
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4734'>ADF-4734</a>] -         Update documentation for task list and process list filters
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4737'>ADF-4737</a>] -         Use local fonts when running e2e tests and demo shell
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4745'>ADF-4745</a>] -         Review and fix subscription/memory leaks
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4746'>ADF-4746</a>] -         AdfCli - Create a command for kubectl
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4747'>ADF-4747</a>] -         [Testing]Change the file used for automation tests on ADF for form visibility on cloud
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4773'>ADF-4773</a>] -         [ADF-E2E] Fixing failing tests in Process Services Cloud
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4784'>ADF-4784</a>] -         Release 3.4 - Translation keys
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4786'>ADF-4786</a>] -         AdfCli - Expose a kubectl command to delete pods based on label
</li>
</ul>
                                                                    
<h2>        Feature (Task)
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4701'>ADF-4701</a>] -         Upgrade angular material to latest non-breaking change version - 7.3.7
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4735'>ADF-4735</a>] -         Automation test visibility condition for APS1 
</li>
</ul>

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
