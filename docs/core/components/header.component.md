---
Title: Header component
Added: v2.5.0
Status: Active
Last reviewed: 2018-11-20
---

# [Header component](../../../lib/core/layout/components/header/header.component.ts "Defined in header.component.ts")

Reusable header for Alfresco applications.

## Basic usage

```html
<adf-layout-header 
    title="title" 
    logo="logo.png" 
    [redirectUrl]="'/home'"
    color="primary"
    (toggled)=toggleMenu($event)>
</adf-layout-header>
```

### [Transclusions](../../user-guide/transclusion.md)

The right-hand side of the header has free-form content that you supply in the
body of the element:

```html
<adf-layout-header>
    <div>Optional content for right-hand side</div>
</adf-layout-header>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| color | `string` |  | Background color for the header. It can be any hex color code or one of the Material theme colors: 'primary', 'accent' or 'warn'. |
| expandedSidenav | `boolean` | true | expandedSidenav: Toggles the expanded state of the component. |
| logo | `string` |  | Path to an image file for the application logo. |
| position | `string` | "start" | The side of the page that the drawer is attached to (can be 'start' or 'end') |
| redirectUrl | `string \| any[]` | "/" | The router link for the application logo, when clicked. |
| showSidenavToggle | `boolean` | true | Toggles whether the sidenav button will be displayed in the header or not. |
| title | `string` |  | Title of the application. |
| tooltip | `string` |  | The tooltip text for the application logo. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| clicked | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>` | Emitted when the sidenav button is clicked. |

## Details

This component displays a customizable header that can be reused. Use the input properties to
configure the left side (title, button) and the primary color of the header. The right part of the
header can contain other components which are transcluded in the header component.
