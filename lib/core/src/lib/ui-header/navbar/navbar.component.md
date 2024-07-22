# Navbar Component

`standalone`, `component`

The Navbar component is designed to provide a navigational tool for your application. It allows for the inclusion of links, buttons, and other elements to facilitate user navigation throughout the application.

## Usage

Creating a simple navbar with navigation items:

```html
<adf-navbar>
    <adf-navbar-item routerLink="/home" label="Home"></adf-navbar-item>
    <adf-navbar-item routerLink="/about" label="About"></adf-navbar-item>
    <adf-navbar-item routerLink="/contact" label="Contact"></adf-navbar-item>
</adf-navbar>
```

Integrating with a dropdown menu:

```html
<adf-navbar [items]="navbarItems"></adf-navbar>
```

## API

Import the following standalone components:

```typescript
import { NavbarComponent, NavbarItemComponent } from '@alfresco/adf-core';
```

## Properties

| Name       | Type           | Default | Description                     |
|------------|----------------|---------|---------------------------------|
| `items`    | `NavbarItem[]` | `[]`    | Items to display in the navbar. |

## Theming

The following CSS classes are available for theming:

| Name                   | Description                        |
|------------------------|------------------------------------|
| `adf-navbar`           | The host element.                  |

## See Also

-   [Navbar Item component](./navbar-item.component.md)
-   [UI Header component](../ui-header.component.md)
