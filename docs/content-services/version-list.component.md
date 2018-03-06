---
Added: v2.0.0
Status: Experimental
---
# Version List component

Displays the version history of a node in a Version Manager component

### Basic Usage

```html
<adf-version-list [id]="nodeId"></adf-version-list>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| id | `string` |  | ID of the node whose version history you want to display.  |

## Details

Inside the version manager component, there is the underlying VersionListComponent.
The VersionListComponent loads and displays the version history of a node.

## See also

-   [Version manager component](version-manager.component.md)
