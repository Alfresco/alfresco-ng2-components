---
Title: Localized Date pipe
Added: v3.3.0
Status: Active
---

# [Localized Date pipe](../../../lib/core/pipes/localized-date.pipe.ts "Defined in localized-date.pipe.ts")

Converts a date to an given format and locale.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    Created date: {{ date | adfLocalizedDate }}
</div>
```

<!-- {% endraw %} -->

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| format | string | 'medium' | A format to apply to the date value. [Date Pipe Formats.](https://angular.io/api/common/DatePipe#custom-format-options) |
| locale | string | 'en-US' | A locale id for the locale format rules to use. |

## Details

The pipe takes a date and formats it and localizes it so the date is displayed in the proper format for the region. It uses the [Angular Date Pipe](https://angular.io/api/common/DatePipe#custom-format-options) so all the pre-defined and custom formats can be used. 

When localizing a date, you will need to add the specific locale file for your region in order to use it. Read more about internationalization [here](https://angular.io/guide/i18n#i18n-pipes).
