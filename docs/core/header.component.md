---
Added: v2.4.0
Status: Active
---

#Header component 

Reuseble header for Alfresco applications

## Basic usage
<adf-layout-header 
    title="title" 
    logo="logo.png" 
    color="primary"
    (toggled)=toggleMenu($event)>

    <app-search-bar fxFlex="0 1 auto"></app-search-bar>
    <app-theme-picker></app-theme-picker>
<adf-layout>

## Class members

### Properties
| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| title | string | | Title of the application
| logo | string| | Path to an image file for the application logo. Is optional.
| color | string | | Primary color for the header

### Events
| Name | Type | Description |
| -- | -- | -- |
| toggled | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>` | Emitted when the menu toggle 

## Details
This component displays a customizable header which can be reused. The left side of the header (title, button) and the primary color for the header can be configured via input parameters. 

The right part of the header are existing components which are transcluded in the header component. 
