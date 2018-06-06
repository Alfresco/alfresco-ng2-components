---
Added: v2.3.0
Status: Active
Last reviewed: 2018-04-11
---

# Sidenav Layout component

Displays the standard three-region ADF application layout.

![Sidenav on desktop](../docassets/images/sidenav-layout.png)

## Contents

-   [Basic Usage](#basic-usage)

-   [Class members](#class-members)

    -   [Properties](#properties)
    -   [Events](#events)

-   [Details](#details)

    -   [Public attributes](#public-attributes)
    -   [Events](#events-1)
    -   [Template context](#template-context)
    -   [menuOpenState$](#menuopenstate)
    -   [Preserving the menu state](#preserving-the-menu-state)

## Basic Usage

```html
<adf-sidenav-layout
    [sidenavMin]="70"
    [sidenavMax]="220"
    [stepOver]="600"
    [hideSidenav]="false"
    [expandedSidenav]="true"
    (expanded)="setState($event)">

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

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| expandedSidenav | `boolean` | true | Should the navigation region be expanded initially? |
| hideSidenav | `boolean` | false | Toggles showing/hiding the navigation region |
| sidenavMax | `number` |  | ( |
| sidenavMin | `number` |  | ( |
| stepOver | `number` |  | ( |

### Events

| Name | Type | Description |
| -- | -- | -- |
| expanded | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>` |  |

## Details

This component displays the familiar ADF layout consisting of three regions: header, navigation
and content.

The layout will select between a small screen (ie, mobile) configuration and a large screen
configuration according to the screen size in pixels (the `stepOver` property sets the
number of pixels at which the switch will occur).

The small screen layout uses the Angular Material [Sidenav component](https://material.angularjs.org/latest/api/directive/mdSidenav) which is
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

### Public attributes

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| menuOpenState$ | Observable&lt;boolean> | true | Another way to listen to menu open/closed state |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| expanded | `EventEmitter<boolean>` | Emmitted when the menu toggle and the collapsed/expanded state of the sideNav changes |

### Template context

Each template is given a context containing the following methods:

-   `toggleMenu(): void`
    Triggers menu toggling.

-   `isMenuMinimized(): boolean`
    The expanded/compact (minimized) state of the navigation. This one only makes sense in case of desktop size, when the screen size is above the value of stepOver.

### menuOpenState$

Beside the template context's **isMenuMinimized** variable, another way to listen to the component's menu's open/closed state is the menuOpenState$ observable, which is driven by a BehaviorSubject at the background. The value emitted on this observable is the opposite of the isMenuMinimized template variable.

Every time the menu state is changed, the following values are emitted:

-   true, if the menu got into opened state
-   false, if the menu git into closed state

### Preserving the menu state

It is possible to preserve the state of the menu between sessions. This require to first set a property in the appConfig.json file. 

        "sideNav" : {
            "preserveState" : true
        }

If this property is set, the collapsed/expanded state will be stored in the local storage, and it will be restored with page reload or the next time the user visits the app. 
Beside this, it is also possible to set the default value in the appConfig.json file: 

        "sideNav" : {
            "expandedSidenav" : true
        }

By default the collapsed/exapnded state should be read from the application configuration file, but only if there is no value for the collapsed/expanded state in the local storage.
