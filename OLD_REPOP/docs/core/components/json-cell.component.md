---
Title: Json Cell component
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-12
---

# [Json Cell Component](../../../lib/core/src/lib/datatable/components/json-cell/json-cell.component.ts "Defined in json-cell.component.ts")

Shows a JSON-formatted value inside a datatable component.

## Basic Usage

```html
<adf-datatable>
   <data-columns>
        <data-column key="json" type="json" title="Json Column"></data-column>
    </data-columns>
</adf-datatable>
```

You can specify the cell inside the `app.config.json` file:

```json
{
    "adf-cloud-process-list": {
        "presets": {
            "default": [
                {
                    "key": "json",
                    "type": "json",
                    "title": "Json cell value"
                }
            ]
        }
    }
}
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| column | [`DataColumn`](../../../lib/core/src/lib/datatable/data/data-column.model.ts) |  | Data that defines the column. |
| copyContent | `boolean` |  | Enables/disables a [Clipboard directive](../../core/directives/clipboard.directive.md) to allow copying of the cell's content. |
| data | [`DataTableAdapter`](../../../lib/core/src/lib/datatable/data/datatable-adapter.ts) |  | Data table adapter instance. |
| editable | `boolean` | false | Editable JSON. |
| resolverFn | `Function` | null | Custom resolver function which is used to parse dynamic column objects |
| row | [`DataRow`](../../../lib/core/src/lib/datatable/data/data-row.model.ts) |  | Data that defines the row. |
| tooltip | `string` |  | Text for the cell's tooltip. |

## Details

This component provides a custom display to show JSON data in a
[Datatable component](datatable.component.md) cell

## See also

-   [Datatable component](datatable.component.md)
