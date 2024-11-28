---
Title: Truncate pipe
Added: v7.0.0-alpha.7
Status: Active
Last reviewed: 2024-11-28
---

# Truncate Pipe

Truncates the text when it exceeds specified max lenght. It also appends provided ellipsis at the end of the string.

## Basic Usage

<!-- {% raw %} -->

```HTML
<div>
    {{ textToTruncate | truncate:100:'***' }}
</div>
```

<!-- {% endraw %} -->

| Name   | Type   | Default value | Description                                     |
|--------|--------|---------------|-------------------------------------------------|
| maxTextLength | `number` | 250 | Max length of the text that should be displayed prio to truncating. |
| ellipsis | `string` | `...` | String which will be appended to the text when truncating will happen. |
