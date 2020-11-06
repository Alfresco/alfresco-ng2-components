---
Title: Version Upload component
Added: v4.1.0
Status: Experimental
Last reviewed: 2020-11-06
---

# [Version Upload component](../../../lib/content-services/src/lib/version-manager/version-upload.component.ts "Defined in version-list.component.ts")

Displays the new version's minor/major changes and the optional comment of a node in a [Version Manager component](version-manager.component.md).

### Basic Usage

```html
<adf-version-upload [node]="myNode"></adf-version-upload>
```

## Class members

### Properties

| Name              | Type                                                                                                     | Default value | Description                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------- |
| showUploadButton  | `boolean`                                                                                                | true          | Toggles showing/hiding the upload button.                 |
| showCancelButton  | `boolean`                                                                                                | true          | Toggles showing/hiding the cancel button.                 |
| newFileVersion    | `File`                                                                                                   |               | Used to create a new version of the current node.         |
| node              | [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) |               | The target node.                                          |

### Events

| Name            | Type                                                                                                                                                     | Description                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| success         | [`EventEmitter`](https://angular.io/api/core/EventEmitter)                                                                                               | Emitted when a new version is successfully uploaded              |
| error           | [`EventEmitter`](https://angular.io/api/core/EventEmitter)                                                                                               | Emitted when a new version throws an error                       |
| cancel          | [`EventEmitter`](https://angular.io/api/core/EventEmitter)                                                                                               | Emitted when cancelling uploading a new version                  |
| versionChanged  | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>`                                                                                     | Emitted when the type of the new version is picked (minor/major) |
| commentChanged  | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>`                                                                                     | Emitted when the comment of the new version has changed.         |

## Details

This component is used by the [Version Manager component](version-manager.component.md) to
load and displays the new node's version choice - minor/major & comment.

## See also

-   [Version manager component](version-manager.component.md)
