# DataColumn Component

Defines column properties for DataTable, Tasklist, Document List and other components.

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
- [Details](#details)
  * [Automatic column header translation](#automatic-column-header-translation)
  * [Custom tooltips](#custom-tooltips)
  * [Column Templates](#column-templates)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<adf-datatable [data]="data">
    <data-columns>
        <data-column key="icon" type="image" [sortable]="false"></data-column>
        <data-column key="id" title="Id"></data-column>
        <data-column key="createdOn" title="Created"></data-column>
        <data-column key="name" title="Name" class="full-width name-column"></data-column>
        <data-column key="createdBy.name" title="Created By"></data-column>
    </data-columns>
</adf-datatable>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| key | string | | Data source key, can be either column/property key like `title` or property path like `createdBy.name` |
| type | string | text | Value type for the column. Possible settings are 'text', 'image', 'date', 'fileSize' and 'location'. |
| format | string | | Value format (if supported by components), for example format of the date |
| sortable | boolean | true | Toggles ability to sort by this column, for example by clicking the column header |
| title | string | | Display title of the column, typically used for column headers. You can use the i18n resouce key to get it translated automatically. |
| template | `TemplateRef` | | Custom column template |
| sr-title | string | | Screen reader title, used for accessibility purposes |
| class | string | | Additional CSS class to be applied to column (header and cells) |
| formatTooltip | Function | | Custom tooltip formatter function. |

## Details

### Automatic column header translation

You can use i18n resource keys with DataColumn `title` property.
The component will automatically check the corresponding i18n resources and fetch corresponding value.

```html
<data-column
    key="name"
    title="MY.RESOURCE.KEY">
</data-column>
```

This feature is optional. Regular text either plain or converted via the `translate` pipe will still be working as it was before.

### Custom tooltips

You can create custom tooltips for the table cells by providing a `formatTooltip` property with a tooltip formatter function when declaring a data column.

```html
<data-column
    title="Name"
    key="name"
    [formatTooltip]="getNodeNameTooltip"
    class="full-width ellipsis-cell">
</data-column>
```

And the code in this case will be similar to the following:

```ts
import { DataColumn, DataRow } from 'ng2-alfresco-datatable';

@Component({...})
export class MyComponent {
    ...

    getNodeNameTooltip(row: DataRow, col: DataColumn): string {
        if (row) {
            return row.getValue('name');
        }
        return null;
    }
}
```

To disable the tooltip your function can return `null` or an empty string.

### Column Templates

It is possible to assign a custom column template like the following:

```html
<adf-datatable ...>
    <data-columns>
        <data-column title="Version" key="properties.cm:versionLabel">
            <ng-template let-value="value">
                <span>V. {{value}}</span>
            </ng-template>
        </data-column>
    </data-columns>
</adf-datatable>
```

Example above shows access to the underlying cell value by binding `value` property to the underlying context `value`:

```html
<ng-template let-value="value">
```

Alternatively you can get access to the entire data context using the following syntax:

```html
<ng-template let-entry="$implicit">
```

That means you are going to create local variable `entry` that is bound to the data context via Angular's special `$implicit` keyword.

```html
<ng-template let-entry="$implicit">
    <span>V. {{entry.data.getValue(entry.row, entry.col)}}</span>
</ng-template>
```

In the second case `entry` variable is holding a reference to the following data context:

```ts
{
    data: DataTableAdapter,
    row: DataRow,
    col: DataColumn
}
```
