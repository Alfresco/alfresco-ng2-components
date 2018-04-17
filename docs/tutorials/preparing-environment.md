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

## ADF Yeoman generator (optional)

You might want to ensure that you have `Yeoman` installed by running `yo --version`. If this is not in your system make sure you run:

	sudo npm install -g yo

If you have installed it previously, you might want to make sure you uninstall them before. In ADF 2.0 we renamed the generator packages and the update is highly suggested.

Uninstall previous versions with:

	sudo npm uninstall generator-alfresco-adf-app
	sudo npm uninstall generator-ng2-alfresco-app
	
Install the latest version of the `generator-alfresco-adf-app` using the following command.

	sudo npm install -g generator-alfresco-adf-app

