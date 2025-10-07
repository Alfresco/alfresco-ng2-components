---
Title: Release notes v4.11.0
---

# Alfresco Application Development Framework (ADF) version 4.11.0 Release Note

This document provides information on the Alfresco Application Development Framework **v4.11.0**.

You can find release artifacts on [GitHub](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/4.11.0).

## Contents

- [New Package Versions](#new-package-versions)
- [Features](#features)
- [Changelog](#changelog)
- [See Also](#see-also)

## New Package Versions

| Name | Version |
| --- | --- |
| @alfresco/adf-content-services | 4.11.0 |
| @alfresco/adf-process-services | 4.11.0 |
| @alfresco/adf-core | 4.11.0 |
| @alfresco/adf-insights | 4.11.0 |
| @alfresco/adf-extensions | 4.11.0 |
| @alfresco/adf-testing | 4.11.0 |
| @alfresco/adf-cli | 4.11.0 |

## Features

This is a minor release of the Alfresco Application Development Framework containing bug fixes and enhancements.

## Changelog

- [9c134ba10](https://github.com/Alfresco/alfresco-ng2-components/commit/9c134ba10) Convert login fields validation e2e to unit (#7674)
- [81e58ecfb](https://github.com/Alfresco/alfresco-ng2-components/commit/81e58ecfb) [AAE-9094] - Fix app breaking when configured with BASIC auth (#7672)
- [1b20e17ed](https://github.com/Alfresco/alfresco-ng2-components/commit/1b20e17ed) [AAE-8076] Add groupsRestriction input to docs (#7645)
- [a4202d81b](https://github.com/Alfresco/alfresco-ng2-components/commit/a4202d81b) [ADF-5479] Disable clam/release button for standalone tasks on APA (#7670)
- [7e485ff63](https://github.com/Alfresco/alfresco-ng2-components/commit/7e485ff63) Update content-node-selector.component.scss (#7673)
- [34e8832ba](https://github.com/Alfresco/alfresco-ng2-components/commit/34e8832ba) [AAE-8155] Fix typo in providers (#7669)
- [4d1c72962](https://github.com/Alfresco/alfresco-ng2-components/commit/4d1c72962) [AAE-8155] Check if it is content admin only when content provider is available (#7667)
- [55b68373f](https://github.com/Alfresco/alfresco-ng2-components/commit/55b68373f) [ADF-5272] fe files upload form width is increasing if we upload file name too long (#7666)
- [0d96b4413](https://github.com/Alfresco/alfresco-ng2-components/commit/0d96b4413) [AAE-8740] Fix default ConfirmDialogComponent title (#7665)
- [d8a4b5bcd](https://github.com/Alfresco/alfresco-ng2-components/commit/d8a4b5bcd) [AAE-8748] - Auth guards call api when access is not in JWT (#7662)
- [c95ff1a83](https://github.com/Alfresco/alfresco-ng2-components/commit/c95ff1a83) Update process variable column type (#7664)
- [c05259e6c](https://github.com/Alfresco/alfresco-ng2-components/commit/c05259e6c) [AAE-7856] Show variables columns for tasks (#7659)
- [f3e4ff5aa](https://github.com/Alfresco/alfresco-ng2-components/commit/f3e4ff5aa) [AAE-7856] Show process variables in table (#7630)
- [aeb5bff26](https://github.com/Alfresco/alfresco-ng2-components/commit/aeb5bff26) [AAE-8740 Add a confirmation message in ADW (#7660)
- [7c13a99ed](https://github.com/Alfresco/alfresco-ng2-components/commit/7c13a99ed) [AAE-8948] Fix placeholders styles for left labels (#7656)
- [243803d4d](https://github.com/Alfresco/alfresco-ng2-components/commit/243803d4d) [AAE-8929] Get start event form static inputs (#7652)
- [4457aed5b](https://github.com/Alfresco/alfresco-ng2-components/commit/4457aed5b) [AAE-6242] upload a new version of a file attached in a form (#7651)
- [95fd3e822](https://github.com/Alfresco/alfresco-ng2-components/commit/95fd3e822) fix small viewport attach file (#7650)
- [f11ae24d7](https://github.com/Alfresco/alfresco-ng2-components/commit/f11ae24d7) Revert &#34;[AAE-8713] feat: create api registry with factories support (… (#7647)
- [dbbfa11f5](https://github.com/Alfresco/alfresco-ng2-components/commit/dbbfa11f5) test: remove flaky file upload e2e test (#7648)
- [b13a5cc28](https://github.com/Alfresco/alfresco-ng2-components/commit/b13a5cc28) [AAE-8856] Enable left label for form widgets in several widgets (#7640)
- [d4779360d](https://github.com/Alfresco/alfresco-ng2-components/commit/d4779360d) use default profile email as scope (#7639)
- [226a6548a](https://github.com/Alfresco/alfresco-ng2-components/commit/226a6548a) [AAE-8713] feat: create api registry with factories support (#7634)
- [95fc29568](https://github.com/Alfresco/alfresco-ng2-components/commit/95fc29568) [AAE-7817] Add columns selector for processes and tasks tasks (#7612)
- [1e3099b99](https://github.com/Alfresco/alfresco-ng2-components/commit/1e3099b99) [AAE-7077] Reset people content service cache on logout (#7637)
- [1762ba5af](https://github.com/Alfresco/alfresco-ng2-components/commit/1762ba5af) [AAE-8764] Enable left labels in text, number and dropdown cloud widget (#7628)
- [cec9297e1](https://github.com/Alfresco/alfresco-ng2-components/commit/cec9297e1) [AAE-8639] Discovery OpenId - Load discovery and pass info to jsapi (#7632)
- [6fb1bda6a](https://github.com/Alfresco/alfresco-ng2-components/commit/6fb1bda6a) Added missing top-level export for MainMenuDataTableTemplateDirective (#7633)
- [fa82d3216](https://github.com/Alfresco/alfresco-ng2-components/commit/fa82d3216) [ci:force] Fix failing copy to clipboard test (#7631)
- [24e5893a5](https://github.com/Alfresco/alfresco-ng2-components/commit/24e5893a5) [AAE-8648] Fix deprecated copy to clipboard api (#7610)
- [0b2e218b8](https://github.com/Alfresco/alfresco-ng2-components/commit/0b2e218b8) Add eslint ban rule (#7611)
- [e844faff7](https://github.com/Alfresco/alfresco-ng2-components/commit/e844faff7) [MNT-22924] Fix slow search results loading, limit number of pages (#7609)
- [fd0626391](https://github.com/Alfresco/alfresco-ng2-components/commit/fd0626391) [AAE-8659] fix eslint configuration for rxjs (#7607)
- [762979740](https://github.com/Alfresco/alfresco-ng2-components/commit/762979740) [AAE-7817] Show hide columns on datatable (#7580)
- [5cfbd6ffc](https://github.com/Alfresco/alfresco-ng2-components/commit/5cfbd6ffc) Added font awesome to icons model map (#7616)
- [6d60e452e](https://github.com/Alfresco/alfresco-ng2-components/commit/6d60e452e) Fix demo shell proxies (#7613)

## See Also

- [Issue Tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new)
- [Discussion forum](http://gitter.im/Alfresco/alfresco-ng2-components)
