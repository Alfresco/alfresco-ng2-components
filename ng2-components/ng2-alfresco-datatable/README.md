# DataTable Component for Angular 2

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

See it live: [DataTable Quickstart](https://embed.plnkr.co/80qr4YFBeHjLMdAV0F6l/)

## Prerequisites

Before you start using this development framework, make sure you have installed all required software and done all the
necessary configuration, see this [page](https://github.com/Alfresco/alfresco-ng2-components/blob/master/PREREQUISITES.md).

## Install

Follow the 3 steps below:

1. Npm

    ```sh
    npm install ng2-alfresco-datatable --save
    ```

2. Html

    Include these dependencies in your index.html page:

    ```html

    <!-- Google Material Design Lite -->
    <link rel="stylesheet" href="node_modules/material-design-lite/material.min.css">
    <script src="node_modules/material-design-lite/material.min.js"></script>
    <link rel="stylesheet" href="node_modules/material-design-icons/iconfont/material-icons.css">

    <!-- Load the Angular Material 2 stylesheet -->
    <link href="node_modules/@angular/material/core/theming/prebuilt/deeppurple-amber.css" rel="stylesheet">

    <!-- Polyfill(s) for Safari (pre-10.x) -->
    <script src="node_modules/intl/dist/Intl.min.js"></script>
    <script src="node_modules/intl/locale-data/jsonp/en.js"></script>

    <!-- Polyfill(s) for older browsers -->
    <script src="node_modules/core-js/client/shim.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/dom4/1.8.3/dom4.js"></script>
    <script src="node_modules/element.scrollintoviewifneeded-polyfill/index.js"></script>

    <!-- Polyfill(s) for dialogs -->
    <script src="node_modules/dialog-polyfill/dialog-polyfill.js"></script>
    <link rel="stylesheet" type="text/css" href="node_modules/dialog-polyfill/dialog-polyfill.css" />
    <style>._dialog_overlay { position: static !important; } </style>

    <!-- Modules  -->
    <script src="node_modules/zone.js/dist/zone.js"></script>
    <script src="node_modules/reflect-metadata/Reflect.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>

    ```

3. SystemJs

    Add the following components to your systemjs.config.js file:

    - ng2-translate
    - alfresco-js-api
    - ng2-alfresco-core
    - ng2-alfresco-datatable

    Please refer to the following example file: [systemjs.config.js](demo/systemjs
    .config.js) .

## Basic usage example

Usage example of this component :

**my.component.ts**

```ts

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule }  from 'ng2-alfresco-datatable';
import { ObjectDataTableAdapter } from 'ng2-alfresco-datatable';
import { Component } from '@angular/core';
import { CONTEXT_MENU_DIRECTIVES, CONTEXT_MENU_PROVIDERS } from 'ng2-alfresco-core';
import { ALFRESCO_DATATABLE_DIRECTIVES, ObjectDataTableAdapter } from 'ng2-alfresco-datatable';

@Component({
    selector: 'alfresco-app-demo',
    template: `<alfresco-datatable [data]="data">
        </alfresco-datatable>`,
    directives: [ALFRESCO_DATATABLE_DIRECTIVES, CONTEXT_MENU_DIRECTIVES],
    providers: [CONTEXT_MENU_PROVIDERS]
})
export class DataTableDemo {
    data: ObjectDataTableAdapter;

    constructor() {
        this.data = new ObjectDataTableAdapter(
            // data
            [
                {id: 1, name: 'Name 1'},
                {id: 2, name: 'Name 2'}
            ],
            // schema
            [
                {
                    type: 'text',
                    key: 'id',
                    title: 'Id',
                    sortable: true
                },
                {
                    type: 'text',
                    key: 'name',
                    title: 'Name',
                    cssClass: 'full-width',
                    sortable: true
                }
            ]
        );
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        DataTableModule
    ],
    declarations: [DataTableDemo],
    bootstrap: [DataTableDemo]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);


```

![DataTable demo](docs/assets/datatable-demo.png)

### Properties

| Name | Type | Default | Description
| --- | --- | --- | --- |
| `data` | DataTableAdapter | instance of **ObjectDataTableAdapter** | data source |
| `multiselect` | boolean | false | Toggles multiple row selection, renders checkboxes at the beginning of each row |
| `actions` | boolean | false | Toggles data actions column |
| `fallbackThumbnail` | string |  | Fallback image for row ehre thubnail is missing|

### Events

| Name | Description
| --- | --- |
| [rowClick](#rowclick-event) | Emitted when user clicks the row |
| [rowDblClick](#rowdblclick-event) | Emitted when user double-clicks the row |
| [showRowContextMenu](#showrowcontextmenu-event) | Emitted before context menu is displayed for a row |
| [showRowActionsMenu](#showrowactionsmenu-event) | Emitted before actions menu is displayed for a row |
| [executeRowAction](#executerowaction-event) | Emitted when row action is executed by user |

**Advanced usage example**

```html
<alfresco-datatable
    [data]="data"
    [actions]="contentActions"
    [multiselect]="multiselect"
    (showRowContextMenu)="onShowRowContextMenu($event)"
    (showRowActionsMenu)="onShowRowActionsMenu($event)"
    (executeRowAction)="onExecuteRowAction($event)"
    (rowClick)="onRowClick($event)"
    (rowDblClick)="onRowDblClick($event)">
    <no-content-template>
        <template>
            <h1>Sorry, no content</h1>
        </template>
    </no-content-template>
</alfresco-datatable>
```

#### rowClick event

_This event is emitted when user clicks the row._

Event properties:

```ts
row: DataRow, // row clicked
event: Event  // original HTML DOM event
```

Handler example:

```ts
onRowClicked(event) {
    console.log(event.row);
}
```

#### rowDblClick event

_This event is emitted when user double-clicks the row._

Event properties:

```ts
row: DataRow, // row clicked
event: Event  // original HTML DOM event
```

Handler example:

```ts
onRowDblClicked(event) {
    console.log(event.row);
}
```

#### showRowContextMenu event

_Emitted before context menu is displayed for a row._ 

Note that DataTable itself does not populate context menu items,
you can provide all necessary content via handler.

Event properties:

```ts
args: {
    row: DataRow,
    col: DataColumn,
    actions: []
}
```

Handler example:

```ts
onShowRowContextMenu(event) {
    event.args.actions = [
        { ... },
        { ... }
    ]
}
```

DataTable will automatically render provided menu items.

_Please refer to [ContextMenu](https://www.npmjs.com/package/ng2-alfresco-core) 
documentation for more details on context actions format and behavior._

#### showRowActionsMenu event

_Emitted before actions menu is displayed for a row.
Requires `actions` property to be set to `true`._

Note that DataTable itself does not populate action menu items,
you can provide all necessary content via handler.

Event properties:

```ts
args: {
    row: DataRow,
    col: DataColumn,
    actions: []
}
```

Handler example:

```ts
onShowRowActionsMenu(event) {
    event.args.actions = [
        { ... },
        { ... }
    ]
}
```

#### executeRowAction event

_Emitted when row action is executed by user._

Usually accompanies `showRowActionsMenu` event. 
DataTable itself does not execute actions but provides support for external
integration. If there were actions provided with `showRowActionsMenu` event
then `executeRowAction` will be automatically executed when user clicks 
corresponding menu item.

Event properties:

```ts
args: {
    row: DataRow
    action: any
}
```

Handler example:

```ts
onExecuteRowAction(event) {
    
    // get event arguments
    let row = event.args.row;
    let action = event.args.action;
    
    // your code to execute action
    this.executeContentAction(row, action);
}
```

## Data sources

DataTable component gets data by means of data adapter. 
It is possible having data retrieved from different kinds of sources by implementing
a custom `DataTableAdapter` using the following interfaces:

```ts
interface DataTableAdapter {
    generateSchema(row: DataRow): col: DataColumn;
    getRows(): Array<DataRow>;
    setRows(rows: Array<DataRow>): void;
    getColumns(): Array<DataColumn>;
    setColumns(columns: Array<DataColumn>): void;
    getValue(row: DataRow, col: DataColumn): any;
    getSorting(): DataSorting;
    setSorting(sorting: DataSorting): void;
    sort(key?: string, direction?: string): void;
}

interface DataRow {
    isSelected: boolean;
    hasValue(key: string): boolean;
    getValue(key: string): any;
}

interface DataColumn {
    key: string;
    type: string; // text|image|date
    format?: string;
    sortable?: boolean;
    title?: string;
    srTitle?: string;
    cssClass?: string;
    template?: TemplateRef<any>;
}
```

DataTable provides [ObjectDataTableAdapter](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-alfresco-datatable/src/data/object-datatable-adapter.ts) out-of-box. 
This is a simple data adapter implementation that binds to object arrays 
and turns object fields into columns:

```ts
let data = new ObjectDataTableAdapter(
    // data
    [
        { id: 1, name: 'Name 1' },
        { id: 2, name: 'Name 2' }
    ],
    // schema
    [
        { 
            type: 'text', 
            key: 'id', 
            title: 'Id', 
            sortable: true 
        },
        {
            type: 'text', 
            key: 'name', 
            title: 'Name', 
            sortable: true
        }
    ]
);
```

## Generate schema 

Is possible to auto generate your schema if you have only the data row  

```ts
let data =  [
    { id: 2, name: 'abs' },
    { id: 1, name: 'xyz' }
];

let schema = ObjectDataTableAdapter.generateSchema(data);

/*Auto generated schema value:

    [
        { 
            type: 'text', 
            key: 'id', 
            title: 'Id', 
            sortable: false 
        },
        {
            type: 'text', 
            key: 'name', 
            title: 'Name', 
            sortable: false
        }
    ] 
    
 */

```

# Pagination Component

The pagination object is a generic component to paginate component. The Alfresco API are paginated and returns a Pagination object. You can use the pagination object to feed the pagination component and then listen to the event which return the current pagination and query again the API with the options choose by the user.

![DataTable demo](docs/assets/pagination-demo.png)


### Properties

| Name | Type | Default | Description
| --- | --- | --- | --- |
| `supportedPageSizes` | numer[] | [5, 10, 20, 50, 100] | This array describe the set of options showed in the pick list |
| `maxItems` | boolean | false | Max number of element showed per page. If you pick another size from the pick list this option will be overwritten |
| `pagination` | Pagination | {count: 0, totalItems: 0, skipCount: 0, maxItems: 20 , hasMoreItems: true} | The Alfresco Api return a pagination object, you can use it to feed the pagination component, or create your own. |

### Events

| Name | Description
| --- | --- |
| `changePageSize` | Emitted when user picks one of the options from the pick list |
| `nextPage` | Emitted when user clicks next page button |
| `prevPage` | Emitted when user clicks prev page button |

All the events carry with them the current pagination object.

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

## Running unit tests

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

## Demo

If you want have a demo of how the component works, please check the demo folder :

```sh
cd demo
npm install
npm start
```

## NPM scripts

| Command | Description |
| --- | --- |
| npm run build | Build component |
| npm run build:w | Build component and keep watching the changes |
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)