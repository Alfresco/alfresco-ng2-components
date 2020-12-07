---
Title: Version Upload component
Added: v4.1.0
Status: Experimental
Last reviewed: 2020-11-06
---

# [Version Upload component](../../../lib/content-services/src/lib/version-manager/version-upload.component.ts "Defined in version-upload.component.ts")

Displays the new version's minor/major changes and the optional comment of a node in a [Version Manager component](version-manager.component.md).

### Basic Usage

```html
<adf-version-upload [node]="myNode"></adf-version-upload>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| newFileVersion | `File` |  | New file for updating current version. |
| node | [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) |  | The target node. |
| showCancelButton | `boolean` | true | Toggles showing/hiding of cancel button. |
| showUploadButton | `boolean` | true | Toggles showing/hiding upload button. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| cancel | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an cancelling during upload. |
| commentChanged | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the comment is changed. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the file is uploaded successfully. |
| versionChanged | `EventEmitter<boolean>` | Emitted when the version is changed. |

## Details

This component is used by the [Version Manager component](version-manager.component.md) to
load and displays the new node's version choice - minor/major & comment.

## See also

*   [Version manager component](version-manager.component.md)
