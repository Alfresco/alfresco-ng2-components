---
Title: Release notes v5.0.0
---

# Alfresco Application Development Framework (ADF) version 5.0.0 Release Note

This document provides information on the Alfresco Application Development Framework **v5.0.0**.

You can find release artifacts on [GitHub](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/5.0.0).

## Contents

- [New Package Versions](#new-package-versions)
- [Features](#features)
- [Upgrade](#upgrade)
- [Changelog](#changelog)
- [See Also](#see-also)

## New Package Versions

| Name | Version |
| --- | --- |
| @alfresco/adf-content-services | 5.0.0 |
| @alfresco/adf-process-services | 5.0.0 |
| @alfresco/adf-core | 5.0.0 |
| @alfresco/adf-insights | 5.0.0 |
| @alfresco/adf-extensions | 5.0.0 |
| @alfresco/adf-testing | 5.0.0 |
| @alfresco/adf-cli | 5.0.0 |

## Features

This is a major release of the Alfresco Application Development Framework containing upgrade to Angular 14.
With the current upgrade of the Angular framework, the suggested stack has also being updated:

| Name | Version | 
| --- | --- | 
| Node | 14.15.0 |
| npm | 6.14.8 |
| Angular | 14 |
| Typescript | 4.6 |

For a complete list of changes, supported browsers and new feature please refer to the official documentation

| Angular version | link |
| --- | --- |
| v11 | [Changes & Deprecations](https://v11.angular.io/guide/updating-to-version-11)|
| v12 | [Changes & Deprecations](https://v12.angular.io/guide/updating-to-version-12)|
| v13 |  [Changes & Deprecations](https://v13.angular.io/guide/update-to-latest-version)|
| v14 | [Changes & Deprecations](https://angular.io/guide/update-to-latest-version) |

## Upgrade

To migrate custom code and application to Angular 14, please refer to the [offcial documentation](https://angular.io/).

**Note:**: Consider the possibility of leveraging [ADF v5.0.0-angular.13.2](https://www.npmjs.com/package/@alfresco/adf-core/v/5.0.0-angular.13.2), a version of ADF compatible with Angular 13 that is meant to be used as intermediate step towards ADF v5. with angular v14. 

A breaking change worth mentioning is related to style import. with ADF v5.0.0 an extra ```\lib``` is required.


**example**:

   previous versions of ADF :  ```@import '~@alfresco/adf-core/prebuilt-themes/adf-blue-orange.css';```
    
   starting ADF 5.0.0 : ```@import '~@alfresco/adf-core/lib/prebuilt-themes/adf-blue-orange.css';```

## Changelog

- [2fd10b2fe](https://github.com/Alfresco/alfresco-ng2-components/commit/2fd10b2fe) [ADF-5500] Set mat-checkbox display to block in order to takes up the whole width and shows checkboxes one below the other (#7815)
- [47e62c113](https://github.com/Alfresco/alfresco-ng2-components/commit/47e62c113) [ACA-4609] Fix regression checkbox list shown horizontally (#7813)
- [8e9cb07cd](https://github.com/Alfresco/alfresco-ng2-components/commit/8e9cb07cd) rename the schame appconfig (#7805)
- [76bbe582f](https://github.com/Alfresco/alfresco-ng2-components/commit/76bbe582f) [AAE-10377] Changed from namespace to default import (#7803)
- [9352daf79](https://github.com/Alfresco/alfresco-ng2-components/commit/9352daf79) [AAE-10472] upgrade apollo libraries to Angular 14 compatible versions (#7799)
- [b2ac4b416](https://github.com/Alfresco/alfresco-ng2-components/commit/b2ac4b416) Not anymore used (#7802)
- [109e99786](https://github.com/Alfresco/alfresco-ng2-components/commit/109e99786) Short circuit e2e in case lib not affected (#7801)
- [b90b12952](https://github.com/Alfresco/alfresco-ng2-components/commit/b90b12952) Fix assignment type translations (#7793)
- [9547e78f0](https://github.com/Alfresco/alfresco-ng2-components/commit/9547e78f0) Update datatable.component.md (#7796)
- [147fb5672](https://github.com/Alfresco/alfresco-ng2-components/commit/147fb5672) [AAE-9464] - Fetch image from ACS only in case of ECM (#7779)
- [6f209726e](https://github.com/Alfresco/alfresco-ng2-components/commit/6f209726e) [AAE-10472] Upgrade and deprecate libs (#7788)
- [4a39161ad](https://github.com/Alfresco/alfresco-ng2-components/commit/4a39161ad) Run everyting in case of CRON
- [38e9cc9f4](https://github.com/Alfresco/alfresco-ng2-components/commit/38e9cc9f4) Run e2e only when lib affected (#7791)
- [c7d769510](https://github.com/Alfresco/alfresco-ng2-components/commit/c7d769510) [AAE-9186] Filter tasks by assignee (#7784)
- [2ef40b150](https://github.com/Alfresco/alfresco-ng2-components/commit/2ef40b150) [AAE-10219] Add css to align according to alignment property in RadioField (#7750)
- [76c98c53e](https://github.com/Alfresco/alfresco-ng2-components/commit/76c98c53e) [AAE-10460] fix storybook config (#7785)
- [1fa81962a](https://github.com/Alfresco/alfresco-ng2-components/commit/1fa81962a) 👽 Angular 14 rebase 👽 (#7769)
- [53bc5aab2](https://github.com/Alfresco/alfresco-ng2-components/commit/53bc5aab2) change wrong licence header dates (#7781)
- [0d3db534f](https://github.com/Alfresco/alfresco-ng2-components/commit/0d3db534f) Fix incorrect import in card view array (#7774)
- [2a522579c](https://github.com/Alfresco/alfresco-ng2-components/commit/2a522579c) [AAE-10214] Storybook ErrorContent Component (#7761)
- [972aa256e](https://github.com/Alfresco/alfresco-ng2-components/commit/972aa256e) [AAE-10220] Storybook stories for Info Drawer component (#7757)
- [d3129e2ad](https://github.com/Alfresco/alfresco-ng2-components/commit/d3129e2ad) [AAE-10202] Storybook EmptyContent component (#7745)
- [104a93602](https://github.com/Alfresco/alfresco-ng2-components/commit/104a93602) [AAE-10347] Remove playwright travis job duplication (#7772)
- [07762308f](https://github.com/Alfresco/alfresco-ng2-components/commit/07762308f) ACA-4600 Added edit profile link (#7739)
- [11e793257](https://github.com/Alfresco/alfresco-ng2-components/commit/11e793257) [AAE-10261] SmartRunner fix (#7760)
- [d2a246ac2](https://github.com/Alfresco/alfresco-ng2-components/commit/d2a246ac2) [AAE-10292] Fix opening two dialogs for card view array items (#7770)
- [be0545801](https://github.com/Alfresco/alfresco-ng2-components/commit/be0545801) [AAE-10105] Update Storybook to 6.5.10v (#7765)
- [26c46cfb9](https://github.com/Alfresco/alfresco-ng2-components/commit/26c46cfb9) [AAE-10089] Process variables values are not shown for old tasks and … (#7744)

## See Also

- [Issue Tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new)
- [Discussion forum](http://gitter.im/Alfresco/alfresco-ng2-components)
