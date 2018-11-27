---
Title: Search slider component
Added: v2.4.0
Status: Active
Last reviewed: 2018-06-11
---

# Search slider component

Implements a numeric slider widget for the [Search Filter component](../content-services/search-filter.component.md).

![Slider Widget](../docassets/images/search-slider.png)

## Basic usage

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

### Settings

| Name | Type | Description |
| ---- | ---- | ----------- |
| field | string | Field to apply the query fragment to. Required value |
| min | number | Minimum numeric value at the left end of the slider |
| max | number | Maximum numeric value at the right end of the slider |
| step | number | The step between adjacent positions on the slider |
| thumbLabel | boolean | Toggles whether the "thumb" of the slider should show the current value |

## Details

This component lets the user select from a range between two predefined numbers based on the
particular `field`. See the [Search filter component](../content-services/search-filter.component.md) for full
details of how to use widgets in a search query.

### Resetting the slider value

The query fragment represented by the slider will not be added to the query until a value is
selected by the user. However, once the slider has been moved, there is no way to use it to
go back to the initial state (ie, the query fragment will be present regardless of the final
value of the slider). This can be a problem in cases where even a zero or minimum value can
affect the query.

To handle this situation, the slider comes with a `Clear` button to reset the value to the
initial state. When the user clicks this button, the slider control is set to the `min` value
or zero and the corresponsing query fragment is removed from the query.

## See also

-   [Search filter component](../content-services/search-filter.component.md)
-   [Search check list component](../content-services/search-check-list.component.md)
-   [Search date range component](../content-services/search-date-range.component.md)
-   [Search number range component](../content-services/search-number-range.component.md)
-   [Search radio component](../content-services/search-radio.component.md)
-   [Search text component](../content-services/search-text.component.md)
