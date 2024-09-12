---
Title: Release notes v4.1.0
---

# Alfresco Application Development Framework (ADF) version 4.1.0 Release Note

These release notes provide information about the **4.1.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/4.1.0).

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Header filters for document list components](#Header-filters-for-document-list-components)
-   [Localisation](#localisation)
-   [References](#references)
-   [PR merged](#pr-merged)

## New package versions

    "@alfresco/adf-content-services" : "4.1.0"
    "@alfresco/adf-process-services" : "4.1.0"
    "@alfresco/adf-core" : "4.1.0"
    "@alfresco/adf-insights" : "4.1.0",
    "@alfresco/adf-extensions": "4.1.0"
    "@alfresco/adf-testing": "4.1.0"
    "@alfresco/adf-cli": "4.1.0"

## Goals for this release

This is a minor release of the Alfresco Application Development Framework, developed to receive the latest and greatest benefits of the bugfixes and the enhancements planned since the release of the previous version.

The highlights of this release is mainly about bugfixes and the new header filters for document list components.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

### Header filters for document list components

We developed a new feature called Header Filters in ADF 4.0. It would allow users to filter the content of a folder by its columns properties. While this feature was working, we noticed it was hard to implement. That is way we came up with a new way of enabling this feature. You can check the [DocumenList documentation](../content-services/components/document-list.component.md) for further details.

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

## PR merged 

* [Alfresco/alfresco-ng2-components#6023 - Bump mdast-util-toc from 2.1.0 to 5.0.3](https://github.com/Alfresco/alfresco-ng2-components/pull/6023)
* [Alfresco/alfresco-ng2-components#6021 - Bump unist-util-select from 2.0.2 to 3.0.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6021)
* [Alfresco/alfresco-ng2-components#6012 - Bump mini-css-extract-plugin from 0.9.0 to 0.10.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6012)
* [Alfresco/alfresco-ng2-components#5997 - Bump mdast-zone from 3.0.4 to 4.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/5997)
* [Alfresco/alfresco-ng2-components#6037 - Bump @types/pdfjs-dist from 2.1.4 to 2.1.5](https://github.com/Alfresco/alfresco-ng2-components/pull/6037)
* [Alfresco/alfresco-ng2-components#6036 - Bump ng-packagr from 10.0.2 to 10.0.4](https://github.com/Alfresco/alfresco-ng2-components/pull/6036)
* [Alfresco/alfresco-ng2-components#6033 - Bump jasmine2-protractor-utils from 1.1.3 to 1.3.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6033)
* [Alfresco/alfresco-ng2-components#6032 - [ACA-3863] Add query-service call for E2E tests](https://github.com/Alfresco/alfresco-ng2-components/pull/6032)
* [Alfresco/alfresco-ng2-components#6034 - Bump scss-bundle from 2.3.2 to 3.1.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6034)
* [Alfresco/alfresco-ng2-components#6015 - Bump @nrwl/workspace from 10.0.10 to 10.0.12](https://github.com/Alfresco/alfresco-ng2-components/pull/6015)
* [Alfresco/alfresco-ng2-components#5983 - New Service create - AuditService](https://github.com/Alfresco/alfresco-ng2-components/pull/5983)
* [Alfresco/alfresco-ng2-components#6035 - Bump @types/node from 14.0.27 to 14.6.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6035)
* [Alfresco/alfresco-ng2-components#6013 - Bump graphql from 14.7.0 to 15.3.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6013)
* [Alfresco/alfresco-ng2-components#6049 - Revert "Bump scss-bundle from 2.3.2 to 3.1.2"](https://github.com/Alfresco/alfresco-ng2-components/pull/6049)
* [Alfresco/alfresco-ng2-components#6040 - fix flex-layout version](https://github.com/Alfresco/alfresco-ng2-components/pull/6040)
* [Alfresco/alfresco-ng2-components#6045 - Bump moment from 2.22.2 to 2.27.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6045)
* [Alfresco/alfresco-ng2-components#6046 - Bump concurrently from 3.6.1 to 5.3.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6046)
* [Alfresco/alfresco-ng2-components#6043 - Bump @angular-devkit/build-angular from 0.1000.3 to 0.1000.6](https://github.com/Alfresco/alfresco-ng2-components/pull/6043)
* [Alfresco/alfresco-ng2-components#6042 - Bump karma from 4.4.1 to 5.1.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6042)
* [Alfresco/alfresco-ng2-components#6041 - Bump codelyzer from 5.2.2 to 6.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6041)
* [Alfresco/alfresco-ng2-components#6048 - [ACA-3800]Add method to datatable PO for selecting row with CMD](https://github.com/Alfresco/alfresco-ng2-components/pull/6048)
* [Alfresco/alfresco-ng2-components#6044 - Bump typescript from 3.9.6 to 3.9.7](https://github.com/Alfresco/alfresco-ng2-components/pull/6044)
* [Alfresco/alfresco-ng2-components#6051 - Bump stylelint from 9.10.1 to 13.6.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6051)
* [Alfresco/alfresco-ng2-components#6055 - Bump sass-loader from 7.1.0 to 9.0.3](https://github.com/Alfresco/alfresco-ng2-components/pull/6055)
* [Alfresco/alfresco-ng2-components#6056 - Bump ejs from 3.1.3 to 3.1.5](https://github.com/Alfresco/alfresco-ng2-components/pull/6056)
* [Alfresco/alfresco-ng2-components#6053 - Bump rxjs from 6.6.0 to 6.6.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6053)
* [Alfresco/alfresco-ng2-components#6052 - Bump jasmine-spec-reporter from 4.2.1 to 5.0.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6052)
* [Alfresco/alfresco-ng2-components#6047 - Bump cspell from 4.0.63 to 4.1.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6047)
* [Alfresco/alfresco-ng2-components#6050 - Bump jasmine-ajax from 3.2.0 to 4.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6050)
* [Alfresco/alfresco-ng2-components#6057 - add missing group role APIs](https://github.com/Alfresco/alfresco-ng2-components/pull/6057)
* [Alfresco/alfresco-ng2-components#6058 - [ACA-3737] Process cloud properties review labels](https://github.com/Alfresco/alfresco-ng2-components/pull/6058)
* [Alfresco/alfresco-ng2-components#6024 - [AAE-3273] Manage empty option in retrieve content metadata dropdowns](https://github.com/Alfresco/alfresco-ng2-components/pull/6024)
* [Alfresco/alfresco-ng2-components#6054 - Bump commander from 4.0.0 to 6.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6054)
* [Alfresco/alfresco-ng2-components#6062 - Bump sass-loader from 9.0.3 to 10.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6062)
* [Alfresco/alfresco-ng2-components#6059 - Bump mdast-util-compact from 1.0.4 to 2.0.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6059)
* [Alfresco/alfresco-ng2-components#6061 - Bump @angular-devkit/build-ng-packagr from 0.1000.6 to 0.1000.7](https://github.com/Alfresco/alfresco-ng2-components/pull/6061)
* [Alfresco/alfresco-ng2-components#6064 - Bump adf-tslint-rules from 0.0.6 to 0.0.7](https://github.com/Alfresco/alfresco-ng2-components/pull/6064)
* [Alfresco/alfresco-ng2-components#6065 - Update upgrade39-40.md](https://github.com/Alfresco/alfresco-ng2-components/pull/6065)
* [Alfresco/alfresco-ng2-components#6060 - Bump scss-bundle from 2.3.2 to 3.1.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6060)
* [Alfresco/alfresco-ng2-components#6063 - Bump markdownlint-cli from 0.16.0 to 0.23.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6063)
* [Alfresco/alfresco-ng2-components#6066 - fix http method regression](https://github.com/Alfresco/alfresco-ng2-components/pull/6066)
* [Alfresco/alfresco-ng2-components#6067 - publish improvements](https://github.com/Alfresco/alfresco-ng2-components/pull/6067)
* [Alfresco/alfresco-ng2-components#6075 - fix production builds](https://github.com/Alfresco/alfresco-ng2-components/pull/6075)
* [Alfresco/alfresco-ng2-components#6090 - [AAE-3338] Update simpleapp](https://github.com/Alfresco/alfresco-ng2-components/pull/6090)
* [Alfresco/alfresco-ng2-components#6087 - Fix e2e](https://github.com/Alfresco/alfresco-ng2-components/pull/6087)
* [Alfresco/alfresco-ng2-components#6085 - [ACA-3441] Add method to attach file widget PO](https://github.com/Alfresco/alfresco-ng2-components/pull/6085)
* [Alfresco/alfresco-ng2-components#6084 - [AAE-3406] - Fix advanced search inside content-node selector](https://github.com/Alfresco/alfresco-ng2-components/pull/6084)
* [Alfresco/alfresco-ng2-components#6086 - [ADF-5230] - Implement process date range filter](https://github.com/Alfresco/alfresco-ng2-components/pull/6086)
* [Alfresco/alfresco-ng2-components#6096 - Remove excluded test](https://github.com/Alfresco/alfresco-ng2-components/pull/6096)
* [Alfresco/alfresco-ng2-components#6099 - [MNT-21636] - added redirection when SSO is enabled for external link](https://github.com/Alfresco/alfresco-ng2-components/pull/6099)
* [Alfresco/alfresco-ng2-components#6069 - Bump selenium-webdriver from 4.0.0-alpha.5 to 4.0.0-alpha.7](https://github.com/Alfresco/alfresco-ng2-components/pull/6069)
* [Alfresco/alfresco-ng2-components#6101 - [ADF-4481] Fix Viewer peview for unsupported new versions](https://github.com/Alfresco/alfresco-ng2-components/pull/6101)
* [Alfresco/alfresco-ng2-components#6103 - Bump sass-loader from 10.0.0 to 10.0.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6103)
* [Alfresco/alfresco-ng2-components#6106 - Bump ts-node from 8.10.2 to 9.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6106)
* [Alfresco/alfresco-ng2-components#6104 - Bump ng-packagr from 10.0.4 to 10.1.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6104)
* [Alfresco/alfresco-ng2-components#6072 - Bump tslint from 5.20.0 to 6.1.3](https://github.com/Alfresco/alfresco-ng2-components/pull/6072)
* [Alfresco/alfresco-ng2-components#6073 - Bump remark-frontmatter from 1.3.3 to 2.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6073)
* [Alfresco/alfresco-ng2-components#6107 - Bump karma from 5.2.0 to 5.2.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6107)
* [Alfresco/alfresco-ng2-components#6109 - Bump husky from 4.2.5 to 4.3.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6109)
* [Alfresco/alfresco-ng2-components#6105 - Bump css-loader from 3.6.0 to 4.3.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6105)
* [Alfresco/alfresco-ng2-components#6108 - Bump @angular-devkit/build-ng-packagr from 0.1000.7 to 0.1001.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6108)
* [Alfresco/alfresco-ng2-components#6094 - [AAE-3296] Add unit tests for Tooltips in Form Widgets](https://github.com/Alfresco/alfresco-ng2-components/pull/6094)
* [Alfresco/alfresco-ng2-components#5919 - [ACA-3637] - Add dueDate range filter](https://github.com/Alfresco/alfresco-ng2-components/pull/5919)
* [Alfresco/alfresco-ng2-components#6110 - Bump graphql-request from 1.8.2 to 3.1.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6110)
* [Alfresco/alfresco-ng2-components#6111 - Bump @types/node from 14.6.0 to 14.6.4](https://github.com/Alfresco/alfresco-ng2-components/pull/6111)
* [Alfresco/alfresco-ng2-components#6112 - Bump @angular/cli from 10.0.7 to 10.1.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6112)
* [Alfresco/alfresco-ng2-components#6113 - [ACA-3942] Enable assignee edit button only when userTask shared among the candidates](https://github.com/Alfresco/alfresco-ng2-components/pull/6113)
* [Alfresco/alfresco-ng2-components#6114 - [MNT-21789] ADW - Disable ACS Thumbnail Generation cause ADF Upload Service to fail any file upload with 501 error](https://github.com/Alfresco/alfresco-ng2-components/pull/6114)
* [Alfresco/alfresco-ng2-components#6102 - include attach file test](https://github.com/Alfresco/alfresco-ng2-components/pull/6102)
* [Alfresco/alfresco-ng2-components#6097 - [ACA-3877] Add the possibility to ADF Extension to be used in compila…](https://github.com/Alfresco/alfresco-ng2-components/pull/6097)
* [Alfresco/alfresco-ng2-components#6088 - Bump karma-coverage-istanbul-reporter from 2.1.0 to 3.0.3](https://github.com/Alfresco/alfresco-ng2-components/pull/6088)
* [Alfresco/alfresco-ng2-components#6083 - [Docs] cloud custom form widget examples](https://github.com/Alfresco/alfresco-ng2-components/pull/6083)
* [Alfresco/alfresco-ng2-components#6120 - Bump snyk from 1.385.0 to 1.393.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6120)
* [Alfresco/alfresco-ng2-components#5871 - [ACA-3623] Process definition name filter in task list](https://github.com/Alfresco/alfresco-ng2-components/pull/5871)
* [Alfresco/alfresco-ng2-components#6079 - [AAE-3321] Select uploaded local files by default](https://github.com/Alfresco/alfresco-ng2-components/pull/6079)
* [Alfresco/alfresco-ng2-components#6076 - [ACA-3884]Attach cloud file - Ability to use the -appname- as placeholder in the destinationFolder ](https://github.com/Alfresco/alfresco-ng2-components/pull/6076)
* [Alfresco/alfresco-ng2-components#6130 - updated outcomebuttons process](https://github.com/Alfresco/alfresco-ng2-components/pull/6130)
* [Alfresco/alfresco-ng2-components#6126 - [AAE-3507] ADF - Change default destination folder alias -root- to -my-](https://github.com/Alfresco/alfresco-ng2-components/pull/6126)
* [Alfresco/alfresco-ng2-components#6122 - [ADF-5235] Facet fix and improve search test](https://github.com/Alfresco/alfresco-ng2-components/pull/6122)
* [Alfresco/alfresco-ng2-components#6143 - [ACA-3884] AttachFileCloud - Pass the replaced value](https://github.com/Alfresco/alfresco-ng2-components/pull/6143)
* [Alfresco/alfresco-ng2-components#6144 - Sanity check - Be able to pass params](https://github.com/Alfresco/alfresco-ng2-components/pull/6144)
* [Alfresco/alfresco-ng2-components#6137 - [ADF-5237] Unexclude C362240 and C362241](https://github.com/Alfresco/alfresco-ng2-components/pull/6137)
* [Alfresco/alfresco-ng2-components#5931 - [ACA-3722] - rename process name sort option](https://github.com/Alfresco/alfresco-ng2-components/pull/5931)
* [Alfresco/alfresco-ng2-components#6148 - [ACA-3973] K8s image - fetch all the namespaces and handle the missing container](https://github.com/Alfresco/alfresco-ng2-components/pull/6148)
* [Alfresco/alfresco-ng2-components#6142 - [AAE-3514] Create file viewer widget](https://github.com/Alfresco/alfresco-ng2-components/pull/6142)
* [Alfresco/alfresco-ng2-components#6147 - [ADF-5245] Fix C297478, C297485 and C297472](https://github.com/Alfresco/alfresco-ng2-components/pull/6147)
* [Alfresco/alfresco-ng2-components#6149 - [ADF-5241] [ADF-5243] [ADF-5244] Fix C291954, C291955, C291993 and C291995](https://github.com/Alfresco/alfresco-ng2-components/pull/6149)
* [Alfresco/alfresco-ng2-components#6128 - [ACA-3637] - DueDate filter fix translation and add missing option](https://github.com/Alfresco/alfresco-ng2-components/pull/6128)
* [Alfresco/alfresco-ng2-components#6131 - [AAE-3469] New Service Task List  in Task List Cloud Component](https://github.com/Alfresco/alfresco-ng2-components/pull/6131)
* [Alfresco/alfresco-ng2-components#6150 - [ACA-3899] Viewer thumbnails cannot be accessed by keyboard](https://github.com/Alfresco/alfresco-ng2-components/pull/6150)
* [Alfresco/alfresco-ng2-components#5953 - [ADF-3499] Make Card View Text Item reactive to user input](https://github.com/Alfresco/alfresco-ng2-components/pull/5953)
* [Alfresco/alfresco-ng2-components#6154 - Revert "[AAE-3469] New Service Task List  in Task List Cloud Component"](https://github.com/Alfresco/alfresco-ng2-components/pull/6154)
* [Alfresco/alfresco-ng2-components#6155 - [ACA-3973] K8s - namespaces - Replace all the occurrences](https://github.com/Alfresco/alfresco-ng2-components/pull/6155)
* [Alfresco/alfresco-ng2-components#6146 - Test improve](https://github.com/Alfresco/alfresco-ng2-components/pull/6146)
* [Alfresco/alfresco-ng2-components#6093 - [ACA-3683] - implement started date process filter](https://github.com/Alfresco/alfresco-ng2-components/pull/6093)
* [Alfresco/alfresco-ng2-components#6152 - Update protractor.excludes.json](https://github.com/Alfresco/alfresco-ng2-components/pull/6152)
* [Alfresco/alfresco-ng2-components#6145 - [ACA-3692] - Add completed date/due date/started date filter](https://github.com/Alfresco/alfresco-ng2-components/pull/6145)
* [Alfresco/alfresco-ng2-components#6156 - Test improve](https://github.com/Alfresco/alfresco-ng2-components/pull/6156)
* [Alfresco/alfresco-ng2-components#6138 - [ADF-5236] C246534 Failing](https://github.com/Alfresco/alfresco-ng2-components/pull/6138)
* [Alfresco/alfresco-ng2-components#6078 - [MNT-21705] - fixed column display for fields](https://github.com/Alfresco/alfresco-ng2-components/pull/6078)
* [Alfresco/alfresco-ng2-components#6157 - [ACA-3977] FE - Integrate new user assign API](https://github.com/Alfresco/alfresco-ng2-components/pull/6157)
* [Alfresco/alfresco-ng2-components#5924 - [ACA-3643] - add completedBy filter on tasks](https://github.com/Alfresco/alfresco-ng2-components/pull/5924)
* [Alfresco/alfresco-ng2-components#6098 - [ACA-3312] Add user-filter util class](https://github.com/Alfresco/alfresco-ng2-components/pull/6098)
* [Alfresco/alfresco-ng2-components#6092 - [ADF-5219] Refactor Document list Filters](https://github.com/Alfresco/alfresco-ng2-components/pull/6092)
* [Alfresco/alfresco-ng2-components#6159 - [ACA-3960] FE - Users that are part of a candidate group should not be able to see 'Assignee' property as editable when on that user task candidate group was set as assignment](https://github.com/Alfresco/alfresco-ng2-components/pull/6159)
* [Alfresco/alfresco-ng2-components#6158 - [AAE-3493] Update the documentation to provide the proper guidance on custom forms widgets for APA and APS developers](https://github.com/Alfresco/alfresco-ng2-components/pull/6158)
* [Alfresco/alfresco-ng2-components#6139 - Bump @angular/cli from 10.1.0 to 10.1.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6139)
* [Alfresco/alfresco-ng2-components#6164 - [ACA-3903] DocumentList - header filters are missing aria-labels](https://github.com/Alfresco/alfresco-ng2-components/pull/6164)
* [Alfresco/alfresco-ng2-components#6119 - Bump optimize-css-assets-webpack-plugin from 5.0.3 to 5.0.4](https://github.com/Alfresco/alfresco-ng2-components/pull/6119)
* [Alfresco/alfresco-ng2-components#6165 - [ACA-3689] Update customize filter locator](https://github.com/Alfresco/alfresco-ng2-components/pull/6165)
* [Alfresco/alfresco-ng2-components#6166 - [ADF-5219] Fix Production Build](https://github.com/Alfresco/alfresco-ng2-components/pull/6166)
* [Alfresco/alfresco-ng2-components#6153 - Ole tutorial updates](https://github.com/Alfresco/alfresco-ng2-components/pull/6153)
* [Alfresco/alfresco-ng2-components#6160 - [AAE-3410] NodeSelector - Use user alias (-my-) name as default for upload of type Alfresco Content only](https://github.com/Alfresco/alfresco-ng2-components/pull/6160)
* [Alfresco/alfresco-ng2-components#6167 - Test improve 2](https://github.com/Alfresco/alfresco-ng2-components/pull/6167)
* [Alfresco/alfresco-ng2-components#6172 - Bump mini-css-extract-plugin from 0.10.1 to 0.11.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6172)
* [Alfresco/alfresco-ng2-components#6161 - [AAE-3469] New Service Task Cloud Component](https://github.com/Alfresco/alfresco-ng2-components/pull/6161)
* [Alfresco/alfresco-ng2-components#6173 - [AAE-3469] Expose ServiceTaskListCloudComponent in public api](https://github.com/Alfresco/alfresco-ng2-components/pull/6173)
* [Alfresco/alfresco-ng2-components#6175 - Expose ServiceTaskFilterCloudService in public API](https://github.com/Alfresco/alfresco-ng2-components/pull/6175)
* [Alfresco/alfresco-ng2-components#6174 - [AAE-3651] FE - Export DateCloudFilterType from process-services-cloud lib](https://github.com/Alfresco/alfresco-ng2-components/pull/6174)
* [Alfresco/alfresco-ng2-components#6177 - Added switch to be able to check the form behaviour](https://github.com/Alfresco/alfresco-ng2-components/pull/6177)
* [Alfresco/alfresco-ng2-components#6180 - Fix broken e2e tests because of the lack of thrown error](https://github.com/Alfresco/alfresco-ng2-components/pull/6180)
* [Alfresco/alfresco-ng2-components#6181 - fix rxjs imports](https://github.com/Alfresco/alfresco-ng2-components/pull/6181)
* [Alfresco/alfresco-ng2-components#6171 - Bump moment from 2.27.0 to 2.29.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6171)
* [Alfresco/alfresco-ng2-components#6169 - Bump commander from 6.0.0 to 6.1.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6169)
* [Alfresco/alfresco-ng2-components#6182 - Update candidatebaseapp for variable mapping in tasks to work](https://github.com/Alfresco/alfresco-ng2-components/pull/6182)
* [Alfresco/alfresco-ng2-components#6184 - [ADF-5260] Fix Service task list initialization in DemoShell](https://github.com/Alfresco/alfresco-ng2-components/pull/6184)
* [Alfresco/alfresco-ng2-components#6141 - [ADF-4481] e2e test for uploading an unsupported file](https://github.com/Alfresco/alfresco-ng2-components/pull/6141)
* [Alfresco/alfresco-ng2-components#6185 - [ACA-3626] Cloud Task - completed date filter ](https://github.com/Alfresco/alfresco-ng2-components/pull/6185)
* [Alfresco/alfresco-ng2-components#6187 - Bump snyk from 1.393.0 to 1.404.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6187)
* [Alfresco/alfresco-ng2-components#6188 - Bump lint-staged from 10.2.13 to 10.4.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6188)
* [Alfresco/alfresco-ng2-components#6189 - Bump @types/node from 14.6.4 to 14.11.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6189)
* [Alfresco/alfresco-ng2-components#6170 - Bump pdfjs-dist from 2.4.456 to 2.5.207](https://github.com/Alfresco/alfresco-ng2-components/pull/6170)
* [Alfresco/alfresco-ng2-components#6168 - Bump @nrwl/workspace from 10.1.0 to 10.2.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6168)
* [Alfresco/alfresco-ng2-components#6176 - [ACA-3689] Update edit-process-filter-cloud-component PO](https://github.com/Alfresco/alfresco-ng2-components/pull/6176)
* [Alfresco/alfresco-ng2-components#6191 - LOC-258_Localised UI files for ADF 4.1 in 16 languages](https://github.com/Alfresco/alfresco-ng2-components/pull/6191)
* [Alfresco/alfresco-ng2-components#6190 - [ACA-3957] Added correct Icon for save-as button in task filter and p…](https://github.com/Alfresco/alfresco-ng2-components/pull/6190)
* [Alfresco/alfresco-ng2-components#6134 - [AAE-3199] - Add support for searchable content model properties (new search filters panel in the attach file widget)](https://github.com/Alfresco/alfresco-ng2-components/pull/6134)
* [Alfresco/alfresco-ng2-components#6195 - Bump typedoc from 0.18.0 to 0.19.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6195)
* [Alfresco/alfresco-ng2-components#6194 - Bump ng-packagr from 10.1.0 to 10.1.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6194)
* [Alfresco/alfresco-ng2-components#6196 - Bump codelyzer from 6.0.0 to 6.0.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6196)
* [Alfresco/alfresco-ng2-components#6198 - Bump @angular-devkit/build-angular from 0.1000.7 to 0.1001.4](https://github.com/Alfresco/alfresco-ng2-components/pull/6198)
* [Alfresco/alfresco-ng2-components#6192 - [ACA-3010] - Process/Task Cloud fix wrong date range](https://github.com/Alfresco/alfresco-ng2-components/pull/6192)
* [Alfresco/alfresco-ng2-components#6197 - Bump @angular/cli from 10.1.2 to 10.1.4](https://github.com/Alfresco/alfresco-ng2-components/pull/6197)
* [Alfresco/alfresco-ng2-components#6186 - [ACA-3627] - Add completedBy filter again](https://github.com/Alfresco/alfresco-ng2-components/pull/6186)
* [Alfresco/alfresco-ng2-components#6199 - [AAE-3694] Add new Service Method for service task integration](https://github.com/Alfresco/alfresco-ng2-components/pull/6199)
* [Alfresco/alfresco-ng2-components#6200 - add support for toolbar title i18n](https://github.com/Alfresco/alfresco-ng2-components/pull/6200)
* [Alfresco/alfresco-ng2-components#6201 - [ADF-5262] Fix query execution in BaseQueryBuilderService](https://github.com/Alfresco/alfresco-ng2-components/pull/6201)
* [Alfresco/alfresco-ng2-components#6202 - [ADF-5259] - addded unit test for custom widget](https://github.com/Alfresco/alfresco-ng2-components/pull/6202)
* [Alfresco/alfresco-ng2-components#6209 - [ADF-5263] Empty page displayed all the time when load content fix ](https://github.com/Alfresco/alfresco-ng2-components/pull/6209)
* [Alfresco/alfresco-ng2-components#6210 - add missing interface property](https://github.com/Alfresco/alfresco-ng2-components/pull/6210)
* [Alfresco/alfresco-ng2-components#6205 - Bump rxjs from 6.6.2 to 6.6.3](https://github.com/Alfresco/alfresco-ng2-components/pull/6205)
* [Alfresco/alfresco-ng2-components#6212 - [ADF-5261] Fix excluded flaky tests C297689, C297690](https://github.com/Alfresco/alfresco-ng2-components/pull/6212)
* [Alfresco/alfresco-ng2-components#6211 - Bump mdast-util-compact from 2.0.1 to 3.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6211)
* [Alfresco/alfresco-ng2-components#6203 - Bump @angular-devkit/build-ng-packagr from 0.1001.0 to 0.1001.4](https://github.com/Alfresco/alfresco-ng2-components/pull/6203)
* [Alfresco/alfresco-ng2-components#6207 - Bump karma from 5.2.2 to 5.2.3](https://github.com/Alfresco/alfresco-ng2-components/pull/6207)
* [Alfresco/alfresco-ng2-components#6206 - Bump ng2-charts from 2.3.3 to 2.4.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6206)
* [Alfresco/alfresco-ng2-components#6218 - Bump remark-frontmatter from 2.0.0 to 3.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6218)
* [Alfresco/alfresco-ng2-components#6193 - [AAE-3637] Attach file - Upload button is not disabled when the user is in search mode](https://github.com/Alfresco/alfresco-ng2-components/pull/6193)
* [Alfresco/alfresco-ng2-components#6221 - [AAE-3764]Fix typo for CLAIM button on form - process services](https://github.com/Alfresco/alfresco-ng2-components/pull/6221)


Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
