# Activiti Diagrams Component for Angular 2

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration, see this [page](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

```sh
npm install --save ng2-activiti-diagrams
```


### Dependencies

Add the following dependency to your index.html:

```html
<script src="node_modules/alfresco-js-api/dist/alfresco-js-api.js"></script>
```

The following component needs to be added to your `systemjs.config.js` file: 

- [ng2-alfresco-core](https://www.npmjs.com/package/ng2-alfresco-core)

#### raphael

```sh
npm install raphael --save
```

Also make sure you include these dependencies in your `index.html` file:

```html
    <script src="node_modules/raphael/raphael.min.js"></script>
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

## Basic usage example Activiti Diagrams
The component shows the diagram of the input process.
```html
<activiti-diagrams [processDefinitionId]="processDefinitionId"></activiti-diagrams>
```

#### Events
**onSuccess**: The event is emitted when the diagrams element are loaded

**onError**: The event is emitted when the an error occur during the loading

#### Options
**metricPercentages** The array that contains the percentage of the time for each element

## Build from sources

Alternatively you can build component from sources with the following commands:

```sh
npm install
npm run build
```

### Build the files and keep watching for changes

```sh
$ npm run build:w
```

### Running unit tests

```sh
npm test
```

### Running unit tests in browser

```sh
npm test-browser
```

This task rebuilds all the code, runs tslint, license checks and other quality check tools
before performing unit testing.

### Code coverage

```sh
npm run coverage
```
