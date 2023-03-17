---
Title: Upload Version Button Component (Workaround)
Added: v2.3.0
Status: Experimental
Last reviewed: 2018-03-23
---

# [Upload Version Button Component (Workaround)](../../../lib/content-services/src/lib/upload/components/upload-version-button.component.ts "Defined in upload-version-button.component.ts")

Activates a file version upload.

Until further backend API improvements are implemented, this component is meant to be used
to enrich the features and decrease the restrictions currently applied to node version uploading.

## Basic usage

```html
<adf-upload-version-button
    staticTitle="Upload new version"
    [node]="node"
    [rootFolderId]="node.parentId"
    [versioning]="true"
    (success)="onUploadSuccess($event)"
    (error)="onUploadError($event)">
</adf-upload-version-button>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| acceptedFilesType | `string` | "\*" | Filter for accepted file types. |
| comment | `string` |  | When you overwrite existing content, you can use the comment field to add a version comment that appears in the version history |
| disabled | `boolean` | false | Toggles component disabled state (if there is no node permission checking). |
| file | `File` |  | Custom added file. The upload button type will be 'button' instead of 'file' |
| majorVersion | `boolean` | false | majorVersion boolean field to true to indicate a major version should be created. |
| maxFilesSize | `number` |  | Sets a limit on the maximum size (in bytes) of a file to be uploaded. Has no effect if undefined. |
| multipleFiles | `boolean` | false | Allows/disallows multiple files |
| node | `Node` |  | (**Required**) The node to be versioned. |
| nodeType | `string` | "cm:content" | Custom node type for uploaded file |
| rootFolderId | `string` | "-root-" | The ID of the root. Use the nodeId for Content Services or the taskId/processId for Process Services. |
| staticTitle | `string` |  | Defines the text of the upload button. |
| tooltip | `string` | null | Custom tooltip text. |
| uploadFolders | `boolean` | false | Allows/disallows upload folders (only for Chrome). |
| versioning | `boolean` | false | Toggles versioning. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| beginUpload | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`UploadFilesEvent`](../../../lib/content-services/src/lib/upload/components/upload-files.event.ts)`>` | Emitted when the upload begins. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`FileUploadErrorEvent`](../../../lib/content-services/src/lib/common/events/file.event.ts)`>` | Emitted when an error occurs. |
| permissionEvent | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`PermissionModel`](../../../lib/content-services/src/lib/document-list/models/permissions.model.ts)`>` | Emitted when create permission is missing. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the file is uploaded successfully. |
| updateFileVersion | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<CustomEvent<any>>` | Emitted when dropping a file over another file to update the version. |

## Details

This component extends the [Upload Button component](upload-button.component.md). The
properties and events are the same except for the `node` property that specifies the node
to be versioned (this is a _required_ input parameter). However, some properties don't make
sense when applied to the [Upload Version Button component](upload-version-button.component.md) so they are simply ignored.

## See also

-   [Upload Button component](upload-button.component.md)
