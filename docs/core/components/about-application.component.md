---
Title: About Application Modules Component
Added: v3.5.0
Status: Experimental
Last reviewed: 2019-09-09
---

# [About Application Modules Component](lib/core/src/lib/about/about-application-modules/about-application-modules.component.ts "Defined in about-application-modules.component.ts")

Shows which ADF libraries and plugins an application is using.

## Basic Usage

With default input values:

```html
<adf-about-application-modules></adf-about-application-modules>
```

With custom input values:

```html
<adf-about-application-modules
    [dependencies]="yourDependencies"
    [showExtensions]="true"
    [regexp]="^(@alfresco)">
</adf-about-application-modules>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| dependencies | `any` |  | The dependencies value defined in the package.json |
| showExtensions | `boolean` | true | Toggles showing/hiding of extensions block. |
| regexp | `string` | "^(@alfresco)" | Regular expression for filtering dependencies packages. |

## Details

Use this component to display an overview of the dependencies and plugins used by an application.
