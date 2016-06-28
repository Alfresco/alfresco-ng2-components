# Introduction to the Alfresco Application Development Framework

The Alfresco application development framework is based on the [Angular 2 JavaScript library](https://angular.io/).
The framework is provided by Alfresco to make it easy to build custom web applications that 
should manage and view content in the [Alfresco Platform Repository](http://docs.alfresco.com/5.1/concepts/content-repo-about.html) in a custom way.

As you probably know, there is a general user interface called [Alfresco Share](http://docs.alfresco.com/5.1/concepts/gs-intro.html) available out-of-the-box. 
This framework is to be used when the requirements for the content web client deviates from what is available in the standard general Alfresco Share webapp.  
 
The framework consists of a number of components that can be combined together to form a customized content management application.
Here is a list of some of the available web components:

- [Core library](ng2-components/ng2-alfresco-core/README.md)
- [DataTable](ng2-components/ng2-alfresco-datatable/README.md)
- [DocumentList](ng2-components/ng2-alfresco-documentlist/README.md)
- [Viewer](ng2-components/ng2-alfresco-viewer/README.md)
- [Login](ng2-components/ng2-alfresco-login/README.md)
- [Upload](ng2-components/ng2-alfresco-upload/README.md)

You can browse all the components at this [page](http://devproducts.alfresco.me/).

An architecture overview looks like this:

<p align="center">
  <img title="alfresco-dev-framework-architecture" alt='alfresco' src='assets/alfresco-app-dev-framework-architecture.png'></img>
</p>

Here we can also see that there is an Alfresco JavaScript framework in use that wraps the Alfresco REST API. To make things easier for the client developer.


