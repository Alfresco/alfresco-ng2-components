---
Title: About Component
Added: v2.4.0
Status: Experimental
Last reviewed: 2019-03-19
---

# [About Component](../../../lib/core/about/about.component.ts "Defined in about.component.ts")

Shows a general version and status overview of the installed ADF library.

## Basic Usage

With default input values

```html
<adf-about></adf-about>
```

With custom input values:

```html
<adf-about
    githubUrlCommitAlpha="https://github.com/Alfresco/alfresco-ng2-components/commits/"
    showExtensions="false"
    regexp="^(@alfresco)"
></adf-about>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| githubUrlCommitAlpha | `string` |  | Commit corresponding to the version of ADF to be used. |
| regexp | `string` | "^(@alfresco)" | Regular expression for filtering dependencies packages. |
| showExtensions | `boolean` | true | Toggles showing/hiding of extensions block. |

## Details

Use this component to get a general overview of the version of ADF installed and the status of the [Content service](../services/content.service.md) and [Process service](../../process-services/services/process.service.md).

Note that at the moment this component is mostly for internal use and it requires you to:

-   create a version file : `npm list --depth=0 --json=true --prod=true > versions.json`
-   provide this version file in the `dist` folder
