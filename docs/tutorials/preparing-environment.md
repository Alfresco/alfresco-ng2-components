---
Title: Preparing the development environment
Level: Beginner
---

# Preparing the development environment

Here you will find the prerequisites for all the tutorials and descriptions of the entire documentation.

This document contains the development environment description, along with the details of the suggested versions for each tool, library and module.

## Node.js

[Node.js](https://nodejs.org) is a JavaScript runtime built using an event-driven, non-blocking I/O model that makes it lightweight and efficient. [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md).js uses [npm](https://www.npmjs.com/) as a public registry and package system.

We suggested to use the current long term support version of `node.js` check the LTS version [here](https://nodejs.org/).

To check your running version, run the following command in a terminal. 

```sh
    node -v
````

## Angular CLI

[Angular CLI](https://cli.angular.io/) is a tool to initialize, develop, scaffold and maintain [Angular](https://angular.io/) applications

Version 1.6.6 seems to be the most stable version currently. Earlier and later versions have issues regarding `@angular/devkit-core`.

If you already have `Angular CLI` installed check the version by running:

```sh
    ng --version
```

To globally install `Angular CLI` version globally 1.6.6 run:

    sudo npm install -g @angular/cli@1.6.6

## Code Editor

We recommend [Visual Studio Code](http://code.visualstudio.com) - it's a free, lightweight and _very_ powerful tool from Microsoft that works well for Angular development.

## Alfresco Content Services (optional)

If you want to develop on top of the [Alfresco Content Services](https://www.alfresco.com/platform/content-services-ecm), you might want to install it using the [Alfresco Content Services Community Deployment](https://github.com/Alfresco/acs-community-deployment.git) project on GitHub.

We suggest to follow the instructions related to the Docker deployment, considering that you are working on a development environment.

Please note that you might want to deploy and use Alfresco Content Services Enterprise Edition instead. In this case you can use the [Alfresco Content Services Deployment](https://github.com/Alfresco/acs-deployment.git) project on GitHub.

## Alfresco Process Services (optional)

If you want to develop on top of the [Alfresco Process Services](https://www.alfresco.com/platform/process-services-bpm), you might want to install it as described in the [official documentation](https://docs.alfresco.com/process-services1.8/topics/installing_process_services.html).

Please note that ADF applications are compatible with [Alfresco Process Services powered by Activiti](https://www.alfresco.com/platform/process-services-bpm) and not with [Activiti](https://www.activiti.org/) yet.

## ADF Yeoman generator (optional)

You can check if you have `Yeoman` installed by running `yo --version`. If this is not in your system then you can install it by running:

    sudo npm install -g yo

(The `sudo` command is not required on Windows but you may need to ensure you are running a command
prompt with Administrator privileges).

Install the latest version of the `generator-alfresco-adf-app` using the following command.

    sudo npm install -g generator-alfresco-adf-app

If you have an earlier version of the generator installed then it usually a good idea to uninstall it before reinstalling the latest version. This is especially true if you installed the generator packages before ADF 2.0 because the packages were renamed for this version.

Uninstall previous versions with:

    sudo npm uninstall generator-alfresco-adf-app

...for versions after ADF 2.0 and:

    sudo npm uninstall generator-ng2-alfresco-app

...for versions before ADF 2.0.	

## Alfresco Example Content Application (optional)

In some tutorials you might be required to use the [Alfresco Example Content Application](https://github.com/Alfresco/alfresco-content-app) available in a public repository on GitHub named [`alfresco-content-app`](https://github.com/Alfresco/alfresco-content-app). The Alfresco Example Content Application is an example application that is used as a starting point for development.

The Alfresco Example Content Application requires an instance of Alfresco Content Services up and running, to work properly. If you don't have it already, follow the instructions above in the `Alfresco Content Services (optional)` paragraph.

To make the Alfresco Example Content Application work in your development environment, clone the [`alfresco-content-app` GitHub repository](https://github.com/Alfresco/alfresco-content-app) using the following command in a terminal.

    git clone https://github.com/Alfresco/alfresco-content-app

Once completed, edit the `proxy.conf.js` file into the root of the project and change the `target` property according to the Alfresco Content Services instance. Below is the setup if you are using the [Alfresco Content Services Community Deployment](https://github.com/Alfresco/acs-community-deployment.git) project on GitHub.

    module.exports = {
        "/alfresco": {
            "target": "http://0.0.0.0:8082",
            ...
        }
    };

Once done, open a terminal and move into the `alfresco-content-app` folder and run `npm install`. Then run `npm start` and the application will be served on port `4200`, at the url `http://localhost:4200`.
