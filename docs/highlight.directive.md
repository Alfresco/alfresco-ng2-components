# Highlight directive

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

...will result in the word "dance" being highlighted. Note that you must also
specify `adf-highlight-selector`, a CSS selector that specifies which
elements can have their contents highlighted.

If the search string contain spaces then each section between the spaces will
be treated as a separate item to highlight. For example, you could use this to
highlight all occurrences of words in a list.

The highlighting works by adding an HTML &lt;span&gt; element around the
selected text. The &lt;span&gt; includes a CSS class; this defaults to
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

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Text highlight pipe](text-highlight.pipe.md)
- [Highlight transform service](highlight-transform.service.md)
<!-- seealso end -->