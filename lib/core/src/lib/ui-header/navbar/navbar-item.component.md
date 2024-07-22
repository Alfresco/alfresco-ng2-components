# Navbar Item Component

`standalone`, `component`

The Navbar Item component is a subcomponent of the [Navbar](./navbar.component.md) component, designed to represent individual navigation links or actions within the Navbar. It can be used to navigate to different sections of the application or to perform specific actions.

## Usage

Adding a navbar item to navigate to the home page:

```html
<adf-navbar-item routerLink="/home" label="Home"></adf-navbar-item>
```

Adding a navbar item that triggers an action:

```html
<adf-navbar-item (click)="doSomething()" label="Action"></adf-navbar-item>
```

## API

Import the Navbar Item component:

```typescript
import { NavbarItemComponent } from '@alfresco/adf-core';
```

## Properties

| Name         | Type     | Default | Description                                   |
|--------------|----------|---------|-----------------------------------------------|
| `label`      | `string` |         | The text label of the navbar item.            |
| `routerLink` | `string` |         | The router link the navbar item navigates to. |

## Theming

The following CSS classes are available for theming:

### CSS Classes

| Name                     | Description                                |
|--------------------------|--------------------------------------------|
| `adf-navbar-item`        | The host element for the navbar item.      |
| `adf-navbar-item-btn`    | The button element within the navbar item. |
| `adf-navbar-item-active` | The class applied to a selected item.      |

### CSS Variables

| Name                                      | Description                                          |
|-------------------------------------------|------------------------------------------------------|
| `--adf-navbar-btn-height`                 | The height of the navbar button.                     |
| `--adf-navbar-btn-background-color`       | The background color of the navbar button.           |
| `--adf-navbar-btn-font-size`              | The font size of the navbar button.                  |
| `--adf-navbar-btn-font-weight`            | The font weight of the navbar button.                |
| `--adf-navbar-btn-color`                  | The font color of the navbar button.                 |
| `--adf-navbar-btn-opacity`                | The opacity of the navbar button.                    |
| `--adf-navbar-selected-btn-border-radius` | The border radius of a selected navbar button.       |
| `--adf-navbar-selected-btn-opacity`       | The opacity of a selected navbar button.             |
| `--adf-navbar-selected-btn-border-bottom` | The border bottom style of a selected navbar button. |

# NavbarItem Interface

The `NavbarItem` interface defines the structure for items used within the Navbar component.

```typescript
export interface NavbarItem {
    label: string;
    routerLink?: string;
}
```

## Properties

| Name       | Type     | Description                                   |
|------------|----------|-----------------------------------------------|
| label      | `string` | The text label of the navbar item.            |
| routerLink | `string` | The router link the navbar item navigates to. |

## See Also

-   [Navbar component](./navbar.component.md)
-   [UI Header component](../ui-header.component.md)
