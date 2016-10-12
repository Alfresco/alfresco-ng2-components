# ALFRESCO ANGULAR 2 COMPONENTS

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
    <img src='https://img.shields.io/codecov/c/github/Alfresco/alfresco-ng2-components/master.svg?maxAge=2592000' alt='Coverage Status' />
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
  
<p align="center">
  <img title="alfresco" alt='alfresco' src='assets/alfresco.png'  width="280px" height="150px"></img>
  <img title="angular2" alt='angular2' src='assets/angular2.png'  width="150px" height="150px"></img>    
</p>

## Introduction

See the following [page](INTRODUCTION.md) for an introduction to the Alfresco Application Development Framework.

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the 
necessary configuration, see this [page](PREREQUISITES.md).

## Components

To view the complete list of all the components that you can use to build your custom Alfresco (ECM,BPM) client follow this link:
[Components](/ng2-components).

You can browse all the components at the following [page](http://devproducts.alfresco.com/).

## Yeoman generators

To speed up the development of your Alfresco Angular 2 application, or Alfresco Angular 2 component, use one of the Yeoman generators. 

These generators will create a full working project with all the right libraries and tools.

<p align="center">
  <img title="yeoman generator" src='https://github.com/yeoman/media/blob/master/optimized/yeoman-150x150-opaque.png' alt='yeoman logo'  />
</p>

### Generate an Alfresco web component starter project

To generate your Alfresco Angular 2 component you can use the following Yeoman generator:

- [Yeoman Generator Angular 2 Alfresco component](https://github.com/Alfresco/generator-ng2-alfresco-component)


### Generate an Alfresco web application starter project

To generate your Alfresco Angular 2 application you can use the following Yeoman generator:

- [Yeoman Generator Angular 2 Alfresco application](https://github.com/Alfresco/generator-ng2-alfresco-app)

## Amazon AWS Elastic Beanstalk fast deploy

<p align="center">
    <img alt="AmazonWebservices Logo.svg" src="https://upload.wikimedia.org/wikipedia/commons/1/1d/AmazonWebservices_Logo.svg" width="250" height="94">
</p>

To deploy directly on your AWS instance our demo shell click the button below:

<a title="Deploy to AWS" href="https://console.aws.amazon.com/elasticbeanstalk/home?region=us-west-2#/newApplication?applicationName=Alfresco&solutionStackName=Node.js&tierName=WebServer&sourceBundleUrl=https://s3-us-west-2.amazonaws.com/elasticbeanstalk-us-west-2-677901592050/2016210o6l-Archive-v7.zip" target="_blank"><img src="http://d0.awsstatic.com/product-marketing/Elastic%20Beanstalk/deploy-to-aws.png" height="40"></a>

## Browser Support  All components are supported in the below browsers:

|**Browser**   	|**Version**   	|
|---        	|---	        |
|Chrome     	|Latest     	|
|Safari (OS X)  |9.x        	|
|Firefox*    	|Latest     	|

*Concerning Alfresco Upload Component, folder upload currently not supported [firefox known issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1188880 ) 