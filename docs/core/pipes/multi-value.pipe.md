# [Multi Value Pipe](../../../lib/core/pipes/multi-value.pipe.ts "Defined in multi-value.pipe.ts")

Takes an array of strings and turns it into one string where items are separated by a separator that can be set in your `app.config.json` file.

## Basic Usage

<!-- {% raw %} -->

```json
"content-metadata": {
    "multi-value-pipe-separator" : " :) "
}
```

```HTML
<div>
    List {{ values | multiValue }}
</div>
```

<!-- {% endraw %} -->

####Result
![multi-value-pipe](../../docassets/images/multi-value.pipe.png)

## Details

The pipe gets every one of the items passed to the pipe and stringifies it adding the separator set in the configuration.

You will need to specify the separator you want to use for it to work.
