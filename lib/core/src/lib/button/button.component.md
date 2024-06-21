# Button Component

`standalone`, `component`

The Button component is a simple button that can be used to trigger actions.

## Usage

```html
<adf-button>Click me!</adf-button>
```

### Variant

The button supports the following variants:

- basic
- raised
- stroked
- flat
- icon
- fab
- mini-fab

```html
<adf-button variant="basic">Basic</adf-button>
<adf-button variant="raised">Raised</adf-button>
<adf-button variant="stroked">Stroked</adf-button>
<adf-button variant="flat">Flat</adf-button>
<adf-button variant="icon" icon="home">Icon</adf-button>
<adf-button variant="icon"><mat-icon>more_vert</mat-icon></adf-button>
<adf-button variant="fab" icon="plus_one">Fab</adf-button>
<adf-button variant="mini-fab" icon="menu">Mini Fab</adf-button>
```

### Color

The button supports the following colors:

- primary
- accent
- warn

```html
<adf-button color="primary">Primary</adf-button>
<adf-button color="accent">Accent</adf-button>
<adf-button color="warn">Warn</adf-button>
```

## API

Import the following standalone components:

```typescript
import { ButtonComponent } from '@alfresco/adf-core';
```

## Properties

| Name            | Type    | Default | Description                                                                                              |
|-----------------|---------|---------|----------------------------------------------------------------------------------------------------------|
| `id`            | string  |         | The button id.                                                                                           |
| `variant`       | string  | `basic` | The button variant. Possible values are `basic`, `raised`, `stroked`, `flat`, `icon`, `fab`, `mini-fab`. |
| `tooltip`       | string  |         | The button tooltip.                                                                                      |
| `color`         | string  |         | The button color. Possible values are `primary`, `accent`, `warn`.                                       |
| `icon`          | string  |         | The button icon.                                                                                         |
| `disableRipple` | boolean | `false` | Whether the ripple effect should be disabled.                                                            |
| `disabled`      | boolean | `false` | Whether the button should be disabled.                                                                   |
| `ariaLabel`     | string  |         | The button aria label.                                                                                   |
| `testId`        | string  |         | The button test id (uses `data-automation-id` attribute).                                                |
