---
Title: Release notes v3.5.0
---

# Alfresco Application Development Framework (ADF) version 3.5.0 Release Note

These release notes provide information about the **3.5.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.5.0).

See the [ADF roadmap](../roadmap.md) for details of features planned for future
versions of ADF. 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Improved accessibility](#improved-accessibility)
    -   [Authentication](#authentication)
-   [Localisation](#localisation)
-   [References](#references)
-   [Issues addressed](#issues-addressed)

## New package versions

    "@alfresco/adf-content-services" : "3.5.0"
    "@alfresco/adf-process-services" : "3.5.0"
    "@alfresco/adf-core" : "3.5.0"
    "@alfresco/adf-insights" : "3.5.0",
    "@alfresco/adf-extensions": "3.5.0"

## Goals for this release

This is the fifth minor release of ADF since February 2019 when version 3.0.0 was released.

The highlights of this release include additional support for [Activiti 7](https://www.activiti.org/) and improved accessibility.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

### Improved accessibility

This release provides fixes for some accessibility issues and improves the overall accessibility of ADF based applications. Refer to the [list of issues](#issues-addressed) for details of the enhancements and fixes.

### Authentication

The SSO experience has been enhanced by providing whitelist access to public routes and support for logout requests via the Alfresco Identity Management Service.

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

        Release Notes - Apps Development Framework - Version 3.5.0
                        
<h2>        Documentation
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4919'>ADF-4919</a>] -         Reviewing the ADF documentation
</li>
</ul>
    
<h2>        Feature
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4738'>ADF-4738</a>] -         [Process -Cloud] Move GroupCloudService to adf-core lib
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4828'>ADF-4828</a>] -         [ADF] [ProcessListCloudComponent] Add action and context menu.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4829'>ADF-4829</a>] -         [ADF] [TaskListCloudComponent] Add action and context menu.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4854'>ADF-4854</a>] -         Cloud Task List should expose &quot;stickyHeader&quot; attribute
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4878'>ADF-4878</a>] -         About Component refactor
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4894'>ADF-4894</a>] -         Json datatable column and edit/view dialog
</li>
</ul>
                                                                        
<h2>        Epic
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4822'>ADF-4822</a>] -         ADF with Identity Service
</li>
</ul>
    
<h2>        Story
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4814'>ADF-4814</a>] -         Improve About component to display current version running 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4820'>ADF-4820</a>] -         CI/CD - Automatic github Tag on the release process.
</li>
</ul>
                                                                                                                                                                            
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4764'>ADF-4764</a>] -         The amount field placeholder is misleading after completing a task
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4794'>ADF-4794</a>] -         Not able to attach a second file to a form after one has already been attached
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4798'>ADF-4798</a>] -         [ADF] [adf-content-node-selector] File icons are not showing properly
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4810'>ADF-4810</a>] -         Cannot access public routes, when authentication is OAUTH &amp; silent login enabled
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4824'>ADF-4824</a>] -         ADF should logout user when token request fails
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4826'>ADF-4826</a>] -         [ADF] Process/Task list first displays &quot;No Process/Task Found&quot; and then loads the Process/Tasks
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4830'>ADF-4830</a>] -         DocumentList - sort state is not being announced
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4831'>ADF-4831</a>] -         DocumentList - filetype alternative text is not meaningful
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4845'>ADF-4845</a>] -         Uploader - Expanded/collapsed state not exposed
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4847'>ADF-4847</a>] -         Not able to find any user in Assignee field when creating a task
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4848'>ADF-4848</a>] -         Visibility conditions on forms on ADF on APS1 is not working
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4862'>ADF-4862</a>] -         Upload dialog - reading order
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4865'>ADF-4865</a>] -         Upload Dialog - row actions not accessible by keyboard alone
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4868'>ADF-4868</a>] -         [APS-1] adf-content-node-selector seems broken when we upload from External Alfresco  content service
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4887'>ADF-4887</a>] -         Value of invisible number field is not sent in the payload
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4899'>ADF-4899</a>] -         Fix Community Edition Templates in Generator
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4905'>ADF-4905</a>] -         ADF starts different process instance than process selected in the dropdown
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4906'>ADF-4906</a>] -         [ADF] Not able upload file from ACS when start process with form
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4909'>ADF-4909</a>] -         Hide the plugins section of About page when it&#39;s empty
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4913'>ADF-4913</a>] -         [Regression] Text ellipsis in Gallery View 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4914'>ADF-4914</a>] -         Fix update version script for Modeler and Generator
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4922'>ADF-4922</a>] -         Fix update project script for Generator and Modeler
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4926'>ADF-4926</a>] -         Cloud form attachments are not downloaded correctly
</li>
</ul>
            
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4799'>ADF-4799</a>] -         [E2E] Automate CardView clear date button
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4801'>ADF-4801</a>] -         [E2E] Create automation for CardView dropdown None option
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4807'>ADF-4807</a>] -         Automate Form date fields - Incorrect validation for date fields - Only YYYY-MM-DD date display format is working
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4809'>ADF-4809</a>] -         [E2E] Automate test for non-editable form in completed task
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4811'>ADF-4811</a>] -         Enhance notification service to handle translation params
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4813'>ADF-4813</a>] -         Disable control flow in ADF e2e
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4821'>ADF-4821</a>] -         CI/CD - automatic release generate GITHUB_TOKEN
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4833'>ADF-4833</a>] -         Adf-cli - Expose an npm-publish command 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4834'>ADF-4834</a>] -         CI/CD - Publish the alpha from travis instead of bamboo
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4839'>ADF-4839</a>] -         DocList - Link does not have a role
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4846'>ADF-4846</a>] -         CLONE -  Move to ADF the styles from the adf-style-fixes.theme.scss file
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4850'>ADF-4850</a>] -         CI/CD Add check bundle on Travis
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4858'>ADF-4858</a>] -         adf-process-services is not angular cli compatible 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4860'>ADF-4860</a>] -         CI/CD Add a travis cron job to release the beta
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4863'>ADF-4863</a>] -         Introduce the npx to simplify the pipeline
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4866'>ADF-4866</a>] -         Update Generator i18n script
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4867'>ADF-4867</a>] -         Refactor the adf-error-component to allow transclusion on actions
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4871'>ADF-4871</a>] -         Translation keys for the ADF 3.5.0 release
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4873'>ADF-4873</a>] -         Release note for ADF 3.5.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4875'>ADF-4875</a>] -         Vulnerabilities report for ADF 3.5.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4877'>ADF-4877</a>] -         Third party libraries licenses for ADF 3.5.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4885'>ADF-4885</a>] -         Ready to release for ADF 3.5.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4892'>ADF-4892</a>] -         DocumentList - set appropriate sort state for active and inactive column sort
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4896'>ADF-4896</a>] -         Unifying NotificationModel and Service between applications
</li>
</ul>
                                                                    
<h2>        Feature (Task)
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4816'>ADF-4816</a>] -         Refactor and improve About component to display current version in use
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4852'>ADF-4852</a>] -         Implement adf-cli update-commit-sha in pipeline
</li>
</ul>

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
