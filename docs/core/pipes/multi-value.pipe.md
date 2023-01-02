---
Title: Multi Value Pipe
Added: v3.2.0
Status: Active
---

# [Multi Value Pipe](../../../lib/core/src/lib/pipes/multi-value.pipe.ts "Defined in multi-value.pipe.ts")

Takes an array of strings and turns it into one string where items are separated by a separator. The default separator applied to the list is the comma `,`  however, you can set your own separator in the params of the pipe. 

## Basic Usage

<!-- {% raw %} -->

### Default separator

```HTML
<div>
    List {{ values | multiValue }}
</div>
```

#### Result

![multi-value-pipe](../../docassets/images/multi-value-default.pipe.png)

### Custom separator

```HTML
<div>
    List {{ values | multiValue: ' :) ' }}
</div>
```

<!-- {% endraw %} -->

#### Result

![multi-value-pipe](../../docassets/images/multi-value.pipe.png)

## Details

The pipe gets every one of the items passed to the pipe and stringifies it adding the separator set in the configuration.

You will need to specify the separator you want to use for it to work.
