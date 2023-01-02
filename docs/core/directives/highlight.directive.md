---
Title: Highlight directive
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-20
---

# [Highlight directive](../../../lib/core/src/lib/directives/highlight.directive.ts "Defined in highlight.directive.ts")

Adds highlighting to selected sections of an HTML element's content.

## Basic Usage

```HTML
<div
    [adf-highlight]="dance"
    adf-highlight-selector=".highlightable"
    adf-highlight-class="greenHighlight"
>
    <div class="highlightable">You can dance if you want to</div>
</div>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| classToApply | `string` | "adf-highlight" | CSS class used to apply highlighting. |
| search | `string` | "" | Text to highlight. |
| selector | `string` | "" | Class selector for highlightable elements. |

## Details

Add `adf-highlight` with a search term to an element to highlight occurrences
of that term in its content. For example:

```HTML
<div [adf-highlight]="'dance'" adf-highlight-selector=".highlightable">
    <div class="highlightable">
        You can dance if you want to
    </div>
</div>
```

This will result in the word "dance" being highlighted. Note that you must also
specify `adf-highlight-selector`, a CSS selector that specifies which
elements can have their contents highlighted.

If the search string contain spaces then each section between the spaces will
be treated as a separate item to highlight. For example, you could use this to
highlight all occurrences of words in a list.

The highlighting works by adding an HTML &lt;span> element around the
selected text. The &lt;span> includes a CSS class; this defaults to
"adf-highlight" but you can supply your own class using the `adf-highlight-class`
property:

```HTML
<div
    [adf-highlight]="'dance'"
    adf-highlight-selector=".highlightable"
    adf-highlight-class="myGreenHighlight">
    <div class="highlightable">
        You can dance if you want to
    </div>
</div>
```

## See also

-   [Text highlight pipe](../pipes/text-highlight.pipe.md)
-   [Highlight transform service](../services/highlight-transform.service.md)
