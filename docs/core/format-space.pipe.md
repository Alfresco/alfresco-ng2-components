---
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# Format Space pipe

Replace all the white space in a string into a character given.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div [id]="'CHECK MY ID' | formatSpace"> 
    BATTLESTAR GALACTICA 
</div>
```

<!-- {% endraw %} -->

## Details

The pipe will replace all the white space between the string into `_` by default and will transform the string in lowercase (ex. `test a pipe` => `test_a_pipe`).
It is possible specify a different character for the replacing by passing the character you want in input.
It is possible avoid the transformation into lowercase by passing `false` for the `lowercase` option.

