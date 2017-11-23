# InfoDrawer component

Displays a sidebar-style information panel with tabs.

![Info drawer screenshot](docassets/images/activities-infodrawer.png)

## Basic usage

```html
<adf-info-drawer title="Activities" (currentTab)="getActiveTab($event)">
    <div info-drawer-buttons>
        <mat-icon (click)="close()">clear</mat-icon>
    </div>

    <adf-info-drawer-tab label="Activity">
        <mycomponent1></mycomponent1>
        <mycomponent2></mycomponent2>
    </adf-info-drawer-tab>

    <adf-info-drawer-tab label="Details">
        <mycomponent3></mycomponent3>
    </adf-info-drawer-tab>

</adf-info-drawer>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| title | string | null | The title of the info drawer |
| currentTab | any | null | The currently active tab |

## Details

This is a variant of the [Info Drawer Layout component](info-drawer-layout.component.md) that displays information in tabs. You can use the `adf-info-drawer-tab` subcomponent to add tabs (as shown in the example) and the `currentTab` output property to select the currently active tab.

You can also customize the three regions (title, buttons and content) as with the Info Drawer Layout component.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Info drawer layout component](info-drawer-layout.component.md)
<!-- seealso end -->
