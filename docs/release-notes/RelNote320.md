---
Title: Release notes v3.2.0
---

# Alfresco Application Development Framework (ADF) version 3.2.0 Release Note

These release notes provide information about the **3.2.0 release** of the Alfresco Application Development Framework.

This is the latest **General Available** release of the Application Development Framework, which contains the Angular components to build a Web Application on top of the Alfresco Platform.

The release can be found on GitHub at [this location](https://github.com/Alfresco/alfresco-ng2-components/releases/tag/3.2.0).

See the [ADF roadmap](../roadmap.md) for details of features planned for future
versions of ADF. 

## Contents

-   [New package versions](#new-package-versions)
-   [Goals for this release](#goals-for-this-release)
    -   [More on Activiti 7](#more-on-activiti-7)
    -   [Five more languages supported](#five-more-languages-supported)
    -   [Event handling during header row action](#event-handling-during-header-row-action)
    -	[List separator configuration in multi-value metadata](#list-separator-configuration-in-multi-value-metadata)
-   [Localisation](#localisation)
-   [References](#references)
-   [Issues addressed](#issues-addressed)
    -   [Documentation](#documentation)
    -   [Feature](#feature)
    -   [Bug](#bug)
    -   [Task](#task)
    -   [Feature (Task)](#feature-task)

## New package versions

    "@alfresco/adf-content-services" : "3.2.0"
    "@alfresco/adf-process-services" : "3.2.0"
    "@alfresco/adf-core" : "3.2.0"
    "@alfresco/adf-insights" : "3.2.0",
    "@alfresco/adf-extensions": "3.2.0"

## Goals for this release

This is the second minor release since ADF version 3 which was released in February 2019.

This release goes a step further in the direction of complete support for [Activiti 7](https://www.activiti.org/), the next generation Cloud Native implementation of Activiti. Also, some enhancements have been introduced to the Metadata viewer to properly manage multi-value properties, together with the event handling during header row action, to properly manage use cases like the drag & drop feature, requested from some developers.

We are pleased to announce that starting from ADF 3.2, five more languages are now supported, together with the other ten. The new languages are: Danish, Finnish, Swedish, Czech, Polish.

Please report issues with this release in the [issue tracker](https://github.com/Alfresco/alfresco-ng2-components/issues/new). You can collaborate on this release or share feedback by using the discussion tools on [Gitter](http://gitter.im/Alfresco/alfresco-ng2-components).

Below are the most important new features of this release:

-   [More on Activiti 7](#more-on-activiti-7)
-   [Five more languages supported](#five-more-languages-supported)
-   [Event handling during header row action](#event-handling-during-header-row-action)
-	[List separator configuration in multi-value metadata](#list-separator-configuration-in-multi-value-metadata)

### More on Activiti 7

In ADF 3.0.0 (released in February) we announced the introduction of the new `*Cloud` package. This contains a set of components to support [Activiti 7](https://www.activiti.org/), the next generation Cloud Native implementation of Activiti BPM Engine. With the ADF 3.2 release, the journey continues with more supported features, like:

===> Please complete the description here.

### Five more languages supported

Starting from ADF 3.2, five more languages are now supported, together with the other ten already in the list. The new languages supported are: Danish, Finnish, Swedish, Czech, Polish.

### Event handling during header row action

Following some suggestions from customers and partners, we enhanced the `Datatable` to be able to manage event handling during header row action. Two more events have been added: `header-drop` raised when data is dropped on the column header and `cell-drop` raised when data is dropped on the column cell.

For more details refer to the:
- [DataTable component](../core/components/datatable.component.md).

### List separator configuration in multi-value metadata

As of this version of ADF, developers can configure the list separator of multi-value properties into the metadata viewer. Since this version of ADF, to customize the separator you can set it in your `app.config.json` file inside your `content-metadata` configuration. Below an example.

```json
"content-metadata": {
    "presets": {
        ...
    },
    "multi-value-pipe-separator" : " - "
}
```

For more details refer to the:
- [Content Metadata Card component](../content-services/components/content-metadata-card.component.md) 

## Localisation

This release includes: French, German, Italian, Spanish, Arabic, Japanese, Dutch, Norwegian (Bokmål), Russian, Danish, Finnish, Swedish, Czech, Polish, Brazilian Portuguese and Simplified Chinese versions.

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

Below is the list of JIRA issues that were closed for this release.
                        
### Documentation

===> Please complete the description here.

### Feature

===> Please complete the description here.

### Epic

===> Please complete the description here.

### Story

===> Please complete the description here.
                     
### Bug

===> Please complete the description here.

### Task

===> Please complete the description here.

### Feature (Task)

===> Please complete the description here.

Please refer to the [Alfresco issue tracker](https://issues.alfresco.com/jira/projects/ADF/issues/ADF-581?filter=allopenissues) for other known issues in this release. If you have any questions about the release, please contact us using [Gitter](https://gitter.im/Alfresco/alfresco-ng2-components).

Thanks to the whole application team and the amazing Alfresco community for the hard work.
