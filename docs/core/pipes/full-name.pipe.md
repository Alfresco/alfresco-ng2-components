---
Title: Full name pipe
Added: v3.0.0
Status: Active
Last reviewed: 2018-11-12
---

# [Full name pipe](../../../lib/core/src/lib/pipes/full-name.pipe.ts "Defined in full-name.pipe.ts")

Joins the first and last name properties from a [`UserProcessModel`](../../core/models/user-process.model.md) object into a single string.

Optionally it can include the email of the users (if available).

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    Project Leader: {{ user | fullName }}
</div>
```

<!-- {% endraw %} -->

## Include the email of the user 

<!-- {% raw %} -->

```HTML
<div>
    Project Leader: {{ user | fullName: true }}
</div>
```

<!-- {% endraw %} -->

## Details

The pipe offers a convenient way to extract the name from a [User process model](../models/user-process.model.md) object.

If you want to include also the email of the user (when available) by default for your whole application, then you need to provide the injection token `ADF_FULL_NAME_PIPE_INCLUDE_EMAIL` in your angular application module with `true` value.

## See also

-   [User initial pipe](user-initial.pipe.md)
