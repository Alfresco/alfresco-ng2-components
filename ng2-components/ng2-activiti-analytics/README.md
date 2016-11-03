# Activiti Analytics Component for Angular 2

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration, see this [page](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

```sh
npm install --save ng2-activiti-analytics
```

#### Ng2-Charts

```sh
npm install ng2-charts chart.js --save
```

Also make sure you include these dependencies in your `index.html` file:

```html
    <script src="node_modules/chart.js/dist/Chart.bundle.min.js"></script>
```

#### Moment

```sh
npm install moment --save
```

Also make sure you include these dependencies in your `index.html` file:

```html
    <script src="node_modules/moment/min/moment.min.js"></script>
```


#### Material Design Date picker

```sh
npm install md-date-time-picker --save
```

Also make sure you include these dependencies in your `index.html` file:

```html
    <script src="node_modules/md-date-time-picker/dist/js/mdDateTimePicker.min.js"></script>
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

## Basic usage example Activiti Analytics List
The component shows the list of all the available reports
```html
<analytics-report-list></analytics-report-list>
```

#### Events
**onSuccess**: The event is emitted when the report list are loaded<br />
**onError**: The event is emitted when an error occur during the loading<br />
**reportClick**: The event is emitted when the report in the list is selected<br />

#### Options
No options.

## Basic usage example Activiti Analytics
The component shows the charts related to the reportId passed as input
```html
<activiti-analytics [appId]="appId" [reportId]="reportId"></activiti-analytics>
```

#### Events
**onSuccess**: The event is emitted when the report parameters are loaded<br />
**onError**: The event is emitted when an error occur during the loading<br />

#### Options
**appId**: The application id<br />
**reportId**: The report id<br />
**debug**: Flag to enable or disable the Form values in the console log<br />

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
