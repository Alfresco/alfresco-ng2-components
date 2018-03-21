---
Added: v2.3.0
Status: Active
---
# Inherit Permission directive

Update the current node by adding/removing the inherited permissions.

## Basic Usage

```html
    <button mat-raised-button
            color="primary"
            adf-inherit-permission [nodeId]="nodeId"
            (updated)="onUpdatedPermissions($node)">PERMISSION</button>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| nodeId | `string` |  | nodeId where to add/remove inherited permissions  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| updated | `EventEmitter<MinimalNodeEntryEntity>` | Emitted when the node is updated. |

## Details
This directive switches on/off the inheritance on the permission based on what is set on the node entity.
So if the node has inherited permissions, this will remove them viceversa if the node does not have the inherited permission this will add them.