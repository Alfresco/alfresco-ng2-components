---
Added: v2.4.0
Status: Experimental
Last reviewed: 2018-05-16
---

# About Component

This component allow you to have a general overview of the version of ADF installed and the status of the [Content service](../core/content.service.md) and [Process service](../process-services/process.service.md).

Note at the moment this component is mostly for internal use and it require:

-   create a version file : npm list --depth=0 --json=true --prod=true > versions.json
-   provide this version file in the dist folder

## Basic Usage

```html
<adf-about></adf-about>
```
