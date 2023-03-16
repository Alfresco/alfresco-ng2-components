---
Title: Version Manager Component
Added: v2.0.0
Status: Experimental
Last reviewed: 2019-01-16
---

# [Version Manager Component](../../../lib/content-services/src/lib/version-manager/version-manager.component.ts "Defined in version-manager.component.ts")

Displays the version history of a node with the ability to upload a new version.

![Version Manager](../../docassets/images/version-manager.png)

`This component is still in experimental phase. It has several limitations which will be resolved soon.`

## Basic Usage

```html
<adf-version-manager 
    [node]="aNode"
    (uploadSuccess)="customMethod($event)"
    (uploadError)="customMethod2($event)">
</adf-version-manager>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| allowDownload | `boolean` | true | Enable/disable downloading a version of the current node. |
| newFileVersion | `File` |  | New file for updating current version. |
| node | `Node` |  | Target node to manage version history. |
| showComments | `boolean` | true | Toggles showing/hiding of comments. |
| showVersionComparison | `boolean` | false | Toggles showing/hiding the [version comparison component](../../content-services/components/version-comparison.component.md). |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| uploadCancel | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>` | Emitted when an cancelling during upload. |
| uploadError | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FileUploadErrorEvent`](../../../lib/content-services/src/lib/common/events/file.event.ts)`>` | Emitted when an error occurs during upload. |
| uploadSuccess | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Node>` | Emitted when a file is uploaded successfully. |
| viewVersion | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when viewing a version. |

## Details

### Version actions

Each version has a context menu on the right, with the following actions.

| Action | Versions | Description |
| ------ | -------- | ----------- |
| Restore | All | Revert the current version to the selected one with creating a new version of it. |

## See also

-   [Version list component](version-list.component.md)
-   [Document list component](document-list.component.md)
