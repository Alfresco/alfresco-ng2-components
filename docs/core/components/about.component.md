---
Title: About Component
Added: v3.5.0
Status: Active
Last reviewed: 2022-11-11
---

# [About Component](../../../lib/core/src/lib/about/about.component.ts "Defined in about.component.ts")

Presentational component to display About information as a set of collapsible panels.

## Basic Usage

```html
<adf-about>
    <adf-about-panel [label]="'Panel 1'">
        <ng-template>
            <your-components></your-components>
        </ng-template>
    </adf-about-panel>

    <adf-about-panel [label]="'Panel 2'">
        <ng-template>
            <your-components></your-components>
        </ng-template>
    </adf-about-panel>
</adf-about>
```

## Conditional Display

You can wire each panel with the `*ngIf` conditions:

```html
<adf-about>
    <adf-about-panel *ngIf="devMode" [label]="'Panel 1'">
        <ng-template>
            <your-components></your-components>
        </ng-template>
    </adf-about-panel>
</adf-about>
```

Where `devMode` is an example of an input property exposed by your component.

Observables are also supported:

```html
<adf-about>
    <adf-about-panel *ngIf="extensions$ | async as extensions" [label]="'ABOUT.PLUGINS.TITLE' | translate">
        <ng-template>
            <adf-about-extension-list [data]="extensions"></adf-about-extension-list>
        </ng-template>
    </adf-about-panel>
</adf-about>
```
