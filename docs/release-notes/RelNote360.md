---
Title: Release notes v3.6.0
---

# Alfresco Application Development Framework (ADF) version 3.6.0 Release Note

These release notes provide information about the **3.6.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.6.0).

See the [ADF roadmap](../roadmap.md) for details of features planned for future
versions of ADF. 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Array type supported in data table columns](#array-type-supported-in-data-table-columns)
    -   [Testing the polyfill enablement](#testing-the-polyfill-enablement)
-   [Localisation](#localisation)
-   [References](#references)
-   [Issues addressed](#issues-addressed)

## New package versions

    "@alfresco/adf-content-services" : "3.6.0"
    "@alfresco/adf-process-services" : "3.6.0"
    "@alfresco/adf-core" : "3.6.0"
    "@alfresco/adf-insights" : "3.6.0",
    "@alfresco/adf-extensions": "3.6.0"

## Goals for this release

This is the sixth minor release of ADF since February 2019 when version 3.0.0 was released.

The highlights of this release include additional support for [Activiti 7](https://www.activiti.org/) and improved accessibility.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

### Array type supported in data table columns

Into the DataTable component you can now use arrays to define the key of a column.
Below an example of configuration.

{code:java}
    {
        "key": "variables[myText]",
        "type": "text",
        "title": "My Text",
        "cssClass": "desktop-only",
        "sortable": true
    } 
{code}

##Testing the polyfill enablement

The list of supported browsers for ADF is still valid and clear, but some developers would like to enable the polyfill to support older browser. Officially some "old browsers" are not supported, but more tests are done on this topic.

You can read further details [here](https://github.com/Alfresco/alfresco-ng2-components/blob/development/BROWSER-SUPPORT.md).

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

## Issues addressed

The following is the list of JIRA issues that were closed for this release:

TODO

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
