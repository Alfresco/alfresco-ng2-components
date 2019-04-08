---
Title: Copy Clipboard directive
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-01
---

# [Clipboard directive](../../../lib/core/clipboard/clipboard.directive.ts "Defined in clipboard.directive.ts")

Copy text to clipboard

## Basic Usage

```html
<span adf-clipboard="translate_key" [clipboard-notification]="notify message">
    text to copy
</span>

<button adf-clipboard="translate_key" target="ref" [clipboard-notification]="notify message">
    Copy
</button>
```


## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| target | `HTMLElement ref` | false | HTMLElement reference |
| clipboard-notification | `string` |  | Translation key message for toast notification |

## Details

When the user hover the directive element a tooltip will will show up to inform that, when you click on the current element, the content or the reference content will be copied into the clipboard.
