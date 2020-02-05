---
Title: Release notes v3.7.0
---

# Alfresco Application Development Framework (ADF) version 3.7.0 Release Note

These release notes provide information about the **3.7.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.7.0).

See the [ADF roadmap](../roadmap.md) for details of features planned for future versions of ADF. 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [PDFjs library update](#pdfjs-library-update)
-   [Localisation](#localisation)
-   [References](#references)
-   [Issues addressed](#issues-addressed)

## New package versions

    "@alfresco/adf-content-services" : "3.7.0"
    "@alfresco/adf-process-services" : "3.7.0"
    "@alfresco/adf-core" : "3.7.0"
    "@alfresco/adf-insights" : "3.7.0",
    "@alfresco/adf-extensions": "3.7.0"

## Goals for this release

This is the seventh minor release of ADF since February 2019 when version 3.0.0 was released.

The highlights of this release include additional support for [Activiti 7](https://www.activiti.org/), improved accessibility and  library upgrade ([pdfjs](https://mozilla.github.io/pdf.js/)).

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

### PDFjs library update

The library [pdfjs](https://mozilla.github.io/pdf.js/) has been updated to version 2.3.200 to solve potential security issues from the older version used.

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
                        
<h2>        Documentation
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4996'>ADF-4996</a>] -         onNodeDoubleClick() don&#39;t exist
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5047'>ADF-5047</a>] -         Reviewing the ADF documentation
</li>
</ul>
                                                                                
<h2>        Story
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4980'>ADF-4980</a>] -         Supporting multiple AIMS sessions on the same client (browser)
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5031'>ADF-5031</a>] -         [PeopleCloudComponent]  Provide a way to make pre-selected users read-only
</li>
</ul>
                                                                                                                                                                                
<h2>        Bug
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-3192'>ADF-3192</a>] -         [Form] - The fields are not properly aligned
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4055'>ADF-4055</a>] -         The menu actions for the attached file of a Process don&#39;t work.
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4683'>ADF-4683</a>] -         Rows are not displayed correctly in attach file widget configured with repo
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4761'>ADF-4761</a>] -         Completed task that contains a form with number field is not rendered correctly 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-4823'>ADF-4823</a>] -         Displaying a file in a form does not work
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5001'>ADF-5001</a>] -          Process Audit File Log APS1 section wrong instruction for complete processes
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5006'>ADF-5006</a>] -         Datatable - custom cell template focus
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5007'>ADF-5007</a>] -         Comments - textarea Escape event cannot be canceled
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5009'>ADF-5009</a>] -         [demo shell] Move Dialog not closed when logged out another tab
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5018'>ADF-5018</a>] -         People/Group CloudComponent - Assignee field value doesn&#39;t behave correctly
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5021'>ADF-5021</a>] -         Can&#39;t upload multiple files when widget allows multiple files to be attached is checked
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5025'>ADF-5025</a>] -         Failing preview of doc attachment on APS
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5028'>ADF-5028</a>] -         Authentication is needed when we want to attach a document from a process form using APS
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5030'>ADF-5030</a>] -         [Demo-Shell] Community page is not working as expected in demo-shell
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5043'>ADF-5043</a>] -         Default adf-cloud-task-list and adf-cloud-process-list doesn&#39;t work
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5045'>ADF-5045</a>] -         [MNT] - Broken document list into a Yeoman generated ADF app
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5056'>ADF-5056</a>] -         Error =&gt; &#39;Refused to set unsafe header &quot;user-agent&quot;
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5061'>ADF-5061</a>] -         Amount is treated as a string not a number in dynamic table
</li>
</ul>
            
<h2>        Task
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5010'>ADF-5010</a>] -         Add ACS 6.2 to the ADF pipeline
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5015'>ADF-5015</a>] -         DocumentList - favorites properties
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5016'>ADF-5016</a>] -         Update the zip attached in test cases related to decision task for APW
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5020'>ADF-5020</a>] -         Add APS 1.10 to the ADF pipeline
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5022'>ADF-5022</a>] -         Automation testing debt - CloudForm
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5024'>ADF-5024</a>] -         Add method to wait for the tasklist page to display in datatable component page
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5027'>ADF-5027</a>] -         Support viewing of all supported files in the Process list and Task List - Process Services(APS1)
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5033'>ADF-5033</a>] -         Fix ADF red pipeline
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5042'>ADF-5042</a>] -         Update pdf-js lib 
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5048'>ADF-5048</a>] -         Translation keys for the ADF 3.7.0 release
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5049'>ADF-5049</a>] -         Third party libraries licenses for ADF 3.7.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5050'>ADF-5050</a>] -         Vulnerabilities report for ADF 3.7.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5051'>ADF-5051</a>] -         Release note for ADF 3.7.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5052'>ADF-5052</a>] -         Ready to release for ADF 3.7.0
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5055'>ADF-5055</a>] -         Update pdfjs version
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5062'>ADF-5062</a>] -         Content Node Selector - show inputs based on configuration
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5065'>ADF-5065</a>] -         Automate People/group component test
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5067'>ADF-5067</a>] -         Breadcrumb Component  test need to be automated
</li>
</ul>
                                                
<h2>        Sub-task
</h2>
<ul>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5057'>ADF-5057</a>] -         [Testing]Manual Testing
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5058'>ADF-5058</a>] -         [Testing]Automate the manual tests
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5059'>ADF-5059</a>] -         form service use readonly instead of readOnly
</li>
<li>[<a href='https://issues.alfresco.com/jira/browse/ADF-5060'>ADF-5060</a>] -         Improve readOnly attach file
</li>
</ul>
                        

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
