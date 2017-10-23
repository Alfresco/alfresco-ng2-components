# Text Highlight pipe

Adds highlighting to words or sections of text that match a search string.

## Basic Usage

```HTML
<div>
    Some rude words have been detected in your summary: { summary | highlight:rudeWordList }
</div>
```

## Details

The pipe's parameter is a string to search for in the text. Any occurrences of the string will
be highlighted with added HTML (see the
[Highlight Transform service](highlight-transform.service.md) for more information about how
this is implemented). The parameter can contain spaces, in which case each separate "word" in the string will be highlighted individually.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Highlight directive](highlight.directive.md)
- [Highlight transform service](highlight-transform.service.md)
<!-- seealso end -->