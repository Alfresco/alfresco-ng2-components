---
Title: User Initial pipe
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-12
---

# [User Initial pipe](../../../lib/core/src/lib/pipes/user-initial.pipe.ts "Defined in user-initial.pipe.ts")

Takes the name fields of a [`UserProcessModel`](../../core/models/user-process.model.md) object and extracts and formats the initials.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    Project Leader: {{ user | usernameInitials:"initialsClass" }}
</div>
```

<!-- {% endraw %} -->

## Details

The pipe gets the initial characters of the user's first and last names and
concatenates them. The results are returned in an HTML &lt;div> element.

The first pipe parameter specifies an optional CSS class to add to the &lt;div>
element (eg, a background color is commonly used to emphasise initials). The
second parameter is an optional delimiter to add between the initials.
Both parameters default to empty strings.

## See also

-   [Full name pipe](full-name.pipe.md)
