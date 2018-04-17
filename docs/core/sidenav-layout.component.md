---
Added: v2.3.0
Status: Active
Last reviewed: 2018-04-11
---

# Sidenav Layout component

Displays the standard three-region ADF application layout.

![Sidenav on desktop](../docassets/images/sidenav-layout.png)

## Basic Usage

```html
<adf-sidenav-layout
    [sidenavMin]="70"
    [sidenavMax]="220"
    [stepOver]="600"
    [hideSidenav]="false"
    [expandedSidenav]="true">

    <adf-sidenav-layout-header>
        <ng-template let-toggleMenu="toggleMenu">
            <div class="app-header">
                <button (click)="toggleMenu()">toggle menu</button>
            </div>
        </ng-template>
    </adf-sidenav-layout-header>

    <adf-sidenav-layout-navigation>
        <ng-template let-isMenuMinimized="isMenuMinimized">
            <div *ngIf="isMenuMinimized()" class="app-compact-navigation"></div>
            <div *ngIf="!isMenuMinimized()" class="app-expanded-navigation"></div>
        </ng-template>
    </adf-sidenav-layout-navigation>

    <adf-sidenav-layout-content>
        <ng-template>
            <router-outlet></router-outlet>
        </ng-template>
    </adf-sidenav-layout-content>

</adf-sidenav-layout>
```

## Class members

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| sidenavMin | `number` |  | (**required**) Width in pixels when compacted |
| sidenavMax | `number` |  | (**required**) Width in pixels when expanded |
| stepOver | `number` |  | (**required**) "Breakpoint" size (ie, number of pixels for selecting between mobile and desktop layouts) |
| hideSidenav | `boolean` | false | Toggles showing/hiding the navigation region |
| expandedSidenav | `boolean` | true | Should the navigation region be expanded initially? |

## Details

This component displays the familiar ADF layout consisting of three regions: header, navigation
and content.

The layout will select between a small screen (ie, mobile) configuration and a large screen
configuration according to the screen size in pixels (the `stepOver` property sets the
number of pixels at which the switch will occur).

The small screen layout uses the Angular Material
[Sidenav component](https://material.angularjs.org/latest/api/directive/mdSidenav) which is
described in detail on their website.

The ADF-style (ie, large screen) Sidenav has two states: **expanded** and **compact**.
The navigation is always displayed regardless of the state but it will have a reduced width
when compacted. Set the widths for the expanded and compact states with the `sidenavMin` and
`sidenavMax` properties.

The contents of the 3 regions can be injected through Angular's template transclusion as shown
in the usage example above.

Desktop layout (screen width greater than the `stepOver` value):
![Sidenav on desktop](../docassets/images/sidenav-layout.png)

Mobile layout (screen width less than the `stepOver` value):
![Sidenav on mobile](../docassets/images/sidenav-layout-mobile.png)

### Template context

Each template is given a context containing the following methods:

-   `toggleMenu(): void`
    Triggers menu toggling.

-   `isMenuMinimized(): boolean`
    Is the menu in minimized/compacted state? Only works for large screen layouts.