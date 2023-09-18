---
Title: Release notes v6.3.0
---

# Alfresco Application Development Framework (ADF) version 6.3.0 Release Note

This document provides information on the Alfresco Application Development Framework **v6.3.0**.

You can find release artifacts on [GitHub](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/6.2.0).

## Contents

- [New Package Versions](#new-package-versions)
- [Features](#features)
- [Changelog](#changelog)
- [See Also](#see-also)

## New Package Versions

| Name                           | Version |
|--------------------------------|---------|
| @alfresco/js-api               | 7.0.0   |
| @alfresco/adf-content-services | 6.3.0   |
| @alfresco/adf-process-services | 6.3.0   |
| @alfresco/adf-core             | 6.3.0   |
| @alfresco/adf-insights         | 6.3.0   |
| @alfresco/adf-extensions       | 6.3.0   |
| @alfresco/adf-testing          | 6.3.0   |
| @alfresco/adf-cli              | 6.3.0   |

## Features

The suggested stack is:

| Name       | Version |
|------------|---------|
| Node       | 18.x    |
| npm        | 8.x     |
| Angular    | 14.x    |
| Typescript | 4.7     |

For a complete list of changes, supported browsers and new feature please refer to the official documentation

## Changelog

- [a1dd270c5](https://github.com/Alfresco/alfresco-ng2-components/commit/a1dd270c5) [ACS-5991] ESLint fixes and code quality improvements (#8893)
- [f20df680a](https://github.com/Alfresco/alfresco-ng2-components/commit/f20df680a) [AAE-16491] Fix session invalidation for Http 401 response (#8909)
- [d7cf12d89](https://github.com/Alfresco/alfresco-ng2-components/commit/d7cf12d89) use an icon for &#34;mark all&#34; notifications (#8903)
- [e14e489d2](https://github.com/Alfresco/alfresco-ng2-components/commit/e14e489d2) [ACA-4313] - Sort order doesn&#39;t work correctly (#8892)
- [13b6bf37f](https://github.com/Alfresco/alfresco-ng2-components/commit/13b6bf37f) [AAE-16202] Fix long label overlap on radio button (#8906)
- [8080a0699](https://github.com/Alfresco/alfresco-ng2-components/commit/8080a0699) [ACS-6004] Exclude paths from CodeQL analysis  (#8905)
- [0d5e70ebf](https://github.com/Alfresco/alfresco-ng2-components/commit/0d5e70ebf)  [ACS-5742] Fix Search e2e&#39;s (#8902)
- [a1b39fb6d](https://github.com/Alfresco/alfresco-ng2-components/commit/a1b39fb6d) [AAE-16219] Theming for HxP is not working (#8894)
- [ce881b7dc](https://github.com/Alfresco/alfresco-ng2-components/commit/ce881b7dc) [AAE-16303] Handle nested property data source in data table (#8895)
- [a8db04409](https://github.com/Alfresco/alfresco-ng2-components/commit/a8db04409) [AAE-14704] Fix viewers showing removed file (#8890)
- [76e2870c6](https://github.com/Alfresco/alfresco-ng2-components/commit/76e2870c6) Adjust ADF to latest JS-API version (#8882)
- [876ca7a0a](https://github.com/Alfresco/alfresco-ng2-components/commit/876ca7a0a) [AAE-15813] Fix - deployed application named &#39;idp&#39; doesn&#39;t work (#8887)
- [8a9f82889](https://github.com/Alfresco/alfresco-ng2-components/commit/8a9f82889) [AAE-16202] Fix long label overlap on radio button (#8886)
- [70a7e5f4e](https://github.com/Alfresco/alfresco-ng2-components/commit/70a7e5f4e) [APPS-2160] migration of dependency from moment to date-fns in custom-tasks-filters.e2e.ts (#8871)
- [bd518b6c5](https://github.com/Alfresco/alfresco-ng2-components/commit/bd518b6c5) [ACS-5929] Open datatable actions menu on enter (#8868)
- [60099a2d7](https://github.com/Alfresco/alfresco-ng2-components/commit/60099a2d7) [AAE-15828] add mobile query to visualize form under one column for small viewport (#8883)
- [b4ffc866d](https://github.com/Alfresco/alfresco-ng2-components/commit/b4ffc866d) [ACS-5654] Retain filter header in document list. (#8811)
- [9ce8b0191](https://github.com/Alfresco/alfresco-ng2-components/commit/9ce8b0191) Update release.yml (#8874)
- [95537c4c5](https://github.com/Alfresco/alfresco-ng2-components/commit/95537c4c5) [AAE-16236] Fix missing service export (#8872)
- [c6fdbd601](https://github.com/Alfresco/alfresco-ng2-components/commit/c6fdbd601) [ACS-5876] Change from moment to date-fns for lock.service. (#8862)
- [c83d92c53](https://github.com/Alfresco/alfresco-ng2-components/commit/c83d92c53) [ACS-5839] migrate from QueryBody to SearchResult type (#8861)
- [c73e95c9b](https://github.com/Alfresco/alfresco-ng2-components/commit/c73e95c9b) change script to fix the alpha version overlap (#8869)
- [1c30eb281](https://github.com/Alfresco/alfresco-ng2-components/commit/1c30eb281) remove unused action in release (#8867)
- [780800453](https://github.com/Alfresco/alfresco-ng2-components/commit/780800453) [ACS-5858] Migrated adfMomentDateTime Pipe to date-fns equivalent (#8856)
- [bb3000346](https://github.com/Alfresco/alfresco-ng2-components/commit/bb3000346) release branch workflow (#8865)
- [3b4ce3b85](https://github.com/Alfresco/alfresco-ng2-components/commit/3b4ce3b85) [ACS-5839] migrate to latest JS-API types (#8859)
- [a5b05b3e5](https://github.com/Alfresco/alfresco-ng2-components/commit/a5b05b3e5) [AAE-15814] Handle direct input mapping with JSON response for data table widget (#8860)
- [657711e80](https://github.com/Alfresco/alfresco-ng2-components/commit/657711e80) [APPS-2128] remove moment dependency from task-list.component.ts (#8838)
- [a66b3d084](https://github.com/Alfresco/alfresco-ng2-components/commit/a66b3d084) Revert &#34;add branch release&#34;
- [79df22043](https://github.com/Alfresco/alfresco-ng2-components/commit/79df22043) add branch release
- [af3c7eb78](https://github.com/Alfresco/alfresco-ng2-components/commit/af3c7eb78) [ACS-5505] - Custom aspect properties are not updated when removing last existing property (#8828)
- [885c5a52f](https://github.com/Alfresco/alfresco-ng2-components/commit/885c5a52f) ACS-5520 add eslint-angular README, rephrase rule documentation (#8850)
- [d839531d0](https://github.com/Alfresco/alfresco-ng2-components/commit/d839531d0) [APPS-2134] Remove moment.js dependency from start-task-cloud.compone… (#8845)
- [377dd5d3a](https://github.com/Alfresco/alfresco-ng2-components/commit/377dd5d3a) [AAE-15764] Add rollback property to the model (#8848)
- [efa691b24](https://github.com/Alfresco/alfresco-ng2-components/commit/efa691b24) [ACS-5281] Allow to change editable of content metadata from parent (#8841)
- [b77691bb0](https://github.com/Alfresco/alfresco-ng2-components/commit/b77691bb0) [ACS-5861] Replace moment to date-fns in process-name.pipe.ts (#8831)
- [837b3b1b9](https://github.com/Alfresco/alfresco-ng2-components/commit/837b3b1b9) [ACS-5640] Changing from moment to date-fns. (#8796)
- [87e57272f](https://github.com/Alfresco/alfresco-ng2-components/commit/87e57272f) [ACS-5898] prevent custom task filters from always sending due after date (#8847)
- [de1607217](https://github.com/Alfresco/alfresco-ng2-components/commit/de1607217) [AAE-1653] Script to update webdriver locally ADF (#8846)
- [729a65ca5](https://github.com/Alfresco/alfresco-ng2-components/commit/729a65ca5) Update codeql-analysis.yml (#8843)
- [ce855ec36](https://github.com/Alfresco/alfresco-ng2-components/commit/ce855ec36) remove dependency from search-filters.e2e.ts file (#8840)
- [c9fdf2455](https://github.com/Alfresco/alfresco-ng2-components/commit/c9fdf2455) [APPS-2127] migrated dependency in date-range-filter component from moment to date-fns (#8833)
- [a8be9d64e](https://github.com/Alfresco/alfresco-ng2-components/commit/a8be9d64e) OPSEXP-2250 Fix s3 download command in init aps (#8842)
- [b58e6f628](https://github.com/Alfresco/alfresco-ng2-components/commit/b58e6f628) [MNT-23821] Filter custom aspects (#8790)
- [9a349f27d](https://github.com/Alfresco/alfresco-ng2-components/commit/9a349f27d) Add error logging while updateing aps license (#8839)
- [29ec2fcc9](https://github.com/Alfresco/alfresco-ng2-components/commit/29ec2fcc9) [ACS-5845] remove Alfresco Compatibility usage (#8822)
- [d0c35c28e](https://github.com/Alfresco/alfresco-ng2-components/commit/d0c35c28e) [ACS-5860] Migration of process name cloud pipe from moment to date-fns (#8797)
- [40adcfec2](https://github.com/Alfresco/alfresco-ng2-components/commit/40adcfec2) [ACS-5797] Disable restore action for the latest version of file (#8827)
- [03b93721a](https://github.com/Alfresco/alfresco-ng2-components/commit/03b93721a) [APPS-2110] migrated dependency from moment to date-fns (#8829)
- [3e56b9a4c](https://github.com/Alfresco/alfresco-ng2-components/commit/3e56b9a4c) [ACS-5226] Make Categories &amp; Tags View Details Edit consistent (#8826)
- [f8d587bc2](https://github.com/Alfresco/alfresco-ng2-components/commit/f8d587bc2) [ACS-5373] - Every getPerson() call changes current user (#8830)
- [673010d27](https://github.com/Alfresco/alfresco-ng2-components/commit/673010d27) [ACS-5738] unable to unselect libraries (#8825)
- [d0b1f77b7](https://github.com/Alfresco/alfresco-ng2-components/commit/d0b1f77b7) fix document list memory leak (#8823)
- [005115ee1](https://github.com/Alfresco/alfresco-ng2-components/commit/005115ee1) [ACS-5836] Display label for chips (#8820)
- [6cb881e8c](https://github.com/Alfresco/alfresco-ng2-components/commit/6cb881e8c) [ADF-5557] add missing i18n resources for library membership directive (#8806)
- [57ff88548](https://github.com/Alfresco/alfresco-ng2-components/commit/57ff88548) [AAE-15988] Update About component (#8814)
- [e7dbedd49](https://github.com/Alfresco/alfresco-ng2-components/commit/e7dbedd49) [AAE-15815] Export variable config interface (#8813)
- [f201efd56](https://github.com/Alfresco/alfresco-ng2-components/commit/f201efd56) [ACS-5761] Demo Shell Cleanup (part 2) (#8807)
- [ca60b392d](https://github.com/Alfresco/alfresco-ng2-components/commit/ca60b392d) [ACS-5693] - Fix flickering edit icon (pencil) on hover in chip-list input (#8808)
- [9bddd1a7c](https://github.com/Alfresco/alfresco-ng2-components/commit/9bddd1a7c) New grouping Depndabot (#8791)
- [adb203624](https://github.com/Alfresco/alfresco-ng2-components/commit/adb203624) size filter locator fix (#8810)
- [04803c181](https://github.com/Alfresco/alfresco-ng2-components/commit/04803c181) [AAE-15839] Fix file object input in viewers (#8804)
- [1f96c3452](https://github.com/Alfresco/alfresco-ng2-components/commit/1f96c3452) [AAE-15815] Create Data Table widget (#8801)
- [4f2b3bce3](https://github.com/Alfresco/alfresco-ng2-components/commit/4f2b3bce3) [ACS-5761] Demo Shell pages cleanup (#8802)
- [9497abcb4](https://github.com/Alfresco/alfresco-ng2-components/commit/9497abcb4) [ACS-5743] Cleanup Content tests (Demo Shell) (#8799)
- [3f3e83057](https://github.com/Alfresco/alfresco-ng2-components/commit/3f3e83057) [ACS-5703] Comment List code and styles cleanup (#8787)
- [312562889](https://github.com/Alfresco/alfresco-ng2-components/commit/312562889) [ACS-5400] Fix incomplete string escaping  (#8721)
- [48898df0f](https://github.com/Alfresco/alfresco-ng2-components/commit/48898df0f) [AAE-15741] ADF CardView component - headers for multivalued strings, integers and floats (#8789)
- [fee60cd4a](https://github.com/Alfresco/alfresco-ng2-components/commit/fee60cd4a) [ACA-4712] changes required to disallow using important for styles in aca (#8785)
- [80a6dadbf](https://github.com/Alfresco/alfresco-ng2-components/commit/80a6dadbf) enable flags for tags/categories in the metadata card (#8783)
- [f8f72d7f1](https://github.com/Alfresco/alfresco-ng2-components/commit/f8f72d7f1) [ACS-5179] Add search facet tabbed component for creator and modifier (#8775)
- [8eb43b00a](https://github.com/Alfresco/alfresco-ng2-components/commit/8eb43b00a) HXOR-167: send slack message in case of release failures (#8781)
- [e20de9997](https://github.com/Alfresco/alfresco-ng2-components/commit/e20de9997) [ACS-5687] info drawer layout fix for header (#8772)
- [640a73653](https://github.com/Alfresco/alfresco-ng2-components/commit/640a73653) [ACS-4985] Resolved e2e test cases
- [c8b4083f3](https://github.com/Alfresco/alfresco-ng2-components/commit/c8b4083f3) [ACS-5480] Bug Fix for multiple process/task filters (#8757)
- [2a4507d52](https://github.com/Alfresco/alfresco-ng2-components/commit/2a4507d52) [ACS-5266] Advanced Search - New component for Category facet (#8764)
- [1ebac2125](https://github.com/Alfresco/alfresco-ng2-components/commit/1ebac2125) [HXCS-1479] Breadcrumbs as secondary entry point (#8750)
- [570b5d53c](https://github.com/Alfresco/alfresco-ng2-components/commit/570b5d53c) [AAE-15762] downgrade google chrome to 114 (#8770)
- [1a4d7ba00](https://github.com/Alfresco/alfresco-ng2-components/commit/1a4d7ba00) [ACS-5629] enhanced way of providing translations (#8763)
- [d70f689e0](https://github.com/Alfresco/alfresco-ng2-components/commit/d70f689e0) [ACS-5183] properties facet file size and file type (#8766)
- [f45d69eb4](https://github.com/Alfresco/alfresco-ng2-components/commit/f45d69eb4) [ACS-5620] stabilise unit tests by switching to standard Angular api (#8759)
- [574bff2d8](https://github.com/Alfresco/alfresco-ng2-components/commit/574bff2d8) [ACS-5572] Add deprecated attribute to Like and Rating components (#8756)
- [e37b03cbb](https://github.com/Alfresco/alfresco-ng2-components/commit/e37b03cbb) ACS-5571 Add deprecated attribute to Webscript component (#8755)
- [77210f43c](https://github.com/Alfresco/alfresco-ng2-components/commit/77210f43c) [ACS-5145] Align header row with data rows. (#8732)
- [484211d32](https://github.com/Alfresco/alfresco-ng2-components/commit/484211d32) [AAE-15519] Fix - Assign To filter UI is broken (#8751)
- [6e203d3aa](https://github.com/Alfresco/alfresco-ng2-components/commit/6e203d3aa) [AAE-15610] - Fixed column resizing issue (#8742)
- [fceb7ecb9](https://github.com/Alfresco/alfresco-ng2-components/commit/fceb7ecb9) make resetNewFolderPagination method public again (#8739)
- [b832beb38](https://github.com/Alfresco/alfresco-ng2-components/commit/b832beb38) people and group covered already (#8738)
- [10afd501a](https://github.com/Alfresco/alfresco-ng2-components/commit/10afd501a) Fix username pipe div text assign (#8737)
- [8a0769a3c](https://github.com/Alfresco/alfresco-ng2-components/commit/8a0769a3c) [AAE-15523] Setting default value for csrf check (#8736)
- [54542c8b2](https://github.com/Alfresco/alfresco-ng2-components/commit/54542c8b2) [ACS-5399] Fix incomplete multi-character sanitization (#8707)
- [8fba7449e](https://github.com/Alfresco/alfresco-ng2-components/commit/8fba7449e) [ACS-5401] Fix unsafe HTML constructed from library input (#8725)
- [445200747](https://github.com/Alfresco/alfresco-ng2-components/commit/445200747) Hide document list private api (#8735)
- [0ffbf9fbe](https://github.com/Alfresco/alfresco-ng2-components/commit/0ffbf9fbe) [AAE-15522] Fix - Dropdown variable error messages are displayed at modeling part 2 (#8734)
- [b50b701da](https://github.com/Alfresco/alfresco-ng2-components/commit/b50b701da) ACS-5406 Removed some importants (#8733)
- [2f3f5ae02](https://github.com/Alfresco/alfresco-ng2-components/commit/2f3f5ae02) [ACS-5314] Data table row should be clickable anywhere (#8671)
- [a933070fc](https://github.com/Alfresco/alfresco-ng2-components/commit/a933070fc) [AAE-15522] Fix - Dropdown variable error messages are displayed at modeling level (#8730)
- [3b3fd5ab9](https://github.com/Alfresco/alfresco-ng2-components/commit/3b3fd5ab9) run from Mon to Fri (#8729)
- [c813bde00](https://github.com/Alfresco/alfresco-ng2-components/commit/c813bde00) ACS-5403 Prevent possibility to override prototype (#8719)
- [ecbf57145](https://github.com/Alfresco/alfresco-ng2-components/commit/ecbf57145) Revert &#34;test e2e (#8723)&#34; (#8724)
- [ad8259ece](https://github.com/Alfresco/alfresco-ng2-components/commit/ad8259ece) test e2e (#8723)
- [0fa61a289](https://github.com/Alfresco/alfresco-ng2-components/commit/0fa61a289) [AAE-15499] QA Failure provide more context on slack notification (#8720)
- [e3ea23da3](https://github.com/Alfresco/alfresco-ng2-components/commit/e3ea23da3) [AAE-15082][AAE-15081] Resolve the options coming from a json variabl… (#8673)
- [dabe4ca27](https://github.com/Alfresco/alfresco-ng2-components/commit/dabe4ca27) Revert &#34;improve jobs deps (#8717)&#34; (#8722)
- [23be41d67](https://github.com/Alfresco/alfresco-ng2-components/commit/23be41d67) revert use of action (#8718)
- [9f8d93ea0](https://github.com/Alfresco/alfresco-ng2-components/commit/9f8d93ea0) improve jobs deps (#8717)
- [ac3d95936](https://github.com/Alfresco/alfresco-ng2-components/commit/ac3d95936) [AAE-15480] - fixed variables name and added mat card variable (#8713)
- [567e264d9](https://github.com/Alfresco/alfresco-ng2-components/commit/567e264d9) simulating a change without code (#8715)
- [4c3b29d5b](https://github.com/Alfresco/alfresco-ng2-components/commit/4c3b29d5b) fix lib path
- [ee863391e](https://github.com/Alfresco/alfresco-ng2-components/commit/ee863391e) [AAE-15422] Publish bundles only if libs are affected by merged code (#8694)
- [1f74f5e1b](https://github.com/Alfresco/alfresco-ng2-components/commit/1f74f5e1b) [AAE-15269] update calendar locators (#8711)
- [ee588df85](https://github.com/Alfresco/alfresco-ng2-components/commit/ee588df85) [ACS-5436] Logical search final version (#8709)
- [7abebf065](https://github.com/Alfresco/alfresco-ng2-components/commit/7abebf065) [AAE-12501] Align JS API (#8344)
- [037dce0ae](https://github.com/Alfresco/alfresco-ng2-components/commit/037dce0ae) [HXCS-1479] Core breadcrumbs component (#8695)
- [bce1f34c2](https://github.com/Alfresco/alfresco-ng2-components/commit/bce1f34c2) [ACS-5398] Fixed useless regular expression character (#8710)
- [3f4fe2a89](https://github.com/Alfresco/alfresco-ng2-components/commit/3f4fe2a89) [AAE-15252] Update ADF interfaces to reflect update from BE (#8672)
- [f0d2456f4](https://github.com/Alfresco/alfresco-ng2-components/commit/f0d2456f4) [AAE-15018] - Add support for roles as part of the access token authorization (#8642)
- [b16777cce](https://github.com/Alfresco/alfresco-ng2-components/commit/b16777cce) [ACS-5364] bug fix (#8686)
- [9dd9347d1](https://github.com/Alfresco/alfresco-ng2-components/commit/9dd9347d1) [ACS-5397] Corrected checking whitespace characters in regexp (#8704)
- [be896b502](https://github.com/Alfresco/alfresco-ng2-components/commit/be896b502) [ACS-5395] Fixed possibility to containing script by string (#8696)
- [1078e27cb](https://github.com/Alfresco/alfresco-ng2-components/commit/1078e27cb) [ACS-5199] upgrade 3rd party depedencies to support angular 14 and later (#8669)
- [82540a449](https://github.com/Alfresco/alfresco-ng2-components/commit/82540a449) [AAE-15259] Making Identity User Info Component customizable (#8675)

## See Also

- [Issue Tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new)
- [Discussion forum](http://gitter.im/Alfresco/alfresco-ng2-components)
