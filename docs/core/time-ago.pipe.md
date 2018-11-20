---
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# Time Ago pipe

Converts a recent past date into a number of days ago.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    Last modified: {{ date | adfTimeAgo }}
</div>
```

<!-- {% endraw %} -->

## Details

The pipe finds the difference between the input date and the current date. If it
is less than seven days then then the date will be formatted as "X days ago".
Otherwise, the usual full date format is used.
