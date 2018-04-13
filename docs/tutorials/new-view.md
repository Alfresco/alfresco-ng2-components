---
Level: Beginner
---

# Adding a new view

Every application developed in Angular is a single page application where the concepts of *view* and *routing* play a key role in the user experience. Being a single page application, the navigation between the different layouts (called *views*) is enabled through the *routing*. In this tutorial you will learn how to create a new view into your application and how to have access to it using a defined endpoint.

## Creating a view

Into an Angular application, a view is implemented by a regular component. A view can use other views (so other components), but a view can be used to implement the full layout of your application. This is the reason why creating a view is the task than creating a component.

To create a view, run the following command into a terminal, starting from the root of your project.

    ng generate component my-first-view

See the [Adding a new component](new-component.md) tutorial for further details.

## Routing the view

An Angular application has one singleton instance of the `Router` service that is used to match the browser's URL with the corresponding component to display. The `Router` service must be configured in a typescript file (usually in the `imports` , in with a syntax similar to the
following source code.

```ts
    const appRoutes: Routes = [
      { path: 'path-in-the-app', component: ExistingComponent },
      { path: '**', component: PageNotFoundComponent }
    ];
    
    @NgModule({
      imports: [
        RouterModule.forRoot(
          appRoutes,
          { enableTracing: true } // <-- debugging purposes only.
        )
        // other imports here
      ],
      ...
    })
```

To add the new view to the routing, change the `appRoutes` constant as follows:

```ts
    const appRoutes: Routes = [
      { path: 'path-in-the-app', component: ExistingComponent },
      { path: 'my-first-view', component: MyFirstViewComponent }, // <-- Add this!
      { path: '**', component: PageNotFoundComponent }
    ];
```

And remember to import the component in the same file with the following syntax:

```ts
    import { MyFirstViewComponent } from './my-first-view/my-first-view.component';
```

Be aware that the `Router` service can be declared in a file that can be stored in different places in the application's structure. Usually the place where the `Router`  service is declared is closed to the file containing the root module.

## Testing the view

To render the new view through the application and check the user experience, restart the application and open a browser to the following URL.

    http://<ip_address>:<port>/my-first-view

The result should be a very simple page with the following content.

    my-first-view works!
