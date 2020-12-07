---
Title: Clipboard service
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-12
---

# [Clipboard service](../../../lib/core/clipboard/clipboard.service.ts "Defined in clipboard.service.ts")

Copies text to the clipboard.

## Class members

### Methods

*   **copyContentToClipboard**(content: `string`, message: `string`)<br/>
    Copies a text string to the clipboard.
    *   *content:* `string`  - Text to copy
    *   *message:* `string`  - Snackbar message to alert when copying happens
*   **copyToClipboard**(target: [`HTMLInputElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)`|`[`HTMLTextAreaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement), message?: `string`)<br/>
    Copies text from an HTML element to the clipboard.
    *   *target:* [`HTMLInputElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)`|`[`HTMLTextAreaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement)  - HTML element to be copied
    *   *message:* `string`  - (Optional) Snackbar message to alert when copying happens
*   **isTargetValid**(target: [`HTMLInputElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)`|`[`HTMLTextAreaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement)): `boolean`<br/>
    Checks if the target element can have its text copied.
    *   *target:* [`HTMLInputElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)`|`[`HTMLTextAreaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement)  - Target HTML element
    *   **Returns** `boolean` - True if the text can be copied, false otherwise

## Details

Use `copyContentToClipboard` to copy a text string or `isTargetValid` and
`copyToClipboard` to copy the content of an HTML element in the page. The
`message` parameter specifies a snackbar message to alert the user when the
copying operation takes place.

## See also

*   [Clipboard directive](../../core/directives/clipboard.directive.md)
