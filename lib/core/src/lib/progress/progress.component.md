# Progress Component

`standalone`, `component`

The Progress component is a simple component that can be used to display progress bars.

## Usage

```html
<adf-progress [value]="50"></adf-progress>
```

### Variant

The progress bar supports the following variants:

- bar (default)
- spinner

```html
<adf-progress variant="bar" [value]="50"></adf-progress>
<adf-progress variant="spinner" [value]="50"></adf-progress>
```

### Mode

The progress bar supports the following modes:

- For progress spinner, the mode can be either `indeterminate` or `determinate`.
- For progress bar, the mode can be either `determinate`, `indeterminate`, `buffer`, or `query`.

> For the spinner variant, setting the mode to unsupported values will default to `indeterminate`.

Example:

```html
<adf-progress [value]="50" mode="determinate"></adf-progress>
<adf-progress [value]="50" mode="indeterminate"></adf-progress>
```

### Color

The progress bar supports the following colors:

- default
- primary
- accent
- warn

```html
<adf-progress [value]="50" color="primary"></adf-progress>
<adf-progress [value]="50" color="accent"></adf-progress>
<adf-progress [value]="50" color="warn"></adf-progress>
```

## API

Import the following standalone components:

```typescript
import { ProgressComponent } from '@alfresco/adf-core';
```

## Properties

| Name      | Type            | Default         | Description                                               |
|-----------|-----------------|-----------------|-----------------------------------------------------------|
| `variant` | ProgressVariant | `bar`           | The progress bar variant.                                 |
| `value`   | number          |                 | The value of the progress bar.                            |
| `color`   | ProgressColor   |                 | The color of the progress bar.                            |
| `mode`    | ProgressMode    | `indeterminate` | The mode of the progress bar.                             |
| `testId`  | string          |                 | The button test id (uses `data-automation-id` attribute). |

### Accessibility

The button component has been designed to be accessible. The following attributes are available:

- `ariaLabel`: The button aria label.
- `ariaHidden`: Whether the button should be hidden from the accessibility tree.
