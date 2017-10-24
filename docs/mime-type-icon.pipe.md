# Mime Type Icon pipe

Retrieves an icon to represent a MIME type.

## Basic Usage

```HTML
<div>
    <img src='{{ "image/jpeg" | adfMimeTypeIcon }}' />
</div>
```

## Details

The pipe takes a MIME type as input and returns the URL of an SVG file that
symbolizes that type (see the [Thumbnail service](thumbnail.service.md) for the mapping between types and icons). The pipe will return a "miscellaneous" icon when no specific mapping is defined.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Thumbnail service](thumbnail.service.md)
<!-- seealso end -->