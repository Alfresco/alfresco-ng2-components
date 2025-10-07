---
Title: Permission List Component
Added: v2.3.0
Status: Active
Last reviewed: 2021-4-17
---

# [Permission List Component](../../../lib/content-services/src/lib/permission-manager/components/permission-list/permission-list.component.ts "Defined in permission-list.component.ts")

Shows node permissions as a table.

![Permission List](../../docassets/images/adf-permission-list.png)

## Basic Usage

```html
<adf-permission-list [nodeId]="nodeId"></adf-permission-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| nodeId | `string` |  | ID of the node whose permissions you want to show. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |
| update | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`PermissionElement`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/PermissionElement.md)`>` | Emitted when the permission is updated. |

## Details

This component uses a [Datatable component](../../core/components/datatable.component.md) to show the
permissions retrieved from the [Node service](../../core/services/node.service.md).
For the locally set permissions a role dropdown will be shown to let the user select a new role.
When the user selects a new value, the permission role is automatically updated and the `update` event is emitted.
