---
Added: v2.3.0
Status: Active
Last reviewed: 2018-04-16
---

# Search Filter component

Represents a main container component for custom search and faceted search settings.

## Contents

-   [Basic usage](#basic-usage)

-   [Details](#details)

    -   [Configuration](#configuration)
    -   [Extra fields and filter queries](#extra-fields-and-filter-queries)
    -   [Sorting](#sorting)
    -   [Categories](#categories)
    -   [Settings](#settings)
    -   [Facet Fields](#facet-fields)
    -   [Facet Queries](#facet-queries)

-   [Widgets](#widgets)

    -   [Check List Widget](#check-list-widget)
    -   [Date Range Widget](#date-range-widget)
    -   [Number Range Widget](#number-range-widget)
    -   [Radio List Widget](#radio-list-widget)
    -   [Slider Widget](#slider-widget)
    -   [Resetting slider value](#resetting-slider-value)
    -   [Text Widget](#text-widget)

-   [Custom Widgets](#custom-widgets)

    -   [Implementing custom widget](#implementing-custom-widget)
    -   [Reading external settings](#reading-external-settings)
    -   [Updating final query](#updating-final-query)
    -   [Registering custom widget](#registering-custom-widget)

-   [See also](#see-also)

## Basic usage

```html
<adf-search-filter #settings></adf-search-filter>
```

## Details

The component UI uses dynamically created widgets to specify the search query and its
options. It then uses the [Search Query Builder service](search-query-builder.service.md)
to build and execute the query.

Before you begin with customizations, check also the following articles:

-   [Search API](https://docs.alfresco.com/5.2/concepts/search-api.html)
-   [Alfresco Full Text Search Reference](https://docs.alfresco.com/5.2/concepts/rm-searchsyntax-intro.html)
-   [ACS API Explorer](https://api-explorer.alfresco.com/api-explorer/#!/search/search)

### Configuration

You can configure the component using the `search` entry in the `app.config.json` file.
A typical configuration is shown below:

```json
{
    "search": {
        "sorting": {
            "options": [
                { "key": "name", "label": "Name", "type": "FIELD", "field": "cm:name", "ascending": true },
                { "key": "content.sizeInBytes", "label": "Size", "type": "FIELD", "field": "content.size", "ascending": true },
                { "key": "description", "label": "Description", "type": "FIELD", "field": "cm:description", "ascending": true }
            ],
            "defaults": [
                { "key": "name", "type": "FIELD", "field": "cm:name", "ascending": true }
            ]
        },
        "filterQueries": [
            { "query": "TYPE:'cm:folder' OR TYPE:'cm:content'" },
            { "query": "NOT cm:creator:System" }
        ],
        "facetFields": [
            { "field": "content.mimetype", "mincount": 1, "label": "Type" },
            { "field": "content.size", "mincount": 1, "label": "Size" },
            { "field": "creator", "mincount": 1, "label": "Creator" },
            { "field": "modifier", "mincount": 1, "label": "Modifier" }
        ],
        "facetQueries": {
            "label": "My facet queries",
            "pageSize": 4,
            "queries": [
                { "query": "created:2018", "label": "Created This Year" },
                { "query": "content.mimetype", "label": "Type" },
                { "query": "content.size:[0 TO 10240]", "label": "Size: xtra small"},
                { "query": "content.size:[10240 TO 102400]", "label": "Size: small"},
                { "query": "content.size:[102400 TO 1048576]", "label": "Size: medium" },
                { "query": "content.size:[1048576 TO 16777216]", "label": "Size: large" },
                { "query": "content.size:[16777216 TO 134217728]", "label": "Size: xtra large" },
                { "query": "content.size:[134217728 TO MAX]", "label": "Size: XX large" }
            ]
        },
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
```

The
[schema.json](https://github.com/Alfresco/alfresco-ng2-components/blob/master/lib/core/app-config/schema.json)file for the app config has further details about available settings, values and formats for
the configuration options.

### Extra fields and filter queries

You can explicitly define the `include` section for the query from within the application configuration file. This array is a list of extra data fields to be added to the search
results:

```json
{
    "search": {
        "include": ["path", "allowableOperations"]
    }
}
```

You can also provide a set of queries that are always executed alongside the user-defined
settings:

```json
{
    "search": {
        "filterQueries": [
            { "query": "TYPE:'cm:folder' OR TYPE:'cm:content'" },
            { "query": "NOT cm:creator:System" }
        ]
    }
}
```

Note that the entries of the `filterQueries` array are joined using the `AND` operator. 

### Sorting

The Sorting configuration section consists of two blocks:

- `options`: a list of items that users can select from
- `defaults`: predefined sorting to use by default

```json
{
    "search": {
        "sorting": {
            "options": [
                { "key": "name", "label": "Name", "type": "FIELD", "field": "cm:name", "ascending": true },
                { "key": "content.sizeInBytes", "label": "Size", "type": "FIELD", "field": "content.size", "ascending": true },
                { "key": "description", "label": "Description", "type": "FIELD", "field": "cm:description", "ascending": true }
            ],
            "defaults": [
                { "key": "name", "type": "FIELD", "field": "cm:name", "ascending": true }
            ]
        }
    }
}
```

| Name | Type | Description |
| ---- | ---- | ----------- |
| key | string | Unique key to identify the entry. This can also be used to map DataColumn instances. |
| label | string | Display text, which can also be an [i18n resource key](../user-guide/internationalization.md). |
| type | string | This specifies how to order the results. It can be based on a field, based on the position of the document in the index, or by score/relevance. |
| field | string | The name of the field. |
| ascending | boolean | The sorting order defined as `true` for ascending order and `false` for descending order |

See the [Sort](https://docs.alfresco.com/5.2/concepts/search-api-sort.html)
element in the [ACS Search API](https://docs.alfresco.com/5.2/concepts/search-api.html)
for  

### Categories and widgets

The Search Settings component and Query Builder require a `categories` section in the
configuration.

Categories are used to configure the UI widgets that let the user edit the search query
at runtime. Every category is represented by a single Angular component, which can be
either a simple one or a composite one.

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

> **Note:** you must provide at least one category field in order to execute the query,
> so that filters and selected facets are applied.

The Search Filter supports a number of widgets out of the box, each implemented
by an ADF component. The `selector` property specifies which widget is used for
a category:

| Widget name | Selector | Description |
| -- | -- | -- |
| [Check List](search-check-list.component.md) | `check-list` | Toggles individual query fragments for the search  |
| [Date Range](search-date-range.component.md) | `date-range` | Specifies a range f dates that a field may contain |
| [Number Range](search-number-range.component.md) | `number-range` | Specifies a range of numeric values that a field may contain |
| [Radio List](search-radio.component.md) | `radio` | Selects one query fragment from a list of options |
| [Slider](search-slider.component.md) | `slider` | Selects a single numeric value in a given range that a field may contain |
| [Text](search-text.component.md) | `text` | Specifies a text value that a field may contain |

See the individual search widget pages for full details of their usage and settings.

#### Widget settings

Each type of widget has its own settings.
For example Number editors may parse minimum and maximum values, while Text editors can support value formats or length constraints.

You can use `component.settings` to pass any information to your custom widget using the 
[`SearchWidgetSettings`](../../lib/content-services/search/search-widget-settings.interface.ts) interface:

```ts
export interface SearchWidgetSettings {
    field: string;
    [indexer: string]: any;
}
```

### Facet Fields

```json
{
    "search": {
        "facetFields": [
            { "field": "content.mimetype", "mincount": 1, "label": "Type" },
            { "field": "content.size", "mincount": 1, "label": "Size" },
            { "field": "creator", "mincount": 1, "label": "Creator" },
            { "field": "modifier", "mincount": 1, "label": "Modifier" },
            { "field": "created", "mincount": 1, "label": "Created" }
        ]
    }
}
```

Every field declared within the `facetFields` group is presented by a separate collapsible category at runtime. 

By default, users see only top 5 entries. 
If there are more than 5 entries, the "Show more" button is displayed to allow displaying next block of results.

![Facet Fields](../docassets/images/search-facet-fields.png)

#### FacetField Properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| field | string |  | This specifies the facet field. |
| mincount | number | 1 | This specifies the minimum count required for a facet field to be included in the response. The default value is 1. |
| label | string |  | This specifies the label to include in place of the facet field. |
| prefix | string |  | This restricts the possible constraints to only indexed values with a specified prefix. |
| limit | number |  | Maximum number of results |
| pageSize | number | 5 | Display page size |
| offset | number |  | Offset position |

### Facet Queries

Provides a custom category based on admin-defined facet queries.

```json
{
    "search": {
        "facetQueries": {
            "label": "Facet queries",
            "pageSize": 5,
            "expanded": true,
            "queries": [
                { "query": "created:2018", "label": "Created This Year" },
                { "query": "content.mimetype", "label": "Type" },
                { "query": "content.size:[0 TO 10240]", "label": "Size: xtra small"},
                { "query": "content.size:[10240 TO 102400]", "label": "Size: small"},
                { "query": "content.size:[102400 TO 1048576]", "label": "Size: medium" },
                { "query": "content.size:[1048576 TO 16777216]", "label": "Size: large" },
                { "query": "content.size:[16777216 TO 134217728]", "label": "Size: xtra large" },
                { "query": "content.size:[134217728 TO MAX]", "label": "Size: XX large" }
            ]
        }
    }
}
```

The queries declared in the `facetQueries` are collected into a single collapsible category.
Only the queries that have 1 or more response entries are displayed at runtime.
Based on the `pageSize` value, the component provides a `Show more` button to display more items.

You can also provide a custom `label` (or i18n resource key) for the resulting collapsible category.

The `pageSize` property allows you to define the amount of results to display.
Users will see `Show more` or `Show less` buttons depending on the result set.
The default page size is `5`, it is going to be used in case you set the value to `0` or omit the value entirely.

![Facet Queries](../docassets/images/search-facet-queries.png)

## Custom Widgets

### Implementing custom widget

It is possible to create custom Angular components that display and/or modify resulting search query.

You start creating a Search Filter widget by generating a blank Angular component that implements [`SearchWidget`](../../lib/content-services/search/search-widget.interface.ts) interface:

```ts
export interface SearchWidget {
    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
}
```

Every widget implementation must have an `id`, and may also support external `settings`.
At runtime, every time a new instance of the widget is created, it also receives a reference to the [`SearchQueryBuilderService`](../content-services/search-query-builder.service.md)
so that you component can access query related information, events and methods.

```ts
@Component({...})
export class MyComponent implements SearchWidget, OnInit {

    id: string;
    settings: SearchWidgetSettings;
    context: SearchQueryBuilderService;

    key1: string;
    key2: string;
} 
```

### Reading external settings

At runtime, ADF provides every Search Filter widget with the `settings` instance, based on the JSON data
that administrator has provided for your widget in the external configuration file.

It is your responsibility to parse the `settings` property values, convert types or setup defaults.
ADF does not provide any validation of the objects, it only reads from the configuration and passes data to your component instance.

```ts
@Component({...})
export class MyComponent implements SearchWidget, OnInit {

    id: string;
    settings: SearchWidgetSettings;
    context: SearchQueryBuilderService;

    key1: string;
    key2: string;

    ngOnInit() {
        if (this.settings) {
            this.key1 = this.settings['key1'];
            this.key2 = this.settings['key2'];
        }
    }
} 
```

### Updating final query

The [`SearchQueryBuilderService`](../content-services/search-query-builder.service.md) keeps track on all query fragments populated by widgets
and composes them together alongside other settings when performing a final query.

Every query fragment is stored/retrieved using widget `id`.
It is your responsibility to format the query correctly.

Once your value is ready, update the context and run `update` method to let other components know the query has been changed:

```ts
@Component({...})
export class MyComponent implements SearchWidget, OnInit {

    ...

    onUIChanged() {
        this.context.queryFragments[this.id] = `some query`;
        this.context.update();
    }

}
```

When executed, your fragment will be injected into the resulting query based on the category order in the application configuration file.

```text
... AND (widget1) AND (some query) AND (widget2) AND ...
```

### Registering custom widget

You can register your own Widgets by utilizing the [`SearchFilterService`](../../lib/content-services/search/components/search-filter/search-filter.service.ts) service:

```ts
import { MyComponent } from './my-component.ts'

@Component({...})
export class MyAppOrComponent {

    constructor(searchFilterService: SearchFilterService) {
        searchFilterService.widgets['my-widget'] = MyComponent;
    }

}
```

That allows you to declare your widget in the external configuration 
and pass custom attributes in case your component supports them:

```json
{
    "search": {
        "categories": [
            {
                "id": "someUniqueId",
                "name": "String or i18n key",
                "enabled": true,
                "component": {
                    "selector": "my-widget",
                    "settings": {
                        "key1": "value1",
                        "key2": "value2",
                        "keyN": "valueN"
                    }
                }
            }
        ]
    }
}
```

## See also

-   [Search Query Builder service](search-query-builder.service.md)
-   [Search Chip List Component](search-chip-list.component.md)
-   [Search Sorting Picker Component](search-sorting-picker.component.md)
