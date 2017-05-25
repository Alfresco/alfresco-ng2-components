# Alfresco Angular 2 Components

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

## Base components

- [Core library](ng2-alfresco-core/README.md)
- [alfresco-viewer](ng2-alfresco-viewer/README.md)
- [adf-accordion-group](ng2-alfresco-core/README.md)
- [adf-accordion](ng2-alfresco-core/README.md)
- [context-menu](ng2-alfresco-core/README.md)
 * Material Design elements
 * Context Menu component

## ECM components

- [alfresco-webscript-get](ng2-alfresco-webscript/README.md)
- [alfresco-pagination](ng2-alfresco-datatable/README.md)
- [alfresco-datatable](ng2-alfresco-datatable/README.md)
- [alfresco-login](ng2-alfresco-login/README.md)
- [alfresco-tag-node-actions-list](ng2-alfresco-tag/README.md)
- [alfresco-tag-list](ng2-alfresco-tag/README.md)
- [alfresco-tag-node-list](ng2-alfresco-tag/README.md)
- [alfresco-document-list](ng2-alfresco-documentlist/README.md)
- [alfresco-document-menu-action](ng2-alfresco-documentlist/README.md)
- [alfresco-document-list-breadcrumb](ng2-alfresco-documentlist/README.md)
- [adf-rating](ng2-alfresco-social/README.md)
- [adf-like](ng2-alfresco-social/README.md)
- [alfresco-upload-drag-area](ng2-alfresco-upload/README.md)
- [alfresco-upload-button](ng2-alfresco-upload/README.md)
- [alfresco-file-uploading-list](ng2-alfresco-upload/README.md)
- [alfresco-search](ng2-alfresco-search/README.md)
- [alfresco-search-control](ng2-alfresco-search/README.md)
- [alfresco-search-autocomplete](ng2-alfresco-search/README.md)
- [ng2-alfresco-userinfo](ng2-alfresco-userinfo/README.md)

## BPM components

- [activiti-analytics](ng2-activiti-analytics/README.md)
- [activiti-analytics-generator](ng2-activiti-analytics/README.md)
- [activiti-form](ng2-activiti-form/README.md)
- [activiti-content](ng2-activiti-form/README.md)
- [activiti-start-form](ng2-activiti-form/README.md)
- [activiti-process-instance-filters](ng2-activiti-processlist/README.md)
- [activiti-process-instance-list](ng2-activiti-processlist/README.md)
- [activiti-process-instance-details](ng2-activiti-processlist/README.md)
- [activiti-start-process](ng2-activiti-processlist/README.md)
- [activiti-apps](ng2-activiti-tasklist/README.md)
- [activiti-tasklist](ng2-activiti-tasklist/README.md)
- [activiti-checklist](ng2-activiti-tasklist/README.md)
- [adf-task-attachment-list](ng2-activiti-tasklist/README.md)
- [activiti-people](ng2-activiti-tasklist/README.md)
- [activiti-comments](ng2-activiti-tasklist/README.md)
- [activiti-task-header](ng2-activiti-tasklist/README.md)
- [activiti-task-details](ng2-activiti-tasklist/README.md)
- [activiti-start-task](ng2-activiti-tasklist/README.md)
- [activiti-filters](ng2-activiti-tasklist/README.md)
- [activiti-people-search](ng2-activiti-tasklist/README.md)
- [activiti-process-instance-header](ng2-activiti-processlist/README.md)
- [activiti-process-instance-tasks](ng2-activiti-processlist/README.md)
- [activiti-process-instance-comments](ng2-activiti-processlist/README.md)
- [activiti-process-instance-variables](ng2-activiti-processlist/README.md)
- [activiti-diagram](ng2-activiti-diagrams/README.md)

You can browse all the components at the following address:

http://devproducts.alfresco.com/

## How to test a change to a generic component in its own demo

Let's suppose that for some reason you have changed a component and you want to test this changes.
The example is based on the ng2-alfresco-login component, but you can use the same steps for any component.


1.  Move inside the component folder and link it.
```sh

cd ng2-alfresco-login
npm link

```

2.  Build the component with the watcher enabled.
```sh

npm run build:w

```

3. From another terminal move inside the demo sub folder and link the component to the local node_modules folder.
```sh

cd demo
npm link ng2-alfresco-login

```

4. Start the demo project.
```sh

npm run start
```
