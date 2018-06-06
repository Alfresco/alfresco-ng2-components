---
Added: v2.4.0
Status: Active
Last reviewed: 2018-04-24
---

# Buttons Menu Component

Displays buttons on a responsive menu. This way the html doesn't need to 

## Basic Usage

In order to use this component, you will have to place the buttons that you want to have in your menu inside this component's html tags.
They must use the following structure:

```html
<adf-buttons-action-menu>
     <button mat-menu-item (click)="showSettings()">
        <mat-icon>settings</mat-icon><span>Settings</span>
    </button>
    <button mat-menu-item (click)="delete()">
        <mat-icon>delete</mat-icon><span>Delete</span>
    </button>
</adf-buttons-action-menu>  
```

Notice that they need an icon and a label for the button inside a span tag. They also make use of the Angular material directive `mat-menu-item`.

```html
<button mat-menu-item (click)="event()">
        <mat-icon> icon </mat-icon>
        <span> label </span>
</button>
```

## Class members

### Properties

| Name | Type  | Description |
| -- | -- | -- |
| isMenuEmpty | boolean | If the menu has no buttons it won't be displayed. |
 
## Details

This component is fully responsive and it will display two different layouts regarding the screen size. 

#### Desktop View
![adf-buttons-menu-desktop](../docassets/images/adf-buttons-menu-desktop.png)
#### Mobile View
![adf-buttons-menu-mobile](../docassets/images/adf-buttons-menu-mobile.png)

