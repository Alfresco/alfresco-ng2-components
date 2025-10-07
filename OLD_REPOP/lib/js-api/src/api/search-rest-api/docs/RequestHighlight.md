# RequestHighlight

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**prefix** | **string** | The string used to mark the start of a highlight in a fragment. | [optional] [default to null]
**postfix** | **string** | The string used to mark the end of a highlight in a fragment. | [optional] [default to null]
**snippetCount** | **number** | The maximum number of distinct highlight snippets to return for each highlight field. | [optional] [default to null]
**fragmentSize** | **number** | The character length of each snippet. | [optional] [default to null]
**maxAnalyzedChars** | **number** | The number of characters to be considered for highlighting. Matches after this count will not be shown. | [optional] [default to null]
**mergeContiguous** | **boolean** | If fragments over lap they can be  merged into one larger fragment | [optional] [default to null]
**usePhraseHighlighter** | **boolean** | Should phrases be identified. | [optional] [default to null]
**fields** | [**RequestHighlightFields[]**](RequestHighlightFields.md) | The fields to highlight and field specific configuration properties for each field | [optional] [default to null]


