---
Title: Group initial pipe
Added: v3.0.0
Status: Active
Last reviewed: 2019-01-17
---

# [Group initial pipe](../../lib/process-services-cloud/src/lib/group/pipe/group-initial.pipe.ts "Defined in group-initial.pipe.ts")

Extracts the initial character from a group name.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    Group: {{ currentGroup | groupNameInitial }}
</div>
```

<!-- {% endraw %} -->

## Details

This pipe takes a [`GroupModel`](../../lib/process-services-cloud/src/lib/group/models/group.model.ts)
object as its parameter and extracts the initial character from the `name`
property. The initial is a handy way to identify the group in lists and
other situations where there is limited screen space available.

## See also

-   [Group cloud component](../process-services-cloud/group-cloud.component.md)
