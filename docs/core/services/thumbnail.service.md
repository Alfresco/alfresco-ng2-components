---
Title: Thumbnail service
Added: v2.0.0
Status: Active
Last reviewed: 2019-03-20
---

# [Thumbnail service](../../../lib/core/src/lib/common/services/thumbnail.service.ts "Defined in thumbnail.service.ts")

Retrieves an SVG thumbnail image to represent a document type.

## Class members

### Methods

-   **getDefaultMimeTypeIcon**(): `string`<br/>
    Gets a "miscellaneous" thumbnail URL for types with no other icon defined.
    -   **Returns** `string` - URL string
-   **getMimeTypeIcon**(mimeType: `string`): `string`<br/>
    Gets a thumbnail URL for a MIME type.
    -   _mimeType:_ `string`  - MIME type for the thumbnail
    -   **Returns** `string` - URL string

## Details

The service can locate a thumbnail icon (in SVG format) for either
a document node or a MIME type. The default mapping between types
and icons is shown in the table below:

| Document | Icon | Types |
| -------- | ---- | ----- |
| Compressed archive | ![Archive thumbnail](../../docassets/images/ft_ic_archive.png) | 'application/x-compressed', 'application/x-zip-compressed', 'application/zip' |
| Text | ![Text thumbnail](../../docassets/images/ft_ic_document.png) | 'text/plain', 'application/json', 'application/x-javascript', 'application/vnd.apple.pages' |
| Bitmap/raster image | ![Bitmap thumbnail](../../docassets/images/ft_ic_raster_image.png) | 'image/png', 'image/jpeg', 'image/gif' |
| MP4 video | ![MP4 thumbnail](../../docassets/images/ft_ic_video.png) | 'video/mp4' |
| SVG vector image | ![SVG thumbnail](../../docassets/images/ft_ic_vector_image.png) | 'image/svg+xml' |
| HTML file | ![HTML thumbnail](../../docassets/images/ft_ic_website.png) | 'text/html' |
| PDF file | ![PDF thumbnail](../../docassets/images/ft_ic_pdf.png) | 'application/pdf' |
| Folder | ![Folder thumbnail](../../docassets/images/ft_ic_folder.png) |  |
| Disabled folder | ![Disabled folder thumbnail](../../docassets/images/ft_ic_folder_disable.png) |  |
| Excel spreadsheet | ![Spreadsheet thumbnail](../../docassets/images/ft_ic_ms_excel.png) | 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.spreadsheetml.template' |
| PowerPoint slideshow | ![PowerPoint thumbnail](../../docassets/images/ft_ic_ms_powerpoint.png) | 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.openxmlformats-officedocument.presentationml.template', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow' |
| Word document | ![Word thumbnail](../../docassets/images/ft_ic_ms_word.png) | 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.template' |
| Keynote presentation | ![Keynote thumbnail](../../docassets/images/ft_ic_presentation.png) | 'application/vnd.apple.keynote' |
| Numbers spreadsheet | ![Numbers thumbnail](../../docassets/images/ft_ic_spreadsheet.png) | 'application/vnd.apple.numbers' |

### Mat-icon

All the ADF icons for MIME types are now registered into the [`MatIconRegistry`](https://material.angular.io/components/icon/api), so you can use all
the icons via the &lt;mat-icon> tag:

```javascript
import { ThumbnailService } from '@alfresco/adf-core';

constructor(public thumbnailService: ThumbnailService) {
}‍‍‍‍‍‍‍‍
```

```html
MP4 <mat-icon svgIcon="video/mp4"></mat-icon>
PDF <mat-icon svgIcon="application/pdf"></mat-icon>
GIF <mat-icon svgIcon="image/gif"></mat-icon>
.....
```

## See also

-   [Mime type icon pipe](../pipes/mime-type-icon.pipe.md)
