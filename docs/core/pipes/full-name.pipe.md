---
Title: Full name pipe
Added: v3.0.0
Status: Active
Last reviewed: 2018-11-12
---

# Full Name Pipe

Joins the first and last name properties from the `UserLike` object into a single string.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    Project Leader: {{ user | fullName }}
</div>
```

<!-- {% endraw %} -->

## Details

The pipe offers a convenient way to extract the name from a `UserLike` object.

## See also

-   [User initial pipe](user-initial.pipe.md)
