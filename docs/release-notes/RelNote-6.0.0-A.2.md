---
Title: Release notes v6.0.0-A.2
---

# Alfresco Application Development Framework (ADF) version 6.0.0-A.2 Release Note

This document provides information on the Alfresco Application Development Framework **v6.0.0-A.2**.

You can find release artifacts on [GitHub](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/6.0.0-A.2).

## Contents

- [New Package Versions](#new-package-versions)
- [Features](#features)
- [Upgrade](#upgrade)
- [Changelog](#changelog)
- [See Also](#see-also)

## New Package Versions

| Name | Version |
| --- | --- |
| @alfresco/js-api | 5.3.0 |
| @alfresco/adf-content-services | 6.0.0-A.2 |
| @alfresco/adf-process-services | 6.0.0-A.2 |
| @alfresco/adf-core | 6.0.0-A.2 |
| @alfresco/adf-insights | 6.0.0-A.2 |
| @alfresco/adf-extensions | 6.0.0-A.2 |
| @alfresco/adf-testing | 6.0.0-A.2 |
| @alfresco/adf-cli | 6.0.0-A.2 |

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

## Changelog

- 4f7f5b0af [LOC-405] - Updated string in process-services-cloud in 16 languages for ADF 6.0 (#8177)
- a5a9a1e45 [AAE-12135] Added process ui to subprocess app (#8173)
- 570bfb235 [ACA-4650] Use NodeCommentsService for ADF_COMMENTS_SERVICE (#8169)
- eb8bad1f9 [AAE-12124] Use a function to remove js files (#8157)
- 59df5c661 enable e2e: C260040 (#8155)
- bd9127d96 AAE-11884 change tag sha action (#8118)
- 32e4564e1 Revert "[ACS-4051] Copy to clipboard button is now accessible through the keyboard enter earlier which was only accessible through mouse click (#8119)" - (#8159)
- cc33c5dec adjust cron condition
- 6138c16f4 AAE-12123 TAG_NPM fix
- a412b4530 [AAE-12057] add description to unit tests
- b99a574f9 AAE-12046 - add pre-condition on approval (#8145)
- 616ae95c2 [ACS-4118] create a tag from tags list (#8143)
- bbee01a80 [AAE-12123] env var interpolation bugfix
- 067d4e936 [ACS-4051] Copy to clipboard button is now accessible through the keyboard enter earlier which was only accessible through mouse click (#8119)
- 8a2f73ec2 correct run
- 55b146044 add pre-condition on approved PR
- 73e195341 [AAE-11989] Automate C586839 - Should be able to see the tooltip for form widget (#8138)
- 0b9fb82de force e2e only after build-libs, lint, unit-tests (#8136)
- f654fdf00 [AAE-1274] CI opt - Build only core/content/process storybook (#8139)
- 34e550807 [AAE-11992] pass only the processInstanceId as Input instead of the entire taskFilter object (#8140)
- 9d143cf94 AAE-12037 git-tag stage (#8124)
- fe65f7c20 AAE-11940 -  fix upstream flow - update-project script and upstream trigger (#8125)
- f6fd813a2 [AAE-12057] unit tests fix (#8130)
- 93edda226 [AAE-11992] fix processInstanceId filter empty: set taskFilter as input to check for the processInstanceId changes to set the filter (#8128)
- 2bf1832fe AAE-11940 - npm err fix in trigger-adf workflow (#8122)
- 9f77d4187 removed test tag (#8127)
- e7624f031 enabling dry run
- 1791534ec [ACA-4647] Fix for e2e (#8104)
- fd6f881ea [AAE-11817] release fix eval condition
- a564176cb AAE-11940 - fix alpha adf test in cron workflow (#8113)
- c2ff725f0 [AAE-11817]-release-fix (#8120)
- 48cadfaa2 [AAE-11817] fix release pipeline
- 0d294ce72 [AAE-11708] Use perl regexp instead of reverse grep in changelog (#8114)
- 10d49f458 AAE-11810 added conditional class to indicate validation error (#8090)
- 198c23008 change cron schedule for cron workflow
- f5b78bd57 change cron schedule for cron workflow
- 5e11eaf60 AAE-11910 - cron schedule fix (#8105)
- 80e4434f8 AAE-11910 - setup cron pipe to trigger alpha_adf and add a workflow_dispatch to execute manually adf tests (#8100)
- ec2f34946 [#7902] Fix to enable cmaps with pdfjs (#8101)
- f48cd3075 [AE-11486] move shared link in content and deprecate unused dialog service (#8091)
- a0aab4709 export identity-group.service (#8099)
- 6f6af8cd4 [AE-11486]  remove unused comment services and improve doc (#8092)
- aa37cad99 AAE-11910 -  add a workflow_dispatch to execute manually adf tests from gha GUI (#8098)
- b9e0221ca [AE-11486] move lock and favorite (#8089)
- f7fdc5c92 [AAE-11916] gh secrets fix
- 0d82ebccf [AAE-11913] Fix name of simpleapp (#8096)
- 91d511dee [AAE-10994] Added task-executor forms and process to simpleapp (#8066)
- 4da74f1c0 [AAE-10769] remove alfresco deps from datatable  (#8045)
- 85429b4cf [AAE-11882] demoshell fix; pipeline bugfix (#8093)
- df340f2bb [AE-11486] move search service in alfresco content (#8086)
- b48248fae move app process service in process-service (#8087)
- 00dfd7c5d Update doc (#8085)
- 093b1e8a6 [AAE-11891] move auth in auth folder (#8076)
- ae126475f [AAE-11486] move NodeUdpdate in nodeapiservice (#8077)
- 1855d8899 [AAE-11889] move sites service to content lib (#8073)
- 0cb21d61a [AAE-11274] remove unnecessary var export (#8074)
- 310b04919 [AAE-10315] fix karma 404 for images and certain errors in the Core unit tests (#8072)
- bc7c05205 [AAE-11740] replaced api for starting process (#8052)
- 2207156f3 [AAE-10319] unit test fixes for content-services lib
- a535af667 [AAE-10773] Make Form core process agonostic (#8032)
- eb27d38eb [AAE-11588] Send Process Variables as a post body in admin process instances (#8067)
- d29ec85b1 [AAE-11822] fix demoshell and gh act. release
- 266d30041 [AAE-11727] add suggested karma test explorer plugin (#8068)
- 3864aaf9c [AAE-10768] Make the comments reusable (#7983)
- 907757219 [AAE-10776] NodeNameTooltipPipe moved in content service pkg (#8048)
- 7fa5c0faa [AAE-11843]-fix-before_install_script (#8059)
- d5592b9e0 AAE-11714 changed max-width for cropped image (#8054)
- 02578dcdc [AAE-10767] Separate core card view logic from content-services and add documentation to reflect the changes (#7952)
- 8d074e8b3 [AAE-11822] fix demoshell (#8057)
- a73526ef8 [AAE-11822] fix/build-demoshell (#8055)
- 280684c3a [AAE-10774] move host settings to demo shell (#8051)
- 70e6d642f [AAE-7986] Migrate ADF from Travis to Github actions (#8050)
- 8efbd7067 [AAE-10775] remove js-api dependency for pagination (#8046)
- d476f16a0 [AAE-11763] cleanup ADF root package config (#8044)
- 69f0419ff [ADF-5508] Fix half hidden checkmark icon (#8039)
- f094ace1c [AAE-11695] add breaking changes notes (#8043)
- c1cffa9cf [ACS-3757] returning focus to element from which they were opened (#8034)
- ef278bde7 AAE-11739 removed unnecessary api call when cancelling not started pr… (#8041)
- 5edc1186a [AAE-11695] move version compatibility directive and service (#8038)
- d89e3c806 [AAE-11653] Automate part of ADF Form Widgets (#8035)
- c567054ce [AAE-11418] add missing rules prop to NavBar interfaces (#8040)
- 5a557f999 [ACS-3553] Fix process page accessibility from csv(880320,880281) (#8037)

## See Also

- [Issue Tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new)
- [Discussion forum](http://gitter.im/Alfresco/alfresco-ng2-components)
