---
Added: v2.0.0
Status: Experimental
Last reviewed: 2018-05-08
---

# Version List component

Displays the version history of a node in a Version Manager component.

### Basic Usage

```html
<adf-version-list [node]="myNode"></adf-version-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| allowDownload | `boolean` | true | Enable/disable possibility to download a version of the current node. |
| id | `string` |  | **Deprecated:** in 2.3.0 |
| node | `MinimalNodeEntryEntity` |  | The target node. |
| showActions | `boolean` | true | Toggles showing/hiding of version actions |
| showComments | `boolean` | true | Toggles showing/hiding of comments |

## Details

This component is used by the Version Manager component to
load and displays the version history of a node.

## See also

-   [Version manager component](version-manager.component.md)
