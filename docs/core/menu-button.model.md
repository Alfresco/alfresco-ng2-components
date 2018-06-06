---
Added: v2.4.0
Status: Active
Last reviewed: 2018-05-25
---

# Menu button model

Defines the properties for an item in a [Buttons Menu component](../core/buttons-menu.component.md).

## Basic usage

```ts
let button = new MenuButton({
    label: 'Export',
    icon: 'file_download',
    handler: this.exportItem.bind(this),
    id: 'export-button',
    isVisible: this.isItemValid.bind(this)
});
```

## Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| label | `string` | Label to display for the button. |
| icon | `string` | Icon to display for the button. |
| handler | `function` | Callback for the event handler for button clicks. |
| styles | `string` | CSS classes to apply to the button. |
| id | `string` | Id of the button. |
| isVisible | `function` | Boolean function that determines whether the button is visible (returns true) or hidden (returns false). |

## Details

An array of [`MenuButton`](../../lib/core/buttons-menu/menu-button.model.ts) instances is passed to the Button Menu component via its
`buttons` property. See the [Buttons Menu component](../core/buttons-menu.component.md) page for a code sample and
further details about setting up the menu.

## See also

-   [Buttons menu component](../core/buttons-menu.component.md)
