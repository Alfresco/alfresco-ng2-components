---
Level: Beginner
---
## Preparing the development environment
In this content is shared all the prerequisites valid for all the tutorials and descriptions of the entire documentation. This content contains the development environment description, along with the details of the suggested versions for each tools, library or module.

## Node.js

[Node.js](https://nodejs.org) is a JavaScript runtime built using an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js uses [npm](https://www.npmjs.com/) as public registry and a package system.

You need the latest `node.js` of either the `8.x` or `9.x` branch.
To check the version, run the following command in a terminal. 

	node -v

## Angular CLI

The [Angular CLI](https://cli.angular.io/) is a tool to initialise, develop, scaffold and maintain [Angular](https://angular.io/) applications

Earlier and later versions have issues around `@angular/devkit-core`. 1.6.6 seem to be the stable choice currently.

If you already have `Angular CLI` installed check the version by running:

	ng --version

To globally install `Angular CLI` version globally 1.6.6 run:

	sudo npm install -g @angular/cli@1.6.6

## Code Editor

We recommend [Visual Studio Code](http://code.visualstudio.com) - it's a free, lightweight and *very* powerful tool from Microsoft that works great with Angular development.

## Alfresco Content Services (optional)

If you want to develop on top of the [Alfresco Content Services](https://www.alfresco.com/platform/content-services-ecm), you might want to install it using the [Alfresco Content Services Community Deployment](https://github.com/Alfresco/acs-community-deployment.git) project on GitHub.

We suggest to follow the instructions related to the Docker deployment, considering that you are working on a development environment.

Please note that you might want to deploy and use Alfresco Content Services Enterprise Edition instead. In this case you can use the [Alfresco Content Services Deployment](https://github.com/Alfresco/acs-deployment.git) project on GitHub.

## Alfresco Process Services (optional)

If you want to develop on top of the [Alfresco Process Services](https://www.alfresco.com/platform/process-services-bpm), you might want to install it as described in the [official documentation](https://docs.alfresco.com/process-services1.8/topics/installing_process_services.html).

Please note that ADF applications are compliant with [Alfresco Process Services powered by Activiti](https://www.alfresco.com/platform/process-services-bpm) and not with [Activiti](https://www.activiti.org/) yet.

## ADF Yeoman generator (optional)

You might want to ensure that you have `Yeoman` installed by running `yo --version`. If this is not in your system make sure you run:

	sudo npm install -g yo

If you have installed it previously, you might want to make sure you uninstall them before. In ADF 2.0 we renamed the generator packages and the update is highly suggested.

Uninstall previous versions with:

	sudo npm uninstall generator-alfresco-adf-app
	sudo npm uninstall generator-ng2-alfresco-app
	
Install the latest version of the `generator-alfresco-adf-app` using the following command.

	sudo npm install -g generator-alfresco-adf-app

## Alfresco Example Content Application (optional)

In some tutorials your might be required to use the [Alfresco Example Content Application](https://github.com/Alfresco/alfresco-content-app) available into a public repository on GitHub named [`alfresco-content-app`](https://github.com/Alfresco/alfresco-content-app). The Alfresco Example Content Application is an example application and it is used in the tutorial as a starting point to customise the behaviour and show the development, avoiding to loose time in building apps from scratch.

The Alfresco Example Content Application requires an instance of Alfresco Content Services up and running, to work properly. If you don't have it already, follow the instructions above in the `Alfresco Content Services (optional)` paragraph.

To make the Alfresco Example Content Application works into your development environment, clone the [`alfresco-content-app` GitHub repository](https://github.com/Alfresco/alfresco-content-app) using the following command into a terminal.

    git clone https://github.com/Alfresco/alfresco-content-app

Once completed, edit the `proxy.conf.js` file into the root of the project and change the `target` property according to the Alfresco Content Services instance. Below the setup if you are using the [Alfresco Content Services Community Deployment](https://github.com/Alfresco/acs-community-deployment.git) project on GitHub.

    module.exports = {
        "/alfresco": {
            "target": "http://0.0.0.0:8082",
            ...
        }
    };

Once done, open a terminal and move into the `alfresco-content-app` folder and run `npm install`. Then run `npm start` and the application will be served on port `4200`, at the url `http://localhost:4200`.
