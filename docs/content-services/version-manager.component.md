---
Added: v2.0.0
Status: Experimental
Last reviewed: 2018-04-13
---

# Version Manager Component

Displays the version history of a node with the ability to upload a new version.

![Version Manager](../docassets/images/version-manager.png)

`This component is still in experimental phase. It has several limitations which will be resolved soon.`

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
| ---- | ---- | ------------- | ----------- |
| allowDownload | `boolean` | true | Enable/disable downloading a version of the current node. |
| node | [`MinimalNodeEntryEntity`](../content-services/document-library.model.md) |  | Target node to manage version history. |
| showComments | `boolean` | true | Toggles showing/hiding of comments. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| uploadError | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` | Emitted when an error occurs during upload. |
| uploadSuccess | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`MinimalNodeEntryEntity`](../content-services/document-library.model.md)`>` | Emitted when a file is uploaded successfully. |

## Details

### Version actions

Each version has a context menu on the right, with the following actions.

| Action | Versions | Description |
| ------ | -------- | ----------- |
| Restore | All | Revert the current version to the selected one with creating a new version of it. |

## See also

-   [Version list component](version-list.component.md)
-   [Document list component](document-list.component.md)
