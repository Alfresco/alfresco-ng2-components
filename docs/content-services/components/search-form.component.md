---
Title: Search Form component
Added: v4.6.0
Status: Active
Last reviewed: 2021-06-11
---

# [Search Form component](../../../lib/content-services/src/lib/search/components/search-form/search-form.component.ts "Defined in search-form.component.ts")

Selecting a configuration from a set of configured options.

![Search Form screenshot](../../docassets/images/search-form-component.png)

## Basic usage

```json
{
  "search": [
    {
      "categories": [
        {
          "id": "queryName",
          "name": "Name",
          "enabled": true,
          "expanded": true,
          "component": {
            "selector": "text",
            "settings": {
              "searchPrefix": "",
              "searchSuffix": "",
              "pattern": "cm:name:'(.*?)'",
              "field": "cm:name",
              "placeholder": "Enter the name",
              "allowUpdateOnChange": true
            }
          }
        }
      ],
      "name": "ALL",
      "default": true
    },
    {
      "categories": [
        {
          "id": "queryName",
          "name": "Name",
          "enabled": true,
          "expanded": true,
          "component": {
            "selector": "text",
            "settings": {
              "searchPrefix": "",
              "searchSuffix": "",
              "pattern": "cm:name:'(.*?)'",
              "field": "cm:name",
              "placeholder": "Enter the name",
              "allowUpdateOnChange": true
            }
          }
        }
      ],
      "name": "Other"
    }
  ]
}
```


## Details

This component lets the user pick a configuration for a search.

## See also

-   [Search Query Builder](../services/search-query-builder.service.md)
