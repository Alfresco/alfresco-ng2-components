---
Title: Copy content tooltip
Added: v2.2.0
Status: Active
Last reviewed: 2019-03-21
---

# [Copy Content Tooltip directive](../../../lib/content-services/directives/copy-content-tooltip.directive.ts "Defined in copy-content-tooltip.directive.ts")

Copy datatable content cell

## Basic Usage

```html
<span adf-copy-content-tooltip [text]="copy text">
    text to copy
</span>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| text | `String` | `undefined`  |  Text to be copied into the clipboard |

## Details

When the user hover the directive element a tooltip will show up to inform that when you click on the current element, the content will be copied into the clipboard.
