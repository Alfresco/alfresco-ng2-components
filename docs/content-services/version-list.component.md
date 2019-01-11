---
Title: Version List component
Added: v2.0.0
Status: Experimental
Last reviewed: 2018-05-08
---

# [Version List component](../../lib/content-services/version-manager/version-list.component.ts "Defined in version-list.component.ts")

Displays the version history of a node in a [Version Manager component](../content-services/version-manager.component.md).

### Basic Usage

```html
<adf-version-list [node]="myNode"></adf-version-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| allowDownload | `boolean` | true | Enable/disable downloading a version of the current node. |
| node | [`MinimalNodeEntryEntity`](../content-services/document-library.model.md) |  | The target node. |
| showActions | `boolean` | true | Toggles showing/hiding of version actions |
| showComments | `boolean` | true | Toggles showing/hiding of comments |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| deleted | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` | Emitted when a version is deleted |
| restored | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` | Emitted when a version is restored |

## Details

This component is used by the [Version Manager component](../content-services/version-manager.component.md) to
load and displays the version history of a node.

If you want show readonly version list you set this component with showActions false:

```html
<adf-version-list [node]="myNode" [showActions]="false" ></adf-version-list>
```

## See also

-   [Version manager component](version-manager.component.md)
