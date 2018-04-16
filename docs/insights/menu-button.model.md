---
Added: v2.0.0
Status: Active
---
# Menu Button Model

Model for the buttons in [ButtonsMenu](..) component

## Basic Usage

This model defines the buttons declared in the Buttons Menu Component

```ts
export type VisibiltyFunction = (obj?: any) => boolean;
const defaultValidation = () => true;

export class MenuButton {
    label: string;
    icon: string;
    handler: any;
    styles: string;
    id: string;
    isVisible: VisibiltyFunction;

    constructor(obj?: any) {
        this.label = obj.label;
        this.icon = obj.icon;
        this.handler = obj.handler;
        this.styles = obj.styles || null;
        this.id = obj.id || null;
        this.isVisible = obj.isVisible ? obj.isVisible : defaultValidation;
    }
}
```


### Properties

| Name | Type | Description |
| --- | --- | -- |
| label | `string` | Label to display for the button. |
| icon | `string` | Icon to display for the button. |
| handler | `function` | Callback for the event handler once the button is clicked. |
| styles | `string` | Classes to apply to the button. |
| id | `string` | Id of the button. |
| isVisible | `function` | Variable to define if button is visible or hidden. This function must return a boolean parameter. For instance, if it returns true the button will be visible. If it returns false the button will be hiden. |

## See also

-   [Buttons Menu Component](./buttons-menu.component.md)




