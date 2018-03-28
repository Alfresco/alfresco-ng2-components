---
Added: v2.3.0
Status: Active
---
# Sidenav layout component

A generalised component to help displayig the "ADF style" application frame. The layout consists of 3 regions:

- header
- navigation
- content

The navigation (depending on the screensize) either uses the Angular Material Sidenav (on small breakpoint), or the ADF style Sidenav (on bigger breakpoint).

- For Angular Material Sidenav see examples on the Angular Material project's site.
- The ADF style Sidenav has 2 states: **expanded** and **compact**. Regardless of the state, it is always displayed on the screen, either in small width (compact) or in bigger width (expanded).

The contents of the 3 regions can be injected through Angular's template transclusion. For more details see the usage example of the components.

On desktop (above stepOver):
<img src="../docassets/images/sidenav-layout.png" width="800">

On mobile (below stepOver):
<img src="../docassets/images/sidenav-layout-mobile.png" width="800">

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

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| sidenavMin | number | - | (**required**) the compact width in pixels |
| sidenavMax | number | - | (**required**) the expanded width in pixels |
| stepOver | number | - | (**required**) The breakpoint in pixels, where to step over to mobile/desktop |
| hideSidenav | boolean | false | Hide the navigation or not |
| expandedSidenav | boolean | true | The initial (expanded/compact) state of the navigation |

## Template context

Each template is given the context containing the following methods:

### toggleMenu(): void

Trigger menu toggling
### isMenuMinimized(): boolean
The expanded/compact (minimized) state of the navigation. This one only makes sense in case of desktop size, when the screen size is above the value of stepOver.