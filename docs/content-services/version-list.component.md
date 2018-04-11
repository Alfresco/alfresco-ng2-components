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
| nodeId | `string` |  | ID of the node whose version history you want to display.  |
| showComments | `boolean` | true |  Set this to false if version comments should not be displayed.  |
| allowDownload | `boolean` | true |  Toggles downloads of previous versions. Set this to false to not show the menu item for version download.  |
| allowDelete | `boolean` | true | Toggles the version delete feature. |
| allowRestore | `boolean` | true | Toggles the restore feature. |

### DOM events

All DOM events are bubbling and can be handled in the parent components up to the root application component.

| Name | Description |
| --- | --- |
| version-deleted | Raised after a version is deleted. |
| version-restored | Raised after a version is restored. |

## Details

Inside the version manager component, there is the underlying VersionListComponent.
The VersionListComponent loads and displays the version history of a node.

## See also

-   [Version manager component](version-manager.component.md)
