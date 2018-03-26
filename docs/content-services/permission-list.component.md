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

## Details

This component uses a [Datatable component](../core/datatable.component.md) to show the
permissions retrieved from the [Node service](../core/node.service.md).