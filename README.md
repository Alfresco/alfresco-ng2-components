# Alfresco Application Development Framework (ADF)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d9eb873741da403bb3284778102372e7)](https://www.codacy.com/app/Alfresco/alfresco-ng2-components?utm_source=github.com&utm_medium=referral&utm_content=Alfresco/alfresco-ng2-components&utm_campaign=badger)
[![Join the chat at https://gitter.im/Alfresco/alfresco-ng2-components](https://badges.gitter.im/Alfresco/alfresco-ng2-components.svg)](https://gitter.im/Alfresco/alfresco-ng2-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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
    <img src='http://img.shields.io/codecov/c/github/Alfresco/alfresco-ng2-components/master.svg?maxAge=2592000' alt='Coverage Status' />
  </a>
  <a href='https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE'>
     <img src='https://img.shields.io/hexpm/l/plug.svg' alt='license' />
  </a>
</p>

## Introduction

See the [Introduction page](INTRODUCTION.md) to get started with the Alfresco Application Development Framework.

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the necessary configuration. See our tutorial
[Preparing the development environment](docs/tutorials/preparing-environment.md)
for full details.

## Components

You can find the sources for all ADF components in the
[`lib`](/lib) folder.

Full documentation for all components is available at the
[ADF Component Catalog](https://alfresco.github.io/adf-component-catalog/).

## Demo Application

A separate application showcasing integration of components can be found
[here](https://github.com/Alfresco/alfresco-ng2-components/tree/master/demo-shell).
The app has examples of basic interaction for both APS and ACS components.

## Yeoman generators

To speed up the development of your ADF application, use the 
[Yeoman Generator](https://github.com/Alfresco/generator-ng2-alfresco-app).
This will create a full working project with all the right libraries and tools.

<p align="center">
  <img title="yeoman generator" src='https://github.com/yeoman/media/blob/master/optimized/yeoman-150x150-opaque.png' alt='yeoman logo'  />
</p>

## Browser Support

All components are supported in the following browsers:

|**Browser**   	   |**Version**   	|
|---        	   |---  	        |
|Chrome     	   |Latest       	|
|Safari (OS X)     |9.x          	|
|Firefox*    	   |Latest       	|
|Edge       	   |13, 14     	    |
|Internet Explorer |11     	        |

* Due to a [known issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1188880) in Firefox, the Alfresco Upload Component does not currently support folder upload functionality on Firefox.    

See the [Browser Support](BROWSER-SUPPORT.md) article for more details. 

