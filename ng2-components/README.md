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
 * Material Design elements
 * Context Menu component

## ECM components

- [DataTable](ng2-alfresco-datatable/README.md)
- [DocumentList](ng2-alfresco-documentlist/README.md)
- [Login](ng2-alfresco-login/README.md)
- [Search](ng2-alfresco-search/README.md)
- [Social](ng2-alfresco-social/README.md)
- [Tag list and controls](ng2-alfresco-tag/README.md)
- [User Info](ng2-alfresco-userinfo/README.md)
- [Upload](ng2-alfresco-upload/README.md)
- [Viewer](ng2-alfresco-viewer/README.md)
- [Webscript Viewer](ng2-alfresco-webscript/README.md)

## BPM components

- [Analytics](ng2-activiti-analytics/README.md)
- [Diagrams](ng2-activiti-diagrams/README.md)
- [TaskList](ng2-activiti-tasklist/README.md)
- [ProcessList](ng2-activiti-processlist/README.md)
- [Form](ng2-activiti-form/README.md)

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
