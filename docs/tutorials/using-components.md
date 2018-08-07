---
Level: Beginner
---

# Using components

There are three different ways to use, extend and configure an ADF component: configuration properties, event listeners, and content projection / HTML extensions. In this tutorial you will see a practical example of each approach using the [Login component](../core/login.component.md).

The ADF documentation is always a good starting point when you plan to use a component. In general,
there are three different ways to use, extend and configure an ADF component:

1.  Configuration properties.
2.  Event listeners.
3.  Content projection / HTML extensions.

## Configuration properties

Angular components can easily be configured via properties in the HTML template. In this example we will
work with the "Remember me" checkbox and "Need Help?" and "Register" links in the footer of the [Login component](../core/login.component.md).

To prepare for the task, make sure you have your ADF application up and running by executing `npm start`
in a terminal from the root folder of the project. Access the login page using your browser and edit the [`login.component`](../core/login.component.md)`.html` file stored in the `src/app/.../login` folder. The content of the [`login.component`](../core/login.component.md)`.html` file should look like the following:

```html
<adf-login
	copyrightText="&#169; 2017 - 2018 Alfresco Software, Inc. All rights reserved."
		providers="ECM"
	...
	>
</adf-login>
```

Looking at the documentation, you can see that the `<adf-login/>` component has a lot of different
properties. As an example we will toggle `showRememberMe` and `showLoginActions` (all set to `true`
by default). If you haven't specified any values for these properties in the source code then set them both
to `false` using the syntax shown in the example below. If you have specified values in the source code then
set them to the opposite value in the HTML template (set them to `true` if they are `false` in the source
and vice versa).

```html
<adf-login
	copyrightText="&#169; 2017 - 2018 Alfresco Software, Inc. All rights reserved."
		providers="ECM"
	[showRememberMe]="..."
	[showLoginActions]="..."
	...
	>
</adf-login>
```

After saving the HTML template, you will see the login page updated with a different layout matching the
new property values.

**Note:** The two new properties are specified with `[]` around them. There are three ways to configure a
property:

1.  `[property]=""` This sets the property using an expression or another property from the Typescript
    controller. Use this syntax for boolean expressions or variables.
2.  `property=""` This value will be passed as raw text.
3.  `[(property)]` This is called _banana in a box_ and is used for two way binding.

## Event listeners

Now that you've successfully configured properties on the `<adf-login/>` component, it's time to look at events.

Looking now at the events section of the 
[Login component documentation](https://alfresco.github.io/adf-component-catalog/components/LoginComponent.html)
we can see that it emits three events: `success`, `error` and `executeSubmit`.

We can subscribe to these events and have our custom code executed when they are emitted. We will
hook into the `executeSubmit` event and show a simple `alert()` when the form is submitted.

Back in the [`login.component`](../core/login.component.md)`.html` file,  add `(success)="mySuccessMethod($event)"` to the `<adf-login/>` component (the position is not relevant).

```html
<adf-login
	...
	(executeSubmit)="myExecuteSubmitMethod($event)"
	>
</adf-login>
```

Next, implement `myExecuteSubmitMethod` in the Typescript class that defines the component. Edit
the [`login.component`](../core/login.component.md)`.ts` file stored in the same `src/app/.../login` folder and add the implementation
of `myExecuteSubmitMethod` as follows:

```ts
@Component({
	...
})
export class LoginComponent {

	...

	// Add this!
	myExecuteSubmitMethod(event: any) {
		alert('Form was submitted!');
		console.log(event);
	}
}
```

After saving both files, the [login component](../core/login.component.md) will be refreshed in your browser. Enter random values for
the username and password and you should see the alert after pressing the submit button. Looking in the
console of the browser, you'll see the `event` data containing all the details of the form. 

**Bonus objective:** Add a custom logo and background to the login view using the relevant properties
described in the documentation.

## Content projection / HTML extensions

The final way to configure or extend a component is through an approach called _Content projection_. This
involves adding placeholders to a component template, allowing developers to "project" their own code or
components into pre-defined locations within the component.

In regular HTML, elements can be nested. For example:

```html
<div>
 <p>
  <b>Here we have some bold text</b>
 </p>
</div>
```

We can use the same approach with ADF components to inject custom code or entire components into another
component. The documentation shows which targets are available. For example, the `<adf-login/>` component
supports two targets: `login-header` and `login-footer`. Let's add a simple "Hello World" message in the
footer. Edit the template [`login.component`](../core/login.component.md)`.html` and add a new tag _inside_ the `<adf-login/>` tag:

```html
<adf-login
 ...
 >
  <login-footer>
   <ng-template>
    Hello World!
   </ng-template>
  </login-footer>
</adf-login>
```

Make sure that you place the `<login-footer/>` tag _inside_ the `<adf-login/>` tag. Inside the
`<login-footer/>` or `<login-header/>` tags you can put anything you want, as long as you wrap it inside
an `<ng-template/>` tag. You can also add custom or 3rd party components.

When you are done, save the template and you should see a "Hello World!" message in the footer of your
login page when the browser refreshes.
