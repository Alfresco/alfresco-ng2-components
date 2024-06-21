# Button Component

`standalone`, `component`

The Button component is a simple button that can be used to trigger actions.

## Usage

```html
<adf-button>Click me!</adf-button>
```

### Variants

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
<adf-button variant="icon">Icon</adf-button>
<adf-button variant="fab">Fab</adf-button>
<adf-button variant="mini-fab">Mini Fab</adf-button>
```

## API

```typescript
import { ButtonComponent } from '@alfresco/adf-core';
```

## Properties

| Name      | Type   | Default | Description                                                                                              |
|-----------|--------|---------|----------------------------------------------------------------------------------------------------------|
| `variant` | string | `basic` | The button variant. Possible values are `basic`, `raised`, `stroked`, `flat`, `icon`, `fab`, `mini-fab`. |
| `tooltip` | string |         | The button tooltip.                                                                                      |
