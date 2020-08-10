---
Title: Release notes v3.6.0
---

# Alfresco Application Development Framework (ADF) version 3.6.0 Release Note

These release notes provide information about the **3.6.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.6.0).

See the [ADF roadmap](../roadmap.md) for details of features planned for future
versions of ADF. 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Array type supported in data table columns](#array-type-supported-in-data-table-columns)
    -   [Testing the polyfill enablement](#testing-the-polyfill-enablement)
-   [Localisation](#localisation)
-   [References](#references)
-   [Issues addressed](#issues-addressed)

## New package versions

    "@alfresco/adf-content-services" : "3.6.0"
    "@alfresco/adf-process-services" : "3.6.0"
    "@alfresco/adf-core" : "3.6.0"
    "@alfresco/adf-insights" : "3.6.0",
    "@alfresco/adf-extensions": "3.6.0"

## Goals for this release

This is the sixth minor release of ADF since February 2019 when version 3.0.0 was released.

The highlights of this release include additional support for [Activiti 7](https://www.activiti.org/) and improved accessibility.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

### Array type supported in data table columns

Into the DataTable component you can now use arrays to define the key of a column.
Below an example of configuration.

{code:java}
    {
        "key": "variables[myText]",
        "type": "text",
        "title": "My Text",
        "cssClass": "desktop-only",
        "sortable": true
    } 
{code}


### Search Text Input Component
The search text input component has been decoupled by the search component in order to allow to use it in different context.

You can read further details [here](../../docs/core/components/search-text-input.component.md).


##Testing the polyfill enablement

The list of supported browsers for ADF is still valid and clear, but some developers would like to enable the polyfill to support older browser. Officially some "old browsers" are not supported, but more tests are done on this topic.

You can read further details [here](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/BROWSER-SUPPORT.md).

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


        Release Notes - Apps Development Framework - Version 3.6.0
                        
<h2>        Documentation
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4941'>ADF-4941</a>] -         Reviewing the ADF documentation
</li>
</ul>
    
<h2>        Feature
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4947'>ADF-4947</a>] -         Array type supported in data table columns
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4954'>ADF-4954</a>] -         Notification history persist
</li>
</ul>
                                                                                                                                                                                                                                                            
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-2990'>ADF-2990</a>] -         Entire row on datatable page can not be selected when navigating with &#39;tab&#39; key
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4783'>ADF-4783</a>] -         A field that has a visibility condition related to a number field less then/greater then a value is displayed when number field is null or empty
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4787'>ADF-4787</a>] -         Invalid value of number field is parsed and fields with visibility conditions based on the number field are visible
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4831'>ADF-4831</a>] -         DocumentList - filetype alternative text is not meaningful
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4893'>ADF-4893</a>] -         The visible flag doesn&#39;t work for custom action menu, both for Processlist and Tasklist
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4926'>ADF-4926</a>] -         Cloud form attachments are not downloaded correctly
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4936'>ADF-4936</a>] -         With SSO enabled, blank empty page displayed when route is matched as public but is wrong
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4949'>ADF-4949</a>] -         [Edit Task Filter Cloud] Add SUSPENDED state to the edit task filter states list
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4976'>ADF-4976</a>] -         Fix e2e PS cloud
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4979'>ADF-4979</a>] -         ADF Task Header Cloud - Add a way to update task header when something changes
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4992'>ADF-4992</a>] -         [TaskListCloudComponent] Use standalone property in the task query api
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4993'>ADF-4993</a>] -         User can stay logged in to an ADF App by continuously refreshing the page.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5002'>ADF-5002</a>] -         Selection is not working properly in Recent Files
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5004'>ADF-5004</a>] -         [CardViewTextItemComponent] Provide a way to have an icon for the clickable items
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5012'>ADF-5012</a>] -         Visibility condition not working with dates
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5013'>ADF-5013</a>] -         Dropdown does not display the default value
</li>
</ul>
            
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4007'>ADF-4007</a>] -         Add automation for ADF-3930, Copy/Move dialog, load more
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4446'>ADF-4446</a>] -         Automate C307974
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4595'>ADF-4595</a>] -         Remove &#39;adf-&#39; prefix from demo-shell only components
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4678'>ADF-4678</a>] -         Write manual test cases for localized date pipe
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4841'>ADF-4841</a>] -         CI/CD - AAE - Improve the check-activiti-env
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4844'>ADF-4844</a>] -         CI/CD - JS API - move from bamboo to travis
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4857'>ADF-4857</a>] -         adf-content is not angular cli compatible 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4859'>ADF-4859</a>] -         adf-insight is not angular cli compatible 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4897'>ADF-4897</a>] -         Delete the ADF cookie used to test if the browser allow them to be accepted
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4904'>ADF-4904</a>] -         e2e - Add the resources as part of protractor app
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4911'>ADF-4911</a>] -         Move IdentityRoleService from AAA to ADF
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4916'>ADF-4916</a>] -         Move the check-activiti.js as part of adf-cli
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4942'>ADF-4942</a>] -         Ready to release for ADF 3.6.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4943'>ADF-4943</a>] -         Third party libraries licenses for ADF 3.6.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4944'>ADF-4944</a>] -         Vulnerabilities report for ADF 3.6.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4945'>ADF-4945</a>] -         Release note for ADF 3.6.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4946'>ADF-4946</a>] -         Translation keys for the ADF 3.6.0 release
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4948'>ADF-4948</a>] -         Share the cloud resources across projects
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4951'>ADF-4951</a>] -         Testing and documenting the polyfill enablement on ADF to support &quot;old browsers&quot;
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4952'>ADF-4952</a>] -         Breadcrumb - focus style issues  
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4955'>ADF-4955</a>] -         Info Drawer - Visual heading text is not marked as a heading
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4956'>ADF-4956</a>] -         CLONE - Header - Focus indicator is not clearly visible
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4957'>ADF-4957</a>] -         Use Replace JS instead of sed to run e2e
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4958'>ADF-4958</a>] -         Info Drawer - Button does not have a role
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4959'>ADF-4959</a>] -         CLONE - Info Drawer - Action is not accessible by keyboard alone
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4960'>ADF-4960</a>] -         [UI Test Automation] Fix Bulk delete descriptors tests in Admin App
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4962'>ADF-4962</a>] -         Move or copy - Visual heading text is not marked as a heading
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4963'>ADF-4963</a>] -         CLONE - Info Drawer - Focus indicator is not clearly visible
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4964'>ADF-4964</a>] -         Add ability to save/cancel card view properties using enter and escape keys
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4965'>ADF-4965</a>] -         Viewer - pass navigate before and next event
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4972'>ADF-4972</a>] -         CLONE - Header - sidenav menu button aria-label not translatable
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4973'>ADF-4973</a>] -         CLONE - Header - sidenav menu button expanded/collapsed state not exposed via ARIA
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4974'>ADF-4974</a>] -         Provide security fixes for JS-API
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4982'>ADF-4982</a>] -         Refactor ADF Cli and ADD new S3 scripts
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4986'>ADF-4986</a>] -         CLONE - Move or copy - Empty cells should not receive focus
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4987'>ADF-4987</a>] -         Setup Mergify for JS-API and ADF repos
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4994'>ADF-4994</a>] -         Move realmRole functions inside JwtHelperService
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4997'>ADF-4997</a>] -         Introduce no-duplicate-imports rule for the TypeScript projects
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5005'>ADF-5005</a>] -         Fix security issues for ADF Yeoman generator
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5008'>ADF-5008</a>] -         Add an health check to make sure the env is up and running
</li>
</ul>
                                                                        
<h2>        Feature (Task)
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4984'>ADF-4984</a>] -         Search Results - Focus indicator is not clearly visible - mat-expansion-panel
</li>
</ul>


Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
