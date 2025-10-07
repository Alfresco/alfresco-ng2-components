---
Title: Search Form component
Added: v4.5.0
Status: Active
Last reviewed: 2024-05-14
---

# [Search Form component](../../../lib/content-services/src/lib/search/components/search-form/search-form.component.ts "Defined in search-form.component.ts")

Implements a component consisting of a menu populated with search filter sets.

![Search Form screenshot](../../docassets/images/search-form-component.png)

## Basic usage

### In .html files
```html
<adf-search-form></adf-search-form>
```

### In app config
```json
{
  "search": [
      {
        "name": "Default", 
        ...
      }, 
      {
        "name": "Other",
        ...
      }
  ]
}
```

## Details

This component allows user to choose between search filter sets specified in configuration.

## See also

-   [Search Configuration Guide](../../user-guide/search-configuration-guide.md)
-   [Search Query Builder](../services/search-query-builder.service.md)
