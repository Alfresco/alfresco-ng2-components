---
Title: Release notes v3.0.0
---

# Alfresco Application Development Framework (ADF) version 3.0.0 Release Note

These release notes provide information about the **3.0.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.0.0).

If you want to be updated on the [ADF roadmap](../roadmap.md), check the public page [here](../roadmap.md). 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Extensibility](#extensibility)
    -   [Search enhancement](#search-enhancement)
    -   [Single Sign On enhancement](#single-sign-on-enhancement)
    -   [JS-API in Typescript](#js-api-in-typescript)
    -   [Angular 7](#angular-7)
    -   [Deprecation removal](#deprecation-removal)
    -   [Activiti 7 and APS 2 support](#activiti-7-and-aps-2-support)
-   [Localization](#localization)
-   [References](#references)
-   [Issues addressed](#issues-addressed)
    -   [Documentation](#documentation)
    -   [Feature](#feature)
    -   [Bug](#bug)
    -   [Task](#task)
    -   [Feature Bug](#feature-bug)
    -   [Feature (Task)](#feature-task)

## New package versions

    "@alfresco/adf-content-services" : "3.0.0"
    "@alfresco/adf-process-services" : "3.0.0"
    "@alfresco/adf-core" : "3.0.0"
    "@alfresco/adf-insights" : "3.0.0",
    "@alfresco/adf-extensions": "3.0.0"

## Goals for this release

This is a major release of the Alfresco Application Development Framework, developed to speed up the applications in production environments, thanks to a porting of the [JS-API](https://github.com/Alfresco/alfresco-js-api) to Typescript. All the benefits of the Extensibility, initially introduced in [Alfresco Content Application (ACA)](https://github.com/Alfresco/alfresco-content-app) and the Alfresco Digital Workspace (ADW), are now available at the framework level and more enhancements are planned to be introduced in the following releases.

This new major version of Alfresco Application Development Framework has been updated to the latest and the greatest of [Angular 7](https://angular.io/), together with a first iteration on supporting [Activiti 7](https://www.activiti.org/) and the next generation of Alfresco BPM Engines. Also the [Yeoman App Generator](https://github.com/Alfresco/generator-ng2-alfresco-app) has been updated to ship to create five small [Angular CLI](https://cli.angular.io/) based applications to help get you started: one on content only, two on process only (on the current generation of Alfresco BPM Engine and one with the new ones), two on content and process (again, using the current and new generations of Alfresco BPM Engines).

Please report issues with this release in the issue tracker. You can collaborate on this release or share feedback by using the discussion tools on Gitter.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

Below are the most important new features of this release:

-   **Extensibility**
-   **Search enhancement**
-   **Single Sign On enhancement**
-   **JS-API in Typescript**
-   **Angular 7**
-   **Deprecation removal**
-   **Activiti 7 and APS 2 support (experimental)**

### Extensibility

Extensibility has been introduced into the [Alfresco Content Application (ACA)](https://github.com/Alfresco/alfresco-content-app) and the Alfresco Digital Workspace (ADW) first, and then moved to the founding ADF framework, for the benefit of the developers all.

The house of the extensibility support in the framework is the **@alfresco/adf-extensions** library. Check the documentation at [this link](https://alfresco.github.io/alfresco-content-app/#/extending/), for further details on how to develop extensions to any ADF application.

### Search enhancement

TODO

### Single Sign On enhancement

TODO

### JS-API in Typescript

The [Alfresco JS-API layer](https://github.com/Alfresco/alfresco-js-api) has been rewritten in [TypeScript](https://en.wikipedia.org/wiki/TypeScript) to benefit of the availability of specific tooling, enabling the deployments in production to be lighter, and so faster.

### Angular 7

Alfresco ADF 3.0.0 works with the latest Angular version available: [Angular 7](https://angular.io/). 

### Deprecation removal

Following the [SEMVER 2.0](https://semver.org/), ADF 3.0.0 introduces breaking changes only in major versions like this one. For this purpose, all the features, components and services, marked as deprecated in ADF 2.X, have been removed.

### Activiti 7 and APS 2 support

Since ADF 3.0.0, Alfresco is introducing the support of the new generation of BPM Engines, in both the editions: **Open Source and Enterprise**. This is a first iteration and more coverage of the services will be done in the following versions of ADF. This is the reason why this support is marked as **experimental** for this release.

This release of ADF introduces a collection of brand new components re-designed and implemented from scratch to be compliant with [Activiti 7](https://www.activiti.org/) and the new Enterprise Alfresco BPM Engine (powered by [Activiti 7](https://www.activiti.org/)).

## Localization

This release includes: French, German, Italian, Spanish, Japanese, Dutch, Norwegian (BokmÅl), Russian, Brazilian Portuguese and Simplified Chinese versions.

## References

Below you can find a brief list of references to help you start using the new release.

[Getting started guides with Alfresco Application Development Framework](https://community.alfresco.com/community/application-development-framework/pages/get-started)
[Alfresco ADF Documentation on the Builder Network](../../../)
[Gitter chat supporting Alfresco ADF](https://gitter.im/Alfresco/alfresco-ng2-components)
[ADF examples on GitHub](https://github.com/Alfresco/adf-examples)

[Official GitHub Project - alfresco-ng2-components](https://github.com/Alfresco/alfresco-ng2-components)
[Official GitHub Project - alfresco-js-api](https://github.com/Alfresco/alfresco-js-api)
[Official GitHub Project - generator-ng2-alfresco-app](https://github.com/Alfresco/generator-ng2-alfresco-app)

Please refer to the [official documentation](http://docs.alfresco.com/) for further details and suggestions.

## Issues addressed

Below the list of JIRA issues, closed for this release.

### Documentation
-   \[[ADF-...](https://issues.alfresco.com/jira/browse/ADF-...)] - ...
### Feature
-   \[[ADF-...](https://issues.alfresco.com/jira/browse/ADF-...)] - ...
### Bug
-   \[[ADF-...](https://issues.alfresco.com/jira/browse/ADF-...)] - ...
### Task
-   \[[ADF-...](https://issues.alfresco.com/jira/browse/ADF-...)] - ...
### Feature Bug
-   \[[ADF-...](https://issues.alfresco.com/jira/browse/ADF-...)] - ...
### Feature (Task)
-   \[[ADF-...](https://issues.alfresco.com/jira/browse/ADF-...)] - ...

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).