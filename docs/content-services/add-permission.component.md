---
Added: v2.4.0
Status: Active
Last reviewed: 2018-05-03
---

# Add Permission Component

Allow user to search people or group that could be added to the current node permissions.

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
| nodeId | `string` | "" |  |

### Events

| Name | Type | Description |
| -- | -- | -- |
| success | `EventEmitter<MinimalNodeEntryEntity>` |  |
| error | `EventEmitter<any>` |  |

## Details

This component extends the [Add permission panel component](../add-permission-panel.component.md) 
and apply the action confirm when the selection made is accepted.
The `success` event will be emitted when the node is correctly updated.
The `error` event will be thrown whenever the node update permission will fail.
