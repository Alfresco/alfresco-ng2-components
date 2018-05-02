---
Level: Beginner
---

# Preparing the development environment

This tutorial explains how to get set up to use ADF so you can tackle the other tutorials. It covers the
basic development environment with suggested versions for each tool, library and module.

## Node.js

[Node.js](https://nodejs.org) is a JavaScript runtime built using an event-driven, non-blocking I/O model
that makes it lightweight and efficient. Node.js uses [npm](https://www.npmjs.com/) as its public registry 
and package system.

You need the latest `node.js` from either the `8.x` or `9.x` branch.
If you already have it installed then you can check the version with the following command in a terminal: 

	node -v

## Angular CLI

[Angular CLI](https://cli.angular.io/) is a tool to initialize, develop, scaffold and maintain [Angular](https://angular.io/) applications, including ADF applications.

Version 1.6.6 or Angular CLI seems to be the best choice currently, since earlier and later versions have
issues with `@angular/devkit-core`.

If you already have `Angular CLI` installed then you can check the version by running:

	ng --version

To install `Angular CLI` version 1.6.6 globally, run the following command:

	sudo npm install -g @angular/cli@1.6.6

## Code Editor

You can use any text editor to develop ADF apps but we recommend
[Visual Studio Code](http://code.visualstudio.com) from Microsoft. It's a free, lightweight and *very*
powerful tool that works well for Angular development.

## ADF Yeoman generator (optional)

Check that you have `Yeoman` installed by running `yo --version`. If it is not present, you can install
it by running:

	sudo npm install -g yo

You can install the latest version of the `generator-alfresco-adf-app` (the main scaffold generator)
using the following command:

	sudo npm install -g generator-alfresco-adf-app

If you have installed an earlier version of the generator then you should uninstall it before installing
the latest one. In ADF 2.0 we renamed the generator packages, so updating is especially recommended from
pre-2.0 versions.

Uninstall versions before 2.0 with:

	sudo npm uninstall generator-ng2-alfresco-app

...and versions since 2.0 with:

	sudo npm uninstall generator-alfresco-adf-app
