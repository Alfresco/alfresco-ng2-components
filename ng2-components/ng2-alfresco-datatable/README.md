# DataTable Component for Angular 2

<p>
  <a title='Build Status' href="https://travis-ci.org/Alfresco/alfresco-ng2-components">
    <img src='https://travis-ci.org/Alfresco/alfresco-ng2-components.svg?branch=master'  alt='travis
    Status' />
  </a>
  <a href='https://codecov.io/gh/Alfresco/alfresco-ng2-components'>
    <img src='https://img.shields.io/codecov/c/github/codecov/alfresco-ng2-components/master.svg?maxAge=2592000' alt='Coverage Status' />
  </a>
  <a href='https://www.npmjs.com/package/ng2-alfresco-datatable'>
    <img src='https://img.shields.io/npm/dt/ng2-alfresco-datatable.svg' alt='npm downloads' />
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

## Install

```sh
npm install --save ng2-alfresco-datatable material-design-lite material-design-icons
```

## Basic usage

```html
<alfresco-datatable 
    [data]="data">
</alfresco-datatable>
```

Example of an App that declares the file viewer component :

```ts
import { Component } from '@angular/core';
import {
    ALFRESCO_DATATABLE_DIRECTIVES,
    ObjectDataTableAdapter
} from 'ng2-alfresco-datatable';

@Component({
    selector: 'my-view',
    template: '<YOUR TEMPLATE>',
    directives: [ALFRESCO_DATATABLE_DIRECTIVES]
})
export class MyView {
    data: ObjectDataTableAdapter;

    constructor() {
        this.data = new ObjectDataTableAdapter(
            // data
            [
                { id: 1, name: 'Name 1' },
                { id: 2, name: 'Name 2' }
            ],
            // schema
            [
                {type: 'text', key: 'id', title: 'Id', sortable: true},
                {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true}
            ]
        );
    }
}

```

![DataTable demo](docs/assets/datatable-demo.png)

### Properties

| Name | Type | Default | Description
| --- | --- | --- | --- |
| data | DataTableAdapter | empty **ObjectDataTableAdapter** | data source |
| multiselect | boolean | false | toggle multiple row selection, renders checkboxes at the beginning of each row |
| actions | boolean | false | toggle data actions column |

### Events

| Name | Description
| --- | --- |
| rowClick | emitted when user clicks the row |
| rowDblClick | emitted when user double-clicks the row |

## Data sources

DataTable component gets data by means of data adapter. 
It is possible having data retrieved from different kinds of sources by implementing
a custom `DataTableAdapter`:

```ts
interface DataTableAdapter {

    getRows(): Array<DataRow>;
    setRows(rows: Array<DataRow>): void;
    getColumns(): Array<DataColumn>;
    setColumns(columns: Array<DataColumn>): void;
    getValue(row: DataRow, col: DataColumn): any;
    getSorting(): DataSorting;
    setSorting(sorting: DataSorting): void;
    sort(key?: string, direction?: string): void;

}
```

DataTable ships `ObjectDataTableAdapter` out-of-box. This is a simple data adapter
that binds to object arrays and turns object fields into columns:

```ts
let data = new ObjectDataTableAdapter(
    // data
    [
        { id: 1, name: 'Name 1' },
        { id: 2, name: 'Name 2' }
    ],
    // schema
    [
        {type: 'text', key: 'id', title: 'Id', sortable: true},
        {type: 'text', key: 'name', title: 'Name', sortable: true}
    ]
);
```

## Build from sources

Alternatively you can build component from sources with the following commands:

```sh
npm install
npm run build
```

##Build the files and keep watching for changes

    ```sh
    $ npm run build:w
    ```
    
## Running unit tests

```sh
npm test
```

## Running unit tests in browser

```sh
npm test-browser
```

This task rebuilds all the code, runs tslint, license checks and other quality check tools 
before performing unit testing. 

## Code coverage

```sh
npm run coverage
```
