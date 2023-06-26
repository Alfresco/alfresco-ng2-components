---
Title: Release notes v6.2.0
---

# Alfresco Application Development Framework (ADF) version 6.2.0 Release Note

This document provides information on the Alfresco Application Development Framework **v6.2.0**.

You can find release artifacts on [GitHub](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/6.2.0).

## Contents

- [New Package Versions](#new-package-versions)
- [Features](#features)
- [Upgrade](#upgrade)
- [Changelog](#changelog)
- [See Also](#see-also)

## New Package Versions

| Name | Version   |
| --- |-----------|
| @alfresco/js-api | 6.2.0     |
| @alfresco/adf-content-services | 6.2.0 |
| @alfresco/adf-process-services | 6.2.0 |
| @alfresco/adf-core | 6.2.0 |
| @alfresco/adf-insights | 6.2.0 |
| @alfresco/adf-extensions | 6.2.0 |
| @alfresco/adf-testing | 6.2.0 |
| @alfresco/adf-cli | 6.2.0 |

## Features

The suggested stack is:

| Name | Version |
| --- | -- |
| Node | 18.x |
| npm | 8.x |
| Angular | 14.x |
| Typescript | 4.7 |

For a complete list of changes, supported browsers and new feature please refer to the official documentation

## Changelog

# Changelog

- [43feb814f](https://github.com/Alfresco/alfresco-ng2-components/commit/43feb814f) Fix ADF cronjob slackbot warning message (#8698)
- [74fd03b55](https://github.com/Alfresco/alfresco-ng2-components/commit/74fd03b55) [AAE-15436] Fix init-aae-env await for apps to be deployed (#8697)
- [0fc904eee](https://github.com/Alfresco/alfresco-ng2-components/commit/0fc904eee) Use latest js-api in each lib package json (#8690)
- [66f060a01](https://github.com/Alfresco/alfresco-ng2-components/commit/66f060a01) use latest JS-API library (#8684)
- [58ef531c6](https://github.com/Alfresco/alfresco-ng2-components/commit/58ef531c6) LOC-447 - Updated UI files in 16 languages for ADF 6.2 release based on EN file of 2023-06-20 (#8685)
- [6f5a419dd](https://github.com/Alfresco/alfresco-ng2-components/commit/6f5a419dd) [ACS-5166] use published version of material icons (#8681)
- [10a5f89b2](https://github.com/Alfresco/alfresco-ng2-components/commit/10a5f89b2) [ACS-5166] update MS icons (#8683)
- [9f7c6258a](https://github.com/Alfresco/alfresco-ng2-components/commit/9f7c6258a) [ADF-5550] Remove verions.json (#8676)
- [b987898eb](https://github.com/Alfresco/alfresco-ng2-components/commit/b987898eb) possible different e2e-host (#8680)
- [90aab8e5e](https://github.com/Alfresco/alfresco-ng2-components/commit/90aab8e5e) fix typo in cron yml
- [b84ea2262](https://github.com/Alfresco/alfresco-ng2-components/commit/b84ea2262) add E2E_IDENTITY_HOST_APA env var (#8677)
- [13f4f6260](https://github.com/Alfresco/alfresco-ng2-components/commit/13f4f6260) [ACS-5308] Highlight the selected filter in ADW (#8649)
- [ac694cd7a](https://github.com/Alfresco/alfresco-ng2-components/commit/ac694cd7a) Fixing the end slash for the url otherwise the call will fail (#8674)
- [f915370bc](https://github.com/Alfresco/alfresco-ng2-components/commit/f915370bc) [AAE-15251] Making header component more customizable (#8670)
- [eda42a69e](https://github.com/Alfresco/alfresco-ng2-components/commit/eda42a69e) [ACS-5341] accessibility fix (#8668)
- [c072fa795](https://github.com/Alfresco/alfresco-ng2-components/commit/c072fa795) [AAE-15240] Making package list component styles configurable (#8667)
- [5c9ff5b36](https://github.com/Alfresco/alfresco-ng2-components/commit/5c9ff5b36) [AAE-15239] Making about settings component styles configurable (#8666)
- [afbf87788](https://github.com/Alfresco/alfresco-ng2-components/commit/afbf87788) [ACS-5347] New styles for facets and filters states (#8661)
- [0a3cc5634](https://github.com/Alfresco/alfresco-ng2-components/commit/0a3cc5634) Fix js-api version in adf-cli (#8665)
- [61d5aa965](https://github.com/Alfresco/alfresco-ng2-components/commit/61d5aa965) [ACS-4986] Advanced Search - New component for Tags and Location filters (#8655)
- [5fafb0ea6](https://github.com/Alfresco/alfresco-ng2-components/commit/5fafb0ea6) [AAE-14070] Update permission for user to app (#8663)
- [479c96eab](https://github.com/Alfresco/alfresco-ng2-components/commit/479c96eab) [PRODSEC-6575] Shared link not accessible now after the expiry date which was earlier accessible even after that expiration date (#8540)
- [caaf04b5e](https://github.com/Alfresco/alfresco-ng2-components/commit/caaf04b5e) [AAE-15228] process filter component styles configurable (#8657)
- [64f9d0414](https://github.com/Alfresco/alfresco-ng2-components/commit/64f9d0414) [AAE-15236] Making about component panel styles configurable (#8660)
- [18c3eff47](https://github.com/Alfresco/alfresco-ng2-components/commit/18c3eff47) [AAE-14714] added design tokens to CardViewComponent (#8619)
- [9210d679a](https://github.com/Alfresco/alfresco-ng2-components/commit/9210d679a) fix update-version to use &#34;&gt;=&#34; by default (#8653)
- [fa063465d](https://github.com/Alfresco/alfresco-ng2-components/commit/fa063465d) [AAE-15223] Removing Material native classes modifications (#8656)
- [dd3285511](https://github.com/Alfresco/alfresco-ng2-components/commit/dd3285511) [ACS-5416] remove internal notification icon pipe (#8659)
- [b39ff6bab](https://github.com/Alfresco/alfresco-ng2-components/commit/b39ff6bab) [ACS-5197] Disable empty facets (#8650)
- [1870214ba](https://github.com/Alfresco/alfresco-ng2-components/commit/1870214ba) [AAE-15198] - Using reference vars to style form fields in base task (#8651)
- [ecf191f55](https://github.com/Alfresco/alfresco-ng2-components/commit/ecf191f55) [ADF-5546] Fix cron-run input (#8646)
- [a762c19a5](https://github.com/Alfresco/alfresco-ng2-components/commit/a762c19a5) LOC-440 - UI updated as per https://alfresco.atlassian.net/browse/AAE-14405  All strings updated as per source of 2023-06-09 (#8641)
- [c66fb5f6e](https://github.com/Alfresco/alfresco-ng2-components/commit/c66fb5f6e) [AAE-15149] Added reference variables to edit task filter component (#8636)
- [461890103](https://github.com/Alfresco/alfresco-ng2-components/commit/461890103) Update pull-request.yml (#8648)
- [e176009be](https://github.com/Alfresco/alfresco-ng2-components/commit/e176009be) Update pull-request.yml (#8639)
- [7865650d0](https://github.com/Alfresco/alfresco-ng2-components/commit/7865650d0) fix upgrade script (#8638)
- [63e87c4bf](https://github.com/Alfresco/alfresco-ng2-components/commit/63e87c4bf) ACS-5290 Fixed script (#8635)
- [a61226376](https://github.com/Alfresco/alfresco-ng2-components/commit/a61226376) [ADF-5546] Don&#39;t run forbidden labels job when cron runs e2es (#8632)
- [826cdf52b](https://github.com/Alfresco/alfresco-ng2-components/commit/826cdf52b) add slack message on cron fail (#8633)
- [2ea82946f](https://github.com/Alfresco/alfresco-ng2-components/commit/2ea82946f) ACS-5290 Remove comma (#8634)
- [7a33a4e19](https://github.com/Alfresco/alfresco-ng2-components/commit/7a33a4e19) [ACS-5290] Corrected path (#8631)
- [e073d8369](https://github.com/Alfresco/alfresco-ng2-components/commit/e073d8369) Update angular.json (#8630)
- [860adaaf4](https://github.com/Alfresco/alfresco-ng2-components/commit/860adaaf4) Update update-version.sh (#8629)
- [dce30c06e](https://github.com/Alfresco/alfresco-ng2-components/commit/dce30c06e) Update update-version.sh (#8628)
- [66b5ca90d](https://github.com/Alfresco/alfresco-ng2-components/commit/66b5ca90d) [ACS-5342] Accessibility fixes for filters and facets (#8626)
- [7eebdb8b1](https://github.com/Alfresco/alfresco-ng2-components/commit/7eebdb8b1) Update release.yml
- [06de32ed0](https://github.com/Alfresco/alfresco-ng2-components/commit/06de32ed0) Fix dry run flag (#8627)
- [dca9ea4cb](https://github.com/Alfresco/alfresco-ng2-components/commit/dca9ea4cb) [AAE-14699] Improved unit test description (#8625)
- [f549a19fb](https://github.com/Alfresco/alfresco-ng2-components/commit/f549a19fb) [AAE-14469] added constraint for typed value (#8611)
- [2c5a6e50e](https://github.com/Alfresco/alfresco-ng2-components/commit/2c5a6e50e) [AAE-15126] App.config.service should log an error when the app.config.json is invalid (#8624)
- [6ec394da5](https://github.com/Alfresco/alfresco-ng2-components/commit/6ec394da5) [AAE-14699] Improved card view text item component update (#8597)
- [f5abce8ba](https://github.com/Alfresco/alfresco-ng2-components/commit/f5abce8ba) Optimise imports using inject function (#8557)
- [85fd98874](https://github.com/Alfresco/alfresco-ng2-components/commit/85fd98874) [ACS-5181] Logical search components (#8616)
- [9845b1e2a](https://github.com/Alfresco/alfresco-ng2-components/commit/9845b1e2a) [AAE-14851] Convert manual tests to unit for C587091, C587092 (#8608)
- [21281cafe](https://github.com/Alfresco/alfresco-ng2-components/commit/21281cafe) [ACS-5290] Corrected version of adding custom eslint rule (#8620)
- [654acd553](https://github.com/Alfresco/alfresco-ng2-components/commit/654acd553) [ACS-5279] enhanced oath2 configuration handling (#8575)
- [ea5c3466e](https://github.com/Alfresco/alfresco-ng2-components/commit/ea5c3466e) [ACS-5305] fix name column link alignment (#8593)
- [86e9f3f22](https://github.com/Alfresco/alfresco-ng2-components/commit/86e9f3f22) [ACS-5290] create eslint rule to ensure components use none value for encapsulation (#8585)

## See Also

- [Issue Tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new)
- [Discussion forum](http://gitter.im/Alfresco/alfresco-ng2-components)
