---
Title: Decimal Number Pipe
Added: v3.4.0
Status: Active
Last reviewed: 2019-08-05
---

# [Decimal Number Pipe](../../../lib/core/src/lib/pipes/decimal-number.pipe.ts "Defined in decimal-number.pipe.ts")

Transforms a number to have a certain amount of digits in its integer part and also in its decimal part.

## Basic Usage

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| digitsInfo | [`DecimalNumberModel`](../../../lib/core/src/lib/models/decimal-number.model.ts) |  | A format to apply to the date value. [Date Pipe Formats.](https://angular.io/api/common/DatePipe#custom-format-options) |
| locale | string | 'en-US' | A locale id for the locale format rules to use. |

## Details

This pipe transforms a given number so it follows the set configuration for the pipe. You can change this configuration by changing the parameters in your `app.config.json`.

```json
"decimalValues": {
    "minIntegerDigits": 1,
    "minFractionDigits": 0,
    "maxFractionDigits": 2
  }
```

You can also overwrite this config by passing a [`DecimalNumberModel`](../../../lib/core/src/lib/models/decimal-number.model.ts) as an argument for this pipe.

The number can be also localized so it applies commas and dots in the right place depending on the locale id in use.

#### Result

```ts
decimalNumberPipe.transform(1234.567);
//Returns '1,234.57'

decimalNumberPipe.transform(1234.567, digitsConfig, "it");
//Returns '1.234,57'
```

And now with a different config:

```ts
digitsConfig = {
    minIntegerDigits: 6,
    minFractionDigits: 4,
    maxFractionDigits: 4
};

decimalNumberPipe.transform(1234.567, digitsConfig);
//Returns '001,234.5670'
```

More info: [Angular DecimalPipe](https://angular.io/api/common/DecimalPipe)
