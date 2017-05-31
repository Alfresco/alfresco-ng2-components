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

    Please refer to the following example file: [systemjs.config.js](demo/systemjs.config.js) .


## Basic usage

**my.component.ts**

```ts
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule, ObjectDataTableAdapter }  from 'ng2-alfresco-datatable';

@Component({
    selector: 'alfresco-app-demo',
    template: `
        <alfresco-datatable [data]="data">
        </alfresco-datatable>
    `
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
        DataTableModule.forRoot()
    ],
    declarations: [DataTableDemo],
    bootstrap: [DataTableDemo]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
```

![DataTable demo](docs/assets/datatable-demo.png)

You can also use HTML-based schema declaration like shown below:

```ts
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule, ObjectDataTableAdapter }  from 'ng2-alfresco-datatable';

@Component({
    selector: 'alfresco-app-demo',
    template: `
        <alfresco-datatable [data]="data">
            <data-columns>
                <data-column key="icon" type="image" [sortable]="false"></data-column>
                <data-column key="id" title="Id"></data-column>
                <data-column key="createdOn" title="Created"></data-column>
                <data-column key="name" title="Name" class="full-width name-column"></data-column>
                <data-column key="createdBy.name" title="Created By"></data-column>
            </data-columns>
        </alfresco-datatable>
    `
})
export class DataTableDemo {
    data: ObjectDataTableAdapter;

    constructor() {
        this.data = new ObjectDataTableAdapter(
            // data
            [
                {
                    id: 1, 
                    name: 'Name 1', 
                    createdBy : { name: 'user'}, 
                    createdOn: 123, 
                    icon: 'http://example.com/img.png'
                },
                {
                    id: 2, 
                    name: 'Name 2', 
                    createdBy : { name: 'user 2'}, 
                    createdOn: 123, 
                    icon: 'http://example.com/img.png'
                }
            ]
        );
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        DataTableModule.forRoot()
    ],
    declarations: [DataTableDemo],
    bootstrap: [DataTableDemo]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
```

### DataTable Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selectionMode` | string | 'single' | Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for multiple rows.  |
| `rowStyle` | string | | The inline style to apply to every row, see [NgStyle](https://angular.io/docs/ts/latest/api/common/index/NgStyle-directive.html) docs for more details and usage examples |
| `rowStyleClass` | string | | The CSS class to apply to every row |
| `data` | DataTableAdapter | instance of **ObjectDataTableAdapter** | data source |
| `rows` | Object[] | [] | The rows that the datatable should show |
| `multiselect` | boolean | false | Toggles multiple row selection, renders checkboxes at the beginning of each row |
| `actions` | boolean | false | Toggles data actions column |
| `actionsPosition` | string (left\|right) | right | Position of the actions dropdown menu. | 
| `fallbackThumbnail` | string |  | Fallback image for row ehre thubnail is missing|
| `contextMenu` | boolean | false | Toggles custom context menu for the component |
| `allowDropFiles` | boolean | false | Toggle file drop support for rows (see **ng2-alfresco-core/UploadDirective** for more details) |

### DataColumn Properties

Here's the list of available properties you can define for a Data Column definition.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| key | string | | Data source key, can be either column/property key like `title` or property path like `createdBy.name` |
| type | string (text\|image\|date) | text | Value type |
| format | string | | Value format (if supported by components), for example format of the date |
| sortable | boolean | true | Toggles ability to sort by this column, for example by clicking the column header |
| title | string | | Display title of the column, typically used for column headers |
| template | `TemplateRef` | | Custom column template |
| sr-title | string | | Screen reader title, used for accessibility purposes |
| class | string | | Additional CSS class to be applied to column (header and cells) |

### DataTable Events

| Name | Description
| --- | --- |
| [rowClick](#rowclick-event) | Emitted when user clicks the row |
| [rowDblClick](#rowdblclick-event) | Emitted when user double-clicks the row |
| [showRowContextMenu](#showrowcontextmenu-event) | Emitted before context menu is displayed for a row |
| [showRowActionsMenu](#showrowactionsmenu-event) | Emitted before actions menu is displayed for a row |
| [executeRowAction](#executerowaction-event) | Emitted when row action is executed by user |

### DataTable DOM Events

Below are the DOM events raised by DataTable component. 

| Name | Description |
| --- | --- |
| row-click | Emitted when user clicks the row |
| row-dblclick | Emitted when user double-clicks the row |

These events are bubbled up the element tree and can be subscribed to from within parent components.

```html
<root-component (row-click)="onRowClick($event)">
    <child-component>
        <alfresco-datatable></alfresco-datatable>
    </child-component>
</root-component>
```

```ts
onRowClick(event) {
    console.log(event);
}
```

![](docs/assets/datatable-dom-events.png)

### Advanced usage

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

#### Column Templates

It is possible assigning a custom column template like the following:

```html
<alfresco-datatable ...>
    <data-columns>
        <data-column title="Version" key="properties.cm:versionLabel">
            <template let-value="value">
                <span>V. {{value}}</span>
            </template>
        </data-column>
    </data-columns>
</alfresco-datatable>
```

Example above shows access to the underlying cell value by binding `value` property to the underlying context `value`:

```html
<template let-value="value">
```

Alternatively you can get access to the entire data context using the following syntax:

```html
<template let-entry="$implicit">
```

That means you are going to create local variable `entry` that is bound to the data context via Angular's special `$implicit` keyword.

```html
<template let-entry="$implicit">
    <span>V. {{entry.data.getValue(entry.row, entry.col)}}</span>
</template>
```

In the second case `entry` variable is holding a reference to the following data context:

```ts
{
    data: DataTableAdapter,
    row: DataRow,
    col: DataColumn
}
```

#### rowClick event

_This event is emitted when user clicks the row._

Event properties:

```ts
sender: any     // DataTable instance 
value: DataRow, // row clicked
event: Event    // original HTML DOM event
```

Handler example:

```ts
onRowClicked(event: DataRowEvent) {
    console.log(event.value);
}
```

_This event is cancellable, you can use `event.preventDefault()` to prevent default behaviour._

#### rowDblClick event

_This event is emitted when user double-clicks the row._

Event properties:

```ts
sender: any     // DataTable instance 
value: DataRow, // row clicked
event: Event    // original HTML DOM event
```

Handler example:

```ts
onRowDblClicked(event: DataRowEvent) {
    console.log(event.value);
}
```

_This event is cancellable, you can use `event.preventDefault()` to prevent default behaviour._

#### showRowContextMenu event

_Emitted before context menu is displayed for a row._ 

Note that DataTable itself does not populate context menu items,
you can provide all necessary content via handler.

Event properties:

```ts
value: {
    row: DataRow,
    col: DataColumn,
    actions: []
}
```

Handler example:

```ts
onShowRowContextMenu(event: DataCellEvent) {
    event.value.actions = [
        { ... },
        { ... }
    ]
}
```

_This event is cancellable, you can use `event.preventDefault()` to prevent default behaviour._

DataTable will automatically render provided menu items.

_Please refer to [ContextMenu](https://www.npmjs.com/package/ng2-alfresco-core) 
documentation for more details on context actions format and behavior._

#### showRowActionsMenu event

_Emitted before actions menu is displayed for a row.
Requires `actions` property to be set to `true`._

Event properties:

```ts
value: {
    row: DataRow,
    action: any
}
```

Note that DataTable itself does not populate action menu items,
you can provide all necessary content via handler.

_This event is cancellable, you can use `event.preventDefault()` to prevent default behaviour._

#### executeRowAction event

_Emitted when row action is executed by user._

Usually accompanies `showRowActionsMenu` event. 
DataTable itself does not execute actions but provides support for external
integration. If there were actions provided with `showRowActionsMenu` event
then `executeRowAction` will be automatically executed when user clicks 
corresponding menu item.

```html
<alfresco-datatable
    [data]="data"
    [multiselect]="multiselect"
    [actions]="true"
    (showRowActionsMenu)="onShowRowActionsMenu($event)"
    (executeRowAction)="onExecuteRowAction($event)">
</alfresco-datatable>
```

```ts
import { DataCellEvent, DataRowActionEvent } from 'ng2-alfresco-datatable';

onShowRowActionsMenu(event: DataCellEvent) {
    let myAction = {
        title: 'Hello'
        // your custom metadata needed for onExecuteRowAction
    };
    event.value.actions = [
        myAction
    ];
}

onExecuteRowAction(event: DataRowActionEvent) {
    let args = event.value;
    console.log(args.row);
    console.log(args.action);
    window.alert(`My custom action: ${args.action.title}`);
}
```

![](docs/assets/datatable-actions-ui.png)

![](docs/assets/datatable-actions-console.png)

Developers are allowed putting any payloads as row actions.
The only requirement for the objects is having `title` property.

Once corresponding action is clicked in the dropdown menu DataTable invokes `executeRowAction` event
where you can handle the process, inspect the action payload and all custom properties defined earlier,
and do corresponding actions.

## Data sources

DataTable component gets data by means of data adapter. 
It is possible having data retrieved from different kinds of sources by implementing
a custom `DataTableAdapter` using the following interfaces:

```ts
interface DataTableAdapter {
    selectedRow: DataRow;
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
| npm run test | Run unit tests in the console |
| npm run test-browser | Run unit tests in the browser
| npm run coverage | Run unit tests and display code coverage report |

## License

[Apache Version 2.0](https://github.com/Alfresco/alfresco-ng2-components/blob/master/LICENSE)