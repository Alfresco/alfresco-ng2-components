---
Title: Release notes v6.0.0-A.3
---

# Alfresco Application Development Framework (ADF) version 6.0.0-A.3 Release Note

This document provides information on the Alfresco Application Development Framework **v6.0.0-A.3**.

You can find release artifacts on [GitHub](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/6.0.0-A.3).

## Contents

- [New Package Versions](#new-package-versions)
- [Features](#features)
- [Upgrade](#upgrade)
- [Changelog](#changelog)
- [See Also](#see-also)

## New Package Versions

| Name | Version   |
| --- |-----------|
| @alfresco/js-api | 5.4.0     |
| @alfresco/adf-content-services | 6.0.0-A.3 |
| @alfresco/adf-process-services | 6.0.0-A.3 |
| @alfresco/adf-core | 6.0.0-A.3 |
| @alfresco/adf-insights | 6.0.0-A.3 |
| @alfresco/adf-extensions | 6.0.0-A.3 |
| @alfresco/adf-testing | 6.0.0-A.3 |
| @alfresco/adf-cli | 6.0.0-A.3 |

## Features

The suggested stack is:

| Name | Version | 
| --- | -- | 
| Node | 14.15.0 |
| npm | 6.14.8 |
| Angular | 14 |
| Typescript | 4.6 |

For a complete list of changes, supported browsers and new feature please refer to the official documentation

## Changelog

- [99db02b9d](https://github.com/Alfresco/alfresco-ng2-components/commit/99db02b9d) Fix typo in ADF cli changelog command (#8328)
- [b156e866b](https://github.com/Alfresco/alfresco-ng2-components/commit/b156e866b) quick fix username adf
- [aa6b5089b](https://github.com/Alfresco/alfresco-ng2-components/commit/aa6b5089b) quick fix branch
- [fc224713f](https://github.com/Alfresco/alfresco-ng2-components/commit/fc224713f) AAE-11918A - remove travis env var (#8312)
- [2bc74f012](https://github.com/Alfresco/alfresco-ng2-components/commit/2bc74f012) Regenerate package lock with lock file version 1 (#8326)
- [c890999c8](https://github.com/Alfresco/alfresco-ng2-components/commit/c890999c8) AAE-12860-build errors on cron
- [713320b01](https://github.com/Alfresco/alfresco-ng2-components/commit/713320b01) [ACS-4270] Content overlaps other content at 400% zoom  width equivalent issue fixed (#8264)
- [2f3c9f165](https://github.com/Alfresco/alfresco-ng2-components/commit/2f3c9f165) [ACS-4290] Changed filter icon to generic filter icon instead of the custom icon that was being used so far (#8237)
- [b5310f6b8](https://github.com/Alfresco/alfresco-ng2-components/commit/b5310f6b8) [ACS-4294] Added title to clear button and changed its icon type to clear from close (#8270)
- [702891061](https://github.com/Alfresco/alfresco-ng2-components/commit/702891061) [ACS-4670] Removed View 0 More tags button when chip takes more than on… (#8307)
- [d26593e4d](https://github.com/Alfresco/alfresco-ng2-components/commit/d26593e4d) [ACS-4571] Move SecurityControlsService to ADF Content Lib (#8286)
- [25d85c789](https://github.com/Alfresco/alfresco-ng2-components/commit/25d85c789) [ACS-4331] Add deleteTag method to tag service (#8126)
- [2dccde9e6](https://github.com/Alfresco/alfresco-ng2-components/commit/2dccde9e6) publish on gh first (#8314)
- [7d02ea61a](https://github.com/Alfresco/alfresco-ng2-components/commit/7d02ea61a) Publish the adf pkgs on gh pkg registry (#8313)
- [e7bb097be](https://github.com/Alfresco/alfresco-ng2-components/commit/e7bb097be) Updated datatable component docs (#8309)
- [90c8cb3ad](https://github.com/Alfresco/alfresco-ng2-components/commit/90c8cb3ad) Cron - Separate cron e2e from upstream and for different repo (#8300)
- [8625a49df](https://github.com/Alfresco/alfresco-ng2-components/commit/8625a49df) [ACS-4281] removed heading role from breadcrumbs. (#8278)
- [d41257983](https://github.com/Alfresco/alfresco-ng2-components/commit/d41257983) fix concurrency: only on PR workflow (#8306)
- [fbccbb5a9](https://github.com/Alfresco/alfresco-ng2-components/commit/fbccbb5a9) Fixed error on custom style and added doc for BC (#8297)
- [69689876a](https://github.com/Alfresco/alfresco-ng2-components/commit/69689876a) HXOR-109 - add json checker in PR workflow (#8304)
- [55ec15e17](https://github.com/Alfresco/alfresco-ng2-components/commit/55ec15e17) Bump lint-staged from 13.1.0 to 13.1.2 (#8302)
- [c89714be8](https://github.com/Alfresco/alfresco-ng2-components/commit/c89714be8) AAE-12767 (#8299)
- [8e3d5a9b9](https://github.com/Alfresco/alfresco-ng2-components/commit/8e3d5a9b9) [ACS-4326] Content was overlapping with other contents and some elements were missing when we zoom at 400% or 320px equivalent which is fixed (#8191)
- [02dcd4fb4](https://github.com/Alfresco/alfresco-ng2-components/commit/02dcd4fb4) [ACS-4565] add search for categories tree in admin cc (#8279)
- [477d49eae](https://github.com/Alfresco/alfresco-ng2-components/commit/477d49eae) AAE-12578 added fn to save col width with preferences (#8296)
- [b87610209](https://github.com/Alfresco/alfresco-ng2-components/commit/b87610209) trigger upstream daily for hxp monorepo (#8298)
- [f76e10ff0](https://github.com/Alfresco/alfresco-ng2-components/commit/f76e10ff0) AAE-12274: Added support for column resizing to process and task lists (#8275)
- [4aa2e0eb8](https://github.com/Alfresco/alfresco-ng2-components/commit/4aa2e0eb8) AAE-12273: Implemented column resizing directive (#8272)
- [058cd9e01](https://github.com/Alfresco/alfresco-ng2-components/commit/058cd9e01) [AAE-10594] Run unit tests in headless mode (#8141)
- [2062d4744](https://github.com/Alfresco/alfresco-ng2-components/commit/2062d4744) add content-app option in update ADF workflow
- [f8f6d145f](https://github.com/Alfresco/alfresco-ng2-components/commit/f8f6d145f) AAE-12721-PR-closed-check (#8282)
- [c00c7643b](https://github.com/Alfresco/alfresco-ng2-components/commit/c00c7643b) AAE-12716 updated the typography documentation (#8277)
- [05e203363](https://github.com/Alfresco/alfresco-ng2-components/commit/05e203363) [AAE-12675] update pdfjs version to fix sign problem (#8266)
- [384628197](https://github.com/Alfresco/alfresco-ng2-components/commit/384628197) Being able to upstream alfresco-apps or alfresco-applications (#8280)
- [f18fd9408](https://github.com/Alfresco/alfresco-ng2-components/commit/f18fd9408) [AAE-12668] refactored typography for themes (#8268)
- [41f135df0](https://github.com/Alfresco/alfresco-ng2-components/commit/41f135df0) [ACS-4634] Add ADF and JS API upstream to applications repo (#8274)
- [9014a85ed](https://github.com/Alfresco/alfresco-ng2-components/commit/9014a85ed) [AAE-12662] Get rid of multiplicity of &#34;more than one element found for locator&#34; warnings in tests caused by redundant click  (#8273)
- [96075ae45](https://github.com/Alfresco/alfresco-ng2-components/commit/96075ae45) [AAE-10779] User info component refactor (#8187)
- [c5710c0e6](https://github.com/Alfresco/alfresco-ng2-components/commit/c5710c0e6) [AAE-12134] unit test: Should be able to set number of columns for Header widget (#8267)
- [275d30b04](https://github.com/Alfresco/alfresco-ng2-components/commit/275d30b04) [ACS-4257] - Resolved a11y issue around jumping focus (#8168)
- [a1ec61f85](https://github.com/Alfresco/alfresco-ng2-components/commit/a1ec61f85) use one bucket variable to avoid: (#8263)
- [0ba076722](https://github.com/Alfresco/alfresco-ng2-components/commit/0ba076722) [ACS-3742] extra cfg support for shell navbar (#8256)
- [bcfa48894](https://github.com/Alfresco/alfresco-ng2-components/commit/bcfa48894) [ACS-4252] Resolved accessibility issues around inherited permissions popover (#8222)
- [b1311c696](https://github.com/Alfresco/alfresco-ng2-components/commit/b1311c696) [ACS-4124] Display only as much tags as fits container in tag node list (#8247)
- [6e99dd663](https://github.com/Alfresco/alfresco-ng2-components/commit/6e99dd663) [ACS-4322] content overlap issue fixed at 400% zoom and close button which was earlier not visible at 400% zoom is visible now. (#8201)
- [5ce855390](https://github.com/Alfresco/alfresco-ng2-components/commit/5ce855390) upgrade js-editor to drop cypress dependency (#8249)
- [99015fee8](https://github.com/Alfresco/alfresco-ng2-components/commit/99015fee8) Update dependabot.yml (#8252)
- [e16bed611](https://github.com/Alfresco/alfresco-ng2-components/commit/e16bed611) [AAE-12260] - fixing form field mapping (#8243)
- [5d2dddee2](https://github.com/Alfresco/alfresco-ng2-components/commit/5d2dddee2) [ACS-4254] Delete permissions button is now keyboard interact-able (enter key) (#8216)
- [d873306c7](https://github.com/Alfresco/alfresco-ng2-components/commit/d873306c7) AAE-12192 - adding upload artifacts action (#8172)
- [dd1feeec6](https://github.com/Alfresco/alfresco-ng2-components/commit/dd1feeec6) [ACS-4296] adding mapping in tags service (#8240)
- [08b4cc793](https://github.com/Alfresco/alfresco-ng2-components/commit/08b4cc793) Update rebase.yml
- [7c6ce0a5f](https://github.com/Alfresco/alfresco-ng2-components/commit/7c6ce0a5f) [AAE-12558] Fix load content-services translation resources (#8241)
- [b9c53e586](https://github.com/Alfresco/alfresco-ng2-components/commit/b9c53e586) AAE-12139 disabled start process btn when clicked and api call in pro… (#8160)
- [cd84be971](https://github.com/Alfresco/alfresco-ng2-components/commit/cd84be971) Fix cli compilation (#8244)
- [1a00249f6](https://github.com/Alfresco/alfresco-ng2-components/commit/1a00249f6) [ADF-5514] Fix red dot still present after filter being cleared (#8181)
- [4c7e500ea](https://github.com/Alfresco/alfresco-ng2-components/commit/4c7e500ea) Move search-input-text from content-services to core (#8239)
- [c12b4284e](https://github.com/Alfresco/alfresco-ng2-components/commit/c12b4284e) [AAE-12249] add description field (#8226)
- [a0333b1d9](https://github.com/Alfresco/alfresco-ng2-components/commit/a0333b1d9) [AAE-12412] bot &amp; schedule check fix
- [857f9bd2b](https://github.com/Alfresco/alfresco-ng2-components/commit/857f9bd2b) [AAE-12532] remove pipelines from travis.yml (#8229)
- [e59176d39](https://github.com/Alfresco/alfresco-ng2-components/commit/e59176d39) [ACS-4274] Add role heading and aria level in header template (#8192)
- [65e0c2405](https://github.com/Alfresco/alfresco-ng2-components/commit/65e0c2405) [ACS-4051] Copy to clipboard button is now accessible through the keyboard (#8225)
- [d50aa9192](https://github.com/Alfresco/alfresco-ng2-components/commit/d50aa9192) Fix alfresco-apps upstream build 260285240: export search-text-input.model from content-services (#8227)
- [e0dfc9a8e](https://github.com/Alfresco/alfresco-ng2-components/commit/e0dfc9a8e) [ACS-4296] changes required after removing tags service from apps (#8223)
- [3f8293b64](https://github.com/Alfresco/alfresco-ng2-components/commit/3f8293b64) Revert &#34;[ACS-4051] Copy to clipboard button is now accessible through the keyboard enter earlier which was only accessible through mouse click (#8165)&#34; (#8224)
- [e8a3d109d](https://github.com/Alfresco/alfresco-ng2-components/commit/e8a3d109d) Label is not persistent as placeholder is being used as the only visual label for a text field (#8221)
- [4043d55fc](https://github.com/Alfresco/alfresco-ng2-components/commit/4043d55fc) [AAE-10778] Refactor Viewer (#7992)
- [52520bb61](https://github.com/Alfresco/alfresco-ng2-components/commit/52520bb61) [ACS-4364] Move tree component and categories service to ADF (#8156)
- [afb22bbc0](https://github.com/Alfresco/alfresco-ng2-components/commit/afb22bbc0) Revert &#34;[ACS-4307] Label is not persistent as placeholder is being used as the only visual label for a text field (#8213)&#34; (#8220)
- [ca49693bd](https://github.com/Alfresco/alfresco-ng2-components/commit/ca49693bd) AAE-12452 - Version published in NPM should have PR number id in the name not gh-run_id (#8218)
- [a720edd2c](https://github.com/Alfresco/alfresco-ng2-components/commit/a720edd2c) [ACS-4307] Label is not persistent as placeholder is being used as the only visual label for a text field (#8213)
- [1f450c059](https://github.com/Alfresco/alfresco-ng2-components/commit/1f450c059) [AAE-11654] Fix default option being selectable when parent dropdown … (#8146)
- [0ab39e28f](https://github.com/Alfresco/alfresco-ng2-components/commit/0ab39e28f) [AAE-12179] Remove process-services and content-services dependencies… (#8161)
- [11c3a02ac](https://github.com/Alfresco/alfresco-ng2-components/commit/11c3a02ac) [ACS-4051] Copy to clipboard button is now accessible through the keyboard enter earlier which was only accessible through mouse click (#8165)
- [4f25426c2](https://github.com/Alfresco/alfresco-ng2-components/commit/4f25426c2) [AAE-10777] Move in common service the real common services (#8203)
- [89b79c9e4](https://github.com/Alfresco/alfresco-ng2-components/commit/89b79c9e4) [AAE-12146] Update getFeature typings (#8167)
- [71e7fc0bf](https://github.com/Alfresco/alfresco-ng2-components/commit/71e7fc0bf) AAE-12412 alfresco-build user whitelisted (#8214)
- [d6e8e7a3b](https://github.com/Alfresco/alfresco-ng2-components/commit/d6e8e7a3b) AAE-12412 - dependabot actor check (#8210)
- [2d386c589](https://github.com/Alfresco/alfresco-ng2-components/commit/2d386c589) AAE-12357: update unit test name (#8197)
- [2a45c1e7a](https://github.com/Alfresco/alfresco-ng2-components/commit/2a45c1e7a) fix the private access to the service variables (#8202)
- [b50377347](https://github.com/Alfresco/alfresco-ng2-components/commit/b50377347) [ACS-4411] updateTag method added to tags service (#8200)
- [efb2558c3](https://github.com/Alfresco/alfresco-ng2-components/commit/efb2558c3) Exclue snackbar from screen reader (#8199)
- [266d3aa9b](https://github.com/Alfresco/alfresco-ng2-components/commit/266d3aa9b) [AAE-11700] add process to simpleapp (#8198)
- [b6cf14c84](https://github.com/Alfresco/alfresco-ng2-components/commit/b6cf14c84) [ACS-4263] Add &#39;aria-pressed&#39; attribute for reset button on content viewer page (#8183)
- [4a3bc568a](https://github.com/Alfresco/alfresco-ng2-components/commit/4a3bc568a) [AAE-11708] Fix changelog author filtering programatically (#8178)
- [42dbfe25a](https://github.com/Alfresco/alfresco-ng2-components/commit/42dbfe25a) fix gha warnings for outdated actions (#8194)
- [2c248a611](https://github.com/Alfresco/alfresco-ng2-components/commit/2c248a611) [AAE-8306] - Managed to disable complete/claim/release buttons on first click (#8166)
- [588ffe0fa](https://github.com/Alfresco/alfresco-ng2-components/commit/588ffe0fa) AAE-10979: Added support to display html icon for mht file format (#8133)
- [61a3e30c3](https://github.com/Alfresco/alfresco-ng2-components/commit/61a3e30c3) [AAE-12127] Test: The aspect added in config is displayed even if inc… (#8158)
- [facc4f6b0](https://github.com/Alfresco/alfresco-ng2-components/commit/facc4f6b0) visible label are associated (#8176)
- [3df6bcea2](https://github.com/Alfresco/alfresco-ng2-components/commit/3df6bcea2) AAE-12063 removed startCreatedProcess with relevant unit tests (#8131)
- [f02272ac6](https://github.com/Alfresco/alfresco-ng2-components/commit/f02272ac6) AAE-12239: Managed to populate processInstanceId in service tasks filters when navigating from process instances view (#8174)
- [1746fcf65](https://github.com/Alfresco/alfresco-ng2-components/commit/1746fcf65) [ACS-4253] - Added aria-label to form element (#8170)
- [46717cdd4](https://github.com/Alfresco/alfresco-ng2-components/commit/46717cdd4) [ACS-4413] Upgrade CodeQL analysis to v2 (#8184)

## See Also

- [Issue Tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new)
- [Discussion forum](http://gitter.im/Alfresco/alfresco-ng2-components)
