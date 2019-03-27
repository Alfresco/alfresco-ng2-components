---
Title: Release notes v3.1.0
---

# Alfresco Application Development Framework (ADF) version 3.1.0 Release Note

These release notes provide information about the **3.1.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.1.0).

If you want to be updated on the [ADF roadmap](../roadmap.md), check the public page [here](../roadmap.md). 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [More on Activiti 7](#more-on-activiti-7)
    -   [Enhanced DocumentList](#enhanced-documentList)
    -   [Enhanced Metadata viewer](#enhanced-metadata-viewer)
    -   [Search pattern highlight](#search-pattern-highlight)
    -   [Improved accessibility](#improved-accessibility)
    -   [Arabic and RTL languages support](#arabic-and-rtl-languages-support)
-   [Localisation](#localisation)
-   [References](#references)
-   [Issues addressed](#issues-addressed)
    -   [Documentation](#documentation)
    -   [Feature](#feature)
    -   [Bug](#bug)
    -   [Task](#task)
    -   [Feature Bug](#feature-bug)
    -   [Feature (Task)](#feature-task)

## New package versions

    "@alfresco/adf-content-services" : "3.1.0"
    "@alfresco/adf-process-services" : "3.1.0"
    "@alfresco/adf-core" : "3.1.0"
    "@alfresco/adf-insights" : "3.1.0",
    "@alfresco/adf-extensions": "3.1.0"

## Goals for this release

This is the first minor release after Alfresco Application Development Framework version 3, available to the developers since February 2019.

This release pushes a step further in the direction of the complete support of [Activiti 7](https://www.activiti.org/), the next generation Cloud Native implementation of Activiti. In addition to that, some enhancements has been introduced to the DocumentList and the Metadata viewer, as a consequence of some requests coming from the eco-system of developers using ADF in complex applications.

Another enhancement introduced in ADF 3.1, is about search pattern highlight, considered as relevant in Share and since this version available in ADF application as well.

In the area of [accessibility](https://en.wikipedia.org/wiki/Computer_accessibility), the new release of ADF take advantage of some bugfix and enhancements related to [Section508](https://www.section508.gov/).

Following the good amount of requests coming from the developers, we are pleased to announce the official support of Arabic and Right To Left languages in ADF applications. The benefit for the market is clear, opening to a broader number of potential users and use cases.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

Below are the most important new features of this release:

-   [More on Activiti 7](#more-on-activiti-7)
-   [Enhanced DocumentList](#enhanced-documentList)
-   [Enhanced Metadata viewer](#enhanced-metadata-viewer)
-   [Search pattern highlight](#search-pattern-highlight)
-   [Improved accessibility](#improved-accessibility)
-   [Arabic and RTL languages support](#arabic-and-rtl-languages-support)

### More on Activiti 7

In ADF 3.0.0 (released in February) we announced the introduction of the new `*Cloud` package, containing a set of components to support the [Activiti 7](https://www.activiti.org/), the next generation Cloud Native implementation of Activiti BPM Engine. With this ADF 3.1 release the journey continues with more supported features, like: 

**...add more here**

### Enhanced DocumentList

Following soe suggestions from Customers and Partners, we enhanced the `DocumentList` with the possibility to have a sticky header.

**...add examples here**

### Enhanced Metadata viewer

Since this version of ADF, developers can include the full list of types/aspects into the metadata viewer, without the need to specify all of them. The limit of the previous version was that developers were requested to specify the list of types/aspects or an asterisc to say "include all". The use case represented by "include all except X, Y, Z..." was not covered and now it is.

**...add more examples here**


### Search pattern highlight

As another example of good feedback we had from the developers on the ground about improving ADF, we introduced the custom highlighting of results in search. Since ADF 3.1, developers can customize the pattern highlighting and the markers to use.

**...add examples here**

### Improved accessibility

In terms of [accessibility](https://en.wikipedia.org/wiki/Computer_accessibility), ADF version 3.1 introduces some bug fixes kindly requested from some customers and partners about [Section508](https://www.section508.gov/). Alfresco plans to introduce more enhancements from this point and view, so more improvements will be introduced in the next releases.

### Arabic and RTL languages support

Due to regular requests, we decided to support also Arabic language into ADF. In ADF 3.1 the Team introduces another additional benefit, developing a first iteration to support Right To Left languages. Starting from ADF version 3.1, it is possible to (easily) [change an ADF application to work correctly with a RTL language](../user-guide/rtl-support.md).

We are quite happy with the current support of RTL languages on ADF, but feedback are welcome if you experience something to be improved or added for a better User Experience.

## Localisation

This release includes: French, German, Italian, Spanish, Arabic, Japanese, Dutch, Norwegian (Bokmål), Russian, Brazilian Portuguese and Simplified Chinese versions.

In the next version we plan to include as supported languages also: Danish, Finnish, Swedish, Czech, Polish.

## References

Below is a brief list of references to help you start using the new release:

-   [Getting started guides with Alfresco Application Development Framework](https://community.alfresco.com/community/application-development-framework/pages/get-started)
-   [Alfresco ADF Documentation on the Builder Network](../README.md)
-   [Gitter chat supporting Alfresco ADF](https://gitter.im/Alfresco/alfresco-ng2-components)
-   [ADF examples on GitHub](https://github.com/Alfresco/adf-examples)
-   [Official GitHub Project - alfresco-ng2-components](https://github.com/Alfresco/alfresco-ng2-components)
-   [Official GitHub Project - alfresco-js-api](https://github.com/Alfresco/alfresco-js-api)
-   [Official GitHub Project - generator-ng2-alfresco-app](https://github.com/Alfresco/generator-ng2-alfresco-app)

Please refer to the [official documentation](http://docs.alfresco.com/) for further details and suggestions.

## Issues addressed

Below the list of JIRA issues, closed for this release.

### Documentation

TODO

### Feature

TODO

### Epic

TODO

### Story

TODO

### Bug

TODO

### Task

TODO

### Feature Documentation

TODO

### Feature Bug

TODO

### Feature (Task)

TODO

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
