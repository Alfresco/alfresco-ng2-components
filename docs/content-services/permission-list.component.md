---
Added: v2.3.0
Status: Active
Last reviewed: 2018-03-23
---

# Permission List Component

Shows node permissions as a table.

![Permission List](../docassets/images/adf-permission-list.png)

## Basic Usage

```html
<adf-permission-list [nodeId]="nodeId">
</adf-permission-list>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| nodeId | `string` | `null` | ID of the node whose permissions you want to show.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| update | `PermissionElement` | Emitted when the permission is updated. |

## Details

This component uses a [Datatable component](../core/datatable.component.md) to show the
permissions retrieved from the [Node service](../core/node.service.md).
For the locallyset permissions a role dropdown will be showed allowing the user to change it.
When user select a new value, the permission role is automatically updated and the `update` event is thrown.