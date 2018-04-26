---
Added: v2.4.0
Status: Active
---
# Buttons Menu Component

Displays buttons on a responsive menu.

## Basic Usage

This component shows buttons on a responsive menu that changes depending on the device's screen.

```html
<adf-buttons-action-menu
    [buttons]="buttons">
</adf-buttons-action-menu>  
```
You will need to declare all the buttons that you want to have inside your menu in the parent component. 

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

## Properties

####Buttons Menu Component

| Name | Type | Description |
| --- | --- | -- |
| buttons | `MenuButton []` | The array that contains all the buttons for the menu |

####Button Model

| Name | Type | Description |
| --- | --- | -- |
| label | `string` | Label to display for the button. |
| icon | `string` | Icon to display for the button. |
| handler | `function` | Callback for the event handler once the button is clicked. |
| styles | `string` | Classes to apply to the button. |
| id | `string` | Id of the button. |
| isVisible | `function` | Variable to define if button is visible or hidden. This function must return a boolean parameter. For instance, if it returns true the button will be visible. If it returns false the button will be hiden. |


## Details

This component uses [Angular Material](https://material.angular.io/) to style the menu.

Desktop view of the menu
![adf-buttons-menu-desktop](../docassets/images/adf-buttons-menu-desktop.png)

Mobile view of the menu
![adf-buttons-menu-mobile](../docassets/images/adf-buttons-menu-mobile.png)

Menu Button Model

## See also

-   [Menu Button Model](./menu-button.model.md)



