# Introduction to the Alfresco Application Development Framework

The Alfresco application development framework is based on the [Angular framework](https://angular.io/).
The framework is provided by Alfresco to make it easy to build custom web applications that 
should manage and view content in the [Alfresco Platform Repository](http://docs.alfresco.com/5.1/concepts/content-repo-about.html) in a custom way.

As you probably know, there is a general user interface called [Alfresco Share](http://docs.alfresco.com/5.1/concepts/gs-intro.html) available out-of-the-box. 
Share is usually used as a quick way of getting started with content management with Alfresco. It gives you access to pretty much all
the features provided by the Alfresco ECM system. And a lot of customers customize it for their specific domain.

However, there are use-cases that Share does not fit very well, such as:

- Feature-based clients, exposing functionality to perform a specific task(s)
- Role-based clients, exposing functionality based on role 
- Clients where the UI layout and style differs significantly from the Share layout and styling
- [Mashup clients](http://whatis.techtarget.com/definition/mash-up)

This is where this application development framework comes into play, it can be used to create exactly the user interface 
(i.e. web client) that the requirements demand.  
 
The framework consists of several libraries that can be used to form a customized content management application. The available libraries are:

- [Core](lib/core/README.md)
- [Content Services](lib/content-services/README.md)
- [Process Services](lib/process-services/README.md)
- [Insights](lib/insights/README.md)


You can browse all the components at the
[ADF Component Catalog](https://alfresco.github.io/adf-component-catalog/).

An architecture overview looks like this:

<p align="center">
  <img title="alfresco-angular-components-architecture" alt='alfresco' src='assets/alfresco-app-dev-framework-architecture.png'></img>
</p>

Here we can also see that there is an Alfresco JavaScript framework in use that wraps the Alfresco REST API, to make things easier for the client developer.


