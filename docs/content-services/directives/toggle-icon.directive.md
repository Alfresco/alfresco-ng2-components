---
Title: Toggle Icon directive
Added: v2.0.0
Status: Active
Last reviewed: 2019-04-09
---

# [Toggle Icon directive](../../../lib/content-services/upload/directives/toggle-icon.directive.ts 'Defined in toggle-icon.directive.ts')

Toggle icon on mouse or keyboard event for a selectable element.

## Example Usage

```html
<button mat-icon-button adf-toggle-icon #toggle="toggleIcon">
    <mat-icon *ngIf="!toggle.isToggled">
        check_circle
    </mat-icon>

    <mat-icon *ngIf="toggle.isToggled">
        remove_circle
    </mat-icon>
    <button></button>
</button>
```

## Class members

### Properties

| Name      | Type      | Default value | Description                                     |
| --------- | --------- | ------------- | ----------------------------------------------- |
| isToggled | `boolean` | false         | Is element active by mouseenter or focus event? |
| isFocused | `boolean` | false         | Is element focused by keyboard navigation?      |
