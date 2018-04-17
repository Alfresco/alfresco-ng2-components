---
Added: v2.3.0
Status: Active
Last reviewed: 2018-04-16
---

# Search Filter component

Represents a main container component for custom search and faceted search settings.

## Basic usage

```html
<adf-search-filter #settings></adf-search-filter>
```

## Class members

### Properties

For the property types please refer to the [Search Category interface](#categories).

| Property | Description |
| --- | --- |
| id | Unique identifier of the category. Also used to access QueryBuilder customizations for a particular widget. |
| name | Public display name for the category.  |
| enabled | Toggles category availability. Set to `false` if you want to exclude a category from processing. |
| expanded | Toggles the expanded state of the category  |
| component.selector | The id of the Angular component selector to render the Category |
| component.settings | An object containing component specific settings. Put any properties needed for the target component here. |

## Details

The component is based on dynamically created widgets to modify the resulting query and options,
and the [Search Query Builder service](search-query-builder.service.md)` to build and execute the search queries.

### Configuration

The configuration should be provided via the `search` entry in the `app.config.json` file.

Below is an example configuration:

```json
{
    "search": {
        "limits": {
            "permissionEvaluationTime": null,
            "permissionEvaluationCount": null
        },
        "filterQueries": [
            { "query": "TYPE:'cm:folder' OR TYPE:'cm:content'" },
            { "query": "NOT cm:creator:System" }
        ],
        "facetFields": {
            "facets": [
            { "field": "content.mimetype", "mincount": 1, "label": "Type" },
            { "field": "content.size", "mincount": 1, "label": "Size" },
            { "field": "creator", "mincount": 1, "label": "Creator" },
            { "field": "modifier", "mincount": 1, "label": "Modifier" }
            ]
        },
        "facetQueries": [
            { "query": "created:2018", "label": "Created This Year" },
            { "query": "content.mimetype", "label": "Type" },
            { "query": "content.size:[0 TO 10240]", "label": "Size: xtra small"},
            { "query": "content.size:[10240 TO 102400]", "label": "Size: small"},
            { "query": "content.size:[102400 TO 1048576]", "label": "Size: medium" },
            { "query": "content.size:[1048576 TO 16777216]", "label": "Size: large" },
            { "query": "content.size:[16777216 TO 134217728]", "label": "Size: xtra large" },
            { "query": "content.size:[134217728 TO MAX]", "label": "Size: XX large" }
        ],
        "query": {
            "categories": [
                {
                    "id": "queryName",
                    "name": "Name",
                    "enabled": true,
                    "expanded": true,
                    "component": {
                        "selector": "adf-search-text",
                        "settings": {
                            "pattern": "cm:name:'(.*?)'",
                            "field": "cm:name",
                            "placeholder": "Enter the name"
                        }
                    }
                }
            ]
        }
    }
}
```

### Categories

The Search Settings component and Query Builder require a `categories` section provided within the configuration.

Categories are needed to build widgets so that users can modify the search query at runtime. Every Category can be represented by a single Angular component, which can be either a simple one or a
composite one.

```ts
export interface SearchCategory {
    id: string;
    name: string;
    enabled: boolean;
    expanded: boolean;
    component: {
        selector: string;
        settings: SearchWidgetSettings;
    };
}
```

The interface above also describes entries in the `search.query.categories` section for the `app.config.json` file.

![Search Categories](../docassets/images/search-categories-01.png)

### Settings

Every use case will have a different set of settings.
For example Number editors may parse minimum and maximum values, while Text editors can support value formats or length constraints.

You can use `component.settings` to pass any information to your custom widget using the 
`SearchWidgetSettings` interface:

```ts
export interface SearchWidgetSettings {
    field: string;
    [indexer: string]: any;
}
```

## See also

- [Search Query Builder service](search-query-builder.service.md)