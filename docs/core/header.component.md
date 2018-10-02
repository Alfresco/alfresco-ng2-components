---
Added: v2.5.0
Status: Experimental
Last reviewed: 2018-08-07
---

# Header component 

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

### [Transclusions](../user-guide/transclusion.md)

The right-hand side of the header has free-form content that you supply in the
body of the element:

```html
<adf-layout-header>
    <div>Optional content for right-hand side</div>
</adf-layout-header>
```


## Class members

### Properties

| Name | Type | Description |
| -- | -- | -- |
| title | `string` |  Title of the application
| logo | `string` | Path to an image file for the application logo.
| redirectUrl | `string` \| `any[]` | The router link for the application logo.
| tooltip | `string` | The tooltip text for the application logo.
| color | `string` | Background color for the header. It can be any hex color code or the Material theme colors: 'primary', 'accent' or 'warn'.
| showSidenavToggle | `boolean` | Signals if the sidenav button will be displayed in the header or not. By default is true.
| position | `string` | 'start' | The side that the drawer is attached to 'start' or 'end' page |

### Events

| Name | Type | Description |
| -- | -- | -- |
| clicked | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>` | Emitted when click on sidenav button

## Details

This component displays a customizable header that can be reused. Use the input properties to
configure the left side (title, button) and the primary color of the header. The right part of the
header can contain other components which are transcluded in the header component. 
