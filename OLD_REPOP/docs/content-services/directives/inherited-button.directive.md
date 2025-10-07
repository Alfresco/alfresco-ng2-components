---
Title: Inherit Permission directive
Added: v2.3.0
Status: Active
Last reviewed: 2019-01-16
---

# [Inherit Permission directive](../../../lib/content-services/src/lib/permission-manager/components/inherited-button.directive.ts "Defined in inherited-button.directive.ts")

Update the current node by adding/removing the inherited permissions.

## Basic Usage

```html
    <button mat-raised-button
            color="primary"
            adf-inherit-permission [nodeId]="nodeId"
            (updated)="onUpdatedPermissions($node)">PERMISSION</button>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| nodeId | `string` |  | ID of the node to add/remove inherited permissions. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |
| updated | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Node>` | Emitted when the node is updated. |

## Details

This directive switches inheritance of permissions on or off depending on what is set in
the node entity. So if the node has inherited permissions, this will remove them and
vice versa. If the node does not have inherited permissions then this will add them.
