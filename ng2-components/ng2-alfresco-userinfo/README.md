# Alfresco User Info Component for Angular 2
This component will show the user information for ECM and BPM


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

```html
<ng2-alfresco-userinfo></ng2-alfresco-userinfo>
```
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
