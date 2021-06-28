---
Title: Release notes v4.5.0
---

# Alfresco Application Development Framework (ADF) version 4.5.0 Release Note

These release notes provide information about the **4.5.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/4.5.0).

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Custom type and aspect management](#custom-type-and-aspect-management)
-   [Localisation](#localisation)
-   [References](#references)
-   [Notable new features](#notable-new-features)
-   [PR merged](#pr-merged)

## New package versions

    "@alfresco/adf-content-services" : "4.5.0"
    "@alfresco/adf-process-services" : "4.5.0"
    "@alfresco/adf-core" : "4.5.0"
    "@alfresco/adf-insights" : "4.5.0",
    "@alfresco/adf-extensions": "4.5.0"
    "@alfresco/adf-testing": "4.5.0"
    "@alfresco/adf-cli": "4.5.0"

## Goals for this release

This is a minor release of the Alfresco Application Development Framework, developed to receive the latest and greatest benefits of the bugfixes, and the enhancements planned since the release of the previous version.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

## Notable new features

In this release we have focused on enhancing the search components and bug fixing 
We continue to keep a balance between improving existing components, adding new ones, and also improving the underlying architecture to prepare for future update to Angular 12.

### Multiple search configuration

Thanks this new component is now possible have multiple facet search configurations:

![mulitpl-search](https://user-images.githubusercontent.com/14145706/121013429-71abec80-c7b6-11eb-997f-88fbc0b06266.gif)

### Facet Search chips layout

Our designers have identified a new improved style for the facet filters, and we have implemented it in the new chips layout component.
This style will be the new facet filter for ACA but if you like you can still use the old style using the previous component.

![image](https://user-images.githubusercontent.com/14145706/123372101-9bc82180-d5a0-11eb-8e36-c9487fc353e1.png)


## PR merged

- [82a57c9c0](https://github.com/Alfresco/alfresco-ng2-components/commit/82a57c9c0) [ACA-4436] - added option for select item to display None (#7113)
  
- [26d180e66](https://github.com/Alfresco/alfresco-ng2-components/commit/26d180e66) [ACA-4486] support search widget chips layout (#7122)
  
- [462f40827](https://github.com/Alfresco/alfresco-ng2-components/commit/462f40827) Revert &quot;[AAE-5392] - Add find people api call (#7119)&quot; (#7121)
  
- [1e251ab8a](https://github.com/Alfresco/alfresco-ng2-components/commit/1e251ab8a) [AAE-5392] - Add find people api call (#7119)
  
- [829805e20](https://github.com/Alfresco/alfresco-ng2-components/commit/829805e20) [ADF-5432] component template and code fixes after testing Angular strict mode (#7118)
  
- [e2b8557f4](https://github.com/Alfresco/alfresco-ng2-components/commit/e2b8557f4) [AAE-5362] Add option to make actions button visible only on hover (#7117)
  
- [b5e4316c0](https://github.com/Alfresco/alfresco-ng2-components/commit/b5e4316c0) Expose shared library as subdirectory (#7114)
  
- [1ecc14f18](https://github.com/Alfresco/alfresco-ng2-components/commit/1ecc14f18) Refactor e2e&#x27;s ApiService (#7101)
  
- [2d61a2941](https://github.com/Alfresco/alfresco-ng2-components/commit/2d61a2941) Update extensibility.md
  
- [3079aa48c](https://github.com/Alfresco/alfresco-ng2-components/commit/3079aa48c) [ADF-5422] remove deprecated &quot;async()&quot; from unit tests (#7109)
  
- [ba03c60ad](https://github.com/Alfresco/alfresco-ng2-components/commit/ba03c60ad) [ADF-5417] Support multiple search configuration in app config json (#7096)
  
- [ad987a8d3](https://github.com/Alfresco/alfresco-ng2-components/commit/ad987a8d3) [ACA-3611] Create test folder for E2E precondition files (#7088)
  
- [eb71a79d1](https://github.com/Alfresco/alfresco-ng2-components/commit/eb71a79d1) prepare tests for ng-12 upgrade (#7099)
  
- [558056b05](https://github.com/Alfresco/alfresco-ng2-components/commit/558056b05) test if we can remove compatibility (#7064)
  
- [4dc98eb28](https://github.com/Alfresco/alfresco-ng2-components/commit/4dc98eb28) [ADF-5421]Include C307988 test back
  
- [60ff0fc38](https://github.com/Alfresco/alfresco-ng2-components/commit/60ff0fc38) [AAE-2617] To get access to datatable component from process-list (#7068)
  
- [6400fd6ba](https://github.com/Alfresco/alfresco-ng2-components/commit/6400fd6ba) [ACA-4474]Add isStartProcessButtonEnabled method
  
- [9a2a62255](https://github.com/Alfresco/alfresco-ng2-components/commit/9a2a62255) [ADF-5369] HTTP 500 response in adf-upload-button is emitted as a success event (#7087)
  
- [acf4b26d7](https://github.com/Alfresco/alfresco-ng2-components/commit/acf4b26d7) [ACA-4474]Add checkWidgetsAreVisible method
  
- [91d813e6f](https://github.com/Alfresco/alfresco-ng2-components/commit/91d813e6f) [ACA-4464] Add user/groups - should not be able to select the same user multiple times (#7066)
  
- [40bbeb13f](https://github.com/Alfresco/alfresco-ng2-components/commit/40bbeb13f) [AAE-5208] Add pagination info to listPeople function in PeopleContentService (#7055)
  
- [2637654db](https://github.com/Alfresco/alfresco-ng2-components/commit/2637654db) [AAE-5280] Better error handling for user task (#7070)
  
- [2a9b40649](https://github.com/Alfresco/alfresco-ng2-components/commit/2a9b40649) [AAE-4974] FE - Remove scroll bar from empty &quot;Upload from your device&quot; list (#7049)
  
- [1a0f2f5bc](https://github.com/Alfresco/alfresco-ng2-components/commit/1a0f2f5bc) [ADF-5148] ContentService.hasPermissions() should check inhertied permission (#7059)
  
- [e94b2f99b](https://github.com/Alfresco/alfresco-ng2-components/commit/e94b2f99b) [ADF-5406] SCSS and HTML template path fixes (#7063)
  
- [9e0000a30](https://github.com/Alfresco/alfresco-ng2-components/commit/9e0000a30) disable w3c due getValue problem (#7067)
  
- [200cfb8db](https://github.com/Alfresco/alfresco-ng2-components/commit/200cfb8db) fixed overflow issues (#7060)
  
- [0fcb15c9c](https://github.com/Alfresco/alfresco-ng2-components/commit/0fcb15c9c) Remove e2e already covered by unit test (#7058)
  
- [12c3fec51](https://github.com/Alfresco/alfresco-ng2-components/commit/12c3fec51) e2e: Improve cloud custom filters
  
- [bbbdcbdaa](https://github.com/Alfresco/alfresco-ng2-components/commit/bbbdcbdaa) [AAE-5145] Add enum for content node selector actions (#7039)
  
- [4b3a7f41f](https://github.com/Alfresco/alfresco-ng2-components/commit/4b3a7f41f) [ADF-5231] The protected flag for properties should not be editable (#7056)
  
- [65cbd570f](https://github.com/Alfresco/alfresco-ng2-components/commit/65cbd570f) [MNT-22418] - disabling action for physical records (#7057)
  
- [4c1e46236](https://github.com/Alfresco/alfresco-ng2-components/commit/4c1e46236) [ACA-4454] The create library button should get disabled after being clicked once (#7046)
  
- [a5c858618](https://github.com/Alfresco/alfresco-ng2-components/commit/a5c858618) [DW-1608] Added username tag in the ID of the dropdown in deploy application admin access (#7045)
  
- [bd96dfddd](https://github.com/Alfresco/alfresco-ng2-components/commit/bd96dfddd) [ADF-5387] - Fix dropdown tests, remove call to external API (#7044)
  
- [272e2d67e](https://github.com/Alfresco/alfresco-ng2-components/commit/272e2d67e) outline current page thumbnail (#7042)
  
- [5478c8868](https://github.com/Alfresco/alfresco-ng2-components/commit/5478c8868) Update activiti-alfresco.service.ts (#7041)
  
- [ac6f61624](https://github.com/Alfresco/alfresco-ng2-components/commit/ac6f61624) Fix some build scripts (#7048)
  
- [a5e85b44f](https://github.com/Alfresco/alfresco-ng2-components/commit/a5e85b44f) [ACA-4458]Add expand cloud custom filter method

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

If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
