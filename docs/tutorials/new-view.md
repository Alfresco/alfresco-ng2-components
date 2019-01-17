---
Title: Adding a new view
Level: Beginner
---

# Adding a new view

In this tutorial you will learn how to create a new view in your application and how to access it using a defined endpoint.

Every application developed in Angular is a single page application where the concepts of *view* and *routing* play a key role in the user experience. Being a single page application, the navigation between the different layouts (called *views*) is enabled through the *routing*. 

## Creating a view

In an Angular application, a view is implemented by a regular component. A view can use other views
(ie, other components) but a view can also be used to implement the full layout of your application.
This is the reason why creating a view is not necessarily the same task as creating a component.

To create a view, run the following command in a terminal from the root of your project:

    ng generate component my-first-view

For further details about creating a component, refer to the tutorial [here](new-component.md).

## Routing the view

An Angular application has one singleton instance of the `Router` service that is used to match the browser's URL with the corresponding component to display. The `Router` service must be configured in a Typescript file with a syntax similar to the following source code.

```ts
import { Routes, RouterModule } from '@angular/router';

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

And remember to import the component in the same file with the following syntax.

```ts
import { MyFirstViewComponent } from './my-first-view/my-first-view.component';
```

Be aware that the `Router` service can be declared in a file that can be stored in different places in the application's structure. Usually, the `Router` service is declared in a location close to the file containing
the root module.

## Testing the view

To render the new view through the application and check the user experience, restart the application and open a browser at the following URL:

    http://<ip_address>:<port>/my-first-view

The result should be a very simple page with the following content.

    my-first-view works!

## View parameters (optional)

In most use cases, you will want to add parameters to the view's endpoint. To enable this, change the `appRoutes` constant as follows:

```ts
const appRoutes: Routes = [
  { path: 'path-in-the-app', component: ExistingComponent },
  { path: 'my-first-view/:name', component: MyFirstViewComponent }, // <-- Change this!
  { path: '**', component: PageNotFoundComponent }
];
```

Then open the Typescript controller for the `MyFirstViewComponent` stored in `src/app/my-first-view` (`my-first-view.component.ts`). You need to add a few things here:

1. We need to `import` and `inject` the router into the class.
2. Subscribe to the router parameters and fetch the value.
3. Unsubscribe to the router parameters.

While #3 isn't strictly required, it would eventually cause a memory leak in your application, so
please remember to unsubscribe!

Modify the typescript controller `my-first-view.component.ts` to look like this:

```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-first-view',
  templateUrl: './my-first-view.component.html',
  styleUrls: ['./my-first-view.component.scss']
})
export class MyFirstViewComponent implements OnInit {

  private params: any;
  name: String;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.params = this.route.params.subscribe(params => {
      this.name = params['name'];
    });
  }

  ngOnDestroy() {
    this.params.unsubscribe();
  }
}
```

Next open the template `my-first-view.component.html` in the same folder and add the greeting as in
the following source code.

```html
	<p>
	  Hello {{ name }}
	</p>
```

You can now navigate to `http://<ip_address>:<port>/my-first-view/sir` and see the nice message "Hello sir".

