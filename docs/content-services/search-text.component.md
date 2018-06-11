---
Added: v2.4.0
Status: Active
Last reviewed: 2018-06-11
---

# Search text component 

Implements a text input widget for the Search Filter component.

![Text Widget](../docassets/images/search-text.png)

## Basic usage

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

### Settings

| Name | Type | Description |
| ---- | ---- | ----------- |
| field | string | Field to apply the query fragment to. Required value |
| pattern | string | Regular expression pattern to restrict the format of the input text |
| placeholder | string | Text displayed in the widget when the input string is empty |


## Details

This component lets the user add a text value to search for in the specified
`field`. See the Search filter component for full
details of how to use widgets in a search query.

## See also

- Search filter component
- Search check list component
- Search date range component
- Search number range component
- Search radio component
- Search slider component
