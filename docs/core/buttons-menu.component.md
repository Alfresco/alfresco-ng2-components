---
Added: v2.4.0
Status: Active
Last reviewed: 2018-04-24
---

# Buttons Menu Component

Displays buttons on a responsive menu.

![adf-buttons-menu-desktop](../docassets/images/adf-buttons-menu-desktop.png)

## Basic Usage

```html
<adf-buttons-action-menu
    [buttons]="buttons">
</adf-buttons-action-menu>  
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| buttons | [`MenuButton[]`](../../lib/core/buttons-menu/menu-button.model.ts) |  | Array of buttons that defines the menu. |

## Details

This component shows buttons on a responsive menu. The display of the menu changes to fit
the screen size of the device:

Desktop view of the menu

![adf-buttons-menu-desktop](../docassets/images/adf-buttons-menu-desktop.png)

Mobile view of the menu

![adf-buttons-menu-mobile](../docassets/images/adf-buttons-menu-mobile.png)

The `buttons` property contains an array of [MenuButton](../../lib/core/buttons-menu/menu-button.model.ts) instances that define
the label and appearance of each button along with a handler function to
implement its action:

```ts
buttons: MenuButton[] = [];

 setButtons() {
        this.buttons = [
            new MenuButton({
                label: 'Settings',
                icon: 'settings',
                handler: this.settings.bind(this)
            }),
            new MenuButton({
                label: 'Delete',
                icon: 'delete',
                handler: this.deleteItem.bind(this, this.reportId),
                id: 'delete-button'
            }),
            new MenuButton({
                label: 'Export',
                icon: 'file_download',
                handler: this.exportItem.bind(this),
                id: 'export-button',
                isVisible: this.isItemValid.bind(this)
            }),
            new MenuButton({
                label: 'Save',
                icon: 'save',
                handler: this.saveItem.bind(this),
                id: 'save-button',
                isVisible: this.isItemValid.bind(this)
            })
        ];
```

## See also

-   [Menu Button Model](./menu-button.model.md)
