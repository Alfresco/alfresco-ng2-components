---
Title: Text Mask directive
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-20
---

# [Text Mask directive](../../../lib/core/src/lib/form/components/widgets/text/text-mask.component.ts "Defined in text-mask.component.ts")

Implements text field input masks.

## Basic Usage

```html
<input [textMask]="{mask: mask, isReversed: isMaskReversed}">
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| inputMask | `Function` |  | Object defining mask and "reversed" status. |

## Details

The Text Mask directive implements the "input mask" feature defined in the
Process Services form editor. The mask restricts the way that text data can
be added to the field and also adds formatting as you type. A common example of
this feature is seen in text boxes that accept credit card numbers. The number is
printed on the card as groups of four digits separated by spaces:

`1234 5678 9012 3456`

When you type into the field, you can only enter digits and spaces (spaces
are only valid if you type them in the position they occur in the mask;
otherwise, they are added automatically as you type digits). The equivalent
text mask in ADF would be:

`0000 0000 0000 0000`

### Mask format characters

The following characters have special meaning within a mask; all other characters
are included in the text as they are:

-   **"0"**: Denotes a digit
-   **"9"**: Denotes a digit that can optionally be left out
-   **"A"**: Denotes a alphanumeric character (upper- or lower-case A-Z and digits 0-9)
-   **"S"**: Denotes a alphabetic character (upper- or lower-case A-Z)
-   **"#"**: Denotes a string of zero or more digits

The mask is passed to the directive in the `mask` field of the parameter object. The
`reversed` field indicates that digits in the mask are "filled up" in
right-to-left order rather than the usual left-to-right. For example, with the
following mask:

`#0.0`

...if the user typed the digits "23" in sequence, the normal left-to-right ordering
would show

`23`

...in the textbox. To get the decimal point, the user would have to type it explicitly.
However, with reversed (right-to-left) ordering, the textbox would show

`2.3`

...and these digits would slide leftward as the user typed more.
