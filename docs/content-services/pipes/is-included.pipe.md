---
Title: Is Included pipe
Added: v6.1.0
Status: Active
Last reviewed: 2023-06-13
---

# [Is Included pipe](../../../lib/content-services/src/lib/pipes/is-included.pipe.ts "Defined in is-included.pipe.ts")

Checks if the provided value is contained in the provided array.

## Basic Usage

<!-- {% raw %} -->

```HTML
<mat-option [disabled]="value | adfIsIncluded: arrayOfValues"</mat-option>
```

<!-- {% endraw %} -->

## Details

The pipe takes the provided value and checks if that value is included in the provided array and returns the appropriate boolean value.

## See also

-   [File upload error pipe](./file-upload-error.pipe.md)
