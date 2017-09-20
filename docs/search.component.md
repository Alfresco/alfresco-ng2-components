# Search Results component

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)
- [Details](#details)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic usage

```html
<adf-search 
    [searchTerm]="searchTerm">
</adf-search>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| searchTerm | string | | Search term to use when executing the search. Updating this value will run a new search and update the results  |
| rootNodeId | string | "-root-" | NodeRef or node name where the search should start. |
| resultType | string | | Node type to filter search results by, e.g. 'cm:content', 'cm:folder' if you want only the files. |
| maxResults | number  | 20 | Maximum number of results to show in the search. |
| resultSort | string  | | Criteria to sort search results by, must be one of "name" , "modifiedAt" or "createdAt" |
| navigationMode | string | "dblclick" | Event used to initiate a navigation action to a specific result, one of "click" or "dblclick" |
| navigate | boolean | true | Allow documentlist to navigate or not. For more information see documentlist component's documentation |

### Events

| Name | Description |
| --- | --- |
| preview | Emitted when user acts upon files with either single or double click (depends on `navigation-mode`), recommended for Viewer components integration  |
| nodeDbClick | Emitted when user acts upon files or folders with double click **only when `navigation-mode` is set to false**, giving more freedom then just simply previewing the file |
| resultsLoad | Emitted when search results have fully loaded |

## Details

```html
<adf-search
    [searchTerm]="searchTerm">
</adf-search>
```

Example of a component that displays search results, using the Angular2 router to supply a 'q' parameter containing the
search term. If no router is present on the page or if the router does not provide such parameter then an empty
results page will be shown.