---
Title: File upload error pipe
Added: v3.0.0
Status: Active
Last reviewed: 2019-01-17
---

# [File upload error pipe](../../lib/content-services/upload/pipes/file-upload-error.pipe.ts "Defined in file-upload-error.pipe.ts")

Converts an upload error code to an error message.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    Upload failed: {{ errorCode | adfFileUploadError }}
</div>
```

<!-- {% endraw %} -->

## Details

The pipe takes an upload error code (eg, from the `error` event of one of the
upload components) and converts it to a human-readable message. The message is
automatically translated to the user's chosen language.

## See also

-   [File uploading dialog component](../content-services/file-uploading-dialog.component.md)
-   [Upload drag area component](../content-services/upload-drag-area.component.md)
-   [Upload button component](../content-services/upload-button.component.md)
