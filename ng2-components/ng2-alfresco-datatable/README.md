# DataTable Component for Angular 2

<p>
  <a href='https://raw.githubusercontent.com/Alfresco/dev-platform-webcomponents/master/ng2-components/ng2-alfresco-upload/LICENSE'>
     <img src='https://img.shields.io/hexpm/l/plug.svg' alt='license' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-component-green.svg?label=alfresco' alt='alfresco component' />
  </a>
  <a href='https://www.alfresco.com/'>
     <img src='https://img.shields.io/badge/style-%3E5.0.0-blue.svg?label=node%20version' alt='node version' />
  </a>
  <a title='Build Status' href="https://travis-ci.com/Alfresco/dev-platform-webcomponents">
     <img src='https://travis-ci.com/Alfresco/dev-platform-webcomponents.svg?token=FPzV2wyyCU8imY6wHR2B&branch=master'  alt='travis Status' />
  </a>
</p>

### Node
To correctly use this component check that on your machine is running Node version 5.0.0 or higher.

## Install

```sh
npm set registry http://devproducts.alfresco.me:4873
npm install --save ng2-alfresco-datatable material-design-lite material-design-icons
```

## Basic usage

```html
<alfresco-datatable 
    [data]="data">
</alfresco-datatable>
```

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
