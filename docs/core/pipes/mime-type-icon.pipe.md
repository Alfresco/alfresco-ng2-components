---
Title: Mime Type Icon pipe
Added: v2.0.0
Status: Active
---

# [Mime Type Icon pipe](../../../lib/core/src/lib/pipes/mime-type-icon.pipe.ts "Defined in mime-type-icon.pipe.ts")

Retrieves an icon to represent a MIME type.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    <img src='{{ "image/jpeg" | adfMimeTypeIcon }}' />
</div>
```

<!-- {% endraw %} -->

## Details

The pipe takes a MIME type as input and returns the URL of an SVG file that
symbolizes that type (see the [Thumbnail service](../services/thumbnail.service.md) for the mapping between types and icons). The pipe will return a "miscellaneous" icon when no specific mapping is defined.

## See also

-   [Thumbnail service](../services/thumbnail.service.md)
