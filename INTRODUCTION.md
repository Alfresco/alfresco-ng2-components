# Introduction to the Alfresco Application Development Framework

The Alfresco Application Development Framework (ADF) is based on the [Angular framework](https://angular.io/).
ADF is provided by Alfresco to make it easy to build custom web applications to manage and view content in the [Alfresco Platform Repository](https://docs.alfresco.com/5.2/concepts/content-repo-about.html).

As you probably know, there is a general user interface called [Alfresco Share](https://docs.alfresco.com/5.2/concepts/gs-intro.html) available out-of-the-box. 
Share is usually used as a quick way of getting started with content management in Alfresco. It gives you access to pretty much all
the features provided by the ACS system and a lot of customers customize it for their specific domain.

However, there are use cases that Share does not fit very well, such as:

- Feature-based clients, exposing functionality to perform a specific task(s)
- Role-based clients, exposing functionality based on role 
- Clients where the UI layout and style differs significantly from the Share layout and styling
- [Mashup clients](http://whatis.techtarget.com/definition/mash-up)

This is where ADF comes into play. You can use it to create exactly the user interface 
(i.e. web client) that you require.  
 
The framework consists of several libraries that can be used to form a customized content management application. The available libraries are:

- [Core](lib/core/README.md)
- [Content Services](lib/content-services/README.md)
- [Process Services](lib/process-services/README.md)
- [Insights](lib/insights/README.md)


You can browse documentation for all the components at the
[ADF Component Catalog](https://alfresco.github.io/adf-component-catalog/).

An overview of the architecture is shown below:

<p align="center">
  <img title="alfresco-angular-components-architecture" alt='alfresco' src='assets/alfresco-app-dev-framework-architecture.png'></img>
</p>

Here we can also see that there is an Alfresco JavaScript framework in use that wraps the Alfresco REST API, to make things easier for the client developer.


