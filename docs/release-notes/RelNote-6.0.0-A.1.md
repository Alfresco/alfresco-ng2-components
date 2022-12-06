---
Title: Release notes v6.0.0-A.1
---

# Alfresco Application Development Framework (ADF) version 6.0.0-A.1 Release Note

This document provides information on the Alfresco Application Development Framework **v6.0.0-A.1**.

You can find release artifacts on [GitHub](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/6.0.0-A.1).

## Contents

- [New Package Versions](#new-package-versions)
- [Features](#features)
- [Upgrade](#upgrade)
- [Changelog](#changelog)
- [See Also](#see-also)

## New Package Versions

| Name | Version |
| --- | --- |
| @alfresco/adf-content-services | 6.0.0-A.1 |
| @alfresco/adf-process-services | 6.0.0-A.1 |
| @alfresco/adf-core | 6.0.0-A.1 |
| @alfresco/adf-insights | 6.0.0-A.1 |
| @alfresco/adf-extensions | 6.0.0-A.1 |
| @alfresco/adf-testing | 6.0.0-A.1 |
| @alfresco/adf-cli | 6.0.0-A.1 |

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

- f11bf262f LOC-402 - Updated localized UI in 16 languages for ADF 6.0 (#8023)
- e343de5c1 [AAE-11480] - Fix required error is displayed for a non required drop… (#8021)
- 70c6a1095 [AAE-11501] Fix simpleapp dropdown option ids after changing validation (#8019)
- d7ad1f9ad [ACS-3553] Fix process page accessibility from csv(880320,880281) (#8017)
- dea5f2189 [ACS-4050]critical issues from csv 880282, 880449, 880280 (#8005)
- ec6ede4fc [ACS-4087] Restore missing close button for manage version dialog (#8016)
- 97d6d7d53 [ACS-3731] content reflow issue fixed to fit the viewport at 400% zoom sub task ACS-3889 (#7979)
- 97b39dd1c CSV issues 880196 Function cannot be performed by keyboard alone addressed (#8007)
- 63a0ecac3 [ACS-3791] Renaming labels for uploader screen (#8011)
- b41eb3ff0 [ACS-3731]a11y zoom issues resolution (#7978)
- 5d360081e ACS-3758 Focus modal first focusable element after opening (#8006)
- 426cafff5 [AAE-10533] Generic App shell for HxP applications (#8002)
- 7667c9819 [AAE-11437] Remove snackbar duplications (#8003)
- 14ba15a07 [ACS-4051] 880283, 880284, 880285 Critical CSV issues buttons must have discernible text fixed (#8001)
- 665d7c32d [AAE-11385] Switched ids for attach-file-variables form (#7989)
- 06b652761 ACS-3640 Fix e2e (#7999)
- 9b7fab073 [ACS-3658] Fix duplicated ids (#7987)
- f41f39369 [ACS-4036] Revert folder color change (#7997)
- eff468008 [ACS-3640] Reverting reverted changes for a 11 y aca 881740 snackbar messages disappear without option to adjust timing (#7988)
- a241fc804 Update README.md
- 6a28061c9 Create upgrade50-60.md
- 933b59c54 [AAE-10772] Move content services directives from core to content-services package (#7942)
- f9c71bc95 [ACS-3781] 878751 function cannot be performed by keyboard alone hiding the user groups (#7980)
- c4446f0bf [ACS-3731] move/copy dialog and content overlaps other than 320px issue fixed (#7981)
- 44f54b2a6 [ACS-3548] Accessibility issues (#7939)
- d3d917d01 [ACS-3550] a 11 y aca move copy dialog small correction (#7986)
- afc6e1915 [ACS-3863] Edit aspect dialog accessibility issues (#7949)
- fa96a15be init aps script change call to fetch more users than default 100 (#7982)
- 54c1dbeca [ACS-3770] Stop select event propagation to restore keyboard functionality (#7967)
- 39e458abb [ACS-3888] Correct role for new version dialog (#7965)
- a83e837a9 [AAE-11319] start process loading spinner (#7968)
- 8d4549e01 [AAE-10912] Added destinationFolderPath to simpleapp (#7962)
- 4d76ebe1a ACS-3640 a 11 y aca 881740 snackbar messages disappear without option to adjust timing (#7916)
- ba05d3a1d ACS-3550 Fixed accessibility issues related with move and copy dialogs (#7961)
- 1109a73a1 [AAE-10766] presentational and reusable About (#7969)
- e67b2aaed [AAE-10766] Remove js-api imports from core about module (#7947)
- d57194327 [ACS-3908] Add node version manager support (#7960)
- 558d16006 [ACS-3751] make About layout collapsible (#7959)
- 2dd0d19d0 Run release only on merge and upstrem on cron (#7951)
- 1ced5e870 Use npm bin/nx (#7950)
- 7c04b59dd Remove unused scripts. Yeahgit add . (#7946)
- 26c143181 [AAE-11275] - e2e protractor - remove sleep step (#7944)
- d1c82edb9 [AAE-11279] Pipeline - Build libs and apps in the same stage and avoid install (#7943)
- 0459e4eb0 Exclude build apps from merge
- 45159544a Split the build from release (#7945)
- 13fe6fb07 ACS-3545 a 11 y aca metadata sidebar (#7923)
- 3dde18fbd Build core as usual and pretheme after build
- 84332cbe5 Bump version before building
- b6f1ea528 Remove useless echo
- e45c6891e [ACS-3701] Add auto focus directive (#7921)
- 711eaa34a Use npx to run nx
- 8ca604e25 Bump lib version after build (#7941)
- 0b0174ced [AAE-7666] Add error message when REST API fails for radio buttons (#7926)
- b572e16b6 [ACA-4622] Remove additional close button, unify buttons style (#7931)
- 4c92545d8 Move check bundle after release npm (#7940)
- 1c46bb83a [AAE-11259] Pipeline - Decoupling the build from release (#7935)
- b48784a04 AAE-10842: Modified properties viewer widget to handle file input (#7900)
- 68d6d1514 Deprecate commit sha (#7936)
- c2cdd90d9 Move the cli bundle under dist/libs/cli (#7937)
- d94637636 [AAE-11217] - Make init-aps script not rely on email domain (#7934)
- 8b94caafe [AAE-11255] adf-cli - Get rid of the build-testing and call copydist when needed (#7933)
- cebe2501f [AAE-11253] adf-cli - Get rid of build cli (#7932)
- 65e0961a1 [AAE-10835] adf-cli Being able to pass params as input to handle custom cases (#7880)
- 864bc3359 [AAE-11238] Fix position of loading spinner on task loading (#7928)
- 2f6d19641 [AAE-10644] Fix tests that have no expectations - core lib part 1 (#7891)
- bc57305e1 AAE-11221 - TRAVIS_EVENT_TYPE parse action
- c3bc1b4ef Fix git author when updating multiple projects (#7927)
- 4410557d8 MNT-23233: get users according to providers configuration (#7924)
- 32a3f9c9e [AAE-3563] getTaskById API is called multiple times when a task from … (#7877)
- c28e23b1c [AAE-10991] Fix task counter decrease (T15330758) (#7922)
- 499725659 [AAE-10644] Fix tests that have no expectations - core lib part 2 (#7893)

## See Also

- [Issue Tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new)
- [Discussion forum](http://gitter.im/Alfresco/alfresco-ng2-components)
