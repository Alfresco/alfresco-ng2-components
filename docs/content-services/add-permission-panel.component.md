---
Added: v2.3.0
Status: Active
Last reviewed: 2018-03-23
---

# Add Permission Component

Allow user to search people or group that could be added to the current node permissions.

![Permission List](../docassets/images/adf-permission-list.png)

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

### Events

| Name | Type | Description |
| -- | -- | -- |
| select | `EventEmitter<MinimalNodeEntryEntity>` |  |

## Details
This component uses a [Search component](../search.component.md) to retrieve the
groups and people that could be added to the permission list of the current node.
The `select` event will be emitted when a result is clicked from the list.