---
Title: Boolean pipe
Added: v6.4.0
Status: Active
Last reviewed: 2023-10-12
---

# [Boolean pipe](../../../lib/core/src/lib/pipes/boolean.pipe.ts "Defined in boolean.pipe.ts")

Converts the received values to one of the possible strings: 'true', 'false' or ""(empty string).

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    Is available: {{ isAvailable | adfBoolean }}
</div>
```

<!-- {% endraw %} -->

## Details

This pipe is prepared for any input values. The value `'true'` will be returned if true (boolean) or 'true' (exact string) appears on the input. The situation is identical for the value `'false'` - it will be returned in the case of false(boolean) or 'false'. In other cases, we can expect an `empty string('')`.
