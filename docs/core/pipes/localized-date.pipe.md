---
Title: Localized Date pipe
Added: v3.3.0
Status: Active
---

# [Localized Date pipe](../../../lib/core/src/lib/pipes/localized-date.pipe.ts "Defined in localized-date.pipe.ts")

Converts a date to a given format and locale.

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

To localize the dates in your application, you will need to add the specific locale file for your region in order to use it. Read more about internationalization [here](https://angular.io/guide/i18n#i18n-pipes).

For example, if you want add the japanese date localization in your ADF app you can add in your `app.module.ts`:

```typescript
import { AppConfigService, TRANSLATION_PROVIDER, DebugAppConfigService, CoreModule, CoreAutomationService } from '@alfresco/adf-core';

.....
.....

import { registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';

registerLocaleData(localeJa);
```

### Default values

You can overwrite the default values of this pipe by adding these properties to your `app.config.json`:

```json
 "dateValues": {
   "defaultDateFormat": "mediumDate",
   "defaultDateTimeFormat": "MMM d, y, H:mm",
   "defaultLocale": "en-US"
 }
```

| Name | Type | Description |
| ---- | ---- | ----------- |
| defaultDateFormat | string | The format to apply to date values |
| defaultDateTimeFormat | string | The format to apply to date-time values |
| defaultLocale | string | The locale id to apply |

This configuration overwrites the values in the [localized date pipe](../../core/pipes/localized-date.pipe.md) as well as other components to have more consistency across your app. However, you can still overwrite these values any time by using the pipe in your code. 
