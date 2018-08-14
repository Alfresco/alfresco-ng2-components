---
Added: v2.0.0
Status: Active
Last reviewed: 2018-06-08
---

# Toolbar Component

Simple container for headers, titles, actions and breadcrumbs.

![](../docassets/images/adf-toolbar-01.png)

## Contents

-   [Basic Usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
-   [Details](#details)
    -   [Custom title](#custom-title)
    -   [Divider](#divider)
    -   [Spacer](#spacer)
    -   [Dropdown menu](#dropdown-menu)
    -   [Custom color](#custom-color)
-   [See also](#see-also)

## Basic Usage

```html
<adf-toolbar title="Toolbar">
    <button mat-icon-button>
        <mat-icon>create_new_folder</mat-icon>
    </button>
    <button mat-icon-button>
        <mat-icon>delete</mat-icon>
    </button>
</adf-toolbar>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| color | `string` |  | Toolbar color. Can be changed to empty value (default), `primary`, `accent` or `warn`. |
| title | `string` | "" | Toolbar title. |

## Details

### Custom title

You can use any HTML layout or Angular component as the content of the title section by
using the `<adf-toolbar-title>` subcomponent instead of the "title" attribute:

```html
<adf-toolbar>
    <adf-toolbar-title>
        <adf-breadcrumb ...></adf-breadcrumb>
    </adf-toolbar-title>
    ...
</adf-toolbar>
```

![](../docassets/images/adf-toolbar-02.png)

### Divider

You can divide groups of elements with a visual separator `<adf-toolbar-divider>`:

```html
<adf-toolbar>
    <button></button>
    <button></button>
    <adf-toolbar-divider></adf-toolbar-divider>
    <button></button>
</adf-toolbar>
```

### Spacer

You can split the toolbar into separate sections at the left and right of the screen
with the `adf-toolbar--spacer` CSS class. In the following example, the toolbar title
element is rendered to the left but all the buttons are pushed to the right side:

```html
<adf-toolbar>
    <adf-toolbar-title>
        ...
    <adf-toolbar-title>
    
    <div class="adf-toolbar--spacer"></div>

    <button></button>
    <adf-toolbar-divider></adf-toolbar-divider>
    <button></button>
</adf-toolbar>
```

### Dropdown menu

The following example shows how to create a dropdown menu. The code is based
on the `<mat-menu>` component from the `@angular/material` library
but you could also use your own custom menu components:

```html
<adf-toolbar title="Toolbar">
    ...

    <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon>more_vert</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
        <button mat-menu-item>
            <mat-icon>dialpad</mat-icon>
            <span>Redial</span>
        </button>
        <button mat-menu-item disabled>
            <mat-icon>voicemail</mat-icon>
            <span>Check voicemail</span>
        </button>
        <button mat-menu-item>
            <mat-icon>notifications_off</mat-icon>
            <span>Disable alerts</span>
        </button>
    </mat-menu>
</adf-toolbar>
```

![](../docassets/images/adf-toolbar-03.png)

With the menu set up like this, you would see the following menu items as defined earlier
when you click the menu button:

![](../docassets/images/adf-toolbar-04.png)

### Custom color

Besides the default color you can use 'primary', 'accent', or 'warn' values:

You might also want to change colors to follow your application's color
[theme](../user-guide/theming.md):

For example:

![](../docassets/images/adf-toolbar-05.png)

![](../docassets/images/adf-toolbar-06.png)

![](../docassets/images/adf-toolbar-07.png)

## See also

-   [Toolbar Divider component](toolbar-divider.component.md)
-   [Toolbar Title component](toolbar-title.component.md)
