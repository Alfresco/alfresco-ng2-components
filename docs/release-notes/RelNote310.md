---
Title: Release notes v3.1.0
---

# Alfresco Application Development Framework (ADF) version 3.1.0 Release Note

These release notes provide information about the **3.1.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.1.0).

If you want to be updated on the [ADF roadmap](../roadmap.md), check the public page [here](../roadmap.md). 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [More on Activiti 7](#more-on-activiti-7)
    -   [Enhanced DocumentList](#enhanced-documentList)
    -   [Enhanced Metadata viewer](#enhanced-metadata-viewer)
    -   [Search pattern highlight](#search-pattern-highlight)
    -   [Improved accessibility](#improved-accessibility)
    -   [Arabic and RTL languages support](#arabic-and-rtl-languages-support)
-   [Localisation](#localisation)
-   [References](#references)
-   [Issues addressed](#issues-addressed)
    -   [Documentation](#documentation)
    -   [Feature](#feature)
    -   [Bug](#bug)
    -   [Task](#task)
    -   [Feature Bug](#feature-bug)
    -   [Feature (Task)](#feature-task)

## New package versions

    "@alfresco/adf-content-services" : "3.1.0"
    "@alfresco/adf-process-services" : "3.1.0"
    "@alfresco/adf-core" : "3.1.0"
    "@alfresco/adf-insights" : "3.1.0",
    "@alfresco/adf-extensions": "3.1.0"

## Goals for this release

This is the first minor release after Alfresco Application Development Framework version 3, available to the developers since February 2019.

This release pushes a step further in the direction of the complete support of [Activiti 7](https://www.activiti.org/), the next generation Cloud Native implementation of Activiti. In addition to that, some enhancements has been introduced to the DocumentList and the Metadata viewer, as a consequence of some requests coming from the eco-system of developers using ADF in complex applications.

Another enhancement introduced in ADF 3.1, is about search pattern highlight, considered as relevant in Share and since this version available in ADF application as well.

In the area of [accessibility](https://en.wikipedia.org/wiki/Computer_accessibility), the new release of ADF take advantage of some bugfix and enhancements related to [Section508](https://www.section508.gov/).

Following the good amount of requests coming from the developers, we are pleased to announce the official support of Arabic and Right To Left languages in ADF applications. The benefit for the market is clear, opening to a broader number of potential users and use cases.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

Below are the most important new features of this release:

-   [More on Activiti 7](#more-on-activiti-7)
-   [Enhanced DocumentList](#enhanced-documentList)
-   [Enhanced Metadata viewer](#enhanced-metadata-viewer)
-   [Search pattern highlight](#search-pattern-highlight)
-   [Improved accessibility](#improved-accessibility)
-   [Arabic and RTL languages support](#arabic-and-rtl-languages-support)

### More on Activiti 7

In ADF 3.0.0 (released in February) we announced the introduction of the new `*Cloud` package, containing a set of components to support the [Activiti 7](https://www.activiti.org/), the next generation Cloud Native implementation of Activiti BPM Engine. With this ADF 3.1 release the journey continues with more supported features, like: 

**...add more here**

### Enhanced DocumentList

Following some suggestions from Customers and Partners, we enhanced the `DocumentList` with the possibility to have a sticky header.

**...add examples here**

### Enhanced Metadata viewer

Since this version of ADF, developers can include the full list of types/aspects into the metadata viewer, without the need to specify all of them. The limit of the previous version was that developers were requested to specify the list of types/aspects or an asterisc to say "include all". The use case represented by "include all except X, Y, Z..." was not covered and now it is.

**...add more examples here**


### Search pattern highlight

As another example of good feedback we had from the developers on the ground about improving ADF, we introduced the custom highlighting of results in search. Since ADF 3.1, developers can customize the pattern highlighting and the markers to use.

**...add examples here**

### Improved accessibility

In terms of [accessibility](https://en.wikipedia.org/wiki/Computer_accessibility), ADF version 3.1 introduces some bug fixes kindly requested from some customers and partners about [Section508](https://www.section508.gov/). Alfresco plans to introduce more enhancements from this point and view, so more improvements will be introduced in the next releases.

### Arabic and RTL languages support

Due to regular requests, we decided to support also Arabic language into ADF. In ADF 3.1 the Team introduces another additional benefit, developing a first iteration to support Right To Left languages. Starting from ADF version 3.1, it is possible to (easily) [change an ADF application to work correctly with a RTL language](../user-guide/rtl-support.md).

We are quite happy with the current support of RTL languages on ADF, but feedback are welcome if you experience something to be improved or added for a better User Experience.

## Localisation

This release includes: French, German, Italian, Spanish, Arabic, Japanese, Dutch, Norwegian (Bokmål), Russian, Brazilian Portuguese and Simplified Chinese versions.

In the next version we plan to include as supported languages also: Danish, Finnish, Swedish, Czech, Polish.

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

Below the list of JIRA issues, closed for this release.
                        
<h2>        Documentation
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-271'>ADF-271</a>] -         ADD all valid fields that the tasklist can display - 1643 Github
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-449'>ADF-449</a>] -         Missing documentation for content-action in Data table
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-588'>ADF-588</a>] -         tasks/processes  - more documentation about the available fields
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3040'>ADF-3040</a>] -         Markdown templates sometimes add whitespace incorrectly
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4008'>ADF-4008</a>] -         Add the documentation for the default columns available in adf-process-list-cloud
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4146'>ADF-4146</a>] -         How to migrate an application from ADF 2.6 to ADF 3.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4152'>ADF-4152</a>] -         Add subfolders to docs library folders to represent class types
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4160'>ADF-4160</a>] -         Clarify the behaviour of the InfoDrawer configuration for default *
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4189'>ADF-4189</a>] -         Improve `allowDropFiles` prop description for Document List docs
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4190'>ADF-4190</a>] -         Fix source file paths generated by auto-linking tools
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4228'>ADF-4228</a>] -         Tutorial on how to switch an ADF app to be able to support RTL languages
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4239'>ADF-4239</a>] -         Update introduction text
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4249'>ADF-4249</a>] -         Doc review for 3.1
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4260'>ADF-4260</a>] -         How to migrate an application from ADF 3.0 to ADF 3.1
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4262'>ADF-4262</a>] -         Release note for version 3.1.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4285'>ADF-4285</a>] -         The documentation of content metadata component is misleading
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4294'>ADF-4294</a>] -         Creating the list of third party Open Source for ADF 3.1 (to be done as last task)
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4300'>ADF-4300</a>] -         Add the sort properties for edit task cloud component
</li>
</ul>
    
<h2>        Feature
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3497'>ADF-3497</a>] -         Facet intervals on search filter
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3677'>ADF-3677</a>] -         SearchQueryBuilderService to support highlight
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3735'>ADF-3735</a>] -         SSO Login Error for login component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3798'>ADF-3798</a>] -         [Demo Shell] [APS2] Show Task list related to a Process
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4003'>ADF-4003</a>] -         Add roles filtering to PeopleCloudComponent
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4078'>ADF-4078</a>] -         Fixed headers in the document list
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4099'>ADF-4099</a>] -         The metadata group is always showed even though the properties are not there
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4122'>ADF-4122</a>] -         Sticky header on DataTable
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4125'>ADF-4125</a>] -         Simplify extension load in extension module
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4127'>ADF-4127</a>] -         Claim a task on the new generation of BPM engines
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4128'>ADF-4128</a>] -         Task Cloud completion/back
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4162'>ADF-4162</a>] -         Adding the &quot;includeAll&quot; type of object to the presets configurations of the InforDrawer
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4221'>ADF-4221</a>] -         Avoiding to show a group of metadata, if any of the properties are empty
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4225'>ADF-4225</a>] -         Viewer extension accept multiple file type
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4267'>ADF-4267</a>] -         Sticky header on Document List
</li>
</ul>
                                                                        
<h2>        Epic
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-9'>ADF-9</a>] -         Document list feature
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-14'>ADF-14</a>] -         Destination picker (copy/move)
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-262'>ADF-262</a>] -         File viewer
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-1452'>ADF-1452</a>] -         Documentation
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-1463'>ADF-1463</a>] -         Adding of automated tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3296'>ADF-3296</a>] -         APS 2.x &amp; Activiti 7 compatibility
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3349'>ADF-3349</a>] -         Activiti 7+ support
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3741'>ADF-3741</a>] -         Support for Activiti version 7 (and APS 2), maintaining the backward compatibility with APS 1.x.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3742'>ADF-3742</a>] -         Extensibility of ADF applications
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3857'>ADF-3857</a>] -         Accessibility
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4246'>ADF-4246</a>] -         Testing Microsoft Internet Explorer
</li>
</ul>
    
<h2>        Story
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-2129'>ADF-2129</a>] -         Results highlighting (P2)
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3472'>ADF-3472</a>] -         Whitelisting metadata by default with the ability to hide some of them by configuration
</li>
</ul>
                                                                                                                                                                
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-1713'>ADF-1713</a>] -         Small adjustments for Task and Process for consistency - Demo Shell
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-1954'>ADF-1954</a>] -         [IE11] Breadcrumbs are not well aligned
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-2971'>ADF-2971</a>] -         Mandatory search config
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3401'>ADF-3401</a>] -         The filter facets are not reseted when user makes a new search query 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3444'>ADF-3444</a>] -         Site list displays only a certain number of sites.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3604'>ADF-3604</a>] -         &#39;Sign in&#39; and copyrights is displayed on login dialog from &#39;Attach Folder&#39; from Share.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3678'>ADF-3678</a>] -         Custom Process Filter - Different results in APS than in ADF 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3843'>ADF-3843</a>] -         Is not possible to change theInfinite pagination pageSize
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3861'>ADF-3861</a>] -         [508 compliance] Multi-select, hamburger menu (row-based action menu) should be 508 compliant
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3862'>ADF-3862</a>] -         [508 compliance] Documents and images should be readable
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3863'>ADF-3863</a>] -         [508 compliance] The user should be informed of what the label is that he/she is selecting
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3878'>ADF-3878</a>] -         Created date value of Column column should be in upper case
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3934'>ADF-3934</a>] -         People Cloud Component - Remove the concept of assignee
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3979'>ADF-3979</a>] -         GroupCloudComponent should be able to detect &quot;preSelectGroups&quot; input changes
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3989'>ADF-3989</a>] -         The list of apps in &#39;appName&#39; filter  is duplicated after switching between saved filters 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3995'>ADF-3995</a>] -         &#39;ProcessInstanceId&#39; value is not displayed into a saved filter
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4023'>ADF-4023</a>] -         [Demo-shell] Pagination layout is broken in Process List Cloud
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4058'>ADF-4058</a>] -         Process Cloud - 502 Bad Gateway when try to create an task or an process 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4065'>ADF-4065</a>] -         The input field to add comments is visible when permission is denied.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4068'>ADF-4068</a>] -         Tasks - Able to add a description with spaces
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4076'>ADF-4076</a>] -         Error when accessing Active Task after closing process diagram
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4097'>ADF-4097</a>] -         [Demo shell] Add comment button not displayed in Comment section
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4143'>ADF-4143</a>] -         LastModifiedFrom and LastModifiedTo fields of edit task filter cloud component validations are wrong
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4148'>ADF-4148</a>] -         [kerberos] Text Viewer Component not passing the withCredentials parameter 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4153'>ADF-4153</a>] -         Unable to open the Task Details page.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4154'>ADF-4154</a>] -         Unit tests failing after upgrade to ADF 3.1.0-beta3
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4156'>ADF-4156</a>] -         Regression in TaskListComponent Caused by in-place Date Formatting
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4165'>ADF-4165</a>] -         ADF 3.0 Not able to login with implicitFlow false
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4179'>ADF-4179</a>] -         adf- prefix missing - style not applied to facet-buttons
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4183'>ADF-4183</a>] -         Login dialog does not redirect correctly after page reload
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4196'>ADF-4196</a>] -         Datatable component not always selects the row after click
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4199'>ADF-4199</a>] -         The &#39;Locally set&#39; permission label is not displayed properly in the UI screen.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4202'>ADF-4202</a>] -         Not able to start a standalone task using start task cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4205'>ADF-4205</a>] -         Error in console when User tries to add user or group to permissions.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4215'>ADF-4215</a>] -         Locale doesn&#39;t change when a user changes the browser locale
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4220'>ADF-4220</a>] -         [SSO] Not able to login with implicitFlow false after changing the config
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4229'>ADF-4229</a>] -         Big space issue in case of RTL ADF application
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4230'>ADF-4230</a>] -         Pagination arrows in the wrong order, in case or RTL ADF application
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4281'>ADF-4281</a>] -         Completed processes default filters is not doing the correct call
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4282'>ADF-4282</a>] -         The name of the content is not well aligned in documentList on small devices
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4287'>ADF-4287</a>] -         The alignment in datatable is wrong
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4301'>ADF-4301</a>] -         [Accessibility] Not able to navigate through tasks in task list using tab
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4305'>ADF-4305</a>] -         DocumentList - CardViewMode - Field values missing in the display.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4313'>ADF-4313</a>] -         [Demo shell] Form field looks like an editable field in task header after task was completed
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4316'>ADF-4316</a>] -         People component table is not well aligned
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4318'>ADF-4318</a>] -         Process definition is not automatically selected if the app contains more than one
</li>
</ul>
            
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3873'>ADF-3873</a>] -         Create automated tests for edit process filters
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3888'>ADF-3888</a>] -         Implement automated tests for all the properties of task list and edit task filters components
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3976'>ADF-3976</a>] -         EditTaskComponent - Be able to customise the sorting and actions
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3977'>ADF-3977</a>] -         EditProcessComponent - Be able to change the sort and actions
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3978'>ADF-3978</a>] -         Travis on dev branch - should not run the jobs  Create docker pr  Deploy docker pr
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3981'>ADF-3981</a>] -         Automate Login Component manual test C291854
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3986'>ADF-3986</a>] -         [ProcessListCloudComponent] Be able to filter process with all possible params
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4004'>ADF-4004</a>] -         Automate attach file test case
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4012'>ADF-4012</a>] -         Automate ADF-3872 - to be able to set default columns in adf-process-list-cloud
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4015'>ADF-4015</a>] -         automate ADF-3982 - Should be able to filter tasks with all possible params
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4045'>ADF-4045</a>] -         Automate test infinite pagination delete
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4048'>ADF-4048</a>] -         PeopleCloud - Improve the preselectUsers
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4061'>ADF-4061</a>] -         Automate test for navigating to a non empty folder in &gt;= 2nd page
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4064'>ADF-4064</a>] -         Remove multiple elements locators
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4067'>ADF-4067</a>] -         [APS2] Application Name input should have the same name in all components
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4083'>ADF-4083</a>] -         Parse &#39;escaped&#39; empty spaced labels inside facetFields or facetIntervals
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4089'>ADF-4089</a>] -         contentListPage refactoring
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4094'>ADF-4094</a>] -         Automate Permissions Component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4121'>ADF-4121</a>] -         Fixing failing e2e tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4123'>ADF-4123</a>] -         Process Cloud Instance Details Header component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4124'>ADF-4124</a>] -         [Demo Shell] TaskListCloud with the filter on a Process instance
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4132'>ADF-4132</a>] -         [Artificial Intelligence] Smart viewer for ADF recognising entities
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4145'>ADF-4145</a>] -         [Artificial Intelligence] Transformation Services added to the ACS instance in the ADF development pipeline
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4147'>ADF-4147</a>] -         Add a way to test selectionMode on demo-shell for task list cloud component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4149'>ADF-4149</a>] -         e2e tests - Move the pages from the e2e folder to the adf-testing
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4155'>ADF-4155</a>] -         AppList - be able to show the list of apps even in case the deployment service is missing
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4158'>ADF-4158</a>] -         No Alfresco-supplied docker image should run as root
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4159'>ADF-4159</a>] -         DemoShell add nested-menu
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4184'>ADF-4184</a>] -         Add Arabic i18n support 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4192'>ADF-4192</a>] -         Remove spinner check from editTaskFilter tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4195'>ADF-4195</a>] -         Automate tests for SSO login with implicitFlow false
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4201'>ADF-4201</a>] -         About component improvements
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4208'>ADF-4208</a>] -         [E2E] Make the pipeline green again !
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4217'>ADF-4217</a>] -         [Yeoman generator] Remove APS2 and leave Activiti only.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4222'>ADF-4222</a>] -         Fix the compilation errors on the Development branch, so that this can be added to the rules.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4223'>ADF-4223</a>] -         Export folder-name dialog validators 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4233'>ADF-4233</a>] -         DemoShell - Change nested menu layout 
</li>
</ul>
                                                                    
<h2>        Feature (Task)
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3945'>ADF-3945</a>] -         Provide a way to change the infinite pagination pageSize
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4038'>ADF-4038</a>] -         Add appName filter parameter for people/group demo component
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4095'>ADF-4095</a>] -         Automate C268974 - Inherit Permission
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4100'>ADF-4100</a>] -         Automate C274691 Dropdown menu
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4101'>ADF-4101</a>] -         Automate C276978 - Add user
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4102'>ADF-4102</a>] -         Automate - C276980 - Duplicate user/group
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4103'>ADF-4103</a>] -         Automate - C276982 - Remove User/Group
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4104'>ADF-4104</a>] -         Automate - C277014 - Role - Dropdown
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4105'>ADF-4105</a>] -         Automate C277002 - Role - Site Dropdown
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4106'>ADF-4106</a>] -         Automate C276993 - Role - Consumer
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4107'>ADF-4107</a>] -         Automate C276994 - Role - Site Consumer
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4108'>ADF-4108</a>] -         Automate - C276996 - Role - Contributor
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4109'>ADF-4109</a>] -         Automate C276997 - Role - Site Contributor
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4110'>ADF-4110</a>] -         Automate - C277000 - Role - Editor
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4111'>ADF-4111</a>] -         Automate C277003 - Role - Collaborator
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4112'>ADF-4112</a>] -         Automate C277005 Role - Site Collaborator
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4113'>ADF-4113</a>] -         Automate C277004 Role - Coordinator
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4114'>ADF-4114</a>] -         Automate - C277006 Role - Site Manager
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4115'>ADF-4115</a>] -         Automate C277100 - EVERYONE group
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4116'>ADF-4116</a>] -         Automate C277118 - Site Consumer - Add new version
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4117'>ADF-4117</a>] -         Automate C279881 - No permissions
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4120'>ADF-4120</a>] -         automate ADF-3989 - The list of apps in &#39;appName&#39; filter is duplicated after switching between saved filters
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4126'>ADF-4126</a>] -         Automate ADF-4003 - Add roles filtering to PeopleCloudComponent
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4129'>ADF-4129</a>] -         Automate ADF-4066 - Task doesn&#39;t have an assignee when the assignee is empty from Start Task form
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4151'>ADF-4151</a>] -         Automation test for code editor displayed when opening a .js file
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4166'>ADF-4166</a>] -         Move apps-section-cloud.e2e.ts to adf-testing
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4197'>ADF-4197</a>] -         Automation test for redirection after page reload
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4209'>ADF-4209</a>] -         [E2E] Fix Core tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4210'>ADF-4210</a>] -         [E2E] Fix Content-services and Search tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4211'>ADF-4211</a>] -         Fix process-services-cloud tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4218'>ADF-4218</a>] -         [E2E] Fix Insight tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4226'>ADF-4226</a>] -         Implement automated test for infinitePagination
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4244'>ADF-4244</a>] -         Fix search tests
</li>
</ul>


Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
