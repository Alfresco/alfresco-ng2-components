---
Title: Search widget interface
Added: v2.4.0
Status: Active
Last reviewed: 2018-06-12
---

# [Search widget interface](../../../lib/content-services/src/lib/search/search-widget.interface.ts "Defined in search-widget.interface.ts")

Specifies required properties for [Search filter component](../components/search-filter.component.md) widgets.

## Contents

*   [Basic usage](#basic-usage)
    *   [Properties](#properties)
*   [Details](#details)
    *   [Implementing a custom widget](#implementing-a-custom-widget)
    *   [Reading external settings](#reading-external-settings)
    *   [Updating the final query](#updating-the-final-query)
    *   [Registering a custom widget](#registering-a-custom-widget)
*   [See also](#see-also)

## Basic usage

```ts
export interface SearchWidget {
    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
}
```

### Properties

| Name     | Type                                                                                                       | Default value | Description                                                                                                      |
| -------- | ---------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| id       | `string`                                                                                                   |               | Unique identifying value for the [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts)        |
| settings | [`SearchWidgetSettings`](../../../lib/content-services/src/lib/search/search-widget-settings.interface.ts) |               | Settings for component properties                                                                                |
| context  | [`SearchQueryBuilderService`](../../content-services/services/search-query-builder.service.md)             |               | Instance of the [Search Query Builder service](../services/search-query-builder.service.md) to process the query |

## Details

The [Search Filter component](../components/search-filter.component.md) uses widgets to provide the UI that lets the user customize the
search. ADF provides a number of widgets out of the box (see the [See Also](#see-also) section
for a full list) but you can also implement your own. Both built-in and custom widgets must
implement the [Search Widget](../../../lib/content-services/search/search-widget.interface.ts) interface to operate with the [Search Filter component](../components/search-filter.component.md).

### Implementing a custom widget

To create a custom Search Filter [widget,](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) start by generating a blank Angular component
that implements the
[`SearchWidget`](../../../lib/content-services/src/lib/search/search-widget.interface.ts)
interface:

```ts
export interface SearchWidget {
    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
}
```

Every [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) implementation must have an `id`, and may also support external `settings`.
At runtime, every time a new instance of the [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) is created, it also receives a reference to the [Search Query Builder Service](../services/search-query-builder.service.md)
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

At runtime, ADF provides every search filter [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) with a `settings` instance,
based on the JSON data that the administrator has provided for your [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) in the
`app.config.json` file.

It is your responsibility to parse the `settings` property values and also to
convert types and set up defaults as necessary. ADF does not provide any validation
of the objects. It only reads from the configuration and passes the data to your component
instance.

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

### Updating the final query

The [Search Query Builder Service](../services/search-query-builder.service.md) keeps track of all query fragments that have been added by search widgets.
When the query is complete, it composes the fragments together alongside other settings
that will be used when performing the actual query.

Every query fragment is stored and retrieved using its [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) `id`.
It is your responsibility to format the query correctly.

Once your change to the query is finished, update the context and call the `update` method
to inform other components about the change:

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

### Registering a custom widget

You must register your custom widgets with the [Search Filter service](../services/search-filter.service.md):

```ts
import { MyComponent } from './my-component.ts'

@Component({...})
export class MyAppOrComponent {

    constructor(searchFilterService: SearchFilterService) {
        searchFilterService.widgets['my-widget'] = MyComponent;
    }

}
```

When you have done this, you can declare your [widget](../../../lib/testing/src/lib/core/pages/form/widgets/widget.ts) in `app.config.json`
and pass custom attributes, if your component supports them:

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

*   [Search filter component](../components/search-filter.component.md)
*   [Search check list component](../components/search-check-list.component.md)
*   [Search date range component](../components/search-date-range.component.md)
*   [Search number range component](../components/search-number-range.component.md)
*   [Search radio component](../components/search-radio.component.md)
*   [Search slider component](../components/search-slider.component.md)
*   [Search text component](../components/search-text.component.md)
