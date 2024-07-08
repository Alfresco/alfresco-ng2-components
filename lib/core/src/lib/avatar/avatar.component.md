# Avatar Component

`standalone`, `component`

The Avatar component is a simple component that can be used to display user avatars.

## Usage

Displaying an avatar with an image and initials fallback:

```html
<adf-avatar
    size="32px"
    src="https://avatars.githubusercontent.com/u/503991?v=4&size=64"
    initials="DV"
    tooltip="Denys Vuika"
>
</adf-avatar>
```

Integrating with context menu:

```html
<adf-avatar
    size="32px"
    src="https://avatars.githubusercontent.com/u/503991?v=4&size=64"
    initials="DV"
    tooltip="Denys Vuika"
    cursor="pointer"
    [matMenuTriggerFor]="userMenu">
</adf-avatar>

<mat-menu #userMenu="matMenu">
    <button mat-menu-item>Item 1</button>
    <button mat-menu-item>Item 2</button>
</mat-menu>
```

## API

Import the following standalone components:

```typescript
import { AvatarComponent } from '@alfresco/adf-core';
```

## Properties

| Name       | Type   | Default | Description                                            |
|------------|--------|---------|--------------------------------------------------------|
| `size`     | string | `32px`  | The size of the avatar.                                |
| `src`      | string |         | The URL of the image to display.                       |
| `initials` | string |         | The initials to display if the image is not available. |
| `tooltip`  | string |         | The tooltip to display when hovering over the avatar.  |
| `cursor`   | string | `auto`  | The cursor style.                                      |

## Theming

The following CSS classes are available for theming:

| Name                | Description        |
|---------------------|--------------------|
| `adf-avatar`        | The host element.  |
| `adf-avatar__image` | The image element. |

### CSS Variables

| Name                            | Default   | Description                         |
|---------------------------------|-----------|-------------------------------------|
| `--adf-avatar-size`             | `32px`    | The size of the avatar.             |
| `--adf-avatar-border-radius`    | `50%`     | The border radius of the avatar.    |
| `--adf-avatar-background-color` | `#f3f3f3` | The background color of the avatar. |
| `--adf-avatar-color`            | `#333`    | The text color of the initials.     |
| `--adf-avatar-font-size`        | `16px`    | The font size of the initials.      |
| `--adf-avatar-font-weight`      | `400`     | The font weight of the initials.    |
| `--adf-avatar-cursor`           | `auto`    | The cursor style.                   |
```
