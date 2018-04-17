---
Level: Beginner
---
# Using components

There are three different ways to use, extend and configure an ADF component: configuration properties, event listeners, content projection / HTML extensions. In this tutorial you are going to see a practical example for each approach. As an example, the Login component will be used.

The best option you should consider when you plan to use an ADF component and want to learn the details of its usage, is always to check the documentation for the component you are looking to use. More in general, there are three different ways to use, extend and configure an ADF component:
1. Configuration properties.
2. Event listeners.
3. Content projection / HTML extensions.

## Configuration properties
Angular components can easily be configured via properties in the HTML template. In this example we will act on the "Remember me" check and "Need Help?" + "Register" links in the footer of the Login component.

To prepare the task, be sure you have and ADF application up and running by executing `npm start` in a terminal, from the root folder of the project. Access to the login page using your browser and edit the `login.component.html` file stored into the `src/app/.../login` folder. The content of the `login.component.html` file should look like the following source code.

	<adf-login
	  copyrightText="&#169; 2017 - 2018 Alfresco Software, Inc. All rights reserved."
      providers="ECM"
	  ...
	  >
	</adf-login>
	
When reviewing the documentation you can see that the `<adf-login/>` component has a lot of different properties. As an example we will toggle `showRememberMe` and `showLoginActions` (all set to `true` by default). If not already specified, add both the properties both with the false value, suing the syntax described below in the example. If the properties are defined in the HTML template, toggle the value according to what you see in the source code (set them to `true` if they have the `false` value and viceversa).

	<adf-login
	  copyrightText="&#169; 2017 - 2018 Alfresco Software, Inc. All rights reserved."
      providers="ECM"
	  [showRememberMe]="..."
	  [showLoginActions]="..."
	  ...
	  >
	</adf-login>

Once saved the HTML template you will see the login page updated with a different layout accordingly with the property values.

**Notice:** The two new properties are specified with `[]` around them. There are three ways to configure a component.

1. `[property]=""` This will be an expression or property from the typescript controller. Use this for boolean expressions or variables.
2. `property=""` This will be passed in as raw text.
3. `[(property)]` This is called *banana in a box* and is used for two way binding.

## Event listeners

Now that you've successfully configured properties on the `<adf-login/>` component, it's time to look at the events.

As we did for the previous task, looking at the [Login component documentation](https://alfresco.github.io/adf-component-catalog/components/LoginComponent.html) we can see that it emits three events `success`, `error` and `executeSubmit`.

We can subscribe to these events and have our custom code executed once these events are emitted. Let's hook into the `executeSubmit` and do a simple `alert()` once the form is submitted.

Continue to edit the  `login.component.html` file and add `(success)="mySuccessMethod($event)"` to the `<adf-login/>` component (the position is not relevant).

	<adf-login
	  ...
	  (executeSubmit)="myExecuteSubmitMethod($event)"
	  >
	</adf-login>

Next you need to implement `myExecuteSubmitMethod` in the typescript class implementing the component. Edit the  `login.component.ts` file stored in the same `src/app/.../login` folder and add the implementation of `myExecuteSubmitMethod` as follows.

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

Save both the files and the login component will be refreshed in your browser. Enter random values for username and password and you should see the alert after pressing the submit button. Looking in the console of the browser, you'll see the `event` data containing all the details of the form. 

**Bonus objective:** Add a custom logo and background to the login view.

## Content projection / HTML extensions
The last way a component can be configured or extended is through an approach called *Content projection*. This allows components to put placeholders in their template, allowing developers to "project" their own code or components into pre-defined locations within the component.

In regular HTML, elements can be nested, for example:

	<div>
	  <p>
	    <b>Here we have some bold text</b>
	  </p>
	</div>

We can use the same approach with ADF components to inject custom code or entire components into the ADF component. Going to the documentation you can find more details about which targets are in place. 

The `<adf-login/>` component supports two targets: `login-header` and `login-footer`.  Let's add a simple "Hello World" message in the footer. Edit the template `login.component.html` and add a new tag *inside* the `<adf-login/>` tag.

	<adf-login
	  ...
	  >
	    <login-footer>
	      <ng-template>
	        Hello World!
	      </ng-template>
	    </login-footer>
	</adf-login>

Watch carefully that you place the `<login-footer/>` tag *inside* the `<adf-login/>` tag. Inside the `<login-footer/>` or `<login-header/>` tags you can put anything you want, as long as you wrap it inside an `<ng-template/>` tag. You can also source in custom or 3rd party components.

Once done, save the template and you should see a "Hello World!" message in the footer of your login page through your browser.
