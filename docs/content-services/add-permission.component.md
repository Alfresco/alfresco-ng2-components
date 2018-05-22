---
Added: v2.4.0
Status: Active
Last reviewed: 2018-05-03
---

# Add Permission Component

Searches for people or groups to add to the current node permissions.

![Add Permission Component](../docassets/images/add-permission-component.png)

## Basic Usage

```html
<adf-add-permission [nodeId]="nodeId"
    (success)="onSuccess($event)" (error)="onError($event)">
</adf-add-permission>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| nodeId | `string` |  | ID of the target node. |

### Events

| Name | Type | Description |
| -- | -- | -- |
| error | `EventEmitter<any>` | Emitted when an error occurs during the update. |
| success | `EventEmitter<MinimalNodeEntryEntity>` | Emitted when the node is updated successfully. |

## Details

This component extends the [Add permission panel component](../add-permission-panel.component.md) 
and apply the action confirm when the selection made is accepted.
