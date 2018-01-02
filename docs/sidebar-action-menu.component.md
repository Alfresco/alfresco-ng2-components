# Sidebar action menu component

Displays a sidebar-action information panel.

![Sidebar action menu screenshot](docassets/images/infodrawerlayout.png)

## Basic usage

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

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| title | string | null | The title of the Sidebar action |
| expanded | boolean | false | Toggle the sidebar action menu on expand.
## Details

As the name suggests, this is basically just a layout with CSS styling. There are three regions where you can add your own content, as shown in the example:

- sidebar-menu-title-icon
- sidebar-menu-options
- sidebar-menu-expand-icon

