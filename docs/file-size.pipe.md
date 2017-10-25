# File Size pipe

Converts a number of bytes to the equivalent in KB, MB, etc.

## Basic Usage

```HTML
<div>
    File Size: {{ sizeInBytes | adfFileSize:"2" }}
</div>
```

## Details

The pipe chooses the largest unit that is less than the total number of bytes and
divides the total by this number. This ensures that the number of units is greater
than 1 (eg, you will see "512 Bytes" rather than "0.5KB"). The pipe parameter indicates
the number of decimal places to use for the value, defaulting to 2 decimal places.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->

<!-- seealso end -->