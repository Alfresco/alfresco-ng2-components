---
Title: Release notes v4.0.0
---

# Alfresco Application Development Framework (ADF) version 4.0.0 Release Note

These release notes provide information about the **4.0.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/4.0.0).

You can contact Francesco Corti (francesco.corti at alfresco.com) for details of features planned for future versions of ADF. 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Angular 10](#angular-10)
    -   [Ordering across pages in document list](#ordering-across-pages-in-document-list)
    -   [Property constraint support for ACS 7](#property-constraint-support-for-acs-7)
-   [Localisation](#localisation)
-   [References](#references)
-   [PR merged](#pr-merged)

## New package versions

    "@alfresco/adf-content-services" : "4.0.0"
    "@alfresco/adf-process-services" : "4.0.0"
    "@alfresco/adf-core" : "4.0.0"
    "@alfresco/adf-insights" : "4.0.0",
    "@alfresco/adf-extensions": "4.0.0"
    "@alfresco/adf-testing": "4.0.0"
    "@alfresco/adf-cli": "4.0.0"

## Goals for this release

This is a major release of the Alfresco Application Development Framework developed to receive the latest and greatest benefits of the most recent version of the [Angular framework (v10)](https://blog.angular.io/version-10-of-angular-now-available-78960babd41).

The highlights of this release include the mentioned [Angular version 10 support](https://issues.alfresco.com/jira/browse/ADF-5139), ... and last but not least, the [property constraint support](https://issues.alfresco.com/jira/browse/ADF-3484) available for ACS v7 ahead.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

### Angular 10

As you probably know, ADF 3 relies on Angular 7 that has already finished its official support. Because of this, to follow the commitment to keep ADF aligned with the most recent version of Angular, here it is the "upgrade" to its version 10, recently released.

For further details on the Angular 10 release, [here](https://blog.angular.io/version-10-of-angular-now-available-78960babd41) you can find an Angular blog post describing it.

### Ordering across pages in document list

Since ADF 3.9.0, the user experience of the navigation of the repository has been enhanced allowing the filtering of the content (see [ACA-3206](https://issues.alfresco.com/jira/browse/ACA-3206) for further details). In this release of ADF, the user experience can benefit of an enhanced ordering ([ACA-3205](https://issues.alfresco.com/jira/browse/ACA-3205)) that is now "cross-pages". in case of a multi-page view on content.

### Property constraint support for ACS 7

Starting from ACS 7 (Community Edition and the future Enterprise Edition) the enhanced REST API allows the property contratint support on ADF side. As part of this enhancement, ADF and all the ADF based applications, will benefit of the support of: [list of values](https://issues.alfresco.com/jira/browse/ADF-3484), [min/max length constraints](https://issues.alfresco.com/jira/browse/ADF-5145), [min/max value constraints](https://issues.alfresco.com/jira/browse/ADF-5145) and [regular expression constraints](https://issues.alfresco.com/jira/browse/ADF-5125).

In addition to this, [the search option in list of values](https://issues.alfresco.com/jira/browse/ADF-5128) has been added, to provide a better way to comsume long lists and filter the items.

## Localisation

This release includes: Arabic, Brazilian Portuguese, Czech, Danish, Dutch, Finnish, French, German, Italian, Japanese, Norwegian (Bokmål), Polish, Russian, Simplified Chinese, Spanish and Swedish versions.

## References

The following is a brief list of references to help you get started with the new release:

-   [Getting started guides with Alfresco Application Development Framework](https://community.alfresco.com/community/application-development-framework/pages/get-started)
-   [Alfresco ADF Documentation on the Builder Network](../README.md)
-   [Gitter chat supporting Alfresco ADF](https://gitter.im/Alfresco/alfresco-ng2-components)
-   [ADF examples on GitHub](https://github.com/Alfresco/adf-examples)
-   [Official GitHub Project - alfresco-ng2-components](https://github.com/Alfresco/alfresco-ng2-components)
-   [Official GitHub Project - alfresco-js-api](https://github.com/Alfresco/alfresco-js-api)
-   [Official GitHub Project - generator-ng2-alfresco-app](https://github.com/Alfresco/generator-ng2-alfresco-app)

Please refer to the [official documentation](http://docs.alfresco.com/) for further details and suggestions.

## PR merged 
                        
TODO

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
