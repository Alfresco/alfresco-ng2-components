---
Level: Intermediate
---
# Customising the Login component

In this tutorial you will learn how to customise the [`Login` component](https://alfresco.github.io/adf-component-catalog/components/LoginComponent.html) assuming that you read the [technical documentation](https://alfresco.github.io/adf-component-catalog/components/LoginComponent.html). In this tutorial we are going to describe a very simple task, considering that the technical documentation is  complete and it is presented in form of examples and tutorial.

## Locating the component into your application

Starting from an existing ADF application, the `Login` component, like any other component, is stored in a subfolder of the `app` folder: in [Alfresco Content App](https://github.com/Alfresco/alfresco-content-app) it is stored into the `/src/app/components/login` path, in an ADF app created with [Yeoman](http://yeoman.io/) it is stored into the `/src/app/login` path.

As an example, locate the `Login` component for your application and proceed to customise it as described below. 

## Changing the header

As every regular [Angular Component](https://angular.io/guide/architecture-components), the `Login` component can be customised through the CSS, HTML and Typescript. In this simple example we are going to customise the header (as described also into the [technical documentation](https://alfresco.github.io/adf-component-catalog/components/LoginComponent.html)).

To complete the task, edit the login.component.html file and change the content accordingly to the following source code.

    <adf-login ...>
	    <login-header><ng-template>My custom HTML for the header</ng-template></login-header>
	</adf-login>

After saving the file, the login form will look like the following picture.

![login_header](../docassets/images/login_header.png)

## More examples

As introduced above in this tutorial, this is a very basic example and the `Login` component can be customised many more than this. For a complete and detailed description, full of examples, check the [technical documentation about the component](https://alfresco.github.io/adf-component-catalog/components/LoginComponent.html) that contains everything you might want to know about the customisation of the `Login` component

