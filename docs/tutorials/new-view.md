---
Level: Beginner
---
# Adding a new component

By definition a *component* controls a patch of screen called a view. As an example, individual components define and control menus, tabs, forms, buttons and every simple or complex portion of layout of an application. In this tutorial you will learn how to create a component using [Angular CLI](https://cli.angular.io/). After the creation you will learn how to add it to an existing application.

## Creating a component
Starting from the root of your project, run the following command into a terminal.

    ng generate component my-first-component

If you are adding the component to an application with more than one module, you might want to specify it using the `--module` parameter. For example use `--module app` to add the new component to the root app of your application.

## Using the component
Once done, wherever you will use `<app-my-first-component></app-my-first-component>` into the HTML file of another component, you will see the content of the new component rendered exactly in that place.

As an example, add `<app-my-first-component></app-my-first-component>` on top of the `app.component.html` file stored into the `src` folder, and run the application again. Directly in the browser you will see `my-first-component works!`, that shows exactly the place where the component is rendered in the layout.

## Anatomy of the component
By default the new component is created into the `src/app` path and everything is stored in a folder named like the component itself. In this example a folder named with `my-first-component` is added to `src/app`, with inside the following content:

 - `my-first-component.component.scss` containing the CSS used by the component. This file is created as empty.
 - `my-first-component.component.html` containing the HTML used to render the component. This file is created with a very basic message rendering the name of the component included in a `p` tag.
 - `my-first-component.component.spec.ts` containing the unit tests for the component.
 - `my-first-component.component.ts` containing the `MyFirstComponentComponent` class implementing the business logic in typescript.

To make the component usable, one or more modules should declare it (or import it). In this example the `app.module.ts` file stored into the `src/app` folder contains the following code.

    import { MyFirstComponentComponent } from './my-first-component/my-first-component.component';

    @NgModule({
        declarations: [
	        ...
            MyFirstComponentComponent
        ],

These are the very basic information you should be know about your brand new component. All you have read here is standard Angular, not customised or valid for ADF applications only.
