---
Title: Release notes v6.1.0
---

# Alfresco Application Development Framework (ADF) version 6.1.0 Release Note

This document provides information on the Alfresco Application Development Framework **v6.1.0**.

See also: [Upgrading from ADF v5.0 to v6.0](../upgrade-guide/upgrade50-60.md).

You can find release artifacts on [GitHub](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/6.1.0).

## Contents

- [New Package Versions](#new-package-versions)
- [Features](#features)
- [Upgrade](#upgrade)
- [Changelog](#changelog)
- [See Also](#see-also)

## New Package Versions

| Name | Version   |
| --- |-----------|
| @alfresco/js-api | 6.1.0     |
| @alfresco/adf-content-services | 6.1.0 |
| @alfresco/adf-process-services | 6.1.0 |
| @alfresco/adf-core | 6.1.0 |
| @alfresco/adf-insights | 6.1.0 |
| @alfresco/adf-extensions | 6.1.0 |
| @alfresco/adf-testing | 6.1.0 |
| @alfresco/adf-cli | 6.1.0 |

## Features

The suggested stack is:

| Name | Version |
| --- | -- |
| Node | 18.6 |
| npm | 8.13 |
| Angular | 14.1 |
| Typescript | 4.7 |

For a complete list of changes, supported browsers and new feature please refer to the official documentation

## Changelog

- [727365025](git@github.com:Alfresco/alfresco-ng2-components/commit/727365025) [ACS-5310] Removed dead link from angular.json for demo-shell (#8596)
- [735521603](git@github.com:Alfresco/alfresco-ng2-components/commit/735521603) [AAE-14759] Fixed image viewer when going to full screen mode (#8609)
- [46efc4f7e](git@github.com:Alfresco/alfresco-ng2-components/commit/46efc4f7e) [AAE-14850] Fix outcome buttons position (#8610)
- [be9a0a08a](git@github.com:Alfresco/alfresco-ng2-components/commit/be9a0a08a) [ADF-5544] Missing Vulnerabilities in adf-cli audit (#8604)
- [32f244d93](git@github.com:Alfresco/alfresco-ng2-components/commit/32f244d93) [ADF-5517] Reverted extra bug fixes changes (#8605)
- [3ee2b387a](git@github.com:Alfresco/alfresco-ng2-components/commit/3ee2b387a) [AAE-14030] Fix header custom color (#8595)
- [2f8b7b2bd](git@github.com:Alfresco/alfresco-ng2-components/commit/2f8b7b2bd) [ADF-5532] ADF Upgrade guide(upgrade411-50.md) (#8516)
- [2429bb426](git@github.com:Alfresco/alfresco-ng2-components/commit/2429bb426) [AAE-14030] Custom header text color is not working on apa (#8592)
- [507c6498a](git@github.com:Alfresco/alfresco-ng2-components/commit/507c6498a) [AAE-14376] Spinner is not aligned after opening task details (#8591)
- [a799743bb](git@github.com:Alfresco/alfresco-ng2-components/commit/a799743bb) [ADF-5540] Enable C277288 e2e (#8587)
- [3660f7347](git@github.com:Alfresco/alfresco-ng2-components/commit/3660f7347) [AAE-14168] Fixed outcome buttons position in start process (#8586)
- [5abb6fbee](git@github.com:Alfresco/alfresco-ng2-components/commit/5abb6fbee) [AAE-14061] Fix spinner disappearing too early in task lists (#8577)
- [e4965ece6](git@github.com:Alfresco/alfresco-ng2-components/commit/e4965ece6) [ADF-5517] Add unit test to test clicking anywhere on a row in a datatable (#8287)
- [65dfd446f](git@github.com:Alfresco/alfresco-ng2-components/commit/65dfd446f) [ADF-5542] Update JS-API and ADF libs versions to use caret (#8570)
- [b3e824143](git@github.com:Alfresco/alfresco-ng2-components/commit/b3e824143) [ACS-5272] security fixes for ADF CLI (#8567)
- [7e1ff2006](git@github.com:Alfresco/alfresco-ng2-components/commit/7e1ff2006) Update datatable.component.md documentation (#8525)
- [c431d0c6f](git@github.com:Alfresco/alfresco-ng2-components/commit/c431d0c6f) [ACS-5171] Facets section - UI changes (#8563)
- [b10a4370c](git@github.com:Alfresco/alfresco-ng2-components/commit/b10a4370c) [AAE-14032] - fixed style for attach button (#8566)
- [b5d410b75](git@github.com:Alfresco/alfresco-ng2-components/commit/b5d410b75) [ACS-5137] Fixed navigation between images (#8534)
- [3b1842f03](git@github.com:Alfresco/alfresco-ng2-components/commit/3b1842f03) [ADF-5505] deprecate angular flex layout library (#8562)
- [7e2a7f5b2](git@github.com:Alfresco/alfresco-ng2-components/commit/7e2a7f5b2) [AAE-14332] Fix export in FormCloudModule (#8565)
- [baf010db6](git@github.com:Alfresco/alfresco-ng2-components/commit/baf010db6) cleanup ADF readme (#8543)
- [d0b74cfbc](git@github.com:Alfresco/alfresco-ng2-components/commit/d0b74cfbc) [ACS-5165] Remove old upstream workflow (#8559)
- [4bd05bb46](git@github.com:Alfresco/alfresco-ng2-components/commit/4bd05bb46) [AAE-12764] simpleapp widget name fix (#8560)
- [d24726c88](git@github.com:Alfresco/alfresco-ng2-components/commit/d24726c88) [AAE-13661] Modify init-aae-env file to accept env parameter (#8489)
- [a729852f3](git@github.com:Alfresco/alfresco-ng2-components/commit/a729852f3) [AAE-12764] Add new process and form to simpleapp (#8558)
- [d5e1ca45f](git@github.com:Alfresco/alfresco-ng2-components/commit/d5e1ca45f) fix JS-API peer dependencies for libs (#8551)
- [3dc1f1149](git@github.com:Alfresco/alfresco-ng2-components/commit/3dc1f1149) [ACS-5155] tags message about required field displayed after discarding changes (#8550)
- [42322f8a9](git@github.com:Alfresco/alfresco-ng2-components/commit/42322f8a9) [AAE-13566] changed select input&#39;s position (#8471)
- [2b8f81dfe](git@github.com:Alfresco/alfresco-ng2-components/commit/2b8f81dfe) [AAE-11270] replaced error message with shorter version (#8487)
- [5d5fb299e](git@github.com:Alfresco/alfresco-ng2-components/commit/5d5fb299e) [AAE-12763] Unit test - C588832 Should not be able to upload a file … (#8512)
- [50f9a2776](git@github.com:Alfresco/alfresco-ng2-components/commit/50f9a2776) [AAE-13971] changed color to accent contrast (#8501)
- [00ede54e3](git@github.com:Alfresco/alfresco-ng2-components/commit/00ede54e3) [AAE-14184] App key as parameter when fetching roles (#8541)
- [88d4408db](git@github.com:Alfresco/alfresco-ng2-components/commit/88d4408db) [ADF-5509] fix core dependency on datetimepicker (#8539)
- [9cf166c3a](git@github.com:Alfresco/alfresco-ng2-components/commit/9cf166c3a) [ACS-5148] Corrected first tag position and removed extra scrollbar when spinner is visible (#8535)
- [23149cae5](git@github.com:Alfresco/alfresco-ng2-components/commit/23149cae5) [AAE-13800] - Avoid reloading task/process list when column visibility changes (#8499)
- [94c23171d](git@github.com:Alfresco/alfresco-ng2-components/commit/94c23171d) [ADF-5509] Migrate to Node 18 (#8531)
- [42a2a3cd1](git@github.com:Alfresco/alfresco-ng2-components/commit/42a2a3cd1) [AAE-14166] - fixing script for version (#8532)
- [5d6a1ea6a](git@github.com:Alfresco/alfresco-ng2-components/commit/5d6a1ea6a) [ACS-5143] Tree component expand/collapse fix (#8528)
- [895d4189f](git@github.com:Alfresco/alfresco-ng2-components/commit/895d4189f) [AAE-14166] - fixing dependencies for editorjs (#8526)
- [4966bb2d4](git@github.com:Alfresco/alfresco-ng2-components/commit/4966bb2d4) [HXOR-200] Standardize dry run flags as dry-run-flag: ${{ inputs.dry-run-flag }} (#8506)
- [74a33e9d8](git@github.com:Alfresco/alfresco-ng2-components/commit/74a33e9d8) ACS-5147 Fixed typo (#8522)
- [2d55bbf58](git@github.com:Alfresco/alfresco-ng2-components/commit/2d55bbf58) AAE-12240: Form save button enable/disable management (#8502)
- [bcd0b66c9](git@github.com:Alfresco/alfresco-ng2-components/commit/bcd0b66c9) [ACS-5135] Tree component emit pagination only when top level entries change (#8519)

## See Also

- [Issue Tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new)
- [Discussion forum](http://gitter.im/Alfresco/alfresco-ng2-components)
