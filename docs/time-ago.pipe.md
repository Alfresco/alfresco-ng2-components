# Time Ago pipe

Converts a recent past date into a number of days ago.

## Basic Usage

```HTML
<div>
    Last modified: {{ date | adfTimeAgo }}
</div>
```

## Details

The pipe finds the difference between the input date and the current date. If it
is less than seven days then then the date will be formatted as "X days ago".
Otherwise, the usual full date format is used.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->

<!-- seealso end -->