# Alfresco User Info Component for Angular 2
<p>
  <a title='Build Status Travis' href="https://travis-ci.org/Alfresco/alfresco-ng2-components">
    <img src='https://travis-ci.org/Alfresco/alfresco-ng2-components.svg?branch=master'  alt='travis
    Status' />
  </a>
  <a title='Build Status AppVeyor' href="https://ci.appveyor.com/project/alfresco/alfresco-ng2-components">
    <img src='https://ci.appveyor.com/api/projects/status/github/Alfresco/alfresco-ng2-components'  alt='travis
    Status' />
  </a>
  <a href='https://codecov.io/gh/Alfresco/alfresco-ng2-components'>
    <img src='https://img.shields.io/codecov/c/github/Alfresco/alfresco-ng2-components/master.svg?maxAge=2592000' alt='Coverage Status' />
  </a>
  <a href='https://www.npmjs.com/package/ng2-alfresco-login'>
    <img src='https://img.shields.io/npm/dt/ng2-alfresco-login.svg' alt='npm downloads' />
  </a>
  <a href='https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE'>
     <img src='https://img.shields.io/hexpm/l/plug.svg' alt='license' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-component-green.svg?label=alfresco' alt='alfresco component' />
  </a>
  <a href='https://angular.io/'>
     <img src='https://img.shields.io/badge/style-2-red.svg?label=angular' alt='angular 2' />
  </a>
  <a href='https://www.typescriptlang.org/docs/tutorial.html'>
     <img src='https://img.shields.io/badge/style-lang-blue.svg?label=typescript' alt='typescript' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-%3E5.0.0-blue.svg?label=node%20version' alt='node version' />
  </a>
</p>

### Node
To correctly use this component check that on your machine is running Node version 5.0.0 or higher.


## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration, see this [page](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Installation

```bash
npm install ng2-alfresco-userinfo --save
```
## Dependencies

Add the following dependency to your index.html:
```html
<script src="node_modules/alfresco-js-api/dist/alfresco-js-api.js"></script>
```
	
You must separately install the following libraries for your application:
	
- [ng2-translate](https://github.com/ocombe/ng2-translate)
- [ng2-alfresco-core](https://www.npmjs.com/package/ng2-alfresco-core)

```sh
npm install --save ng2-translate ng2-alfresco-core
```
	
#### Material Design Lite

The style of this component is based on [material design](https://getmdl.io/), so if you want to visualize it correctly you have to add the material
design dependency to your project:

```sh
npm install --save material-design-icons material-design-lite
```

Also make sure you include these dependencies in your `index.html` file:

```html
<!-- Google Material Design Lite -->
<link rel="stylesheet" href="node_modules/material-design-lite/material.min.css">
<script src="node_modules/material-design-lite/material.min.js"></script>
<link rel="stylesheet" href="node_modules/material-design-icons/iconfont/material-icons.css">
```
	
## Example

## Basic usage

```html
<alfresco-document-list
    [ecmBackgroundImage]="pathToEcmBannerImage"
    [bpmBackgroundImage]="pathToBpmBannerImage"
    [fallBackThumbnailImage]="pathToDefaultImage">
</alfresco-document-list>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| ecmBackgroundImage | string |  | Custom path for the background banner image for ECM users |
| bpmBackgroundImage | string |  | Custom path for the background banner image for BPM users |
| menuOpenType | string | bottom-right  | Custom choice for opening menu bottom right or bottom left  |
| fallBackThumbnailImage | string | image at ng2-alfresco-userinfo/src/img/anonymous.gif | Fallback image for profile when thubnail is missing|

This will show a round icon with user and on click some user information are showed.
If user is logged in with ECM and BPM the ECM image will be showed.

## NPM scripts

| Command | Description |
| --- | --- |
| npm run build | Build component |
| npm run build:w | Build component and keep watching the changes |
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

## History

For detailed changelog, check [Releases](https://github.com/alfresco/ng2-alfresco-userinfo/releases).

## Contributors

[Contributors](https://github.com/alfresco/ng2-alfresco-userinfo/graphs/contributors)