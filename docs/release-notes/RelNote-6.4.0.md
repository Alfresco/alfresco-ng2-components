---
Title: Release notes v6.3.0
---

# Alfresco Application Development Framework (ADF) version 6.4.0 Release Note

This document provides information on the Alfresco Application Development Framework **v6.4.0**.

You can find release artifacts on [GitHub](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/6.4.0).

## Contents

- [New Package Versions](#new-package-versions)
- [Features](#features)
- [Changelog](#changelog)
- [See Also](#see-also)

## New Package Versions

| Name                           | Version |
|--------------------------------|---------|
| @alfresco/js-api               | 7.1.0   |
| @alfresco/adf-content-services | 6.4.0   |
| @alfresco/adf-process-services | 6.4.0   |
| @alfresco/adf-core             | 6.4.0   |
| @alfresco/adf-insights         | 6.4.0   |
| @alfresco/adf-extensions       | 6.4.0   |
| @alfresco/adf-testing          | 6.4.0   |
| @alfresco/adf-cli              | 6.4.0   |

## Features

The suggested stack is:

| Name       | Version |
|------------|---------|
| Node       | 18.x    |
| npm        | 8.x     |
| Angular    | 14.x    |
| Typescript | 4.7     |

For a complete list of changes, supported browsers and new feature please refer to the official documentation

## Deprecations

- `adfMomentDate` pipe is deprecated and no longer used by ADF components and apps
- `adfMomentDateTime` pipe is deprecated and no longer used by ADF components and apps
- custom `MomentDateAdapter` is deprecated and no longer used by ADF components and apps

## Changelog

- [620911cf7](git@github.com:Alfresco/alfresco-ng2-components/commit/620911cf7) Protractor cleanup for demo shell (#9019)
- [fa7eb8722](git@github.com:Alfresco/alfresco-ng2-components/commit/fa7eb8722) fix linting for ADF (#9036)
- [b84738324](git@github.com:Alfresco/alfresco-ng2-components/commit/b84738324) [ACS-6222] Fixed missing display name for groups (#9034)
- [2d3175ef4](git@github.com:Alfresco/alfresco-ng2-components/commit/2d3175ef4) [ACS-6227] cleanup error handling and fix typing issues (#9035)
- [53ad9f729](git@github.com:Alfresco/alfresco-ng2-components/commit/53ad9f729) AAE-15874 enable local development option for simpleapp (#9031)
- [ba96ed14b](git@github.com:Alfresco/alfresco-ng2-components/commit/ba96ed14b) [ACS-6196] await-thenable rule for ESLint, fix issues (#9027)
- [7ebdce787](git@github.com:Alfresco/alfresco-ng2-components/commit/7ebdce787) [APPS-2108] break direct dependency on moment.js (#9032)
- [abf369bc3](git@github.com:Alfresco/alfresco-ng2-components/commit/abf369bc3) [ACS-6189] Moved date adapter from module to component (#9029)
- [67f1a4c50](git@github.com:Alfresco/alfresco-ng2-components/commit/67f1a4c50) [ACS-6189] broken decision table dates after deprecation of moment date adapter 3 (#9026)
- [e6bc457d2](git@github.com:Alfresco/alfresco-ng2-components/commit/e6bc457d2) [ACS-5831] Adding generic error to Library Modal. (#9025)
- [8bd24dbb7](git@github.com:Alfresco/alfresco-ng2-components/commit/8bd24dbb7) [ACS-6190] prefer-promise-reject-errors rule and fixes (#9021)
- [a73e72fac](git@github.com:Alfresco/alfresco-ng2-components/commit/a73e72fac) [ACS-6189] Corrected date format (#9016)
- [f366cf7c0](git@github.com:Alfresco/alfresco-ng2-components/commit/f366cf7c0) [ACS-5645] metadata fixes for encapsulation and host classes (#9018)
- [879c5a6d2](git@github.com:Alfresco/alfresco-ng2-components/commit/879c5a6d2) [ACS-5645] card view dateitem parse fix (#9017)
- [36c6e6d8e](git@github.com:Alfresco/alfresco-ng2-components/commit/36c6e6d8e) [ACS-5566] - Add configurable columns to document list (#8968)
- [3912a652d](git@github.com:Alfresco/alfresco-ng2-components/commit/3912a652d) [AAE-16369] use layout-bp mixin where applicable (#8945)
- [f6f74f466](git@github.com:Alfresco/alfresco-ng2-components/commit/f6f74f466) [AAE-16982] Add default ui with custom theme to simpleapp (#9014)
- [33f114767](git@github.com:Alfresco/alfresco-ng2-components/commit/33f114767) [AAE-16962] Handle number data table column type (#9013)
- [7c4304a1e](git@github.com:Alfresco/alfresco-ng2-components/commit/7c4304a1e) Fix AAE-16968 BC (#9010)
- [6644f539f](git@github.com:Alfresco/alfresco-ng2-components/commit/6644f539f) [AAE-16964] Handle amount data table cloumn type (#8984)
- [962a2be69](git@github.com:Alfresco/alfresco-ng2-components/commit/962a2be69) [ACS-6126] Fixed accessibility issues (#9007)
- [d13db2560](git@github.com:Alfresco/alfresco-ng2-components/commit/d13db2560) [ACS-6136] cleanup e2e files (protractor) (#9009)
- [b49c86fda](git@github.com:Alfresco/alfresco-ng2-components/commit/b49c86fda) [AAE-16968] Add boolean type (#8972)
- [cda12730f](git@github.com:Alfresco/alfresco-ng2-components/commit/cda12730f) [APPS-2255] documentation on date adapters (#9008)
- [d500bc67d](git@github.com:Alfresco/alfresco-ng2-components/commit/d500bc67d) [ACS-5831] Added Generic Error to Library Dialog. (#9005)
- [678df4298](git@github.com:Alfresco/alfresco-ng2-components/commit/678df4298) [APPS-2108] migrate cardview and task filters to date-fns (#9006)
- [7d5fbecf3](git@github.com:Alfresco/alfresco-ng2-components/commit/7d5fbecf3) [APPS-2136] migrate search-datetime-range to date-fns (#9004)
- [e6d625253](git@github.com:Alfresco/alfresco-ng2-components/commit/e6d625253) [APPS-2132] migrate components to date-fns (#9001)
- [f7b054417](git@github.com:Alfresco/alfresco-ng2-components/commit/f7b054417) [ACS-6019] Added node-fetch to adf-cli package.json (#9003)
- [ef285a1f1](git@github.com:Alfresco/alfresco-ng2-components/commit/ef285a1f1) [ACS-6019] [ACS-6021] [ACS-6023] Replaced request with node-fetch (#8999)
- [82fafff11](git@github.com:Alfresco/alfresco-ng2-components/commit/82fafff11) Remove demo shell protractor TreeView e2e (#9000)
- [462166293](git@github.com:Alfresco/alfresco-ng2-components/commit/462166293) Remove useless protractor tests (#8998)
- [2f36da576](git@github.com:Alfresco/alfresco-ng2-components/commit/2f36da576) [APPS-2108] date-fns adapter for datetime pickers, many datetime parsing and validation fixes (#8992)
- [c637f3eb2](git@github.com:Alfresco/alfresco-ng2-components/commit/c637f3eb2) [ACS-5611] Add the option to initially expand custom panel (#8986)
- [96d0a617a](git@github.com:Alfresco/alfresco-ng2-components/commit/96d0a617a) [APPS-2108] migrate unit tests to date-fns (#8991)
- [03a52dc10](git@github.com:Alfresco/alfresco-ng2-components/commit/03a52dc10) [APPS-2108] migrate form field validators to date-fns (#8988)
- [2f28ec9b6](git@github.com:Alfresco/alfresco-ng2-components/commit/2f28ec9b6) [ACS-5877] Migrate widget-visibility service do date-fns (#8870)
- [a86b9e625](git@github.com:Alfresco/alfresco-ng2-components/commit/a86b9e625) [APPS-2108] migrate analytics report to date-fns (#8985)
- [f6d48cb85](git@github.com:Alfresco/alfresco-ng2-components/commit/f6d48cb85) [ACS-5348] Fixed accessibility issues for the Date facet (#8982)
- [ce549249e](git@github.com:Alfresco/alfresco-ng2-components/commit/ce549249e) [APPS-2108] ADF date-fns adapter implementation (#8983)
- [4cc4498b0](git@github.com:Alfresco/alfresco-ng2-components/commit/4cc4498b0) [ACS-5611] Add custom metadata side panels to metadata card component (#8974)
- [3a374ad2a](git@github.com:Alfresco/alfresco-ng2-components/commit/3a374ad2a) [APPS-2108] migrate date widget to Angular date picker (#8975)
- [e42e0869b](git@github.com:Alfresco/alfresco-ng2-components/commit/e42e0869b) [APPS-2108] Switch search date range to the material date adapter (#8973)
- [93f45062f](git@github.com:Alfresco/alfresco-ng2-components/commit/93f45062f) migrate node lock dialog to date-fns (#8970)
- [ea6575666](git@github.com:Alfresco/alfresco-ng2-components/commit/ea6575666) [APPS-2157][APPS-2158][APPS-2161][APPS-2162][APPS-2165] Migration from  moment to date-fns (#8965)
- [ecbee581a](git@github.com:Alfresco/alfresco-ng2-components/commit/ecbee581a) [APPS-2133] migration of dependency from moment to date-fns in start-task.component (#8844)
- [93fe29503](git@github.com:Alfresco/alfresco-ng2-components/commit/93fe29503) [ACS-6002] Add permissions displaying Site Permissions outside of Sites (#8952)
- [11b4f5186](git@github.com:Alfresco/alfresco-ng2-components/commit/11b4f5186) [AAE-16969] Remove force casting of all types to text (#8963)
- [43242b118](git@github.com:Alfresco/alfresco-ng2-components/commit/43242b118) pre angular 15 cleanup (#8961)
- [e638b54fc](git@github.com:Alfresco/alfresco-ng2-components/commit/e638b54fc) [MNT-23648] Clicking on Load More button no longer causes scroll position to reset to top (#8951)
- [034e9574d](git@github.com:Alfresco/alfresco-ng2-components/commit/034e9574d) [AAE-16884] revert request removal (#8959)
- [94baaf7d3](git@github.com:Alfresco/alfresco-ng2-components/commit/94baaf7d3) [AAE-16884] init aae script fixes (#8957)
- [e21ad3ca0](git@github.com:Alfresco/alfresco-ng2-components/commit/e21ad3ca0) [AAE-15316] - Refactored UserInfoComponent to get typography from theme (#8937)
- [21a029163](git@github.com:Alfresco/alfresco-ng2-components/commit/21a029163) [ACS-5878] implemented migration using the convertor approach (#8953)
- [d72eb5ebd](git@github.com:Alfresco/alfresco-ng2-components/commit/d72eb5ebd) [ACS-6071] fix jsdoc warnings and errors (#8948)
- [501516c8f](git@github.com:Alfresco/alfresco-ng2-components/commit/501516c8f) [ACS-6003] - waitRendition in rendition.service.ts not working (#8936)
- [d78dcd215](git@github.com:Alfresco/alfresco-ng2-components/commit/d78dcd215) [ACS-6071] fix docs for process cloud (#8947)
- [a48438e1c](git@github.com:Alfresco/alfresco-ng2-components/commit/a48438e1c) [ACS-5613] Renamed name to task name (#8946)
- [b03011c3d](git@github.com:Alfresco/alfresco-ng2-components/commit/b03011c3d) [ACS-6071] documentation fixes for process lib (#8943)
- [016e5ec08](git@github.com:Alfresco/alfresco-ng2-components/commit/016e5ec08) Revert &#34;[AAE-16369] use layout-bp mixin where applicable&#34; (#8944)
- [65d70bffb](git@github.com:Alfresco/alfresco-ng2-components/commit/65d70bffb) [ACS-6071] fix JSDoc issues for Core lib (#8942)
- [d7e0bb6cd](git@github.com:Alfresco/alfresco-ng2-components/commit/d7e0bb6cd) [AAE-16369] use layout-bp mixin where applicable (#8896)
- [a0c79e6c6](git@github.com:Alfresco/alfresco-ng2-components/commit/a0c79e6c6) [ACS-5601] Add getProcessesAndTasksOnContent to process content service (#8940)
- [094acf77c](git@github.com:Alfresco/alfresco-ng2-components/commit/094acf77c) [ACS-5613] process preview on popup displaying the details of selected running process on the popup (#8933)
- [44694c0ee](git@github.com:Alfresco/alfresco-ng2-components/commit/44694c0ee) [ACS-5748] The file gets unshared when setting the past expiration date (#8876)
- [4786a2632](git@github.com:Alfresco/alfresco-ng2-components/commit/4786a2632) Revert &#34;[APPS-2157] [APPS-2158] [APPS-2161] [APPS-2162] [APPS-2165] migration of e2e test cases from moment to date-fns (#8864)&#34; (#8938)
- [8f684a9f6](git@github.com:Alfresco/alfresco-ng2-components/commit/8f684a9f6) [ACS-5987] improved security for shell scripts (#8889)
- [83b2d9f8b](git@github.com:Alfresco/alfresco-ng2-components/commit/83b2d9f8b) [APPS-2202] Added custom utils for syncing moment and date-fns formats (#8934)
- [0933e2dad](git@github.com:Alfresco/alfresco-ng2-components/commit/0933e2dad) [APPS-2159] [APPS-2163] Replaced from moment.js to date-fns (#8878)
- [926347b8f](git@github.com:Alfresco/alfresco-ng2-components/commit/926347b8f) [ACS-5878] Migrated moment occurrences to date-fns equivalent in ProcessService (#8879)
- [3638ed06e](git@github.com:Alfresco/alfresco-ng2-components/commit/3638ed06e) [APPS-2157] [APPS-2158] [APPS-2161] [APPS-2162] [APPS-2165] migration of e2e test cases from moment to date-fns (#8864)
- [f48852075](git@github.com:Alfresco/alfresco-ng2-components/commit/f48852075) [APPS-2164] migration of dependency from moment to date-fns in task-list-properties.e2e.ts (#8873)
- [ef551a9c7](git@github.com:Alfresco/alfresco-ng2-components/commit/ef551a9c7) Improved ESLint configuration, integrated spellcheck and error fixes (#8931)
- [8370a3de6](git@github.com:Alfresco/alfresco-ng2-components/commit/8370a3de6) [MNT-23560] TIFF PDF Renderer Error (#8921)
- [534583874](git@github.com:Alfresco/alfresco-ng2-components/commit/534583874) [AAE-16353] - Refactoring error component to get typography from theme (#8932)
- [16ab6e330](git@github.com:Alfresco/alfresco-ng2-components/commit/16ab6e330) [ACS-5271] - replace deprecated &#39;request&#39; library (#8916)

## See Also

- [Issue Tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new)
- [Discussion forum](http://gitter.im/Alfresco/alfresco-ng2-components)
