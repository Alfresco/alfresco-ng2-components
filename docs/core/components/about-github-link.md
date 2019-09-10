---
Title: About Github Link Component
Added: v1.0.0
Status: Experimental
Last reviewed: 2019-09-09
---

# [About Github Link Component](../../../lib/core/about/about-github-link/about-github-link.component.ts "Defined in about-github-link.component.ts")

Shows which version of the application you are running based on the latest commit.
Shows the server settings of the application that you are running.

## Basic Usage

With default input values

```html
<adf-about-github-link></adf-about-github-link>
```

With custom input values:

```html
<adf-about-github-link
    githubUrlCommitAlpha="YourUrl"
    version="YourVersion">
</adf-about-github-link>

```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| githubUrlCommitAlpha | `string` |  | Commit corresponding to the version of ADF to be used. |
| version | `string` | "3.x.x" | Version number defining which is the version of ADF to be used |

## Details

Use this component to get an overview of the latest commit and the server settings of the application you are running.
