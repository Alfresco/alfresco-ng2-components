---
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# Text Highlight pipe

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
[Highlight Transform service](highlight-transform.service.md) for more information about how
this is implemented). The parameter can contain spaces, in which case each separate "word" in the string will be highlighted individually.

## See also

-   [Highlight directive](highlight.directive.md)
-   [Highlight transform service](highlight-transform.service.md)
