---
Title: Category selector dialog component
Added: v6.8.0
Status: Active
Last reviewed: 2024-03-12
---

# [Category selector dialog component](../../../lib/content-services/src/lib/dialogs/category-selector.dialog.ts "Defined in category-selector.dialog.ts")

Allows the user to select one or multiple categories.

![Category selector dialog component](../../docassets/images/adf-category-selector-dialog.png)

## Dialog inputs

| Name | Type      | Default value | Description |
| ---- |-----------| ------------- | ----------- |
| select | [`Subject<Category[]>`](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/js-api/src/api/content-rest-api/docs/CategoriesApi.md)  |  | Emits an array of selected categories when the dialog closes |
| multiSelect | `boolean` | `true` | (optional) Toggles multiselect mode |

## Basic Usage 

```ts
constructor(private dialog: MatDialog) {}

...

function openCatDialog() {
    const data: CategorySelectorDialogOptions = {
        select: new Subject<Category[]>(),
        multiSelect: false
    };

    this.dialog.open(CategorySelectorDialogComponent, {
        data,
        width: '400px'
    });

    data.select.subscribe(
        (selections: Category[]) => {
            ...
        }
    );
}
```
All the results will be streamed to the select [subject](http://reactivex.io/rxjs/manual/overview.html#subject) present in the `CategorySelectorDialogOptions` object passed to the dialog.
When the category is selected by clicking the `Select` button, the `options.select` stream will be completed.

## Details

This component lets the user select categories. Use the
Angular [`MatDialog`](https://material.angular.io/components/dialog/overview)
service to open the dialog, as shown in the example, and pass a `options` object
with properties.

## See also

-   [Categories management component](../components/categories-management.component.md)
