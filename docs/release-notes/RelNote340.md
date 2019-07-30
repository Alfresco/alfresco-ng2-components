
---
Title: Release notes v3.4.0
---

# Alfresco Application Development Framework (ADF) version 3.4.0 Release Note

These release notes provide information about the **3.4.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.4.0).

See the [ADF roadmap](../roadmap.md) for details of features planned for future
versions of ADF. 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [Form visibility](#form-field-visibility)
    -   [User preferences](#user-preferences)
    -   [Forms in standalone tasks](#forms-in-standalone-tasks)
    -   [Angular Material upgrade](#angular-material-upgrade)
-   [Localisation](#localisation)
-   [References](#references)
-   [Issues addressed](#issues-addressed)

## New package versions

    "@alfresco/adf-content-services" : "3.4.0"
    "@alfresco/adf-process-services" : "3.4.0"
    "@alfresco/adf-core" : "3.4.0"
    "@alfresco/adf-insights" : "3.4.0",
    "@alfresco/adf-extensions": "3.4.0"

## Goals for this release

This is the fourth minor release since of ADF since February 2019 when version 3 was released.

This release continues to provide additional support for [Activiti 7](https://www.activiti.org/), the next generation Cloud Native implementation of Activiti.

The functionality and enhancements of this release are focused on forms. Form field visibility has been improved, form validation has been implemented and it is now possible to use form variables. Multilingual support for forms has been enhanced and dropdown menus reading from a REST source have been updated. From an end-user perspective, a process can now be started using a form when the start event contains a valid form. 

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

The following are the most important features of this release:

-   [Form visibility](#form-field-visibility)
-   [User preferences](#user-preferences)
-   [Forms in standalone tasks](#forms-in-standalone-tasks)
-   [Angular Material upgrade](#angular-material-upgrade)

### Form field visibility

Since the lastest version of the Modelling Application, the visibility conditions on form fields has been improved to be more complete and possibly complex. In this ADF release the components support this new set of capabilities.

### User preferences

[Edit Process Filter Cloud component](https://www.alfresco.com/abn/adf/docs/process-services-cloud/components/edit-process-filter-cloud.component/) and [Edit Task Filter Cloud component](https://www.alfresco.com/abn/adf/docs/process-services-cloud/components/edit-task-filter-cloud.component/) have been introduced in the previous versions of ADF to support the custom filters available to the end-users. The limitation of the previous implementation was that the filters where available only until the valid session expired.

In the current implementation, a server side User Preference Service is used to store that information, so that the filters are available beyond the current session and can be used cross-devices and cross-sessions.

Considering that the User Preference Service is not available in Activiti Cloud, this enhancement cannot be claimed for the Community Edition.

### Forms in standalone tasks

Since this ADF version, forms can be used also on standalone tasks on Activiti BPMN Engine. To be able to use a form in a standalone task, the modeler needs to explicitly allow this usage during its definition.

In the image below you can see how the form defintion looks like, with the new toggle allowing it to be used in standalone tasks. 

### Angular Material upgrade

At the moment, the latest available version for @angular/material is 8.0.1, but to avoid any breaking change this version of ADF has been updated to @angular/material version 7.3.7, in order to have access to the latest fixes and features.

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
