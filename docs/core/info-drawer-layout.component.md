---
Added: v2.0.0
Status: Active
Last reviewed: 2018-06-08
---

# Info drawer layout component

Displays a sidebar-style information panel.

![Info drawer layout screenshot](../docassets/images/infodrawerlayout.png)

## Basic usage

### [Transclusions](../user-guide/transclusion.md)

There are three regions where you can add your own content using `<div>` elements
with the following names:

-   info-drawer-title
-   info-drawer-buttons
-   info-drawer-content

```html
<adf-info-drawer-layout>
    <div info-drawer-title>File info</div>

    <div info-drawer-buttons>
        <mat-icon>clear</mat-icon>
    </div>

    <div info-drawer-content>
        <mat-card>
            Lorem ipsum dolor sit amet...
        </mat-card>
    </div>
</adf-info-drawer-layout>
```

## Details

As the name suggests, this is basically just a layout with CSS styling.

See the [Info drawer layout component](../core/info-drawer-layout.component.md) for an alternative approach that uses tabs to structure the content of the info drawer.

## See also

-   [Info drawer component](info-drawer.component.md)
