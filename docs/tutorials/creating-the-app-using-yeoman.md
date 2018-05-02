---
Level: Basic
---

# Creating your ADF application using Yeoman

Learn how to create an ADF application from scratch, using the [Yeoman scaffolding tool](http://yeoman.io/). This task is recommended to get started before developing your ADF application.

## Prerequisites

Before proceeding, make sure you have set up the Yeoman generator as described in
[Preparing the development environment](./preparing-the-development-environment.html). You will need
the generator to complete this tutorial successfully.

## Creating the ADF application

Creating a new application is straightforward using the [Yeoman generator](http://yeoman.io/). Open a terminal and execute the following command.

    yo alfresco-adf-app

The generator will ask you a few questions as it runs, mainly the name of your app (in this example we
are going to use  "myApp") and which blueprint you want to use:

![yeoman_creation](../docassets/images/yeoman_creation.png)

The following blueprints are available:

- **Process Services:** This will generate an application for Alfresco Process Services. The main
components it contains are Login, App List, Task List, Form and Start Process.

- **Content Services:** This will generate an application for Alfresco Content Services. The main
components it contains are Login, Document List, and Viewer.

- **Process and Content Services:** This will generate an application for both Alfresco Process and
Content Services using a combination of the two blueprints above.

When you have made your selection, the generator will ask if you want to install dependencies right away.
Type "`Y`" and hit enter. This can take a minute or two depending on your internet connection. You might
see a few warnings at the end like this:

    npm notice created a lockfile as package-lock.json. You should commit this file.
    npm WARN @mat-datetimepicker/core@1.0.4 requires a peer of @angular/core@^5.2.3 but none is installed. You must install peer dependencies yourself.
    npm WARN @mat-datetimepicker/core@1.0.4 requires a peer of @angular/material@^5.2.4 but none is installed. You must install peer dependencies yourself.
    npm WARN @mat-datetimepicker/core@1.0.4 requires a peer of @angular/cdk@^5.2.4 but none is installed. You must install peer dependencies yourself.
    npm WARN @mat-datetimepicker/moment@1.0.4 requires a peer of @angular/material@^5.2.4 but none is installed. You must install peer dependencies yourself.
    npm WARN @mat-datetimepicker/moment@1.0.4 requires a peer of @angular/material-moment-adapter@^5.2.4 but none is installed. You must install peer dependencies yourself.
    npm WARN @angular/compiler-cli@5.2.10 requires a peer of @angular/compiler@5.2.10 but none is installed. You must install peer dependencies yourself.
    npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.1.3 (node_modules/fsevents):
    npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

These warnings are normal. Unfortunately they are not under the ADF team's control (they happen within the
Angular Flex Layout package that ADF depends on) but you can safely ignore them.

Once done, you will find a folder named  `myApp` containing the new ADF application ready for
development.

## Configuring the application

To configure the ADF application, you only need to point to the correct Alfresco Content Services and/or
Alfresco Process Services, depending on which blueprint you used to create the project.

To set up the back-end services correctly, `cd` into the directory of your app (`myApp`  in our case)
and open the `proxy.conf.json` file. This file will tell Angular Webpack to create a proxy for your backend
services (Content or Process services). Change the URLs and ports to reflect where these services are
currently running. Below is an example of how the `proxy.conf.json` file should look:

    {  
        "/alfresco": {
        "target": "http://localhost:8080",  // <-- Change this!
        "secure": false,
        "changeOrigin": true
    },
        "/activiti-app": {
        "target": "http://localhost:9999",  // <-- Change this!
        "secure": false,  
        "changeOrigin": true  
    }

## Using the application

Now that your ADF application is correctly configured, you can run it using the `npm start`  command from
a terminal (check that you are in the project folder `myApp` before doing this). The execution of the
command takes a couple of seconds, after which the browser will automatically open at
`http://localhost:4200/`.

As you can see from the user interface, the Alfresco ADF application is very basic to begin with. This is
exactly what we need for this example, because it emphasizes the basics rather than complex features that
will be covered in intermediate/expert tutorials to follow. Below is a screenshot of the home page:

![yeoman_start](../docassets/images/yeoman_start.png)

