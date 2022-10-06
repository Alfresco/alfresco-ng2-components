---
Title: Creating an Alfresco JavaScript app
Level: Basic
---

# Creating your Alfresco JavaScript application

In this tutorial you will learn how to create an application in JavaScript from scratch to interact with Alfresco.

This is a "getting started" task that should enable you to start developing your own JavaScript application on top of Alfresco Content Services or Alfresco Process Services.

The tutorial uses Alfresco Content Services for demonstration purposes, but development on
top of Alfresco Process Services follows exactly the same principles.

**Note:** You can develop for Alfresco Content Services AND Alfresco Process Services together but
with the only limitations introduced by
[CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). If you want to develop for both
services then you might need to proxy your application first.

## Prerequisites

The only prerequisite of this tutorial is that an instance of Alfresco Content Services in a [Docker](https://www.docker.com/) container should be available. Docker is not the only option for deployment,
but its simplicity allows us to focus more on the development of the environment setup.

You will need the `npm` client to download the requested [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) libraries.

## Creating the JavaScript application

Assuming that you have your Alfresco Content Services instance up and running at `http://localhost:8082/alfresco`, let's see here how to develop a JavaScript application from scratch.
The JavaScript application will be able to interact with Alfresco back-end services using the
[`alfresco-js-api`](https://github.com/Alfresco/alfresco-js-api) library. This library does not
necessarily have to be used with Angular applications since it is "framework agnostic".

Before starting the development of the source code, create a local folder called `my-js-app`
that will contain the entire JavaScript application.

### Creating the `index.html` file

Inside the `my-js-app` folder, create the `index.html` file with the following content:

```html
<html>

    <head>
        <script src="node_modules/alfresco-js-api/dist/alfresco-js-api.js"></script>
        <script >

            this.alfrescoJsApi = new AlfrescoApi({ provider:'ECM', hostEcm: 'http://localhost:8082' });

            this.alfrescoJsApi.login('admin', 'admin').then(function (data) {
                alert('API called successfully to login into Alfresco Content Services.');
            }, function (error) {
                console.error(error);
            });

        </script>
    </head>

    <body>
        <h1>Hello World!</h1>
    </body>

</html>
```

As you can see, the content describes a very simple and basic HTML + JavaScript page, containing the source code to log into Alfresco Content Services at the URL `http://localhost:8082/alfresco`.

All the magic happens because of the inclusion (and use) of the `alfresco-js-api.js` library.

### Adding the `alfresco-js-api` library

To install the `alfresco-js-api.js` library: open a terminal, move into the `my-js-app` folder and run the following command.

    npm install --save alfresco-js-api

Once launched, the command downloads the numerous files of the library into the `node_modules` folder.

**Note:** `npm` will create a `package-lock.json` file into the root folder of your project during
execution. This file won't be used and you can safely ignore it.

Believe it or not, this is all you need to develop a (very basic) JavaScript application on top of Alfresco Content Services.

## Deploying the application

Now that the JavaScript application is created, the next step is to deploy it to the HTTP Server for
use. To avoid the [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) issue, for the purpose of this tutorial, the app will be deployed into the same instance of
[Apache Tomcat](http://tomcat.apache.org/) used by Alfresco Content Services. This setup is not ideal
for production use but it is the fastest way we could find to show the results for the tutorial.

To deploy the  `my-js-app` application into the Alfresco Content Services Docker container, open a terminal and launch the following commands from inside the `my-js-app` folder:

    // List the active containers into your environment.
    docker container ls

    // Copy the CONTAINER_ID of the image with name 'alfresco/alfresco-content-repository-community:...'.

    // Open a shell into the container.
    docker exec -i -t <CONTAINER_ID> /bin/bash

    // Create the 'my-js-app' folder into the Tomcat's webapps folder.
    mkdir webapps/my-js-app

    // Back to the host's shell.
    exit

    // Copy the 'my-js-app' folder into the Tomcat's webapps folder.
    docker cp ../my-js-app <CONTAINER_ID>:/usr/local/tomcat/webapps

This is all you need to deploy the JavaScript application into the same Tomcat instance as
Alfresco Content Services.

## The JavaScript application in action

To see the JavaScript application in action, open a browser at `http://localhost:8082/my-js-app`.
You should see something like the following screenshot:

![javascript_app_launch](../docassets/images/javascript_app_launch.png)

Of course this is a very basic example to show how to develop a JavaScript application
(not necessarily an Angular application) interacting with Alfresco Back-end Services using
the [`alfresco-js-api`](https://github.com/Alfresco/alfresco-js-api) library.
