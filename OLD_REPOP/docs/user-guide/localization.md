### Localization in ADF

Localization is the process of making something local in character or restricting it to a particular place. 

Dates are not written the same around the world. That is where localizing a date comes in handy. ADF lets you dynamically change the way dates are written in your app so that they can adapt to to a specific region.

## Setting up the configuration in your app

You can overwrite the default values of this pipe by adding these properties to your `app.config.json`:

```json
 "dateValues": {
   "defaultDateFormat": "mediumDate",
   "defaultDateTimeFormat": "MMM d, y, h:mm",
   "defaultLocale": "en-US"
 }
```

| Name | Type | Description |
| ---- | ---- | ----------- |
| defaultDateFormat | string | The format to apply to date values |
| defaultDateTimeFormat | string | The format to apply to date-time values |
| defaultLocale | string | The locale id to apply |

This configuration overwrites the values in the [localized date pipe](../core/pipes/localized-date.pipe.md) as well as other components to have more consistency across your app. However, you can still overwrite these values any time by using the pipe in your code. 

## Adding language support

Date values are also localized in your ADF app. By default they are localized to en-US, although you can easily change this by adding the localization files provided by Angular.

If you want to use a different locale simply add the locale file for your region in your `app.module.ts`.

<!-- {% raw %} -->

    import { registerLocaleData } from '@angular/common';
    import localeFr from '@angular/common/locales/fr';

    registerLocaleData(localeFr);

<!-- {% endraw %} -->

## Using the localized date pipe

Converts a date to a given format and locale.

<!-- {% raw %} -->

    {{ date | adfLocalizedDate: format : locale }}

<!-- {% endraw %} -->

Usage of the [localized date pipe](../core/pipes/localized-date.pipe.md).

## Using the time ago pipe

Converts a recent past date into a number of days ago.

<!-- {% raw %} -->

    {{ date | adfTimeAgo }}

<!-- {% endraw %} -->

Usage of the [time ago pipe](../core/pipes/time-ago.pipe.md).

## Using the decimal number pipe

Localizes the punctuation marks of a given number.

<!-- {% raw %} -->

    {{ number | adfDecimalNumber }}

<!-- {% endraw %} -->

`Input:` 1999.12
`Output (english locale):` 1,999.12
`Output (italian locale):` 1.999,12

Usage of the [decimal number pipe](../core/pipes/decimal-number.pipe.md).

Find more info about localization in the [Angular Docs](https://angular.io/guide/i18n#setting-up-the-locale-of-your-app).
