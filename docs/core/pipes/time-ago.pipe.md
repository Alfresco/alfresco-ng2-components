---
Title: Time Ago pipe
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [Time Ago pipe](../../../lib/core/src/lib/pipes/time-ago.pipe.ts "Defined in time-ago.pipe.ts")

Converts a recent past date into a number of days ago.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    Last modified: {{ date | adfTimeAgo }}
</div>
```

<!-- {% endraw %} -->

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| locale | string | 'en-US' | A locale id for the locale format rules to use. |

## Details

The pipe finds the difference between the input date and the current date. If it
is less than seven days then then the date will be formatted as "X days ago".
Otherwise, the usual full date format is used.

By default, it localizes the date to the language that is currently in use by the app. Furthermore, a different locale id can be passed to the pipe to overwrite the locale id to set a custom one.
