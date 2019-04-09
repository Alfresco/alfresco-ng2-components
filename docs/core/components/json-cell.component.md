---
Title: JsonCell component
Added: v2.0.0
Status: Active
---

# [JsonCellComponent](../../../lib/core/datatable/components/datatable/json-cell.component.ts "Defined in empty-list.component.ts")

Show Json formated value inside datatable component.

## Basic Usage

```html
<adf-datatable ...>
   <data-columns>
        <data-column key="entry.json" type="json" title="Json Column"></data-column>
    </data-columns>
</adf-datatable>
```

You can specify the cell inside configuration file

```javascript
  "adf-cloud-process-list": {
        "presets": {
            "default": [
                {
                    "key": "entry.json",
                    "type": "json",
                    "title": "Json cell value"
                }
            ]
        }
    },
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| data | [`DataTableAdapter`](../../../lib/core/datatable/data/datatable-adapter.ts) | `null` | Data adapter instance. |
| column | [`DataColumn`](../../../lib/core/datatable/data/data-column.model.ts) | `null` | Data that defines the column |
| row | [`DataRow`](../../../lib/core/datatable/data/data-row.model.ts) |  | Data that defines the row |


## Details

This component provides a custom display to show a [Datatable component](datatable.component.md) cell

## See also

-   [Datatable component](datatable.component.md)
