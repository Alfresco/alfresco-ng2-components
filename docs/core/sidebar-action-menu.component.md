---
Title: Sidebar action menu component
Added: v2.1.0
Status: Active
Last reviewed: 2018-11-20
---

# [Sidebar action menu component](../../lib/core/layout/components/sidebar-action/sidebar-action-menu.component.ts "Defined in sidebar-action-menu.component.ts")

Displays a sidebar-action menu information panel.

![Sidebar action menu button screenshot](https://github.com/Alfresco/alfresco-ng2-components/blob/development/docs/docassets/images/sidebar-action-menu-button.png)
![Sidebar action menu icon screenshot](https://github.com/Alfresco/alfresco-ng2-components/blob/development/docs/docassets/images/sidebar-action-menu-icon.png)

## Basic usage

### [Transclusions](../user-guide/transclusion.md)

There are three regions where you can add your own content in `<div>` elements with
the following names:

-   sidebar-menu-title-icon
-   sidebar-menu-options
-   sidebar-menu-expand-icon

```html
<adf-sidebar-action-menu>
    <mat-icon sidebar-menu-title-icon>arrow_drop_down</mat-icon>
    <div sidebar-menu-expand-icon>
        <mat-icon>queue</mat-icon>
    </div>
    <div sidebar-menu-options>
        <button mat-menu-item>
            <mat-icon>assignment</mat-icon>
            <span>Button Name</span>
        </button>
    </div>
</adf-sidebar-action-menu>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| expanded | `boolean` |  | Toggle the sidebar action menu on expand. |
| title | `string` |  | The title of the sidebar action. |
| width | `number` | 272 | Width in pixels for sidebar action menu options. |

## Details

As the name suggests, this is basically just a layout with CSS styling. 
