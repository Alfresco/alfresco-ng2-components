---
Added: v2.0.0
Status: Experimental
Last reviewed: 2018-04-13
---

# Version Manager Component

Displays the version history of a node with the ability to upload a new version.

![Version Manager](../docassets/images/version-manager.png)

![\#f03c15](https://placehold.it/15/f03c15/000000?text=+) `This component is still in experimental phase. It has several limitations which will be resolved soon.`

## Basic Usage

```html
<adf-version-manager 
    [node]="aMinimalNodeEntryEntity"
    (uploadSuccess)="customMethod($event)"
    (uploadError)="customMethod2($event)">
</adf-version-manager>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| allowDownload | `boolean` | true |  |
| node | `MinimalNodeEntryEntity` |  |  |
| showComments | `boolean` | true |  |

### Events

| Name | Type | Description |
| -- | -- | -- |
| uploadError | `EventEmitter<Object>` |  |
| uploadSuccess | `EventEmitter<Object>` |  |

## Details

### Version actions

Each version has a context menu on the right, with the following actions.

| Action | Versions | Description |
| ------ | -------- | ----------- |
| Restore | All | Revert the current version to the selected one with creating a new version of it. |

## See also

-   [Version list component](version-list.component.md)
-   [Document list component](document-list.component.md)
