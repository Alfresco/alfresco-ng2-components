---
Title: About Component
Added: v2.4.0
Status: Experimental
Last reviewed: 2018-11-14
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
    githubUrlCommitAlpha="https://githubcom/Alfresco/alfresco-ng2-components/commits/"
    showExtensions="false"
    regexp="^(@alfresco)"
></adf-about>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| githubUrlCommitAlpha | `string` | https://githubcom/Alfresco/alfresco-ng2-components/commits/ | Version of ADF to be used |
| showExtensions | `boolean` | true | Parameter for hide or show extensions block |
| regexp | `string` | ^(@alfresco) | Regular expression for filtering dependencies packages |

## Details

Use this component to get a general overview of the version of ADF installed and the status of the [Content service](../services/content.service.md) and [Process service](../../process-services/services/process.service.md).

Note at the moment this component is mostly for internal use and it requires you to:

-   create a version file : `npm list --depth=0 --json=true --prod=true > versions.json`
-   provide this version file in the `dist` folder
