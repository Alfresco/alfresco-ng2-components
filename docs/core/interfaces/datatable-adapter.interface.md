---
Title: DataTableAdapter interface
Added: v2.0.0
Status: Active
---

# [DataTableAdapter interface](../../../lib/core/src/lib/datatable/data/datatable-adapter.ts "Defined in datatable-adapter.ts")

Defines how table data is supplied to [DataTable](../components/datatable.component.md) and [Tasklist](../../process-services/components/task-list.component.md) components.

## Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| selectedRow | [`DataRow`](../../../lib/core/src/lib/datatable/data/data-row.model.ts) | The data for the currently selected row. |

## Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| rowsChanged | [`Subject<Array<DataRow>>`](../../../lib/core/src/lib/datatable/data/data-row.model.ts) | Raised when data adapter gets new rows. |

## Methods

[`getRows(): Array<DataRow>;`](../../../lib/core/src/lib/datatable/data/data-row.model.ts)<br/>
[`setRows(rows: Array<DataRow>): void;`](../../../lib/core/src/lib/datatable/data/data-row.model.ts)<br/>
Get/set the values for display in the table using an array of rows.

[`getColumns(): Array<DataColumn>;`](../../../lib/core/src/lib/datatable/data/data-column.model.ts)<br/>
[`setColumns(columns: Array<DataColumn>): void;`](../../../lib/core/src/lib/datatable/data/data-column.model.ts)<br/>
Get/set an array of column specifications.

`getValue(row:`[`DataRow,`](lib/core/src/lib/datatable/data/data-row.model.ts)`col: DataColumn): any;`<br/>
Get the data value from a specific table cell.

`getSorting():`[`DataSorting`](../../../lib/core/src/lib/datatable/data/data-sorting.model.ts)`;`<br/>
`setSorting(sorting: DataSorting): void;`<br/>
Get/set the sorting key and direction (ascending or descending).

`sort(key?: string, direction?: string): void;`<br/>
Sort the table with a specified key and direction (ascending or descending).

## Details

You can implement [`DataTableAdapter`](../../../lib/core/src/lib/datatable/data/datatable-adapter.ts) in your own class to display your data with the [DataTable](../components/datatable.component.md)
and [Tasklist](../../process-services/components/task-list.component.md) components.
This interface (along with other interfaces for column and row data) hides the details of your class from the caller, so you can store your data internally however you like. The DataTable library implements the interface in the [`ObjectDataTableAdapter`](../../../lib/core/src/lib/datatable/data/object-datatable-adapter.ts) class which is the standard adapter for the Datatable component.

The basic idea of [`DataTableAdapter`](../../../lib/core/src/lib/datatable/data/datatable-adapter.ts) is that the caller can request your class to return an array of column
definition objects. Each of these objects specifies the unique key, name, type and other properties of a single column.

The caller can also request the data values for the table as an array of row objects. The caller accesses the data from a row using a `getValue` method that returns the data from a specified column. This column is identified by the unique key that was set during the column definition.

The data-hiding works the other way around when the caller needs to set data in the [`DataTableAdapter`](../../../lib/core/src/lib/datatable/data/datatable-adapter.ts) class - the internal
details of the caller's storage are hidden by the column and row interfaces. When the `setColumns` and `setRows` methods are
called on the adapter, it can simply query the column/row objects it receives and then store the data in its own format.

### Columns and rows

Columns are defined by the [`DataColumn`](../../../lib/core/src/lib/datatable/data/data-column.model.ts) interface:

```ts
interface DataColumn {
    key: string;
    type: string;
    format?: string;
    sortable?: boolean;
    title?: string;
    srTitle?: string;
    cssClass?: string;
    template?: TemplateRef<any>;
    formatTooltip?: Function;
    focus?: boolean;
}
```

An array of these objects is passed to your object when the `setColumns` method is called.  The `key` property is used to identify columns and so each column's key should be unique. The `type` string can have a value of 'text', 'image' or 'date'.

An array of [`DataRow`](../../../lib/core/src/lib/datatable/data/data-row.model.ts) objects is passed to your object when the `setRows` method is called:

```ts
interface DataRow {
    isSelected: boolean;
    isDropTarget?: boolean;
    cssClass?: string;
    hasValue(key: string): boolean;
    getValue(key: string): any;
}
```

Each row contains a set of values. An item in the set is retrieved by passing its key (specified in the column description) to the `getValue` method. As a result, the row does not need to store its data items in any particular order or format as long as it can retrieve the right item using its key.

### ObjectDataTableAdapter

The DataTable library provides a implementation of [DataTableAdapter,](lib/core/src/lib/datatable/data/datatable-adapter.ts) called
[`ObjectDataTableAdapter`](../../../lib/core/src/lib/datatable/data/object-datatable-adapter.ts). This is a simple adapter that binds to object arrays and turns object fields into columns:

```ts
let data = new ObjectDataTableAdapter(
    // Row data
    [
        { id: 1, name: 'Name 1' },
        { id: 2, name: 'Name 2' }
    ],
    // Column schema
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

![DataTable demo](../../docassets/images/datatable-demo.png)

If you don't specify the column array then the constructor will infer the layout of the columns from
the structure of the row objects. The field names ('id' and 'name' in the example below) will be used
for both the `key` and `title` properties of the columns:

```ts
let data =  [
    { id: 2, name: 'abs' },
    { id: 1, name: 'xyz' }
];

let schema = ObjectDataTableAdapter.generateSchema(data);

/*Auto generated column schema:
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

## See also

-   [Datatable component](../components/datatable.component.md)
-   [Task list component](../../process-services/components/task-list.component.md)
