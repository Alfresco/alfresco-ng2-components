---
Title: Release notes v4.0.0
---

# Alfresco Application Development Framework (ADF) version 4.0.0 Release Note

These release notes provide information about the **4.0.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/4.0.0).

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Angular 10](#angular-10)
    -   [Ordering across pages in document list](#ordering-across-pages-in-document-list)
    -   [Property constraint support for ACS 7](#property-constraint-support-for-acs-7)
-   [Localisation](#localisation)
-   [References](#references)
-   [PR merged](#pr-merged)

## New package versions

    "@alfresco/adf-content-services" : "4.0.0"
    "@alfresco/adf-process-services" : "4.0.0"
    "@alfresco/adf-core" : "4.0.0"
    "@alfresco/adf-insights" : "4.0.0",
    "@alfresco/adf-extensions": "4.0.0"
    "@alfresco/adf-testing": "4.0.0"
    "@alfresco/adf-cli": "4.0.0"

## Goals for this release

This is a major release of the Alfresco Application Development Framework developed to receive the latest and greatest benefits of the most recent version of the [Angular framework (v10)](https://blog.angular.io/version-10-of-angular-now-available-78960babd41).

The highlights of this release include the mentioned [Angular version 10 support](https://issues.alfresco.com/jira/browse/ADF-5139), ... and last but not least, the [property constraint support](https://issues.alfresco.com/jira/browse/ADF-3484) available for ACS v7 ahead.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

### Angular 10

As you probably know, ADF 3 relies on Angular 7 that has already finished its official support. Because of this, to follow the commitment to keep ADF aligned with the most recent version of Angular, here it is the "upgrade" to its version 10, recently released.

For further details on the Angular 10 release, [here](https://blog.angular.io/version-10-of-angular-now-available-78960babd41) you can find an Angular blog post describing it.

### Ordering across pages in document list

Since ADF 3.9.0, the user experience of the navigation of the repository has been enhanced allowing the filtering of the content (see [ACA-3206](https://issues.alfresco.com/jira/browse/ACA-3206) for further details). In this release of ADF, the user experience can benefit of an enhanced ordering ([ACA-3205](https://issues.alfresco.com/jira/browse/ACA-3205)) that is now "cross-pages". in case of a multi-page view on content.

### Property constraint support for ACS 7

Starting from ACS 7 (Community Edition and the future Enterprise Edition) the enhanced REST API allows the property contratint support on ADF side. As part of this enhancement, ADF and all the ADF based applications, will benefit of the support of: [list of values](https://issues.alfresco.com/jira/browse/ADF-3484), [min/max length constraints](https://issues.alfresco.com/jira/browse/ADF-5145), [min/max value constraints](https://issues.alfresco.com/jira/browse/ADF-5145) and [regular expression constraints](https://issues.alfresco.com/jira/browse/ADF-5125).

In addition to this, [the search option in list of values](https://issues.alfresco.com/jira/browse/ADF-5128) has been added, to provide a better way to comsume long lists and filter the items.

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
                        
* [adf-cli clean script - Be able to delete based on time](https://github.com/Alfresco/alfresco-ng2-components/pull/5823)
* [[ADF-5174] Add Permisssions Dialog to adf-testing Lib](https://github.com/Alfresco/alfresco-ng2-components/pull/5824)
* [AAE-2972 Use BrowserActions in login page](https://github.com/Alfresco/alfresco-ng2-components/pull/5825)
* [adf-cli k8s-clean-app - Add more logs and default interval](https://github.com/Alfresco/alfresco-ng2-components/pull/5826)
* [[AAE-2972] Add password visibility to login sso page](https://github.com/Alfresco/alfresco-ng2-components/pull/5830)
* [[ACA-3548] Convert Start Process manual cases to unit tests](https://github.com/Alfresco/alfresco-ng2-components/pull/5832)
* [[ADF-5146] Upgrade to Angular 10](https://github.com/Alfresco/alfresco-ng2-components/pull/5834)
* [cleanup dependencies and fix versions](https://github.com/Alfresco/alfresco-ng2-components/pull/5835)
* [[ADF-5175] - perform the search when at least one filter is active](https://github.com/Alfresco/alfresco-ng2-components/pull/5836)
* [[ACA-3546] Update simpleapp for DW Cloud e2e tests](https://github.com/Alfresco/alfresco-ng2-components/pull/5837)
* [adf-cli - return the project release](https://github.com/Alfresco/alfresco-ng2-components/pull/5838)
* [Travis: Fix the path for the docker image](https://github.com/Alfresco/alfresco-ng2-components/pull/5839)
* [[ADF-5177] Search-header execute when enter is pressed](https://github.com/Alfresco/alfresco-ng2-components/pull/5840)
* [ [ACA-3529] Custom filter doesn't work properly when Direction is set to ASC](https://github.com/Alfresco/alfresco-ng2-components/pull/5829)
* [[ADF-5176] - fixed apply when no value is given](https://github.com/Alfresco/alfresco-ng2-components/pull/5841)
* [Bump npm-registry-fetch from 3.9.1 to 4.0.5 in /lib/cli](https://github.com/Alfresco/alfresco-ng2-components/pull/5845)
* [[ADF-5178] - add translation for filters](https://github.com/Alfresco/alfresco-ng2-components/pull/5843)
* [[ADF-5191] move reusable actions to testing package](https://github.com/Alfresco/alfresco-ng2-components/pull/5842)
* [[ACA-3614] Add a way to not show info drawer header](https://github.com/Alfresco/alfresco-ng2-components/pull/5848)
* [use the tag and not id because does not exist](https://github.com/Alfresco/alfresco-ng2-components/pull/5847)
* [[ACA-3373] Add resources for Process Cloud e2e tests](https://github.com/Alfresco/alfresco-ng2-components/pull/5846)
* [update simpleapp](https://github.com/Alfresco/alfresco-ng2-components/pull/5852)
* [fixed simpleapp](https://github.com/Alfresco/alfresco-ng2-components/pull/5853)
* [Update the adf deps before install](https://github.com/Alfresco/alfresco-ng2-components/pull/5857)
* [[#5858] Fix elements of tags](https://github.com/Alfresco/alfresco-ng2-components/pull/5859)
* [[#5860] Fix end tag.](https://github.com/Alfresco/alfresco-ng2-components/pull/5861)
* [[MNT-21595] Content - Expose a group service for content](https://github.com/Alfresco/alfresco-ng2-components/pull/5833)
* [Update start-form.component documentation](https://github.com/Alfresco/alfresco-ng2-components/pull/5864)
* [[ACA-3596] process-header change assignee property key to createdBy](https://github.com/Alfresco/alfresco-ng2-components/pull/5854)
* [[ADF-5179] - added folders for size filters](https://github.com/Alfresco/alfresco-ng2-components/pull/5849)
* [[ACA-3613] Inconsistent role value between library views](https://github.com/Alfresco/alfresco-ng2-components/pull/5855)
* [Unify hash url strategy](https://github.com/Alfresco/alfresco-ng2-components/pull/5866)
* [[ADF-5180] Add keyboard accessibility for filters](https://github.com/Alfresco/alfresco-ng2-components/pull/5868)
* [[dev-crisj-ACA-3611]Refactor createUser method](https://github.com/Alfresco/alfresco-ng2-components/pull/5872)
* [[ADF-5063] Add translate pipe to attach file/folder widget titles](https://github.com/Alfresco/alfresco-ng2-components/pull/5877)
* [upgrade 3rd party dependencies](https://github.com/Alfresco/alfresco-ng2-components/pull/5879)
* [[AAE-3073] Fix error  due to formatSorting() in APW](https://github.com/Alfresco/alfresco-ng2-components/pull/5878)
* [[ADF-5177] Pressing enter close filter menu](https://github.com/Alfresco/alfresco-ng2-components/pull/5875)
* [[ADF-5175] Fix clear button removing multiple filter](https://github.com/Alfresco/alfresco-ng2-components/pull/5869)
* [[ACA-3184][ACA-3185] Create Task Util class](https://github.com/Alfresco/alfresco-ng2-components/pull/5863)
* [[ACA-3739] Can't upload a new version](https://github.com/Alfresco/alfresco-ng2-components/pull/5876)
* [[ACA-3499] Card View Textitem update on change](https://github.com/Alfresco/alfresco-ng2-components/pull/5882)
* [fix pagination issues](https://github.com/Alfresco/alfresco-ng2-components/pull/5881)
* [[ACA-3596] Fix e2e due to process header properties changes](https://github.com/Alfresco/alfresco-ng2-components/pull/5873)
* [Optimize tests and upgrade Nx workspace](https://github.com/Alfresco/alfresco-ng2-components/pull/5884)
* [Revert "[ACA-3499] Card View Textitem update on change"](https://github.com/Alfresco/alfresco-ng2-components/pull/5886)
* [move scripts check env in cli](https://github.com/Alfresco/alfresco-ng2-components/pull/5889)
* [[ACA-3506] - Filter are kept when reloaded](https://github.com/Alfresco/alfresco-ng2-components/pull/5885)
* [[ADF-1960] automated C315180, C310200 and C313200](https://github.com/Alfresco/alfresco-ng2-components/pull/5891)
* [[AAE-3114] Ability to restrict search to a root folder](https://github.com/Alfresco/alfresco-ng2-components/pull/5890)
* [[ADF-3484] - Metadata drop-down list option for properties constrained by a list of values](https://github.com/Alfresco/alfresco-ng2-components/pull/5892)
* [[ACA-3492] ADF - Expose new Groups Endpoints](https://github.com/Alfresco/alfresco-ng2-components/pull/5893)
* [[ACA-3672] - added server order for document -list ](https://github.com/Alfresco/alfresco-ng2-components/pull/5899)
* [Update package.json](https://github.com/Alfresco/alfresco-ng2-components/pull/5905)
* [[ACA-3765] [ADF] move reusable versioning logic](https://github.com/Alfresco/alfresco-ng2-components/pull/5906)
* [[AAE-3115] Content node selector - Ability to select multiple files](https://github.com/Alfresco/alfresco-ng2-components/pull/5904)
* [Use travis chrome version](https://github.com/Alfresco/alfresco-ng2-components/pull/5909)
* [[ACA-3742] Metadata - constraints validation](https://github.com/Alfresco/alfresco-ng2-components/pull/5908)
* [[ADF-5201] Metadata - Update node pass 'definition' field](https://github.com/Alfresco/alfresco-ng2-components/pull/5910)
* [[ACA-3751] Disable save & delete buttons for default task filters](https://github.com/Alfresco/alfresco-ng2-components/pull/5897)
* [[ACA-3678] Disable save & delete buttons for default process filters](https://github.com/Alfresco/alfresco-ng2-components/pull/5896)
* [[ACA-100] View a previous version ](https://github.com/Alfresco/alfresco-ng2-components/pull/5913)
* [[ACA-3107] add possibility to hide task name from the sidenav](https://github.com/Alfresco/alfresco-ng2-components/pull/5883)
* [[AAE-3162] [ADF-APS1] Local storage option of attach file widget is not displayed](https://github.com/Alfresco/alfresco-ng2-components/pull/5916)
* [Put folder on top by default](https://github.com/Alfresco/alfresco-ng2-components/pull/5918)
* [[ACA-3645] add missing task list translation key](https://github.com/Alfresco/alfresco-ng2-components/pull/5920)
* [[ACA-100] FIX - View a previous version](https://github.com/Alfresco/alfresco-ng2-components/pull/5915)
* [[AAE-3115] Make selectionMode optioanl in ContentNodeSelectorComponentData](https://github.com/Alfresco/alfresco-ng2-components/pull/5921)
* [[ADF-5204] Metadata - Error message still appears after exiting Edit form](https://github.com/Alfresco/alfresco-ng2-components/pull/5922)
* [[ACA-3590]Created process-instance-header, info-drawer and task-header POs](https://github.com/Alfresco/alfresco-ng2-components/pull/5894)
* [[AAE-3113] Node selector - Be able to restrict the breadcrums to a specific root](https://github.com/Alfresco/alfresco-ng2-components/pull/5912)
* [[ACA-3745] Folder - update metadata default copies the name in the title field](https://github.com/Alfresco/alfresco-ng2-components/pull/5923)
* [Minor cosmetic fix filter](https://github.com/Alfresco/alfresco-ng2-components/pull/5927)
* [[ACA-3687] Implement Process definition name filter dropdown in Process List](https://github.com/Alfresco/alfresco-ng2-components/pull/5870)
* [[ADF-5209] When viewing a previous version, the title is not displayed correctly.](https://github.com/Alfresco/alfresco-ng2-components/pull/5926)
* [fix drop effect](https://github.com/Alfresco/alfresco-ng2-components/pull/5925)
* [[ACA-3731] E2E test to validate Save, Save as and Delete buttons availability on custom filters](https://github.com/Alfresco/alfresco-ng2-components/pull/5929)
* [[ACA-3687] Implement Process definition name filter dropdown in Process List](https://github.com/Alfresco/alfresco-ng2-components/pull/5935)
* [remove unused ID and fix the duplicate warning](https://github.com/Alfresco/alfresco-ng2-components/pull/5933)
* [[AAE-612] Support for Form Outcome Visibility Conditions](https://github.com/Alfresco/alfresco-ng2-components/pull/5934)
* [[AAE-3110] Move upload button inside the node selector dialog](https://github.com/Alfresco/alfresco-ng2-components/pull/5901)
* [[ACA-3551] Show vs View button for attach widget.](https://github.com/Alfresco/alfresco-ng2-components/pull/5850)
* [[ACA-3795] E2E test to validate Delete Save and Save as actions should be displayed and enabled when clicking on custom filter header](https://github.com/Alfresco/alfresco-ng2-components/pull/5930)
* [Updated simpleapp](https://github.com/Alfresco/alfresco-ng2-components/pull/5941)
* [Improve smart runner](https://github.com/Alfresco/alfresco-ng2-components/pull/5942)
* [[AAE-3177] Fix tests that are using attach file widget](https://github.com/Alfresco/alfresco-ng2-components/pull/5939)
* [[AAE-3208] Remove local file widget param for attach-file-cloud-widget](https://github.com/Alfresco/alfresco-ng2-components/pull/5943)
* [[ACA-3727] - Process Filters add possibility to hide process filter name](https://github.com/Alfresco/alfresco-ng2-components/pull/5938)
* [[ACA-3542] - added sorting for filters](https://github.com/Alfresco/alfresco-ng2-components/pull/5932)
* [[ACA-3728] Remove the filter name from the custom filter header](https://github.com/Alfresco/alfresco-ng2-components/pull/5940)
* [[ADF-5210] Order by folder on default](https://github.com/Alfresco/alfresco-ng2-components/pull/5945)
* [[AAE-3203] Add tooltip to Form Cloud Widgets](https://github.com/Alfresco/alfresco-ng2-components/pull/5947)
* [[AAE-3200] Attach button of content node selector becomes enabled when selecting a folder](https://github.com/Alfresco/alfresco-ng2-components/pull/5946)
* [[ACA-3678] Disable Save and Delete Button for Default Filters](https://github.com/Alfresco/alfresco-ng2-components/pull/5928)
* [[AAE-3209]Fix e2e about attach file from local](https://github.com/Alfresco/alfresco-ng2-components/pull/5944)
* [Not sortable id and lock in demo shell](https://github.com/Alfresco/alfresco-ng2-components/pull/5949)
* [[ACA-3804] Add All option in process definition name filter dropdown](https://github.com/Alfresco/alfresco-ng2-components/pull/5937)
* [[#5950] Fix branch name.](https://github.com/Alfresco/alfresco-ng2-components/pull/5951)
* [[AAE-3214]Improve process-task-attach-content-file-cloud.e2e.ts](https://github.com/Alfresco/alfresco-ng2-components/pull/5948)
* [[ACA-3762] Task/Process filters not working with updatePagination](https://github.com/Alfresco/alfresco-ng2-components/pull/5936)
* [[#5956] Property enclose in []](https://github.com/Alfresco/alfresco-ng2-components/pull/5957)
* [[AAE-3219] Start process button is disabled when page is first displayed](https://github.com/Alfresco/alfresco-ng2-components/pull/5955)
* [[AAE-2718] List available roles for a group](https://github.com/Alfresco/alfresco-ng2-components/pull/5954)
* [excluded C286516](https://github.com/Alfresco/alfresco-ng2-components/pull/5959)
* [Modify candidatebaseapp - input and output forms that are using attac…](https://github.com/Alfresco/alfresco-ng2-components/pull/5952)
* [Readded column key as key parameter](https://github.com/Alfresco/alfresco-ng2-components/pull/5960)
* [Fix process-task-attach-content-file-cloud.e2e.ts afterAll](https://github.com/Alfresco/alfresco-ng2-components/pull/5963)
* [[ADF-5213] Metadata - select list filter](https://github.com/Alfresco/alfresco-ng2-components/pull/5961)
* [[AAE-296] Remove excluded test](https://github.com/Alfresco/alfresco-ng2-components/pull/5964)
* [[AAE-3084] Add retrieve metadata option in upload widget](https://github.com/Alfresco/alfresco-ng2-components/pull/5903)
* [[ACA-3551] - Change icon for the view option](https://github.com/Alfresco/alfresco-ng2-components/pull/5967)
* [[ADF-5213] Metadata - select list filter documentation](https://github.com/Alfresco/alfresco-ng2-components/pull/5965)
* [Update documentation 4.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/5968)
* [[ACA-3742] - update i18n error strings](https://github.com/Alfresco/alfresco-ng2-components/pull/5966)
* [Update protractor.excludes.json](https://github.com/Alfresco/alfresco-ng2-components/pull/5972)
* [update datepicker](https://github.com/Alfresco/alfresco-ng2-components/pull/5971)
* [Improve attach file widget PO](https://github.com/Alfresco/alfresco-ng2-components/pull/5973)
* [[ADF-5159] fix visibility condition for label radio box](https://github.com/Alfresco/alfresco-ng2-components/pull/5974)
* [Fixed parent changing for search header](https://github.com/Alfresco/alfresco-ng2-components/pull/5975)
* [Modify simpleapp and candidatesbaseapp](https://github.com/Alfresco/alfresco-ng2-components/pull/5978)
* [use people api and new js api where possible](https://github.com/Alfresco/alfresco-ng2-components/pull/5888)
* [[AAE-3204] 'Invalid destination folder path' displayed when clicking on attach file widget of type alfresco & local when destination folder is empty.](https://github.com/Alfresco/alfresco-ng2-components/pull/5962)
* [LOC-244 - All localised files in 16 languages for ADF 4.0 release](https://github.com/Alfresco/alfresco-ng2-components/pull/5980)
* [[ADF-5198] process header loaded event](https://github.com/Alfresco/alfresco-ng2-components/pull/5981)
* [[AAE-3258] Update simpleapp](https://github.com/Alfresco/alfresco-ng2-components/pull/5982)
* [[ADF-5165] [Regression] Fix Checkbok widget in completed tasks](https://github.com/Alfresco/alfresco-ng2-components/pull/5979)
* [[AAE-2984] fix save not modified Form with dropdown](https://github.com/Alfresco/alfresco-ng2-components/pull/5976)
* [[AAE-3204] Fix destinationFolder breadcrumb restriction not working](https://github.com/Alfresco/alfresco-ng2-components/pull/5984)
* [[ADF-5165] - added involved user for task](https://github.com/Alfresco/alfresco-ng2-components/pull/5985)
* [update doc node selector and interface](https://github.com/Alfresco/alfresco-ng2-components/pull/5987)
* [[ACA-3603] Destination picker is not opening on My Files when clicking on Attach file widget](https://github.com/Alfresco/alfresco-ng2-components/pull/5865)
* [[AAE-2378] Add tooltip to People and Group Cloud Widgets](https://github.com/Alfresco/alfresco-ng2-components/pull/5990)
* [allow styling cloud header from the outside](https://github.com/Alfresco/alfresco-ng2-components/pull/5988)
* [[ACA-3839] Document List - clear filter called multiple times](https://github.com/Alfresco/alfresco-ng2-components/pull/5991)
* [[ACA-3506] - Fixed refresh for filters on ADF](https://github.com/Alfresco/alfresco-ng2-components/pull/5993)
* [Bump remark from 9.0.0 to 12.0.1](https://github.com/Alfresco/alfresco-ng2-components/pull/5996)

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
