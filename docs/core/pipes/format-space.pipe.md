---
Title: Format Space pipe
Added: v3.0.0
Status: Active
Last reviewed: 2018-11-27
---

# [Format Space pipe](../../../lib/core/src/lib/pipes/format-space.pipe.ts "Defined in format-space.pipe.ts")

Replaces all the white space in a string with a supplied character.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div [id]="'CHECK MY ID' | formatSpace">
    BATTLESTAR GALACTICA
</div>
```

<!-- {% endraw %} -->

## Details

The pipe replaces each run of whitespace characters in the string with a single character
(which is the underscore by default) and transforms the string to lowercase (eg, `test a pipe`
becomes `test_a_pipe`).

You can specify a different replacement character by passing it as a pipe parameter.
You can also pass `false` to the `lowercase` parameter to skip the conversion to lowercase
and just replace the whitespace.
