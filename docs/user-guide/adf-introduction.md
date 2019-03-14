---
Title: Introduction to ADF
Added: 2019-03-13
---

# Introduction to the Application Development Framework (ADF)

Alfresco's Application Development Framework (ADF) lets you add your own custom front end to the existing Alfresco services.

ADF is a set of custom [TypeScript](https://www.typescriptlang.org/) classes based on
the [Angular](https://angular.io/) web application framework. The most important classes
are the **components** that implement interactive UI features. 
The components and other classes access information from Alfresco's main backend products,
[Content Services](https://www.alfresco.com/platform/content-services-ecm) and
[Process Services](https://www.alfresco.com/platform/process-services-bpm).
You can combine these classes to produce your own custom web app with the exact styling,
branding, and features that you need. Some examples of where this can be useful are:

-   **Feature based apps** with functionality based around tasks that arise frequently
    in your business.
-   **Role based apps** where specific types of user have their own feature set, tailor-made
    for their role in the business.
-   [**Mashups**](https://whatis.techtarget.com/definition/mash-up) where Alfresco services
    are integrated with services from other suppliers in the same app.

## Getting started with ADF

You can find full instructions for installing ADF and its prerequisites in our
tutorial
[_Creating your first ADF application_](../tutorials/creating-your-first-adf-application.md).
When you have the environment and the scaffold app set up, the other
[tutorials](../tutorials/README.md) then explain how to connect to the backend services
and add custom features to your app. Use the [component reference](../README.md) pages
to learn [about component](../core/components/about.component.md) features and the [user guide](../user-guide/README.md)
to learn about specific tasks and topics in depth.
