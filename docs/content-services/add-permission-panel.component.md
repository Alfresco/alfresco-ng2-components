---
Added: v2.4.0
Status: Active
Last reviewed: 2018-05-03
---

# Add Permission Panel Component

Searches for people or groups to add to the current node permissions.

![Add Permission Component](../docassets/images/add-permission-component.png)

## Basic Usage

```html
<adf-add-permission
    [nodeId]="nodeId"
    (success)="onSuccess($event)"
    (error)="onError($event)">
</adf-add-permission>
```

## Class members

### Events

| Name | Type | Description |
| -- | -- | -- |
| select | `EventEmitter<any>` | Emitted when a permission list item is selected. |

## Details

This component uses a [Search component](../search.component.md) to retrieve the
groups and people that could be added to the permission list of the current node.
The `select` event is emitted when a result is clicked from the list.

The [Add permission dialog component](../content-services/add-permission-dialog.component.md)
and [Add permission component](../content-services/add-permission.component.md) extend this behavior by applying the chosen
permissions to the node once the selection has been made.

## See also

-   [Add permission dialog component](../content-services/add-permission-dialog.component.md)
-   [Add permission component](../content-services/add-permission.component.md)
