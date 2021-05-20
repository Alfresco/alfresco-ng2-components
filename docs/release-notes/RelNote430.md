---
Title: Release notes v4.3.0
---

# Alfresco Application Development Framework (ADF) version 4.3.0 Release Note

These release notes provide information about the **4.3.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/4.3.0).

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Custom type and aspect management](#custom-type-and-aspect-management)
-   [Localisation](#localisation)
-   [References](#references)
-   [PR merged](#pr-merged)

## New package versions

    "@alfresco/adf-content-services" : "4.3.0"
    "@alfresco/adf-process-services" : "4.3.0"
    "@alfresco/adf-core" : "4.3.0"
    "@alfresco/adf-insights" : "4.3.0",
    "@alfresco/adf-extensions": "4.3.0"
    "@alfresco/adf-testing": "4.3.0"
    "@alfresco/adf-cli": "4.3.0"

## Goals for this release

This is a minor release of the Alfresco Application Development Framework, developed to receive the latest and greatest benefits of the bugfixes and the enhancements planned since the release of the previous version.

The highlights of this release is mainly about bugfixes and enhancements related to the Alfresco Process Application (APA) use cases. In addition, since this version, ADF can manage the change of custom type and aspects of a node (working since ACS 7).

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

### Custom type and aspect management

All the developers and end-users can now benefit from the content-type management as well as aspect management of a document (or node in general). As is possible using the Share UI, since this version of ADF an end-user can change the custom type as well manage the aspects of a content through the interface. This feature works against ACS 7 ahead.

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

* [Alfresco/alfresco-ng2-components#6442 - Removed the TODO placeholders from the release note.](https://github.com/Alfresco/alfresco-ng2-components/pull/6442)
* [Alfresco/alfresco-ng2-components#6440 - Bump @alfresco/js-api from 4.1.0 to 4.2.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6440)
* [Alfresco/alfresco-ng2-components#6438 - [ACA-4218] - fix tomorrow date range filter](https://github.com/Alfresco/alfresco-ng2-components/pull/6438)
* [Alfresco/alfresco-ng2-components#6424 - remove old context menu](https://github.com/Alfresco/alfresco-ng2-components/pull/6424)
* [Alfresco/alfresco-ng2-components#6446 - ACA-4175 Show number of user's home folders during environment scan](https://github.com/Alfresco/alfresco-ng2-components/pull/6446)
* [Alfresco/alfresco-ng2-components#6451 - Remove escaped characters to fix ABN publish](https://github.com/Alfresco/alfresco-ng2-components/pull/6451)
* [Alfresco/alfresco-ng2-components#6402 - Use hash strategy in demo shell as the other apps](https://github.com/Alfresco/alfresco-ng2-components/pull/6402)
* [Alfresco/alfresco-ng2-components#6467 - Bump highlight.js from 10.2.0 to 10.4.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6467)
* [Alfresco/alfresco-ng2-components#6464 - Bump markdownlint-cli from 0.25.0 to 0.26.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6464)
* [Alfresco/alfresco-ng2-components#6468 - Bump snyk from 1.431.2 to 1.437.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6468)
* [Alfresco/alfresco-ng2-components#6457 - Bump commander from 6.1.0 to 6.2.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6457)
* [Alfresco/alfresco-ng2-components#6461 - ACA-4176 & ACA-4177 Show number of groups, sites and files during environment scan](https://github.com/Alfresco/alfresco-ng2-components/pull/6461)
* [Alfresco/alfresco-ng2-components#6469 - Duplicated tutorial (because of the renaming)](https://github.com/Alfresco/alfresco-ng2-components/pull/6469)
* [Alfresco/alfresco-ng2-components#6365 - [ADF-5281][ADF] Can't go through a form with date/dateTime widgets only with Tab](https://github.com/Alfresco/alfresco-ng2-components/pull/6365)
* [Alfresco/alfresco-ng2-components#6476 - [AAE-3869] Update simpleapp adding custom model forms](https://github.com/Alfresco/alfresco-ng2-components/pull/6476)
* [Alfresco/alfresco-ng2-components#6478 - [ADF-5014] unit tests are added for using date fields as visibility conditions](https://github.com/Alfresco/alfresco-ng2-components/pull/6478)
* [Alfresco/alfresco-ng2-components#6487 - add missing toolbar title class](https://github.com/Alfresco/alfresco-ng2-components/pull/6487)
* [Alfresco/alfresco-ng2-components#6490 - [ACA-4231] Added a table format to the scan-env command](https://github.com/Alfresco/alfresco-ng2-components/pull/6490)
* [Alfresco/alfresco-ng2-components#6486 - [ACA-4227] [APS] Create a script to check Process Services Management plugin status before running e2e tests](https://github.com/Alfresco/alfresco-ng2-components/pull/6486)
* [Alfresco/alfresco-ng2-components#6495 - Bump @types/selenium-webdriver from 4.0.10 to 4.0.11](https://github.com/Alfresco/alfresco-ng2-components/pull/6495)
* [Alfresco/alfresco-ng2-components#6489 - add missing toolbar tests](https://github.com/Alfresco/alfresco-ng2-components/pull/6489)
* [Alfresco/alfresco-ng2-components#6492 - Bump cspell from 4.2.3 to 5.1.3](https://github.com/Alfresco/alfresco-ng2-components/pull/6492)
* [Alfresco/alfresco-ng2-components#6491 - Bump js-yaml from 3.14.0 to 4.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6491)
* [Alfresco/alfresco-ng2-components#6496 - [AAE-4369] adf-cli - Build the docker image only once and create tag link](https://github.com/Alfresco/alfresco-ng2-components/pull/6496)
* [Alfresco/alfresco-ng2-components#6460 - [AAE-3472] e2e service task](https://github.com/Alfresco/alfresco-ng2-components/pull/6460)
* [Alfresco/alfresco-ng2-components#6502 - Fix - Add all-tags as additional option](https://github.com/Alfresco/alfresco-ng2-components/pull/6502)
* [Alfresco/alfresco-ng2-components#6503 - Revert "[DRAFT] Adding script for updating users on APS1"](https://github.com/Alfresco/alfresco-ng2-components/pull/6503)
* [Alfresco/alfresco-ng2-components#6504 - docker-publish fix - Push the image with tag](https://github.com/Alfresco/alfresco-ng2-components/pull/6504)
* [Alfresco/alfresco-ng2-components#6505 - updated simpleapp with dynamic callActivity](https://github.com/Alfresco/alfresco-ng2-components/pull/6505)
* [Alfresco/alfresco-ng2-components#6507 - Fix broken tutorial link](https://github.com/Alfresco/alfresco-ng2-components/pull/6507)
* [Alfresco/alfresco-ng2-components#6511 - Bump nconf from 0.11.0 to 0.11.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6511)
* [Alfresco/alfresco-ng2-components#6508 - Bump typedoc from 0.19.2 to 0.20.13](https://github.com/Alfresco/alfresco-ng2-components/pull/6508)
* [Alfresco/alfresco-ng2-components#6445 - fix typescript errors (latest typescript)](https://github.com/Alfresco/alfresco-ng2-components/pull/6445)
* [Alfresco/alfresco-ng2-components#6514 - [ADF-5308] excluded e2e C311290](https://github.com/Alfresco/alfresco-ng2-components/pull/6514)
* [Alfresco/alfresco-ng2-components#6513 - add missing app instance types](https://github.com/Alfresco/alfresco-ng2-components/pull/6513)
* [Alfresco/alfresco-ng2-components#6466 - [AAE-4311] Make sure we have unit test coverage of the error component.](https://github.com/Alfresco/alfresco-ng2-components/pull/6466)
* [Alfresco/alfresco-ng2-components#6515 - [AAE-4379] i18n fixes](https://github.com/Alfresco/alfresco-ng2-components/pull/6515)
* [Alfresco/alfresco-ng2-components#6516 - Bump typedoc from 0.20.13 to 0.20.14](https://github.com/Alfresco/alfresco-ng2-components/pull/6516)
* [Alfresco/alfresco-ng2-components#6512 - Fix loop scenario when the login page is not present in silent login](https://github.com/Alfresco/alfresco-ng2-components/pull/6512)
* [Alfresco/alfresco-ng2-components#6506 - [AAE-3467] - Fix Uploaded files are not being attached after selecting more files](https://github.com/Alfresco/alfresco-ng2-components/pull/6506)
* [Alfresco/alfresco-ng2-components#6412 - [AAE-4241] Populate date and datetime widgets on retrieve metadata](https://github.com/Alfresco/alfresco-ng2-components/pull/6412)
* [Alfresco/alfresco-ng2-components#6518 - adf-cli init-aae-env - Add request as dependency](https://github.com/Alfresco/alfresco-ng2-components/pull/6518)
* [Alfresco/alfresco-ng2-components#6522 - Bump sass-loader from 10.0.5 to 10.1.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6522)
* [Alfresco/alfresco-ng2-components#6521 - Bump @nrwl/workspace from 10.4.1 to 11.1.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6521)
* [Alfresco/alfresco-ng2-components#6473 - [ACA-3975]Add process definitions to simpleapp](https://github.com/Alfresco/alfresco-ng2-components/pull/6473)
* [Alfresco/alfresco-ng2-components#6524 - [ADF-5308] Unexclude C311290](https://github.com/Alfresco/alfresco-ng2-components/pull/6524)
* [Alfresco/alfresco-ng2-components#6528 - [ACA-3969]Add new process definition to simpleapp](https://github.com/Alfresco/alfresco-ng2-components/pull/6528)
* [Alfresco/alfresco-ng2-components#6526 - [AAE-4364] Add delete release api call](https://github.com/Alfresco/alfresco-ng2-components/pull/6526)
* [Alfresco/alfresco-ng2-components#6531 - [AAE-4295] E2E - Add retry api calls for delete descriptor and application](https://github.com/Alfresco/alfresco-ng2-components/pull/6531)
* [Alfresco/alfresco-ng2-components#6519 - [ACA-4233] Call the scan-env adf-cli command before and after each E2E job](https://github.com/Alfresco/alfresco-ng2-components/pull/6519)
* [Alfresco/alfresco-ng2-components#6525 - TestElement prototype to greatly reduce e2e coding time](https://github.com/Alfresco/alfresco-ng2-components/pull/6525)
* [Alfresco/alfresco-ng2-components#6536 - [ADF-5311] Extract infinite select scroll loading logic to a reusable component](https://github.com/Alfresco/alfresco-ng2-components/pull/6536)
* [Alfresco/alfresco-ng2-components#6532 - Bump snyk from 1.437.2 to 1.437.4](https://github.com/Alfresco/alfresco-ng2-components/pull/6532)
* [Alfresco/alfresco-ng2-components#6538 - adf-cli init aps env - Upload the APS default app](https://github.com/Alfresco/alfresco-ng2-components/pull/6538)
* [Alfresco/alfresco-ng2-components#6539 - [ACA-4247] Improve login error logs in scan-env command in adf-cli](https://github.com/Alfresco/alfresco-ng2-components/pull/6539)
* [Alfresco/alfresco-ng2-components#6542 - [ACA-4223] Add process definition name filter](https://github.com/Alfresco/alfresco-ng2-components/pull/6542)
* [Alfresco/alfresco-ng2-components#6540 - [AAE-4426] Add upload from local tab in attach file widget](https://github.com/Alfresco/alfresco-ng2-components/pull/6540)
* [Alfresco/alfresco-ng2-components#6517 - [MNT-22051] - Fix form field mapping when value is zero](https://github.com/Alfresco/alfresco-ng2-components/pull/6517)
* [Alfresco/alfresco-ng2-components#6546 - [ACA-4252] Update authentication to SSO](https://github.com/Alfresco/alfresco-ng2-components/pull/6546)
* [Alfresco/alfresco-ng2-components#6541 - Bump commander from 6.2.1 to 7.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6541)
* [Alfresco/alfresco-ng2-components#6548 - Bump typedoc from 0.20.14 to 0.20.16](https://github.com/Alfresco/alfresco-ng2-components/pull/6548)
* [Alfresco/alfresco-ng2-components#6551 - [ADF-5324] - Expose a new adf-cli command to initialise acs-env](https://github.com/Alfresco/alfresco-ng2-components/pull/6551)
* [Alfresco/alfresco-ng2-components#6523 - [ACA-4229] [ADW-AGS] Move Governance plugin check script to ADF CLI](https://github.com/Alfresco/alfresco-ng2-components/pull/6523)
* [Alfresco/alfresco-ng2-components#6559 - [AAE-4384] Add blank page component](https://github.com/Alfresco/alfresco-ng2-components/pull/6559)
* [Alfresco/alfresco-ng2-components#6566 - Revert "[AAE-4384] Add blank page component"](https://github.com/Alfresco/alfresco-ng2-components/pull/6566)
* [Alfresco/alfresco-ng2-components#6529 - [MNT-22063] - fix form cloud layout](https://github.com/Alfresco/alfresco-ng2-components/pull/6529)
* [Alfresco/alfresco-ng2-components#6564 - [MNT-21636] Fix redirect URL for viewer](https://github.com/Alfresco/alfresco-ng2-components/pull/6564)
* [Alfresco/alfresco-ng2-components#6544 - [ACA-3455] [ACA-4250] Create methods needed for candidate tasks](https://github.com/Alfresco/alfresco-ng2-components/pull/6544)
* [Alfresco/alfresco-ng2-components#6574 - Do redirect before implicit button](https://github.com/Alfresco/alfresco-ng2-components/pull/6574)
* [Alfresco/alfresco-ng2-components#6569 - Bump stylelint from 13.8.0 to 13.9.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6569)
* [Alfresco/alfresco-ng2-components#6576 - [AAE-4521] Remove process UI from test projects](https://github.com/Alfresco/alfresco-ng2-components/pull/6576)
* [Alfresco/alfresco-ng2-components#6571 - Bump typedoc from 0.20.14 to 0.20.18](https://github.com/Alfresco/alfresco-ng2-components/pull/6571)
* [Alfresco/alfresco-ng2-components#6570 - Bump husky from 4.3.0 to 4.3.8](https://github.com/Alfresco/alfresco-ng2-components/pull/6570)
* [Alfresco/alfresco-ng2-components#6545 - Getting started tutorial on ADF.](https://github.com/Alfresco/alfresco-ng2-components/pull/6545)
* [Alfresco/alfresco-ng2-components#6567 - [AAE-4384] Add blank page component](https://github.com/Alfresco/alfresco-ng2-components/pull/6567)
* [Alfresco/alfresco-ng2-components#6578 - [ACA-4262] Content node selector - show 2 tabs only in cloud attach f…](https://github.com/Alfresco/alfresco-ng2-components/pull/6578)
* [Alfresco/alfresco-ng2-components#6577 - Fix viewer page loading method](https://github.com/Alfresco/alfresco-ng2-components/pull/6577)
* [Alfresco/alfresco-ng2-components#6556 - [ACA-4258] Add Task Filter Counters](https://github.com/Alfresco/alfresco-ng2-components/pull/6556)
* [Alfresco/alfresco-ng2-components#6586 - "Empty content" centering fixes](https://github.com/Alfresco/alfresco-ng2-components/pull/6586)
* [Alfresco/alfresco-ng2-components#6587 - [AAE-4534] Logout directive - handle the route based on app config](https://github.com/Alfresco/alfresco-ng2-components/pull/6587)
* [Alfresco/alfresco-ng2-components#6591 - improve the init by failing in case the app are not running](https://github.com/Alfresco/alfresco-ng2-components/pull/6591)
* [Alfresco/alfresco-ng2-components#6593 - Check if the order matter](https://github.com/Alfresco/alfresco-ng2-components/pull/6593)
* [Alfresco/alfresco-ng2-components#6601 - [AAE-4546] Update simpleapp](https://github.com/Alfresco/alfresco-ng2-components/pull/6601)
* [Alfresco/alfresco-ng2-components#6614 - Install NX if is in Travis Update lint.sh](https://github.com/Alfresco/alfresco-ng2-components/pull/6614)
* [Alfresco/alfresco-ng2-components#6616 - [AAE-4547] Add new process and form to simpleapp](https://github.com/Alfresco/alfresco-ng2-components/pull/6616)
* [Alfresco/alfresco-ng2-components#6608 - [AAE-4553] Improve error logs in scan-env](https://github.com/Alfresco/alfresco-ng2-components/pull/6608)
* [Alfresco/alfresco-ng2-components#6575 - [AAE-4427] Embed upload progress dialog inside the upload from your d…](https://github.com/Alfresco/alfresco-ng2-components/pull/6575)
* [Alfresco/alfresco-ng2-components#6592 - [AAE-4430] Upload from local tab visibility with info icon error message](https://github.com/Alfresco/alfresco-ng2-components/pull/6592)
* [Alfresco/alfresco-ng2-components#6630 - [ADF-5328] - fix replacing priority values error](https://github.com/Alfresco/alfresco-ng2-components/pull/6630)
* [Alfresco/alfresco-ng2-components#6557 - [AAE-4504] FE - [ADF] Fetch destination Folder Path from a static path](https://github.com/Alfresco/alfresco-ng2-components/pull/6557)
* [Alfresco/alfresco-ng2-components#6635 - Bump @angular/cli from 10.2.0 to 11.1.3](https://github.com/Alfresco/alfresco-ng2-components/pull/6635)
* [Alfresco/alfresco-ng2-components#6634 - Bump @types/node from 14.14.8 to 14.14.25](https://github.com/Alfresco/alfresco-ng2-components/pull/6634)
* [Alfresco/alfresco-ng2-components#6633 - Bump snyk from 1.437.4 to 1.445.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6633)
* [Alfresco/alfresco-ng2-components#6629 - Update simpleapp and candidatebaseapp: destinationFolderPath and add attach file widgets](https://github.com/Alfresco/alfresco-ng2-components/pull/6629)
* [Alfresco/alfresco-ng2-components#6627 - [AAE-4547] Add new process definition to simpleapp](https://github.com/Alfresco/alfresco-ng2-components/pull/6627)
* [Alfresco/alfresco-ng2-components#6580 - [ADF-4329][ASD-5330] plus Improve e2e](https://github.com/Alfresco/alfresco-ng2-components/pull/6580)
* [Alfresco/alfresco-ng2-components#6628 - [ACA-4265]Refactor attachFileFromLocal method](https://github.com/Alfresco/alfresco-ng2-components/pull/6628)
* [Alfresco/alfresco-ng2-components#6642 - Bump ejs from 3.1.5 to 3.1.6](https://github.com/Alfresco/alfresco-ng2-components/pull/6642)
* [Alfresco/alfresco-ng2-components#6643 - Bump snyk from 1.445.0 to 1.446.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6643)
* [Alfresco/alfresco-ng2-components#6626 - [ATS-854] Add media tracks to player from webvtt rendition](https://github.com/Alfresco/alfresco-ng2-components/pull/6626)
* [Alfresco/alfresco-ng2-components#6600 - Tutorial on creating ADF based applications.](https://github.com/Alfresco/alfresco-ng2-components/pull/6600)
* [Alfresco/alfresco-ng2-components#6641 - Bump stylelint from 13.8.0 to 13.9.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6641)
* [Alfresco/alfresco-ng2-components#6638 - Update branch for JS-API PR#3205](https://github.com/Alfresco/alfresco-ng2-components/pull/6638)
* [Alfresco/alfresco-ng2-components#6644 - Update simpleapp to use candidate group on attach-local-file-on-task …](https://github.com/Alfresco/alfresco-ng2-components/pull/6644)
* [Alfresco/alfresco-ng2-components#6620 - [AAE-4529] Refactor Notification History Component](https://github.com/Alfresco/alfresco-ng2-components/pull/6620)
* [Alfresco/alfresco-ng2-components#6639 - [ADF-5331] - Alpha ADF/JS-API update has been successfully created.](https://github.com/Alfresco/alfresco-ng2-components/pull/6639)
* [Alfresco/alfresco-ng2-components#6636 - [AAE-4569] Added readOnly property to breadcrumb components](https://github.com/Alfresco/alfresco-ng2-components/pull/6636)
* [Alfresco/alfresco-ng2-components#6650 - Update children script ](https://github.com/Alfresco/alfresco-ng2-components/pull/6650)
* [Alfresco/alfresco-ng2-components#6652 - Bump snyk from 1.446.0 to 1.448.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6652)
* [Alfresco/alfresco-ng2-components#6656 - [ACA-4266] Improve governance plugin check logs](https://github.com/Alfresco/alfresco-ng2-components/pull/6656)
* [Alfresco/alfresco-ng2-components#6654 - Bump typescript from 3.9.7 to 3.9.8](https://github.com/Alfresco/alfresco-ng2-components/pull/6654)
* [Alfresco/alfresco-ng2-components#6655 - Bump @nrwl/workspace from 11.1.2 to 11.2.11](https://github.com/Alfresco/alfresco-ng2-components/pull/6655)
* [Alfresco/alfresco-ng2-components#6657 - Bump ini from 1.3.5 to 1.3.7](https://github.com/Alfresco/alfresco-ng2-components/pull/6657)
* [Alfresco/alfresco-ng2-components#6543 - [ADF-5313] Merge both form-fields POs in one because are identical](https://github.com/Alfresco/alfresco-ng2-components/pull/6543)
* [Alfresco/alfresco-ng2-components#6658 - [MNT-21636] Refactor redirect URL](https://github.com/Alfresco/alfresco-ng2-components/pull/6658)
* [Alfresco/alfresco-ng2-components#6663 - updated simpleapp with outcome visibility](https://github.com/Alfresco/alfresco-ng2-components/pull/6663)
* [Alfresco/alfresco-ng2-components#6602 - [ADF-5316] - Content Type](https://github.com/Alfresco/alfresco-ng2-components/pull/6602)
* [Alfresco/alfresco-ng2-components#6668 - Bump @angular/cli from 11.1.3 to 11.2.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6668)
* [Alfresco/alfresco-ng2-components#6669 - Bump stylelint from 13.9.0 to 13.10.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6669)
* [Alfresco/alfresco-ng2-components#6666 - Bump @types/node from 14.14.25 to 14.14.26](https://github.com/Alfresco/alfresco-ng2-components/pull/6666)
* [Alfresco/alfresco-ng2-components#6667 - Bump snyk from 1.448.0 to 1.452.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6667)
* [Alfresco/alfresco-ng2-components#6664 - [AAE-4429] Add readOnly breadcrumb to upload from device tab](https://github.com/Alfresco/alfresco-ng2-components/pull/6664)
* [Alfresco/alfresco-ng2-components#6671 - Fix promise redirect](https://github.com/Alfresco/alfresco-ng2-components/pull/6671)
* [Alfresco/alfresco-ng2-components#6672 - Bump socket.io from 2.3.0 to 2.4.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6672)
* [Alfresco/alfresco-ng2-components#6670 - Update branch for JS-API PR#3207](https://github.com/Alfresco/alfresco-ng2-components/pull/6670)
* [Alfresco/alfresco-ng2-components#6651 - [ADF-5332] Login basic auth - Ability to override the successRoute from app.config.json](https://github.com/Alfresco/alfresco-ng2-components/pull/6651)
* [Alfresco/alfresco-ng2-components#6673 - excluded flaky test C260241](https://github.com/Alfresco/alfresco-ng2-components/pull/6673)
* [Alfresco/alfresco-ng2-components#6607 - [ACA-4259] Task filter counter notifications](https://github.com/Alfresco/alfresco-ng2-components/pull/6607)
* [Alfresco/alfresco-ng2-components#6674 - [AAE-3326] Content node selector - sort files by createdAt desc by de…](https://github.com/Alfresco/alfresco-ng2-components/pull/6674)
* [Alfresco/alfresco-ng2-components#6685 - configure dependabot excludes](https://github.com/Alfresco/alfresco-ng2-components/pull/6685)
* [Alfresco/alfresco-ng2-components#6688 - Avoid to recall the method if no change detect is affected](https://github.com/Alfresco/alfresco-ng2-components/pull/6688)
* [Alfresco/alfresco-ng2-components#6689 - Update branch for JS-API PR#3224](https://github.com/Alfresco/alfresco-ng2-components/pull/6689)
* [Alfresco/alfresco-ng2-components#6549 - [ADF-5305] - Added aspect list component](https://github.com/Alfresco/alfresco-ng2-components/pull/6549)
* [Alfresco/alfresco-ng2-components#6695 - Bump snyk from 1.452.0 to 1.456.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6695)
* [Alfresco/alfresco-ng2-components#6693 - Aspect List - added spinner and refresh](https://github.com/Alfresco/alfresco-ng2-components/pull/6693)
* [Alfresco/alfresco-ng2-components#6694 - Bump apollo-angular from 2.2.0 to 2.3.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6694)
* [Alfresco/alfresco-ng2-components#6665 - [AAE-4452] FE - [ADF] Fetch destination folder path from mapped variables](https://github.com/Alfresco/alfresco-ng2-components/pull/6665)
* [Alfresco/alfresco-ng2-components#6698 - Enabling default aspects for card component](https://github.com/Alfresco/alfresco-ng2-components/pull/6698)
* [Alfresco/alfresco-ng2-components#6697 - [ADF-5341] Add Apollo direct dependencies](https://github.com/Alfresco/alfresco-ng2-components/pull/6697)
* [Alfresco/alfresco-ng2-components#6699 - Improve update-project script to update adf-cli and adf-testing packages](https://github.com/Alfresco/alfresco-ng2-components/pull/6699)
* [Alfresco/alfresco-ng2-components#6691 - [MNT-21636] Use URLTree for redirect](https://github.com/Alfresco/alfresco-ng2-components/pull/6691)
* [Alfresco/alfresco-ng2-components#6690 - [AAE-4637] Fix varying height of dialog when clicking on the Upload from your device tab](https://github.com/Alfresco/alfresco-ng2-components/pull/6690)
* [Alfresco/alfresco-ng2-components#6700 - [ACA-3881] Able to start form with preselected ACS nodes](https://github.com/Alfresco/alfresco-ng2-components/pull/6700)
* [Alfresco/alfresco-ng2-components#6696 - [ADF-5339]  ESCAPE should close opened dialog not the overlay viewer](https://github.com/Alfresco/alfresco-ng2-components/pull/6696)
* [Alfresco/alfresco-ng2-components#6706 - Update branch for JS-API PR#3232](https://github.com/Alfresco/alfresco-ng2-components/pull/6706)
* [Alfresco/alfresco-ng2-components#6704 - [AAE-4608] Use smartrunner version 2 and add SuperCache (workspaces + S3 combo)!](https://github.com/Alfresco/alfresco-ng2-components/pull/6704)
* [Alfresco/alfresco-ng2-components#6714 - [AAE-4701] ADF check env - Fail if the env is not reachable](https://github.com/Alfresco/alfresco-ng2-components/pull/6714)
* [Alfresco/alfresco-ng2-components#6715 - Auto PR - Add the ADF number to easily identify the version](https://github.com/Alfresco/alfresco-ng2-components/pull/6715)
* [Alfresco/alfresco-ng2-components#6684 - [ACA-4208] - Fix process date filter for range](https://github.com/Alfresco/alfresco-ng2-components/pull/6684)
* [Alfresco/alfresco-ng2-components#6710 - Bump concurrently from 5.3.0 to 6.0.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6710)
* [Alfresco/alfresco-ng2-components#6712 - Bump typedoc from 0.20.14 to 0.20.27](https://github.com/Alfresco/alfresco-ng2-components/pull/6712)
* [Alfresco/alfresco-ng2-components#6707 - [AAE-4661] Fix search results are still displayed when search term ge…](https://github.com/Alfresco/alfresco-ng2-components/pull/6707)
* [Alfresco/alfresco-ng2-components#6719 - [AAE-4203][AAE-4292] - Fix breadcrumb and folder navigation issues wh…](https://github.com/Alfresco/alfresco-ng2-components/pull/6719)
* [Alfresco/alfresco-ng2-components#6717 - [AAE-4624] - fix user initials for identity user with bpm](https://github.com/Alfresco/alfresco-ng2-components/pull/6717)
* [Alfresco/alfresco-ng2-components#6418 - [ADF-5285] Re-include test](https://github.com/Alfresco/alfresco-ng2-components/pull/6418)
* [Alfresco/alfresco-ng2-components#6723 - [AAE-4661] Fix not showing results when filtering by content model pr…](https://github.com/Alfresco/alfresco-ng2-components/pull/6723)
* [Alfresco/alfresco-ng2-components#6599 - [AAE-3992] Process Filter bug fixes and improvements](https://github.com/Alfresco/alfresco-ng2-components/pull/6599)
* [Alfresco/alfresco-ng2-components#6705 - Create Image from PR if request](https://github.com/Alfresco/alfresco-ng2-components/pull/6705)
* [Alfresco/alfresco-ng2-components#6724 - [AAE-4710] Error-proof scan-env](https://github.com/Alfresco/alfresco-ng2-components/pull/6724)
* [Alfresco/alfresco-ng2-components#6462 - cli init-aae - Remove useless properties](https://github.com/Alfresco/alfresco-ng2-components/pull/6462)
* [Alfresco/alfresco-ng2-components#6725 - Override the pr title in case already exists](https://github.com/Alfresco/alfresco-ng2-components/pull/6725)
* [Alfresco/alfresco-ng2-components#6730 - [ADF-5346] DocumentList - header is not scrollable when the width of the browser is small](https://github.com/Alfresco/alfresco-ng2-components/pull/6730)
* [Alfresco/alfresco-ng2-components#6732 - [ACA-4213] - Fix search datetime range in different timezones](https://github.com/Alfresco/alfresco-ng2-components/pull/6732)
* [Alfresco/alfresco-ng2-components#6713 - [REPO-5552] more filtering capabilities for aspect/type api ](https://github.com/Alfresco/alfresco-ng2-components/pull/6713)
* [Alfresco/alfresco-ng2-components#6727 - [ADF-5344] - fixed counter for custom aspects](https://github.com/Alfresco/alfresco-ng2-components/pull/6727)
* [Alfresco/alfresco-ng2-components#6726 - [ACA-4299] Add e2e tests for task counters and notifications](https://github.com/Alfresco/alfresco-ng2-components/pull/6726)
* [Alfresco/alfresco-ng2-components#6735 - Bump css-loader from 4.3.0 to 5.1.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6735)
* [Alfresco/alfresco-ng2-components#6740 - [ACA-4304] - Remove userinfo name on small screens (only profile icon…](https://github.com/Alfresco/alfresco-ng2-components/pull/6740)
* [Alfresco/alfresco-ng2-components#6741 - [ACA-4299] Fix C593066 e2e test - task counter](https://github.com/Alfresco/alfresco-ng2-components/pull/6741)
* [Alfresco/alfresco-ng2-components#6737 - [ADF-5347] Viewer - Closing  PDF before all pages are loaded causes errors](https://github.com/Alfresco/alfresco-ng2-components/pull/6737)
* [Alfresco/alfresco-ng2-components#6736 - Bump mini-css-extract-plugin from 0.11.2 to 1.3.9](https://github.com/Alfresco/alfresco-ng2-components/pull/6736)
* [Alfresco/alfresco-ng2-components#6734 - Bump cspell from 5.1.3 to 5.3.1](https://github.com/Alfresco/alfresco-ng2-components/pull/6734)
* [Alfresco/alfresco-ng2-components#6746 - [ADF-5345] - fixed border for aspect dialog](https://github.com/Alfresco/alfresco-ng2-components/pull/6746)
* [Alfresco/alfresco-ng2-components#6742 - [ATS-873] Fix Subtitles in audio files](https://github.com/Alfresco/alfresco-ng2-components/pull/6742)
* [Alfresco/alfresco-ng2-components#6731 - [AAE-3543] Attach button enabled only when all files uploaded](https://github.com/Alfresco/alfresco-ng2-components/pull/6731)
* [Alfresco/alfresco-ng2-components#6745 - [ADF-5349] WebSocket protocol based on BpmHost](https://github.com/Alfresco/alfresco-ng2-components/pull/6745)
* [Alfresco/alfresco-ng2-components#6748 - Bump snyk from 1.456.0 to 1.462.0](https://github.com/Alfresco/alfresco-ng2-components/pull/6748)
* [Alfresco/alfresco-ng2-components#6749 - Bump husky from 4.3.8 to 5.1.2](https://github.com/Alfresco/alfresco-ng2-components/pull/6749)
* [Alfresco/alfresco-ng2-components#6744 - [ADF-5348] - fix user info icons](https://github.com/Alfresco/alfresco-ng2-components/pull/6744)
* [Alfresco/alfresco-ng2-components#6752 - [ADF-5285] re-include test C299187](https://github.com/Alfresco/alfresco-ng2-components/pull/6752)
* [Alfresco/alfresco-ng2-components#6750 - Bump cspell from 5.3.1 to 5.3.3](https://github.com/Alfresco/alfresco-ng2-components/pull/6750)
* [Alfresco/alfresco-ng2-components#6753 - [AAE-4547] Add getInputValue() in TestElement class](https://github.com/Alfresco/alfresco-ng2-components/pull/6753)
* [Alfresco/alfresco-ng2-components#6747 - Update branch for JS-API PR#3256](https://github.com/Alfresco/alfresco-ng2-components/pull/6747)
* [Alfresco/alfresco-ng2-components#6763 - [ACA-4202] - refreshing the preview when version has changed](https://github.com/Alfresco/alfresco-ng2-components/pull/6763)
* [Alfresco/alfresco-ng2-components#6764 - Revert "[AAE-4637] Fix varying height of dialog when clicking on the Upload from your device tab"](https://github.com/Alfresco/alfresco-ng2-components/pull/6764)

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
