---
Title: About GitHub Link Component
Added: v3.5.0
Status: Experimental
Last reviewed: 2019-09-09
---

# [About GitHub Link Component](../../../lib/core/src/lib/about/about-github-link/about-github-link.component.ts "Defined in about-github-link.component.ts")

Shows which version of the application is running based on the latest GitHub commit, as well as the server settings for the application.

## Basic Usage

With default input values:

```html
<adf-about-github-link></adf-about-github-link>
```

With custom input values:

```html
<adf-about-github-link
    [url]=yourUrl"
    [version]="yourVersion">
</adf-about-github-link>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| url | `string` |  | The GitHub commit that corresponds to the version of ADF in use. |
| version | `string` | "3.x.x" | A number displaying the version of ADF in use. |

## Details

Use this component to display an overview of the latest GitHub commit and the server settings used by an application.
