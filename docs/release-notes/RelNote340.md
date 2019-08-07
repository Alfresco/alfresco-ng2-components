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
    -   [Preference service](#preference-service)
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

This is the fourth minor release of ADF since February 2019 when version 3.0.0 was released.

The highlights of this release include additional support for [Activiti 7](https://www.activiti.org/) and an Angular Material upgrade. 

Further enhancements have been made to forms in this release including improvements to form field visibility and the ability to attach forms to standalone tasks. End users can now also take advantage of the preference service to store custom filters for task and process lists and have them accessible between different sessions and devices. 

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

The following are the most important features of this release:

-   [Form visibility](#form-field-visibility)
-   [Preference service](#preference-service)
-   [Forms in standalone tasks](#forms-in-standalone-tasks)
-   [Angular Material upgrade](#angular-material-upgrade)

### Form field visibility

Visibility conditions form fields has been enhanced to cover additional use cases within the Modeling Application. In this release of ADF the relevant components have been updated to support this new set of capabilities.

### Preference service

The [edit process filter cloud component](https://www.alfresco.com/abn/adf/docs/process-services-cloud/components/edit-process-filter-cloud.component/) and [edit task filter cloud component](https://www.alfresco.com/abn/adf/docs/process-services-cloud/components/edit-task-filter-cloud.component/) were introduced in a previous release of ADF to support custom filters for end users. The limitation of the components was that the filters were stored in a user's local browser storage and only available until that session expired.

In this release a server side preference service now stores that information, so that task and process list filters can be stored on a user-by-user basis and be made available between sessions and devices.

**Note** This functionality is not available in the community edition, Activiti Cloud. Custom filters are still stored in the local browser storage for community implementations.

### Forms in standalone tasks

Forms can now be used in standalone tasks and not just those that form part of a user task within a process. To be able to use a form in a standalone task, the modeler needs to explicitly allow it during its design. 

The following is an example JSON excerpt of a form definition with the new boolean property `standAlone` which toggles whether the form is available to attach to standalone tasks:

```json
{
    "formRepresentation": {
        "id": "form-5601d74a-77b6-4fc5-88b3-3bdcd1e914cc",
        "name": "holiday-request-form",
        "description": "A form to request leave",
        "version": 2,
        "standAlone": true,
        "formDefinition": {
        ...
``` 

### Angular Material upgrade

The latest available version of @angular/material is 8.0.1. To avoid any breaking changes but still access the latest fixes and features this version of ADF has been updated to @angular/material version 7.3.7.

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
