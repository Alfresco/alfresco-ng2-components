
---
Title: Release notes v3.9.0
---

# Alfresco Application Development Framework (ADF) version 3.9.0 Release Note

These release notes provide information about the **3.9.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.9.0).

You can contact Francesco Corti (francesco.corti at alfresco.com) for details of features planned for future versions of ADF. 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [DocumentList filtering](#documentlist-filtering)
    -   [ECM version directive](#ecm-version-directive)
    -   [SiteService to manage members and requests](#siteservice-to-manage-members-and-requests)
    -   [Updated JS Renditions API](#updated-js-renditions-api)
-   [Localisation](#localisation)
-   [References](#references)
-   [Issues addressed](#issues-addressed)

## New package versions

    "@alfresco/adf-content-services" : "3.9.0"
    "@alfresco/adf-process-services" : "3.9.0"
    "@alfresco/adf-core" : "3.9.0"
    "@alfresco/adf-insights" : "3.9.0",
    "@alfresco/adf-extensions": "3.9.0"
    "@alfresco/adf-testing": "3.9.0"
    "@alfresco/adf-cli": "3.9.0"

## Goals for this release

This is the seventh minor release of ADF since February 2019 when version 3.0.0 was released.

The highlights of this release include [DocumentList filtering](https://issues.alfresco.com/jira/browse/ADF-5108) for the benfit of the end user as well as technical improvements like the introduction of the ECM version directive, improvements of the SiteService and an updated JS Renditions API.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

### DocumentList filtering

This enhancement allows an end-user to filter the results in the document list, similarly to Excel/Google sheets (filter in the header), so that the view on the repository can be customized accordingly with her/his needs.

![](images/DocumentListFiltering.png)

Filter components can be disabled, customized or replaced with custom components. You can check [ACA-3206](https://issues.alfresco.com/jira/browse/ACA-3206) for further details.

### ECM version directive

To properly manage the compatibility of the ADF components with a specific range of backend services, it has been introduced a way to enable/disable features through an [Angular Directive](https://angular.io/guide/attribute-directives).

You can check [ADF-5158](https://issues.alfresco.com/jira/browse/ADF-5158) for further details.

### SiteService to manage members and requests

As part of the enhancements of the SiteService, the following capabilites are added.

 - Members(users/groups):
	 - Add member to site
	 - Remove member from site
	 - Update site role of member

 - Membership request:
	 - Get pending request for site
	 - Approve request
	 - Reject request

You can check [ADF-5154](https://issues.alfresco.com/jira/browse/ADF-5154) for further details.

### Updated JS Renditions API

Accordingly with [ADF-5144](https://issues.alfresco.com/jira/browse/ADF-5144), the JS renditions API has been extended to support the following endpoints and capabilities.

    GET /nodes/{nodeId}/versions/{versionId}/renditions - List renditions for a version
    POST /nodes/{nodeId}/versions/{versionId}/renditions - Create rendition for a version
    GET /nodes/{nodeId}/versions/{versionId}/renditions/{renditionId} - Get rendition information for a version
    GET /nodes/{nodeId}/versions/{versionId}/renditions/{renditionId}/content - Get rendition content for a version

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
                        
TODO

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
