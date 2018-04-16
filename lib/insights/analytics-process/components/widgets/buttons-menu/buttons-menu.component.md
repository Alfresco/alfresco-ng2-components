---
Added: v2.0.0
Status: Active
---
# Buttons Menu Component

Displays buttons on a responsive menu

## Basic Usage

This component shows buttons on a responsive menu that changes depending on the device's screen.

```html
<adf-buttons-action-menu
    [buttons]="buttons">
</adf-buttons-action-menu>  
```
You will need to declare all the buttons you want to have inside your menu in the parent component. 

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
                isVisible: this.isFormValid.bind(this)
            }),
            new MenuButton({
                label: 'Save',
                icon: 'save',
                handler: this.saveItem.bind(this),
                id: 'save-button',
                isVisible: this.isFormValid.bind(this)
            })
        ];
```


### Properties

| Name | Type | Description |
| --- | --- | -- |
| buttons | [MenuButton]() | The array that contains all the buttons for the menu |

## Details

You can automatically show/hide a button using the the isVisible property in out MenuButton Model

![adf-buttons-menu-desktop](../docassets/images/adf-buttons-menu-desktop.png)

![adf-buttons-menu-mobile](../docassets/images/adf-buttons-menu-mobile.png)

## See also

-   [MenuButton](menu-button-model.md)

