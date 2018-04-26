---
Added: v2.3.0
Status: Experimental
Last reviewed: 2018-03-23
---

# Upload Version Button Component (Workaround)

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

This component extends the [Upload Button component](upload-button.component.md). The
properties and events are the same except for the `node` property that specifies the node
to be versioned (this is a _required_ input parameter). However, some properties don't make
sense when applied to the Upload Version Button component, so they are simply ignored.

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| node | `MinimalNodeEntryEntity` |  | (**Required**) The node to be versioned.  |
| disabled | `boolean` | `false` | Toggles component disabled state (if there is no node permission checking).  |
| uploadFolders | `boolean` | `false` | Allows/disallows upload folders (only for Chrome).  |
| multipleFiles | `boolean` | `false` | Allows/disallows multiple files  |
| versioning | `boolean` | `false` | Toggles versioning.  |
| maxFilesSize | `number` |  | Sets a limit on the maximum size (in bytes) of a file to be uploaded. Has no effect if undefined. |
| staticTitle | `string` |  | Defines the text of the upload button.  |
| tooltip | `string` | `null` | Custom tooltip text.  |
| rootFolderId | `string` | `'-root-'` | The ID of the root. Use the nodeId for Content Services or the taskId/processId for Process Services. |
| acceptedFilesType | `string` | `'*'` | Filter for accepted file types.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| success | `EventEmitter<{}>` | Emitted when the file is uploaded successfully.  |
| error | `EventEmitter<{}>` | Emitted when an error occurs.  |
| createFolder | `EventEmitter<{}>` | Emitted when a folder is created.  |
| permissionEvent | `EventEmitter<PermissionModel>` | Emitted when delete permission is missing.  |

## Details

### Restrictions

Currently, the API only allows new version uploads for a node where the name
(and most importantly the _extension_) of the new version
is exactly the same as the old version. As a result, this workaround component uploads the
chosen file with the same name that the original file had. This is the reason why the `node`
is a mandatory dependency for this component.

So, to sum up, this component:

-   **Can** upload a new version from the same file extension regardless of the file name.
-   **Cannot** upload a new version that has a different file extension, to the file that was
    originally uploaded (an error message will be emitted by the `error` EventEmitter of the component.

## See also

- [Upload Button component](upload-button.component.md)
