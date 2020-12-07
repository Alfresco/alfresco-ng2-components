---
Title: Highlight Transform service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-13
---

# [Highlight Transform service](../../../lib/core/services/highlight-transform.service.ts "Defined in highlight-transform.service.ts")

Adds HTML to a string to highlight chosen sections.

## Class members

### Methods

*   **highlight**(text: `string`, search: `string`, wrapperClass: `string` = `"adf-highlight"`): [`HighlightTransformResult`](../../../lib/core/services/highlight-transform.service.ts)<br/>
    Searches for `search` string(s) within `text` and highlights all occurrences.
    *   *text:* `string`  - Text to search within
    *   *search:* `string`  - Text pattern to search for
    *   *wrapperClass:* `string`  - CSS class used to provide highlighting style
    *   **Returns** [`HighlightTransformResult`](../../../lib/core/services/highlight-transform.service.ts) - New text along with boolean value to indicate whether anything was highlighted

## Details

A typical use case for this service is to display the results from a search engine.
An excerpt of a retrieved document can be shown with the matching search terms
highlighted to indicate where they were found.

The service works by adding HTML \<span> elements around all sections of text
that match the `search` string. You can specify multiple search strings at once by
separating them with spaces, so passing "Apple Banana Cherry" in `search` will
highlight any of those words individually. The \<span> element includes a
`class` attribute which defaults to "highlight" but you can pass any class name
you like using the `wrapperClass` parameter.

The resulting text with HTML highlighting is returned within a [`HighlightTransformResult`](../../../lib/core/services/highlight-transform.service.ts)
object:

```ts
interface HighlightTransformResult {
    text: string;
    changed: boolean;
}
```

The `changed` flag will be false if the search string was not found (ie, no highlighting
took place) and true otherwise.

## See also

*   [Text highlight pipe](../pipes/text-highlight.pipe.md)
*   [Highlight directive](../directives/highlight.directive.md)
