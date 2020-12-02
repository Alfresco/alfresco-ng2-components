---
Title: Clipboard directive
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-12
---

# [Clipboard directive](../../../lib/core/clipboard/clipboard.directive.ts "Defined in clipboard.directive.ts")

Copies text to the clipboard.

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
| --- | --- | --- | --- |
| message | `string` |  | Translation key or message for snackbar notification. |
| placeholder | `string` |  | Translation key or message for the tooltip. |
| target | [`HTMLInputElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)`  \|  `[`HTMLTextAreaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement) |  | Reference to the HTML element containing the text to copy. |

## Details

Clicking on the decorated element will copy the text content of that element (or the
element specified in the `target` property) to the clipboard.

Use the parameter to `adf-clipboard` to specify a tooltip message that will be shown when
the user hovers the mouse over the element. You can also provide a snackbar message in the
`clipboard-notification` property, which will appear when the copying is complete.

## See also

*   [Clipboard service](../../core/services/clipboard.service.md)
