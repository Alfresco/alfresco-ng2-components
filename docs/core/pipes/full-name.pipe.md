---
Title: Full name pipe
Added: v3.0.0
Status: Active
Last reviewed: 2018-11-12
---

# [Full name pipe](../../../lib/core/src/lib/pipes/full-name.pipe.ts "Defined in full-name.pipe.ts")

Joins the first and last name properties from a [`UserProcessModel`](../../core/models/user-process.model.md) object into a single string.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    Project Leader: {{ user | fullName }}
</div>
```

<!-- {% endraw %} -->

## Details

The pipe offers a convenient way to extract the name from a [User process model](../models/user-process.model.md) object.

## See also

-   [User initial pipe](user-initial.pipe.md)
