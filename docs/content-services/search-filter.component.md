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

## Details

The component is based on dynamically created widgets to modify the resulting query and options,
and the [Search Query Builder service](search-query-builder.service.md)\` to build and execute the search queries.

Before you begin with customizations, check also the following articles:

- [Search API](https://docs.alfresco.com/5.2/concepts/search-api.html)
- [Alfresco Full Text Search Reference](https://docs.alfresco.com/5.2/concepts/rm-searchsyntax-intro.html)
- [ACS API Explorer](https://api-explorer.alfresco.com/api-explorer/#!/search/search)

### Configuration

The configuration should be provided via the `search` entry in the `app.config.json` file.

Below is an example configuration:

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

Please refer to the [schema.json](https://github.com/Alfresco/alfresco-ng2-components/blob/master/lib/core/app-config/schema.json) to get more details on available settings, values and formats.

### Extra fields and filter queries

You can explicitly define the `include` section for the query from within the application configuration file. 

```json
{
    "search": {
        "include": ["path", "allowableOperations"]
    }
}
```

In addition, it is also possible to provide a set of queries that are always executed alongside user-defined settings:

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
`options` that holds a list of items that users can select from,
and `defaults` that contains predefined sorting to use by default.

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

#### Sorting Definition Attributes

| Name | Type | Description |
| --- | --- | --- |
| key | string | Unique key to identify the entry, can also be used to map DataColumn instances. |
| label | string | Display text, can also be an i18n resource key. |
| type | string | This specifies how to order - either by using a field or based on the position of the document in the index, or by score/relevance.  |
| field | string | The name of the field. |
| ascending | boolean | The sorting order. |

See also:
* Alfresco Content Services API Reference  / Search Api / [Sort](https://docs.alfresco.com/5.2/concepts/search-api-sort.html)

### Categories

The Search Settings component and Query Builder require a `categories` section provided within the configuration.

Categories are needed to build widgets so that users can modify the search query at runtime.
Every Category can be represented by a single Angular component, which can be either a simple one or a composite one.

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

> **Important note: you need at least one category field to be provided in order to execute the query,
so that filters and selected facets are applied.**

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
| --- | --- | --- | --- |
| field | string | | This specifies the facet field. |
| mincount | number | 1 | This specifies the minimum count required for a facet field to be included in the response. The default value is 1. |
| label | string | | This specifies the label to include in place of the facet field. |
| prefix | string | | This restricts the possible constraints to only indexed values with a specified prefix. |
| limit | number | | Maximum number of results |
| pageSize | number | 5 | Display page size |
| offset | number | | Offset position |

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

## Widgets

You can use external application configuration to define a set of Angular components (aka Search Filter Widgets)
that provide extra features and/or behaviour for the Search Filter component.

The Search Filter supports the following widgets out of the box:

- Check List (`check-list`)
- Date Range (`date-range`)
- Number Range (`number-range`)
- Radio List (`radio`)
- Slider (`slider`)
- Text (`text`)

At runtime, ADF uses `selector` attribute values to map and create corresponding Angular element.

### Check List Widget

Provides you with a list of check-boxes, each backed by a particular query fragment.
You can choose a `label` (or i18n resources key) and a `value`, alongside the conditional `operator` (either `AND` or `OR`).

```json
{
    "search": {
        "categories": [
            {
                "id": "checkList",
                "name": "Check List",
                "enabled": true,
                "component": {
                    "selector": "check-list",
                    "pageSize": 5,
                    "settings": {
                        "operator": "OR",
                        "options": [
                            { "name": "Folder", "value": "TYPE:'cm:folder'" },
                            { "name": "Document", "value": "TYPE:'cm:content'" }
                        ]
                    }
                }
            }
        ]
    }
}
```

![Check List Widget](../docassets/images/search-check-list.png)

If user checks both boxes, the underlying query will get the following fragment:

```text
... (TYPE:'cm:folder' OR TYPE:'cm:content') ...
```

It is possible to set the size of the page to display items. The default size is 5.
If all items fit a single page, then a "Clear all" action button is displayed at the bottom of the widget.

In case there are more than one page three icon buttons will be displayed to allow:

- clear all values
- show more items (if applicable)
- show less items (if applicable)

### Date Range Widget

Provides ability to select a range between two Dates based on the particular `field`.

```json
{
    "search": {
        "categories": [
            {
                "id": "createdDateRange",
                "name": "Created Date (range)",
                "enabled": true,
                "component": {
                    "selector": "date-range",
                    "settings": {
                        "field": "cm:created"
                    }
                }
            }
        ]
    }
}
```

![Date Range Widget](../docassets/images/search-date-range.png)

#### Widget Settings

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| field | string | `undefined` | Field to to use. Required value |
| dateFormat | string | 'DD/MM/YYYY' | Date format. Dates used by the datepicker are Moment.js instances, so please check the documentation on [Moment](https://momentjs.com/docs/#/parsing/string-format/) so you can set your required date format. |

#### Custom date format

You can set the date range picker to work with any date format your app requires. Just set the wanted value for the 'dateFormat' like this: 
```json
{
    "search": {
        "categories": [
            {
                "id": "createdDateRange",
                "name": "Created Date (range)",
                "enabled": true,
                "component": {
                    "selector": "date-range",
                    "settings": {
                        "field": "cm:created",
                        "dateFormat": "DD-MMM-YY"
                    }
                }
            }
        ]
    }
}
```

### Number Range Widget

Provides ability to select a range between two Numbers based on the particular `field`.

```json
{
    "search": {
        "categories": [
            {
                "id": "contentSizeRange",
                "name": "Content Size (range)",
                "enabled": true,
                "component": {
                    "selector": "number-range",
                    "settings": {
                        "field": "cm:content.size",
                        "format": "[{FROM} TO {TO}]"
                    }
                }
            }
        ]
    }
}
```

![Number Range Widget](../docassets/images/search-number-range.png)

#### Widget Settings

| Name | Type | Description |
| --- | --- | --- |
| field | string | Field to to use |
| format | string | Value format. Uses string substitution to allow all sorts of [range queries](https://docs.alfresco.com/5.2/concepts/rm-searchsyntax-ranges.html). |

#### Range query format

For more details on the range search format please refer to the "[Search for ranges](https://docs.alfresco.com/5.2/concepts/rm-searchsyntax-ranges.html)" article.

The widget uses `{FROM}` and `{TO}` values together with the required target format of the query.
You can use any type of the query pattern, the widget automatically substitutes the values, for example:

```json
"settings": {
    "field": "cm:content.size",
    "format": "[{FROM} TO {TO}]"
}
```

The format above may result in the following query at runtime:

```text
cm:content.size:[0 TO 100]
```

Other format examples:

| Format | Example |
| --- | --- |
| `[{FROM} TO {TO}]` | `[0 TO 5]` |
| `<{FROM} TO {TO}]` | `<0 TO 5]` |
| `[{FROM} TO {TO}>` | `[0 TO 5>` |
| `<{FROM} TO {TO}>` | `<0 TO 5>` |

### Radio List Widget

Provides you with a list of radio-boxes, each backed by a particular query fragment.
The behaviour is very similar to those of the `check-list` except `radio` allows selecting only one item.

```json
{
    "search": {
        "categories": [
            {
                "id": "queryType",
                "name": "Type",
                "enabled": true,
                "component": {
                    "selector": "radio",
                    "settings": {
                        "field": null,
                        "pageSize": 5,
                        "options": [
                            { "name": "None", "value": "", "default": true },
                            { "name": "All", "value": "TYPE:'cm:folder' OR TYPE:'cm:content'" },
                            { "name": "Folder", "value": "TYPE:'cm:folder'" },
                            { "name": "Document", "value": "TYPE:'cm:content'" }
                        ]
                    }
                }
            }
        ]
    }
}
```

![Radio Widget](../docassets/images/search-radio.png)

It is possible to set the size of the page to display items. The default size is 5.
In case there are more than one page three icon buttons will be displayed to allow:

- show more items (if applicable)
- show less items (if applicable)

### Slider Widget

Provides ability to select a numeric range based on `min` and `max` values in the form of horizontal slider.

```json
{
    "search": {
        "categories": [
            {
                "id": "contentSize",
                "name": "Content Size",
                "enabled": true,
                "component": {
                    "selector": "slider",
                    "settings": {
                        "field": "cm:content.size",
                        "min": 0,
                        "max": 18,
                        "step": 1,
                        "thumbLabel": true
                    }
                }
            }
        ]
    }
}
```

![Slider Widget](../docassets/images/search-slider.png)

### Resetting slider value

Slider widget comes with a `Clear` button that allows users to reset selected value to the initial state.

This helps to undo changes for scenarios where minimal value (like 0 or predefined number) still should not be used in a query.
Upon clicking the `Clear` button slider will be reset to the `min` value or `0`, and underlying fragment is removed from the resulting query.

### Text Widget

```json
{
    "search": {
        "categories": [
            {
                "id": "queryName",
                "name": "Name",
                "enabled": true,
                "expanded": true,
                "component": {
                    "selector": "text",
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

![Text Widget](../docassets/images/search-text.png)

> **Important note: you need at least one category field to be provided in order to execute the query,
so that filters and selected facets are applied.**

## Custom Widgets

### Implementing custom widget

It is possible to create custom Angular components that display and/or modify resulting search query.

You start creating a Search Filter widget by generating a blank Angular component that implements `SearchWidget` interface:

```ts
export interface SearchWidget {
    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
}
```

Every widget implementation must have an `id`, and may also support external `settings`.
At runtime, every time a new instance of the widget is created, it also receives a reference to the `SearchQueryBuilderService`
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

The `SearchQueryBuilderService` keeps track on all query fragments populated by widgets
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

You can register your own Widgets by utilizing the `SearchFilterService` service:

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

- [Search Query Builder service](search-query-builder.service.md)
- [Search Chip List Component](search-chip-list.component.md)
- [Search Sorting Picker Component](search-sorting-picker.component.md)
