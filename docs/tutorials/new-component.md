---
Title: Adding a new component
Level: Basic
---

# Adding a new component

In this tutorial, you will learn how to create a component using [Angular CLI](https://cli.angular.io/) within an existing application.

By definition, a _component_ controls a patch of screen called a _view_. For example, individual components define and control menus, tabs, forms, buttons and every simple or complex portion of an application's layout. 

## Creating a component

Starting from the root of your project, run the following command in a terminal:

    ng generate component my-first-component

If you are adding the component to an application with more than one module, you might want to specify it using the `--module` parameter. For example use `--module app` to add the new component to the root app of your application.

## Using the component

Once the component is created, you can use the element

```html
<app-my-first-component></app-my-first-component>
```

anywhere within the HTML file of another component to render the content of `my-first-component`.

As an example, add `<app-my-first-component></app-my-first-component>` at the top of the
[`app.component`](../../demo-shell/src/app/app.component.ts)`.html` file in the `src` folder, and run the application again. In the browser you will
shortly see the text "my-first-component works!", as a placeholder to show where the component is
rendered in the layout.

## Anatomy of the component

By default the new component is created in the `src/app` path and everything is stored in a folder with the
same name as the component itself. Here, you should find a folder named `my-first-component` has been added
to `src/app`, with the following contents:

-   `my-first-component.component.scss` containing the CSS used by the component, initially empty.
-   `my-first-component.component.html` containing the HTML used to render the component. This file is
    created with a very basic placeholder message that displays the name of the component within a `p` tag.
-   `my-first-component.component.spec.ts` containing the unit tests for the component.
-   `my-first-component.component.ts` containing the `MyFirstComponentComponent` class that implements the
    business logic in typescript.

You must declare or import the component in one or more modules in order to use it. In this example the
`app.module.ts` file stored in `src/app` contains the following code:

```ts
import { MyFirstComponentComponent } from './my-first-component/my-first-component.component';

@NgModule({
    declarations: [
        ...
        MyFirstComponentComponent
    ],
```

These is the most basic information you need to know about your component. Everything mentioned here is
standard Angular code without anything specific to ADF applications.
