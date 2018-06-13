# ADF Tutorials

Learn about ADF step-by-step with the tutorials listed below.
You may find it helpful to follow them in sequence because some of the
later tutorials build on knowledge introduced in the earlier ones.

The tutorials are graded as follows:

-   **Beginner:** Suitable for users with no previous knowledge of ADF.
-   **Intermediate:** For users who want to add to their knowledge of the basics.
-   **Advanced:** For experienced users who want to learn about features in depth.

## Tutorials

| Name | Level | Abstract |
| -- | -- | -- |
| [**Preparing the development environment**](preparing-environment.md) | Beginner | In this content is shared all the prerequisites valid for all the tutorials and descriptions of the entire documentation. This content contains the development environment description, along with the details of the suggested versions for each tools, library or module. |
| [**Creating your ADF application using Yeoman**](creating-the-app-using-yeoman.md) | Basic | In this tutorial you are going to see how to create an ADF application from scratch, using the [Yeoman scaffolding tool](http://yeoman.io/). This is a "getting started" task that should enable you to start developing your own ADF application. |
| [**Creating your Alfresco JavaScript application**](creating-javascript-app-using-alfresco-js-api.md) | Basic | In this tutorial you will learn how to create an application in JavaScript from scratch to
interact with Alfresco. This is a "getting started" task that should enable you to start
developing your own JavaScript application on top of Alfresco Content Services or Alfresco
Process Services. |
| [**Adding a new component**](new-component.md) | Basic | By definition, a _component_ controls a patch of screen called a _view_. For example, individual components define and control menus, tabs, forms, buttons and every simple or complex portion ofan application's layout. In this tutorial, you will learn how to create a component using [Angular CLI](https://cli.angular.io/) within an existing application. |
| [**Adding a new view**](new-view.md) | Beginner | Every application developed in Angular is a single page application where the concepts of _view_ and _routing_ play a key role in the user experience. Being a single page application, the navigation between the different layouts (called _views_) is enabled through the _routing_. In this tutorial you will learn how to create a new view in your application and how to access it using a defined endpoint. |
| [**Using components**](using-components.md) | Beginner | There are three different ways to use, extend and configure an ADF component: configuration properties, event listeners, and content projection / HTML extensions. In this tutorial you will see a practical example of each approach using the Login component. |
| [**Basic theming**](basic-theming.md) | Beginner | As introduced in the [user guide about theming](../user-guide/theming.md), the customisation of the [Cascading Style Sheets](https://en.wikipedia.org/wiki/Cascading_Style_Sheets) is something straightforward into an ADF application. In this tutorial you will see how to change it, using a step-by-step approach. The focus of this tutorial is [ADF apps built using Yeoman](./creating-the-app-using-yeoman.md), but you can re-use the same principles to customise the themes in all the ADF applications. |
| [**Customizing the Login component**](customising-login.md) | Intermediate | In this tutorial you will learn how to customize the [`Login` component](https://alfresco.github.io/adf-component-catalog/components/LoginComponent.html) following the [technical documentation](https://alfresco.github.io/adf-component-catalog/components/LoginComponent.html). The task will be very simple. See the documentation for further details about customizing this component, along with examples. |
| [**Working with a Data Table**](working-with-data-table.md) | Intermediate | In this tutorial you will learn how to populate a [`DataTable` component](https://alfresco.github.io/adf-component-catalog/components/DataTableComponent.html) with custom data from a generic back-end service or third party API. As an example we are going to use data from one of the available services on Alfresco Content Services. However, the procedure is much the same if want to use an Alfresco Process Services endpoint or a third party API. |
| [**Working with the Nodes API Service**](working-with-nodes-api-service.md) |  | In this tutorial you will learn how to use the [`NodesApiService`](https://github.com/Alfresco/alfresco-ng2-components/blob/master/lib/core/services/nodes-api.service.ts). We have developed some practical examples to show you how to interact with an instance of Alfresco Content Services without using the REST endpoints directly. With this approach the `NodesApiService` is used as an abstraction layer, defined by one of the services in the ADF Core
library. |
| [**Working with Nodes using the JS API**](working-with-nodes-js-api.md) |  | In this tutorial you will learn how to use the
[`AlfrescoCoreRestApi`](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-core-rest-api)
We have developed some practical examples to show you how to interact with an instance of
Alfresco Content Services, without using the REST endpoints directly. With this approach the `AlfrescoCoreRestApi` is used as an abstraction layer, defining one of the core services of the [`alfresco-api-js`](https://github.com/Alfresco/alfresco-js-api) library. |
| [**Content metadata component**](content-metadata-component.md) | Advanced | In this tutorial you will learn how to work with the [`ContentMetadataComponent`](https://alfresco.github.io/adf-component-catalog/components/ContentMetadataComponent.html), used to render the standard and custom metadata of a generic content (called _node_) stored into Alfresco Content Services. With the usual approach "learning by doing", you will see here some practical examples you might find useful in your uses cases. As a starting point, we are going to use and customise the [Alfresco Content App](https://github.com/Alfresco/alfresco-content-app). |
