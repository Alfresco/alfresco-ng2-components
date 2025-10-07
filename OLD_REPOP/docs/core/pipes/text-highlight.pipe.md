---
Title: Text Highlight pipe
Added: v2.0.0
Status: Active
---

# [Text Highlight pipe](../../../lib/core/src/lib/pipes/text-highlight.pipe.ts "Defined in text-highlight.pipe.ts")

Adds highlighting to words or sections of text that match a search string.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    Some rude words have been detected in your summary: {{ summary | highlight:rudeWordList }}
</div>
```

<!-- {% endraw %} -->

## Details

The pipe's parameter is a string to search for in the text. Any occurrences of the string will
be highlighted with added HTML (see the
[Highlight Transform service](../services/highlight-transform.service.md) for more information about how
this is implemented). The parameter can contain spaces, in which case each separate "word" in the string will be highlighted individually.

## See also

-   [Highlight directive](../directives/highlight.directive.md)
-   [Highlight transform service](../services/highlight-transform.service.md)
