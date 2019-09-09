---
Title: About Application Modules Component
Added: v1.0.0
Status: Experimental
Last reviewed: 2019-09-09
---

# [About Application Modules Component](../../../lib/core/about/about-application-modules/about-application-modules.component.ts "Defined in about-application-modules.component.ts")

Shows which ADF libraries your application is using.
Shows which Plugins your application is using.

## Basic Usage

With default input values

```html
<adf-about-application-modules></adf-about-application-modules>
```

With custom input values:

```html
<adf-about-application-modules
    [dependencies]="dependencies"
    [showExtensions]="true"
    [regexp]="^(@alfresco)">
</adf-about-application-modules>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| dependencies | `any` |  | dependencies defined in the package.json |
| showExtensions | `boolean` | true | Toggles showing/hiding of extensions block. |
| regexp | `string` | "^(@alfresco)" | Regular expression for filtering dependencies packages. |

## Details

Use this component to get an overview of the dependencies and the plugins used by the application you are running.
