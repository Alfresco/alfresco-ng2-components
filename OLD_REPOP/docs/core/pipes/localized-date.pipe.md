---
Title: Localized Date pipe
Added: v3.3.0
Status: Active
---

# Localized Date Pipe

Converts a date to a given format and locale.

## Basic Usage

```HTML
<div>
    Created date: {{ date | adfLocalizedDate }}
</div>
```

### Properties

| Name   | Type   | Default value | Description                                                                                                             |
|--------|--------|---------------|-------------------------------------------------------------------------------------------------------------------------|
| format | string | 'medium'      | A format to apply to the date value. [Date Pipe Formats.](https://angular.io/api/common/DatePipe#custom-format-options) |
| locale | string | 'en-US'       | A locale id for the locale format rules to use.                                                                         |
| timezone | string |   |(optional) A timezone offset (such as `'+0430'`), or a standard UTC/GMT            |

## Details

The pipe takes a date and formats it and localizes it so the date is displayed in the proper format for the region. It uses the [Angular Date Pipe](https://angular.io/api/common/DatePipe#custom-format-options) so all the pre-defined and custom formats can be used.

To localize the dates in your application, you will need to add the specific locale file for your region in order to use it. Read more about internationalization [here](https://angular.io/guide/i18n#i18n-pipes).

For example, if you want to add the japanese date localization in your ADF app you can add in your `app.module.ts`:

```typescript
import { registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';

registerLocaleData(localeJa);
```

### Default values

You can overwrite the default values of this pipe by adding these properties to your `app.config.json`:

```json
{
    "dateValues": {
        "defaultDateFormat": "mediumDate",
        "defaultDateTimeFormat": "MMM d, y, H:mm",
        "defaultLocale": "en-US"
    }
}
```

| Name                  | Type   | Description                             |
|-----------------------|--------|-----------------------------------------|
| defaultDateFormat     | string | The format to apply to date values      |
| defaultDateTimeFormat | string | The format to apply to date-time values |
| defaultLocale         | string | The locale id to apply                  |

This configuration overwrites the values in the [localized date pipe](../../core/pipes/localized-date.pipe.md) as well as other components to have more consistency across your app. However, you can still overwrite these values any time by using the pipe in your code.


### Eliminates timezone-specific shifts

When timezone is set to UTC, it eliminates timezone-specific shifts, meaning the date will be displayed in Coordinated Universal Time (UTC) regardless of the local timezone.

Given the date `2025-01-09T00:00:00.000+0000`, if the local timezone has a negative offset like -6 hours, the local time would be `2025-01-08T18:00:00.000-0600`. Without setting the timezone to UTC, the pipe would display the date as `January 8th, 2025`, because the local time is still on the previous day.

By setting the timezone to `UTC` in the pipe, the date will be displayed as `January 9th, 2025`, because it ignores the local timezone offset and uses the UTC time instead.

Usage example:

```HTML
<!-- Local timezone with -6 offset -->
<div>
    Created date: {{ '2025-01-09T00:00:00.000+0000' | adfLocalizedDate: 'mediumDate' }}
    <!-- Output: Jan 8, 2025 (if local timezone is -6) -->
</div>

<!-- Setting timezone to UTC -->
<div>
    Created date: {{ '2025-01-09T00:00:00.000+0000' | adfLocalizedDate: 'mediumDate' : '' : 'UTC' }}
    <!-- Output: Jan 9, 2025 (UTC) -->
</div>
```

By specifying `UTC` as the timezone, the pipe ensures that the date is displayed consistently in UTC, eliminating any discrepancies caused by local timezone offsets.
